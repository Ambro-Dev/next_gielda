import React from "react";

const shimmer =
  "bg-gradient-to-r from-muted via-muted/60 to-muted bg-[length:200%_100%] animate-shimmer rounded";

const TransportsSkeleton = () => {
  return (
    <div className="flex flex-col w-full pb-10">
      {/* Search bar skeleton */}
      <div className="flex flex-col sm:flex-row w-full gap-3 py-4">
        <div className="flex flex-1 flex-col sm:flex-row gap-3">
          <div className={`h-10 flex-1 ${shimmer}`} />
          <div className={`h-10 flex-1 ${shimmer}`} />
        </div>
        <div className={`h-10 w-40 ${shimmer}`} />
      </div>

      {/* Filter bar skeleton */}
      <div className="flex items-center gap-3 py-3 border-t-2 border-t-primary/30 border-b-2 border-b-border mb-6">
        <div className={`h-8 w-24 ${shimmer}`} />
        <div className={`h-8 w-28 ${shimmer}`} />
        <div className={`h-8 w-16 ${shimmer}`} />
        <div className={`ml-auto h-4 w-20 ${shimmer}`} />
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border/30 overflow-hidden"
          >
            <div className={`h-44 ${shimmer}`} />
            <div className="p-4 space-y-3">
              <div className={`h-3.5 w-3/4 ${shimmer}`} />
              <div className="ml-[6px] w-px h-3 bg-border" />
              <div className={`h-3.5 w-2/3 ${shimmer}`} />
              <div className="flex gap-3 pt-1">
                <div className={`h-3 w-14 ${shimmer}`} />
                <div className={`h-3 w-14 ${shimmer}`} />
                <div className={`h-3 w-14 ${shimmer}`} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransportsSkeleton;
