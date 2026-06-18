export const APP_VERSION = "v0.1.0-beta";

export const APP_RELEASE_LABEL = "免費 Beta 試用版";

export const PRODUCTION_URL =
  "https://haircolor-formula-assistant.vercel.app";

export const FEEDBACK_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSfo25gmYdKGrdnavAqSuN6UmWJ9a-zAvn3ILdU-hYZtREt5-A/viewform";

export const betaTrialHighlights = [
  "本版本開放給專業美髮設計師免費試用。",
  "不需要登入，不儲存顧客資料，也不儲存配方紀錄。",
  "下載配方單只會在使用者裝置本機建立文字檔。",
  "站點使用 Vercel Web Analytics 統計頁面訪問與裝置、瀏覽器等技術指標，用於 Beta 試用觀察。",
  "首頁可公開顯示 Beta 累積訪問數；此數字只累計匿名總量，不儲存顧客資料或配方內容。",
  "正式回饋入口使用 Google 表單收集 Beta 試用問題與品牌資料缺口，不使用檔案上傳題。",
  "partial / unverified 品牌規則只提供方向性建議，不輸出精確克數。",
  "所有結果仍需依品牌官方手冊、髮束測試與現場專業判斷確認。",
];

export const betaTrialLimits = [
  "品牌資料仍在補齊中，肯邦 / Paul Mitchell 目前維持 partial。",
  "尚未支援 AI 解釋、拍照判斷髮色、會員系統與客戶染髮紀錄。",
  "目前沒有後台寫入品牌規則，控制端只提供只讀檢視。",
  "高風險漂髮、黑染殘留與多次漂染案例不應只依系統判斷操作。",
];

export const feedbackTemplate = `HairColor Formula Assistant 免費 Beta 回饋

正式回饋表單：
${FEEDBACK_FORM_URL}

1. 使用裝置與瀏覽器：
2. 使用頁面或流程：
3. 選擇品牌與產品線：
4. 目前髮況與目標色：
5. 遇到的問題：
6. 哪裡看不懂或不好操作：
7. 是否有截圖：
8. 建議改善：
`;

export const launchMessage = `HairColor Formula Assistant 美髮染髮配方助理開放免費 Beta 試用。

這是一個給專業美髮設計師使用的配方輔助工具，可依髮況、目標色、品牌產品線與風險條件，整理配方方向、雙氧建議、施工流程、風險提醒與信心等級。

試用網址：${PRODUCTION_URL}
回饋表單：${FEEDBACK_FORM_URL}

重要提醒：
- 本工具不保證染髮結果。
- 不取代品牌官方技術手冊與現場專業判斷。
- 實際操作前應做皮膚過敏測試與髮束測試。
- partial / unverified 品牌只提供方向性建議，不輸出精確克數。
- 高風險漂髮、黑染殘留、多次漂染與人工色素殘留，請由資深設計師現場判斷。

目前版本：${APP_VERSION}`;
