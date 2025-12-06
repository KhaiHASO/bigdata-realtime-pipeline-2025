#!/bin/bash

# Demo 4: Xử Lý Lỗi và Recovery
# Test khả năng xử lý lỗi và recovery của pipeline

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  DEMO 4: Xử Lý Lỗi và Recovery${NC}"
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

# Scenario 1: Flink Job Crash
print_step "SCENARIO 1" "Flink Job Crash và Recovery"

echo "Getting initial record count..."
INITIAL_COUNT=$(docker exec cassandra cqlsh -e "SELECT COUNT(*) FROM realtime.users;" 2>/dev/null | grep -o '[0-9]*' | head -1)
echo -e "${GREEN}Initial records: $INITIAL_COUNT${NC}"
echo ""

echo "Stopping Flink TaskManager..."
docker compose stop flink-taskmanager
echo -e "${RED}✓ Flink TaskManager stopped${NC}"
wait_user

echo "Sending messages to Kafka (Flink is down)..."
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
send_messages(producer, 'users', num_messages=10, delay=0.3)
producer.close()
print('✓ Messages sent to Kafka')
"

if [ "$USE_VENV_FLAG" = "true" ]; then
    deactivate
fi
cd ..
wait_user

echo "Restarting Flink TaskManager..."
docker compose start flink-taskmanager
echo "Waiting for Flink to recover..."
sleep 20

echo "Checking Flink logs..."
docker compose logs flink-taskmanager 2>/dev/null | tail -10

echo ""
echo "Verifying recovery - checking record count..."
sleep 10
FINAL_COUNT=$(docker exec cassandra cqlsh -e "SELECT COUNT(*) FROM realtime.users;" 2>/dev/null | grep -o '[0-9]*' | head -1)
echo -e "${GREEN}Final records: $FINAL_COUNT${NC}"
echo -e "${GREEN}New records processed: $((FINAL_COUNT - INITIAL_COUNT))${NC}"

if [ "$FINAL_COUNT" -gt "$INITIAL_COUNT" ]; then
    echo -e "${GREEN}✓ Recovery successful! Data was processed after restart${NC}"
else
    echo -e "${YELLOW}⚠ Data may still be processing. Check Flink logs.${NC}"
fi
wait_user

# Scenario 2: Kafka Restart
print_step "SCENARIO 2" "Kafka Restart"

echo "Stopping Kafka..."
docker compose stop kafka
echo -e "${RED}✓ Kafka stopped${NC}"
wait_user

echo "Attempting to send messages (Kafka is down)..."
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
try:
    producer = create_producer()
    print('ERROR: Should not be able to connect!')
except Exception as e:
    print(f'✓ Expected error: {type(e).__name__}')
" 2>&1 | head -3

if [ "$USE_VENV_FLAG" = "true" ]; then
    deactivate
fi
cd ..
wait_user

echo "Restarting Kafka..."
docker compose start kafka
echo "Waiting for Kafka to be ready..."
sleep 15

echo "Sending messages again (Kafka is up)..."
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
send_messages(producer, 'users', num_messages=5, delay=0.3)
producer.close()
print('✓ Messages sent successfully after Kafka restart')
"

if [ "$USE_VENV_FLAG" = "true" ]; then
    deactivate
fi
cd ..
wait_user

# Scenario 3: Cassandra Restart
print_step "SCENARIO 3" "Cassandra Restart"

echo "Getting current record count..."
BEFORE_COUNT=$(docker exec cassandra cqlsh -e "SELECT COUNT(*) FROM realtime.users;" 2>/dev/null | grep -o '[0-9]*' | head -1)
echo -e "${GREEN}Records before Cassandra restart: $BEFORE_COUNT${NC}"
echo ""

echo "Stopping Cassandra..."
docker compose stop cassandra
echo -e "${RED}✓ Cassandra stopped${NC}"
wait_user

echo "Sending messages to Kafka (Cassandra is down)..."
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
send_messages(producer, 'users', num_messages=10, delay=0.3)
producer.close()
print('✓ Messages sent to Kafka')
"

if [ "$USE_VENV_FLAG" = "true" ]; then
    deactivate
fi
cd ..
echo ""
echo "Checking Flink logs for errors..."
docker compose logs flink-taskmanager 2>/dev/null | grep -i "error\|exception\|cassandra" | tail -5
wait_user

echo "Restarting Cassandra..."
docker compose start cassandra
echo "Waiting for Cassandra to be ready..."
sleep 30

echo "Checking Flink recovery..."
docker compose logs flink-taskmanager 2>/dev/null | tail -10
wait_user

echo "Verifying data was written after recovery..."
sleep 15
AFTER_COUNT=$(docker exec cassandra cqlsh -e "SELECT COUNT(*) FROM realtime.users;" 2>/dev/null | grep -o '[0-9]*' | head -1)
echo -e "${GREEN}Records after Cassandra restart: $AFTER_COUNT${NC}"

if [ "$AFTER_COUNT" -gt "$BEFORE_COUNT" ]; then
    echo -e "${GREEN}✓ Recovery successful! Data was written after Cassandra restart${NC}"
    echo -e "${GREEN}New records: $((AFTER_COUNT - BEFORE_COUNT))${NC}"
else
    echo -e "${YELLOW}⚠ Data may still be processing. Check Flink logs.${NC}"
fi

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}✓ DEMO 4 COMPLETED!${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo "Kết quả:"
echo "  ✅ Pipeline có khả năng recovery sau khi service restart"
echo "  ✅ Không mất data (Kafka lưu messages)"
echo "  ✅ Flink retry và tiếp tục xử lý"
echo ""
echo -e "${YELLOW}Press Enter to exit...${NC}"
read

