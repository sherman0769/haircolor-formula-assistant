import { BrandRuleCard } from "@/components/BrandRuleCard";
import { getBrandRules } from "@/lib/brand-rules";

export default function BrandsPage() {
  const rules = getBrandRules();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="space-y-3">
        <p className="text-sm font-semibold text-accent">品牌規則資料庫</p>
        <h1 className="text-3xl font-semibold tracking-normal">
          產品線、混合比例與來源狀態
        </h1>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {rules.map((rule) => (
          <BrandRuleCard key={rule.productLineId} rule={rule} />
        ))}
      </div>
    </div>
  );
}
