'use client';

import React, { useState, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import ImageUpload from '@/components/ui/ImageUpload';
import { Product } from '@/types/product';
import { apiClient } from '@/lib/api';

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (productId: number, productData: UpdateProductData) => Promise<void>;
  product: Product | null;
}

interface UpdateProductData {
  name: string;
  price: number;
  description: string;
  image_url?: string;
}

export interface ProductError {
  name?: string;
  price?: string;
  description?: string;
  image_url?: string;
}

const EditProductModal: React.FC<EditProductModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  product
}) => {
  const [formData, setFormData] = useState<UpdateProductData>({
    name: '',
    price: 0,
    description: '',
    image_url: ''
  });
  const [errors, setErrors] = useState<ProductError>({});
  const [isLoading, setIsLoading] = useState(false);

  // Populate form when product changes
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price,
        description: product.description || '',
        image_url: product.image_url || ''
      });
      setErrors({});
    }
  }, [product]);

  const validateForm = (): boolean => {
    const newErrors: ProductError = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = async (file: File) => {
    if (!product) return;
    
    try {
      const result = await apiClient.uploadProductImage(product.id, file);
      setFormData(prev => ({ ...prev, image_url: result.product.image_url }));
    } catch (error) {
      console.error('Image upload failed:', error);
      throw error;
    }
  };

  const handleImageRemove = async () => {
    if (!product) return;
    
    try {
      const result = await apiClient.deleteProductImage(product.id);
      setFormData(prev => ({ ...prev, image_url: result.image_url }));
    } catch (error) {
      console.error('Image removal failed:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!product || !validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit(product.id, formData);
      handleClose();
    } catch (error) {
      console.error('Failed to update product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      price: 0,
      description: '',
      image_url: ''
    });
    setErrors({});
    setIsLoading(false);
    onClose();
  };

  const handleInputChange = (field: keyof UpdateProductData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Edit Product</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isLoading}
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          {/* Product Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Product Name *
            </label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter product name"
              error={errors.name}
              disabled={isLoading}
            />
          </div>

          {/* Price */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Price *
            </label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              error={errors.price?.toString()}
              disabled={isLoading}
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter product description"
              rows={3}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              } ${isLoading ? 'bg-gray-100' : ''}`}
              disabled={isLoading}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Image Upload */}
          <ImageUpload
            currentImageUrl={formData.image_url}
            onImageUpload={handleImageUpload}
            onImageRemove={handleImageRemove}
            disabled={isLoading}
          />

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal; 