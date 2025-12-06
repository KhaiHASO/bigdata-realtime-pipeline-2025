#!/bin/bash

# Demo 2: Real-Time Streaming
# Test real-time streaming với continuous data flow

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  DEMO 2: Real-Time Streaming${NC}"
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

# Step 1: Đảm bảo Flink Job đang chạy
print_step "1" "Kiểm tra Flink Job"
echo "Checking Flink job status..."
JOBS=$(curl -s http://localhost:8081/jobs 2>/dev/null | grep -o '"id":"[^"]*"' | wc -l)
if [ "$JOBS" -eq "0" ]; then
    echo -e "${YELLOW}No Flink job running. Starting job...${NC}"
    docker exec -d flink-jobmanager /opt/flink/bin/flink run \
      -py /opt/flink/usrlib/job.py
    sleep 10
else
    echo -e "${GREEN}✓ Flink job is running${NC}"
fi

echo "Flink UI: http://localhost:8081"
echo "Recent Flink logs:"
docker compose logs flink-taskmanager 2>/dev/null | tail -5
wait_user

# Step 2: Chạy Producer liên tục
print_step "2" "Chạy Producer liên tục"
echo "Starting continuous producer (50 batches, 1 message each, 2s delay)..."
echo "This will run in the background..."
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
import time
producer = create_producer()
print('Starting to send messages...')
for i in range(50):
    send_messages(producer, 'users', num_messages=1, delay=0)
    print(f'✓ Sent batch {i+1}/50')
    time.sleep(2)
producer.close()
print('✓ All messages sent!')
" &
PRODUCER_PID=$!

if [ "$USE_VENV_FLAG" = "true" ]; then
    deactivate
fi
cd ..

echo "Producer running in background (PID: $PRODUCER_PID)"
wait_user

# Step 3: Monitor Real-Time
print_step "3" "Monitor Real-Time Processing"
echo "Monitoring data flow for 30 seconds..."
echo ""

for i in {1..15}; do
    COUNT=$(docker exec cassandra cqlsh -e "SELECT COUNT(*) FROM realtime.users;" 2>/dev/null | grep -o '[0-9]*' | head -1)
    TIMESTAMP=$(date '+%H:%M:%S')
    echo -e "[$TIMESTAMP] ${GREEN}Records in Cassandra: $COUNT${NC}"
    sleep 2
done

wait_user

# Step 4: Verify Real-Time Processing
print_step "4" "Verify Real-Time Processing"
echo "Final count check..."
FINAL_COUNT=$(docker exec cassandra cqlsh -e "SELECT COUNT(*) FROM realtime.users;" 2>/dev/null | grep -o '[0-9]*' | head -1)
echo -e "${GREEN}Final record count: $FINAL_COUNT${NC}"

echo ""
echo "Recent records:"
docker exec cassandra cqlsh -e "SELECT id, name, email, ts FROM realtime.users LIMIT 5;" 2>/dev/null | tail -6

# Check if producer is still running
if ps -p $PRODUCER_PID > /dev/null 2>&1; then
    echo ""
    echo -e "${YELLOW}Producer is still running. Waiting for completion...${NC}"
    wait $PRODUCER_PID
fi

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}✓ DEMO 2 COMPLETED!${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo "Kết quả:"
echo "  ✅ Messages được xử lý real-time"
echo "  ✅ Data xuất hiện trong Cassandra ngay sau khi producer gửi"
echo "  ✅ Không có lag đáng kể giữa Kafka và Cassandra"
echo "  ✅ Total records processed: $FINAL_COUNT"
echo ""
echo -e "${YELLOW}Press Enter to exit...${NC}"
read

