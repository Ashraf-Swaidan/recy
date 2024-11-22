// app/api/recipe/create/route.ts
import { connect } from '@/app/lib/db';
import Recipe from '@/app/lib/models/recipe.model';
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from 'next/server';
import { RecipeInterface  } from '@/app/lib/types';
import { Types } from 'mongoose';

export async function POST(request: NextRequest) {
  try {
    await connect();
    
    // Get and validate user
    const user = await currentUser();
    if (!user?.publicMetadata?.userId) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    // Parse request body
    const body: RecipeInterface = await request.json();

    // Validate required fields
    if (!body.title || !body.ingredients || !body.instructions) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Filter out empty ingredients
    const ingredients = body.ingredients.filter(ing => 
      ing.name.trim() && ing.quantity.trim()
    );

    // Filter out empty instructions
    const instructions = body.instructions.filter(step => 
      step.trim()
    );

    // Filter out empty tags
    const tags = body.tags?.filter(tag => tag.trim()) || [];
    // Create recipe object
    const recipe = {
      title: body.title,
      description: body.description,
      ingredients,
      instructions,
      prepTime: body.prepTime,
      cookTime: body.cookTime,
      servings: body.servings,
      tags,
      imageUrl: body.imageUrl || '',
      createdBy: user.publicMetadata.userId,
      likes: []
    };

    // Save to database
    const createdRecipe = await Recipe.create(recipe);

    return NextResponse.json(createdRecipe, { status: 201 });

  } catch (error) {
    console.error('Error creating recipe:', error);
    return NextResponse.json(
      { error: 'Failed to create recipe' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await connect();

    // Get and validate user
    const user = await currentUser();
    if (!user?.publicMetadata?.userId) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    // Parse request body
    const body: RecipeInterface = await request.json();

    // Validate required fields
    if (!body._id) {
      return NextResponse.json(
        { error: 'Recipe ID is required' },
        { status: 400 }
      );
    }

    if (!body.title && !body.ingredients && !body.instructions) {
      return NextResponse.json(
        { error: 'No fields provided for update' },
        { status: 400 }
      );
    }

    // Validate the ID format
    if (!Types.ObjectId.isValid(String(body._id))) {
      return NextResponse.json(
        { error: 'Invalid recipe ID' },
        { status: 400 }
      );
    }

    // Prepare update data, filtering out any empty fields
    const updateData: Partial<RecipeInterface> = {
      title: body.title || undefined,
      description: body.description || undefined,
      prepTime: body.prepTime || undefined,
      cookTime: body.cookTime || undefined,
      servings: body.servings || undefined,
      imageUrl: body.imageUrl || undefined,
      tags: body.tags?.filter(tag => tag.trim()) || undefined,
      ingredients: body.ingredients?.filter(ing => ing.name.trim() && ing.quantity.trim()) || undefined,
      instructions: body.instructions?.filter(step => step.trim()) || undefined,
    };

    // Find and update recipe
    const updatedRecipe = await Recipe.findOneAndUpdate(
      { _id: body._id, createdBy: user.publicMetadata.userId }, // Match recipe by ID and user
      { $set: updateData },
      { new: true } // Return the updated document
    );

    // If recipe not found
    if (!updatedRecipe) {
      return NextResponse.json(
        { error: 'Recipe not found or you do not have permission to update it' },
        { status: 404 }
      );
    }

    // Ensure likes array remains intact if not updated
    if (!updatedRecipe.likes) {
      updatedRecipe.likes = [];
      await updatedRecipe.save();
    }

    return NextResponse.json(updatedRecipe, { status: 200 });

  } catch (error) {
    console.error('Error updating recipe:', error);
    return NextResponse.json(
      { error: 'Failed to update recipe' },
      { status: 500 }
    );
  }
}