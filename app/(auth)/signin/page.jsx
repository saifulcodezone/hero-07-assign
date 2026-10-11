"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "@/lib/auth-client";
import toast from "react-hot-toast";

// 👇 Inner component useSearchParams use করে
function SignInForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") || "/";
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await signIn.email({
        email: form.email,
        password: form.password,
      });
      if (res.error) throw new Error(res.error.message || "লগইন ব্যর্থ");
      toast.success("সফলভাবে সাইন ইন করেছেন");
      router.push(redirect);
    } catch (err) {
      toast.error(err.message || "ইমেইল বা পাসওয়ার্ড ভুল");
    } finally {
      setLoading(false);
    }
  };

  const handleSocial = async (provider) => {
    try {
      await signIn.social({ provider, callbackURL: redirect });
    } catch {
      toast.error(`${provider} লগইন ব্যর্থ`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl p-6 border space-y-4"
    >
      <div>
        <label className="text-sm font-medium block mb-1">ইমেইল</label>
        <input
          type="email"
          required
          placeholder="you@example.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
      <div>
        <label className="text-sm font-medium block mb-1">পাসওয়ার্ড</label>
        <input
          type="password"
          required
          placeholder="কমপক্ষে ৬ অক্ষর"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-lg disabled:opacity-60"
      >
        {loading ? "অপেক্ষা করুন..." : "সাইন ইন"}
      </button>

      <div className="flex items-center gap-2 text-xs text-gray-400">
        <div className="flex-1 h-px bg-gray-200" />
        <span>অথবা</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => handleSocial("google")}
          className="border rounded-lg py-2 text-sm hover:bg-gray-50 flex items-center justify-center gap-2"
        >
          <img
            src="https://www.google.com/favicon.ico"
            className="w-4 h-4"
            alt=""
          />
          Google
        </button>
        <button
          type="button"
          onClick={() => handleSocial("github")}
          className="border rounded-lg py-2 text-sm hover:bg-gray-50 flex items-center justify-center gap-2"
        >
          <img
            src="https://github.com/favicon.ico"
            className="w-4 h-4"
            alt=""
          />
          GitHub
        </button>
      </div>

      <p className="text-center text-sm text-gray-600">
        অ্যাকাউন্ট নেই?{" "}
        <Link
          href="/signup"
          className="text-green-700 font-medium hover:underline"
        >
          সাইন আপ করুন
        </Link>
      </p>
    </form>
  );
}

// 👇 Main page — Suspense দিয়ে wrap করি
export default function SignInPage() {
  return (
    <div className="max-w-md mx-auto py-8">
      <h1 className="text-2xl font-bold text-center mb-1">সাইন ইন</h1>
      <p className="text-sm text-gray-500 text-center mb-6">
        বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।
      </p>

      <Suspense
        fallback={
          <div className="bg-white rounded-2xl p-6 border space-y-4 animate-pulse">
            <div className="h-4 w-20 bg-gray-200 rounded" />
            <div className="h-10 bg-gray-200 rounded" />
            <div className="h-4 w-20 bg-gray-200 rounded" />
            <div className="h-10 bg-gray-200 rounded" />
            <div className="h-10 bg-gray-200 rounded" />
          </div>
        }
      >
        <SignInForm />
      </Suspense>

      <p className="text-center text-sm text-gray-500 mt-4">
        ←{" "}
        <Link href="/" className="hover:underline">
          হোম পেজে ফিরে যান
        </Link>
      </p>
    </div>
  );
}
