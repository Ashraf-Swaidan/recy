"use server";
import { connect } from '@/app/lib/db';
import Recipe from '@/app/lib/models/recipe.model';
import User from '@/app/lib/models/user.model';
import Cookbook from '@/app/lib/models/cookbook.model';
import { RecipeInterface, Like } from '@/app/lib/types';
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
  
 // Like a recipe
export async function likeRecipe(userId: string, recipeId: string): Promise<boolean> {
  try {
    await connect();

    // Validate the IDs
    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(recipeId)) {
      return false;
    }

    // Find the recipe by ID
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return false; // Recipe not found
    }

    // Check if the user already liked the recipe
    const alreadyLiked = recipe.likes.some((like: { userId: Types.ObjectId }) => 
      like.userId.toString() === userId
    );
    if (alreadyLiked) {
      return true; // Recipe is already liked
    }

    // Add the like
    recipe.likes.push({ userId, likedAt: new Date() });
    await recipe.save();

    return true; // Like was successfully added
  } catch (error) {
    console.error('Error liking recipe:', error);
    return false;
  }
}

export async function unlikeRecipe(userId: string, recipeId: string): Promise<boolean> {
  try {
    await connect();

    // Validate the IDs
    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(recipeId)) {
      return false;
    }

    // Find the recipe by ID
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return false; // Recipe not found
    }

    // Find the like to remove
    const likeIndex = recipe.likes.findIndex((like: Like) => like.userId.toString() === userId);
    if (likeIndex === -1) {
      return false; // User hasn't liked the recipe
    }

    // Remove the like
    recipe.likes.splice(likeIndex, 1);
    await recipe.save();

    return true; // Like was successfully removed
  } catch (error) {
    console.error('Error unliking recipe:', error);
    return false;
  }
}

export async function isRecipeLikedByUser(userId: string, recipeId: string): Promise<boolean> {
  try {
    await connect();

    // Validate the IDs
    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(recipeId)) {
      return false;
    }

    // Find the recipe by ID
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return false; // Recipe not found
    }

    // Check if the user has liked the recipe
    const alreadyLiked = recipe.likes.some((like: Like) => like.userId.toString() === userId);

    return alreadyLiked;
  } catch (error) {
    console.error('Error checking if recipe is liked by user:', error);
    return false;
  }
}



// Add a recipe to the user's cookbook
export async function addToCookbook(userId: string, recipeId: string): Promise<boolean> {
  try {
    await connect();

    // Validate the IDs
    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(recipeId)) {
      return false;
    }

    // Find or create the user's cookbook
    let cookbook = await Cookbook.findOne({ userId });
    if (!cookbook) {
      cookbook = new Cookbook({ userId, savedRecipes: [] });
    }

    // Check if the recipe is already in the cookbook
    const alreadySaved = cookbook.savedRecipes.some(
      (savedRecipe: { recipeId: Types.ObjectId }) =>
        savedRecipe.recipeId.toString() === recipeId
    );
    if (alreadySaved) {
      console.log("Recipe is already saved")
      return true; // Recipe is already saved
    }

    // Add the recipe to the cookbook
    cookbook.savedRecipes.push({ recipeId, savedAt: new Date() });
    await cookbook.save();
    console.log("Recipe successfully added to your cookbook!")

    return true; // Recipe was successfully added to the cookbook
  } catch (error) {
    console.error('Error adding recipe to cookbook:', error);
    return false;
  }
}

// Remove a recipe from the user's cookbook
export async function removeFromCookbook(userId: string, recipeId: string): Promise<boolean> {
  try {
    await connect();

    // Validate the IDs
    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(recipeId)) {
      return false;
    }

    // Find the user's cookbook
    const cookbook = await Cookbook.findOne({ userId });
    if (!cookbook) {
      console.log("Cookbook not found for the user");
      return false; // No cookbook found for the user
    }

    // Filter out the recipe to remove it
    const initialCount = cookbook.savedRecipes.length;
    cookbook.savedRecipes = cookbook.savedRecipes.filter(
      (savedRecipe: { recipeId: Types.ObjectId }) =>
        savedRecipe.recipeId.toString() !== recipeId
    );

    // If no recipes were removed, it means the recipe wasn't found
    if (cookbook.savedRecipes.length === initialCount) {
      console.log("Recipe not found in the cookbook");
      return false; // Recipe not found
    }

    // Save the updated cookbook
    await cookbook.save();
    console.log("Recipe successfully removed from the cookbook!");

    return true; // Recipe successfully removed
  } catch (error) {
    console.error("Error removing recipe from cookbook:", error);
    return false;
  }
}

// Fetch the total number of saves for a recipe across all cookbooks
export async function fetchRecipeSaves(recipeId: string): Promise<number> {
  try {
    await connect();

    // Validate the recipe ID
    if (!Types.ObjectId.isValid(recipeId)) {
      throw new Error('Invalid recipe ID');
    }

    // Count how many cookbooks contain this recipeId in savedRecipes
    const count = await Cookbook.countDocuments({
      'savedRecipes.recipeId': new Types.ObjectId(recipeId),
    });

    return count;
  } catch (error) {
    console.error('Error fetching recipe saves:', error);
    return 0; // In case of an error, return 0 as the default
  }
}