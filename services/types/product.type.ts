export type ProductStatus = "active" | "out_of_stock" | "hidden";

export interface GetProductsFilterRequest {
  keyword?: string;
  categoryId?: string;
  storeId?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: ProductStatus;
  sortBy?: "price" | "name" | "created_at";
  sortDir?: "ASC" | "DESC";
}

export interface ProductResponse {
  product_id: string;
  product_name: string;
  category_name: string;
  store_name: string;
  base_price: number;
  status: ProductStatus;
}

export interface CreateProductRequest {
  name: string;
  base_price: number;
  store_id: string;
  category_id: string;
  description?: string;
}

export interface UpdateProductRequest {
  name?: string;
  base_price?: number;
  status?: ProductStatus;
  store_id?: string;
  category_id?: string;
  description?: string;
}

export interface ApiResponse<T> {
  message?: string;
  data: T;
  statusCode: number;
}
