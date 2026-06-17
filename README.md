# HairColor Formula Assistant

美髮染髮配方助理

## 專案簡介

這是一個給美髮設計師使用的染髮配方輔助工具，依據髮況、目標色、品牌產品線與規則引擎，提供配方方向、雙氧建議、施工流程、風險提醒與信心等級。

## 重要聲明

- 本工具僅供美髮設計師作為專業輔助參考。
- 本工具不保證染髮結果。
- 本工具不取代品牌官方技術手冊。
- 本工具不取代現場專業判斷。
- 實際操作前應依品牌官方說明做皮膚過敏測試與髮束測試。
- 高風險漂髮不建議自行操作，非專業人士不應自行進行高風險漂髮。
- 最終配方需由專業美髮設計師確認。

## 功能摘要

- 染髮配方計算
- 品牌規則查詢
- 雙氧比例與克數計算
- 白髮覆蓋輔助
- 風險引擎
- 信心等級
- 安全提醒
- 品牌規則驗證狀態
- MVP 規則控制端入口（只讀）

## MVP 規則控制端

品牌規則頁提供「規則控制端」按鈕，目前使用前端簡易密碼進入 `/admin/rules`，用於展示規則驗證狀態與升級待辦。

此入口只適合 MVP 展示，不具正式安全性，也不提供資料寫入。正式版本仍需改為後端登入、角色權限、審核流程與版本紀錄。

## 本地開發

```bash
npm install
npm run dev
```

開啟 `http://localhost:3000`。

## 測試

```bash
npm run test
```

## Lint

```bash
npm run lint
```

## Build

```bash
npm run build
```

## Vercel 部署流程

1. 建立 GitHub repository。
2. 初始化本地 Git repository 並推送到 GitHub：

```bash
git init
git add .
git commit -m "Initial MVP: HairColor Formula Assistant"
git branch -M main
git remote add origin <YOUR_GITHUB_REPO_URL>
git push -u origin main
```

`<YOUR_GITHUB_REPO_URL>` 需要替換成實際 GitHub repository URL。

3. 到 Vercel 匯入 GitHub repository。
4. Framework 選擇 Next.js。
5. Build command 使用 `npm run build`。
6. 不需要環境變數。
7. 每次 push 到 main branch 後由 Vercel 自動部署。

## npm audit 狀態

目前 `npm audit` 回報 2 個 moderate vulnerabilities，來源是 Next.js 內部相依的 `postcss <8.5.10`。npm 建議的 `npm audit fix --force` 會造成破壞性版本變動，因此不建議為了 audit 歸零而強制降版或破壞 Next.js 穩定性。部署前應追蹤 Next.js 上游修補版本，並在不破壞框架版本的前提下更新。

## 目前限制

- 部分品牌規則仍為 partial / unverified。
- 尚未支援 AI 解釋。
- 尚未支援拍照判斷髮色。
- 尚未支援會員系統。
- 尚未支援客戶染髮紀錄。
- 尚未支援正式後台管理品牌規則，目前僅有前端密碼的只讀控制端入口。
