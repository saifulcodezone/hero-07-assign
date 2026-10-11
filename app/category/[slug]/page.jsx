"use client";
import { useEffect, useState, Suspense } from "react";
import { useParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import ProductSkeleton from "@/components/ProductSkeleton";
import { PRODUCTS, CATEGORIES } from "@/lib/data";
import Link from "next/link";

function CategoryContent() {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("default");

  useEffect(() => {
    setLoading(true);
    const filtered = PRODUCTS.filter((p) => p.category === slug);
    const t = setTimeout(() => {
      setProducts(filtered);
      setLoading(false);
    }, 200);
    return () => clearTimeout(t);
  }, [slug]);

  const sorted = [...products];
  if (sort === "low-high") sorted.sort((a, b) => a.today - b.today);
  if (sort === "high-low") sorted.sort((a, b) => b.today - a.today);

  const meta = CATEGORIES.find((c) => c.slug === slug) || {
    nameBn: slug,
    icon: "📦",
  };
  const isEmpty = !loading && products.length === 0;

  return (
    <div>
      <div className="bg-white rounded-2xl p-6 border mb-6 flex items-center gap-4">
        <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center text-3xl">
          <span className="emoji">{meta.icon}</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold">{meta.nameBn}</h1>
          <p className="text-sm text-gray-500">
            {loading
              ? "লোড হচ্ছে..."
              : `${products.length} টি পণ্যের আজকের দাম ও পরিবর্তন`}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-3 border mb-4 flex items-center justify-end gap-3">
        <span className="text-sm text-gray-600">সাজান:</span>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="default">ডিফল্ট</option>
          <option value="low-high">দাম: কম থেকে বেশি</option>
          <option value="high-low">দাম: বেশি থেকে কম</option>
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      ) : isEmpty ? (
        <div className="bg-white rounded-2xl p-12 text-center border">
          <p className="text-5xl mb-4">
            <span className="emoji">🔍</span>
          </p>
          <h2 className="text-xl font-bold mb-2">কোনো পণ্য পাওয়া যায়নি</h2>
          <p className="text-gray-500 mb-6">
            এই ক্যাটাগরিতে এখন কোনো পণ্য নেই বা ক্যাটাগরি সঠিক নয়।
          </p>
          <Link
            href="/"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg inline-block"
          >
            হোম পেজে ফিরে যান
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sorted.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CategoryPage() {
  return (
    <Suspense
      fallback={
        <div>
          <div className="bg-white rounded-2xl p-6 border mb-6 flex items-center gap-4 animate-pulse">
            <div className="w-14 h-14 bg-gray-200 rounded-xl" />
            <div>
              <div className="h-6 w-32 bg-gray-200 rounded mb-2" />
              <div className="h-4 w-48 bg-gray-200 rounded" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        </div>
      }
    >
      <CategoryContent />
    </Suspense>
  );
}
