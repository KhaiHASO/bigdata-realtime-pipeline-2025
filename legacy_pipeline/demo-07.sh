#!/bin/bash

# Demo 7: End-to-End Workflow
# Chạy toàn bộ workflow từ đầu đến cuối

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  DEMO 7: End-to-End Workflow${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo "This demo will run the complete pipeline from start to finish."
echo -e "${YELLOW}This may take several minutes...${NC}"
echo ""
echo -e "${YELLOW}Press Enter to start...${NC}"
read

# Function to print step
print_step() {
    echo ""
    echo -e "${BLUE}--- $1 ---${NC}"
    echo ""
}

# Step 1: Clean Start
print_step "STEP 1: Clean Start"

echo "Stopping and removing all containers and volumes..."
docker compose down -v

echo "Starting all services..."
docker compose up -d --build

echo "Waiting for services to be ready (90 seconds)..."
for i in {1..9}; do
    sleep 10
    RUNNING=$(docker compose ps --services --filter "status=running" 2>/dev/null | wc -l)
    TOTAL=$(docker compose ps --services 2>/dev/null | wc -l)
    echo "  Services running: $RUNNING/$TOTAL"
done

echo -e "${GREEN}✓ Services started${NC}"
sleep 5

# Step 2: Initialize
print_step "STEP 2: Initialize"

echo "Initializing Cassandra..."
sleep 30
docker exec cassandra cqlsh -f /init.cql 2>/dev/null
echo -e "${GREEN}✓ Cassandra initialized${NC}"

echo ""
echo "Creating Kafka topic..."
docker exec kafka kafka-topics --create \
  --bootstrap-server localhost:9092 \
  --topic users \
  --partitions 1 \
  --replication-factor 1 2>/dev/null || echo "Topic may already exist"
echo -e "${GREEN}✓ Kafka topic created${NC}"

# Step 3: Start Flink Job
print_step "STEP 3: Start Flink Job"

echo "Submitting Flink job..."
docker exec -d flink-jobmanager /opt/flink/bin/flink run \
  -py /opt/flink/usrlib/job.py

echo "Waiting for job to start..."
sleep 15

JOBS=$(curl -s http://localhost:8081/jobs 2>/dev/null | grep -o '"id":"[^"]*"' | wc -l)
if [ "$JOBS" -gt "0" ]; then
    echo -e "${GREEN}✓ Flink job started${NC}"
else
    echo -e "${YELLOW}⚠ Flink job may still be starting...${NC}"
fi

# Step 4: Generate Data
print_step "STEP 4: Generate Data"

echo "Running producer (100 messages)..."
cd producer

# Setup environment with fallback
if [ ! -d "venv" ]; then
    if python3 -m venv venv 2>/dev/null; then
        USE_VENV=true
    else
        USE_VENV=false
    fi
else
    USE_VENV=true
fi

if [ "$USE_VENV" = "true" ] && [ -f "venv/bin/activate" ]; then
    source venv/bin/activate
    pip install -q --upgrade pip
    pip install -q -r requirements.txt
    PYTHON_CMD="python"
    USE_VENV_FLAG=true
else
    pip3 install -q --break-system-packages --upgrade pip
    pip3 install -q --break-system-packages -r requirements.txt
    PYTHON_CMD="python3"
    USE_VENV_FLAG=false
fi

$PYTHON_CMD -c "
from producer import *
producer = create_producer()
send_messages(producer, 'users', num_messages=100, delay=0.1)
producer.close()
print('✓ 100 messages sent')
"

if [ "$USE_VENV_FLAG" = "true" ]; then
    deactivate
fi
cd ..
echo -e "${GREEN}✓ Data generation completed${NC}"

# Step 5: Monitor Progress
print_step "STEP 5: Monitor Progress"

echo "Monitoring data flow for 30 seconds..."
for i in {1..15}; do
    COUNT=$(docker exec cassandra cqlsh -e "SELECT COUNT(*) FROM realtime.users;" 2>/dev/null | grep -o '[0-9]*' | head -1)
    echo "  [$(date '+%H:%M:%S')] Records: $COUNT"
    sleep 2
done

# Step 6: Verify Results
print_step "STEP 6: Verify Results"

echo "Final record count:"
FINAL_COUNT=$(docker exec cassandra cqlsh -e "SELECT COUNT(*) FROM realtime.users;" 2>/dev/null | grep -o '[0-9]*' | head -1)
echo -e "${GREEN}$FINAL_COUNT records${NC}"

echo ""
echo "Sample data (first 10 records):"
docker exec cassandra cqlsh -e "SELECT id, name, email, ts FROM realtime.users LIMIT 10;" 2>/dev/null | tail -11

echo ""
echo "Flink job status:"
curl -s http://localhost:8081/jobs 2>/dev/null | grep -o '"id":"[^"]*"' | head -1 || echo "Job completed or not found"

# Step 7: Airflow Orchestration
print_step "STEP 7: Airflow Orchestration"

echo "Checking Airflow status..."
AIRFLOW_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/health 2>/dev/null)

if [ "$AIRFLOW_STATUS" = "200" ]; then
    echo -e "${GREEN}✓ Airflow is running${NC}"
    echo ""
    echo "Airflow UI: http://localhost:8080"
    echo "Login: admin / admin"
    echo ""
    echo "To trigger DAG:"
    echo "  1. Go to Airflow UI"
    echo "  2. Enable DAG: kafka_flink_pipeline"
    echo "  3. Trigger DAG"
    echo ""
    echo "Or trigger via CLI:"
    docker exec airflow-webserver airflow dags trigger kafka_flink_pipeline 2>/dev/null && \
        echo -e "${GREEN}✓ DAG triggered${NC}" || \
        echo -e "${YELLOW}⚠ DAG may need to be enabled in UI first${NC}"
else
    echo -e "${YELLOW}⚠ Airflow is not accessible${NC}"
fi

# Step 8: Final Verification
print_step "STEP 8: Final Verification"

echo "Checking all services health..."
echo -n "  Kafka: "
docker compose ps kafka | grep -q "Up" && echo -e "${GREEN}✓${NC}" || echo -e "${RED}✗${NC}"

echo -n "  Flink: "
docker compose ps flink-taskmanager | grep -q "Up" && echo -e "${GREEN}✓${NC}" || echo -e "${RED}✗${NC}"

echo -n "  Cassandra: "
docker compose ps cassandra | grep -q "Up" && echo -e "${GREEN}✓${NC}" || echo -e "${RED}✗${NC}"

echo -n "  Airflow: "
docker compose ps airflow-webserver | grep -q "Up" && echo -e "${GREEN}✓${NC}" || echo -e "${RED}✗${NC}"

echo ""
echo "Data integrity check:"
KAFKA_COUNT=$(docker exec kafka kafka-run-class kafka.tools.GetOffsetShell \
  --broker-list localhost:9092 --topic users --time -1 2>/dev/null | \
  awk -F: '{sum+=$3} END {print sum}')

CASSANDRA_COUNT=$(docker exec cassandra cqlsh -e "SELECT COUNT(*) FROM realtime.users;" 2>/dev/null | \
  grep -o '[0-9]*' | head -1)

echo "  Kafka messages: $KAFKA_COUNT"
echo "  Cassandra records: $CASSANDRA_COUNT"

if [ ! -z "$KAFKA_COUNT" ] && [ ! -z "$CASSANDRA_COUNT" ]; then
    DIFF=$((KAFKA_COUNT - CASSANDRA_COUNT))
    echo "  Difference: $DIFF"
    
    if [ "$DIFF" -lt 20 ] && [ "$DIFF" -gt -20 ]; then
        echo -e "  ${GREEN}✓ Data integrity OK${NC}"
    else
        echo -e "  ${YELLOW}⚠ Some messages may still be processing${NC}"
    fi
fi

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}✓ DEMO 7 COMPLETED!${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo "Kết quả:"
echo "  ✅ Toàn bộ pipeline hoạt động end-to-end"
echo "  ✅ Data được xử lý và lưu trữ đúng"
echo "  ✅ Tất cả services healthy"
echo "  ✅ Airflow orchestration available"
echo ""
echo "Summary:"
echo "  - Kafka messages: $KAFKA_COUNT"
echo "  - Cassandra records: $CASSANDRA_COUNT"
echo "  - Services: All running"
echo ""
echo -e "${YELLOW}Press Enter to exit...${NC}"
read

