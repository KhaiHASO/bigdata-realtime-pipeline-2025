# README - Demo 07: End-to-End Workflow

## 📋 Tổng quan

Demo này chạy **toàn bộ workflow từ đầu đến cuối** - từ clean start đến data verification. Đây là demo tổng hợp tất cả các bước đã học.

## 🚀 Cách chạy

**Double-click vào file:** `demo-07.sh`

Hoặc chạy trong terminal:
```bash
./demo-07.sh
```

**⚠️ Lưu ý:** Demo này sẽ **xóa tất cả data** và restart toàn bộ hệ thống. Đảm bảo bạn đã backup data quan trọng!

## 📖 Chi tiết từng bước

### STEP 1: Clean Start

**Chuyện gì xảy ra:**
- Script **dừng và xóa** tất cả containers và volumes
- **Build và khởi động lại** tất cả services từ đầu
- Đợi tất cả services sẵn sàng

**Bạn sẽ thấy:**
```
STEP 1: Clean Start
Stopping and removing all containers and volumes...
Starting all services...
Waiting for services to be ready (90 seconds)...
  Services running: 3/8
  Services running: 5/8
  Services running: 7/8
  Services running: 8/8
✓ Services started
```

**Thao tác:**
- ⏳ **Đợi** script chạy (không cần nhấn gì)
- 👀 **Xem** services khởi động dần
- ✅ **Verify:** Tất cả 8 services đều "Running"
- ⏳ **Đợi** script tự động tiếp tục

**Thời gian:** ~90 giây

**Lưu ý:** Đây là clean start, tất cả data cũ sẽ bị xóa!

---

### STEP 2: Initialize

**Chuyện gì xảy ra:**
- Script khởi tạo Cassandra keyspace và table
- Tạo Kafka topic `users`

**Bạn sẽ thấy:**
```
STEP 2: Initialize
Initializing Cassandra...
✓ Cassandra initialized

Creating Kafka topic...
✓ Kafka topic created
```

**Thao tác:**
- ⏳ **Đợi** script chạy (không cần nhấn gì)
- 👀 **Xem** initialization progress
- ✅ **Verify:** Cassandra và Kafka đã được setup
- ⏳ **Đợi** script tự động tiếp tục

**Thời gian:** ~35 giây

---

### STEP 3: Start Flink Job

**Chuyện gì xảy ra:**
- Script submit Flink streaming job
- Đợi job khởi động

**Bạn sẽ thấy:**
```
STEP 3: Start Flink Job
Submitting Flink job...
Waiting for job to start...
✓ Flink job started
```

**Thao tác:**
- ⏳ **Đợi** script chạy
- 🌐 **Mở browser** (tùy chọn): http://localhost:8081 để xem Flink UI
- ✅ **Verify:** Job đang running trong Flink UI
- ⏳ **Đợi** script tự động tiếp tục

**Thời gian:** ~20 giây

---

### STEP 4: Generate Data

**Chuyện gì xảy ra:**
- Script chạy producer và gửi **100 messages** vào Kafka
- Messages sẽ được Flink xử lý và ghi vào Cassandra

**Bạn sẽ thấy:**
```
STEP 4: Generate Data
Running producer (100 messages)...
✓ Connected to Kafka at ['localhost:9092']
📤 Starting to send 100 messages to topic 'users'...
[1/100] ✓ Sent user: ...
[2/100] ✓ Sent user: ...
...
✓ 100 messages sent
✓ Data generation completed
```

**Thao tác:**
- 👀 **Xem** producer gửi messages
- ⏳ **Đợi** tất cả 100 messages được gửi
- ✅ **Verify:** Producer completed
- ⏳ **Đợi** script tự động tiếp tục

**Thời gian:** ~10-15 giây

---

### STEP 5: Monitor Progress

**Chuyện gì xảy ra:**
- Script monitor số lượng records trong Cassandra mỗi 2 giây
- Hiển thị 15 lần (30 giây) để bạn thấy data flow

**Bạn sẽ thấy:**
```
STEP 5: Monitor Progress
Monitoring data flow for 30 seconds...
  [10:30:15] Records: 5
  [10:30:17] Records: 15
  [10:30:19] Records: 25
  [10:30:21] Records: 35
  [10:30:23] Records: 45
  ...
  [10:30:45] Records: 100
```

**Thao tác:**
- 👀 **Quan sát** số records **tăng dần** mỗi 2 giây
- 📈 **Xem** real-time processing đang hoạt động
- ⏳ **Đợi** 30 giây để xem data flow
- ✅ **Verify:** Records tăng đến ~100
- ⏳ **Đợi** script tự động tiếp tục

**Thời gian:** ~30 giây

**Lưu ý:** Đây là phần quan trọng - bạn sẽ thấy data được xử lý real-time!

---

### STEP 6: Verify Results

**Chuyện gì xảy ra:**
- Script đếm final records trong Cassandra
- Hiển thị 10 records mẫu
- Check Flink job status

**Bạn sẽ thấy:**
```
STEP 6: Verify Results
Final record count:
100 records

Sample data (first 10 records):
 id                                   | name         | email                    | ts
--------------------------------------+--------------+--------------------------+-------------------------
 ...

Flink job status:
{"id":"abc123..."}
```

**Thao tác:**
- 👀 **Xem** final count (nên là ~100)
- 👀 **Xem** sample data để verify
- ✅ **Verify:** Data đã được xử lý và lưu đúng
- ⏳ **Đợi** script tự động tiếp tục

**Thời gian:** ~5 giây

---

### STEP 7: Airflow Orchestration

**Chuyện gì xảy ra:**
- Script check Airflow status
- Hướng dẫn trigger DAG (nếu Airflow available)

**Bạn sẽ thấy:**
```
STEP 7: Airflow Orchestration
Checking Airflow status...
✓ Airflow is running

Airflow UI: http://localhost:8080
Login: admin / admin

To trigger DAG:
  1. Go to Airflow UI
  2. Enable DAG: kafka_flink_pipeline
  3. Trigger DAG

Or trigger via CLI:
✓ DAG triggered
```

**Thao tác:**
- 🌐 **Mở browser** (tùy chọn): http://localhost:8080
- 🔐 **Login:** admin / admin
- 👀 **Xem** DAG trong Airflow UI
- ✅ **Hiểu:** Airflow có thể orchestrate toàn bộ workflow
- ⏳ **Đợi** script tự động tiếp tục

**Thời gian:** ~5 giây

---

### STEP 8: Final Verification

**Chuyện gì xảy ra:**
- Script check health của tất cả services
- So sánh Kafka messages vs Cassandra records
- Hiển thị summary

**Bạn sẽ thấy:**
```
STEP 8: Final Verification
Checking all services health...
  Kafka: ✓
  Flink: ✓
  Cassandra: ✓
  Airflow: ✓

Data integrity check:
  Kafka messages: 100
  Cassandra records: 100
  Difference: 0
  ✓ Data integrity OK

========================================
✓ DEMO 7 COMPLETED!
========================================

Kết quả:
  ✅ Toàn bộ pipeline hoạt động end-to-end
  ✅ Data được xử lý và lưu trữ đúng
  ✅ Tất cả services healthy
  ✅ Airflow orchestration available

Summary:
  - Kafka messages: 100
  - Cassandra records: 100
  - Services: All running
```

**Thao tác:**
- 👀 **Xem** tất cả services đều healthy
- 👀 **Xem** data integrity check
- 👀 **Xem** summary
- ✅ **Verify:** 
  - Tất cả services running
  - Data integrity OK (difference < 10)
  - Pipeline hoạt động end-to-end
- ⌨️ **Nhấn Enter** để kết thúc demo

**Thời gian:** ~10 giây

---

## ✅ Kết quả mong đợi

Sau khi hoàn thành demo, bạn sẽ:

1. ✅ **Hiểu toàn bộ workflow** từ đầu đến cuối
2. ✅ **Verify pipeline hoạt động** đúng
3. ✅ **Biết cách monitor** và verify
4. ✅ **Hiểu data flow** qua các components

## 🔍 Kiểm tra thêm (tùy chọn)

### Verify trong Flink UI

1. Mở: http://localhost:8081
2. Click vào job đang chạy
3. Xem:
   - **Metrics:** Throughput, latency
   - **Checkpoints:** Recovery points
   - **Task Managers:** Resource usage

### Verify trong Airflow UI

1. Mở: http://localhost:8080
2. Enable và trigger DAG: `kafka_flink_pipeline`
3. Monitor DAG execution
4. Xem task logs

### Query Data

```bash
# Count records
docker exec cassandra cqlsh -e "SELECT COUNT(*) FROM realtime.users;"

# Sample data
docker exec cassandra cqlsh -e "SELECT * FROM realtime.users LIMIT 10;"

# Export to CSV
docker exec cassandra cqlsh -e "COPY realtime.users TO '/tmp/users.csv' WITH HEADER = true;"
```

## ⚠️ Troubleshooting

**Nếu services không start:**
- Check Docker: `docker ps`
- Check logs: `docker compose logs`
- Verify ports không bị chiếm: `lsof -i :8080,8081,9042,9092`

**Nếu data không xuất hiện:**
- Đợi thêm 30-60 giây (Flink có thể đang xử lý)
- Check Flink job: http://localhost:8081
- Check Flink logs: `docker compose logs flink-taskmanager`

**Nếu data integrity check fail:**
- Đợi thêm 30 giây (messages có thể đang xử lý)
- Check Kafka có messages: `docker exec kafka kafka-console-consumer --bootstrap-server localhost:9092 --topic users --from-beginning --max-messages 5`
- Check Flink job status

**Nếu Airflow không accessible:**
- Đợi thêm 60 giây (Airflow cần thời gian khởi động)
- Check logs: `docker compose logs airflow-webserver`
- Verify MySQL: `docker compose ps mysql`

---

## 📊 Performance Expectations

**Expected timings:**
- Services startup: ~90 giây
- Data generation (100 messages): ~10-15 giây
- Data processing: ~30-60 giây
- **Total demo time:** ~3-5 phút

**Expected results:**
- Kafka messages: 100
- Cassandra records: 100
- Data integrity: Difference < 10
- All services: Healthy

---

**Chúc bạn demo thành công! 🚀**

