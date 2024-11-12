import React, { Suspense } from 'react'
import RecipeDetailedCard from '@/app/components/recipe/RecipeDetailedCard';
import RecipeDetailedCardSkeleton from '@/app/components/skeletons/RecipeDetailedCardSkeleton';

interface PageProps {
  params: {
    id: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

const Page = async ({ params, searchParams }: PageProps) => {
  const { id } = params;

  return (
    <div className="min-h-screen bg-orange-50 py-8 px-4 sm:px-6 lg:px-8">
    <Suspense fallback={<RecipeDetailedCardSkeleton />}>
      <RecipeDetailedCard id={id}/>
    </Suspense>
    </div>
  )
}

export default Page;