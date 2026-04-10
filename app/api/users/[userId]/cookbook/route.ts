import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/app/lib/db';
import Cookbook from "@/app/lib/models/cookbook.model";
import { Types } from "mongoose";
import { fetchRecipeById } from '@/actions/recipe.action';
import { CookbookInterface, SavedRecipe } from "@/app/lib/types";

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  console.log('Fetching user cookbook');

  try {
    const { userId } = params;

    // Validate the user ID
    if (!Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { error: 'Invalid user ID format' },
        { status: 400 }
      );
    }

    await connect();

    // Fetch the cookbook for the user
    const cookbook = await Cookbook.findOne({ userId }).lean().exec() as CookbookInterface | null;

    if (!cookbook || !cookbook.savedRecipes.length) {
      return NextResponse.json(
        { message: 'No cookbook or saved recipes found for this user' },
        { status: 404 }
      );
    }

    // Fetch the details of saved recipes and map them to match the SavedRecipe type
    const recipeDetails = await Promise.all(
      cookbook.savedRecipes.map(async (savedRecipe: SavedRecipe) => {
        const recipe = await fetchRecipeById(savedRecipe.recipeId);

        if (recipe) {
          return {
            recipeId: savedRecipe.recipeId.toString(),
            savedAt: savedRecipe.savedAt,
          } as SavedRecipe;
        }

        return null;
      })
    );

    // Filter out any nulls (in case some recipes were not found)
    const validSavedRecipes = recipeDetails.filter(Boolean) as SavedRecipe[];

    const response = {
      _id: cookbook._id.toString(),
      userId: cookbook.userId.toString(),
      savedRecipes: validSavedRecipes,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching user cookbook:", error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}