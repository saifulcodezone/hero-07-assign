"use client";
import { useState, useEffect } from "react";
import { getBanglaDate } from "@/lib/utils";

export default function Hero() {
  const [dateStr, setDateStr] = useState("");

  useEffect(() => {
  
    setDateStr(getBanglaDate());
  }, []);

  return (
    <section className="bg-white rounded-2xl p-6 md:p-10 mb-8 border border-gray-100">
      <div className="grid md:grid-cols-2 gap-6 items-center">
        {/* Left content */}
        <div>
          {/* Eyebrow / date badge */}
          <span className="inline-block text-xs bg-green-50 text-green-700 px-3 py-1 rounded-full mb-3 min-h-[24px]">
            {dateStr || "\u00A0"}
          </span>

          {/* Main heading */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-3">
            আজকের বাজারের দাম এক নজরে
          </h1>

          {/* Subtitle */}
          <p className="text-gray-600 mb-5">
            চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক
            বিস্তারিত, গড়, সর্বনিম্ন-সর্বোচ্চ এবং দামের পরিবর্তন এক জায়গায়।
          </p>

          {/* CTA — anchor link to #সব-পণ্য */}
          <a
            href="#সব-পণ্য"
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
          >
            সব পণ্য দেখুন
          </a>
        </div>

        {/* Right — basket image */}
        <div className="flex justify-center">
          <img
            src="/basket.png"
            alt="বাজারের ঝুড়ি"
            className="w-48 sm:w-56 md:w-64 h-48 sm:h-56 md:h-64 object-contain"
          />
        </div>
      </div>
    </section>
  );
}
