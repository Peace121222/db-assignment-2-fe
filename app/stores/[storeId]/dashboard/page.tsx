/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Star,
  TrendingUp,
  ShoppingBag,
  PackageOpen,
  MessageCircle,
  Clock,
  DollarSign,
  Users,
  Store,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import { StoreService } from "@/services/store.service";
import { DashboardStatsResponse } from "@/services/types/store.type";

export default function DashboardPage() {
  const params = useParams();
  const storeId =
    (params?.storeId as string) || "f0000000-0000-4000-8000-000000000001";

  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStatsResponse | null>(null);

  const fetchDashboardData = useCallback(async () => {
    if (!storeId) return;
    setIsLoading(true);
    try {
      const data = await StoreService.getStoreDashboard(storeId);
      setStats(data);
    } catch (error) {
      toast.error("Không thể tải thông tin thống kê của cửa hàng.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [storeId]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
            <Store className="w-8 h-8 text-blue-600" />
            {isLoading
              ? "Đang tải thông tin..."
              : stats?.store_name || "Tên cửa hàng"}
          </h1>
          <p className="text-gray-500 mt-1">
            Cập nhật kết quả kinh doanh hôm nay (So với hôm qua)
          </p>
        </div>
        <Badge
          variant="outline"
          className={`px-4 py-2 text-sm ${
            isLoading
              ? "bg-gray-50 text-gray-500 border-gray-200"
              : "bg-green-50 text-green-700 border-green-200"
          }`}
        >
          {isLoading ? "Đang cập nhật..." : "Shop đang hoạt động tốt"}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-500">
              Doanh thu
            </CardTitle>
            <DollarSign className="w-4 h-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {isLoading
                ? "..."
                : `${Number(stats?.revenue || 0).toLocaleString()} đ`}
            </div>
            <p className="text-xs text-green-600 flex items-center mt-1 font-medium">
              <TrendingUp className="w-3 h-3 mr-1" />+
              {stats?.revenue_growth || 0}%
            </p>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-500">
              Đơn hàng mới
            </CardTitle>
            <ShoppingBag className="w-4 h-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {isLoading ? "..." : stats?.new_orders || 0}
            </div>
            <p className="text-xs text-green-600 flex items-center mt-1 font-medium">
              <TrendingUp className="w-3 h-3 mr-1" />+
              {stats?.orders_growth || 0} đơn
            </p>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-500">
              Điểm Đánh Giá
            </CardTitle>
            <Star className="w-4 h-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {isLoading
                ? "..."
                : `${stats?.rating?.toFixed(1) || "0.0"} / 5.0`}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Dựa trên {stats?.reviews_count || 0} đánh giá
            </p>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-500">
              Lượt truy cập
            </CardTitle>
            <Users className="w-4 h-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {isLoading ? "..." : stats?.visits?.toLocaleString() || 0}
            </div>
            <p className="text-xs text-green-600 flex items-center mt-1 font-medium">
              <TrendingUp className="w-3 h-3 mr-1" />+
              {stats?.visits_growth || 0}%
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border shadow-sm">
          <CardHeader className="border-b pb-4 rounded-t-xl">
            <CardTitle className="text-blue-800 flex items-center gap-2 text-lg">
              <Store className="w-5 h-5 text-blue-600" />
              Thông tin cửa hàng
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gray-400 shrink-0" />
              <div>
                <p className="text-sm text-gray-500 font-medium">
                  Số điện thoại
                </p>
                <p className="font-semibold text-gray-900">
                  {isLoading ? "..." : stats?.phone || "Chưa cập nhật"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-400 shrink-0" />
              <div>
                <p className="text-sm text-gray-500 font-medium">
                  Email hỗ trợ
                </p>
                <p className="font-semibold text-gray-900">
                  {isLoading ? "..." : stats?.email || "Chưa cập nhật"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gray-400 shrink-0" />
              <div>
                <p className="text-sm text-gray-500 font-medium">
                  Địa chỉ lấy hàng
                </p>
                <p className="font-semibold text-gray-900 line-clamp-2">
                  {isLoading ? "..." : stats?.address || "Chưa cập nhật"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardHeader className="border-b pb-4 rounded-t-xl">
            <CardTitle className="text-gray-800 flex items-center gap-2 text-lg">
              <Star className="w-5 h-5 text-orange-500" />
              Đánh giá & Dịch vụ
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-blue-500" />
                <span className="text-gray-700 font-medium">
                  Tỉ lệ phản hồi
                </span>
              </div>
              <span className="font-bold text-green-600">
                {isLoading ? "..." : `${stats?.response_rate || 0}%`}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-purple-500" />
                <span className="text-gray-700 font-medium">Chuẩn bị hàng</span>
              </div>
              <span className="font-bold text-gray-900">
                {isLoading
                  ? "..."
                  : `${stats?.prep_time?.toFixed(1) || "0.0"} ngày`}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <span className="text-gray-700 font-medium">
                  Đánh giá 5 sao
                </span>
              </div>
              <span className="font-bold text-gray-900">
                {isLoading ? "..." : `${stats?.five_star_count || 0} lượt`}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Star className="w-5 h-5 text-red-500" />
                <span className="text-gray-700 font-medium">
                  Đánh giá 1-2 sao
                </span>
              </div>
              <span className="font-bold text-gray-900">
                {isLoading ? "..." : `${stats?.low_star_count || 0} lượt`}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardHeader className="border-b pb-4 rounded-t-xl">
            <CardTitle className="text-gray-800 flex items-center gap-2 text-lg">
              <PackageOpen className="w-5 h-5 text-indigo-500" />
              Việc cần làm
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-lg p-4 text-center hover:bg-gray-50 cursor-pointer transition-colors flex flex-col justify-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {isLoading ? "-" : stats?.pending_confirm || 0}
                </div>
                <div className="text-xs text-gray-500 font-medium">
                  Chờ xác nhận
                </div>
              </div>

              <div className="border rounded-lg p-4 text-center hover:bg-gray-50 cursor-pointer transition-colors flex flex-col justify-center">
                <div className="text-3xl font-bold text-orange-600 mb-1">
                  {isLoading ? "-" : stats?.pending_pickup || 0}
                </div>
                <div className="text-xs text-gray-500 font-medium">
                  Chờ lấy hàng
                </div>
              </div>

              <div className="border rounded-lg p-4 text-center hover:bg-gray-50 cursor-pointer transition-colors flex flex-col justify-center">
                <div className="text-3xl font-bold text-red-600 mb-1">
                  {isLoading ? "-" : stats?.low_stock || 0}
                </div>
                <div className="text-xs text-gray-500 font-medium">
                  Sắp hết hàng
                </div>
              </div>

              <div className="border rounded-lg p-4 text-center hover:bg-gray-50 cursor-pointer transition-colors flex flex-col justify-center">
                <div className="text-3xl font-bold text-green-600 mb-1">
                  {isLoading ? "-" : stats?.delivered || 0}
                </div>
                <div className="text-xs text-gray-500 font-medium">
                  Giao thành công
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
