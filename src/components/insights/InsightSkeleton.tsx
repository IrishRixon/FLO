export function InsightSkeleton() {
  return (
    <div className="p-8 animate-pulse">
      {/* Header skeleton */}
      <div className="mb-8">
        <div className="h-7 w-24 bg-[#242428] rounded-md mb-2" />
        <div className="h-4 w-64 bg-[#242428] rounded-md" />
      </div>

      {/* Hero card skeleton */}
      <div className="bg-[#1A1A1E] rounded-xl border border-[rgba(255,255,255,0.06)] border-l-[3px] border-l-[#7C6EF7] p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-4 w-4 bg-[#242428] rounded" />
          <div className="h-3 w-24 bg-[#242428] rounded" />
        </div>
        <div className="h-3 w-20 bg-[#242428] rounded mb-3" />
        <div className="space-y-2">
          <div className="h-4 w-full bg-[#242428] rounded" />
          <div className="h-4 w-5/6 bg-[#242428] rounded" />
          <div className="h-4 w-4/6 bg-[#242428] rounded" />
        </div>
      </div>

      {/* 3 card skeletons in a grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-[#1A1A1E] rounded-xl border border-[rgba(255,255,255,0.06)] p-5"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#242428] flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 bg-[#242428] rounded" />
                <div className="h-3 w-full bg-[#242428] rounded" />
                <div className="h-3 w-5/6 bg-[#242428] rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Savings card skeleton */}
      <div className="bg-[#1A1A1E] rounded-xl border border-[rgba(255,255,255,0.06)] p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-[#242428]" />
          <div className="h-4 w-36 bg-[#242428] rounded" />
        </div>
        <div className="h-7 w-28 bg-[#242428] rounded mb-2" />
        <div className="h-3 w-40 bg-[#242428] rounded mb-3" />
        <div className="h-4 w-full bg-[#242428] rounded" />
        <div className="h-4 w-4/6 bg-[#242428] rounded mt-1" />
      </div>
    </div>
  );
}