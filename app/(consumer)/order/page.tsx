import { use } from "react";
import { redirect } from "next/navigation";
import { getProduct } from "@/src/entities/product/api";
import { OrderForm } from "@/src/features/order-product/ui/OrderForm";
import { Header } from "@/src/shared/ui/Header";

export default function OrderPage({
  searchParams,
}: {
  searchParams: Promise<{ productId?: string }>;
}) {
  // React 19 use() — Promise를 render에서 직접 unwrap
  const { productId } = use(searchParams);

  if (!productId) redirect("/products");

  // Product fetch도 use()로 unwrap (Suspense boundary 필요)
  const product = use(getProduct(productId));

  if (!product || product.status !== "active") redirect("/products");

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <Header title="주문서" backHref={`/products/${productId}`} backLabel="뒤로" />
      <OrderForm product={product} />
    </div>
  );
}
