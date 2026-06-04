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
