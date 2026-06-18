import Link from "next/link";
import Image from "next/image";
import { StockBadge } from "./StockBadge";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image?: string;
  stock: number;
}

export function ProductCard({
  id,
  name,
  price,
  image,
  stock,
}: ProductCardProps) {
  return (
    <Link href={`/products/${id}`}>
      <div className="border border-border rounded-[14px] overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 bg-white cursor-pointer">
        <div className="relative w-full h-[160px] md:h-[180px] bg-gradient-to-br from-green-100 to-clay-100 flex items-center justify-center">
          {image ? (
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 340px"
            />
          ) : (
            <span className="font-mono text-xs text-green-500">farm photo</span>
          )}
          {stock === 0 && (
            <div className="absolute inset-0 bg-black/45 flex items-center justify-center">
              <span className="bg-ink text-white text-xs font-bold px-3 py-1 rounded-full">
                완판
              </span>
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="font-bold text-base mb-2 line-clamp-2">{name}</div>
          <div className="flex justify-between items-center mb-2">
            <span className="font-mono font-bold text-base text-ink">
              {price.toLocaleString()}원
            </span>
            <StockBadge stock={stock} />
          </div>
        </div>
      </div>
    </Link>
  );
}
