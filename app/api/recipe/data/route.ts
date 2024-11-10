// app/api/recipe/data/route.ts
import { connect } from '@/app/lib/db';
import Recipe from '@/app/lib/models/recipe.model';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    await connect();
    
    // Get query parameters for potential filtering
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');
    const tag = searchParams.get('tag');
    const search = searchParams.get('search');

    // Build query object
    let query: any = {};

    // Add tag filter if provided
    if (tag) {
      query.tags = tag;
    }

    // Add search filter if provided
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Execute query with optional limit
    let recipesQuery = Recipe.find(query)
      .sort({ createdAt: -1 }); // Sort by newest first

    if (limit) {
      recipesQuery = recipesQuery.limit(parseInt(limit));
    }

    const recipes = await recipesQuery.exec();

    return NextResponse.json(recipes);

  } catch (error) {
    console.error('Error fetching recipes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recipes' },
      { status: 500 }
    );
  }
}