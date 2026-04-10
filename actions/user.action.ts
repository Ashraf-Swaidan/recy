"use server";

import User from "@/app/lib/models/user.model";
import Cookbook from "@/app/lib/models/cookbook.model";
import { UserInterface, CookbookInterface, SavedRecipe } from "@/app/lib/types";
import { connect } from '@/app/lib/db';
import { Types } from "mongoose";
import { fetchRecipeById } from "./recipe.action";
import { currentUser } from "@clerk/nextjs/server";
import { createClerkClient } from "@clerk/backend";

/**
 * Ensures the signed-in Clerk user exists in MongoDB and has publicMetadata.userId.
 * Webhooks only run when Clerk can reach your URL (e.g. not localhost without a tunnel),
 * so this keeps local dev and missed webhooks working.
 */
export async function ensureUserSynced() {
  let user;
  try {
    user = await currentUser();
  } catch {
    // Root layout runs for some requests where middleware is skipped (e.g. `/_next/static/...`),
    // so Clerk has no auth context — skip sync for that request.
    return;
  }
  if (!user) return;

  if (user.publicMetadata?.userId) return;

  await connect();

  let dbUser = await User.findOne({ clerkId: user.id });
  if (!dbUser) {
    const email = user.emailAddresses[0]?.emailAddress ?? "";
    const username =
      user.username ??
      user.firstName ??
      (email.includes("@") ? email.split("@")[0] : null) ??
      "user";

    dbUser = await User.create({
      clerkId: user.id,
      email: email || `${user.id}@placeholder.local`,
      username,
      photo: user.imageUrl ?? "",
      firstName: user.firstName ?? undefined,
      lastName: user.lastName ?? undefined,
    });
  }

  const secretKey = process.env.CLERK_SECRET_KEY;
  if (!secretKey) return;

  const clerkClient = createClerkClient({ secretKey });
  await clerkClient.users.updateUserMetadata(user.id, {
    publicMetadata: {
      ...(typeof user.publicMetadata === "object" && user.publicMetadata !== null
        ? (user.publicMetadata as Record<string, unknown>)
        : {}),
      userId: dbUser._id.toString(),
    },
  });
}

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
  console.log('fetching user cookbook')
    try {
      await connect();
  
      // Validate the user ID
      if (!Types.ObjectId.isValid(userId)) {
        throw new Error("Invalid user ID");
      }
  
      // Fetch the cookbook for the user
      const cookbook = await Cookbook.findOne({ userId }).lean().exec() as CookbookInterface | null;
  
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

