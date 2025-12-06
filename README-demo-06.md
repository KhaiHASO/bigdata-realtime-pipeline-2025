# README - Demo 06: Query và Analysis

## 📋 Tổng quan

Demo này hướng dẫn **query và analyze data** trong Cassandra. Bạn sẽ học cách sử dụng CQL (Cassandra Query Language) để truy vấn và phân tích data.

## 🚀 Cách chạy

**Double-click vào file:** `demo-06.sh`

Hoặc chạy trong terminal:
```bash
./demo-06.sh
```

## 📖 Chi tiết từng bước

### Bước 1: Basic Queries

**Chuyện gì xảy ra:**
- Script đếm tổng số records trong table `users`
- Hiển thị 10 records mẫu đầu tiên

**Bạn sẽ thấy:**
```
[STEP 1] Basic Queries
Total record count:
50 records

Sample records (first 10):
 id                                   | name         | email                    | ts
--------------------------------------+--------------+--------------------------+-------------------------
 123e4567-e89b-12d3-a456-426614174000 | Alice Smith  | alice.smith@example.com  | 2024-12-05 10:30:00+0000
 123e4567-e89b-12d3-a456-426614174001 | Bob Johnson  | bob.johnson@example.com  | 2024-12-05 10:30:05+0000
 ...
```

**Thao tác:**
- 👀 **Xem** total count để biết có bao nhiêu records
- 👀 **Xem** sample records để hiểu cấu trúc data
- ✅ **Hiểu:** Mỗi record có: id (UUID), name, email, ts (timestamp)
- ⌨️ **Nhấn Enter** để tiếp tục

**Lưu ý:** Nếu count = 0, có thể chưa có data. Chạy demo-01 hoặc demo-02 trước.

---

### Bước 2: Query by Email (sử dụng index)

**Chuyện gì xảy ra:**
- Script lấy một email mẫu từ table
- Query user bằng email đó (sử dụng index)
- Hiển thị danh sách unique email domains

**Bạn sẽ thấy:**
```
[STEP 2] Query by Email
Getting a sample email to query...
Querying user by email: alice.smith@example.com
 id                                   | name        | email                    | ts
--------------------------------------+-------------+--------------------------+-------------------------
 123e4567-e89b-12d3-a456-426614174000 | Alice Smith | alice.smith@example.com  | 2024-12-05 10:30:00+0000

Listing unique email domains (first 10):
example.com
test.com
demo.org
...
```

**Thao tác:**
- 👀 **Xem** query result để verify index hoạt động
- 👀 **Xem** email domains để hiểu data distribution
- ✅ **Hiểu:** Index trên email cho phép query nhanh
- ⌨️ **Nhấn Enter** để tiếp tục

**Lưu ý:** Query by email sử dụng index được tạo trong `init.cql`:
```sql
CREATE INDEX idx_users_email ON users (email);
```

---

### Bước 3: Time-based Queries

**Chuyện gì xảy ra:**
- Script hiển thị most recent users
- Giải thích về time-based queries trong Cassandra

**Bạn sẽ thấy:**
```
[STEP 3] Time-based Queries
Most recent users (by timestamp):
 id                                   | name        | email                    | ts
--------------------------------------+-------------+--------------------------+-------------------------
 123e4567-e89b-12d3-a456-426614174050 | Tina Lee    | tina.lee@example.com      | 2024-12-05 10:35:00+0000
 ...

Oldest users (if we had ordering):
Note: Cassandra requires ALLOW FILTERING for time range queries without proper clustering key
```

**Thao tác:**
- 👀 **Xem** recent users để thấy data mới nhất
- 👀 **Đọc** note về time-based queries
- ✅ **Hiểu:** 
  - Cassandra cần clustering key để query theo time range hiệu quả
  - `ALLOW FILTERING` cho phép query nhưng chậm hơn
- ⌨️ **Nhấn Enter** để tiếp tục

**Lưu ý:** Để query theo time range hiệu quả, nên thiết kế table với clustering key:
```sql
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT,
    ts TIMESTAMP,
    -- Better design: ts TIMESTAMP, PRIMARY KEY (id, ts)
);
```

---

### Bước 4: Data Analysis

**Chuyện gì xảy ra:**
- Script hiển thị top 10 most recent users
- Phân tích email domain distribution
- Đếm số unique emails

**Bạn sẽ thấy:**
```
[STEP 4] Data Analysis
Top 10 most recent users:
 id                                   | name         | email                    | ts
--------------------------------------+--------------+--------------------------+-------------------------
 ...

Email domain distribution:
   5 example.com
   3 test.com
   2 demo.org
   ...

Total unique emails:
25 unique emails
```

**Thao tác:**
- 👀 **Xem** top recent users
- 👀 **Xem** domain distribution để hiểu data pattern
- 👀 **Xem** unique emails count
- ✅ **Hiểu:** Data analysis giúp hiểu data characteristics
- ⌨️ **Nhấn Enter** để tiếp tục

**Lưu ý:** Domain distribution cho thấy:
- Data được generate ngẫu nhiên từ các domains khác nhau
- Có thể dùng để verify data quality

---

### Bước 5: Export Data

**Chuyện gì xảy ra:**
- Script export data từ Cassandra sang CSV
- Copy file từ container ra host
- Hiển thị file info và sample content

**Bạn sẽ thấy:**
```
[STEP 5] Export Data
Exporting data to CSV...
✓ Data exported to /tmp/users.csv in container
Copying file to host...
✓ File copied to ./users_export.csv

First 10 lines of exported file:
id,name,email,ts
123e4567-e89b-12d3-a456-426614174000,Alice Smith,alice.smith@example.com,2024-12-05 10:30:00+0000
...

File size: 5.2K
Total lines: 51
```

**Thao tác:**
- 👀 **Xem** export process
- 👀 **Xem** sample CSV content
- 👀 **Xem** file size và line count
- ✅ **Verify:** File đã được export thành công
- ⌨️ **Nhấn Enter** để tiếp tục

**File location:** `./users_export.csv` trong project directory

**Sử dụng file:**
- Mở bằng Excel, Google Sheets
- Import vào database khác
- Analyze bằng Python/R
- Share với team

---

## ✅ Kết quả mong đợi

Sau khi hoàn thành demo, bạn sẽ:

1. ✅ **Biết cách query** data trong Cassandra
2. ✅ **Hiểu cách sử dụng index** để query nhanh
3. ✅ **Biết cách export** data để analysis
4. ✅ **Hiểu** data structure và characteristics

## 🔍 Kiểm tra thêm (tùy chọn)

### Manual CQL Queries

Connect trực tiếp vào Cassandra:

```bash
docker exec -it cassandra cqlsh
```

Trong cqlsh:
```sql
USE realtime;

-- Count records
SELECT COUNT(*) FROM users;

-- Query by email
SELECT * FROM users WHERE email = 'alice.smith@example.com';

-- View all columns
SELECT * FROM users LIMIT 10;

-- Query with filtering (slow but works)
SELECT * FROM users WHERE ts > '2024-01-01' ALLOW FILTERING;
```

### Advanced Queries

**Aggregation:**
```sql
-- Count by domain (requires ALLOW FILTERING)
SELECT email, COUNT(*) FROM users GROUP BY email ALLOW FILTERING;
```

**Time range:**
```sql
-- Users created today
SELECT * FROM users WHERE ts > dateOf(now()) - 1d ALLOW FILTERING;
```

### Export Options

**Export to JSON:**
```bash
docker exec cassandra cqlsh -e "
SELECT json * FROM realtime.users LIMIT 10;
" > users.json
```

**Export specific columns:**
```bash
docker exec cassandra cqlsh -e "
COPY realtime.users (name, email) TO '/tmp/users_names.csv' WITH HEADER = true;
"
```

### Data Analysis với Python

Sử dụng file CSV đã export:

```python
import pandas as pd

# Load CSV
df = pd.read_csv('users_export.csv')

# Analysis
print(f"Total records: {len(df)}")
print(f"Unique emails: {df['email'].nunique()}")
print(f"Domains: {df['email'].str.split('@').str[1].value_counts()}")
```

## ⚠️ Troubleshooting

**Nếu query chậm:**
- Check index có tồn tại: `DESCRIBE INDEX idx_users_email;`
- Verify table structure: `DESCRIBE TABLE users;`
- Consider adding more indexes nếu cần

**Nếu export fail:**
- Check table có data: `SELECT COUNT(*) FROM users;`
- Verify permissions: `docker exec cassandra ls -la /tmp/`
- Try export smaller batch: `LIMIT 100`

**Nếu query by email không work:**
- Verify index exists: `DESCRIBE INDEX idx_users_email;`
- Check email format matches
- Try recreating index: `DROP INDEX idx_users_email; CREATE INDEX ...`

---

**Chúc bạn demo thành công! 🚀**

