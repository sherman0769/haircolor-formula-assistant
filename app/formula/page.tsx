import { FormulaForm } from "@/components/FormulaForm";
import { SafetyNotice } from "@/components/SafetyNotice";

export default function FormulaPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
      <div className="mb-6 grid gap-4 lg:grid-cols-[1fr_380px]">
        <div>
          <p className="text-sm font-semibold text-accent">配方計算</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal">
            輸入髮況與目標色
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
            以手機也能快速掃讀的分段表單，先建立髮況，再看品牌規則與風險提示。
          </p>
        </div>
        <SafetyNotice compact />
      </div>
      <FormulaForm />
    </div>
  );
}
