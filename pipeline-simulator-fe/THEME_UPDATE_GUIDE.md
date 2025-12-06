# Hướng Dẫn Áp Dụng Theme Apple-Style

## Các bước để thấy thay đổi:

### 1. Dừng dev server hiện tại (nếu đang chạy)
- Nhấn `Ctrl+C` trong terminal đang chạy dev server

### 2. Xóa cache và rebuild
```bash
# Xóa node_modules/.vite cache (nếu có)
rm -rf node_modules/.vite

# Hoặc trên Windows PowerShell:
Remove-Item -Recurse -Force node_modules\.vite -ErrorAction SilentlyContinue

# Rebuild
npm run build
```

### 3. Khởi động lại dev server
```bash
npm run dev
```

### 4. Hard refresh browser
- **Chrome/Edge**: `Ctrl + Shift + R` hoặc `Ctrl + F5`
- **Firefox**: `Ctrl + Shift + R`
- Hoặc mở DevTools (F12) → Right click vào nút refresh → "Empty Cache and Hard Reload"

## Những thay đổi chính:

✅ **Background**: Từ màu tối → `#F4F7FA` (Frost White)
✅ **Cards**: Tất cả cards giờ có `rounded-2xl`, `shadow-lg`, nền trắng
✅ **Sidebar**: 240px width, nền trắng, border nhẹ
✅ **Header**: 64px height, nền trắng, có indicator màu xanh khi đang chạy
✅ **Buttons**: Rounded-xl, màu xanh `#3B82F6`
✅ **Typography**: Font Inter, màu chữ `#0F172A` (primary), `#64748B` (subtle)
✅ **Charts**: Màu mềm mại, gridlines nhẹ `#E2E8F0`
✅ **Animations**: Fade-in, slide-up, hover effects

## Kiểm tra:

Sau khi restart, bạn sẽ thấy:
- Background sáng màu `#F4F7FA`
- Tất cả cards có góc bo tròn lớn hơn (20px)
- Sidebar màu trắng với border nhẹ
- Header có shadow và indicator màu xanh
- Tất cả text màu tối `#0F172A` hoặc xám nhẹ `#64748B`
- Không còn màu tối/đen nào

## Nếu vẫn không thấy thay đổi:

1. Kiểm tra browser console (F12) xem có lỗi không
2. Kiểm tra Network tab xem CSS có được load đúng không
3. Thử mở trong Incognito/Private mode
4. Xóa toàn bộ cache: `npm run build` rồi `npm run dev`

