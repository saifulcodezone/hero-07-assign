import Link from "next/link";
import { formatBengaliPrice, getUnitLabel } from "@/lib/utils";

export default function ProductCard({ product }) {
  const up = product.change?.dir === "up";
  const flat = product.change?.dir === "flat";
  const badgeColor = flat
    ? "bg-gray-100 text-gray-600"
    : up
      ? "bg-red-50 text-red-600"
      : "bg-green-50 text-green-600";

  return (
    <Link
      href={`/product/${product.slug}`}
      className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md hover:border-green-200 transition block"
    >
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center text-2xl">
          <span className="emoji">{product.image}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">
            {product.nameBn}
          </h3>
          <p className="text-xs text-gray-500">{getUnitLabel(product.unit)}</p>
        </div>
      </div>
      <div className="mt-3 flex items-end justify-between">
        <div>
          <p className="text-xs text-gray-500">আজকের দাম</p>
          <p className="text-xl font-bold text-gray-900">
            {formatBengaliPrice(product.today)}{" "}
            <span className="text-sm font-normal">টাকা</span>
          </p>
        </div>
        <span
          className={`text-xs font-semibold px-2 py-1 rounded-md ${badgeColor}`}
        >
          {flat ? "—" : up ? "▲" : "▼"}{" "}
          {Math.abs(product.change?.pct || 0).toFixed(1)}%
        </span>
      </div>
    </Link>
  );
}
