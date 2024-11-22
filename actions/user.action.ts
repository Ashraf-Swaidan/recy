"use server";

import User from "@/app/lib/models/user.model";
import Cookbook from "@/app/lib/models/cookbook.model";
import { UserInterface, CookbookInterface, SavedRecipe } from "@/app/lib/types";
import { connect } from '@/app/lib/db';
import { Types } from "mongoose";
import { fetchRecipeById } from "./recipe.action";

export async function createUser(user: any){
    try{
        await connect();
        const newUser = await User.create(user);
        return JSON.parse(JSON.stringify(newUser))
    } catch (error){
        console.log(error);
    }
}

export async function findRecipeOwner(id: string): Promise<UserInterface | null>{
    try{
        if(!Types.ObjectId.isValid(id)) return null;
        const owner = await User.findById(id).lean().exec() as UserInterface | null;
        if(!owner) return null;
        return owner;
    } catch(error){
        console.log(error);
        return null
    }
}


export async function fetchUserCookbook(userId: string): Promise<CookbookInterface | null> {
    try {
      await connect();
  
      // Validate the user ID
      if (!Types.ObjectId.isValid(userId)) {
        throw new Error("Invalid user ID");
      }
  
      // Fetch the cookbook for the user
      const cookbook = await Cookbook.findOne({ userId }).lean().exec() as CookbookInterface | null;
      console.log(cookbook)
  
      if (!cookbook || !cookbook.savedRecipes.length) {
        return null; // Return null if no recipes are saved
      }
  
      // Fetch the details of saved recipes and map them to match the SavedRecipe type
      const recipeDetails = await Promise.all(
        cookbook.savedRecipes.map(async (savedRecipe: SavedRecipe) => {
          const recipe = await fetchRecipeById(savedRecipe.recipeId);
          
          if (recipe) {
            // Map the recipe data to match the SavedRecipe type
            return {
              recipeId: savedRecipe.recipeId.toString(),  // Ensure this matches the expected SavedRecipe format
              savedAt: savedRecipe.savedAt,
            } as SavedRecipe; // Explicitly cast to SavedRecipe type
          }
  
          return null; // Return null if no recipe is found
        })
      );
  
      // Filter out any nulls (in case some recipes were not found)
      const validSavedRecipes = recipeDetails.filter(Boolean) as SavedRecipe[];
  
      return {
        _id: cookbook._id.toString(), // Convert _id from ObjectId to string
        userId: cookbook.userId.toString(), 
        savedRecipes: validSavedRecipes, // Ensure savedRecipes is in the correct format
      };
    } catch (error) {
      console.error("Error fetching user cookbook:", error);
      return null;
    }
  }