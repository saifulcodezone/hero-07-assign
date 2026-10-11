"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession, updateUser } from "@/lib/auth-client";
import toast from "react-hot-toast";
import Link from "next/link";

export default function UpdateProfilePage() {
  const router = useRouter();
  const { data: session, isPending, refetch } = useSession();
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Load current values
  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
      setImage(session.user.image || "");
    }
  }, [session]);

  // Auth guard
  useEffect(() => {
    if (!isPending && !session?.user) {
      toast.error("সাইন ইন করুন");
      router.push("/signin?redirect=/update-profile");
    }
  }, [session, isPending, router]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 500 * 1024) {
      toast.error("ছবি ৫০০KB এর ছোট হতে হবে");
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("শুধু ছবি আপলোড করুন");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
      toast.success("ছবি লোড হয়েছে");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("নাম লিখুন");
      return;
    }

    setLoading(true);

    try {
      
      const payload = { name: name.trim() };
      if (image && image !== session.user.image) {
        payload.image = image;
      }

      console.log("[updateUser] sending:", {
        name: payload.name,
        hasImage: !!payload.image,
      });

      const res = await updateUser(payload);
      console.log("[updateUser] response:", res);

      if (res?.error) {
        throw new Error(res.error.message || "আপডেট ব্যর্থ");
      }

      
      if (typeof refetch === "function") {
        await refetch();
      }

      toast.success("তথ্য সফলভাবে আপডেট হয়েছে");

      
      setTimeout(() => {
        router.push("/profile");
        router.refresh();
      }, 300);
    } catch (err) {
      console.error("[updateUser] ERROR:", err);
      toast.error(err.message || "কিছু ভুল হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  if (isPending) {
    return (
      <div className="max-w-md mx-auto py-8 h-40 bg-white rounded-2xl border animate-pulse" />
    );
  }
  if (!session?.user) return null;

  const previewUrl =
    image ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name || "U",
    )}&size=120&background=16a34a&color=fff`;

  return (
    <div className="max-w-md mx-auto py-8">
      <h1 className="text-2xl font-bold mb-1">তথ্য আপডেট করুন</h1>
      <p className="text-sm text-gray-500 mb-6">
        আপনার নাম ও প্রোফাইল ছবি পরিবর্তন করুন
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl p-6 border space-y-5"
      >
        <div className="flex flex-col items-center gap-3">
          <img
            src={previewUrl}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
          />

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-sm text-green-700 hover:underline font-medium"
            >
              ছবি পরিবর্তন করুন
            </button>
            {image && (
              <button
                type="button"
                onClick={() => setImage("")}
                className="text-sm text-red-600 hover:underline font-medium"
              >
                ছবি সরান
              </button>
            )}
          </div>

          <p className="text-xs text-gray-400">
            সর্বোচ্চ ৫০০KB · JPG, PNG, GIF
          </p>
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">নাম</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="আপনার নাম লিখুন"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">
            ইমেইল (পরিবর্তন করা যাবে না)
          </label>
          <input
            value={session.user.email}
            readOnly
            disabled
            className="w-full border rounded-lg px-3 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-lg disabled:opacity-60"
        >
          {loading ? "আপডেট হচ্ছে..." : "তথ্য আপডেট করুন"}
        </button>

        <Link
          href="/profile"
          className="block text-center text-sm text-gray-500 hover:text-gray-700"
        >
          ← ফিরে যান
        </Link>
      </form>
    </div>
  );
}
