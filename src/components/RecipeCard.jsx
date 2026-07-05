import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Clock, Users, Star } from 'lucide-react';

// Read the backend URL from environment, remove '/api' suffix if present
const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');

// Inline SVG placeholder – no external requests
const PLACEHOLDER_IMAGE = 
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' font-family='sans-serif' font-size='60' text-anchor='middle' dy='.3em' fill='%239ca3af'%3E🍽️%3C/text%3E%3C/svg%3E";

function RecipeCard({ recipe }) {
  const { _id, title, image, averageRating, cuisine, mealType, prepTime, servings, author } = recipe;

  // Build absolute image URL (if image exists) else use placeholder
  const imageUrl = image ? `${BASE_URL}${image}` : PLACEHOLDER_IMAGE;

  return (
    <Link to={`/recipe/${_id}`} className="block group">
      <div className="card bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col">
        {/* Image */}
        <div className="relative h-52 overflow-hidden bg-gray-200">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              // Prevent infinite error loop and set placeholder
              e.target.onerror = null;
              e.target.src = PLACEHOLDER_IMAGE;
            }}
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <span className="bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-semibold text-gray-700 shadow-sm">
              {cuisine}
            </span>
            <span className="bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-semibold text-gray-700 shadow-sm">
              {mealType}
            </span>
          </div>

          {/* Rating */}
          <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg flex items-center space-x-1 shadow-sm">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-bold text-gray-700">
              {averageRating ? Number(averageRating).toFixed(1) : 'New'}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-lg font-bold text-gray-800 group-hover:text-primary transition-colors line-clamp-1">
            {title}
          </h3>

          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
            by {author?.name || 'Anonymous'}
          </p>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{prepTime}m</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>{servings} servings</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default RecipeCard;