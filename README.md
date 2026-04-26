# 任務分配管理系統 (Task Assignment System)

本專案是一個基於 **Angular 21** 架構開發的現代化任務調度系統。核心功能模擬企業內部的配送派單流程，提供直覺的介面處理任務從「未分配池」指派給「特定司機」的邏輯。

## 技術亮點

- **現代化 Angular 21 架構**：完整採用 **Standalone Components** 並導入 **SSR (Server-Side Rendering)**，提升首屏載入速度與 SEO 優化潛力。
- **高效能狀態管理 (Signals + RxJS)**：
  - 使用 **Signals** 管理細粒度的元件狀態，減少不必要的變更偵測，提升運行效能。
  - 結合 **RxJS** 處理異步資料流與複雜的業務邏輯，確保任務分配狀態在各元件間即時同步。
- **專業 UI 互動實作**：運用 **Angular CDK Drag and Drop** 打造流暢的拖曳式分配介面，並整合 **Angular Material** 提供一致且專業的視覺體驗。

## 核心功能

- **直覺式拖曳分配**：使用者可將任務池中的項目直接拖曳至目標司機，系統會自動處理資料關聯更新。
- **任務撤回與日誌**：支援將已指派任務退回池中，並要求輸入撤回原因，相關記錄會儲存於任務歷史紀錄中，確保操作可追蹤性。
- **進度狀態模擬**：完整模擬任務生命週期（未分配 → 已分配 → 已接受 → 已完成），提供即時的視覺化狀態反饋。
- **高擬真資料環境**：透過 `json-server` 搭配 `faker` 建構 RESTful API，模擬真實後端回傳延遲與大量數據處理情境。

## 開始使用

### 環境需求

- Node.js (建議版本 20+)
- npm (建議版本 10+)

### 安裝與執行

1.  **複製專案**：
    ```bash
    git clone [https://github.com/AlisonSmith1/task-assignment.git](https://github.com/AlisonSmith1/task-assignment.git)
    cd task-assignment
    ```
2.  **安裝依賴**：
    ```bash
    npm install
    ```
3.  **啟動開發環境**（包含 Mock API 與前端伺服器）：
    ```bash
    npm start
    ```
    啟動後請前往 `http://localhost:4200/` 即可操作。

## 建置與優化

執行以下指令編譯生產環境版本：

```bash
npm run build
```
