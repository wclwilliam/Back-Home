# Back-Home 部署指南

## 📁 目錄結構

### 本地開發環境

```
c:\MAMP\htdocs\api\          ← 後端 API
c:\Users\TMP-214\Downloads\project\Back-Home\  ← 前端專案
```

### 遠端伺服器結構（上傳後）

```
/cjd102/g3/
├── php/                     ← 後端 API（從 c:\MAMP\htdocs\api\ 上傳）
│   ├── common/
│   │   ├── cors.php
│   │   └── conn.php
│   ├── impact_get.php
│   ├── rescue_get.php
│   └── ...其他 PHP 檔案
│
├── front/                   ← 前端打包檔案（從 dist/ 或 front/ 打包後上傳）
│   ├── index.html
│   ├── assets/
│   └── file/                ← 圖片存放位置（需手動創建）
│       └── images/
│           └── savedcases/
│               ├── bobo.png
│               ├── amber.png
│               └── ...其他圖片
```

---

## 🔧 本地測試設定

### 1. 檢查 MAMP 設定

確保 MAMP 正在運行：

- Apache: `http://localhost:8888`
- MySQL: `localhost:3306`

### 2. 檢查環境變數（`.env`）

```env
VITE_API_BASE=http://localhost:8888/api/
```

⚠️ **注意**：路徑必須是小寫 `api`，對應你的實際資料夾名稱

### 3. 啟動前端開發伺服器

```bash
cd c:\Users\TMP-214\Downloads\project\Back-Home
npm run dev
```

### 4. 測試 API 連線

在瀏覽器開啟：

- `http://localhost:8888/api/rescue_get.php` - 應該返回 JSON 資料
- `http://localhost:5173` - 前端網站

---

## 🚀 部署到遠端伺服器

### 步驟 1：準備後端檔案

1. **修改遠端資料庫連線設定**
   編輯 `c:\MAMP\htdocs\api\common\conn.php`，確保有遠端資料庫設定

2. **使用 FileZilla 上傳後端**
   - 來源：`c:\MAMP\htdocs\api\*`
   - 目標：`/cjd102/g3/php/`
   - 包含檔案：
     - `rescue_get.php`
     - `impact_get.php`
     - `common/cors.php`
     - `common/conn.php`
     - 其他所有 `.php` 檔案

### 步驟 2：準備前端檔案

1. **切換到生產環境並打包**

   ```bash
   cd c:\Users\TMP-214\Downloads\project\Back-Home
   npm run build -- --mode prod
   ```

   這會：
   - 使用 `.env.prod` 的設定
   - 打包到 `front/` 資料夾（不是 `dist/`）
   - API 會指向 `https://tibamef2e.com/cjd102/g3/php`

2. **使用 FileZilla 上傳前端**
   - 來源：`c:\Users\TMP-214\Downloads\project\Back-Home\front\*`
   - 目標：`/cjd102/g3/front/`

### 步驟 3：處理圖片檔案

#### 選項 A：圖片已打包在前端（當前方案）

✅ 圖片在 `src/assets/image/` 中，打包時會自動處理

- 資料庫路徑：`/src/assets/image/home/savedcases/bobo.png`
- 前端會自動處理這些路徑

#### 選項 B：圖片分離到 file 目錄（推薦）

需要修改資料庫和上傳圖片：

1. **在遠端伺服器建立目錄**

   ```
   /cjd102/g3/front/file/images/savedcases/
   ```

2. **上傳圖片**
   - 來源：`c:\Users\TMP-214\Downloads\project\Back-Home\src\assets\image\home\savedcases\*`
   - 目標：`/cjd102/g3/front/file/images/savedcases/`

3. **修改資料庫圖片路徑**

   ```sql
   UPDATE RESCUES SET IMAGE_PATH = REPLACE(IMAGE_PATH, '/src/assets/image/home/', '/images/');
   ```

   修改後路徑範例：
   - 舊：`/src/assets/image/home/savedcases/bobo.png`
   - 新：`/images/savedcases/bobo.png`

---

## ✅ 測試檢查清單

### 本地測試

- [ ] MAMP 已啟動
- [ ] 資料庫已匯入 `rescues.sql`
- [ ] API 可訪問：`http://localhost:8888/api/rescue_get.php`
- [ ] 前端可訪問：`http://localhost:5173`
- [ ] 救援案例卡片正確顯示（含圖片）
- [ ] 階段顯示正確（入院檢查、醫療照護等）

### 遠端測試

- [ ] API 可訪問：`https://tibamef2e.com/cjd102/g3/php/rescue_get.php`
- [ ] 前端可訪問：`https://tibamef2e.com/cjd102/g3/front/`
- [ ] 救援案例卡片正確顯示
- [ ] 圖片正確載入
- [ ] 沒有 CORS 錯誤

---

## 🐛 常見問題排除

### 1. API 返回 404

**原因**：路徑大小寫不符
**解決**：

- 確認 `.env` 中的 `VITE_API_BASE` 與實際資料夾名稱一致
- 本地：`http://localhost:8888/api/`（小寫）
- 遠端：檢查 FileZilla 上傳的資料夾名稱

### 2. 圖片無法顯示

**原因**：圖片路徑錯誤
**解決**：

- 開發環境：圖片在 `src/assets/image/`，Vite 會自動處理
- 生產環境：如果選擇方案 B，確保圖片已上傳到 `front/file/images/`

### 3. CORS 錯誤

**原因**：後端未正確設定 CORS
**解決**：確保 `common/cors.php` 已正確引入

### 4. 資料庫連線失敗

**原因**：遠端資料庫設定錯誤
**解決**：檢查 `common/conn.php` 的資料庫連線資訊

---

## 📝 重要提醒

1. **環境變數差異**
   - `.env` = 本地開發
   - `.env.prod` = 遠端正式環境
   - 打包時使用 `--mode prod` 才會用 `.env.prod`

2. **資料夾名稱大小寫**
   - Windows 不區分大小寫，但 Linux 伺服器區分
   - 確保上傳到 FileZilla 時資料夾名稱正確

3. **打包輸出位置**
   - `.env`: `VITE_OUT_DIR=dist`（本地測試用）
   - `.env.prod`: `VITE_OUT_DIR=front`（上傳到伺服器）

4. **圖片更新流程**
   - 方案 A：更新圖片後需要重新打包並上傳整個 front 資料夾
   - 方案 B：只需上傳新圖片到 `front/file/images/` 即可
