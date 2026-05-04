"use client";

import { useState, useEffect } from "react";
import { ProductService } from "@/services/api.client";
import { Product, CreateProductDTO } from "@/types";
import { toast } from "sonner"; // Thư viện thông báo mới tải

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState<CreateProductDTO>({
    name: "",
    base_price: 0,
    store_id: "123e4567-e89b-12d3-a456-426614174000",
    category_id: "123e4567-e89b-12d3-a456-426614174001",
  });

  const fetchProducts = async (keyword: string = "") => {
    try {
      const data = await ProductService.getProducts(keyword);
      setProducts(data);
    } catch (err: any) {
      console.log("Đang chờ backend bật...");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSaveProduct = async () => {
    try {
      await ProductService.createProduct(formData);
      toast.success("Đã thêm sản phẩm mới thành công!");
      setIsAddOpen(false);
      fetchProducts(search);
    } catch (err: any) {
      toast.error(err.message); // Bắn lỗi Database lên UI
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProduct) return;
    try {
      await ProductService.deleteProduct(selectedProduct.product_id);
      toast.success("Đã xóa sản phẩm!");
      setIsDeleteOpen(false);
      fetchProducts(search);
    } catch (err: any) {
      toast.error(err.message); // Lỗi khi xóa
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Quản Lý Sản Phẩm</h1>
      </div>

      <div className="flex justify-between items-center bg-white p-4 rounded-lg border shadow-sm">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input
            type="text"
            placeholder="Nhập tên sản phẩm để tìm kiếm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button onClick={() => fetchProducts(search)}>Tìm</Button>
        </div>
        <Button
          onClick={() => {
            setFormData({
              name: "",
              base_price: 0,
              store_id: "",
              category_id: "",
            });
            setIsAddOpen(true);
          }}
        >
          + Thêm Sản Phẩm
        </Button>
      </div>

      <div className="rounded-md border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Tên sản phẩm</TableHead>
              <TableHead>Giá bán</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-24 text-center text-gray-500"
                >
                  Chưa có dữ liệu từ Database.
                </TableCell>
              </TableRow>
            ) : (
              products.map((p) => (
                <TableRow key={p.product_id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell className="text-red-600 font-semibold">
                    {p.base_price.toLocaleString()} đ
                  </TableCell>
                  <TableCell>{p.status}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setSelectedProduct(p);
                        setIsDeleteOpen(true);
                      }}
                    >
                      Xóa
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modal Thêm Mới */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm Sản Phẩm Mới</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Tên sản phẩm</label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Giá bán (VNĐ)</label>
              <Input
                type="number"
                value={formData.base_price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    base_price: Number(e.target.value),
                  })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSaveProduct}>Lưu thông tin</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Xác nhận Xóa */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">Xác nhận xóa</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            Bạn có chắc chắn muốn xóa sản phẩm{" "}
            <strong>{selectedProduct?.name}</strong>?
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Đồng ý Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
