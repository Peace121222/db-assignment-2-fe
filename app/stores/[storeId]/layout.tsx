import Link from "next/link";
import { ReactNode } from "react";

interface ShopLayoutProps {
  children: ReactNode;
  params: Promise<{
    storeId: string;
  }>;
}

export default async function ShopLayout({
  children,
  params,
}: ShopLayoutProps) {
  const { storeId } = await params;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r hidden md:block">
        <div className="h-16 flex items-center px-6 border-b">
          <h2 className="text-lg font-bold text-gray-800">Quản lý Shop</h2>
        </div>

        <nav className="p-4 space-y-1">
          <Link
            href={`/stores/${storeId}/dashboard`}
            className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-blue-600 transition-colors"
          >
            Tổng quan
          </Link>

          <Link
            href={`/stores/${storeId}/products`}
            className="flex items-center px-4 py-3 text-sm font-medium text-blue-600 bg-blue-50 rounded-md transition-colors"
          >
            Quản lý Sản phẩm
          </Link>

          <Link
            href={`/stores/${storeId}/orders`}
            className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-blue-600 transition-colors"
          >
            Quản lý Đơn hàng
          </Link>

          <Link
            href={`/stores/${storeId}/settings`}
            className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-blue-600 transition-colors"
          >
            Thiết lập Shop
          </Link>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b flex items-center justify-between px-8 shadow-sm">
          <div className="font-medium text-gray-600">
            Mã cửa hàng: <span className="font-bold text-black">{storeId}</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600">
              S
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
