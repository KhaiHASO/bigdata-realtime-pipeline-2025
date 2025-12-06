# README - Demo 03: Airflow Orchestration

## 📋 Tổng quan

Demo này test **Airflow DAG** để orchestrate toàn bộ pipeline. Bạn sẽ học cách sử dụng Airflow để tự động hóa workflow: Producer → Flink → Verification.

## 🚀 Cách chạy

**Double-click vào file:** `demo-03.sh`

Hoặc chạy trong terminal:
```bash
./demo-03.sh
```

## 📖 Chi tiết từng bước

### Bước 1: Truy cập Airflow UI

**Chuyện gì xảy ra:**
- Script kiểm tra Airflow webserver có đang chạy không
- Verify Airflow health endpoint
- Hiển thị thông tin login

**Bạn sẽ thấy:**
```
[STEP 1] Truy cập Airflow UI
Checking Airflow webserver...
✓ Airflow webserver is running

Airflow UI: http://localhost:8080
Login credentials:
  Username: admin
  Password: admin

Please open Airflow UI in your browser and login
```

**Thao tác:**
- 🌐 **Mở browser** và truy cập: http://localhost:8080
- 🔐 **Login** với:
  - Username: `admin`
  - Password: `admin`
- 👀 **Xem** Airflow dashboard
- ✅ Khi thấy "✓ Step completed! Press Enter to continue..."
- ⌨️ **Nhấn Enter** để tiếp tục

**Thời gian:** ~10 giây (để bạn login)

**Lưu ý:** Nếu Airflow chưa sẵn sàng, đợi thêm 30-60 giây và refresh browser.

---

### Bước 2: Enable DAG

**Chuyện gì xảy ra:**
- Script kiểm tra DAG `kafka_flink_pipeline` có tồn tại không
- Hiển thị DAG status

**Bạn sẽ thấy:**
```
[STEP 2] Enable DAG
Checking DAG status...
DAG found:
kafka_flink_pipeline

In Airflow UI:
  1. Find DAG: 'kafka_flink_pipeline'
  2. Toggle ON to enable DAG
```

**Thao tác:**
- 🌐 **Trong Airflow UI:**
  1. Tìm DAG tên: `kafka_flink_pipeline` trong danh sách
  2. Toggle switch bên trái DAG name từ **OFF** → **ON** (màu xanh)
  3. DAG sẽ chuyển từ màu xám sang màu xanh lá
- ✅ Khi đã enable DAG
- ⌨️ **Nhấn Enter** trong terminal để tiếp tục

**Thời gian:** ~10 giây

**Hình ảnh mô tả:**
```
DAGs List:
┌─────────────────────────────────────┐
│ [ON] kafka_flink_pipeline    [▶️]   │  ← Toggle này phải ON (xanh)
│ [OFF] other_dag              [▶️]   │
└─────────────────────────────────────┘
```

---

### Bước 3: Trigger DAG manually

**Chuyện gì xảy ra:**
- Script cố gắng trigger DAG qua CLI
- Nếu thành công, DAG sẽ bắt đầu chạy
- Nếu không, bạn cần trigger thủ công trong UI

**Bạn sẽ thấy:**
```
[STEP 3] Trigger DAG manually
Triggering DAG via CLI...
✓ DAG triggered successfully

In Airflow UI:
  1. Click on DAG 'kafka_flink_pipeline'
  2. Click 'Play' button (▶️) to trigger
  3. Select 'Trigger DAG'
```

**Thao tác:**

**Option 1: Nếu script trigger thành công**
- 👀 **Xem** DAG bắt đầu chạy trong Airflow UI
- Tiếp tục bước 4

**Option 2: Nếu cần trigger thủ công**
- 🌐 **Trong Airflow UI:**
  1. Click vào DAG name: `kafka_flink_pipeline`
  2. Click nút **"Play"** (▶️) ở góc trên bên phải
  3. Chọn **"Trigger DAG"** trong popup
  4. DAG run mới sẽ xuất hiện

- ✅ Khi thấy DAG run mới xuất hiện
- ⌨️ **Nhấn Enter** trong terminal để tiếp tục

**Thời gian:** ~5-10 giây

**Hình ảnh mô tả:**
```
DAG View:
┌─────────────────────────────────────┐
│ kafka_flink_pipeline          [▶️]  │  ← Click nút Play này
└─────────────────────────────────────┘
```

---

### Bước 4: Monitor DAG Execution

**Chuyện gì xảy ra:**
- Script check DAG runs qua CLI
- Hiển thị recent DAG runs

**Bạn sẽ thấy:**
```
[STEP 4] Monitor DAG Execution
Monitoring DAG runs...
Checking DAG status (attempt 1/10)...
run_id              | state    | start_date
---------------------+----------+-------------------
manual__2024-12-05  | running  | 2024-12-05 10:30:00

In Airflow UI:
  - Click on DAG to see Graph View
  - View tasks: wait_for_services, run_producer, submit_flink_job, verify_cassandra
```

**Thao tác:**
- 🌐 **Trong Airflow UI:**
  1. Click vào DAG name để vào **Graph View**
  2. Bạn sẽ thấy 4 tasks:
     - `wait_for_services` (màu xanh = success, màu vàng = running)
     - `run_producer` 
     - `submit_flink_job`
     - `verify_cassandra`
  3. Click vào từng task để xem:
     - **Status** (success/running/failed)
     - **Logs** (click vào task → View Log)
     - **Duration** (thời gian chạy)

- 👀 **Quan sát** tasks chuyển từ:
  - Màu xám (queued) → Màu vàng (running) → Màu xanh (success)
- ⏳ **Đợi** tất cả tasks chuyển sang màu xanh
- ✅ Khi tất cả tasks completed
- ⌨️ **Nhấn Enter** trong terminal để tiếp tục

**Thời gian:** ~2-5 phút (tùy vào DAG execution time)

**Hình ảnh mô tả:**
```
Graph View:
┌─────────────────┐
│ wait_for_       │  ← Màu xanh = success
│ services        │
└────────┬────────┘
         │
┌────────▼────────┐
│ run_producer    │  ← Màu vàng = running
└────────┬────────┘
         │
┌────────▼────────┐
│ submit_flink_   │  ← Màu xám = queued
│ job             │
└────────┬────────┘
         │
┌────────▼────────┐
│ verify_         │
│ cassandra       │
└─────────────────┘
```

---

### Bước 5: Check Logs

**Chuyện gì xảy ra:**
- Script hiển thị recent Airflow scheduler logs
- Hiển thị recent Airflow webserver logs

**Bạn sẽ thấy:**
```
[STEP 5] Check Logs
Recent Airflow scheduler logs:
[2024-12-05 10:30:15] Task 'run_producer' succeeded
[2024-12-05 10:30:20] Task 'submit_flink_job' started
...

In Airflow UI:
  - Click on a task → View Logs
```

**Thao tác:**
- 🌐 **Trong Airflow UI:**
  1. Click vào một task (ví dụ: `run_producer`)
  2. Click nút **"Log"** ở trên cùng
  3. Xem logs chi tiết của task đó
  4. Scroll để xem toàn bộ output

- 👀 **Xem** logs để hiểu:
  - Task đã làm gì
  - Có lỗi gì không
  - Output là gì

- ✅ Khi đã xem xong logs
- ⌨️ **Nhấn Enter** trong terminal để tiếp tục

**Thời gian:** ~30 giây (để bạn xem logs)

---

### Bước 6: Verify Results

**Chuyện gì xảy ra:**
- Script đếm số records trong Cassandra
- Hiển thị sample records

**Bạn sẽ thấy:**
```
[STEP 6] Verify Results
Checking data in Cassandra...
Total records in Cassandra: 15

Sample records:
 id                                   | name        | email                    | ts
--------------------------------------+-------------+--------------------------+-------------------------
 123e4567-e89b-12d3-a456-426614174000 | Alice Smith | alice.smith@example.com | 2024-12-05 10:30:00+0000
 ...
```

**Thao tác:**
- 👀 **Xem** total records (số lượng tùy vào DAG đã chạy)
- 👀 **Xem** sample records để verify data
- ✅ Khi thấy summary:
  ```
  ✓ DEMO 3 COMPLETED!
  Kết quả:
    ✅ DAG chạy thành công
    ✅ Tất cả tasks completed
    ✅ Data được tạo và verify (15 records)
  ```
- ⌨️ **Nhấn Enter** để kết thúc demo

**Thời gian:** ~5 giây

---

## ✅ Kết quả mong đợi

Sau khi hoàn thành demo, bạn sẽ:

1. ✅ **Hiểu cách sử dụng Airflow UI**
2. ✅ **Biết cách enable và trigger DAG**
3. ✅ **Biết cách monitor DAG execution**
4. ✅ **Biết cách xem task logs**
5. ✅ **Verify data được tạo bởi DAG**

## 🔍 Kiểm tra thêm (tùy chọn)

### Xem DAG Code

1. Trong Airflow UI, click vào DAG name
2. Click tab **"Code"** để xem DAG definition
3. Xem file: `airflow/dags/kafka_flink_dag.py`

### Xem Task Details

1. Click vào một task
2. Xem các tabs:
   - **Task Instance Details** - thông tin chi tiết
   - **Logs** - logs của task
   - **Rendered Template** - template đã render
   - **XCom** - data được pass giữa tasks

### Re-run Failed Tasks

Nếu có task failed:
1. Click vào task failed
2. Click **"Clear"** để clear state
3. DAG sẽ tự động re-run task đó

## ⚠️ Troubleshooting

**Nếu Airflow UI không load:**
- Đợi thêm 30-60 giây (Airflow có thể đang khởi động)
- Check logs: `docker compose logs airflow-webserver`
- Verify port 8080 không bị chiếm: `lsof -i :8080`

**Nếu DAG không xuất hiện:**
- Check DAG file: `airflow/dags/kafka_flink_dag.py`
- Check Airflow logs: `docker compose logs airflow-scheduler | grep -i error`
- Restart Airflow: `docker compose restart airflow-scheduler`

**Nếu DAG không trigger:**
- Verify DAG đã được enable (toggle ON)
- Check DAG không bị paused
- Try trigger lại trong UI

**Nếu task failed:**
- Click vào task → View Logs để xem lỗi
- Check dependencies (Kafka, Cassandra, Flink đang chạy)
- Clear task và re-run

---

**Chúc bạn demo thành công! 🚀**

