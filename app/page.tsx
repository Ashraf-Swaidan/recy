import { Suspense } from "react";
import Hero from "./components/home/Hero";
import RecipeList from "./components/Recipes";
import RecipeListSkeleton from "./components/skeletons/RecipeListSkeleton";

export default function Home() {
  return (
    <div className="">
      <Hero />
      <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-center text-orange-600">Featured Recipes</h2>
        <Suspense fallback={<RecipeListSkeleton />}>
        <RecipeList />
      </Suspense>
      </div>
    </div>
  );
}
