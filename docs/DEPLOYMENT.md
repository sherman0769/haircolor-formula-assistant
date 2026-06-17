# Deployment

## Local

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Test

```bash
npm run test
npm run lint
npm run build
```

## GitHub + Vercel

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

3. 在 Vercel 匯入該 repository。
4. Framework preset 選 Next.js。
5. Build command 使用 `npm run build`。
6. Output directory 保持 Next.js 預設。
7. 每次 push 到 main branch 後由 Vercel 自動部署。

第一版不需要資料庫與登入，因此不用設定 Supabase、Firebase 或其他後端環境變數。

## npm audit

目前 `npm audit` 回報 2 個 moderate vulnerabilities，來源是 Next.js 內部相依的 `postcss <8.5.10`。npm 建議的 `npm audit fix --force` 會造成破壞性版本變動，因此不要為了讓 audit 歸零而破壞 Next.js 版本穩定性。部署前應持續追蹤 Next.js 上游修補版本。
