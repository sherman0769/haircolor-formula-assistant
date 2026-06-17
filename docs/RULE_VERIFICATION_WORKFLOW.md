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

## 實務原則

寧可保守維持 `partial`，也不要讓系統用未完整建模的資料產生看似精確的克數。
