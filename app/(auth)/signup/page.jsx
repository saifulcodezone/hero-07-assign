"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp, signIn } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      toast.error("পাসওয়ার্ড মিলছে না");
      return;
    }
    if (form.password.length < 6) {
      toast.error("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে");
      return;
    }
    setLoading(true);
    try {
      const res = await signUp.email({
        name: form.name,
        email: form.email,
        password: form.password,
      });
      if (res.error)
        throw new Error(res.error.message || "রেজিস্ট্রেশন ব্যর্থ");
      toast.success("অ্যাকাউন্ট তৈরি হয়েছে! এখন সাইন ইন করুন");
      router.push("/signin");
    } catch (err) {
      toast.error(err.message || "কিছু ভুল হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  const handleSocial = async (provider) => {
    try {
      await signIn.social({ provider, callbackURL: "/" });
    } catch {
      toast.error(`${provider} সাইন আপ ব্যর্থ`);
    }
  };

  return (
    <div className="max-w-md mx-auto py-8">
      <h1 className="text-2xl font-bold text-center mb-1">
        অ্যাকাউন্ট তৈরি করুন
      </h1>
      <p className="text-sm text-gray-500 text-center mb-6">
        বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl p-6 border space-y-4"
      >
        <div>
          <label className="text-sm font-medium block mb-1">নাম</label>
          <input
            required
            placeholder="যেমন: রহিম উদ্দিন"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
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
        <div>
          <label className="text-sm font-medium block mb-1">
            পাসওয়ার্ড নিশ্চিত করুন
          </label>
          <input
            type="password"
            required
            placeholder="আবার লিখুন"
            value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-lg disabled:opacity-60"
        >
          {loading ? "অপেক্ষা করুন..." : "অ্যাকাউন্ট তৈরি করুন"}
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
          অ্যাকাউন্ট আছে?{" "}
          <Link
            href="/signin"
            className="text-green-700 font-medium hover:underline"
          >
            সাইন ইন করুন
          </Link>
        </p>
      </form>

      <p className="text-center text-sm text-gray-500 mt-4">
        ←{" "}
        <Link href="/" className="hover:underline">
          হোম পেজে ফিরে যান
        </Link>
      </p>
    </div>
  );
}
