/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { ProductService } from "@/services/product.service";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ProductResponse,
  ProductStatus,
  CreateProductRequest,
  UpdateProductRequest,
  GetProductsFilterRequest,
  ApiResponse,
} from "@/services/types/product.type";

type ApiError = {
  response?: {
    data?: {
      message?: string | string[];
    };
  };
};

const CATEGORY_MAP: Record<string, string> = {
  "e0000000-0000-4000-8000-000000000001": "Điện thoại & Phụ kiện",
  "e0000000-0000-4000-8000-000000000002": "Máy tính Laptop",
  "e0000000-0000-4000-8000-000000000003": "Thời trang nam",
  "e0000000-0000-4000-8000-000000000004": "Đồ gia dụng",
  "e0000000-0000-4000-8000-000000000005": "Sách & Văn phòng phẩm",
};

const DEFAULT_CATEGORY = "e0000000-0000-4000-8000-000000000001";

export default function ProductsPage() {
  const params = useParams();
  const storeIdParam =
    (params?.storeId as string) || "f0000000-0000-4000-8000-000000000001";

  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProductStatus | "ALL">(
    "ALL",
  );
  const [sortBy, setSortBy] = useState<"price" | "name" | "created_at">(
    "created_at",
  );
  const [sortDir, setSortDir] = useState<"ASC" | "DESC">("DESC");

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<ProductResponse | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    basePrice: 0,
    status: "active" as ProductStatus,
    storeId: storeIdParam,
    categoryId: DEFAULT_CATEGORY,
  });

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchParams: GetProductsFilterRequest = {
        keyword: search || undefined,
        status: statusFilter === "ALL" ? undefined : statusFilter,
        sortBy,
        sortOrder: sortDir,
        storeId: storeIdParam,
      };

      const response = await ProductService.getProducts(fetchParams);
      const productList =
        (response as unknown as ProductResponse[])?.length !== undefined
          ? (response as unknown as ProductResponse[])
          : (response as ApiResponse<ProductResponse[]>).data;

      setProducts(productList || []);
    } catch {
      toast.error("Lỗi khi tải danh sách sản phẩm.");
    } finally {
      setIsLoading(false);
    }
  }, [search, statusFilter, sortBy, sortDir, storeIdParam]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleOpenAdd = () => {
    setFormData({
      name: "",
      description: "",
      basePrice: 0,
      status: "active",
      storeId: storeIdParam,
      categoryId: DEFAULT_CATEGORY,
    });
    setIsAddOpen(true);
  };

  const handleOpenEdit = (product: ProductResponse) => {
    setSelectedProduct(product);
    setFormData({
      name: product.product_name,
      description: product.description || "",
      basePrice: Number(product.base_price),
      status: product.status,
      storeId: product.store_id || storeIdParam,
      categoryId: product.category_id || DEFAULT_CATEGORY,
    });
    setIsEditOpen(true);
  };

  const displayError = (err: unknown, fallbackMsg: string) => {
    const apiError = err as ApiError;
    const msg = apiError.response?.data?.message;
    if (Array.isArray(msg)) {
      toast.error(msg[0]);
    } else if (typeof msg === "string") {
      toast.error(msg);
    } else {
      toast.error(fallbackMsg);
    }
  };

  const handleSaveAdd = async () => {
    try {
      const payload: CreateProductRequest = {
        name: formData.name,
        description: formData.description,
        basePrice: formData.basePrice,
        storeId: formData.storeId,
        categoryId: formData.categoryId,
      };
      await ProductService.createProduct(payload);
      toast.success("Thêm sản phẩm thành công!");
      setIsAddOpen(false);
      fetchProducts();
    } catch (error) {
      displayError(error, "Lỗi khi thêm sản phẩm.");
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedProduct) return;
    try {
      const payload: UpdateProductRequest = {
        name: formData.name,
        description: formData.description,
        basePrice: formData.basePrice,
        status: formData.status,
        storeId: formData.storeId,
        categoryId: formData.categoryId,
      };
      await ProductService.updateProduct(selectedProduct.product_id, payload);
      toast.success("Cập nhật thành công!");
      setIsEditOpen(false);
      fetchProducts();
    } catch (error) {
      displayError(error, "Lỗi khi cập nhật.");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProduct) return;
    try {
      await ProductService.deleteProduct(selectedProduct.product_id);
      toast.success("Đã xóa sản phẩm!");
      setIsDeleteOpen(false);
      fetchProducts();
    } catch (error) {
      displayError(error, "Lỗi khi xóa.");
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-black text-3xl font-bold tracking-tight">
          Danh sách sản phẩm
        </h1>
        <Button
          onClick={handleOpenAdd}
          className="bg-blue-600 text-white hover:bg-blue-700 border-0 cursor-pointer"
        >
          + Thêm Sản Phẩm Mới
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-lg border shadow-sm">
        <div className="flex w-full md:w-1/3">
          <Input
            type="text"
            placeholder="Tìm kiếm theo tên..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="text-black"
          />
        </div>

        <div className="flex w-full md:w-auto gap-2">
          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as ProductStatus | "ALL")}
          >
            <SelectTrigger className="w-37.5 text-black cursor-pointer">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
              <SelectItem value="active">Đang bán</SelectItem>
              <SelectItem value="hidden">Đã ẩn</SelectItem>
              <SelectItem value="out_of_stock">Hết hàng</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={sortBy}
            onValueChange={(v) =>
              setSortBy(v as "price" | "name" | "created_at")
            }
          >
            <SelectTrigger className="w-37.5 text-black cursor-pointer">
              <SelectValue placeholder="Sắp xếp theo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at">Ngày tạo</SelectItem>
              <SelectItem value="price">Giá bán</SelectItem>
              <SelectItem value="name">Tên sản phẩm</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={sortDir}
            onValueChange={(v) => setSortDir(v as "ASC" | "DESC")}
          >
            <SelectTrigger className="w-30 text-black cursor-pointer">
              <SelectValue placeholder="Chiều" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DESC">Giảm dần</SelectItem>
              <SelectItem value="ASC">Tăng dần</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="text-black font-bold">
                Tên sản phẩm
              </TableHead>
              <TableHead className="text-black font-bold">Danh mục</TableHead>
              <TableHead className="text-black font-bold">Giá bán</TableHead>
              <TableHead className="text-black font-bold">Trạng thái</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-gray-500"
                >
                  Đang tải...
                </TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-gray-500"
                >
                  Không có sản phẩm nào.
                </TableCell>
              </TableRow>
            ) : (
              products.map((p) => (
                <TableRow key={p.product_id}>
                  <TableCell className="text-black font-medium">
                    {p.product_name}
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {p.category_name}
                  </TableCell>
                  <TableCell className="text-black font-semibold">
                    {Number(p.base_price).toLocaleString()} đ
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${p.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                    >
                      {p.status === "active"
                        ? "Đang bán"
                        : p.status === "hidden"
                          ? "Đã ẩn"
                          : "Hết hàng"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      size="sm"
                      onClick={() => handleOpenEdit(p)}
                      className="bg-black text-white hover:bg-gray-800 cursor-pointer border-0"
                    >
                      Sửa
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="cursor-pointer"
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

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-125">
          <DialogHeader>
            <DialogTitle>Thêm Sản Phẩm Mới</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4 text-black">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Tên sản phẩm</label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="text-black"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Danh mục</label>
              <Select
                value={formData.categoryId}
                onValueChange={(v) =>
                  setFormData({
                    ...formData,
                    categoryId: v || DEFAULT_CATEGORY,
                  })
                }
              >
                <SelectTrigger className="text-black cursor-pointer">
                  <SelectValue placeholder="Chọn danh mục">
                    {CATEGORY_MAP[formData.categoryId]}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CATEGORY_MAP).map(([id, name]) => (
                    <SelectItem key={id} value={id}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Mô tả</label>
              <Textarea
                className="min-h-25 text-black"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Giá bán</label>
              <Input
                type="number"
                value={formData.basePrice}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    basePrice: Number(e.target.value),
                  })
                }
                className="text-black"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              className="bg-red-600 text-white cursor-pointer"
              onClick={() => setIsAddOpen(false)}
            >
              Hủy
            </Button>
            <Button
              className="bg-blue-600 text-white cursor-pointer"
              onClick={handleSaveAdd}
            >
              Lưu sản phẩm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-125">
          <DialogHeader>
            <DialogTitle>Chỉnh Sửa Sản Phẩm</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4 text-black">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Tên sản phẩm</label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="text-black"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Danh mục</label>
              <Select
                value={formData.categoryId}
                onValueChange={(v) =>
                  setFormData({
                    ...formData,
                    categoryId: v || DEFAULT_CATEGORY,
                  })
                }
              >
                <SelectTrigger className="text-black cursor-pointer">
                  <SelectValue placeholder="Chọn danh mục">
                    {CATEGORY_MAP[formData.categoryId]}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CATEGORY_MAP).map(([id, name]) => (
                    <SelectItem key={id} value={id}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Mô tả</label>
              <Textarea
                className="min-h-25 text-black"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Giá bán</label>
              <Input
                type="number"
                value={formData.basePrice}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    basePrice: Number(e.target.value),
                  })
                }
                className="text-black"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Trạng thái</label>
              <Select
                value={formData.status}
                onValueChange={(v) =>
                  setFormData({ ...formData, status: v as ProductStatus })
                }
              >
                <SelectTrigger className="text-black cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Đang bán</SelectItem>
                  <SelectItem value="hidden">Đã ẩn</SelectItem>
                  <SelectItem value="out_of_stock">Hết hàng</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              className="bg-red-600 text-white cursor-pointer"
              onClick={() => setIsEditOpen(false)}
            >
              Hủy
            </Button>
            <Button
              className="bg-blue-600 text-white cursor-pointer"
              onClick={handleSaveEdit}
            >
              Cập nhật
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">Xác nhận xóa</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-black">
            Bạn có chắc chắn muốn xóa{" "}
            <strong className="text-red-500">
              {selectedProduct?.product_name}
            </strong>
            ?
          </div>
          <DialogFooter>
            <Button
              className="bg-red-600 text-white cursor-pointer"
              onClick={() => setIsDeleteOpen(false)}
            >
              Hủy
            </Button>
            <Button
              className="bg-blue-600 text-white cursor-pointer"
              onClick={handleDeleteConfirm}
            >
              Đồng ý Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
