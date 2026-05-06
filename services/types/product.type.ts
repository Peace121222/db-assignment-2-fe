export type ProductStatus = "active" | "out_of_stock" | "hidden";

export interface GetProductsFilterRequest {
  keyword?: string;
  categoryId?: string;
  storeId?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: ProductStatus;
  sortBy?: "price" | "name" | "created_at";
  sortOrder?: "ASC" | "DESC"; // Sử dụng đúng key sortOrder của Backend
}

export interface ProductResponse {
  product_id: string;
  product_name: string;
  description: string;
  category_id: string;
  category_name: string;
  store_id: string;
  store_name: string;
  base_price: string; // Định dạng string theo JSON thực tế
  status: ProductStatus;
}

export interface CreateProductRequest {
  name: string;
  basePrice: number;
  storeId: string;
  categoryId: string;
  description: string;
}

export interface UpdateProductRequest {
  name?: string;
  basePrice?: number;
  status?: ProductStatus;
  storeId?: string;
  categoryId?: string;
  description?: string;
}

export interface ApiResponse<T> {
  message?: string | string[];
  data: T;
  statusCode: number;
}
