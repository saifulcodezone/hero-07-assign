export default function ProductSkeleton() {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 bg-gray-200 rounded-lg" />
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
      <div className="mt-3 flex justify-between items-end">
        <div className="w-20">
          <div className="h-3 bg-gray-200 rounded w-full mb-1" />
          <div className="h-5 bg-gray-200 rounded w-full" />
        </div>
        <div className="h-6 w-14 bg-gray-200 rounded" />
      </div>
    </div>
  );
}
