// components/RecipeList.tsx
import { fetchRecipes } from '@/actions/recipe.action';
import { RecipeWithOwner } from '../lib/types';
import RecipeCard from './recipe/RecipeCard';

const RecipeList = async () => {
  let recipes: RecipeWithOwner[] = [];

  try {
    recipes = await fetchRecipes(); // Fetch the raw recipes data from DB
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return <p className="text-red-500">Error: Failed to load recipes</p>;
  }

  return (

      <div className="flex flex-wrap gap-6 justify-center">
        {recipes.map((recipe) => (
      <RecipeCard key={recipe._id} recipe={recipe} />
    ))}
      </div>
  );
};

export default RecipeList;
