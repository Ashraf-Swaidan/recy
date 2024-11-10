// app/api/recipe/create/route.ts
import { connect } from '@/app/lib/db';
import Recipe from '@/app/lib/models/recipe.model';
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from 'next/server';

// Type definitions for better type safety
interface Ingredient {
  name: string;
  quantity: string;
}

interface RecipeBody {
  title: string;
  description: string;
  ingredients: Ingredient[];
  instructions: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
  tags: string[];
  imageUrl?: string;
}

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
    const body: RecipeBody = await request.json();

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