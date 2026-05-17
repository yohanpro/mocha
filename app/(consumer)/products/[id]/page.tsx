export default function ProductDetailPage({ params }: { params: { id: string } }) {
  return <main>상품 상세 {params.id}</main>
}
