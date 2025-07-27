export interface Product {
  id: number;
  name: string;
  price: number;
  description?: string;
  image_url?: string;
  created_by: number;
  creator_email: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateProductRequest {
  name: string;
  price: number;
  description?: string;
  image_url?: string;
}

export interface UpdateProductRequest {
  name?: string;
  price?: number;
  description?: string;
  image_url?: string;
}

export interface ProductFilters {
  search?: string;
  sortBy?: 'name' | 'price' | 'created_at';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  includeDeleted?: boolean;
}

export interface ProductListResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
} 