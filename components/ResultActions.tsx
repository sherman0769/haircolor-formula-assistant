"use client";

import { useState } from "react";
import { Download, Share2 } from "lucide-react";
import type { FormulaOutput } from "@/lib/types";

type ResultActionsProps = {
  result: FormulaOutput;
};

const UTF8_BOM = "\uFEFF";

export function buildReport(result: FormulaOutput) {
  const generatedAt = new Date().toLocaleDateString("zh-TW", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const lines = [
    "HairColor Formula Assistant",
    "美髮染髮配方助理｜專業配方摘要",
    `建立日期：${generatedAt}`,
    "",
    "配方狀態：需由專業美髮設計師確認",
    `混合比例：${result.mixingRatio}`,
    `染膏：${result.totalColorGrams === null ? "需人工確認" : `${result.totalColorGrams} g`}`,
    `雙氧：${result.totalDeveloperGrams === null ? "需人工確認" : `${result.totalDeveloperGrams} g`}`,
    `雙氧建議：${
      result.developer.developerPercent === null
        ? "需人工確認"
        : `${result.developer.developerPercent}% / ${result.developer.volume} vol`
    }`,
    `信心等級：${result.confidenceLevel}`,
    "",
    "配方項目：",
    ...result.formulaItems.map(
      (item) =>
        `- ${item.label}: ${item.grams === null ? "需人工確認" : `${item.grams} g`}｜${item.note}`,
    ),
    "",
    "施工流程：",
    ...result.processSteps.map((step, index) => `${index + 1}. ${step}`),
    "",
    "風險提醒：",
    ...result.riskWarnings.map((warning) => `- ${warning}`),
    "",
    result.professionalCheckRequired,
  ];

  return lines.join("\n");
}

export function buildDownloadReport(result: FormulaOutput) {
  return `${UTF8_BOM}${buildReport(result).replace(/\n/g, "\r\n")}`;
}

export function ResultActions({ result }: ResultActionsProps) {
  const [status, setStatus] = useState("");
  const report = buildReport(result);

  function downloadReport() {
    const blob = new Blob([buildDownloadReport(result)], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `haircolor-formula-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setStatus("已建立本機下載檔案。");
  }

  async function shareReport() {
    const shareText = `${report}\n\nhttps://haircolor-formula-assistant.vercel.app`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "HairColor Formula Assistant",
          text: shareText,
        });
        setStatus("已開啟系統分享。");
        return;
      }

      await navigator.clipboard.writeText(shareText);
      setStatus("已複製專業摘要與連結。");
    } catch {
      setStatus("分享已取消，或目前瀏覽器不支援此動作。");
    }
  }

  return (
    <div className="border-t border-border pt-4">
      <div className="grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={downloadReport}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-foreground px-4 text-sm font-semibold text-background hover:opacity-90"
        >
          <Download aria-hidden="true" className="size-4" />
          下載配方摘要
        </button>
        <button
          type="button"
          onClick={shareReport}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border bg-panel px-4 text-sm font-semibold text-foreground hover:border-accent"
        >
          <Share2 aria-hidden="true" className="size-4" />
          分享給設計師
        </button>
      </div>
      <p className="mt-2 text-xs leading-5 text-muted-foreground">
        下載會建立文字檔到此裝置；分享會使用系統分享或複製摘要，不會把配方上傳到伺服器。
      </p>
      {status && <p className="mt-2 text-xs font-medium text-accent">{status}</p>}
    </div>
  );
}
