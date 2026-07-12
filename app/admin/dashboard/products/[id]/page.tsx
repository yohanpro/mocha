import { notFound } from "next/navigation";
import { getProduct } from "@/src/entities/product/api";
import { ProductForm } from "@/src/features/manage-product/ui/ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) notFound();

  return (
    <main className="mx-auto max-w-lg px-4 py-6">
      <h1 className="mb-4 text-lg font-bold">상품 수정</h1>
      <ProductForm product={product} />
    </main>
  );
}
