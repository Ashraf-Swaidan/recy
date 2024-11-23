import React from 'react'
import RecipeListSkeleton from '../components/skeletons/RecipeListSkeleton'
import {  Search, Filter } from 'lucide-react';

const loading = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-8 border-b-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Cookbook</h1>
            <p className="text-gray-600">
              0 recipes saved
            </p>
          </div>
          
          {/* Search Bar */}
          <div className='flex flex-col sm:flex-row gap-4'>
            <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="search"
              placeholder="Search your recipes..."
              className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
              <Filter className="w-5 h-5 text-gray-600" />
              <span>Filter</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recipe Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="p-4">
          <RecipeListSkeleton />
        </div>
      </div>
    </div>
   
  )
}

export default loading