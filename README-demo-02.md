# README - Demo 02: Real-Time Streaming

## 📋 Tổng quan

Demo này test **real-time streaming** với continuous data flow. Bạn sẽ thấy data được xử lý và xuất hiện trong Cassandra ngay sau khi producer gửi.

## 🚀 Cách chạy

**Double-click vào file:** `demo-02.sh`

Hoặc chạy trong terminal:
```bash
./demo-02.sh
```

## 📖 Chi tiết từng bước

### Bước 1: Kiểm tra Flink Job

**Chuyện gì xảy ra:**
- Script kiểm tra xem Flink job có đang chạy không
- Nếu không có job nào, script sẽ tự động submit job mới
- Hiển thị Flink UI link và recent logs

**Bạn sẽ thấy:**
```
[STEP 1] Kiểm tra Flink Job
Checking Flink job status...
✓ Flink job is running
Flink UI: http://localhost:8081
Recent Flink logs:
...
```

**Thao tác:**
- 👀 **Xem** output để confirm Flink job đang chạy
- 🌐 **Mở browser** (tùy chọn): http://localhost:8081 để xem Flink UI
- ✅ Khi thấy "✓ Step completed! Press Enter to continue..."
- ⌨️ **Nhấn Enter** để tiếp tục

**Thời gian:** ~5 giây

---

### Bước 2: Chạy Producer liên tục

**Chuyện gì xảy ra:**
- Script chạy producer trong **background** (không block terminal)
- Producer sẽ gửi **50 batches**, mỗi batch có **1 message**
- Delay **2 giây** giữa các batch
- Tổng cộng: **50 messages** trong khoảng **100 giây**

**Bạn sẽ thấy:**
```
[STEP 2] Chạy Producer liên tục
Starting continuous producer (50 batches, 1 message each, 2s delay)...
This will run in the background...
Starting to send messages...
✓ Sent batch 1/50
✓ Sent batch 2/50
...
Producer running in background (PID: 12345)
```

**Thao tác:**
- 👀 **Xem** producer bắt đầu gửi messages
- ⚠️ **Lưu ý:** Producer chạy trong background, bạn có thể tiếp tục
- ✅ Khi thấy "✓ Step completed! Press Enter to continue..."
- ⌨️ **Nhấn Enter** để tiếp tục (producer vẫn chạy ở background)

**Thời gian:** ~10 giây (để producer bắt đầu)

---

### Bước 3: Monitor Real-Time Processing

**Chuyện gì xảy ra:**
- Script sẽ **monitor** số lượng records trong Cassandra mỗi **2 giây**
- Hiển thị **15 lần** (tổng 30 giây)
- Bạn sẽ thấy số lượng records **tăng dần** theo thời gian thực

**Bạn sẽ thấy:**
```
[STEP 3] Monitor Real-Time Processing
Monitoring data flow for 30 seconds...

[10:30:15] Records in Cassandra: 5
[10:30:17] Records in Cassandra: 8
[10:30:19] Records in Cassandra: 12
[10:30:21] Records in Cassandra: 15
[10:30:23] Records in Cassandra: 18
...
```

**Thao tác:**
- 👀 **Quan sát** số lượng records **tăng dần** mỗi 2 giây
- 📈 **Xem** real-time processing đang hoạt động
- ⏳ **Đợi** 30 giây để xem data flow
- ✅ Khi thấy "✓ Step completed! Press Enter to continue..."
- ⌨️ **Nhấn Enter** để tiếp tục

**Thời gian:** ~30 giây

**Lưu ý:** Đây là phần quan trọng nhất của demo - bạn sẽ thấy data được xử lý real-time!

---

### Bước 4: Verify Real-Time Processing

**Chuyện gì xảy ra:**
- Script đợi producer hoàn thành (nếu chưa xong)
- Đếm số records cuối cùng trong Cassandra
- Hiển thị 5 records mẫu gần nhất

**Bạn sẽ thấy:**
```
[STEP 4] Verify Real-Time Processing
Final count check...
Final record count: 50

Recent records:
 id                                   | name         | email                    | ts
--------------------------------------+--------------+--------------------------+-------------------------
 123e4567-e89b-12d3-a456-426614174050 | Tina Lee     | tina.lee@example.com     | 2024-12-05 10:32:00+0000
 ...
```

**Thao tác:**
- 👀 **Xem** final count (nên là ~50 records)
- 👀 **Xem** recent records để verify data mới nhất
- ✅ Khi thấy summary:
  ```
  ✓ DEMO 2 COMPLETED!
  Kết quả:
    ✅ Messages được xử lý real-time
    ✅ Data xuất hiện trong Cassandra ngay sau khi producer gửi
    ✅ Không có lag đáng kể giữa Kafka và Cassandra
    ✅ Total records processed: 50
  ```
- ⌨️ **Nhấn Enter** để kết thúc demo

**Thời gian:** ~5-10 giây

---

## ✅ Kết quả mong đợi

Sau khi hoàn thành demo, bạn sẽ thấy:

1. ✅ **~50 records** trong Cassandra (tùy vào số messages producer gửi)
2. ✅ **Real-time processing** - data xuất hiện ngay sau khi producer gửi
3. ✅ **Low latency** - không có lag đáng kể giữa Kafka và Cassandra

## 🔍 Kiểm tra thêm (tùy chọn)

### Monitor trong nhiều terminals

Bạn có thể mở thêm terminals để monitor:

**Terminal 1: Monitor Kafka messages**
```bash
docker exec -it kafka kafka-console-consumer \
  --bootstrap-server localhost:9092 \
  --topic users \
  --from-beginning
```

**Terminal 2: Monitor Cassandra count (real-time)**
```bash
watch -n 2 "docker exec cassandra cqlsh -e 'SELECT COUNT(*) FROM realtime.users;'"
```

**Terminal 3: Monitor Flink logs**
```bash
docker compose logs -f flink-taskmanager
```

### Xem Flink Metrics

1. Mở: http://localhost:8081
2. Click vào job đang chạy
3. Xem tab "Metrics":
   - **Records per second** - throughput
   - **Latency** - độ trễ xử lý
   - **Backpressure** - có bị tắc nghẽn không

## 📊 Phân tích kết quả

**Latency mong đợi:**
- Producer → Kafka: < 100ms
- Kafka → Flink: < 500ms
- Flink → Cassandra: < 1s
- **End-to-end:** < 2-3 giây

**Throughput mong đợi:**
- Flink có thể xử lý: 500-1000 records/second
- Trong demo này: ~1 record mỗi 2 giây (chậm để dễ quan sát)

## ⚠️ Troubleshooting

**Nếu records không tăng:**
- Check Flink job đang chạy: http://localhost:8081
- Check Flink logs: `docker compose logs flink-taskmanager | tail -20`
- Verify producer đang chạy: `ps aux | grep producer`

**Nếu có lag lớn:**
- Check Flink backpressure trong Flink UI
- Check Cassandra write performance: `docker exec cassandra nodetool tablestats realtime.users`
- Có thể cần tăng Flink parallelism

**Nếu producer dừng sớm:**
- Check producer logs trong terminal
- Verify Kafka connection: `docker compose ps kafka`
- Restart producer nếu cần

---

**Chúc bạn demo thành công! 🚀**

