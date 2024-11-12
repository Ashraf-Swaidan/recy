import React from 'react'
import { fetchRecipeById } from '@/actions/recipe.action';
import { findRecipeOwner } from '@/actions/user.action';
import RecipeDetailedCard from '@/app/components/recipe/RecipeDetailedCard';

  interface RecipePageProps{
    params: {
      id: string;
    }
  }

const page = async ({params} : RecipePageProps) => {
  const {id} = params;
  const recipe = await fetchRecipeById(id);
  
  if(!recipe) {
    return (
      <div>
        <h1>Such Recipe was not found :l</h1>
      </div>
    )
  } 

  const recipeOwner = await findRecipeOwner(recipe?.createdBy);

  if(!recipeOwner) {
    return (
      <div>
        <h1>The Chef behind the recipe was not found :l</h1>
      </div>
    )
  }

  return (
    <div className='bg-orange-50 p-6'>
      <RecipeDetailedCard recipe={recipe} owner={recipeOwner}/>
    </div>
  )
}

export default page