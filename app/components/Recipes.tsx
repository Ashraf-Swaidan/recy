// components/RecipeList.tsx
import { fetchRecipes } from '@/actions/recipe.action';
import Image from 'next/image';
import Link from 'next/link';

interface Recipe {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  createdBy: string;
  owner: {
    _id: string;
    firstName: string;
    lastName: string;
    photo: string;
  };
}

const RecipeList = async () => {
  let recipes: Recipe[] = [];

  try {
    recipes = await fetchRecipes(); // Fetch the raw recipes data from DB
    console.log(recipes);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return <p className="text-red-500">Error: Failed to load recipes</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-center text-orange-600">Featured Recipes</h2>
      <div className="flex flex-wrap gap-6 justify-center">
        {recipes.map((recipe) => (
          <div
            key={recipe._id}
            className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 w-full sm:w-1/2 lg:w-1/3 xl:w-1/4"
          >
            <div className="relative w-full h-48">
              <Image
                src={recipe.imageUrl === '' ? '/placeholder.png' : recipe.imageUrl}
                alt={recipe.title}
                layout="fill"
                objectFit="cover"
                className="w-full h-full rounded-t-lg"
              />
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-orange-600 mb-2">{recipe.title}</h3>
              <p className="text-gray-600 mt-2 mb-4 line-clamp-3">{recipe.description}</p>
              <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                <p>Prep: {recipe.prepTime} mins</p>
                <p>Cook: {recipe.cookTime} mins</p>
              </div>
              <p className="text-sm text-gray-500 mb-4">Servings: {recipe.servings}</p>

              {/* Owner Info */}
              <div className="flex items-center mb-4">
                <div className="relative w-10 h-10 mr-3 rounded-full overflow-hidden">
                  <Image
                    src={recipe.owner?.photo || '/default-avatar.png'}
                    alt={`${recipe.owner.firstName} ${recipe.owner.lastName}`}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-full"
                  />
                </div>
                <p className="text-sm text-gray-500">
                  <span className="font-medium">{recipe.owner.firstName} {recipe.owner.lastName}</span>
                </p>
              </div>

              {/* Explore Button */}
              <Link href={`/recipes/${recipe._id}`} className="inline-block px-6 py-2 text-sm font-semibold text-white bg-orange-600 rounded hover:bg-orange-700 transition duration-200">       
                  Explore Recipe
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeList;
