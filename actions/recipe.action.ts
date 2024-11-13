"use server";
import { connect } from '@/app/lib/db';
import Recipe from '@/app/lib/models/recipe.model';
import User from '@/app/lib/models/user.model';
import { RecipeInterface } from '@/app/lib/types';
import { Types } from 'mongoose';

  export async function fetchRecipes() {
    try {
      await connect(); // Ensure the database connection is established
      
      // Fetch all recipes
      const recipes = await Recipe.find(); // Fetch all recipes
  
      // For each recipe, fetch the corresponding user (owner) from the User model
      const recipesWithUsers = await Promise.all(
        recipes.map(async (recipe) => {
          const user = await User.findById(recipe.createdBy); // Find the user by the createdBy field (which is the user's _id)
          
          // Return the recipe along with the user data
          return {
            ...recipe.toObject(), // Convert Mongoose document to plain object
            owner: user ? user.toObject() : null, // Attach user data (owner) to recipe
          };
        })
      );
  
      return JSON.parse(JSON.stringify(recipesWithUsers)); // Return the recipes with their corresponding user (owner) data
    } catch (error) {
      console.error('Error fetching recipes:', error);
      throw new Error('Failed to fetch recipes');
    }
  }

  export async function fetchRecipeById(id: string): Promise<RecipeInterface | null>{
    try{
      await connect();

      // Fetch the recipe using the id param
      if (!Types.ObjectId.isValid(id)) {
        return null;
    };

      const recipe = await Recipe.findById(id).lean().exec() as RecipeInterface | null;

      // Notify the user if there was no recipe with that id
      if(!recipe) return null;

      // return the recipe we got if we found it
      return recipe;

    } catch (error) {
      // Return the message of any error we possibly catch
      console.error('Error fetching recipe:', error);
      return null;

    }
  }
  