// components/EditRecipe.tsx
'use client'
import React, { useState, useEffect } from 'react';
import { Plus, Minus } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { UploadButton } from '@/app/lib/uploadthing';
import { ClientUploadedFileData } from 'uploadthing/types';
import { RecipeInterface } from '@/app/lib/types';
import FormSkeleton from '@/app/components/skeletons/FormSkeleton';

interface Ingredient {
  id: number;
  name: string;
  quantity: string;
}

const EditRecipeForm = () => {
  const router = useRouter();
  const {id} = useParams();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  const [recipe, setRecipe] = useState<RecipeInterface | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: 1, name: '', quantity: '' },
  ]);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const recipeId = id;
        console.log(recipeId)
        if (!recipeId) {
          return;
        }

        const response = await fetch(`/api/recipe/edit/${recipeId}`,{
            method: 'GET',
          });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch recipe');
        }

        const data = await response.json();
        setRecipe(data);
        setImageUrl(data.imageUrl || '');
        setIngredients(
          data.ingredients.map((ing: { name: string; quantity: string }, index: number) => ({
            id: index + 1,
            name: ing.name,
            quantity: ing.quantity,
          }))
        );
      } catch (err) {
        console.error('Error fetching recipe:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch recipe');
      }
    };

    fetchRecipe();
  }, [id]);

  const handleUploadComplete = (res: ClientUploadedFileData<{ imageUrl: string }>[]) => {
    const uploadedUrl = res[0]?.url;
    setImageUrl(uploadedUrl); // Set image URL from UploadThing response
    console.log('Upload Completed');
  };

  const addIngredient = () => {
    const newId = ingredients.length + 1;
    setIngredients([...ingredients, { id: newId, name: '', quantity: '' }]);
  };

  const removeIngredient = (id: number) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((ing) => ing.id !== id));
    }
  };

  const updateIngredient = (id: number, field: 'name' | 'quantity', value: string) => {
    setIngredients(
      ingredients.map((ing) => (ing.id === id ? { ...ing, [field]: value } : ing))
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (!recipe?._id) {
        setError('Recipe ID is missing.');
        setIsSubmitting(false);
        return;
      }
      
    const form = e.currentTarget;
    const formData = new FormData(form);

    // Prepare the ingredients data (removing the id field and empty entries)
    const cleanedIngredients = ingredients
      .filter((ing) => ing.name.trim() && ing.quantity.trim())
      .map(({ name, quantity }) => ({ name, quantity }));

    // Get instructions and split into array
    const instructionsText = formData.get('instructions') as string;
    const instructions = instructionsText.split('\n').filter((step) => step.trim());

    // Get tags and split into array
    const tagsText = formData.get('tags') as string;
    const tags = tagsText ? tagsText.split(',').map((tag) => tag.trim()).filter((tag) => tag) : [];

    type EditableRecipeData = Omit<RecipeInterface, 'createdBy' | 'createdAt'>;
    
    const recipeData: EditableRecipeData = {
      _id: recipe?._id,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      ingredients: cleanedIngredients,
      instructions,
      prepTime: Number(formData.get('prepTime')),
      cookTime: Number(formData.get('cookTime')),
      servings: Number(formData.get('servings')),
      tags,
      imageUrl,
    };

    try {
      const response = await fetch(`/api/recipe/edit/${recipe?._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipeData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update recipe');
      }

      const updatedRecipe = await response.json();
      console.log(updatedRecipe);
      router.push('/'); // Redirect to home page after successful update
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update recipe');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!recipe) {
    return <FormSkeleton />;
  }

  return (
    <>

    {/* Showing error message if any */}
    {error && (
      <div className="max-w-3xl mx-auto mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
        {error}
      </div>
    )}

    {/* Recipe Form */}
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
            defaultValue={recipe.title}
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
            defaultValue={recipe.description}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
            placeholder="Describe your recipe"
          />
        </div>

        <div className="flex flex-col justify-start items-start">
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
            Image URL (Optional)
          </label>
          <div>
            <UploadButton
              endpoint="imageUploader"
              onClientUploadComplete={handleUploadComplete}
              onUploadError={(error: Error) => {
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
            defaultValue={recipe.prepTime}
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
            defaultValue={recipe.cookTime}
            className="w-full p-3 border border-gray300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
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
            defaultValue={recipe.servings}
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
          defaultValue={recipe.instructions.join('\n')}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
          placeholder="1. Preheat oven to 350°F\n2. Mix ingredients in a bowl\n3. Bake for 25 minutes"
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
          defaultValue={recipe.tags?.join(', ')}
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
        {isSubmitting ? 'Updating Recipe...' : 'Update Recipe'}
      </button>
    </form>
</>
  );
};

export default EditRecipeForm;