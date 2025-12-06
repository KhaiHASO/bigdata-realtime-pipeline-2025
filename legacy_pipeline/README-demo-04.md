# README - Demo 04: Xử Lý Lỗi và Recovery

## 📋 Tổng quan

Demo này test **khả năng xử lý lỗi và recovery** của pipeline. Bạn sẽ thấy hệ thống tự động recover sau khi các services bị crash hoặc restart.

## 🚀 Cách chạy

**Double-click vào file:** `demo-04.sh`

Hoặc chạy trong terminal:
```bash
./demo-04.sh
```

## 📖 Chi tiết từng bước

### Scenario 1: Flink Job Crash và Recovery

**Mục tiêu:** Test xem Flink có thể recover và xử lý messages đã tích lũy trong Kafka không.

#### Bước 1: Lấy Initial Count

**Chuyện gì xảy ra:**
- Script đếm số records hiện tại trong Cassandra
- Lưu số này để so sánh sau khi recovery

**Bạn sẽ thấy:**
```
SCENARIO 1: Flink Job Crash và Recovery
Getting initial record count...
Initial records: 25
```

**Thao tác:**
- 👀 **Xem** initial count (ghi nhớ số này)
- ⌨️ **Nhấn Enter** để tiếp tục

---

#### Bước 2: Stop Flink TaskManager

**Chuyện gì xảy ra:**
- Script dừng Flink TaskManager container
- Flink job sẽ **crash** và không thể xử lý messages từ Kafka

**Bạn sẽ thấy:**
```
Stopping Flink TaskManager...
✓ Flink TaskManager stopped
```

**Thao tác:**
- ⚠️ **Lưu ý:** Flink đã bị dừng, không thể xử lý data
- ⌨️ **Nhấn Enter** để tiếp tục

**Kiểm tra (tùy chọn):**
- Mở Flink UI: http://localhost:8081
- Bạn sẽ thấy job bị failed hoặc không còn running

---

#### Bước 3: Gửi Messages vào Kafka (Flink đang down)

**Chuyện gì xảy ra:**
- Producer vẫn có thể gửi messages vào Kafka
- Kafka sẽ **lưu** messages (vì Kafka là persistent)
- Flink không thể đọc (vì đang down)

**Bạn sẽ thấy:**
```
Sending messages to Kafka (Flink is down)...
✓ Connected to Kafka at ['localhost:9092']
📤 Starting to send 10 messages...
[1/10] ✓ Sent user: ...
...
✓ Messages sent to Kafka
```

**Thao tác:**
- 👀 **Xem** messages được gửi thành công vào Kafka
- ✅ **Hiểu:** Messages đã được lưu trong Kafka, chờ Flink xử lý
- ⌨️ **Nhấn Enter** để tiếp tục

**Lưu ý quan trọng:** Đây chứng minh Kafka **không mất data** ngay cả khi consumer (Flink) down!

---

#### Bước 4: Restart Flink và Verify Recovery

**Chuyện gì xảy ra:**
- Script khởi động lại Flink TaskManager
- Flink job sẽ tự động restart
- Flink sẽ đọc **từ đầu** (earliest offset) và xử lý tất cả messages đã tích lũy

**Bạn sẽ thấy:**
```
Restarting Flink TaskManager...
Waiting for Flink to recover...
Checking Flink logs...
...
Verifying recovery - checking record count...
Final records: 35
New records processed: 10
✓ Recovery successful! Data was processed after restart
```

**Thao tác:**
- 👀 **Xem** Flink logs để thấy job restart
- 👀 **Xem** final count (nên = initial + 10)
- ✅ **Verify:** "New records processed" = số messages đã gửi khi Flink down
- ⌨️ **Nhấn Enter** để tiếp tục

**Kết quả mong đợi:**
- ✅ Flink tự động recover
- ✅ Tất cả messages đã tích lũy được xử lý
- ✅ Không mất data!

---

### Scenario 2: Kafka Restart

**Mục tiêu:** Test xem Producer có thể retry khi Kafka restart không.

#### Bước 1: Stop Kafka

**Chuyện gì xảy ra:**
- Script dừng Kafka container
- Producer sẽ **không thể** kết nối đến Kafka

**Bạn sẽ thấy:**
```
SCENARIO 2: Kafka Restart
Stopping Kafka...
✓ Kafka stopped
```

**Thao tác:**
- ⌨️ **Nhấn Enter** để tiếp tục

---

#### Bước 2: Producer Fail (Expected)

**Chuyện gì xảy ra:**
- Producer cố gắng kết nối đến Kafka
- Sẽ **fail** với connection error (đây là expected behavior)

**Bạn sẽ thấy:**
```
Attempting to send messages (Kafka is down)...
✓ Expected error: KafkaError
```

**Thao tác:**
- 👀 **Xem** error message (đây là expected!)
- ✅ **Hiểu:** Producer không thể gửi khi Kafka down
- ⌨️ **Nhấn Enter** để tiếp tục

---

#### Bước 3: Restart Kafka

**Chuyện gì xảy ra:**
- Script khởi động lại Kafka
- Đợi Kafka sẵn sàng (15 giây)

**Bạn sẽ thấy:**
```
Restarting Kafka...
Waiting for Kafka to be ready...
```

**Thao tác:**
- ⏳ **Đợi** Kafka khởi động
- ⌨️ **Nhấn Enter** để tiếp tục

---

#### Bước 4: Producer Retry (Success)

**Chuyện gì xảy ra:**
- Producer retry gửi messages
- Lần này sẽ **thành công** vì Kafka đã up

**Bạn sẽ thấy:**
```
Sending messages again (Kafka is up)...
✓ Connected to Kafka at ['localhost:9092']
📤 Starting to send 5 messages...
[1/5] ✓ Sent user: ...
...
✓ Messages sent successfully after Kafka restart
```

**Thao tác:**
- 👀 **Xem** messages được gửi thành công
- ✅ **Hiểu:** Producer có thể retry sau khi Kafka recover
- ⌨️ **Nhấn Enter** để tiếp tục

**Kết quả mong đợi:**
- ✅ Producer có khả năng retry
- ✅ Không mất messages khi retry thành công

---

### Scenario 3: Cassandra Restart

**Mục tiêu:** Test xem Flink có thể retry write khi Cassandra restart không.

#### Bước 1: Lấy Count trước khi Restart

**Chuyện gì xảy ra:**
- Script đếm records trước khi restart Cassandra
- Lưu số này để so sánh

**Bạn sẽ thấy:**
```
SCENARIO 3: Cassandra Restart
Getting current record count...
Records before Cassandra restart: 40
```

**Thao tác:**
- 👀 **Xem** count trước restart
- ⌨️ **Nhấn Enter** để tiếp tục

---

#### Bước 2: Stop Cassandra

**Chuyện gì xảy ra:**
- Script dừng Cassandra container
- Flink sẽ **không thể** ghi vào Cassandra

**Bạn sẽ thấy:**
```
Stopping Cassandra...
✓ Cassandra stopped
```

**Thao tác:**
- ⌨️ **Nhấn Enter** để tiếp tục

---

#### Bước 3: Gửi Messages (Cassandra down)

**Chuyện gì xảy ra:**
- Producer gửi messages vào Kafka
- Flink đọc từ Kafka nhưng **fail** khi ghi vào Cassandra
- Flink sẽ retry (theo retry policy)

**Bạn sẽ thấy:**
```
Sending messages to Kafka (Cassandra is down)...
✓ Messages sent to Kafka

Checking Flink logs for errors...
[ERROR] Failed to connect to Cassandra
[ERROR] Retrying write...
```

**Thao tác:**
- 👀 **Xem** Flink logs có errors về Cassandra connection
- ✅ **Hiểu:** Flink đang retry nhưng fail vì Cassandra down
- ⌨️ **Nhấn Enter** để tiếp tục

---

#### Bước 4: Restart Cassandra và Verify Recovery

**Chuyện gì xảy ra:**
- Script khởi động lại Cassandra
- Đợi Cassandra sẵn sàng (30 giây)
- Flink sẽ tự động retry và ghi thành công

**Bạn sẽ thấy:**
```
Restarting Cassandra...
Waiting for Cassandra to be ready...
Checking Flink recovery...
...
Verifying data was written after recovery...
Records after Cassandra restart: 50
✓ Recovery successful! Data was written after Cassandra restart
New records: 10
```

**Thao tác:**
- 👀 **Xem** Flink logs để thấy recovery
- 👀 **Xem** final count (nên = before + số messages đã gửi)
- ✅ **Verify:** "New records" = số messages đã gửi khi Cassandra down
- ⌨️ **Nhấn Enter** để tiếp tục

**Kết quả mong đợi:**
- ✅ Flink tự động retry sau khi Cassandra recover
- ✅ Tất cả messages được ghi thành công
- ✅ Không mất data!

---

## ✅ Kết quả mong đợi

Sau khi hoàn thành demo, bạn sẽ hiểu:

1. ✅ **Pipeline có khả năng recovery** sau khi service restart
2. ✅ **Kafka không mất data** - messages được lưu persistent
3. ✅ **Flink retry tự động** - xử lý lại messages đã tích lũy
4. ✅ **Producer có thể retry** - kết nối lại sau khi Kafka recover

## 🔍 Kiểm tra thêm (tùy chọn)

### Xem Kafka Offsets

```bash
# Xem offsets trong Kafka (messages đã được lưu)
docker exec kafka kafka-run-class kafka.tools.GetOffsetShell \
  --broker-list localhost:9092 \
  --topic users \
  --time -1
```

### Xem Flink Checkpoints

1. Mở Flink UI: http://localhost:8081
2. Click vào job
3. Xem tab "Checkpoints" để thấy recovery points

### Monitor Retry Behavior

```bash
# Xem Flink logs để thấy retry attempts
docker compose logs flink-taskmanager | grep -i "retry\|error\|exception"
```

## ⚠️ Troubleshooting

**Nếu Flink không recover:**
- Check Flink job config: `scan.startup.mode = earliest-offset`
- Verify Kafka có messages: `docker exec kafka kafka-console-consumer --bootstrap-server localhost:9092 --topic users --from-beginning --max-messages 5`
- Restart Flink manually: `docker compose restart flink-taskmanager`

**Nếu Producer không retry:**
- Check producer code có retry logic
- Verify Kafka đã sẵn sàng: `docker compose ps kafka`
- Try send lại manually

**Nếu Cassandra không recover:**
- Check Cassandra logs: `docker compose logs cassandra`
- Verify Cassandra sẵn sàng: `docker exec cassandra nodetool status`
- Check Flink connection: `docker compose logs flink-taskmanager | grep -i cassandra`

---

**Chúc bạn demo thành công! 🚀**

