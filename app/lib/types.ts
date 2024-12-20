import { ObjectId } from "mongoose";

export interface Ingredient {
  name: string;
  quantity: string;
}

export interface Like {
  userId: string; // ID of the user who liked the recipe
  likedAt: Date; // Date the recipe was liked
}

// Define the structure of the Recipe interface
export interface RecipeInterface {
  _id: ObjectId; // MongoDB ObjectId type
  title: string;
  description: string;
  ingredients: Ingredient[]; // Array of ingredients
  instructions: string[]; // Array of instructions
  imageUrl?: string; // Optional image URL
  prepTime: number; // In minutes
  cookTime: number; // In minutes
  servings: number;
  tags?: string[]; // Optional tags
  createdBy: string; // Reference to the User who created the recipe
  createdAt: Date; // Date when the recipe was created
  likes: Like[];
}
  export interface UserInterface {
    clerkId: string;
    email: string;
    username: string;
    photo: string;
    firstName?: string;
    lastName?: string;
  }

  export interface RecipeWithOwner {
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
  
  export interface CookbookInterface {
    _id: string; // MongoDB ObjectId type
    userId: string; // ID of the user who owns the cookbook
    savedRecipes: SavedRecipe[]; // Array of saved recipes
  }
  
  export interface SavedRecipe {
    recipeId: string; // ID of the saved recipe
    savedAt: Date; // Date when the recipe was saved
  }