# 品牌規則驗證與升級流程

本文件定義品牌規則從 `unverified` / `partial` 升級到 `verified` 的控制端流程。此流程屬於後台或內部管理功能，不應放在一般使用者前台操作。

## 狀態定義

- `unverified`：教育用、佔位或非官方資料，不輸出精確克數。
- `partial`：已有官方或可信來源，但規則仍不完整，或資料為範圍值而目前引擎無法精準建模，不輸出精確克數。
- `verified`：官方來源、產品線、服務類型、比例、雙氧、停留時間、限制條件與測試案例均已補齊，可進入規則引擎計算；仍需專業設計師確認。

## 升級條件

控制端升級到 `verified` 前必須確認：

- 來源為品牌官方網站、官方 PDF、官方技術手冊、官方色卡或官方 DAM 文件。
- 來源 URL、文件名稱、retrieved date 與 publisher 已登錄到 `data/sources/sources.json`。
- 產品線名稱不可過度籠統，例如不能用一筆「Lightener Structure」涵蓋多個 lightener 產品。
- mixing ratio 必須能被目前引擎精確表示；若官方資料是 `1:1.5-1:2.5` 這類範圍，應維持 `partial`，直到控制端支援比例選擇或技術選擇。
- developer percent、volume、適用情境、限制條件、processing time 已補齊。
- on-scalp / off-scalp、heat、最高停留時間、敏感頭皮與受損髮限制已補齊。
- 已新增或更新測試，確認 `verified` 可輸出精確克數，`partial` / `unverified` 仍會阻擋精確克數。

## 建議控制端功能

未來後台可加入「規則升級」功能，但必須具備：

- 來源管理：新增官方 URL、PDF、retrieved date、publisher、source type。
- 規則編輯：依產品線、服務類型、比例、雙氧、停留時間建立結構化資料。
- 規則完整度檢查：自動檢查是否缺 mixing rule、developer rule、restrictions、warnings。
- 比例範圍處理：若官方比例為範圍，要求管理者選擇「保持 partial」或建立可選技術參數。
- 測試產生：每次升級必須新增對應測試案例。
- 審核紀錄：紀錄誰升級、升級日期、來源、原因與回滾方式。

## 本次第一批處理

- Wella Blondor 從籠統 lightener structure 拆成具體產品線，並補入官方來源；因官方比例仍為範圍，維持 `partial`。
- Schwarzkopf BLONDME 補入官方產品頁、Henkel DAM service manual 與 technical booklet；因官方比例仍為範圍，維持 `partial`。
- Schwarzkopf IGORA ROYAL core 補入官方產品頁，但完整 core 配方仍需官方技術手冊確認，維持 `partial`。
- Schwarzkopf IGORA ROYAL ABSOLUTES 新增為獨立產品線；官方資料提供單一 mixing ratio 與 developer/time guidance，因此可標示為 `verified`。

## 肯邦 / Paul Mitchell 候選產品線

本次先將肯邦代理線中適合放進染劑選項的 Paul Mitchell 產品線加為候選：

- The Color XG 超世代艷彩染髮劑：`partial`
- The Demi 幻彩染：`partial`
- The Color 10 絕彩瞬色白髮染：`partial`
- Skylight 手刷漂染專用明度調整粉：`partial`

這批資料只作為前台選項與方向性資料，不輸出精確克數。升級前必須補齊：

- 肯邦或 Paul Mitchell 官方現行技術手冊。
- 台灣現行供應與法規/許可狀態。
- 混合比例、指定雙氧或處理液、停留時間、頭皮限制、漂染限制。
- 白髮覆蓋或灰髮霧化的產品線專屬規則。
- 對應測試案例，確認 `partial` / `unverified` 升級前仍會阻擋精確配方。

## 肯邦 / Paul Mitchell 官方公開資料查核

2026-06-18 已查核 Paul Mitchell 與肯邦公開頁：

- Color XG：Paul Mitchell eLearning 官方頁確認 Color XG 課程涵蓋灰髮、自然色、冷色、混合指引與建議配方，但完整內容在課程內，公開頁未揭露可直接建模的比例、雙氧與停留規則，維持 `partial`。
- The Demi：肯邦 The Demi 頁確認保鮮、增豔、矯色、色彩校正與灰髮霧化方向；Paul Mitchell eLearning 確認 The Demi 是無氨 demi-permanent 快速色彩服務，但公開頁未揭露完整混合規則，維持 `partial`。
- The Color 10：Paul Mitchell eLearning 公開頁確認 10 分鐘、輕微提淺與最高白髮覆蓋方向，因此從 `unverified` 升為 `partial`；仍缺公開混合比例、色號族群與台灣肯邦現行供應確認。
- Skylight：目前公開 Paul Mitchell Pro blonding 頁未見 Skylight，只能以供應商頁與公開許可資料作候選，維持 `partial`，不得升級。

## 肯邦 / Paul Mitchell 第二批補齊結果

2026-06-18 追加查核 Paul Mitchell 官方公開頁與 CosmoProf 專業供應商頁後，完成以下補強：

- Color XG：補入 CosmoProf 專業供應商頁公開方向，包含 1:1、10/20/30/40 volume 與依雙氧區分的停留方向；因來源不是 Paul Mitchell / 肯邦官方技術手冊，且台灣色號、白髮自然基底比例與高明度規則仍未確認，維持 `partial`。
- The Demi：補入 The Demi 專業供應商方向與 Processing Liquid 資料，標記 1:1 與低 volume Processing Liquid；另補入 The Demi Pre-Bonded 5-Minute Toners 官方教育頁，但 5 分鐘只可視為該變體方向，不可套用到全部 The Demi 服務，維持 `partial`。
- The Color 10：補入 CosmoProf Canada 專業供應商頁公開方向，包含 1:1.5、20V Creme Developer、10 分鐘與 level 3-7 / 40-60% 灰髮客群方向；仍缺肯邦台灣現行供應、官方色號族群與完整白髮規則，維持 `partial`。
- Skylight：Paul Mitchell Pro 官方 blonding 頁目前顯示 Pre-Bonded Lightener 與 The Demi Pre-Bonded 5-Minute Toners；未見 Skylight。Skylight 僅保留為供應商與歷史公開資料候選，不得升級。若後續肯邦確認代理的是 Pre-Bonded Lightener，應新增獨立產品線，不可與 Skylight 混用。

本批補齊只提升資料完整度，不改變計算安全策略：所有肯邦 / Paul Mitchell 候選仍不得輸出精確克數。

## LebeL edol / MATERIA 設計師回饋新增

2026-06-18 依設計師回饋加入 LebeL 產品線候選：

- edol 透明感染髮系列：`partial`
- edol qon 灰髮透明感染髮系列：`partial`
- edol bleach 漂粉：`partial`
- MATERIA 透明感染髮系列：`partial`
- MATERIA μ 低鹼染髮系列：`partial`
- MATERIA G 灰髮染髮系列：`partial`

本次使用 LebeL / Takara Belmont 官方公開產品頁與官方公開色卡 PDF 作為來源。公開資料可確認產品線、沙龍技術者專用定位、部分 Oxy 濃度與部分混合比例，例如 edol 一般比例、Level 15 / LT-EX 方向，以及 MATERIA / MATERIA μ / MATERIA G 的公開比例方向。

但目前仍缺：

- 完整官方技術手冊。
- 產品線各色號族群與雙氧選擇條件。
- 停留時間。
- 白髮覆蓋、自然基底色與抗拒白髮規則。
- 漂粉頭皮限制、最高停留時間與熱源規則。
- 台灣或目標地區現行供應與教育資料確認。

因此所有 LebeL edol / MATERIA 規則目前只作為品牌選項與方向性資料，不輸出精確克數。若未來取得完整官方手冊，必須補齊測試案例與人工審核紀錄後才能評估升級。

## 實務原則

寧可保守維持 `partial`，也不要讓系統用未完整建模的資料產生看似精確的克數。
