# 免費 Beta 試用發佈檢查

## 目前定位

HairColor Formula Assistant 目前為 `v0.1.0-beta`，開放給專業美髮設計師免費試用。此版本用於收集操作體驗、品牌資料缺口與安全提醒可讀性，不作為保證染髮結果的工具。

## 發佈前確認

- Production URL 可正常開啟。
- `/formula` 可完成一次配方計算。
- `/brands` 可檢視 verified / partial / unverified 狀態。
- `/beta` 可看到免費試用說明、限制與公告文案。
- `/feedback` 可開啟 Google 回饋表單，並保留複製格式備用。
- partial / unverified 品牌不輸出精確克數。
- 下載配方單可在本機產生，且文字不是亂碼。
- Vercel Web Analytics 已啟用，首頁會送出 `Homepage view` custom event。
- Vercel Project 的 `Analytics` 頁已啟用；若剛部署完成，需等待新訪問後才會出現資料。
- Vercel Marketplace 已連接 Upstash Redis，首頁公開訪問數可正常累計；若未連接，首頁會顯示「統計設定中」。
- Vercel Pro 已升級，Spend Management 已設定 on-demand budget 與 pause production deployments。

## 試用者提醒

- 本工具僅供專業美髮設計師作為配方輔助參考。
- 不保證染髮結果。
- 不取代品牌官方技術手冊。
- 不取代現場專業判斷。
- 實際操作前應做皮膚過敏測試與髮束測試。
- 高風險漂髮、黑染殘留、多次漂染與人工色素殘留，應由資深設計師現場判斷。
- 回饋時不要傳送顧客個資；目前表單不收檔案上傳，若提供截圖連結需先遮蔽可識別資訊。
- 站點會統計頁面訪問與裝置、瀏覽器等技術指標，用於 Beta 試用觀察；不儲存顧客資料或配方內容。

## 可轉貼公告

```text
HairColor Formula Assistant 美髮染髮配方助理開放免費 Beta 試用。

這是一個給專業美髮設計師使用的配方輔助工具，可依髮況、目標色、品牌產品線與風險條件，整理配方方向、雙氧建議、施工流程、風險提醒與信心等級。

試用網址：https://haircolor-formula-assistant.vercel.app

回饋表單：https://docs.google.com/forms/d/e/1FAIpQLSfo25gmYdKGrdnavAqSuN6UmWJ9a-zAvn3ILdU-hYZtREt5-A/viewform

重要提醒：
- 本工具不保證染髮結果。
- 不取代品牌官方技術手冊與現場專業判斷。
- 實際操作前應做皮膚過敏測試與髮束測試。
- partial / unverified 品牌只提供方向性建議，不輸出精確克數。
- 高風險漂髮、黑染殘留、多次漂染與人工色素殘留，請由資深設計師現場判斷。

目前版本：v0.1.0-beta
```
