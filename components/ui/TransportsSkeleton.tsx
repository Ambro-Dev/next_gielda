import React from "react";

const TransportsSkeleton = () => {
  const renderSkeletons = Array.from({ length: 6 }).map((_, index) => (
    <div
      key={index}
      className="flex flex-col rounded-lg border border-gray-200 overflow-hidden"
    >
      <div className="h-48 bg-gray-200 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
        <div className="flex gap-2">
          <div className="h-6 bg-gray-200 rounded w-16 animate-pulse" />
          <div className="h-6 bg-gray-200 rounded w-16 animate-pulse" />
        </div>
        <div className="flex gap-4">
          <div className="h-3 bg-gray-200 rounded w-20 animate-pulse" />
          <div className="h-3 bg-gray-200 rounded w-20 animate-pulse" />
        </div>
        <div className="h-4 bg-gray-200 rounded w-28 animate-pulse mt-2" />
      </div>
    </div>
  ));

  return (
    <div className="flex flex-col w-full xl:px-0 px-3 pb-10">
      {/* Search nearby placeholder */}
      <div className="flex flex-col sm:flex-row w-full gap-3 py-4">
        <div className="flex flex-1 flex-col sm:flex-row gap-3">
          <div className="h-10 bg-gray-200 rounded flex-1 animate-pulse" />
          <div className="h-10 bg-gray-200 rounded flex-1 animate-pulse" />
        </div>
        <div className="h-10 bg-gray-200 rounded w-40 animate-pulse" />
      </div>
      {/* Filter bar skeleton */}
      <div className="flex items-center gap-3 py-4 border-b border-gray-200 mb-6">
        <div className="h-9 bg-gray-200 rounded w-28 animate-pulse" />
        <div className="h-9 bg-gray-200 rounded w-28 animate-pulse" />
        <div className="h-9 bg-gray-200 rounded w-20 animate-pulse" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
        {renderSkeletons}
      </div>
    </div>
  );
};

export default TransportsSkeleton;
