"use client";

import { useMemo, useState } from "react";
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

function fieldClass() {
  return "mt-2 h-11 w-full rounded-md border border-border bg-panel px-3 text-sm outline-none focus:border-accent";
}

function sectionClass() {
  return "rounded-lg border border-border bg-panel p-5";
}

export function FormulaForm() {
  const [input, setInput] = useState<FormulaInput>(DEFAULT_FORMULA_INPUT);
  const [result, setResult] = useState<FormulaOutput | null>(null);
  const brandOptions = useMemo(() => getBrandOptions(), []);
  const productLineOptions = useMemo(
    () => getProductLineOptions(input.brandId),
    [input.brandId],
  );
  const estimatedGrams = getEstimatedColorGrams(input);

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

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResult(calculateFormula(input));
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
      <form onSubmit={handleSubmit} className="space-y-5">
        <section className={sectionClass()}>
          <h2 className="text-lg font-semibold">A. 基本目標</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium">服務類型</span>
              <select
                value={input.serviceType}
                onChange={(event) =>
                  updateInput("serviceType", event.target.value as ServiceType)
                }
                className={fieldClass()}
              >
                {SERVICE_TYPE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

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
        </section>

        <section className={sectionClass()}>
          <h2 className="text-lg font-semibold">B. 髮況</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium">是否漂過</span>
              <select
                value={input.hasBleached ? "yes" : "no"}
                onChange={(event) => {
                  const hasBleached = event.target.value === "yes";
                  setInput((current) => ({
                    ...current,
                    hasBleached,
                    bleachCount: hasBleached ? current.bleachCount : "0",
                  }));
                }}
                className={fieldClass()}
              >
                <option value="no">否</option>
                <option value="yes">是</option>
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-medium">漂過次數</span>
              <select
                value={input.bleachCount}
                onChange={(event) =>
                  updateInput("bleachCount", event.target.value as BleachCount)
                }
                className={fieldClass()}
              >
                {BLEACH_COUNT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-medium">是否有黑染殘留</span>
              <select
                value={input.hasBoxDyeOrBlackDye}
                onChange={(event) =>
                  updateInput(
                    "hasBoxDyeOrBlackDye",
                    event.target.value as TriState,
                  )
                }
                className={fieldClass()}
              >
                {TRI_STATE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-medium">髮質受損程度</span>
              <select
                value={input.damageLevel}
                onChange={(event) =>
                  updateInput("damageLevel", event.target.value as DamageLevel)
                }
                className={fieldClass()}
              >
                {DAMAGE_LEVEL_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-medium">髮量</span>
              <select
                value={input.hairDensity}
                onChange={(event) =>
                  updateInput("hairDensity", event.target.value as HairDensity)
                }
                className={fieldClass()}
              >
                {HAIR_DENSITY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-medium">髮長</span>
              <select
                value={input.hairLength}
                onChange={(event) =>
                  updateInput("hairLength", event.target.value as HairLength)
                }
                className={fieldClass()}
              >
                {HAIR_LENGTH_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

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
              <label className="mt-3 flex items-start gap-3 rounded-md border border-border bg-panel p-3 text-sm">
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
          </div>

          <div className="mt-5">
            <p className="text-sm font-medium">人工色素殘留</p>
            <div className="mt-2 grid gap-2 sm:grid-cols-5">
              {ARTIFICIAL_PIGMENT_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-2 rounded-md border border-border bg-panel px-3 py-2 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={input.artificialPigmentResidue.includes(
                      option.value,
                    )}
                    onChange={() => togglePigment(option.value)}
                    className="size-4 accent-accent"
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        </section>

        <section className={sectionClass()}>
          <h2 className="text-lg font-semibold">C. 操作設定</h2>
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
              onNeedsToningChange={(value) => updateInput("needsToning", value)}
              onAcceptsHighRiskChange={(value) =>
                updateInput("acceptsHighRisk", value)
              }
            />
          </div>
        </section>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            目前：{input.currentLevel} 度 → {input.targetLevel} 度，目標{" "}
            {getLabel(TARGET_TONE_OPTIONS, input.targetTone)}
          </p>
          <button
            type="submit"
            className="h-11 rounded-md bg-accent px-5 text-sm font-semibold text-accent-foreground hover:bg-teal-800"
          >
            計算配方
          </button>
        </div>
      </form>
      <FormulaResult result={result} />
    </div>
  );
}
