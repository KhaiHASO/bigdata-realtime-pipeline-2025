# Troubleshooting - Màn hình trắng

## Các bước kiểm tra:

### 1. Kiểm tra Browser Console
Mở Developer Tools (F12) và xem tab Console có lỗi gì không.

### 2. Kiểm tra Network tab
Xem các file có load được không (main.tsx, App.tsx, CSS, etc.)

### 3. Kiểm tra Dev Server
```bash
cd pipeline-simulator-fe
npm run dev
```

Xem output có lỗi gì không.

### 4. Clear cache và rebuild
```bash
cd pipeline-simulator-fe
rm -rf node_modules dist .vite
npm install
npm run dev
```

### 5. Kiểm tra Port
Đảm bảo port 5173 không bị chiếm bởi process khác:
```bash
lsof -i :5173
# hoặc
netstat -tulpn | grep 5173
```

### 6. Thử build production
```bash
npm run build
npm run preview
```

### 7. Kiểm tra TypeScript errors
```bash
npm run build
```

Nếu có lỗi TypeScript, sửa trước khi chạy dev server.

## Lỗi thường gặp:

### Lỗi: "Cannot find module '@/...'"
- Kiểm tra `vite.config.ts` có path alias `@` chưa
- Kiểm tra `tsconfig.app.json` có paths config chưa

### Lỗi: "Module not found"
- Chạy `npm install` lại
- Xóa `node_modules` và `package-lock.json`, rồi `npm install`

### Lỗi: CSS không load
- Kiểm tra `src/index.css` có import Tailwind directives
- Kiểm tra `postcss.config.js` có đúng config

### Lỗi: React component không render
- Kiểm tra browser console
- Kiểm tra có lỗi trong component nào không
- Thử comment từng component để tìm component lỗi

## Quick Fix:

```bash
cd pipeline-simulator-fe
rm -rf node_modules dist .vite package-lock.json
npm install
npm run dev
```

Sau đó mở http://localhost:5173 và check browser console (F12).

