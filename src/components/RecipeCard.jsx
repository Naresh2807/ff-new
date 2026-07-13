// src/components/RecipeCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, Clock, Users } from 'lucide-react';
import { getFullImageUrl, PLACEHOLDER_IMAGE } from '../utils/imageUtils';

function RecipeCard({ recipe }) {
  const imageUrl = getFullImageUrl(recipe.image) || PLACEHOLDER_IMAGE;

  return (
    <Link to={`/recipe/${recipe._id}`} className="block group">
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="relative h-48 bg-gray-200">
          <img
            src={imageUrl}
            alt={recipe.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = PLACEHOLDER_IMAGE;
            }}
          />
          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold text-gray-700">
            {recipe.cuisine}
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-800 truncate">{recipe.title}</h3>
          <p className="text-sm text-gray-500 line-clamp-2 mt-1">{recipe.description}</p>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span>{recipe.averageRating?.toFixed(1) || '0'}</span>
                <span className="text-gray-400">({recipe.ratings?.length || 0})</span>
              </div>
              <span className="text-gray-300">|</span>
              <div className="flex items-center space-x-1">
                <Heart className="w-4 h-4 text-red-500" />
                <span>{recipe.likes?.length || 0}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              <span>{recipe.prepTime + recipe.cookTime}m</span>
              <Users className="w-3 h-3 ml-1" />
              <span>{recipe.servings}</span>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap gap-1">
            <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
              {recipe.mealType}
            </span>
            {recipe.dietaryPreference?.slice(0, 2).map((d) => (
              <span key={d} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                {d}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default RecipeCard;