# 🚀 快速修復指南 - 讓救援案例顯示出來

## 📋 當前狀況

- ✅ MAMP 已啟動（port 8888）
- ✅ 資料庫有資料（RESCUES 資料表）
- ❌ 前端看不到救援案例

---

## 🔧 立即執行以下步驟

### 步驟 1: 更新資料庫圖片路徑（必做！）⭐

1. 打開 phpMyAdmin：`http://localhost:8888/phpMyAdmin/`

2. 點擊你的資料庫

3. 點擊上方的「SQL」標籤

4. 複製貼上以下 SQL 語句並執行：

```sql
UPDATE `RESCUES`
SET `IMAGE_PATH` = REPLACE(`IMAGE_PATH`, '/src/assets/image/home/', '/images/');
```

5. 驗證結果（再執行這個查詢）：

```sql
SELECT `RESCUE_ID`, `TURTLE_NAME`, `IMAGE_PATH` FROM `RESCUES` LIMIT 3;
```

你應該看到路徑變成：`/images/savedcases/bobo.png`

---

### 步驟 2: 建立圖片資料夾結構

在 MAMP 的 htdocs 目錄下建立以下結構：

```
c:\MAMP\htdocs\file\images\savedcases\
```

**方法 A（推薦）：用命令列建立**

```powershell
mkdir c:\MAMP\htdocs\file\images\savedcases
```

**方法 B：手動建立**

1. 開啟檔案總管
2. 前往 `c:\MAMP\htdocs\`
3. 新增資料夾 `file`
4. 在 `file` 裡新增 `images`
5. 在 `images` 裡新增 `savedcases`

---

### 步驟 3: 複製圖片檔案

將救援案例的圖片從前端專案複製到 MAMP：

**來源位置：**

```
c:\Users\TMP-214\Downloads\project\Back-Home\src\assets\image\home\savedcases\
```

**目標位置：**

```
c:\MAMP\htdocs\file\images\savedcases\
```

**應該有以下圖片：**

- bobo.png
- amber.png
- matcha.png
- haihai.png
- dot.png
- warrior.png
- coco.png
- grass.png
- ball.png
- gold.png

**用命令列複製（快速方法）：**

```powershell
xcopy "c:\Users\TMP-214\Downloads\project\Back-Home\src\assets\image\home\savedcases\*.*" "c:\MAMP\htdocs\file\images\savedcases\" /Y
```

---

### 步驟 4: 重啟前端開發伺服器（必做！）⭐

因為修改了 `.env` 檔案，必須重啟開發伺服器：

1. 在終端機按 `Ctrl + C` 停止目前的伺服器
2. 重新啟動：

```bash
npm run dev
```

---

### 步驟 5: 測試

#### 測試 1: API 是否正常

在瀏覽器開啟：

```
http://localhost:8888/api/rescue_get.php
```

應該看到 JSON 資料，圖片路徑是 `/images/savedcases/...`

#### 測試 2: 圖片是否可訪問

在瀏覽器開啟：

```
http://localhost:8888/file/images/savedcases/bobo.png
```

應該看到波波的圖片

#### 測試 3: 前端是否顯示

開啟：

```
http://localhost:5173
```

救援案例應該正確顯示了！

---

## 🐛 如果還是看不到，檢查這些：

### 檢查 1: 開發者工具 Console

1. 在前端頁面按 `F12` 開啟開發者工具
2. 切換到「Console」標籤
3. 看是否有紅色錯誤訊息
4. 截圖給我看

### 檢查 2: Network 請求

1. 在開發者工具切換到「Network」標籤
2. 重新整理頁面（F5）
3. 找到 `rescue_get.php` 的請求
4. 點擊它，查看 Response（回應內容）
5. 如果是紅色（失敗），截圖給我

### 檢查 3: 環境變數是否生效

在前端程式碼任一處加入：

```javascript
console.log('API Base:', import.meta.env.VITE_API_BASE)
console.log('File URL:', import.meta.env.VITE_FILE_URL)
```

應該顯示：

```
API Base: http://localhost:8888/api/
File URL: http://localhost:8888/file
```

---

## 📁 最終的資料夾結構

### MAMP 後端

```
c:\MAMP\htdocs\
├── api\
│   ├── common\
│   │   ├── cors.php
│   │   └── conn.php
│   ├── rescue_get.php
│   └── impact_get.php
│
└── file\
    └── images\
        └── savedcases\
            ├── bobo.png
            ├── amber.png
            └── ... (其他圖片)
```

### 前端專案

```
c:\Users\TMP-214\Downloads\project\Back-Home\
├── src\
│   ├── components\
│   │   ├── cards\
│   │   │   └── RescueCard.vue  ← 已更新
│   │   └── home\
│   │       └── SavedCases.vue
│   └── utils\
│       └── publicApi.js
│
└── .env  ← 已更新
    VITE_API_BASE=http://localhost:8888/api/
    VITE_FILE_URL=http://localhost:8888/file
```

---

## 🎯 這樣設計的優點

1. **圖片獨立管理**
   - 圖片放在 `c:\MAMP\htdocs\file\`
   - 不會打包進前端專案
2. **方便後台 CRUD**
   - 後台可以直接上傳圖片到 `file/images/savedcases/`
   - 資料庫只存相對路徑 `/images/savedcases/bobo.png`
   - 前端自動從 `VITE_FILE_URL` 讀取

3. **本地與遠端一致**
   - 本地：`http://localhost:8888/file/images/savedcases/bobo.png`
   - 遠端：`https://tibamef2e.com/cjd102/g3/front/file/images/savedcases/bobo.png`
   - 只需切換 `.env` 或 `.env.prod`

---

## ✅ 完成後的檢查清單

- [ ] 執行 SQL 更新圖片路徑
- [ ] 建立 `c:\MAMP\htdocs\file\images\savedcases\` 資料夾
- [ ] 複製所有圖片到上述資料夾
- [ ] 重啟前端開發伺服器（`npm run dev`）
- [ ] 測試 API：`http://localhost:8888/api/rescue_get.php`
- [ ] 測試圖片：`http://localhost:8888/file/images/savedcases/bobo.png`
- [ ] 測試前端：`http://localhost:5173`
- [ ] 救援案例卡片正確顯示

完成以上步驟後，你的救援案例應該就能正常顯示了！🎉
