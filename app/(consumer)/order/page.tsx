import { use } from "react";
import { redirect } from "next/navigation";
import { getProduct } from "@/src/entities/product/api";
import { OrderForm } from "@/src/features/order-product/ui/OrderForm";
import { Header } from "@/src/shared/ui/Header";

export default function OrderPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string }>;
}) {
  const { product: productId } = use(searchParams);

  if (!productId) redirect("/products");

  const product = use(getProduct(productId));

  if (!product || product.status !== "active") redirect("/products");

  return (
    <div className="min-h-screen bg-paper">
      <OrderForm product={product} />
    </div>
  );
}
