import React from 'react';

const FormSkeleton = () => {
  return (
    <form className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8 space-y-6">
      {/* Basic Information */}
      <div className="space-y-6">
        <div>
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-3" />
          <div className="h-10 bg-gray-300 rounded w-full mb-4" />
        </div>

        <div>
          <div className="h-4 bg-gray-300 rounded w-1/3 mb-3" />
          <div className="h-24 bg-gray-300 rounded w-full mb-4" />
        </div>

        <div className="flex flex-col justify-start items-start">
          <div className="h-4 bg-gray-300 rounded w-1/2 mb-3" />
          <div className="w-full h-12 bg-gray-300 rounded mb-4" />
        </div>
      </div>

      {/* Time and Servings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <div>
          <div className="h-4 bg-gray-300 rounded w-2/3 mb-3" />
          <div className="h-12 bg-gray-300 rounded w-full mb-4" />
        </div>

        <div>
          <div className="h-4 bg-gray-300 rounded w-2/3 mb-3" />
          <div className="h-12 bg-gray-300 rounded w-full mb-4" />
        </div>

        <div>
          <div className="h-4 bg-gray-300 rounded w-2/3 mb-3" />
          <div className="h-12 bg-gray-300 rounded w-full mb-4" />
        </div>
      </div>

      {/* Dynamic Ingredients */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <div className="h-4 bg-gray-300 rounded w-24" />
          <div className="h-8 bg-gray-300 rounded w-24" />
        </div>
        <div className="space-y-3">
          <div className="flex flex-col md:flex-row gap-3 items-start">
            <div className="h-12 bg-gray-300 rounded w-full md:flex-1" />
            <div className="h-12 bg-gray-300 rounded w-full md:flex-1" />
            <button type="button" className="p-3 text-gray-500 cursor-not-allowed">
              <div className="h-5 w-5 bg-gray-300 rounded" />
            </button>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8">
        <div className="h-4 bg-gray-300 rounded w-1/3 mb-3" />
        <div className="h-24 bg-gray-300 rounded w-full mb-4" />
      </div>

      {/* Tags */}
      <div className="mt-8">
        <div className="h-4 bg-gray-300 rounded w-1/3 mb-3" />
        <div className="h-12 bg-gray-300 rounded w-full mb-4" />
      </div>

      {/* Updated Submit Button */}
      <div className="w-full mt-8 h-12 bg-gray-300 rounded-lg cursor-not-allowed" />
    </form>
  );
};

export default FormSkeleton;
