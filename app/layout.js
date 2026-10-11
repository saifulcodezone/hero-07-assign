import { Hind_Siliguri } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";

const hind = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-hind",
});

export const metadata = {
  title: "বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে",
  description: "চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার আজকের বাজার দর",
};

function NavbarWithSuspense() {
  return (
    <Suspense
      fallback={
        <div className="bg-white shadow-sm sticky top-0 z-40 h-16 animate-pulse" />
      }
    >
      <Navbar />
    </Suspense>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="bn">
      <body className="bg-[#f5f7f5] min-h-screen flex flex-col">
        <NavbarWithSuspense />
        <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
          {children}
        </main>
        <Footer />
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      </body>
    </html>
  );
}
