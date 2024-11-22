'use client';

import React, { useEffect, useState } from 'react';
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { likeRecipe, unlikeRecipe, isRecipeLikedByUser } from '@/actions/recipe.action';

interface LikeRecipeButtonProps {
  userId: string;
  recipeId: string;
  likes: number; // Initial number of likes passed as a prop
}

const LikeRecipeButton: React.FC<LikeRecipeButtonProps> = ({ userId, recipeId, likes }) => {
  const [liked, setLiked] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentLikes, setCurrentLikes] = useState<number>(likes); // Store the likes count

  // Check if the recipe is already liked by the user
  useEffect(() => {
    const checkIfLiked = async () => {
      const isLiked = await isRecipeLikedByUser(userId, recipeId);
      setLiked(isLiked);
    };

    checkIfLiked();
  }, [userId, recipeId]);

  // Handle like/unlike toggle
  const handleLikeToggle = async () => {
    setLoading(true);

    try {
      if (liked) {
        // If already liked, unlike it
        const success = await unlikeRecipe(userId, recipeId);
        if (success) {
          setLiked(false);
          setCurrentLikes(currentLikes - 1); // Decrease likes count
        }
      } else {
        // If not liked, like it
        const success = await likeRecipe(userId, recipeId);
        if (success) {
          setLiked(true);
          setCurrentLikes(currentLikes + 1); // Increase likes count
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center">
      <button
        onClick={handleLikeToggle}
        className={`p-2 hover:bg-orange-50 rounded-full transition-colors ${loading ? 'opacity-50' : ''}`}
        disabled={loading}
      >
        {liked ? (
          <FaHeart className="w-6 h-6 text-orange-500" />
        ) : (
          <FaRegHeart className="w-6 h-6 text-orange-500" />
        )}
      </button>
      <p className="mt-2 text-sm text-gray-600">{currentLikes} {currentLikes === 1 ? 'Like' : 'Likes'}</p>
    </div>
  );
};

export default LikeRecipeButton;
