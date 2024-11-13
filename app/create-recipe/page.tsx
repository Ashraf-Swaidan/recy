'use client'
import React, { useState } from 'react';
import { Plus, Minus, UtensilsCrossed } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { UploadButton } from '../lib/uploadthing';
import "@uploadthing/react/styles.css";
import { ClientUploadedFileData } from 'uploadthing/types';
interface Ingredient {
  id: number;
  name: string;
  quantity: string;
}

const CreateRecipe = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>(''); 
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: 1, name: '', quantity: '' }
  ]);

  const handleUploadComplete = (res:  ClientUploadedFileData<{ imageUrl: string }>[]) => {
    const uploadedUrl = res[0]?.url;
    setImageUrl(uploadedUrl); // Set image URL from UploadThing response
    console.log("Upload Completed");
  };

  const addIngredient = () => {
    const newId = ingredients.length + 1;
    setIngredients([...ingredients, { id: newId, name: '', quantity: '' }]);
  };

  const removeIngredient = (id: number) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter(ing => ing.id !== id));
    }
  };

  const updateIngredient = (id: number, field: 'name' | 'quantity', value: string) => {
    setIngredients(ingredients.map(ing => 
      ing.id === id ? { ...ing, [field]: value } : ing
    ));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Prepare the ingredients data (removing the id field and empty entries)
    const cleanedIngredients = ingredients
      .filter(ing => ing.name.trim() && ing.quantity.trim())
      .map(({ name, quantity }) => ({ name, quantity }));

    // Get instructions and split into array
    const instructionsText = formData.get('instructions') as string;
    const instructions = instructionsText.split('\n').filter(step => step.trim());

    // Get tags and split into array
    const tagsText = formData.get('tags') as string;
    const tags = tagsText ? tagsText.split(',').map(tag => tag.trim()).filter(tag => tag) : [];

    const recipeData = {
      title: formData.get('title'),
      description: formData.get('description'),
      ingredients: cleanedIngredients,
      instructions,
      prepTime: Number(formData.get('prepTime')),
      cookTime: Number(formData.get('cookTime')),
      servings: Number(formData.get('servings')),
      tags,
      imageUrl
    };


    try {
      const response = await fetch('/api/recipe/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipeData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create recipe');
      }

      const createdRecipe = await response.json();
      console.log(createdRecipe)
      router.push('/'); // Redirect to home page after successful creation
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create recipe');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header Section  */}
        <div className="flex flex-col items-center mb-12 space-y-4">
        <div className="relative w-20 h-20">
            <Image
              src="/cook.webp"
              alt="Cooking"
              fill
              className="object-cover rounded-full"
            />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-2">
            Create Recipe <UtensilsCrossed className="w-8 h-8 text-orange-500" />
          </h1>
          <p className="text-gray-600 text-center max-w-2xl">
            Share your culinary masterpiece with the world. Fill in the details below
            to create your recipe and inspire others in their cooking journey.
          </p>
        </div>

        {/* Showing error message if any */}
        {error && (
          <div className="max-w-3xl mx-auto mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {error}
          </div>
        )}

        {/* Recipe Form - changed to use handleSubmit */}
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8">
          {/* Basic Information */}
          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Recipe Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                placeholder="Enter your recipe title"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                placeholder="Describe your recipe"
              />
            </div>

            <div className='flex flex-col justify-start items-start'>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                Image URL (Optional)
              </label>
              <div>
                  <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={handleUploadComplete}
                onUploadError={(error: Error) => {
                  // Do something with the error.
                  alert(`ERROR! ${error.message}`);
                }}
                 />
              </div>
             
             
            </div>
          </div>

          {/* Time and Servings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div>
              <label htmlFor="prepTime" className="block text-sm font-medium text-gray-700 mb-1">
                Prep Time (minutes)
              </label>
              <input
                type="number"
                id="prepTime"
                name="prepTime"
                required
                min="0"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
              />
            </div>

            <div>
              <label htmlFor="cookTime" className="block text-sm font-medium text-gray-700 mb-1">
                Cook Time (minutes)
              </label>
              <input
                type="number"
                id="cookTime"
                name="cookTime"
                required
                min="0"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
              />
            </div>

            <div>
              <label htmlFor="servings" className="block text-sm font-medium text-gray-700 mb-1">
                Servings
              </label>
              <input
                type="number"
                id="servings"
                name="servings"
                required
                min="1"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
              />
            </div>
          </div>

          {/* Dynamic Ingredients */}
          <div className="mt-8">
  <div className="flex justify-between items-center mb-4">
    <label className="block text-sm font-medium text-gray-700">Ingredients</label>
    <button
      type="button"
      onClick={addIngredient}
      className="flex items-center gap-1 text-orange-500 hover:text-orange-600 transition"
    >
      <Plus className="w-4 h-4" />
      Add Ingredient
    </button>
  </div>
  <div className="space-y-3">
    {ingredients.map((ingredient) => (
      <div key={ingredient.id} className="flex flex-col md:flex-row gap-3 items-start">
        <input
          type="text"
          name="ingredientName"
          value={ingredient.name}
          onChange={(e) => updateIngredient(ingredient.id, 'name', e.target.value)}
          placeholder="Ingredient name"
          className="w-full md:flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
        />
        <input
          type="text"
          name="ingredientQuantity"
          value={ingredient.quantity}
          onChange={(e) => updateIngredient(ingredient.id, 'quantity', e.target.value)}
          placeholder="Amount"
          className="w-full md:flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
        />
        {ingredients.length > 1 && (
          <button
            type="button"
            onClick={() => removeIngredient(ingredient.id)}
            className="p-3 text-red-500 hover:text-red-600 transition"
          >
            <Minus className="w-5 h-5" />
          </button>
        )}
      </div>
    ))}
  </div>
</div>

          {/* Instructions */}
          <div className="mt-8">
            <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-1">
              Instructions (One step per line)
            </label>
            <textarea
              id="instructions"
              name="instructions"
              required
              rows={5}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
              placeholder="1. Preheat oven to 350°F&#10;2. Mix ingredients in a bowl&#10;3. Bake for 25 minutes"
            />
          </div>

          {/* Tags */}
          <div className="mt-8">
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
              placeholder="vegetarian, dessert, quick"
            />
          </div>

          {/* Updated Submit Button with loading state */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-8 bg-orange-500 text-white py-3 px-4 rounded-lg hover:bg-orange-600 transition-colors font-medium disabled:bg-orange-300 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating Recipe...' : 'Create Recipe'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateRecipe;