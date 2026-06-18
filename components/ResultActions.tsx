"use client";

import { useState } from "react";
import { Download, Share2 } from "lucide-react";
import type { FormulaOutput } from "@/lib/types";

type ResultActionsProps = {
  result: FormulaOutput;
};

const UTF8_BOM = "\uFEFF";

function formatGrams(grams: number | null) {
  return grams === null ? "需人工確認" : `${grams} g`;
}

function formatDeveloper(result: FormulaOutput) {
  if (
    result.developer.developerPercent === null ||
    result.developer.volume === null
  ) {
    return "需人工確認";
  }

  return `${result.developer.developerPercent}% / ${result.developer.volume} vol`;
}

function formatConfidence(confidenceLevel: FormulaOutput["confidenceLevel"]) {
  const labels = {
    high: "高",
    medium: "中",
    low: "低",
  };

  return labels[confidenceLevel];
}

export function buildReport(result: FormulaOutput) {
  const generatedAt = new Date().toLocaleString("zh-TW", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const hasPreciseGrams =
    result.totalColorGrams !== null &&
    result.totalDeveloperGrams !== null &&
    result.formulaItems.every((item) => item.grams !== null);
  const sourceLines =
    result.sourceSummary.length > 0
      ? result.sourceSummary.map(
          (source) =>
            `- ${source.title}｜${source.sourceType}｜${source.verification}${
              source.url ? `｜${source.url}` : ""
            }`,
        )
      : ["- 未附來源摘要，請回到品牌規則頁確認 verified / partial / unverified 狀態。"];
  const lines = [
    "HairColor Formula Assistant",
    "美髮染髮配方助理｜沙龍專業配方單",
    "26肯邦AI進階課程｜李詩民",
    `建立時間：${generatedAt}`,
    "",
    "一、基本資料",
    "顧客姓名：____________________",
    "設計師：____________________",
    "服務日期：____________________",
    "現場底色確認：□ 已確認　□ 待確認",
    "髮束測試：□ 已完成　□ 待完成",
    "",
    "二、配方狀態",
    `輸出狀態：${hasPreciseGrams ? "可作為配方方向" : "不輸出精確克數，需人工確認"}`,
    `信心等級：${formatConfidence(result.confidenceLevel)}`,
    `混合比例：${result.mixingRatio}`,
    `染膏總量：${formatGrams(result.totalColorGrams)}`,
    `雙氧總量：${formatGrams(result.totalDeveloperGrams)}`,
    `雙氧濃度：${formatDeveloper(result)}`,
    "",
    "三、配方項目",
    ...result.formulaItems.map(
      (item) =>
        `- ${item.label}：${formatGrams(item.grams)}｜${item.note}`,
    ),
    "",
    "四、雙氧建議",
    result.developer.reason,
    ...result.developer.restrictions.map((restriction) => `- ${restriction}`),
    "",
    "五、施工流程",
    ...result.processSteps.map((step, index) => `${index + 1}. ${step}`),
    "",
    "六、風險與安全提醒",
    ...result.riskWarnings.map((warning) => `- ${warning}`),
    "",
    "七、資料來源",
    ...sourceLines,
    "",
    "八、專業確認",
    result.professionalCheckRequired,
    "本工具不保證染髮結果；實際操作需依品牌官方最新技術手冊、現場髮況與專業判斷。",
    "皮膚過敏測試與髮束測試應於實際操作前完成。",
    "",
    "設計師簽名：____________________",
    "複核人員：____________________",
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
          下載沙龍配方單
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
