// app/page.js
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import { PRODUCTS, getTopRisers, getTopFallers } from "@/lib/data";

export default function HomePage() {

  const products = PRODUCTS;
  const risers = getTopRisers(6);
  const fallers = getTopFallers(6);

  return (
    <>
      <Hero />

      {/* আজ দাম বেড়েছে */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span className="text-red-600">▲</span> আজ দাম বেড়েছে
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {risers.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* আজ দাম কমেছে */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span className="text-green-600">▼</span> আজ দাম কমেছে
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {fallers.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* সব পণ্য */}
      <section id="সব-পণ্য" className="mb-10 scroll-mt-32">
        <h2 className="text-xl font-bold mb-1">সব পণ্য</h2>
        <p className="text-sm text-gray-500 mb-4">
          মোট {products.length} টি পণ্য দেখানো হচ্ছে
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </>
  );
}
