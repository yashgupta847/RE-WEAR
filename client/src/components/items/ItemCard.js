import React from 'react';
import { Link } from 'react-router-dom';

const ItemCard = ({ item }) => {
  const { _id, title, images, category, condition, pointValue, status } = item;

  // Get the first image as the main display image
  const mainImage = images && images.length > 0 ? images[0] : 'https://via.placeholder.com/300x400?text=No+Image';

  return (
    <div className="card group relative overflow-hidden transition-all duration-300 hover:shadow-lg">
      {/* Status Badge */}
      {status === 'swapped' && (
        <div className="absolute top-2 right-2 z-10 bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded">
          Swapped
        </div>
      )}
      
      {/* Image */}
      <div className="relative aspect-w-3 aspect-h-4 bg-gray-200 overflow-hidden">
        <img
          src={mainImage}
          alt={title}
          className="w-full h-64 object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium text-gray-900 truncate">{title}</h3>
          <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-1 rounded">
            {pointValue} pts
          </span>
        </div>
        
        <div className="mt-2 flex items-center text-sm text-gray-500 space-x-2">
          <span className="capitalize">{category}</span>
          <span>•</span>
          <span>{condition}</span>
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <Link
            to={`/items/${_id}`}
            className="text-primary-600 hover:text-primary-800 font-medium text-sm"
          >
            View Details
          </Link>
          
          {status !== 'swapped' && (
            <button
              className="text-white bg-primary-600 hover:bg-primary-700 text-sm font-medium px-3 py-1 rounded transition-colors duration-200"
            >
              Swap
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemCard;