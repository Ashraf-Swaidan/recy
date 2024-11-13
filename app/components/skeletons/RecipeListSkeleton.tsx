import React from 'react';

const RecipeListSkeleton = () => {
  return (
    <div className="flex flex-wrap gap-6 justify-center">
      {Array.from({ length: 8 }, (_, index) => (
        <div
          key={index}
          className="bg-white shadow-lg rounded-lg overflow-hidden w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 animate-pulse"
        >
          <div className="relative w-full h-48 bg-gray-200"></div>
          <div className="p-6 flex flex-col flex-grow">
            <div className="flex justify-between items-center mb-2 gap-2">
              <div className="h-5 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
            <div className="h-12 bg-gray-200 rounded mb-4 flex-grow"></div>
            <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecipeListSkeleton;