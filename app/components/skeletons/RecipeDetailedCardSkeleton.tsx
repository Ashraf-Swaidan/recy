import React from 'react';
import { Clock, Users, ChefHat, Calendar } from 'lucide-react';

const RecipeDetailedCardSkeleton = () => {
  return (
    <article className="bg-white shadow-xl rounded-xl p-8 max-w-4xl mx-auto my-8 animate-pulse">
      {/* Header Skeleton */}
      <header className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            {/* Avatar Skeleton */}
            <div className="w-16 h-16 rounded-full bg-gray-200" />
            <div>
              {/* Username Skeleton */}
              <div className="h-5 w-32 bg-gray-200 rounded mb-2" />
              <div className="flex items-center">
                <ChefHat className="w-4 h-4 mr-1 text-gray-200" />
                <div className="h-4 w-24 bg-gray-200 rounded" />
              </div>
              <div className="flex items-center mt-1">
                <Calendar className="w-4 h-4 mr-1 text-gray-200" />
                <div className="h-4 w-28 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
          
          {/* Action Buttons Skeleton */}
          <div className="flex space-x-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-10 h-10 rounded-full bg-gray-200" />
            ))}
          </div>
        </div>

        {/* Title and Description Skeleton */}
        <div className="h-8 w-3/4 bg-gray-200 rounded mb-4" />
        <div className="space-y-2">
          <div className="h-4 w-full bg-gray-200 rounded" />
          <div className="h-4 w-5/6 bg-gray-200 rounded" />
        </div>
      </header>

      {/* Image Skeleton */}
      <div className="relative h-96 mb-8 rounded-xl overflow-hidden bg-gray-200" />

      {/* Quick Info Grid Skeleton */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-gray-100 rounded-xl p-4 flex flex-col items-center justify-center">
            {i % 2 === 0 ? (
              <Clock className="w-6 h-6 text-gray-200 mb-2" />
            ) : (
              <Users className="w-6 h-6 text-gray-200 mb-2" />
            )}
            <div className="h-4 w-16 bg-gray-200 rounded mb-1" />
            <div className="h-4 w-12 bg-gray-200 rounded" />
          </div>
        ))}
      </div>

      {/* Ingredients Section Skeleton */}
      <section className="mb-8">
        <h2 className="flex items-center mb-4">
          <span className="w-8 h-8 bg-gray-200 rounded-lg mr-2" />
          <div className="h-6 w-32 bg-gray-200 rounded" />
        </h2>
        <div className="bg-gray-100 rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-gray-200" />
                <div className="h-4 w-16 bg-gray-200 rounded" />
                <div className="h-4 w-24 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instructions Section Skeleton */}
      <section className="mb-8">
        <h2 className="flex items-center mb-4">
          <span className="w-8 h-8 bg-gray-200 rounded-lg mr-2" />
          <div className="h-6 w-32 bg-gray-200 rounded" />
        </h2>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-start p-4 bg-gray-100 rounded-xl">
              <span className="w-8 h-8 bg-gray-200 rounded-full mr-4" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-full bg-gray-200 rounded" />
                <div className="h-4 w-5/6 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tags Section Skeleton */}
      <footer className="mt-8 pt-6 border-t border-gray-100">
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-8 w-24 bg-gray-200 rounded-full" />
          ))}
        </div>
      </footer>
    </article>
  );
};

export default RecipeDetailedCardSkeleton;