import axiosClient from "./axiosClient";
import {
  GetProductsFilterRequest,
  ApiResponse,
  ProductResponse,
  CreateProductRequest,
  UpdateProductRequest,
} from "./types/product.type";

export const ProductService = {
  getProducts: async (
    params: GetProductsFilterRequest,
  ): Promise<ApiResponse<ProductResponse[]>> => {
    return axiosClient.get("/products", { params });
  },

  getProductById: async (
    productId: string,
  ): Promise<ApiResponse<ProductResponse>> => {
    return axiosClient.get(`/products/${productId}`);
  },

  createProduct: async (
    data: CreateProductRequest,
  ): Promise<ApiResponse<ProductResponse>> => {
    return axiosClient.post("/products", data);
  },

  updateProduct: async (
    productId: string,
    data: UpdateProductRequest,
  ): Promise<ApiResponse<ProductResponse>> => {
    return axiosClient.put(`/products/${productId}`, data);
  },

  deleteProduct: async (productId: string): Promise<ApiResponse<null>> => {
    return axiosClient.delete(`/products/${productId}`);
  },
};
