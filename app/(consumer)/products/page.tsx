import { getProducts } from "@/src/entities/product/api";
import { ProductCard } from "@/src/entities/product/ui/ProductCard";
import { Header } from "@/src/shared/ui/Header";
import { BottomNav } from "@/src/shared/ui/BottomNav";

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-20 md:pb-0">
      <Header activeNav="products" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        <h1 className="text-[#1C1C1C] text-xl md:text-3xl font-bold mb-6 md:mb-8">
          지금 살 수 있어요
        </h1>

        {products.length === 0 ? (
          <div className="text-center py-20 text-[#B0A899]">
            <p className="text-lg">현재 판매 중인 상품이 없어요</p>
            <p className="text-sm mt-2">곧 새로운 상품이 올라올 예정이에요 🌱</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </main>

      <BottomNav active="products" />
    </div>
  );
}
