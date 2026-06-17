"use client";

import { useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Calculator,
  CheckCircle2,
  ClipboardCheck,
  Palette,
  ShieldAlert,
} from "lucide-react";
import { ColorLevelMeter } from "@/components/ColorLevelMeter";
import { DeveloperSelector } from "@/components/DeveloperSelector";
import { FormulaResult } from "@/components/FormulaResult";
import { GreyCoverageInput } from "@/components/GreyCoverageInput";
import { LevelSelector } from "@/components/LevelSelector";
import {
  ARTIFICIAL_PIGMENT_OPTIONS,
  BLEACH_COUNT_OPTIONS,
  DAMAGE_LEVEL_OPTIONS,
  DEFAULT_FORMULA_INPUT,
  HAIR_DENSITY_OPTIONS,
  HAIR_LENGTH_OPTIONS,
  OBSERVED_UNDERTONE_OPTIONS,
  SERVICE_TYPE_OPTIONS,
  TARGET_TONE_OPTIONS,
  TRI_STATE_OPTIONS,
  getLabel,
} from "@/lib/constants";
import {
  getBrandOptions,
  getDefaultProductLineForBrand,
  getProductLineOptions,
} from "@/lib/brand-rules";
import { calculateFormula, getEstimatedColorGrams } from "@/lib/formula-engine";
import type {
  ArtificialPigment,
  BleachCount,
  DamageLevel,
  FormulaInput,
  FormulaOutput,
  GreyPercentage,
  HairDensity,
  HairLength,
  ObservedUndertone,
  ServiceType,
  TargetTone,
  TriState,
} from "@/lib/types";

const formSteps = [
  {
    title: "目標",
    subtitle: "服務與色度",
    icon: Palette,
  },
  {
    title: "髮況",
    subtitle: "風險條件",
    icon: ShieldAlert,
  },
  {
    title: "品牌",
    subtitle: "規則與用量",
    icon: ClipboardCheck,
  },
  {
    title: "確認",
    subtitle: "送出計算",
    icon: CheckCircle2,
  },
] as const;

type ChoiceOption<T extends string> = {
  value: T;
  label: string;
};

type ChoiceGroupProps<T extends string> = {
  columns?: "two" | "three";
  label: string;
  onChange: (value: T) => void;
  options: Array<ChoiceOption<T>>;
  value: T;
};

function fieldClass() {
  return "mt-2 h-12 w-full rounded-md border border-border bg-panel px-3 text-base outline-none focus:border-accent sm:text-sm";
}

function sectionClass() {
  return "rounded-lg border border-border bg-panel p-4 shadow-sm sm:p-5";
}

function choiceGridClass(columns: ChoiceGroupProps<string>["columns"]) {
  if (columns === "three") {
    return "grid gap-2 sm:grid-cols-3";
  }

  return "grid gap-2 sm:grid-cols-2";
}

function ChoiceGroup<T extends string>({
  columns = "two",
  label,
  onChange,
  options,
  value,
}: ChoiceGroupProps<T>) {
  return (
    <fieldset>
      <legend className="text-sm font-medium text-foreground">{label}</legend>
      <div className={`mt-2 ${choiceGridClass(columns)}`}>
        {options.map((option) => {
          const selected = option.value === value;

          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(option.value)}
              className={`min-h-11 rounded-md border px-3 py-2 text-left text-sm font-medium transition ${
                selected
                  ? "border-accent bg-teal-50 text-teal-950 shadow-sm"
                  : "border-border bg-panel text-foreground hover:border-accent"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-muted px-3 py-2">
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm font-semibold text-foreground">{value}</dd>
    </div>
  );
}

export function FormulaForm() {
  const [input, setInput] = useState<FormulaInput>(DEFAULT_FORMULA_INPUT);
  const [result, setResult] = useState<FormulaOutput | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const stepTopRef = useRef<HTMLDivElement>(null);
  const resultPanelRef = useRef<HTMLDivElement>(null);
  const brandOptions = useMemo(() => getBrandOptions(), []);
  const productLineOptions = useMemo(
    () => getProductLineOptions(input.brandId),
    [input.brandId],
  );
  const selectedProductLine = productLineOptions.find(
    (option) => option.value === input.productLineId,
  );
  const estimatedGrams = getEstimatedColorGrams(input);
  const levelDiff = input.targetLevel - input.currentLevel;
  const activeStepMeta = formSteps[activeStep];
  const isLastStep = activeStep === formSteps.length - 1;

  function updateInput<T extends keyof FormulaInput>(
    key: T,
    value: FormulaInput[T],
  ) {
    setInput((current) => ({ ...current, [key]: value }));
  }

  function handleBrandChange(brandId: string) {
    setInput((current) => ({
      ...current,
      brandId,
      productLineId: getDefaultProductLineForBrand(brandId),
    }));
  }

  function togglePigment(pigment: ArtificialPigment) {
    setInput((current) => {
      const exists = current.artificialPigmentResidue.includes(pigment);

      return {
        ...current,
        artificialPigmentResidue: exists
          ? current.artificialPigmentResidue.filter((item) => item !== pigment)
          : [...current.artificialPigmentResidue, pigment],
      };
    });
  }

  function scrollToStepTop() {
    const stepTop = stepTopRef.current;

    if (!stepTop) {
      return;
    }

    const stickyOffset = window.matchMedia("(max-width: 639px)").matches
      ? 150
      : 130;
    const targetTop =
      stepTop.getBoundingClientRect().top + window.scrollY - stickyOffset;

    window.scrollTo({
      behavior: "auto",
      top: Math.max(0, targetTop),
    });
  }

  function goToStep(stepIndex: number) {
    setActiveStep(stepIndex);
    scrollToStepTop();
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isLastStep) {
      goToNextStep();
      return;
    }

    setResult(calculateFormula(input));
    window.setTimeout(() => {
      resultPanelRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 0);
  }

  function goToPreviousStep() {
    setActiveStep((current) => Math.max(current - 1, 0));
    scrollToStepTop();
  }

  function goToNextStep() {
    setActiveStep((current) => Math.min(current + 1, formSteps.length - 1));
    scrollToStepTop();
  }

  return (
    <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_430px]">
      <form onSubmit={handleSubmit} className="min-w-0 space-y-4">
        <section className="sticky top-16 z-30 -mx-4 border-y border-border bg-panel/95 px-3 py-1.5 shadow-[0_8px_24px_rgba(31,35,40,0.10)] backdrop-blur sm:mx-0 sm:rounded-lg sm:border sm:p-3">
          <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
            {formSteps.map((step, index) => {
              const Icon = step.icon;
              const selected = index === activeStep;
              const completed = index < activeStep;

              return (
                <button
                  key={step.title}
                  type="button"
                  aria-current={selected ? "step" : undefined}
                  onClick={() => goToStep(index)}
                  className={`min-h-12 min-w-0 rounded-md border px-2 py-1.5 text-left transition sm:min-h-16 sm:py-2 ${
                    selected
                      ? "border-accent bg-teal-50 text-teal-950"
                      : "border-border bg-panel text-muted-foreground hover:border-accent"
                  }`}
                >
                  <span className="flex min-w-0 items-center gap-1 text-xs font-semibold">
                    <Icon aria-hidden="true" className="size-3.5" />
                    <span className="truncate">
                      {completed ? "完成" : `0${index + 1}`}
                    </span>
                  </span>
                  <span className="mt-1 block truncate text-sm font-semibold text-foreground sm:text-base">
                    {step.title}
                  </span>
                  <span className="hidden truncate text-xs text-muted-foreground lg:block">
                    {step.subtitle}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <div ref={stepTopRef} className="scroll-mt-36" aria-hidden="true" />

        <ColorLevelMeter
          currentLevel={input.currentLevel}
          targetLevel={input.targetLevel}
        />

        {activeStep === 0 && (
          <section className={sectionClass()}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-normal text-accent">
                  Step 01
                </p>
                <h2 className="mt-1 text-lg font-semibold">目標設定</h2>
              </div>
              <span className="rounded-md border border-border bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                {levelDiff > 0 ? `提淺 +${levelDiff}` : `色度差 ${levelDiff}`}
              </span>
            </div>

            <div className="mt-5 space-y-5">
              <ChoiceGroup<ServiceType>
                label="服務類型"
                value={input.serviceType}
                options={SERVICE_TYPE_OPTIONS}
                onChange={(value) => updateInput("serviceType", value)}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <LevelSelector
                  id="current-level"
                  label="目前髮色度數"
                  value={input.currentLevel}
                  onChange={(value) => updateInput("currentLevel", value)}
                />
                <LevelSelector
                  id="target-level"
                  label="目標髮色度數"
                  value={input.targetLevel}
                  onChange={(value) => updateInput("targetLevel", value)}
                />
              </div>

              <label className="block">
                <span className="text-sm font-medium">目標色系</span>
                <select
                  value={input.targetTone}
                  onChange={(event) =>
                    updateInput("targetTone", event.target.value as TargetTone)
                  }
                  className={fieldClass()}
                >
                  {TARGET_TONE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </section>
        )}

        {activeStep === 1 && (
          <section className={sectionClass()}>
            <p className="text-xs font-semibold uppercase tracking-normal text-accent">
              Step 02
            </p>
            <h2 className="mt-1 text-lg font-semibold">髮況與殘留風險</h2>

            <div className="mt-5 space-y-5">
              <ChoiceGroup<"yes" | "no">
                label="是否漂過"
                value={input.hasBleached ? "yes" : "no"}
                options={[
                  { value: "no", label: "未漂過" },
                  { value: "yes", label: "漂過" },
                ]}
                onChange={(value) => {
                  const hasBleached = value === "yes";

                  setInput((current) => ({
                    ...current,
                    hasBleached,
                    bleachCount: hasBleached ? current.bleachCount : "0",
                  }));
                }}
              />

              <ChoiceGroup<BleachCount>
                columns="three"
                label="漂過次數"
                value={input.bleachCount}
                options={BLEACH_COUNT_OPTIONS}
                onChange={(value) => updateInput("bleachCount", value)}
              />

              <ChoiceGroup<TriState>
                columns="three"
                label="是否有黑染殘留"
                value={input.hasBoxDyeOrBlackDye}
                options={TRI_STATE_OPTIONS}
                onChange={(value) => updateInput("hasBoxDyeOrBlackDye", value)}
              />

              <ChoiceGroup<DamageLevel>
                label="髮質受損程度"
                value={input.damageLevel}
                options={DAMAGE_LEVEL_OPTIONS}
                onChange={(value) => updateInput("damageLevel", value)}
              />

              <div className="block">
                <label
                  htmlFor="observed-undertone"
                  className="text-sm font-medium"
                >
                  人工確認目前底色
                </label>
                <select
                  id="observed-undertone"
                  value={input.observedUndertone}
                  onChange={(event) =>
                    updateInput(
                      "observedUndertone",
                      event.target.value as ObservedUndertone,
                    )
                  }
                  className={fieldClass()}
                >
                  {OBSERVED_UNDERTONE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <label className="mt-3 flex items-start gap-3 rounded-md border border-border bg-muted p-3 text-sm">
                  <input
                    type="checkbox"
                    checked={input.manualBaseConfirmed}
                    onChange={(event) =>
                      updateInput("manualBaseConfirmed", event.target.checked)
                    }
                    className="mt-1 size-4 accent-accent"
                  />
                  <span>
                    已由設計師人工確認目前底色，不只依賴照片或色卡。
                  </span>
                </label>
              </div>

              <div>
                <p className="text-sm font-medium">人工色素殘留</p>
                <div className="mt-2 grid gap-2 sm:grid-cols-5">
                  {ARTIFICIAL_PIGMENT_OPTIONS.map((option) => {
                    const selected = input.artificialPigmentResidue.includes(
                      option.value,
                    );

                    return (
                      <button
                        key={option.value}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => togglePigment(option.value)}
                        className={`min-h-11 rounded-md border px-3 py-2 text-left text-sm font-medium ${
                          selected
                            ? "border-accent bg-teal-50 text-teal-950"
                            : "border-border bg-panel text-foreground hover:border-accent"
                        }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        )}

        {activeStep === 2 && (
          <section className={sectionClass()}>
            <p className="text-xs font-semibold uppercase tracking-normal text-accent">
              Step 03
            </p>
            <h2 className="mt-1 text-lg font-semibold">品牌規則與基礎用量</h2>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium">選擇品牌</span>
                <select
                  value={input.brandId}
                  onChange={(event) => handleBrandChange(event.target.value)}
                  className={fieldClass()}
                >
                  {brandOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-medium">選擇產品線</span>
                <select
                  value={input.productLineId}
                  onChange={(event) =>
                    updateInput("productLineId", event.target.value)
                  }
                  className={fieldClass()}
                >
                  {productLineOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label} ({option.verified})
                    </option>
                  ))}
                </select>
              </label>

              <div className="md:col-span-2">
                <div className="rounded-md border border-border bg-muted px-3 py-2 text-sm">
                  品牌規則狀態：
                  <span className="font-semibold text-foreground">
                    {selectedProductLine?.verified ?? "unverified"}
                  </span>
                  <span className="ml-1 text-muted-foreground">
                    未完整 verified 時不應視為官方精確配方。
                  </span>
                </div>
              </div>

              <ChoiceGroup<HairLength>
                label="髮長"
                value={input.hairLength}
                options={HAIR_LENGTH_OPTIONS}
                onChange={(value) => updateInput("hairLength", value)}
              />

              <ChoiceGroup<HairDensity>
                columns="three"
                label="髮量"
                value={input.hairDensity}
                options={HAIR_DENSITY_OPTIONS}
                onChange={(value) => updateInput("hairDensity", value)}
              />

              <div className="md:col-span-2">
                <GreyCoverageInput
                  greyPercentage={input.greyPercentage}
                  needsGreyCoverage={input.needsGreyCoverage}
                  onGreyPercentageChange={(value: GreyPercentage) =>
                    updateInput("greyPercentage", value)
                  }
                  onNeedsGreyCoverageChange={(value) =>
                    updateInput("needsGreyCoverage", value)
                  }
                />
              </div>
            </div>
          </section>
        )}

        {activeStep === 3 && (
          <section className={sectionClass()}>
            <p className="text-xs font-semibold uppercase tracking-normal text-accent">
              Step 04
            </p>
            <h2 className="mt-1 text-lg font-semibold">確認操作條件</h2>

            <dl className="mt-5 grid gap-2 sm:grid-cols-2">
              <SummaryItem
                label="服務與色系"
                value={`${getLabel(SERVICE_TYPE_OPTIONS, input.serviceType)}｜${getLabel(TARGET_TONE_OPTIONS, input.targetTone)}`}
              />
              <SummaryItem
                label="色度差"
                value={`${input.currentLevel} 度 → ${input.targetLevel} 度（${levelDiff > 0 ? `+${levelDiff}` : levelDiff}）`}
              />
              <SummaryItem
                label="品牌資料"
                value={`${brandOptions.find((option) => option.value === input.brandId)?.label ?? input.brandId}｜${selectedProductLine?.verified ?? "unverified"}`}
              />
              <SummaryItem
                label="估算染膏"
                value={`${estimatedGrams}g，送出後依規則計算雙氧`}
              />
            </dl>

            <div className="mt-5">
              <DeveloperSelector
                desiredTotalColorGrams={input.desiredTotalColorGrams}
                estimatedGrams={estimatedGrams}
                nearScalp={input.nearScalp}
                needsToning={input.needsToning}
                acceptsHighRisk={input.acceptsHighRisk}
                onDesiredTotalColorGramsChange={(value) =>
                  updateInput("desiredTotalColorGrams", value)
                }
                onNearScalpChange={(value) => updateInput("nearScalp", value)}
                onNeedsToningChange={(value) =>
                  updateInput("needsToning", value)
                }
                onAcceptsHighRiskChange={(value) =>
                  updateInput("acceptsHighRisk", value)
                }
              />
            </div>
          </section>
        )}

        <div className="sticky bottom-20 z-30 -mx-4 border-y border-border bg-panel/95 px-4 py-3 shadow-[0_-8px_24px_rgba(31,35,40,0.12)] backdrop-blur md:static md:mx-0 md:rounded-lg md:border md:shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-accent">
                {activeStepMeta.title}
              </p>
              <p className="text-xs text-muted-foreground">
                {activeStep + 1} / {formSteps.length}｜{activeStepMeta.subtitle}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {activeStep > 0 && (
                <button
                  type="button"
                  onClick={goToPreviousStep}
                  className="inline-flex h-11 items-center gap-1.5 rounded-md border border-border bg-panel px-3 text-sm font-semibold hover:border-accent"
                >
                  <ArrowLeft aria-hidden="true" className="size-4" />
                  上一段
                </button>
              )}
              {isLastStep ? (
                <button
                  type="submit"
                  className="inline-flex h-11 items-center gap-2 rounded-md bg-accent px-4 text-sm font-semibold text-accent-foreground shadow-sm hover:bg-teal-800"
                >
                  <Calculator aria-hidden="true" className="size-4" />
                  計算配方
                </button>
              ) : (
                <button
                  type="button"
                  onClick={goToNextStep}
                  className="inline-flex h-11 items-center gap-2 rounded-md bg-accent px-4 text-sm font-semibold text-accent-foreground shadow-sm hover:bg-teal-800"
                >
                  下一段
                  <ArrowRight aria-hidden="true" className="size-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </form>

      <div ref={resultPanelRef} className="min-w-0">
        <FormulaResult result={result} />
      </div>
    </div>
  );
}
