export interface GetStoreResponse {
  store_id: string;
  store_name: string;
  phone: string;
  email: string;
  address: string;
  average_rating: number;
}

export interface DashboardStatsResponse {
  store_name?: string;
  phone?: string;
  email?: string;
  address?: string;
  revenue: number;
  revenue_growth: number;
  new_orders: number;
  orders_growth: number;
  rating: number;
  reviews_count: number;
  visits: number;
  visits_growth: number;
  response_rate: number;
  prep_time: number;
  five_star_count: number;
  low_star_count: number;
  pending_confirm: number;
  pending_pickup: number;
  low_stock: number;
  delivered: number;
}
