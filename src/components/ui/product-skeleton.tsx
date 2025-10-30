import React from 'react';

export function ProductSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-200 rounded-xl h-48 w-full" />
      <div className="mt-3 h-4 bg-gray-200 rounded w-3/4" />
      <div className="mt-2 h-4 bg-gray-200 rounded w-1/2" />
      <div className="mt-3 h-6 bg-gray-200 rounded w-1/3" />
    </div>
  );
}

export function ProductGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}
