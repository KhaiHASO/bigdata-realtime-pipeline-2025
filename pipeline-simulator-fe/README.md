# Mô Phỏng Pipeline Dữ Liệu Lớn Thời Gian Thực

Ứng dụng frontend đẹp mắt, hoàn toàn chức năng mô phỏng một pipeline xử lý dữ liệu lớn thời gian thực hoàn chỉnh sử dụng **dữ liệu mô phỏng**. Không cần backend, Docker, hay databases!

## 🚀 Khởi Động Nhanh

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Build cho production
npm run build
```

Ứng dụng sẽ có sẵn tại `http://localhost:5173`

## 📋 Tính Năng

- ✅ **Không Cần Setup** - Chỉ cần `npm install` và chạy
- ✅ **Mô Phỏng Thời Gian Thực** - Tạo dữ liệu mô phỏng với cập nhật trực tiếp
- ✅ **Giao Diện Đẹp** - Thiết kế hiện đại với TailwindCSS và Shadcn components
- ✅ **Hoàn Toàn Responsive** - Hoạt động trên desktop, tablet, và mobile
- ✅ **Bảng Điều Khiển Tương Tác** - Click nút, xem cập nhật thời gian thực
- ✅ **Không Cần Backend** - Mọi thứ chạy trong trình duyệt

## 🎯 Các Trang

1. **Tổng Quan** - Sơ đồ pipeline và điều khiển mô phỏng
2. **Giao Diện Kafka** - Message broker mô phỏng với luồng thời gian thực
3. **Spark Streaming** - Metrics xử lý stream mô phỏng và biểu đồ
4. **Bảng Điều Khiển MongoDB** - Database mô phỏng với records và aggregations
5. **Phân Tích** - Biểu đồ thời gian thực và KPI cards
6. **Giới Thiệu** - Giải thích công nghệ và lý do sử dụng mô phỏng

## 🛠️ Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool và dev server
- **TailwindCSS** - Styling
- **React Router** - Navigation
- **Recharts** - Trực quan hóa dữ liệu
- **Zustand** - State management
- **Lucide React** - Icons

## 📁 Cấu Trúc Dự Án

```
src/
├── components/       # Các component UI có thể tái sử dụng
│   ├── ui/           # Base components (Button, Card, v.v.)
│   └── layout/       # Layout components (Sidebar, Header)
├── pages/            # Page components
├── services/         # Dịch vụ tạo dữ liệu mô phỏng
├── hooks/            # Custom React hooks
├── store/            # Zustand state management
├── types/            # TypeScript type definitions
└── lib/              # Utility functions
```

## 🎮 Cách Sử Dụng

1. **Khởi động app**: `npm run dev`
2. **Điều hướng** sử dụng sidebar
3. **Click "Bắt Đầu Mô Phỏng"** trong header để bắt đầu tạo dữ liệu mô phỏng
4. **Khám phá** từng trang để xem các khía cạnh khác nhau của pipeline
5. **Tương tác** với các nút để thủ công kích hoạt tạo dữ liệu

## 🔄 Luồng Mô Phỏng

Khi mô phỏng đang chạy:
- Kafka messages được tạo mỗi 1-2 giây
- Spark metrics cập nhật mỗi 2 giây
- MongoDB records được thêm mỗi 3 giây
- Aggregations làm mới mỗi 5 giây
- Analytics data cập nhật thời gian thực

## 📦 Build & Deploy

```bash
# Build cho production
npm run build

# Preview production build
npm run preview
```

Thư mục `dist` có thể được deploy lên:
- Vercel
- Netlify
- GitHub Pages
- Bất kỳ static hosting service nào

## 🎨 Tùy Chỉnh

- Sửa `src/services/simulationDataService.ts` để thay đổi logic tạo dữ liệu
- Cập nhật `src/types/index.ts` để thay đổi cấu trúc dữ liệu
- Tùy chỉnh màu sắc trong `tailwind.config.js`
- Thêm trang mới trong `src/pages/` và routes trong `src/App.tsx`

## 📝 Ghi Chú

- Đây là một **mô phỏng** - tất cả dữ liệu là mô phỏng và được tạo trong trình duyệt
- Không có kết nối Kafka, Spark, hay MongoDB thực tế
- Hoàn hảo cho demo, presentation, và học tập
- Xem `../legacy_pipeline/` để xem implementation hạ tầng thực tế

## 🤝 Đóng Góp

Cảm thấy tự do để nâng cao mô phỏng:
- Thêm các pattern dữ liệu thực tế hơn
- Triển khai thêm visualizations
- Thêm các thành phần pipeline mới
- Cải thiện UI/UX

---

**Chúc Mô Phỏng Vui Vẻ! 🚀**
