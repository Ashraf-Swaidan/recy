
import React, { Suspense } from 'react';
import { UtensilsCrossed } from 'lucide-react';
import Image from 'next/image';
import CreateRecipe from './CreateRecipeForm';
import FormSkeleton from '../components/skeletons/FormSkeleton';

const page = () => {

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

        {/* Recipe Form - changed to use handleSubmit */}
        <Suspense fallback={<FormSkeleton />}>
          <CreateRecipe />
        </Suspense>
          
      </div>
    </div>
  );
};

export default page;