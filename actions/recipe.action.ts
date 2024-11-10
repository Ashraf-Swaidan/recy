
import { connect } from '@/app/lib/db';
import Recipe from '@/app/lib/models/recipe.model';
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import User from '@/app/lib/models/user.model';

// export async function createRecipe(formData: FormData) {
//     'use server'
//     await connect();
//     const user = await currentUser();
//     if (!user?.publicMetadata?.userId) {
//       throw new Error("User not authenticated");
//     }
  
//     // Get all ingredients from formData
//     const ingredientNames = formData.getAll('ingredientName');
//     const ingredientQuantities = formData.getAll('ingredientQuantity');
    
//     // Combine ingredients into array of objects
//     const ingredients = ingredientNames.map((name, index) => ({
//       name: name as string,
//       quantity: ingredientQuantities[index] as string
//     })).filter(ing => ing.name && ing.quantity); // Remove empty entries
  
//     // Get instructions and split into array
//     const instructionsText = formData.get('instructions') as string;
//     const instructions = instructionsText.split('\n').filter(step => step.trim());
  
//     // Get tags and split into array
//     const tagsText = formData.get('tags') as string;
//     const tags = tagsText.split(',').map(tag => tag.trim()).filter(tag => tag);
  
//     const recipe = {
//       title: formData.get('title'),
//       description: formData.get('description'),
//       ingredients,
//       instructions,
//       prepTime: Number(formData.get('prepTime')),
//       cookTime: Number(formData.get('cookTime')),
//       servings: Number(formData.get('servings')),
//       tags,
//       imageUrl: formData.get('imageUrl') || '',
//       createdBy: user.publicMetadata.userId,
//     };
  
//     try {
//       await Recipe.create(recipe);
//       console.log('recipte created');
//       redirect('/'); // Redirect to recipes list after creation
//     } catch (error) {
//       console.error('Error creating recipe:', error);
//       throw error;
//     }
//   }


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