# Rules Schema

## BrandRule

每一個產品線是一筆 `BrandRule`。核心欄位：

- `brandId`
- `brandName`
- `productLineId`
- `productLineName`
- `region`
- `serviceTypes`
- `verified`: `verified | partial | unverified`
- `sourceIds`
- `sourceTitle`
- `sourceType`
- `retrievedAt`
- `sourceNote`
- `notes`
- `rules`

## Rules

`rules.mixingRules` 定義服務類型、比例、允許雙氧與停留時間。

`rules.developerRules` 定義雙氧百分比、vol、提淺範圍、建議用途與限制。

`rules.greyCoverageRules` 是可選欄位，用於白髮比例與自然基底色建議。

`rules.developerAdjustmentMode` 支援：

- `none`
- `subtractAdditiveWeight`
- `fixedDeveloperAmount`

## 精確配方條件

規則引擎只有在以下條件都成立時輸出精確克數：

- 品牌規則為 `verified`
- 使用者已人工確認目前底色
- 風險引擎未判定需要阻擋精確配方
- 輸入通過 validator

否則輸出 `reference` 方向性項目，克數為 `null`。
