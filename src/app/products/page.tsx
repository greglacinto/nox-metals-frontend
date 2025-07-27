'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Package, Plus, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useProductStore } from '@/stores/productStore';
import { useToast } from '@/contexts/ToastContext';
import { Product, ProductFilters as ProductFiltersType, CreateProductRequest, UpdateProductRequest } from '@/types/product';
import Button from '@/components/ui/Button';
import ProductList from '@/components/products/ProductList';
import ProductFilters from '@/components/products/ProductFilters';
import CreateProductModal from '@/components/products/CreateProductModal';
import EditProductModal from '@/components/products/EditProductModal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

const ProductsPage = () => {
  const router = useRouter();
  const { user, initialize } = useAuthStore();
  const { products, pagination, filters, isLoading, error, fetchProducts, setFilters } = useProductStore();
  const { showToast } = useToast();
  const [showFilters, setShowFilters] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const hasInitialized = useRef(false);

  // Initialize auth state and fetch initial products
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Fetch initial products only once after initialization
  useEffect(() => {
    if (!hasInitialized.current && user) {
      hasInitialized.current = true;
      fetchProducts({ ...filters, includeDeleted: showDeleted });
    }
  }, [user]);

  // Handle showDeleted toggle changes
  useEffect(() => {
    if (hasInitialized.current && user) {
      fetchProducts({ ...filters, includeDeleted: showDeleted });
    }
  }, [showDeleted]);

  const handleFilterChange = useCallback((newFilters: Partial<ProductFiltersType>) => {
    const updatedFilters = { ...filters, ...newFilters, includeDeleted: showDeleted };
    setFilters(updatedFilters);
    fetchProducts(updatedFilters);
  }, [filters, showDeleted, setFilters, fetchProducts]);

  const handlePageChange = useCallback((page: number) => {
    handleFilterChange({ page });
  }, [handleFilterChange]);

  const handleBack = () => {
    router.back();
  };

  // Create product
  const handleCreateProduct = async (productData: CreateProductRequest) => {
    setActionLoading(true);
    try {
      await useProductStore.getState().createProduct(productData);
      showToast('Product created successfully!', 'success');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create product';
      showToast(errorMessage, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Edit product
  const handleEditProduct = async (productId: number, productData: UpdateProductRequest) => {
    setActionLoading(true);
    try {
      await useProductStore.getState().updateProduct(productId, productData);
      showToast('Product updated successfully!', 'success');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update product';
      showToast(errorMessage, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Delete product
  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;
    
    setActionLoading(true);
    try {
      await useProductStore.getState().deleteProduct(selectedProduct.id);
      showToast('Product deleted successfully!', 'success');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete product';
      showToast(errorMessage, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Restore product
  const handleRestoreProduct = async () => {
    if (!selectedProduct) return;
    
    setActionLoading(true);
    try {
      await useProductStore.getState().restoreProduct(selectedProduct.id);
      showToast('Product restored successfully!', 'success');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to restore product';
      showToast(errorMessage, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Open edit modal
  const openEditModal = (product: Product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  // Open delete modal
  const openDeleteModal = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  // Open restore modal
  const openRestoreModal = (product: Product) => {
    setSelectedProduct(product);
    setIsRestoreModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 sm:py-6 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                onClick={handleBack}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Back</span>
              </Button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
                  <Package className="h-6 w-6 sm:h-8 sm:w-8 mr-2 sm:mr-3" />
                  Products
                </h1>
                <p className="text-sm sm:text-base text-gray-600">Browse and manage products</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
              {user?.role === 'admin' && (
                <>
                  <Button
                    onClick={() => setShowDeleted(!showDeleted)}
                    variant="secondary"
                    className="flex items-center justify-center space-x-2 w-full sm:w-auto"
                  >
                    {showDeleted ? (
                      <>
                        <EyeOff className="h-4 w-4" />
                        <span className="hidden sm:inline">Hide Deleted</span>
                        <span className="sm:hidden">Hide</span>
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4" />
                        <span className="hidden sm:inline">Show Deleted</span>
                        <span className="sm:hidden">Show</span>
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center justify-center space-x-2 w-full sm:w-auto"
                  >
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">Add Product</span>
                    <span className="sm:hidden">Add</span>
                  </Button>
                </>
              )}
              <Button
                variant="secondary"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-center space-x-2 w-full sm:w-auto"
              >
                <span className="hidden sm:inline">Filters</span>
                <span className="sm:hidden">Filter</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        <div className="space-y-4 sm:space-y-6">
          {/* Filters */}
          {showFilters && (
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <ProductFilters
                filters={filters}
                onFilterChange={handleFilterChange}
              />
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Products List */}
          <ProductList
            products={products}
            pagination={pagination}
            isLoading={isLoading}
            onPageChange={handlePageChange}
            onEdit={openEditModal}
            onDelete={openDeleteModal}
            onRestore={openRestoreModal}
            showDeleted={showDeleted}
            isAdmin={user?.role === 'admin'}
          />
        </div>
      </main>

      {/* Modals */}
      <CreateProductModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateProduct}
      />

      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditProduct}
        product={selectedProduct}
      />

      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteProduct}
        title="Delete Product"
        message={`Are you sure you want to delete "${selectedProduct?.name}"? This action can be undone.`}
        confirmText="Delete Product"
        variant="danger"
        isLoading={actionLoading}
      />

      <ConfirmDialog
        isOpen={isRestoreModalOpen}
        onClose={() => setIsRestoreModalOpen(false)}
        onConfirm={handleRestoreProduct}
        title="Restore Product"
        message={`Are you sure you want to restore "${selectedProduct?.name}"?`}
        confirmText="Restore Product"
        variant="info"
        isLoading={actionLoading}
      />
    </div>
  );
};

export default ProductsPage; 