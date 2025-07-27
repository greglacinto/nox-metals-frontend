'use client';

import React from 'react';
import { Product } from '@/types/product';
import { formatPrice, formatDate, truncateText } from '@/lib/utils';
import { Edit, Trash2, RotateCcw, Image as ImageIcon } from 'lucide-react';
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
  // const [showActions, setShowActions] = useState(false);

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 ${
      product.is_deleted ? 'opacity-75 border-2 border-red-200' : ''
    }`}>
      {/* Product Image */}
      <div className="relative h-48 bg-gray-200">
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
            <ImageIcon className="h-12 w-12" />
          </div>
        )}
        
        {/* Admin Actions Overlay */}
        {isAdmin && (
          <div className="absolute top-2 right-2 flex space-x-1">
            {!product.is_deleted ? (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onEdit}
                  className="bg-white/90 hover:bg-white text-gray-700"
                  title="Edit Product"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onDelete}
                  className="bg-white/90 hover:bg-white text-red-600 hover:text-red-700"
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
                className="bg-white/90 hover:bg-white text-green-600 hover:text-green-700"
                title="Restore Product"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}

        {/* Deleted Badge */}
        {product.is_deleted === true && (
          <div className="absolute top-2 left-2">
            <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
              Deleted
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="">
          {product.name}
        </h3>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900">
            {product.name}
          </h3>
          <span className="text-lg font-bold text-blue-600">
            {formatPrice(product.price)}
          </span>
        </div> 

         {product.description && (
          <p className="text-gray-600 text-sm mb-3">
            {truncateText(product.description, 100)}
          </p>
        )}

        <div className="space-y-1 text-xs text-gray-500">
          <div>Created by: {product.creator_email}</div>
          <div>Created: {formatDate(product.created_at)}</div>
          {product.updated_at !== product.created_at && (
            <div>Updated: {formatDate(product.updated_at)}</div>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default ProductCard; 