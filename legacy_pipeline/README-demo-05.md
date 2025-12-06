# README - Demo 05: Monitoring và Verification

## 📋 Tổng quan

Demo này hướng dẫn **monitor toàn bộ pipeline** và **verify data integrity**. Bạn sẽ học cách kiểm tra health của tất cả services và đảm bảo data không bị mất.

## 🚀 Cách chạy

**Double-click vào file:** `demo-05.sh`

Hoặc chạy trong terminal:
```bash
./demo-05.sh
```

## 📖 Chi tiết từng bước

### Bước 1: Monitor Tất Cả Services

**Chuyện gì xảy ra:**
- Script sẽ check status và metrics của từng service:
  - Kafka metrics (topics, consumer groups)
  - Flink metrics (jobs, logs)
  - Cassandra metrics (node status, table stats)
  - Airflow metrics (DAGs)

**Bạn sẽ thấy:**

#### Kafka Metrics
```
--- Kafka Metrics ---
Topic details:
Topic: users	Partition: 0	Leader: 1	Replicas: 1	Isr: 1

Consumer groups:
flink-users-consumer
```

**Thao tác:**
- 👀 **Xem** topic details để verify:
  - Topic `users` tồn tại
  - Partition count
  - Replication factor
- 👀 **Xem** consumer groups để verify Flink đang consume
- ⌨️ **Nhấn Enter** để tiếp tục

---

#### Flink Metrics
```
--- Flink Metrics ---
Flink UI: http://localhost:8081

Running jobs:
{"id":"abc123..."}

Recent Flink logs:
[INFO] Connected to Kafka
[INFO] Processing records...
```

**Thao tác:**
- 🌐 **Mở browser:** http://localhost:8081
- 👀 **Trong Flink UI:**
  - Xem "Running Jobs" hoặc "Completed Jobs"
  - Click vào job để xem:
    - **Overview** - job status, duration
    - **Metrics** - throughput, latency
    - **Checkpoints** - recovery points
- 👀 **Xem** recent logs để verify job đang chạy
- ⌨️ **Nhấn Enter** để tiếp tục

**Thời gian:** ~30 giây (để bạn xem Flink UI)

---

#### Cassandra Metrics
```
--- Cassandra Metrics ---
Node status:
Datacenter: datacenter1
Status=Up/Down
|/ State=Normal/Leaving/Joining/Moving
--  Address    Load       Tokens  Owns (effective)  Host ID
UN  127.0.0.1  100.5 KiB  256     100.0%            abc123...

Table statistics:
Keyspace: realtime
Table: users
SSTable count: 1
Space used (live): 50 KB
Space used (total): 50 KB
```

**Thao tác:**
- 👀 **Xem** node status:
  - `UN` = Up Normal (healthy)
  - `DN` = Down Normal (unhealthy)
- 👀 **Xem** table statistics:
  - Space used - dung lượng data
  - SSTable count - số file data
- ⌨️ **Nhấn Enter** để tiếp tục

---

#### Airflow Metrics
```
--- Airflow Metrics ---
Airflow UI: http://localhost:8080

DAG list:
kafka_flink_pipeline
```

**Thao tác:**
- 🌐 **Mở browser:** http://localhost:8080 (tùy chọn)
- 👀 **Xem** DAG list để verify DAG tồn tại
- ⌨️ **Nhấn Enter** để tiếp tục

---

### Bước 2: Data Integrity Check

**Chuyện gì xảy ra:**
- Script đếm messages trong Kafka (total offsets)
- Script đếm records trong Cassandra
- So sánh 2 số để verify data integrity

**Bạn sẽ thấy:**
```
Data Integrity Check
Counting messages in Kafka topic...
Kafka messages (total offsets): 100

Counting records in Cassandra...
Cassandra records: 98

Comparison:
✓ Data integrity OK (difference: 2 - within acceptable range)
```

**Thao tác:**
- 👀 **Xem** Kafka messages count
- 👀 **Xem** Cassandra records count
- 👀 **Xem** difference:
  - **Difference < 10:** ✅ OK (có thể đang xử lý)
  - **Difference > 10:** ⚠️ Có thể có vấn đề
- ✅ **Hiểu:** Sự khác biệt nhỏ là bình thường (do timing)
- ⌨️ **Nhấn Enter** để tiếp tục

**Lưu ý:** 
- Kafka lưu **tất cả** messages (kể cả đã xử lý)
- Cassandra chỉ lưu **đã xử lý** records
- Difference nhỏ là do messages đang được xử lý

---

### Bước 3: Sample Data Verification

**Chuyện gì xảy ra:**
- Script lấy 3 messages mẫu từ Kafka
- Script lấy 3 records mẫu từ Cassandra
- Bạn có thể so sánh để verify data match

**Bạn sẽ thấy:**
```
Sample Data Verification
Sample messages from Kafka (last 3):
{"id":"123...","name":"Alice Smith","email":"alice@example.com","timestamp":"2024-12-05T10:30:00Z"}
...

Sample records from Cassandra (last 3):
 id                                   | name        | email                  | ts
--------------------------------------+-------------+------------------------+-------------------------
 123e4567-e89b-12d3-a456-426614174000 | Alice Smith | alice@example.com      | 2024-12-05 10:30:00+0000
 ...
```

**Thao tác:**
- 👀 **So sánh** data từ Kafka và Cassandra:
  - ID phải match
  - Name phải match
  - Email phải match
  - Timestamp phải tương đương
- ✅ **Verify:** Data từ Kafka đã được ghi đúng vào Cassandra
- ⌨️ **Nhấn Enter** để tiếp tục

---

### Bước 4: Performance Metrics

**Chuyện gì xảy ra:**
- Script hiển thị hướng dẫn xem performance metrics
- Check service health status

**Bạn sẽ thấy:**
```
Performance Metrics
Flink Job Metrics:
  - Check Flink UI: http://localhost:8081
  - Navigate to: Jobs → Select Job → Metrics
  - Look for: Records per second, Latency

Cassandra Write Performance:
Write requests: 100
Write latency: 0.5 ms

Service Health Check:
  Kafka: ✓ Running
  Flink: ✓ Running
  Cassandra: ✓ Running
  Airflow: ✓ Running
```

**Thao tác:**

#### Xem Flink Performance
- 🌐 **Mở:** http://localhost:8081
- Click vào job đang chạy
- Click tab **"Metrics"**
- 👀 **Xem:**
  - **Records per second** - throughput (nên > 100)
  - **Latency** - độ trễ (nên < 1s)
  - **Backpressure** - có bị tắc nghẽn không

#### Xem Cassandra Performance
- 👀 **Xem** write requests và latency trong output
- ✅ **Verify:** Latency thấp (< 10ms) là tốt

#### Service Health
- 👀 **Xem** tất cả services đều "✓ Running"
- ✅ **Verify:** Tất cả services healthy

- ⌨️ **Nhấn Enter** để tiếp tục

---

## ✅ Kết quả mong đợi

Sau khi hoàn thành demo, bạn sẽ:

1. ✅ **Biết cách monitor** tất cả services
2. ✅ **Biết cách verify** data integrity
3. ✅ **Biết cách check** performance metrics
4. ✅ **Hiểu** health status của từng service

## 🔍 Kiểm tra thêm (tùy chọn)

### Real-time Monitoring

**Terminal 1: Monitor Kafka**
```bash
watch -n 2 "docker exec kafka kafka-topics --bootstrap-server localhost:9092 --describe --topic users"
```

**Terminal 2: Monitor Cassandra**
```bash
watch -n 2 "docker exec cassandra cqlsh -e 'SELECT COUNT(*) FROM realtime.users;'"
```

**Terminal 3: Monitor Flink**
```bash
watch -n 2 "curl -s http://localhost:8081/jobs | grep -o '\"id\":\"[^\"]*\"'"
```

### Detailed Metrics

**Flink Metrics:**
1. Mở Flink UI: http://localhost:8081
2. Click vào job
3. Xem các metrics:
   - `numRecordsInPerSecond` - input throughput
   - `numRecordsOutPerSecond` - output throughput
   - `latency` - processing latency

**Cassandra Metrics:**
```bash
# Detailed table stats
docker exec cassandra nodetool tablestats realtime.users

# Node info
docker exec cassandra nodetool info
```

### Data Integrity Script

Tạo script để check data integrity tự động:

```bash
#!/bin/bash
KAFKA_COUNT=$(docker exec kafka kafka-run-class kafka.tools.GetOffsetShell \
  --broker-list localhost:9092 --topic users --time -1 | \
  awk -F: '{sum+=$3} END {print sum}')

CASSANDRA_COUNT=$(docker exec cassandra cqlsh -e "SELECT COUNT(*) FROM realtime.users;" | \
  grep -o '[0-9]*' | head -1)

DIFF=$((KAFKA_COUNT - CASSANDRA_COUNT))
echo "Kafka: $KAFKA_COUNT, Cassandra: $CASSANDRA_COUNT, Diff: $DIFF"

if [ $DIFF -lt 10 ]; then
  echo "✓ Data integrity OK"
else
  echo "⚠ Large difference - may need investigation"
fi
```

## ⚠️ Troubleshooting

**Nếu data integrity check fail:**
- Đợi thêm 30 giây (messages có thể đang xử lý)
- Check Flink job đang chạy: http://localhost:8081
- Check Flink logs: `docker compose logs flink-taskmanager | tail -20`

**Nếu service không healthy:**
- Check logs: `docker compose logs <service-name>`
- Restart service: `docker compose restart <service-name>`
- Verify dependencies: `docker compose ps`

**Nếu performance metrics thấp:**
- Check Flink parallelism: có thể cần tăng
- Check Cassandra write performance: `docker exec cassandra nodetool tablestats realtime.users`
- Check network: `docker network inspect bigdata-realtime-pipeline-2025_pipeline-network`

---

**Chúc bạn demo thành công! 🚀**

