import React from 'react';
import RecipeCard from '../components/recipe/RecipeCard';
import { fetchUserCookbook } from '@/actions/user.action';
import { fetchRecipeWithOwnerById } from '@/actions/recipe.action';
import { currentUser } from '@clerk/nextjs/server';
import { Book, Search, Filter } from 'lucide-react';

const CookbookPage = async () => {
  const user = await currentUser();
  const userId = user?.publicMetadata.userId as string;
  const userCookbook = await fetchUserCookbook(userId);

  if (!userCookbook?.savedRecipes?.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50">
        <Book className="w-16 h-16 text-orange-600 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Your Cookbook is Empty</h2>
        <p className="text-gray-600 text-center max-w-md">
          Start building your personal cookbook by saving recipes you love!
        </p>
      </div>
    );
  }

  const recipes = await Promise.all(
    userCookbook.savedRecipes.map(async (savedRecipe) => {
      const recipe = await fetchRecipeWithOwnerById(savedRecipe.recipeId.toString());
      return recipe;
    })
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-8 border-b-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Cookbook</h1>
            <p className="text-gray-600">
              {recipes.length} {recipes.length === 1 ? 'recipe' : 'recipes'} saved
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe._id} recipe={recipe} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CookbookPage;