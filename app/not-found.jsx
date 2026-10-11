import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto text-center py-20">
      <p className="text-7xl mb-4">
        <span className="emoji">🛒</span>
      </p>
      <h1 className="text-3xl font-bold mb-2">৪০৪ — পেজ খুঁজে পাওয়া যায়নি</h1>
      <p className="text-gray-500 mb-6">
        আপনি যে পেজটি খুঁজছেন সেটি নেই বা সরিয়ে ফেলা হয়েছে।
      </p>
      <Link
        href="/"
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg inline-block"
      >
        হোম পেজে ফিরে যান
      </Link>
    </div>
  );
}
