export function SkeletonLine({ className = "" }) {
  return <div className={`skeleton h-4 ${className}`} />;
}

export function SkeletonCard() {
  return (
    <div className="card p-5 space-y-3">
      <SkeletonLine className="w-1/3" />
      <SkeletonLine className="w-2/3 h-6" />
      <SkeletonLine className="w-1/2" />
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="card p-4 flex items-center gap-4">
      <div className="skeleton w-5 h-5 rounded-md" />
      <div className="flex-1 space-y-2">
        <SkeletonLine className="w-1/3" />
        <SkeletonLine className="w-1/2 h-3" />
      </div>
    </div>
  );
}
