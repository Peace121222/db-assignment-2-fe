import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen p-10">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-orange-600 mb-2">
            Shopee Pro Max Admin
          </h1>
          <p className="text-gray-600 text-lg">
            Hệ thống quản trị CSDL - Bài tập lớn 2
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card Quản lý sản phẩm */}
          <Link href="/products" className="block group">
            <div className="bg-white p-6 rounded-xl shadow-sm border hover:border-orange-500 h-full">
              <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center mb-4 text-2xl">
                📦
              </div>
              <h2 className="text-xl font-bold mb-2">Quản lý Sản phẩm</h2>
              <p className="text-gray-600 text-sm">
                Thêm, sửa, xóa và tìm kiếm qua Stored Procedures.
              </p>
              <div className="mt-4 text-xs font-semibold text-blue-600 bg-blue-50 inline-block px-2 py-1 rounded">
                Yêu cầu 3.1 & 3.2
              </div>
            </div>
          </Link>

          {/* Card Thông tin */}
          <div className="bg-white p-6 rounded-xl shadow-sm border h-full">
            <div className="w-12 h-12 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center mb-4 text-2xl">
              👨‍💻
            </div>
            <h2 className="text-xl font-bold mb-2">Thông tin Nhóm</h2>
            <ul className="text-gray-600 text-sm space-y-2">
              <li>
                <span className="font-semibold">Môn học:</span> Hệ quản trị CSDL
              </li>
              <li>
                <span className="font-semibold">Sinh viên thực hiện:</span> Tạ
                Thanh Bình
              </li>
              <li>
                <span className="font-semibold">MSSV:</span> 2452155
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
