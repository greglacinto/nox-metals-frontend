'use client';

import React from 'react';
import { Product } from '@/types/product';
import ProductCard from './ProductCard';
import Pagination from '../ui/Pagination';
import { Package } from 'lucide-react';

interface ProductListProps {
  products: Product[];
  isLoading: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onRestore: (product: Product) => void;
  showDeleted: boolean;
  isAdmin: boolean;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  isLoading,
  pagination,
  onPageChange,
  onEdit,
  onDelete,
  onRestore,
  showDeleted,
  isAdmin,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow animate-pulse">
              <div className="h-48 bg-gray-200 rounded-t-lg"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  console.log("products", products);

  if (products.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12">
        <Package className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
        <p className="mt-1 text-sm text-gray-500">
          {showDeleted 
            ? 'No deleted products found.'
            : 'Get started by creating a new product.'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isAdmin={isAdmin}
            onEdit={() => onEdit(product)}
            onDelete={() => onDelete(product)}
            onRestore={() => onRestore(product)}
            showDeleted={showDeleted}
          />
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={onPageChange}
        />
      )}

      {/* Results Info */}
      <div className="text-center text-xs sm:text-sm text-gray-500">
        Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
        {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
        {pagination.total} results
      </div>
    </div>
  );
};

export default ProductList; 