'use client';

import React, { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { addToCookbook, removeFromCookbook, fetchRecipeSaves } from '@/actions/recipe.action';
import { fetchUserCookbook } from '@/actions/user.action';

interface SaveRecipeButtonProps {
  userId: string;
  recipeId: string;
}

const SaveRecipeButton: React.FC<SaveRecipeButtonProps> = ({ userId, recipeId }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saveCount, setSaveCount] = useState(0); // To track the total number of saves

  // Fetch the user's cookbook to check if the recipe is already saved
  useEffect(() => {
    const checkIfRecipeIsSaved = async () => {
      try {
        const cookbook = await fetchUserCookbook(userId);
        
        // Check if the recipeId is in the savedRecipes array
        const saved = cookbook?.savedRecipes.some(
          (savedRecipe: { recipeId: string }) => savedRecipe?.recipeId?.toString() === recipeId
        );
        setIsSaved(saved || false);
      } catch (error) {
        console.error('Error fetching cookbook:', error);
      }
    };

    checkIfRecipeIsSaved();
  }, [userId, recipeId]);

  // Fetch the total number of saves for this recipe
  useEffect(() => {
    const getRecipeSaves = async () => {
      const count = await fetchRecipeSaves(recipeId);
      setSaveCount(count);
    };

    getRecipeSaves();
  }, [recipeId, isSaved]); // Re-fetch the save count when isSaved changes

  // Function to add the recipe to the cookbook
  const saveRecipe = async () => {
    setLoading(true);
    try {
      const success = await addToCookbook(userId, recipeId);
      if (success) {
        setIsSaved(true);
      } else {
        alert('Failed to add recipe to cookbook.');
      }
    } catch (error) {
      console.error('Error adding to cookbook:', error);
      alert('Failed to add recipe to cookbook. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Function to remove the recipe from the cookbook
  const removeRecipe = async () => {
    setLoading(true);
    try {
      const success = await removeFromCookbook(userId, recipeId);
      if (success) {
        alert('Recipe removed from your cookbook!');
        setIsSaved(false);
      } else {
        alert('Failed to remove recipe from cookbook.');
      }
    } catch (error) {
      console.error('Error removing from cookbook:', error);
      alert('Failed to remove recipe from cookbook. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center">
      <button
        onClick={isSaved ? removeRecipe : saveRecipe}
        className={`p-2 hover:bg-orange-50 rounded-full transition-colors ${loading ? 'opacity-50' : ''}`}
        disabled={loading}
      >
        {isSaved ? (
          <BookmarkCheck className={`w-6 h-6 ${loading ? 'text-gray-400' : 'text-green-500'}`} />
        ) : (
          <Bookmark className={`w-6 h-6 ${loading ? 'text-gray-400' : 'text-orange-500'}`} />
        )}
      </button>
      <p className="mt-2 text-sm text-gray-600">
        {saveCount} {saveCount === 1 ? 'Save' : 'Saves'}
      </p>
    </div>
  );
};

export default SaveRecipeButton;
