export function formatPublicVisitCount(count: number | null) {
  if (count === null) {
    return "統計設定中";
  }

  return new Intl.NumberFormat("zh-TW").format(count);
}
