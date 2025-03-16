import React, { useState, useEffect } from "react";
import useProductStore from "../../store/productStore";
import axios from "axios";
import { getCookie } from "../../utils/cookie.util";
import { STAFF_TOKEN_KEY } from "../../constants/authen.constant";

const key = "BGSJ6545DHHHFGS";

const EditProductModal = ({ product, closeModal }) => {
  const [form, setForm] = useState({
    name: '',
    price: '',
    countInStock: '',
    image: '',
    description: '',
    descriptionDetail: '',
    discount: '',
    type: '',
    isBestSeller: false,
    origin: '',
    material: '',
    size: '',
    warranty: ''
  });
  const { products, setProducts } = useProductStore((state) => state)
  const [, setErrorMessage] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");


  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || '',
        price: product.price || '',
        countInStock: product.countInStock || '',
        image: product.image || '',
        description: product.description || '',
        descriptionDetail: product.descriptionDetail || '',
        discount: product.discount || '',
        type: product.type || '',
        isBestSeller: product.isBestSeller || false,
        origin: product.origin || '',
        material: product.material || '',
        size: product.size || '',
        warranty: product.warranty || ''
      });
      setSelectedCategory(product.type || "");
    }
  }, [product]);


  const handleSave = async () => {
    if (!product || !product._id) {
      console.log("Không tìm thấy sản phẩm");
      return;
    }

    try {
      const finalCategory = selectedCategory === key ? newCategory : selectedCategory;

      const updatedData = {
        ...form,
        type: finalCategory,
      };

      const response = await axios.put(
        `${process.env.REACT_APP_URL_BACKEND}/product/update-product/${product._id}`,
        updatedData, {
        headers: {
          'staff-token': getCookie(STAFF_TOKEN_KEY)
        }
      }
      );
      window.location.reload()
      console.log("Cập nhật thành công:", response.data);
      setProducts((prevProducts) =>
        prevProducts.map((p) =>
          p._id === product._id ? response.data.data : p
        )
      );
    } catch (error) {
      console.error("Lỗi cập nhật thông tin:", error);
      setErrorMessage("Có lỗi xảy ra khi cập nhật. Vui lòng thử lại!");
    }
  };


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setSelectedCategory(value);

    if (value === key) {
      setNewCategory("");
    } else {
      setForm({ ...form, type: value });
    }
  };

  useEffect(() => {
    if (selectedCategory === key) {
      setForm((prev) => ({ ...prev, type: newCategory }));
    }
  }, [newCategory, selectedCategory]);


  return (
    <div className="modal fade show d-block" id="editProductModal">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Sửa Sản Phẩm</h5>
            <button type="button" className="btn-close" onClick={closeModal}></button>
          </div>
          <div className="modal-body">
            <label className="form-label">
              Đổi ảnh sản phẩm
              <input type="file" className="form-control mb-3" onChange={handleFileChange} />
            </label>
            {form.image && <img
              src={form.image}
              alt="Product"
              style={{ width: "100px", height: "100px", objectFit: "cover", marginBottom: "10px" }}
              className="m-3"
            />}
            <label className="form-label fw-bold">Tên sản phẩm</label>
            <input
              type="text"
              className="form-control mb-3"
              id="name"
              placeholder="Nhập tên sản phẩm"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <label className="form-label fw-bold">Loại sản phẩm</label>
            <select className="form-select mb-3" id="type" value={selectedCategory} onChange={handleCategoryChange} required>
              <option value="">-- Chọn loại sản phẩm --</option>
              {[...new Set(products.map((productItem) => productItem.type))].filter((type) => type).map((type, index) => (
                <option key={index} value={type}>{type}</option>
              ))}
              <option value={key}>+ Thêm loại mới</option>
            </select>
            {selectedCategory === key && (
              <>
                <label className="form-label fw-bold">Loại sản phẩm mới</label>
                <input type="text" className="form-control mb-3" placeholder="Nhập loại sản phẩm mới" value={newCategory} onChange={(e) => setNewCategory(e.target.value)}
                  required />
              </>
            )}

            <label className="form-label fw-bold">Xuất xứ</label>
            <input
              type="text"
              className="form-control mb-3"
              id="origin"
              placeholder="Nhập xuất xứ"
              value={form.origin}
              onChange={(e) => setForm({ ...form, origin: e.target.value })}
            />

            <label className="form-label fw-bold">Chất liệu</label>
            <input
              type="text"
              className="form-control mb-3"
              id="material"
              placeholder="Nhập chất liệu"
              value={form.material} onChange={(e) => setForm({ ...form, material: e.target.value })}
            />

            <label className="form-label fw-bold">Kích thước</label>
            <input
              type="text"
              className="form-control mb-3"
              id="size"
              placeholder="Nhập kích thước"
              value={form.size}
              onChange={(e) => setForm({ ...form, size: e.target.value })}
            />

            <label className="form-label fw-bold">Bảo hành</label>
            <input
              type="text"
              className="form-control mb-3"
              id="warranty"
              placeholder="Nhập thời gian bảo hành"
              value={form.warranty}
              onChange={(e) => setForm({ ...form, warranty: e.target.value })}
            />

            <label className="form-label fw-bold">Giá</label>
            <input
              type="number"
              className="form-control mb-3"
              id="price"
              placeholder="Nhập giá sản phẩm"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />

            <label className="form-label fw-bold">Số lượng trong kho</label>
            <input
              type="number"
              className="form-control mb-3"
              id="countInStock"
              placeholder="Nhập số lượng"
              value={form.countInStock}
              onChange={(e) => setForm({ ...form, countInStock: e.target.value })}
            />

            <label className="form-label fw-bold">Giảm giá (%)</label>
            <input
              type="number"
              className="form-control mb-3"
              id="discount"
              placeholder="Nhập phần trăm giảm giá"
              value={form.discount}
              onChange={(e) => setForm({ ...form, discount: e.target.value })}
            />

            <label className="form-label fw-bold">Mô tả</label>
            <textarea className="form-control mb-3" id="description" placeholder="Nhập mô tả sản phẩm" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />

            <label className="form-label fw-bold">Mô tả chi tiết</label>
            <textarea className="form-control mb-3" id="descriptionDetail" placeholder="Nhập mô tả chi tiết" value={form.descriptionDetail} onChange={(e) => setForm({ ...form, descriptionDetail: e.target.value })} />

            <div className="form-check mb-3">
              <input type="checkbox" className="form-check-input" id="isBestSeller" checked={form.isBestSeller} onChange={(e) => setForm({ ...form, isBestSeller: e.target.checked })} />
              <label className="form-check-label fw-bold" htmlFor="isBestSeller">Sản phẩm bán chạy</label>
            </div>

            <button className="btn btn-primary w-100" onClick={handleSave}>Lưu</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;
