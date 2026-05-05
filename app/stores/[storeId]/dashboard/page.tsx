"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  TrendingUp,
  ShoppingBag,
  PackageOpen,
  MessageCircle,
  Clock,
  DollarSign,
  Users,
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Tổng quan cửa hàng
          </h1>
          <p className="text-gray-500 mt-1">
            Cập nhật kết quả kinh doanh hôm nay (So với hôm qua)
          </p>
        </div>
        <Badge
          variant="outline"
          className="px-4 py-2 bg-green-50 text-green-700 border-green-200 text-sm"
        >
          Shop đang hoạt động tốt
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
            <div className="text-2xl font-bold text-gray-900">12,540,000 đ</div>
            <p className="text-xs text-green-600 flex items-center mt-1 font-medium">
              <TrendingUp className="w-3 h-3 mr-1" />
              +15%
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
            <div className="text-2xl font-bold text-gray-900">34</div>
            <p className="text-xs text-green-600 flex items-center mt-1 font-medium">
              <TrendingUp className="w-3 h-3 mr-1" />
              +5 đơn
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
            <div className="text-2xl font-bold text-gray-900">4.9 / 5.0</div>
            <p className="text-xs text-gray-500 mt-1">Dựa trên 128 đánh giá</p>
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
            <div className="text-2xl font-bold text-gray-900">1,204</div>
            <p className="text-xs text-green-600 flex items-center mt-1 font-medium">
              <TrendingUp className="w-3 h-3 mr-1" />
              +8.2%
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border shadow-sm">
          <CardHeader className="bg-gray-50 border-b pb-4 rounded-t-xl">
            <CardTitle className="text-gray-800 flex items-center gap-2 text-lg">
              <Star className="w-5 h-5 text-orange-500" />
              Chi tiết Đánh giá & Dịch vụ
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-blue-500" />
                <span className="text-gray-700 font-medium">
                  Tỉ lệ phản hồi Chat
                </span>
              </div>
              <span className="font-bold text-green-600">98%</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-purple-500" />
                <span className="text-gray-700 font-medium">
                  Thời gian chuẩn bị hàng
                </span>
              </div>
              <span className="font-bold text-gray-900">1.2 ngày</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <span className="text-gray-700 font-medium">
                  Đánh giá 5 sao
                </span>
              </div>
              <span className="font-bold text-gray-900">120 lượt</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Star className="w-5 h-5 text-red-500" />
                <span className="text-gray-700 font-medium">
                  Đánh giá 1-2 sao
                </span>
              </div>
              <span className="font-bold text-gray-900">2 lượt</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardHeader className="bg-gray-50 border-b pb-4 rounded-t-xl">
            <CardTitle className="text-gray-800 flex items-center gap-2 text-lg">
              <PackageOpen className="w-5 h-5 text-indigo-500" />
              Việc cần làm
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-lg p-4 text-center hover:bg-gray-50 cursor-pointer transition-colors">
                <div className="text-3xl font-bold text-blue-600 mb-1">12</div>
                <div className="text-sm text-gray-500 font-medium">
                  Chờ xác nhận
                </div>
              </div>

              <div className="border rounded-lg p-4 text-center hover:bg-gray-50 cursor-pointer transition-colors">
                <div className="text-3xl font-bold text-orange-600 mb-1">8</div>
                <div className="text-sm text-gray-500 font-medium">
                  Chờ lấy hàng
                </div>
              </div>

              <div className="border rounded-lg p-4 text-center hover:bg-gray-50 cursor-pointer transition-colors">
                <div className="text-3xl font-bold text-red-600 mb-1">3</div>
                <div className="text-sm text-gray-500 font-medium">
                  Sắp hết hàng
                </div>
              </div>

              <div className="border rounded-lg p-4 text-center hover:bg-gray-50 cursor-pointer transition-colors">
                <div className="text-3xl font-bold text-green-600 mb-1">5</div>
                <div className="text-sm text-gray-500 font-medium">
                  Đã giao thành công
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
