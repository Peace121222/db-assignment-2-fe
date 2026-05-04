"use client";

import { useState, useEffect, useCallback } from "react";
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
  GetProductsFilterRequest,
  CreateProductRequest,
  UpdateProductRequest,
} from "@/services/types/product.type";

type ApiError = {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
};

export default function ProductsPage() {
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
    base_price: 0,
    status: "active" as ProductStatus,
    store_id: "f0000000-0000-4000-8000-000000000001",
    category_id: "e0000000-0000-4000-8000-000000000001",
  });

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: GetProductsFilterRequest = {
        keyword: search || undefined,
        status: statusFilter === "ALL" ? undefined : statusFilter,
        sortBy,
        sortDir,
      };
      const response = await ProductService.getProducts(params);
      const productList = Array.isArray(response) ? response : response.data;
      setProducts(productList || []);
    } catch (error) {
      const err = error as ApiError;
      toast.error(
        err.response?.data?.message || "Lỗi khi tải danh sách sản phẩm.",
      );
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [search, statusFilter, sortBy, sortDir]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProducts();
  }, [fetchProducts]);

  const handleOpenAdd = () => {
    setFormData({
      name: "",
      description: "",
      base_price: 0,
      status: "active",
      store_id: "f0000000-0000-4000-8000-000000000001",
      category_id: "e0000000-0000-4000-8000-000000000001",
    });
    setIsAddOpen(true);
  };

  const handleOpenEdit = async (product: ProductResponse) => {
    setSelectedProduct(product);

    let descriptionData = "";
    try {
      const detailResponse = await ProductService.getProductById(
        product.product_id,
      );
      const detailData = Array.isArray(detailResponse)
        ? detailResponse[0]
        : detailResponse.data;

      const dataRecord = detailData as Record<string, unknown>;
      if (dataRecord && typeof dataRecord.description === "string") {
        descriptionData = dataRecord.description;
      }
    } catch {
      console.log("Lấy chi tiết thất bại, dùng giá trị mặc định");
    }

    setFormData({
      name: product.product_name,
      description: descriptionData,
      base_price: product.base_price,
      status: product.status,
      store_id: "f0000000-0000-4000-8000-000000000001",
      category_id: "e0000000-0000-4000-8000-000000000001",
    });
    setIsEditOpen(true);
  };

  const handleSaveAdd = async () => {
    try {
      const payload: CreateProductRequest = {
        name: formData.name,
        description: formData.description,
        base_price: formData.base_price,
        store_id: formData.store_id,
        category_id: formData.category_id,
      };
      await ProductService.createProduct(payload);
      toast.success("Thêm sản phẩm thành công!");
      setIsAddOpen(false);
      fetchProducts();
    } catch (error) {
      const err = error as ApiError;
      toast.error(err.response?.data?.message || "Lỗi khi thêm sản phẩm.");
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedProduct) return;
    try {
      const payload: UpdateProductRequest = {
        name: formData.name,
        description: formData.description,
        base_price: formData.base_price,
        status: formData.status,
        store_id: formData.store_id,
        category_id: formData.category_id,
      };
      await ProductService.updateProduct(selectedProduct.product_id, payload);
      toast.success("Cập nhật sản phẩm thành công!");
      setIsEditOpen(false);
      fetchProducts();
    } catch (error) {
      const err = error as ApiError;
      toast.error(err.response?.data?.message || "Lỗi khi cập nhật.");
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
      const err = error as ApiError;
      toast.error(err.response?.data?.message || "Lỗi khi xóa.");
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Sản Phẩm Của Shop</h1>
        <Button onClick={handleOpenAdd}>+ Thêm Sản Phẩm Mới</Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-lg border shadow-sm">
        <div className="flex w-full md:w-1/3">
          <Input
            type="text"
            placeholder="Tìm kiếm theo tên..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex w-full md:w-auto gap-2">
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              if (value !== null)
                setStatusFilter(value as ProductStatus | "ALL");
            }}
          >
            <SelectTrigger className="w-37.5">
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
            onValueChange={(value) => {
              if (value !== null)
                setSortBy(value as "price" | "name" | "created_at");
            }}
          >
            <SelectTrigger className="w-37.5">
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
            onValueChange={(value) => {
              if (value !== null) setSortDir(value as "ASC" | "DESC");
            }}
          >
            <SelectTrigger className="w-30">
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-gray-500"
                >
                  Đang tải dữ liệu...
                </TableCell>
              </TableRow>
            ) : (products || []).length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-gray-500"
                >
                  Không tìm thấy sản phẩm nào phù hợp.
                </TableCell>
              </TableRow>
            ) : (
              (products || []).map((p) => (
                <TableRow key={p.product_id}>
                  <TableCell className="text-black font-medium">
                    {p.product_name}
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {p.category_name}
                  </TableCell>
                  <TableCell className="text-red-600 font-semibold">
                    {Number(p.base_price).toLocaleString()} đ
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        p.status === "active"
                          ? "bg-green-100 text-green-700"
                          : p.status === "hidden"
                            ? "bg-gray-100 text-gray-700"
                            : "bg-red-100 text-red-700"
                      }`}
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
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenEdit(p)}
                    >
                      Sửa
                    </Button>
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

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-125">
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
              <label className="text-sm font-medium">Danh mục</label>
              <Select
                value={formData.category_id}
                onValueChange={(value) => {
                  if (value !== null) {
                    setFormData({ ...formData, category_id: value });
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="e0000000-0000-4000-8000-000000000001">
                    Điện thoại & Phụ kiện
                  </SelectItem>
                  <SelectItem value="e0000000-0000-4000-8000-000000000002">
                    Thời trang nam
                  </SelectItem>
                  <SelectItem value="e0000000-0000-4000-8000-000000000003">
                    Sách & Văn phòng phẩm
                  </SelectItem>
                  <SelectItem value="e0000000-0000-4000-8000-000000000004">
                    Đồ gia dụng
                  </SelectItem>
                  <SelectItem value="e0000000-0000-4000-8000-000000000005">
                    Thể thao & Dã ngoại
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Mô tả sản phẩm</label>
              <Textarea
                placeholder="Nhập thông tin mô tả chi tiết..."
                className="min-h-25"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
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
            <Button onClick={handleSaveAdd}>Lưu sản phẩm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-125">
          <DialogHeader>
            <DialogTitle>Chỉnh Sửa Sản Phẩm</DialogTitle>
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
              <label className="text-sm font-medium">Danh mục</label>
              <Select
                value={formData.category_id}
                onValueChange={(value) => {
                  if (value !== null) {
                    setFormData({ ...formData, category_id: value });
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="e0000000-0000-4000-8000-000000000001">
                    Điện thoại & Phụ kiện
                  </SelectItem>
                  <SelectItem value="e0000000-0000-4000-8000-000000000002">
                    Thời trang nam
                  </SelectItem>
                  <SelectItem value="e0000000-0000-4000-8000-000000000003">
                    Sách & Văn phòng phẩm
                  </SelectItem>
                  <SelectItem value="e0000000-0000-4000-8000-000000000004">
                    Đồ gia dụng
                  </SelectItem>
                  <SelectItem value="e0000000-0000-4000-8000-000000000005">
                    Thể thao & Dã ngoại
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Mô tả sản phẩm</label>
              <Textarea
                placeholder="Nhập thông tin mô tả chi tiết..."
                className="min-h-25"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
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
            <div className="grid gap-2">
              <label className="text-sm font-medium">Trạng thái</label>
              <Select
                value={formData.status}
                onValueChange={(value) => {
                  if (value !== null) {
                    setFormData({
                      ...formData,
                      status: value as ProductStatus,
                    });
                  }
                }}
              >
                <SelectTrigger>
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
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSaveEdit}>Cập nhật</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">Xác nhận xóa</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            Bạn có chắc chắn muốn xóa sản phẩm{" "}
            <strong className="text-red-500">
              {selectedProduct?.product_name}
            </strong>
            ?<br />
            Hành động này sẽ ẩn sản phẩm khỏi cửa hàng.
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
