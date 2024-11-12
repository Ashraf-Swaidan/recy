import React from 'react';
import { Clock, Users, ChefHat, Calendar, Heart, Bookmark } from 'lucide-react';
import { fetchRecipeById } from '@/actions/recipe.action';
import { findRecipeOwner } from '@/actions/user.action';

interface RecipeDetailedCardProps {
 id: string
}

const RecipeDetailedCard: React.FC<RecipeDetailedCardProps> = async ({ id }) => {
  
  const recipe = await fetchRecipeById(id);
  if(!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Recipe Not Found</h1>
          <p className="text-gray-600">We couldn't find the recipe you're looking for.</p>
        </div>
      </div>
    )
  } 

  const owner = await findRecipeOwner(recipe?.createdBy);

  if(!owner) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Chef Not Found</h1>
          <p className="text-gray-600">We couldn't find the chef who created this recipe.</p>
        </div>
      </div>
    )
  }
  
  const totalTime = recipe.prepTime + recipe.cookTime;
  const formattedDate = new Date(recipe.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <article className="bg-white shadow-xl rounded-xl p-8 max-w-4xl mx-auto mb-8">
      {/* Recipe Header */}
      <header className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <img
              src={owner.photo}
              alt={owner.username}
              className="w-16 h-16 rounded-full border-2 border-orange-200 shadow-md"
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{owner.username}</h3>
              <div className="flex items-center text-gray-500">
                <ChefHat className="w-4 h-4 mr-1" />
                <span className="text-sm">Recipe Creator</span>
              </div>
              <div className="flex items-center text-gray-500 text-sm mt-1">
                <Calendar className="w-4 h-4 mr-1" />
                <span>{formattedDate}</span>
              </div>
            </div>
          </div>
          <div className="flex space-x-3">
            <button className="p-2 hover:bg-orange-50 rounded-full transition-colors">
              <Heart className="w-6 h-6 text-orange-500" />
            </button>
            <button className="p-2 hover:bg-orange-50 rounded-full transition-colors">
              <Bookmark className="w-6 h-6 text-orange-500" />
            </button>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">{recipe.title}</h1>
        <p className="text-lg text-gray-600 leading-relaxed">{recipe.description}</p>
      </header>

      {/* Recipe Image */}
      {recipe.imageUrl && (
        <div className="relative h-96 mb-8 rounded-xl overflow-hidden shadow-lg">
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      {/* Recipe Quick Info */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-orange-50 rounded-xl p-4 flex flex-col items-center justify-center">
          <Clock className="w-6 h-6 text-orange-500 mb-2" />
          <span className="text-sm text-gray-600">Prep Time</span>
          <span className="font-semibold text-gray-800">{recipe.prepTime} min</span>
        </div>
        <div className="bg-orange-50 rounded-xl p-4 flex flex-col items-center justify-center">
          <Clock className="w-6 h-6 text-orange-500 mb-2" />
          <span className="text-sm text-gray-600">Cook Time</span>
          <span className="font-semibold text-gray-800">{recipe.cookTime} min</span>
        </div>
        <div className="bg-orange-50 rounded-xl p-4 flex flex-col items-center justify-center">
          <Clock className="w-6 h-6 text-orange-500 mb-2" />
          <span className="text-sm text-gray-600">Total Time</span>
          <span className="font-semibold text-gray-800">{totalTime} min</span>
        </div>
        <div className="bg-orange-50 rounded-xl p-4 flex flex-col items-center justify-center">
          <Users className="w-6 h-6 text-orange-500 mb-2" />
          <span className="text-sm text-gray-600">Servings</span>
          <span className="font-semibold text-gray-800">{recipe.servings}</span>
        </div>
      </div>

      {/* Ingredients Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
          <span className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-2">
            <span className="text-orange-500 font-bold">1</span>
          </span>
          Ingredients
        </h2>
        <div className="bg-orange-50 rounded-xl p-6">
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-orange-400" />
                <span className="font-medium text-gray-700">{ingredient.quantity}</span>
                <span className="text-gray-600">{ingredient.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Instructions Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
          <span className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-2">
            <span className="text-orange-500 font-bold">2</span>
          </span>
          Instructions
        </h2>
        <div className="space-y-4">
          {recipe.instructions.map((step, index) => (
            <div
              key={index}
              className="flex items-start p-4 bg-gray-50 rounded-xl hover:bg-orange-50 transition-colors"
            >
              <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                {index + 1}
              </span>
              <p className="text-gray-700 leading-relaxed">{step}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tags Section */}
      {recipe.tags && recipe.tags.length > 0 && (
        <footer className="mt-8 pt-6 border-t border-gray-100">
          <div className="flex flex-wrap gap-2">
            {recipe.tags.map((tag, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-orange-100 text-orange-600 rounded-full text-sm font-medium hover:bg-orange-200 transition-colors cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        </footer>
      )}
    </article>
  );
};

export default RecipeDetailedCard;