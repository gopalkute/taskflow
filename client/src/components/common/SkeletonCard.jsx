// src/components/common/SkeletonCard.jsx
// Skeleton loading placeholder for task cards

const SkeletonCard = () => (
  <div className="card p-5 space-y-3">
    <div className="flex items-start justify-between">
      <div className="shimmer h-4 w-3/4 rounded" />
      <div className="shimmer h-5 w-16 rounded-full" />
    </div>
    <div className="shimmer h-3 w-full rounded" />
    <div className="shimmer h-3 w-2/3 rounded" />
    <div className="flex items-center justify-between pt-2">
      <div className="shimmer h-5 w-14 rounded-full" />
      <div className="flex gap-2">
        <div className="shimmer h-7 w-7 rounded-lg" />
        <div className="shimmer h-7 w-7 rounded-lg" />
      </div>
    </div>
  </div>
);

export const SkeletonGrid = ({ count = 6 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
    {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
  </div>
);

export default SkeletonCard;
