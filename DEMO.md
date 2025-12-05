# Demo Scenarios - Real-Time Streaming Pipeline

Tài liệu này mô tả các kịch bản demo để test và verify toàn bộ pipeline: **Kafka → Flink → Cassandra**

## Mục lục

1. [Demo 1: Pipeline Cơ Bản](#demo-1-pipeline-cơ-bản)
2. [Demo 2: Real-Time Streaming](#demo-2-real-time-streaming)
3. [Demo 3: Airflow Orchestration](#demo-3-airflow-orchestration)
4. [Demo 4: Xử Lý Lỗi và Recovery](#demo-4-xử-lý-lỗi-và-recovery)
5. [Demo 5: Monitoring và Verification](#demo-5-monitoring-và-verification)
6. [Demo 6: Query và Analysis](#demo-6-query-và-analysis)
7. [Demo 7: End-to-End Workflow](#demo-7-end-to-end-workflow)

---

## Demo 1: Pipeline Cơ Bản

**Mục tiêu:** Test pipeline cơ bản từ Producer → Kafka → Flink → Cassandra

### Bước 1: Khởi động hệ thống

```bash
# Dừng và xóa volumes cũ (nếu có)
docker compose down -v

# Khởi động tất cả services
docker compose up -d --build

# Đợi services khởi động (60-90 giây)
docker compose ps
```

### Bước 2: Khởi tạo Cassandra

```bash
# Đợi Cassandra sẵn sàng
sleep 30

# Khởi tạo keyspace và table
docker exec cassandra cqlsh -f /init.cql

# Verify
docker exec cassandra cqlsh -e "DESCRIBE KEYSPACE realtime;"
```

### Bước 3: Tạo Kafka Topic

```bash
# Tạo topic "users"
docker exec kafka kafka-topics --create \
  --bootstrap-server localhost:9092 \
  --topic users \
  --partitions 1 \
  --replication-factor 1

# Verify topic
docker exec kafka kafka-topics --bootstrap-server localhost:9092 --list
```

### Bước 4: Chạy Producer

```bash
# Cài đặt dependencies
cd producer
pip install -r requirements.txt

# Chạy producer (gửi 10 messages)
python producer.py
```

**Hoặc chỉnh sửa số lượng messages trong producer.py:**
```python
send_messages(producer, TOPIC_NAME, num_messages=10, delay=1)
```

### Bước 5: Submit Flink Job

```bash
# Submit Flink job
docker exec -it flink-jobmanager /opt/flink/bin/flink run \
  -py /opt/flink/usrlib/job.py
```

**Hoặc check Flink UI:** http://localhost:8081

### Bước 6: Verify Data trong Cassandra

```bash
# Đếm số records
docker exec cassandra cqlsh -e "SELECT COUNT(*) FROM realtime.users;"

# Xem 5 records đầu tiên
docker exec cassandra cqlsh -e "SELECT * FROM realtime.users LIMIT 5;"
```

### Kết quả mong đợi:
- ✅ Producer gửi thành công messages vào Kafka
- ✅ Flink job đọc từ Kafka và ghi vào Cassandra
- ✅ Data xuất hiện trong Cassandra table

---

## Demo 2: Real-Time Streaming

**Mục tiêu:** Test real-time streaming với continuous data flow

### Bước 1: Đảm bảo Flink Job đang chạy

```bash
# Check Flink UI: http://localhost:8081
# Hoặc check logs
docker compose logs flink-taskmanager | tail -20
```

### Bước 2: Chạy Producer liên tục

Mở terminal mới và chạy producer với delay ngắn:

```bash
cd producer
python -c "
from producer import *
import time
producer = create_producer()
for i in range(50):
    send_messages(producer, 'users', num_messages=1, delay=0.5)
    print(f'Sent batch {i+1}')
    time.sleep(2)
producer.close()
"
```

### Bước 3: Monitor Real-Time

**Terminal 1: Monitor Kafka messages**
```bash
docker exec -it kafka kafka-console-consumer \
  --bootstrap-server localhost:9092 \
  --topic users \
  --from-beginning
```

**Terminal 2: Monitor Cassandra (real-time count)**
```bash
watch -n 2 "docker exec cassandra cqlsh -e 'SELECT COUNT(*) FROM realtime.users;'"
```

**Terminal 3: Monitor Flink logs**
```bash
docker compose logs -f flink-taskmanager
```

### Bước 4: Verify Real-Time Processing

```bash
# Check số lượng records tăng dần
for i in {1..10}; do
  echo "Count at $(date):"
  docker exec cassandra cqlsh -e "SELECT COUNT(*) FROM realtime.users;"
  sleep 5
done
```

### Kết quả mong đợi:
- ✅ Messages được xử lý real-time
- ✅ Data xuất hiện trong Cassandra ngay sau khi producer gửi
- ✅ Không có lag đáng kể giữa Kafka và Cassandra

---

## Demo 3: Airflow Orchestration

**Mục tiêu:** Test Airflow DAG để orchestrate pipeline

### Bước 1: Truy cập Airflow UI

```bash
# Mở browser: http://localhost:8080
# Login: admin / admin
```

### Bước 2: Enable DAG

1. Vào Airflow UI
2. Tìm DAG: `kafka_flink_pipeline`
3. Toggle ON để enable DAG

### Bước 3: Trigger DAG manually

1. Click vào DAG `kafka_flink_pipeline`
2. Click nút "Play" (▶️) để trigger
3. Chọn "Trigger DAG"

### Bước 4: Monitor DAG Execution

1. Click vào DAG để xem Graph View
2. Xem các tasks:
   - `wait_for_services`
   - `run_producer`
   - `submit_flink_job`
   - `verify_cassandra`

### Bước 5: Check Logs

```bash
# Xem Airflow logs
docker compose logs -f airflow-scheduler

# Xem DAG logs trong Airflow UI
# Click vào task → Logs
```

### Bước 6: Verify Results

```bash
# Check data trong Cassandra
docker exec cassandra cqlsh -e "SELECT COUNT(*) FROM realtime.users;"
```

### Kết quả mong đợi:
- ✅ DAG chạy thành công
- ✅ Tất cả tasks completed
- ✅ Data được tạo và verify

---

## Demo 4: Xử Lý Lỗi và Recovery

**Mục tiêu:** Test khả năng xử lý lỗi và recovery của pipeline

### Scenario 1: Flink Job Crash

**Bước 1: Stop Flink TaskManager**
```bash
docker compose stop flink-taskmanager
```

**Bước 2: Gửi messages vào Kafka**
```bash
cd producer
python producer.py  # Gửi messages
```

**Bước 3: Restart Flink**
```bash
docker compose start flink-taskmanager
```

**Bước 4: Verify Recovery**
```bash
# Check Flink job restart
docker compose logs flink-taskmanager | tail -20

# Verify data được xử lý (Flink đọc từ earliest offset)
docker exec cassandra cqlsh -e "SELECT COUNT(*) FROM realtime.users;"
```

### Scenario 2: Kafka Restart

**Bước 1: Stop Kafka**
```bash
docker compose stop kafka
```

**Bước 2: Producer sẽ fail**
```bash
cd producer
python producer.py  # Sẽ báo lỗi connection
```

**Bước 3: Restart Kafka**
```bash
docker compose start kafka
sleep 10
```

**Bước 4: Producer retry**
```bash
python producer.py  # Sẽ thành công
```

### Scenario 3: Cassandra Restart

**Bước 1: Stop Cassandra**
```bash
docker compose stop cassandra
```

**Bước 2: Flink sẽ fail khi ghi**
```bash
# Check Flink logs
docker compose logs flink-taskmanager | grep -i error
```

**Bước 3: Restart Cassandra**
```bash
docker compose start cassandra
sleep 30
```

**Bước 4: Verify Recovery**
```bash
# Flink sẽ tự động retry và ghi thành công
docker compose logs flink-taskmanager | tail -20
docker exec cassandra cqlsh -e "SELECT COUNT(*) FROM realtime.users;"
```

### Kết quả mong đợi:
- ✅ Pipeline có khả năng recovery sau khi service restart
- ✅ Không mất data (Kafka lưu messages)
- ✅ Flink retry và tiếp tục xử lý

---

## Demo 5: Monitoring và Verification

**Mục tiêu:** Monitor toàn bộ pipeline và verify data integrity

### Bước 1: Monitor Tất Cả Services

**Terminal 1: Kafka Metrics**
```bash
# List topics và partitions
docker exec kafka kafka-topics --bootstrap-server localhost:9092 --describe --topic users

# Consumer lag (nếu có consumer group)
docker exec kafka kafka-consumer-groups --bootstrap-server localhost:9092 \
  --group flink-users-consumer --describe
```

**Terminal 2: Flink Metrics**
```bash
# Flink UI: http://localhost:8081
# Check:
# - Running Jobs
# - Task Managers
# - Job Metrics (throughput, latency)
```

**Terminal 3: Cassandra Metrics**
```bash
# Node status
docker exec cassandra nodetool status

# Table statistics
docker exec cassandra nodetool tablestats realtime.users
```

**Terminal 4: Airflow Metrics**
```bash
# Airflow UI: http://localhost:8080
# Check DAG runs, task durations, success rates
```

### Bước 2: Data Integrity Check

**Bước 2.1: Count Messages trong Kafka**
```bash
# Đếm messages trong Kafka topic
docker exec kafka kafka-run-class kafka.tools.GetOffsetShell \
  --broker-list localhost:9092 \
  --topic users \
  --time -1
```

**Bước 2.2: Count Records trong Cassandra**
```bash
docker exec cassandra cqlsh -e "SELECT COUNT(*) FROM realtime.users;"
```

**Bước 2.3: So sánh**
```bash
# Messages trong Kafka ≈ Records trong Cassandra
# (Có thể có sự khác biệt nhỏ do timing)
```

### Bước 3: Sample Data Verification

```bash
# Lấy sample từ Kafka
docker exec kafka kafka-console-consumer \
  --bootstrap-server localhost:9092 \
  --topic users \
  --from-beginning \
  --max-messages 5

# Lấy sample từ Cassandra
docker exec cassandra cqlsh -e "SELECT id, name, email, ts FROM realtime.users LIMIT 5;"

# So sánh: Data phải match
```

### Bước 4: Performance Metrics

```bash
# Flink throughput
# Check trong Flink UI: Jobs → Metrics → Records per second

# Latency
# Check trong Flink UI: Jobs → Metrics → Latency

# Cassandra write performance
docker exec cassandra nodetool tablestats realtime.users | grep -i "write"
```

### Kết quả mong đợi:
- ✅ Tất cả services healthy
- ✅ Data integrity được maintain
- ✅ Performance metrics trong acceptable range

---

## Demo 6: Query và Analysis

**Mục tiêu:** Query và analyze data trong Cassandra

### Bước 1: Basic Queries

```bash
# Connect to Cassandra
docker exec -it cassandra cqlsh

# Use keyspace
USE realtime;

# Count total records
SELECT COUNT(*) FROM users;

# View all columns
SELECT * FROM users LIMIT 10;
```

### Bước 2: Query by Email (sử dụng index)

```bash
# Tìm user by email
SELECT * FROM users WHERE email = 'alice.smith@example.com';

# List all unique emails
SELECT DISTINCT email FROM users LIMIT 20;
```

### Bước 3: Time-based Queries

```bash
# Users created in last hour
SELECT * FROM users WHERE ts > dateOf(now()) - 1h ALLOW FILTERING;

# Count by time range
SELECT COUNT(*) FROM users WHERE ts > '2024-01-01' ALLOW FILTERING;
```

### Bước 4: Data Analysis

```bash
# Top 10 most recent users
SELECT id, name, email, ts FROM users LIMIT 10;

# Count by domain
SELECT email, COUNT(*) FROM users GROUP BY email ALLOW FILTERING;
```

### Bước 5: Export Data

```bash
# Export to CSV
docker exec cassandra cqlsh -e "
COPY realtime.users (id, name, email, ts) TO '/tmp/users.csv' WITH HEADER = true;
"

# Copy file out
docker cp cassandra:/tmp/users.csv ./users_export.csv

# View
head -10 users_export.csv
```

### Kết quả mong đợi:
- ✅ Có thể query data dễ dàng
- ✅ Index hoạt động tốt
- ✅ Có thể export data để analysis

---

## Demo 7: End-to-End Workflow

**Mục tiêu:** Chạy toàn bộ workflow từ đầu đến cuối

### Scenario: Complete Pipeline Test

**Bước 1: Clean Start**
```bash
# Stop và xóa tất cả
docker compose down -v

# Khởi động lại
docker compose up -d --build

# Đợi services ready
sleep 90
```

**Bước 2: Initialize**
```bash
# Initialize Cassandra
docker exec cassandra cqlsh -f /init.cql

# Create Kafka topic
docker exec kafka kafka-topics --create \
  --bootstrap-server localhost:9092 \
  --topic users \
  --partitions 1 \
  --replication-factor 1
```

**Bước 3: Start Flink Job**
```bash
# Submit Flink job
docker exec -d flink-jobmanager /opt/flink/bin/flink run \
  -py /opt/flink/usrlib/job.py

# Verify job running
sleep 10
curl http://localhost:8081/jobs
```

**Bước 4: Generate Data**
```bash
# Run producer với nhiều messages
cd producer
python -c "
from producer import *
producer = create_producer()
send_messages(producer, 'users', num_messages=100, delay=0.1)
producer.close()
"
```

**Bước 5: Monitor Progress**
```bash
# Watch data flow
watch -n 2 "docker exec cassandra cqlsh -e 'SELECT COUNT(*) FROM realtime.users;'"
```

**Bước 6: Verify Results**
```bash
# Final count
docker exec cassandra cqlsh -e "SELECT COUNT(*) FROM realtime.users;"

# Sample data
docker exec cassandra cqlsh -e "SELECT * FROM realtime.users LIMIT 10;"

# Check Flink job status
curl http://localhost:8081/jobs
```

**Bước 7: Airflow Orchestration**
```bash
# Trigger Airflow DAG
# 1. Go to http://localhost:8080
# 2. Enable DAG: kafka_flink_pipeline
# 3. Trigger DAG
# 4. Monitor execution
```

**Bước 8: Final Verification**
```bash
# Check all services healthy
docker compose ps

# Check data integrity
KAFKA_COUNT=$(docker exec kafka kafka-run-class kafka.tools.GetOffsetShell \
  --broker-list localhost:9092 --topic users --time -1 | awk -F: '{sum+=$3} END {print sum}')

CASSANDRA_COUNT=$(docker exec cassandra cqlsh -e "SELECT COUNT(*) FROM realtime.users;" | grep -o '[0-9]*' | head -1)

echo "Kafka messages: $KAFKA_COUNT"
echo "Cassandra records: $CASSANDRA_COUNT"
echo "Difference: $((KAFKA_COUNT - CASSANDRA_COUNT))"
```

### Kết quả mong đợi:
- ✅ Toàn bộ pipeline hoạt động end-to-end
- ✅ Data được xử lý và lưu trữ đúng
- ✅ Tất cả services healthy
- ✅ Airflow orchestration thành công

---

## Quick Reference Commands

### Start/Stop Services
```bash
# Start all
docker compose up -d

# Stop all
docker compose down

# Restart specific service
docker compose restart kafka
```

### Check Service Status
```bash
# All services
docker compose ps

# Specific service logs
docker compose logs -f kafka
docker compose logs -f flink-jobmanager
docker compose logs -f cassandra
docker compose logs -f airflow-webserver
```

### Kafka Commands
```bash
# List topics
docker exec kafka kafka-topics --bootstrap-server localhost:9092 --list

# Describe topic
docker exec kafka kafka-topics --bootstrap-server localhost:9092 --describe --topic users

# Consume messages
docker exec kafka kafka-console-consumer --bootstrap-server localhost:9092 --topic users --from-beginning
```

### Flink Commands
```bash
# List jobs
curl http://localhost:8081/jobs

# Submit job
docker exec flink-jobmanager /opt/flink/bin/flink run -py /opt/flink/usrlib/job.py

# Cancel job
docker exec flink-jobmanager /opt/flink/bin/flink cancel <job-id>
```

### Cassandra Commands
```bash
# Connect
docker exec -it cassandra cqlsh

# Count records
docker exec cassandra cqlsh -e "SELECT COUNT(*) FROM realtime.users;"

# Query data
docker exec cassandra cqlsh -e "SELECT * FROM realtime.users LIMIT 10;"
```

### Airflow Commands
```bash
# Check DAGs
docker exec airflow-webserver airflow dags list

# Trigger DAG
docker exec airflow-webserver airflow dags trigger kafka_flink_pipeline

# List tasks
docker exec airflow-webserver airflow tasks list kafka_flink_pipeline
```

---

## Troubleshooting Tips

### Flink Job không chạy
```bash
# Check Flink logs
docker compose logs flink-taskmanager

# Check Kafka connection
docker exec flink-taskmanager ping kafka

# Check Cassandra connection
docker exec flink-taskmanager ping cassandra
```

### Data không xuất hiện trong Cassandra
```bash
# Check Flink job status
curl http://localhost:8081/jobs

# Check Kafka có messages không
docker exec kafka kafka-console-consumer --bootstrap-server localhost:9092 --topic users --from-beginning --max-messages 5

# Check Flink logs for errors
docker compose logs flink-taskmanager | grep -i error
```

### Airflow DAG không chạy
```bash
# Check Airflow logs
docker compose logs airflow-scheduler

# Check MySQL connection
docker exec airflow-webserver env | grep SQL_ALCHEMY_CONN

# Restart Airflow
docker compose restart airflow-webserver airflow-scheduler
```

---

## Performance Benchmarks

### Expected Performance

- **Kafka Producer:** ~1000 messages/second
- **Flink Processing:** ~500-1000 records/second
- **Cassandra Writes:** ~500-1000 writes/second
- **End-to-End Latency:** < 5 seconds

### Load Testing

```bash
# High volume test
cd producer
python -c "
from producer import *
import time
producer = create_producer()
start = time.time()
send_messages(producer, 'users', num_messages=1000, delay=0)
end = time.time()
print(f'Produced 1000 messages in {end-start:.2f} seconds')
print(f'Throughput: {1000/(end-start):.2f} messages/sec')
producer.close()
"
```

---

## Next Steps

Sau khi hoàn thành các demos, bạn có thể:

1. **Tùy chỉnh Producer:** Thêm fields, change data format
2. **Enhance Flink Job:** Thêm transformations, filtering, aggregations
3. **Optimize Cassandra:** Tuning table structure, indexes
4. **Scale Services:** Thêm more Flink TaskManagers, Kafka partitions
5. **Add Monitoring:** Prometheus, Grafana dashboards
6. **Production Setup:** Security, authentication, backup strategies

---

**Happy Testing! 🚀**

