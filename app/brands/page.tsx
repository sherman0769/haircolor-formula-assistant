import { AdminAccessButton } from "@/components/AdminAccessButton";
import { BrandRuleCard } from "@/components/BrandRuleCard";
import { getBrandRules } from "@/lib/brand-rules";

export default function BrandsPage() {
  const rules = getBrandRules();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3">
          <p className="text-sm font-semibold text-accent">品牌規則資料庫</p>
          <h1 className="text-3xl font-semibold tracking-normal">
            產品線、混合比例與來源狀態
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            已驗證、部分驗證與未驗證資料分開標示，避免把方向性資料誤作官方精確配方。
          </p>
        </div>
        <AdminAccessButton className="sm:min-w-72" />
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {rules.map((rule) => (
          <BrandRuleCard key={rule.productLineId} rule={rule} />
        ))}
      </div>
    </div>
  );
}
