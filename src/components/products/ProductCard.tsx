'use client';

import React from 'react';
import { Product } from '@/types/product';
import { formatPrice, formatDate, truncateText } from '@/lib/utils';
import { Edit, Trash2, RotateCcw, Image as ImageIcon, User, Calendar, Package } from 'lucide-react';
import Button from '../ui/Button';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
  isAdmin: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onRestore: () => void;
  showDeleted: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  isAdmin, 
  onEdit, 
  onDelete, 
  onRestore
}) => {
  // Generate a subtle gradient based on product name for visual variety
  const getGradientClass = (name: string) => {
    const gradients = [
      'from-blue-50 to-indigo-100',
      'from-emerald-50 to-teal-100',
      'from-purple-50 to-violet-100',
      'from-amber-50 to-orange-100',
      'from-rose-50 to-pink-100',
      'from-cyan-50 to-blue-100',
      'from-lime-50 to-green-100',
      'from-fuchsia-50 to-purple-100'
    ];
    const index = name.length % gradients.length;
    return gradients[index];
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 ${
      product.is_deleted ? 'opacity-75 border-2 border-red-300 bg-red-50' : ''
    }`}>
      {/* Product Image with Gradient Background */}
      <div className={`relative h-48 ${getGradientClass(product.name)}`}>
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
            width={100}
            height={100}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-60" />
              <p className="text-xs text-gray-500">No Image</p>
            </div>
          </div>
        )}
        
        {/* Admin Actions Overlay */}
        {isAdmin && (
          <div className="absolute top-3 right-3 flex space-x-2">
            {!product.is_deleted ? (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onEdit}
                  className="bg-white/95 hover:bg-white text-indigo-600 hover:text-indigo-700 shadow-md hover:shadow-lg transition-all duration-200"
                  title="Edit Product"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onDelete}
                  className="bg-white/95 hover:bg-white text-red-600 hover:text-red-700 shadow-md hover:shadow-lg transition-all duration-200"
                  title="Delete Product"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                variant="ghost"
                onClick={onRestore}
                className="bg-white/95 hover:bg-white text-emerald-600 hover:text-emerald-700 shadow-md hover:shadow-lg transition-all duration-200"
                title="Restore Product"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}

        {/* Deleted Badge */}
        {product.is_deleted === true && (
          <div className="absolute top-3 left-3">
            <span className="bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded-full border border-red-200 shadow-sm">
              Deleted
            </span>
          </div>
        )}

        {/* Price Badge */}
        <div className="absolute bottom-3 left-3">
          <span className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg">
            {formatPrice(product.price)}
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/20">
        <div className="mb-4">
          <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-3 line-clamp-2">
            {product.name}
          </h3>
          
          {product.description && (
            <div className="relative">
              <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-3 bg-gradient-to-r from-gray-600 to-gray-700 bg-clip-text">
                {truncateText(product.description, 120)}
              </p>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50/20 to-transparent rounded-lg"></div>
            </div>
          )}
        </div>

        {/* Product Metadata */}
        <div className="space-y-3 text-xs">
          <div className="flex items-center p-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
            <User className="h-3.5 w-3.5 mr-2.5 text-indigo-600" />
            <span className="font-semibold text-indigo-800">{product.creator_email}</span>
          </div>
          
          <div className="flex items-center p-2 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-100">
            <Calendar className="h-3.5 w-3.5 mr-2.5 text-emerald-600" />
            <span className="font-medium text-emerald-800">Created: {formatDate(product.created_at)}</span>
          </div>
          
          {product.updated_at !== product.created_at && (
            <div className="flex items-center p-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100">
              <Package className="h-3.5 w-3.5 mr-2.5 text-purple-600" />
              <span className="font-medium text-purple-800">Updated: {formatDate(product.updated_at)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 