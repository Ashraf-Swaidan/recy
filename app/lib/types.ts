import { ObjectId } from "mongoose";

export interface Ingredient {
  name: string;
  quantity: string;
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
}
  export interface UserInterface {
    clerkId: string;
    email: string;
    username: string;
    photo: string;
    firstName?: string;
    lastName?: string;
  }
  