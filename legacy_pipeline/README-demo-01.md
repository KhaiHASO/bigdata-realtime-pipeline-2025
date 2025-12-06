# README - Demo 01: Pipeline Cơ Bản

## 📋 Tổng quan

Demo này sẽ test pipeline cơ bản từ **Producer → Kafka → Flink → Cassandra**. Đây là demo đầu tiên để làm quen với toàn bộ hệ thống.

## 🚀 Cách chạy

**Double-click vào file:** `demo-01.sh`

Hoặc chạy trong terminal:
```bash
./demo-01.sh
```

## 📖 Chi tiết từng bước

### Bước 1: Khởi động hệ thống

**Chuyện gì xảy ra:**
- Script sẽ dừng và xóa tất cả containers/volumes cũ (nếu có)
- Build và khởi động lại tất cả Docker services:
  - Zookeeper
  - Kafka
  - Flink (JobManager + TaskManager)
  - Cassandra
  - MySQL
  - Airflow (Webserver + Scheduler)

**Bạn sẽ thấy:**
```
[STEP 1] Khởi động hệ thống
Dừng và xóa volumes cũ (nếu có)...
Khởi động tất cả services...
Đợi services khởi động (60-90 giây)...
Checking services status...
Services running: 3/8
Services running: 5/8
...
```

**Thao tác:**
- ⏳ **Đợi** cho đến khi thấy "Services running: 8/8" hoặc tất cả services đều "Up"
- 📊 Script sẽ hiển thị status của tất cả containers
- ✅ Khi thấy "✓ Step completed! Press Enter to continue..."
- ⌨️ **Nhấn Enter** để tiếp tục

**Thời gian:** ~60-90 giây

---

### Bước 2: Khởi tạo Cassandra

**Chuyện gì xảy ra:**
- Script đợi Cassandra container sẵn sàng (30 giây)
- Chạy file `init.cql` để tạo:
  - Keyspace: `realtime`
  - Table: `users` với các cột: id, name, email, ts
  - Index trên email

**Bạn sẽ thấy:**
```
[STEP 2] Khởi tạo Cassandra
Đợi Cassandra sẵn sàng...
Khởi tạo keyspace và table...
Verifying keyspace...
CREATE KEYSPACE realtime WITH ...
CREATE TABLE realtime.users ...
```

**Thao tác:**
- ⏳ **Đợi** script chạy xong
- 👀 **Xem** output để verify keyspace và table được tạo
- ✅ Khi thấy "✓ Step completed! Press Enter to continue..."
- ⌨️ **Nhấn Enter** để tiếp tục

**Thời gian:** ~30-40 giây

---

### Bước 3: Tạo Kafka Topic

**Chuyện gì xảy ra:**
- Script tạo Kafka topic tên `users` với:
  - 1 partition
  - Replication factor = 1 (phù hợp cho development)

**Bạn sẽ thấy:**
```
[STEP 3] Tạo Kafka Topic
Tạo topic 'users'...
Verifying topic...
users
```

**Thao tác:**
- 👀 **Xem** output để confirm topic `users` được tạo
- ✅ Khi thấy "✓ Step completed! Press Enter to continue..."
- ⌨️ **Nhấn Enter** để tiếp tục

**Thời gian:** ~5 giây

---

### Bước 4: Chạy Producer

**Chuyện gì xảy ra:**
- Script kiểm tra và cài đặt dependencies (kafka-python) nếu cần
- Chạy producer Python script
- Producer sẽ:
  - Kết nối đến Kafka tại `localhost:9092`
  - Tạo 10 user records ngẫu nhiên (id, name, email, timestamp)
  - Gửi từng message vào Kafka topic `users`
  - Hiển thị progress cho từng message

**Bạn sẽ thấy:**
```
[STEP 4] Chạy Producer
Checking producer dependencies...
Running producer (sending 10 messages)...
✓ Connected to Kafka at ['localhost:9092']
📤 Starting to send 10 messages to topic 'users'...
[1/10] ✓ Sent user: Alice Smith (alice.smith@example.com) -> partition 0, offset 0
[2/10] ✓ Sent user: Bob Johnson (bob.johnson@example.com) -> partition 0, offset 1
...
✓ Finished sending 10 messages to topic 'users'
✓ Producer completed!
```

**Thao tác:**
- 👀 **Xem** từng message được gửi thành công
- ✅ Khi thấy "✓ Producer completed!"
- ⌨️ **Nhấn Enter** để tiếp tục

**Thời gian:** ~5-10 giây

---

### Bước 5: Submit Flink Job

**Chuyện gì xảy ra:**
- Script submit Flink streaming job vào Flink cluster
- Flink job sẽ:
  - Đọc messages từ Kafka topic `users`
  - Parse JSON data
  - Ghi vào Cassandra table `users`

**Bạn sẽ thấy:**
```
[STEP 5] Submit Flink Job
Submitting Flink job...
Waiting for job to start...
Checking Flink UI: http://localhost:8080
Checking job status...
```

**Thao tác:**
- 🌐 **Mở browser** và truy cập: http://localhost:8081
- 👀 **Xem** Flink Web UI:
  - Vào tab "Running Jobs" hoặc "Completed Jobs"
  - Tìm job tên "Kafka to Cassandra Streaming Job"
  - Click vào job để xem chi tiết
- ✅ Khi thấy "✓ Step completed! Press Enter to continue..."
- ⌨️ **Nhấn Enter** để tiếp tục

**Thời gian:** ~15-20 giây

**Lưu ý:** Nếu không thấy job trong Flink UI, có thể job đã chạy xong hoặc đang khởi động. Tiếp tục bước tiếp theo để verify.

---

### Bước 6: Verify Data trong Cassandra

**Chuyện gì xảy ra:**
- Script đếm số records trong Cassandra table `users`
- Hiển thị 5 records mẫu đầu tiên

**Bạn sẽ thấy:**
```
[STEP 6] Verify Data trong Cassandra
Counting records in Cassandra...
Total records: 10

Sample records (first 5):
 id                                   | name        | email                    | ts
--------------------------------------+-------------+--------------------------+-------------------------
 123e4567-e89b-12d3-a456-426614174000 | Alice Smith | alice.smith@example.com | 2024-12-05 10:30:00+0000
 ...
```

**Thao tác:**
- 👀 **Xem** số lượng records (nên là 10)
- 👀 **Xem** sample data để verify data đã được ghi đúng
- ✅ Khi thấy summary:
  ```
  ✓ DEMO 1 COMPLETED!
  Kết quả:
    ✅ Producer gửi thành công messages vào Kafka
    ✅ Flink job đọc từ Kafka và ghi vào Cassandra
    ✅ Data xuất hiện trong Cassandra table (10 records)
  ```
- ⌨️ **Nhấn Enter** để kết thúc demo

**Thời gian:** ~5 giây

---

## ✅ Kết quả mong đợi

Sau khi hoàn thành demo, bạn sẽ có:

1. ✅ **10 user records** trong Cassandra table `users`
2. ✅ **Flink job** đã xử lý và ghi data thành công
3. ✅ **Pipeline hoạt động** từ Producer → Kafka → Flink → Cassandra

## 🔍 Kiểm tra thêm (tùy chọn)

Sau khi demo xong, bạn có thể:

1. **Xem Flink UI:**
   - Mở: http://localhost:8081
   - Xem job metrics, throughput, latency

2. **Query Cassandra:**
   ```bash
   docker exec -it cassandra cqlsh
   USE realtime;
   SELECT COUNT(*) FROM users;
   SELECT * FROM users LIMIT 10;
   ```

3. **Xem Kafka messages:**
   ```bash
   docker exec kafka kafka-console-consumer \
     --bootstrap-server localhost:9092 \
     --topic users \
     --from-beginning \
     --max-messages 5
   ```

## ⚠️ Troubleshooting

**Nếu không thấy data trong Cassandra:**
- Đợi thêm 10-20 giây (Flink có thể đang xử lý)
- Check Flink logs: `docker compose logs flink-taskmanager`
- Verify Flink job đang chạy: http://localhost:8081

**Nếu producer fail:**
- Check Kafka đang chạy: `docker compose ps kafka`
- Verify Kafka topic tồn tại: `docker exec kafka kafka-topics --bootstrap-server localhost:9092 --list`

**Nếu Flink job không start:**
- Check Flink logs: `docker compose logs flink-jobmanager`
- Verify Kafka và Cassandra đang chạy
- Restart Flink: `docker compose restart flink-jobmanager flink-taskmanager`

---

**Chúc bạn demo thành công! 🚀**

