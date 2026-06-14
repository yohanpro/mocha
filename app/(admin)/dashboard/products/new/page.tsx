import { ProductForm } from "@/src/features/manage-product/ui/ProductForm";

export default function NewProductPage() {
  return (
    <main className="mx-auto max-w-lg px-4 py-6">
      <h1 className="mb-4 text-lg font-bold">새 상품 등록</h1>
      <ProductForm />
    </main>
  );
}
