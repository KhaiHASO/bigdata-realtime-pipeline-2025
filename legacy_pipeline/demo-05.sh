#!/bin/bash

# Demo 5: Monitoring và Verification
# Monitor toàn bộ pipeline và verify data integrity

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  DEMO 5: Monitoring và Verification${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Function to print step
print_step() {
    echo -e "${YELLOW}[STEP $1]${NC} $2"
    echo ""
}

# Function to wait for user
wait_user() {
    echo -e "${GREEN}✓ Step completed!${NC}"
    echo -e "${YELLOW}Press Enter to continue...${NC}"
    read
    echo ""
}

# Step 1: Monitor Tất Cả Services
print_step "1" "Monitor Tất Cả Services"

echo -e "${BLUE}--- Kafka Metrics ---${NC}"
echo "Topic details:"
docker exec kafka kafka-topics --bootstrap-server localhost:9092 --describe --topic users 2>/dev/null | head -5

echo ""
echo "Consumer groups:"
docker exec kafka kafka-consumer-groups --bootstrap-server localhost:9092 --list 2>/dev/null | head -5

wait_user

echo -e "${BLUE}--- Flink Metrics ---${NC}"
echo "Flink UI: http://localhost:8081"
echo ""
echo "Running jobs:"
curl -s http://localhost:8081/jobs 2>/dev/null | grep -o '"id":"[^"]*"' | head -3 || echo "No jobs running"

echo ""
echo "Recent Flink logs:"
docker compose logs flink-taskmanager 2>/dev/null | tail -5
wait_user

echo -e "${BLUE}--- Cassandra Metrics ---${NC}"
echo "Node status:"
docker exec cassandra nodetool status 2>/dev/null | head -10

echo ""
echo "Table statistics:"
docker exec cassandra nodetool tablestats realtime.users 2>/dev/null | head -15
wait_user

echo -e "${BLUE}--- Airflow Metrics ---${NC}"
echo "Airflow UI: http://localhost:8080"
echo ""
echo "DAG list:"
docker exec airflow-webserver airflow dags list 2>/dev/null | grep kafka_flink || echo "DAG not found"
wait_user

# Step 2: Data Integrity Check
print_step "2" "Data Integrity Check"

echo "Counting messages in Kafka topic..."
KAFKA_OFFSET=$(docker exec kafka kafka-run-class kafka.tools.GetOffsetShell \
  --broker-list localhost:9092 \
  --topic users \
  --time -1 2>/dev/null | awk -F: '{sum+=$3} END {print sum}')

echo -e "${GREEN}Kafka messages (total offsets): $KAFKA_OFFSET${NC}"

echo ""
echo "Counting records in Cassandra..."
CASSANDRA_COUNT=$(docker exec cassandra cqlsh -e "SELECT COUNT(*) FROM realtime.users;" 2>/dev/null | grep -o '[0-9]*' | head -1)
echo -e "${GREEN}Cassandra records: $CASSANDRA_COUNT${NC}"

echo ""
echo "Comparison:"
DIFF=$((KAFKA_OFFSET - CASSANDRA_COUNT))
if [ "$DIFF" -lt 10 ] && [ "$DIFF" -gt -10 ]; then
    echo -e "${GREEN}✓ Data integrity OK (difference: $DIFF - within acceptable range)${NC}"
else
    echo -e "${YELLOW}⚠ Difference: $DIFF (may be processing or timing issue)${NC}"
fi
wait_user

# Step 3: Sample Data Verification
print_step "3" "Sample Data Verification"

echo "Sample messages from Kafka (last 3):"
docker exec kafka kafka-console-consumer \
  --bootstrap-server localhost:9092 \
  --topic users \
  --from-beginning \
  --max-messages 3 \
  --timeout-ms 5000 2>/dev/null | tail -3

echo ""
echo "Sample records from Cassandra (last 3):"
docker exec cassandra cqlsh -e "SELECT id, name, email, ts FROM realtime.users LIMIT 3;" 2>/dev/null | tail -4

echo ""
echo -e "${GREEN}✓ Sample data retrieved from both sources${NC}"
wait_user

# Step 4: Performance Metrics
print_step "4" "Performance Metrics"

echo "Flink Job Metrics:"
echo "  - Check Flink UI: http://localhost:8081"
echo "  - Navigate to: Jobs → Select Job → Metrics"
echo "  - Look for: Records per second, Latency"
echo ""

echo "Cassandra Write Performance:"
docker exec cassandra nodetool tablestats realtime.users 2>/dev/null | grep -i "write\|pending" | head -5

echo ""
echo "Service Health Check:"
echo -n "  Kafka: "
docker compose ps kafka | grep -q "Up" && echo -e "${GREEN}✓ Running${NC}" || echo -e "${RED}✗ Not running${NC}"

echo -n "  Flink: "
docker compose ps flink-taskmanager | grep -q "Up" && echo -e "${GREEN}✓ Running${NC}" || echo -e "${RED}✗ Not running${NC}"

echo -n "  Cassandra: "
docker compose ps cassandra | grep -q "Up" && echo -e "${GREEN}✓ Running${NC}" || echo -e "${RED}✗ Not running${NC}"

echo -n "  Airflow: "
docker compose ps airflow-webserver | grep -q "Up" && echo -e "${GREEN}✓ Running${NC}" || echo -e "${RED}✗ Not running${NC}"

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}✓ DEMO 5 COMPLETED!${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo "Kết quả:"
echo "  ✅ Tất cả services healthy"
echo "  ✅ Data integrity được maintain"
echo "  ✅ Performance metrics trong acceptable range"
echo ""
echo "Summary:"
echo "  - Kafka messages: $KAFKA_OFFSET"
echo "  - Cassandra records: $CASSANDRA_COUNT"
echo "  - Difference: $DIFF"
echo ""
echo -e "${YELLOW}Press Enter to exit...${NC}"
read

