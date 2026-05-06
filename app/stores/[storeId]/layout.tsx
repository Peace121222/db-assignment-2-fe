"use client";

import Link from "next/link";
import { ReactNode, use } from "react";
import { usePathname } from "next/navigation";

interface ShopLayoutProps {
  children: ReactNode;
  params: Promise<{
    storeId: string;
  }>;
}

export default function ShopLayout({ children, params }: ShopLayoutProps) {
  const { storeId } = use(params);
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  const navItems = [
    {
      name: "Tổng quan",
      href: `/stores/${storeId}/dashboard`,
      isBlocked: false,
    },
    {
      name: "Quản lý Sản phẩm",
      href: `/stores/${storeId}/products`,
      isBlocked: false,
    },
    {
      name: "Quản lý Đơn hàng",
      href: `/stores/${storeId}/orders`,
      isBlocked: true,
    },
    {
      name: "Thiết lập Shop",
      href: `/stores/${storeId}/settings`,
      isBlocked: true,
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 text-black">
      <aside className="w-64 bg-white border-r hidden md:block">
        <div className="h-16 flex items-center px-6 border-b">
          <h2 className="text-lg font-bold text-gray-800">Quản lý Shop</h2>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            if (item.isBlocked) {
              return (
                <div
                  key={item.name}
                  className="flex items-center px-4 py-3 text-sm font-medium text-gray-400 rounded-md cursor-pointer opacity-50 transition-none"
                >
                  {item.name}
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors cursor-pointer ${
                  isActive(item.href)
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
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
