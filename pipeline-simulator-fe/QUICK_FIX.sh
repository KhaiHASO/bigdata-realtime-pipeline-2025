#!/bin/bash
# Quick fix script for blank screen issue

echo "🔧 Fixing blank screen issue..."

cd "$(dirname "$0")"

echo "1. Cleaning..."
rm -rf node_modules dist .vite package-lock.json

echo "2. Reinstalling dependencies..."
npm install

echo "3. Building to check for errors..."
npm run build

echo "4. Starting dev server..."
echo "✅ If build succeeded, dev server should work now!"
echo "📝 Open http://localhost:5173 and check browser console (F12)"

npm run dev

