"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { getBanglaDate } from "@/lib/utils";
import { CATEGORIES } from "@/lib/data";
import toast from "react-hot-toast";
import { ShoppingCart, LogOut, User } from "lucide-react";
import { useState, useEffect } from "react";
import PriceTicker from "./PriceTicker";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [open, setOpen] = useState(false);

  const [dateStr, setDateStr] = useState("");

  useEffect(() => {
    setDateStr(getBanglaDate());
  }, []);

  const handleSignOut = async () => {
    await signOut();
    toast.success("সাইন আউট সফল হয়েছে");
    setOpen(false);
    router.push("/");
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-green-600 rounded-lg flex items-center justify-center text-white">
            <ShoppingCart size={20} />
          </div>
          <div>
            <h1 className="font-bold text-lg text-green-700 leading-none">
              বাজার দর
            </h1>

            <p className="text-[10px] text-gray-500 min-h-[14px]">
              {dateStr || "\u00A0"}
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          {isPending ? (
            <div className="w-20 h-8 bg-gray-200 rounded animate-pulse" />
          ) : session?.user ? (
            <div className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-100"
              >
                <img
                  src={
                    session.user.image ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      session.user.name || "U",
                    )}`
                  }
                  alt=""
                  className="w-8 h-8 rounded-full"
                />
                <span className="hidden sm:block text-sm font-medium">
                  {session.user.name?.split(" ")[0]}
                </span>
              </button>
              {open && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border p-3 z-50">
                  <p className="font-semibold">{session.user.name}</p>
                  <p className="text-xs text-gray-500 mb-2">
                    {session.user.email}
                  </p>
                  <Link
                    href="/profile"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-lg text-sm"
                  >
                    <User size={16} /> আমার প্রোফাইল
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-red-50 text-red-600 rounded-lg text-sm"
                  >
                    <LogOut size={16} /> সাইন আউট
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/signin"
                className="text-sm font-medium text-gray-700 hover:text-green-700"
              >
                সাইন ইন
              </Link>
              <Link
                href="/signup"
                className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg"
              >
                সাইন আপ
              </Link>
            </>
          )}
        </div>
      </div>

      <nav className="border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex items-center gap-1 px-4 py-2 overflow-x-auto no-scrollbar">
          <Link
            href="/"
            className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap ${
              pathname === "/"
                ? "bg-green-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            সব
          </Link>
          {CATEGORIES.map((c) => {
            const active = pathname === `/category/${c.slug}`;
            return (
              <Link
                key={c.slug}
                href={`/category/${c.slug}`}
                className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap flex items-center gap-1.5 ${
                  active
                    ? "bg-green-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className="emoji">{c.icon}</span>
                <span>{c.nameBn}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <PriceTicker />
    </header>
  );
}
