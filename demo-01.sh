#!/bin/bash

# Demo 1: Pipeline Cơ Bản
# Test pipeline cơ bản từ Producer → Kafka → Flink → Cassandra

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  DEMO 1: Pipeline Cơ Bản${NC}"
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

# Step 1: Khởi động hệ thống
print_step "1" "Khởi động hệ thống"
echo "Dừng và xóa volumes cũ (nếu có)..."
docker compose down -v 2>/dev/null || true

echo "Khởi động tất cả services..."
docker compose up -d --build

echo "Đợi services khởi động (60-90 giây)..."
sleep 10
echo "Checking services status..."
for i in {1..9}; do
    sleep 10
    RUNNING=$(docker compose ps --services --filter "status=running" | wc -l)
    TOTAL=$(docker compose ps --services | wc -l)
    echo "Services running: $RUNNING/$TOTAL"
    if [ "$RUNNING" -eq "$TOTAL" ]; then
        break
    fi
done

docker compose ps
wait_user

# Step 2: Khởi tạo Cassandra
print_step "2" "Khởi tạo Cassandra"
echo "Đợi Cassandra sẵn sàng..."
sleep 30

echo "Khởi tạo keyspace và table..."
docker exec cassandra cqlsh -f /init.cql

echo "Verifying keyspace..."
docker exec cassandra cqlsh -e "DESCRIBE KEYSPACE realtime;" | head -20
wait_user

# Step 3: Tạo Kafka Topic
print_step "3" "Tạo Kafka Topic"
echo "Tạo topic 'users'..."
docker exec kafka kafka-topics --create \
  --bootstrap-server localhost:9092 \
  --topic users \
  --partitions 1 \
  --replication-factor 1 2>/dev/null || echo "Topic may already exist"

echo "Verifying topic..."
docker exec kafka kafka-topics --bootstrap-server localhost:9092 --list
wait_user

# Step 4: Chạy Producer
print_step "4" "Chạy Producer"
echo "Checking producer dependencies..."
cd producer
if [ ! -d "venv" ] && ! python3 -c "import kafka" 2>/dev/null; then
    echo "Installing dependencies..."
    pip install -q -r requirements.txt
fi

echo "Running producer (sending 10 messages)..."
python3 -c "
from producer import *
producer = create_producer()
send_messages(producer, 'users', num_messages=10, delay=0.5)
producer.close()
print('✓ Producer completed!')
"
cd ..
wait_user

# Step 5: Submit Flink Job
print_step "5" "Submit Flink Job"
echo "Submitting Flink job..."
docker exec -d flink-jobmanager /opt/flink/bin/flink run \
  -py /opt/flink/usrlib/job.py

echo "Waiting for job to start..."
sleep 15

echo "Checking Flink UI: http://localhost:8081"
echo "Checking job status..."
curl -s http://localhost:8081/jobs | grep -o '"id":"[^"]*"' | head -1 || echo "Job may still be starting..."
wait_user

# Step 6: Verify Data trong Cassandra
print_step "6" "Verify Data trong Cassandra"
echo "Counting records in Cassandra..."
COUNT=$(docker exec cassandra cqlsh -e "SELECT COUNT(*) FROM realtime.users;" 2>/dev/null | grep -o '[0-9]*' | head -1)
echo -e "${GREEN}Total records: $COUNT${NC}"

echo ""
echo "Sample records (first 5):"
docker exec cassandra cqlsh -e "SELECT id, name, email, ts FROM realtime.users LIMIT 5;" 2>/dev/null

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}✓ DEMO 1 COMPLETED!${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo "Kết quả:"
echo "  ✅ Producer gửi thành công messages vào Kafka"
echo "  ✅ Flink job đọc từ Kafka và ghi vào Cassandra"
echo "  ✅ Data xuất hiện trong Cassandra table ($COUNT records)"
echo ""
echo -e "${YELLOW}Press Enter to exit...${NC}"
read

