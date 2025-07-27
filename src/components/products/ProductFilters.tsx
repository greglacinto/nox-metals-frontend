'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ProductFilters as ProductFiltersType } from '@/types/product';
import Button from '../ui/Button';
import { Search, Filter, X } from 'lucide-react';

interface ProductFiltersProps {
  filters: ProductFiltersType;
  onFilterChange: (filters: Partial<ProductFiltersType>) => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({ filters, onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');

  // Debounced search with useCallback to prevent infinite loops
  const debouncedSearch = useCallback((value: string) => {
    const timeoutId = setTimeout(() => {
      onFilterChange({ search: value, page: 1 });
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [onFilterChange]);

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    debouncedSearch(value);
  };

  // Update local search term when filters change externally
  useEffect(() => {
    setSearchTerm(filters.search || '');
  }, [filters.search]);

  const handleSortChange = (sortBy: string, sortOrder: string) => {
    onFilterChange({ 
      sortBy: sortBy as 'name' | 'price' | 'created_at',
      sortOrder: sortOrder as 'asc' | 'desc',
      page: 1 
    });
  };

  const handleLimitChange = (limit: number) => {
    onFilterChange({ limit, page: 1 });
  };

  const clearFilters = () => {
    setSearchTerm('');
    onFilterChange({
      search: '',
      sortBy: 'created_at',
      sortOrder: 'desc',
      page: 1,
      limit: 10,
      includeDeleted: false,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-2 sm:space-y-0">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <Filter className="h-5 w-5 mr-2" />
          Filters
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="flex items-center space-x-1 w-full sm:w-auto justify-center sm:justify-start"
        >
          <X className="h-4 w-4" />
          <span>Clear</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="sm:col-span-2 lg:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sort By
          </label>
          <select
            value={filters.sortBy || 'created_at'}
            onChange={(e) => handleSortChange(e.target.value, filters.sortOrder || 'desc')}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="name">Name</option>
            <option value="price">Price</option>
            <option value="created_at">Date Created</option>
          </select>
        </div>

        {/* Sort Order */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Order
          </label>
          <select
            value={filters.sortOrder || 'desc'}
            onChange={(e) => handleSortChange(filters.sortBy || 'created_at', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>

        {/* Items Per Page */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Items Per Page
          </label>
          <select
            value={filters.limit || 10}
            onChange={(e) => handleLimitChange(Number(e.target.value))}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* Show Deleted Toggle */}
      <div className="mt-4 flex items-center">
        <input
          type="checkbox"
          id="includeDeleted"
          checked={filters.includeDeleted || false}
          onChange={(e) => onFilterChange({ includeDeleted: e.target.checked, page: 1 })}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="includeDeleted" className="ml-2 text-sm text-gray-700">
          Show deleted products
        </label>
      </div>
    </div>
  );
};

export default ProductFilters; 