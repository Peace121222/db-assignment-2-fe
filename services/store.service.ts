import axiosClient from "./axiosClient";
import { DashboardStatsResponse, GetStoreResponse } from "./types/store.type";

const mockDashboardStats: DashboardStatsResponse = {
  revenue: 12540000,
  revenue_growth: 15,
  new_orders: 34,
  orders_growth: 5,
  rating: 4.9,
  reviews_count: 128,
  visits: 1204,
  visits_growth: 8.2,
  response_rate: 98,
  prep_time: 1.2,
  five_star_count: 120,
  low_star_count: 2,
  pending_confirm: 12,
  pending_pickup: 8,
  low_stock: 3,
  delivered: 5,
};

export const StoreService = {
  getStoreDashboard: async (
    storeId: string,
  ): Promise<DashboardStatsResponse> => {
    try {
      const response = await axiosClient.get(`/stores/${storeId}`);
      const apiData = Array.isArray(response)
        ? response[0]
        : (response as unknown as Record<string, unknown>).data || response;

      const storeData = apiData as GetStoreResponse;

      return {
        ...mockDashboardStats,
        store_name: storeData.store_name,
        phone: storeData.phone,
        email: storeData.email,
        address: storeData.address,
        rating: storeData.average_rating ?? mockDashboardStats.rating,
      };
    } catch {
      return mockDashboardStats;
    }
  },
};
