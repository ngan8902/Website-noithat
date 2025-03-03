import React, { useState, useEffect } from "react";
import useProductStore from "../../store/productStore";
import axios from "axios"
import { getCookie } from "../../utils/cookie.util";
import { STAFF_TOKEN_KEY } from "../../constants/authen.constant";

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


  // const handleSave = async () => {
  //   if (!products || !products._id) {
  //     console.log("Không tìm thấy sản phẩm");
  //     return;
  //   }

  //   try {
  //     const updatedData = {
  //       name: form.name,
  //       email: form.email,
  //       phone: form.phone,
  //     };

  //     const response = await axios.put(
  //       `${process.env.REACT_APP_URL_BACKEND}/product/update-product/${products._id}`);

  //     console.log("Cập nhật thành công:", response.data);
  //     setProducts(response.data.data);
  //     closeModal();
  //     setErrorMessage("Cập nhật sản phẩm thành công!");
  //   } catch (error) {
  //     console.error("Lỗi cập nhật thông tin:", error);
  //     setErrorMessage("Có lỗi xảy ra khi cập nhật. Vui lòng thử lại!");
  //   }
  // };

  const handleSave = async () => {
    if (!product || !product._id) {
      console.log("Không tìm thấy sản phẩm");
      return;
    }

    try {
      const updatedData = {
        ...form,
        type: selectedCategory
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
    if (value !== "new") {
      setForm({ ...form, type: value });
    } else {
      setForm({ ...form, type: "" });
    }
  };

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
            <input type="text" className="form-control mb-3" placeholder="Tên sản phẩm" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />

            <div className="mb-3">
              <label className="form-label fw-bold">Loại Sản Phẩm</label>
              <select
                className="form-select"
                value={selectedCategory}
                onChange={handleCategoryChange}
                required
              >
                <option value="">-- Chọn loại sản phẩm --</option>
                {[...new Set(products.map((productItem) => productItem.type))]
                  .filter((type) => type) // Loại bỏ giá trị rỗng
                  .map((type, index) => (
                    <option key={index} value={type}>
                      {type}
                    </option>
                  ))}
                <option value="new">+ Thêm loại mới</option>
              </select>
              {selectedCategory === "new" && (
                <input
                  type="text"
                  className="form-control mt-2"
                  placeholder="Nhập loại sản phẩm mới"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  required
                />
              )}
            </div>

            <input
              type="text"
              className="form-control mb-3"
              placeholder="Xuất xứ"
              value={form.origin}
              onChange={(e) => setForm({ ...form, origin: e.target.value })}
            />

            <input
              type="text"
              className="form-control mb-3"
              placeholder="Chất liệu"
              value={form.material}
              onChange={(e) => setForm({ ...form, material: e.target.value })}
            />

            <input
              type="text"
              className="form-control mb-3"
              placeholder="Kích thước"
              value={form.size}
              onChange={(e) => setForm({ ...form, size: e.target.value })}
            />

            <input
              type="text"
              className="form-control mb-3"
              placeholder="Bảo hành"
              value={form.warranty}
              onChange={(e) => setForm({ ...form, warranty: e.target.value })}
            />

            <input type="number" className="form-control mb-3" placeholder="Giá" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            <input type="number" className="form-control mb-3" placeholder="Số lượng" value={form.countInStock} onChange={(e) => setForm({ ...form, countInStock: e.target.value })} />

            <input
              type="number"
              className="form-control mb-3"
              placeholder="Giảm giá (%)"
              value={form.discount}
              onChange={(e) => setForm({ ...form, discount: e.target.value })}
            />

            <textarea
              className="form-control mb-3"
              placeholder="Mô tả"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />

            <textarea
              className="form-control mb-3"
              placeholder="Mô tả chi tiết"
              value={form.descriptionDetail}
              onChange={(e) => setForm({ ...form, descriptionDetail: e.target.value })}
            />

            <div className="form-check mb-3">
              <input
                type="checkbox"
                className="form-check-input"
                id="isBestSeller"
                checked={form.isBestSeller}
                onChange={(e) =>
                  setForm({ ...form, isBestSeller: e.target.checked })
                }
              />
              <label className="form-check-label" htmlFor="isBestSeller">
                Sản phẩm bán chạy
              </label>
            </div>
            <button className="btn btn-primary w-100" onClick={handleSave}>Lưu</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;
