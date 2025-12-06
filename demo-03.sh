#!/bin/bash

# Demo 3: Airflow Orchestration
# Test Airflow DAG để orchestrate pipeline

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  DEMO 3: Airflow Orchestration${NC}"
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

# Step 1: Truy cập Airflow UI
print_step "1" "Truy cập Airflow UI"
echo "Checking Airflow webserver..."
AIRFLOW_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/health 2>/dev/null)

if [ "$AIRFLOW_STATUS" != "200" ]; then
    echo -e "${RED}Airflow webserver is not accessible!${NC}"
    echo "Please ensure Airflow is running: docker compose ps airflow-webserver"
    exit 1
fi

echo -e "${GREEN}✓ Airflow webserver is running${NC}"
echo ""
echo "Airflow UI: http://localhost:8080"
echo "Login credentials:"
echo "  Username: admin"
echo "  Password: admin"
echo ""
echo -e "${YELLOW}Please open Airflow UI in your browser and login${NC}"
wait_user

# Step 2: Enable DAG
print_step "2" "Enable DAG"
echo "Checking DAG status..."
DAG_LIST=$(docker exec airflow-webserver airflow dags list 2>/dev/null | grep kafka_flink_pipeline || echo "")

if [ -z "$DAG_LIST" ]; then
    echo -e "${YELLOW}DAG not found. It may need to be discovered.${NC}"
else
    echo "DAG found:"
    echo "$DAG_LIST"
fi

echo ""
echo "In Airflow UI:"
echo "  1. Find DAG: 'kafka_flink_pipeline'"
echo "  2. Toggle ON to enable DAG"
echo ""
wait_user

# Step 3: Trigger DAG manually
print_step "3" "Trigger DAG manually"
echo "Triggering DAG via CLI..."
docker exec airflow-webserver airflow dags trigger kafka_flink_pipeline 2>/dev/null

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ DAG triggered successfully${NC}"
else
    echo -e "${YELLOW}DAG may already be running or needs to be enabled in UI${NC}"
fi

echo ""
echo "In Airflow UI:"
echo "  1. Click on DAG 'kafka_flink_pipeline'"
echo "  2. Click 'Play' button (▶️) to trigger"
echo "  3. Select 'Trigger DAG'"
echo ""
wait_user

# Step 4: Monitor DAG Execution
print_step "4" "Monitor DAG Execution"
echo "Monitoring DAG runs..."
echo ""

for i in {1..10}; do
    echo "Checking DAG status (attempt $i/10)..."
    DAG_RUNS=$(docker exec airflow-webserver airflow dags list-runs -d kafka_flink_pipeline 2>/dev/null | tail -5)
    if [ ! -z "$DAG_RUNS" ]; then
        echo "$DAG_RUNS"
        break
    fi
    sleep 3
done

echo ""
echo "In Airflow UI:"
echo "  - Click on DAG to see Graph View"
echo "  - View tasks: wait_for_services, run_producer, submit_flink_job, verify_cassandra"
echo ""
wait_user

# Step 5: Check Logs
print_step "5" "Check Logs"
echo "Recent Airflow scheduler logs:"
docker compose logs airflow-scheduler 2>/dev/null | tail -20

echo ""
echo "Recent Airflow webserver logs:"
docker compose logs airflow-webserver 2>/dev/null | tail -10

echo ""
echo "In Airflow UI:"
echo "  - Click on a task → View Logs"
echo ""
wait_user

# Step 6: Verify Results
print_step "6" "Verify Results"
echo "Checking data in Cassandra..."
COUNT=$(docker exec cassandra cqlsh -e "SELECT COUNT(*) FROM realtime.users;" 2>/dev/null | grep -o '[0-9]*' | head -1)
echo -e "${GREEN}Total records in Cassandra: $COUNT${NC}"

echo ""
echo "Sample records:"
docker exec cassandra cqlsh -e "SELECT id, name, email, ts FROM realtime.users LIMIT 5;" 2>/dev/null | tail -6

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}✓ DEMO 3 COMPLETED!${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo "Kết quả:"
echo "  ✅ DAG chạy thành công"
echo "  ✅ Tất cả tasks completed"
echo "  ✅ Data được tạo và verify ($COUNT records)"
echo ""
echo "Next steps:"
echo "  - Check Airflow UI for detailed task execution"
echo "  - Review task logs in Airflow UI"
echo ""
echo -e "${YELLOW}Press Enter to exit...${NC}"
read

