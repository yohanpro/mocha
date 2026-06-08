export function formatPrice(n: number) {
  return n.toLocaleString("ko-KR") + "원";
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);
  const weeks = Math.floor(days / 7);

  if (minutes < 1) return "방금 전";
  if (minutes < 60) return `${minutes}분 전`;
  if (hours < 24) return `${hours}시간 전`;
  if (days < 7) return `${days}일 전`;
  if (weeks < 4) return `${weeks}주 전`;
  return formatDate(iso);
}

export function getDateGroup(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86_400_000);

  if (days < 1) return "오늘";
  if (days < 7) return "이번 주";
  if (days < 30) return "이번 달";
  return "지난 게시물";
}
