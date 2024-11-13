import Image from 'next/image';
import Link from 'next/link';
import { Clock, ChefHat, Book } from 'lucide-react';
import { RecipeWithOwner } from '@/app/lib/types';

interface RecipeCardProps {
  recipe: RecipeWithOwner;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 flex flex-col">
      {/* Image Section */}
      <div className="relative w-full h-48">
        <Image
          src={recipe.imageUrl === '' ? '/placeholder.png' : recipe.imageUrl}
          alt={recipe.title}
          layout="fill"
          objectFit="cover"
          className="w-full h-full rounded-t-lg"
        />
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-orange-600 line-clamp-1">{recipe.title}</h3>
          <div className="flex items-center text-gray-500 text-sm">
            <Clock size={16} className="mr-1" />
            <span>{recipe.prepTime + recipe.cookTime} mins</span>
          </div>
        </div>

        {/* Description with Fixed Height */}
        <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">{recipe.description}</p>

        {/* Recipe Info */}
        <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <Book size={16} className="mr-1" />
            <span>{recipe.servings} servings</span>
          </div>
          <div className="flex items-center">
            <ChefHat size={16} className="mr-1" />
            <span>{recipe.owner.firstName} {recipe.owner.lastName}</span>
          </div>
        </div>

        {/* Explore Button */}
        <div className="mt-auto">
          <Link
            href={`/recipes/${recipe._id}`}
            className="inline-block w-full text-center px-6 py-2 text-sm font-semibold text-white bg-orange-600 rounded hover:bg-orange-700 transition duration-200"
          >
            Explore Recipe
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
