import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { AuthResponse, LoginRequest, SignupRequest } from '@/types/auth';
import { ProductListResponse, Product, CreateProductRequest, UpdateProductRequest, ProductFilters } from '@/types/product';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        // Don't send token for public routes
        const isPublicRoute = config.url?.includes('/products') && 
                             config.method === 'get' && 
                             !config.url?.includes('/admin/');
        
        if (!isPublicRoute) {
          const token = localStorage.getItem('token');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle auth errors and rate limiting
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          
          // Only redirect if we're not already on the auth page
          if (typeof window !== 'undefined' && window.location.pathname !== '/auth') {
            window.location.href = '/auth';
          }
        } else if (error.response?.status === 429) {
          // Rate limiting error
          const retryAfter = error.response.headers['retry-after'];
          const message = retryAfter 
            ? `Rate limit exceeded. Please try again in ${retryAfter} seconds.`
            : 'Rate limit exceeded. Please try again later.';
          
          console.warn('Rate limit exceeded:', message);
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.client.post('/auth/login', data);
    return response.data;
  }

  async signup(data: SignupRequest): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.client.post('/auth/signup', data);
    return response.data;
  }

  async logout(): Promise<void> {
    await this.client.post('/auth/logout');
  }

  async getCurrentUser(): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.client.get('/auth/me');
    return response.data;
  }

  // Product endpoints
  async getProducts(filters?: ProductFilters): Promise<ProductListResponse> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    
    // Add cache-busting parameter to prevent 304 responses
    params.append('_t', Date.now().toString());
    
    const response: AxiosResponse<{ success: boolean; data: ProductListResponse }> = await this.client.get(`/products?${params.toString()}`);
    return response.data.data;
  }

  async getProduct(id: number): Promise<Product> {
    const response: AxiosResponse<{ success: boolean; data: Product }> = await this.client.get(`/products/${id}`);
    return response.data.data;
  }

  async createProduct(data: CreateProductRequest): Promise<Product> {
    const response: AxiosResponse<{ success: boolean; data: Product }> = await this.client.post('/products', data);
    return response.data.data;
  }

  async updateProduct(id: number, data: UpdateProductRequest): Promise<Product> {
    const response: AxiosResponse<{ success: boolean; data: Product }> = await this.client.put(`/products/${id}`, data);
    return response.data.data;
  }

  async deleteProduct(id: number): Promise<void> {
    await this.client.delete(`/products/${id}`);
  }

  async restoreProduct(id: number): Promise<void> {
    await this.client.patch(`/products/${id}/restore`);
  }

  async getDeletedProducts(): Promise<Product[]> {
    const response: AxiosResponse<{ success: boolean; data: Product[] }> = await this.client.get('/products/admin/deleted');
    return response.data.data;
  }

  async searchProducts(name: string): Promise<Product[]> {
    const response: AxiosResponse<{ success: boolean; data: Product[] }> = await this.client.get(`/products/admin/search/${name}`);
    return response.data.data;
  }

  // Upload endpoints
  async uploadImage(file: File): Promise<{ url: string; key: string; filename: string }> {
    const formData = new FormData();
    formData.append('image', file);
    
    const response: AxiosResponse<{ success: boolean; data: { image: { url: string; key: string; filename: string } } }> = 
      await this.client.post('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    return response.data.data.image;
  }

  async uploadProductImage(productId: number, file: File): Promise<{ product: Product; image: { url: string; key: string; filename: string } }> {
    const formData = new FormData();
    formData.append('image', file);
    
    const response: AxiosResponse<{ success: boolean; data: { product: Product; image: { url: string; key: string; filename: string } } }> = 
      await this.client.post(`/upload/products/${productId}/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    return response.data.data;
  }

  async deleteProductImage(productId: number): Promise<Product> {
    const response: AxiosResponse<{ success: boolean; data: { product: Product } }> = 
      await this.client.delete(`/upload/products/${productId}/image`);
    return response.data.data.product;
  }
}

export const apiClient = new ApiClient();
export default apiClient; 