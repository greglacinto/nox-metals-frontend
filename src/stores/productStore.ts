import { create } from 'zustand';
import { Product, ProductFilters, CreateProductRequest, UpdateProductRequest } from '@/types/product';
import apiClient from '@/lib/api';

interface ProductState {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: ProductFilters;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchProducts: (filters?: ProductFilters) => Promise<void>;
  createProduct: (data: CreateProductRequest) => Promise<void>;
  updateProduct: (id: number, data: UpdateProductRequest) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  restoreProduct: (id: number) => Promise<void>;
  getDeletedProducts: () => Promise<void>;
  searchProducts: (name: string) => Promise<void>;
  setFilters: (filters: Partial<ProductFilters>) => void;
  clearError: () => void;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  filters: {
    search: '',
    sortBy: 'created_at',
    sortOrder: 'desc',
    page: 1,
    limit: 10,
    includeDeleted: false,
  },
  isLoading: false,
  error: null,

  fetchProducts: async (filters?: ProductFilters) => {
    set({ isLoading: true, error: null });
    try {
      const currentFilters = { ...get().filters, ...filters };
      const response = await apiClient.getProducts(currentFilters);
      set({
        products: response.products || [],
        pagination: response.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 },
        filters: currentFilters,
        isLoading: false,
        error: null,
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch products';
      set({
        isLoading: false,
        error: errorMessage,
      });
    }
  },

  createProduct: async (data: CreateProductRequest) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.createProduct(data);
      // Refresh the products list with current filters
      await get().fetchProducts(get().filters);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create product';
      set({
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  },

  updateProduct: async (id: number, data: UpdateProductRequest) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.updateProduct(id, data);
      // Refresh the products list with current filters
      await get().fetchProducts(get().filters);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update product';
      set({
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  },

  deleteProduct: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.deleteProduct(id);
      // Refresh the products list with current filters
      await get().fetchProducts(get().filters);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete product';
      set({
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  },

  restoreProduct: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.restoreProduct(id);
      // Refresh the products list with current filters
      await get().fetchProducts(get().filters);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to restore product';
      set({
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  },

  getDeletedProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const products = await apiClient.getDeletedProducts();
      set({
        products,
        isLoading: false,
        error: null,
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch deleted products';
      set({
        isLoading: false,
        error: errorMessage,
      });
    }
  },

  searchProducts: async (name: string) => {
    set({ isLoading: true, error: null });
    try {
      const products = await apiClient.searchProducts(name);
      set({
        products,
        isLoading: false,
        error: null,
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to search products';
      set({
        isLoading: false,
        error: errorMessage,
      });
    }
  },

  setFilters: (filters: Partial<ProductFilters>) => {
    const currentFilters = { ...get().filters, ...filters };
    set({ filters: currentFilters });
  },

  clearError: () => {
    set({ error: null });
  },
})); 