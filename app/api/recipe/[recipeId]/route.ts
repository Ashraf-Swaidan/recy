import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/app/lib/db';
import Recipe from '@/app/lib/models/recipe.model';
import User from '@/app/lib/models/user.model';
import { Types } from 'mongoose';

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ recipeId: string }> }
) {
  try {
    const { recipeId } = await context.params;

    // Validate the ID
    if (!Types.ObjectId.isValid(recipeId)) {
      return NextResponse.json(
        { error: 'Invalid recipe ID format' },
        { status: 400 }
      );
    }

    await connect(); // Ensure database connection

    // Fetch the recipe by ID
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return NextResponse.json(
        { error: 'Recipe not found' },
        { status: 404 }
      );
    }

    // Fetch the owner using the `createdBy` field
    const owner = await User.findById(recipe.createdBy);
    if (!owner) {
      return NextResponse.json(
        { error: 'Recipe owner not found' },
        { status: 404 }
      );
    }

    // Return the recipe enriched with owner details
    const enrichedRecipe = {
      ...recipe.toObject(), // Convert Mongoose document to plain object
      owner: owner.toObject(), // Attach user data (owner) to recipe
    };

    return NextResponse.json(enrichedRecipe);
  } catch (error) {
    console.error('Error in recipe GET route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}