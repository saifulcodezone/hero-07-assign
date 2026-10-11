"use client";
import { useEffect, useState } from "react";
import { API_BASE, formatBengaliPrice, getUnitLabel } from "@/lib/utils";

export default function PriceTicker() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/products`)
      .then((r) => r.json())
      .then((d) => {
        const arr = Array.isArray(d) ? d : d.products || [];
        setItems(arr.slice(0, 15));
      })
      .catch(() => {});
  }, []);

  if (!items.length) return <div className="h-10 bg-gray-50 border-y" />;

  const marqueeItems = [...items, ...items];

  return (
    <div className="bg-gray-50 border-y overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap py-2">
        {marqueeItems.map((p, i) => {
          const up = p.change?.dir === "up";
          const flat = p.change?.dir === "flat";
          return (
            <div
              key={i}
              className="flex items-center gap-1.5 px-5 text-sm border-r border-gray-200"
            >
              <span className="emoji">{p.image}</span>
              <span className="font-medium">{p.nameBn}</span>
              <span className="text-gray-600">
                {formatBengaliPrice(p.today)} টাকা/{p.unit}
              </span>
              <span
                className={`font-semibold ${
                  flat
                    ? "text-gray-500"
                    : up
                      ? "text-red-600"
                      : "text-green-600"
                }`}
              >
                {flat ? "—" : up ? "▲" : "▼"}{" "}
                {Math.abs(p.change?.pct || 0).toFixed(1)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
