"use client";
import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { LogOut } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending, refetch } = useSession();

  useEffect(() => {
    if (!isPending && !session?.user) {
      toast.error("প্রোফাইল দেখতে সাইন ইন করুন");
      router.push("/signin?redirect=/profile");
    }
  }, [session, isPending, router]);

  
  useEffect(() => {
    if (typeof refetch === "function" && !isPending) {
      refetch();
    }
  }, [isPending, refetch]);

  if (isPending) {
    return (
      <div className="max-w-2xl mx-auto space-y-4 animate-pulse">
        <div className="h-8 w-40 bg-gray-200 rounded" />
        <div className="h-32 bg-white rounded-2xl border" />
        <div className="h-40 bg-white rounded-2xl border" />
      </div>
    );
  }
  if (!session?.user) return null;

  const handleSignOut = async () => {
    await signOut();
    toast.success("সাইন আউট সফল");
    router.push("/");
  };

  const avatarUrl =
    session.user.image ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      session.user.name || "U",
    )}&size=120&background=16a34a&color=fff`;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-1">আমার প্রোফাইল</h1>
      <p className="text-sm text-gray-500 mb-6">
        আপনার অ্যাকাউন্টের তথ্য দেখুন
      </p>

      <div className="bg-white rounded-2xl p-6 border mb-6 flex items-center gap-4 flex-wrap">
        <img
          src={avatarUrl}
          alt=""
          className="w-16 h-16 rounded-full object-cover border-2 border-green-100"
        />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-lg">{session.user.name}</p>
          <p className="text-sm text-gray-500 truncate">{session.user.email}</p>
        </div>
        <button
          onClick={handleSignOut}
          className="border border-red-300 text-red-600 px-4 py-2 rounded-lg text-sm hover:bg-red-50 flex items-center gap-2"
        >
          <LogOut size={16} /> সাইন আউট
        </button>
      </div>

      <div className="bg-white rounded-2xl p-6 border">
        <h2 className="font-bold mb-4">তথ্য</h2>
        <label className="text-sm font-medium block mb-1">নাম</label>
        <input
          value={session.user.name || ""}
          readOnly
          className="w-full border rounded-lg px-3 py-2 bg-gray-50 mb-4"
        />
        <Link
          href="/update-profile"
          className="block text-center bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-lg"
        >
          আপডেট
        </Link>
      </div>
    </div>
  );
}
