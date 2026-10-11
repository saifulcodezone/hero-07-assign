"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { formatBengaliPrice, toBengaliNumber, getUnitLabel } from "@/lib/utils";
import { PRODUCTS } from "@/lib/data";
import toast from "react-hot-toast";
import ProductSkeleton from "@/components/ProductSkeleton";
import Link from "next/link";

function ProductContent() {
  const { slug } = useParams();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Auth guard
  useEffect(() => {
    if (!isPending && !session?.user) {
      toast.error("এই পেজ দেখতে সাইন ইন করুন");
      router.push(`/signin?redirect=/product/${slug}`);
    }
  }, [session, isPending, router, slug]);

  // Load product from local data
  useEffect(() => {
    if (!session?.user) return;
    setLoading(true);
    const found = PRODUCTS.find((p) => p.slug === slug) || null;
    if (!found) toast.error("পণ্য খুঁজে পাওয়া যায়নি");
    setProduct(found);
    setLoading(false);
  }, [slug, session]);

  // Loading state
  if (isPending || (session?.user && loading)) {
    return <ProductSkeleton />;
  }

 
  if (!session?.user) return null;

  // Product not found
  if (!product) {
    return (
      <div className="text-center py-20">
        <p className="text-5xl mb-4">
          <span className="emoji">🔍</span>
        </p>
        <h1 className="text-2xl font-bold mb-4">পণ্য খুঁজে পাওয়া যায়নি</h1>
        <p className="text-gray-500 mb-6">
          আপনি যে পণ্যটি খুঁজছেন সেটি নেই বা সরিয়ে ফেলা হয়েছে।
        </p>
        <Link
          href="/"
          className="bg-green-600 text-white px-5 py-2.5 rounded-lg inline-block hover:bg-green-700"
        >
          হোম পেজে ফিরে যান
        </Link>
      </div>
    );
  }

  // Compute summary
  const markets = product.markets || [];
  const minPrice = markets.length
    ? Math.min(...markets.map((m) => m.min))
    : product.today;
  const maxPrice = markets.length
    ? Math.max(...markets.map((m) => m.max))
    : product.today;
  const avgPrice = markets.length
    ? Math.round(
        markets.reduce((s, m) => s + (m.min + m.max) / 2, 0) / markets.length,
      )
    : product.today;

  const up = product.change?.dir === "up";
  const flat = product.change?.dir === "flat";

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 flex items-center gap-1 flex-wrap">
        <Link href="/" className="hover:text-green-700">
          হোম
        </Link>
        <span>/</span>
        <Link
          href={`/category/${product.category}`}
          className="hover:text-green-700"
        >
          {product.categoryNameBn}
        </Link>
        <span>/</span>
        <span className="text-gray-800">{product.nameBn}</span>
      </div>

      {/* Top summary */}
      <div className="bg-white rounded-2xl p-6 border flex flex-col md:flex-row gap-6">
        <div className="flex items-start gap-4 flex-1">
          <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center text-4xl">
            <span className="emoji">{product.image}</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold">{product.nameBn}</h1>
            <p className="text-sm text-gray-500">
              {getUnitLabel(product.unit)} · {product.categoryNameBn}
            </p>
            <p className="text-sm text-gray-700 mt-2">
              {up
                ? `গতকালের তুলনায় আজ দাম বেড়েছে — ${toBengaliNumber(
                    Math.abs(product.change.pct),
                  )}%`
                : flat
                  ? "গতকালের তুলনায় আজ দাম অপরিবর্তিত"
                  : `গতকালের তুলনায় আজ দাম কমেছে — ${toBengaliNumber(
                      Math.abs(product.change.pct),
                    )}%`}
            </p>
          </div>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 text-center min-w-[180px]">
          <p className="text-xs text-gray-500">আজকের দাম</p>
          <p className="text-3xl font-bold text-gray-900">
            {formatBengaliPrice(product.today)}
          </p>
          <p className="text-xs text-gray-500">
            টাকা /{" "}
            {product.unit === "kg"
              ? "কেজি"
              : product.unit === "litre"
                ? "লিটার"
                : product.unit === "dozen"
                  ? "ডজন"
                  : "পিস"}
          </p>
          <p
            className={`text-sm font-semibold mt-1 ${
              flat ? "text-gray-500" : up ? "text-red-600" : "text-green-600"
            }`}
          >
            {flat ? "—" : up ? "▲" : "▼"}{" "}
            {toBengaliNumber(Math.abs(product.change.pct).toFixed(1))}%
          </p>
        </div>
      </div>

      {/* Price summary */}
      <div className="bg-white rounded-2xl p-6 border">
        <h2 className="font-bold mb-4">দামের সারসংক্ষেপ</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-xl p-4">
            <p className="text-xs text-gray-500">সর্বনিম্ন দাম</p>
            <p className="text-2xl font-bold text-green-600">
              {formatBengaliPrice(minPrice)} টাকা
            </p>
            <p className="text-xs text-gray-500 mt-1">সবচেয়ে কম দামের বাজার</p>
          </div>
          <div className="border rounded-xl p-4">
            <p className="text-xs text-gray-500">সর্বোচ্চ দাম</p>
            <p className="text-2xl font-bold text-red-600">
              {formatBengaliPrice(maxPrice)} টাকা
            </p>
            <p className="text-xs text-gray-500 mt-1">
              সবচেয়ে বেশি দামের বাজার
            </p>
          </div>
          <div className="border rounded-xl p-4">
            <p className="text-xs text-gray-500">গড় দাম</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatBengaliPrice(avgPrice)} টাকা
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {getUnitLabel(product.unit)}-এর হিসাব
            </p>
          </div>
        </div>
      </div>

      {/* Bazar-wise table */}
      <div className="bg-white rounded-2xl p-6 border overflow-x-auto">
        <h2 className="font-bold mb-4">বাজারভিত্তিক আজকের দাম</h2>
        <table className="w-full text-sm min-w-[600px]">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="py-3 font-medium">বাজার</th>
              <th className="font-medium">বিভাগ</th>
              <th className="font-medium">সর্বনিম্ন</th>
              <th className="font-medium">সর্বোচ্চ</th>
              <th className="font-medium">গড়</th>
            </tr>
          </thead>
          <tbody>
            {markets.map((m, i) => (
              <tr
                key={i}
                className="border-b last:border-none hover:bg-gray-50"
              >
                <td className="py-3 font-medium">{m.market}</td>
                <td>{m.division}</td>
                <td>{formatBengaliPrice(m.min)} টাকা</td>
                <td>{formatBengaliPrice(m.max)} টাকা</td>
                <td className="font-semibold">
                  {formatBengaliPrice(Math.round((m.min + m.max) / 2))} টাকা
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function ProductDetailPage() {
  return (
    <Suspense fallback={<ProductSkeleton />}>
      <ProductContent />
    </Suspense>
  );
}
