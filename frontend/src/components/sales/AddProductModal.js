import React, { useState } from "react";
import axios from "axios";
import useProductStore from "../../store/productStore";

const key = "BGSJ6545DHHHFGS";

const AddProductModal = ({ closeModal }) => {
  const [error, setError] = useState("");
  const { addProducts, products } = useProductStore((state) => state);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  const [product, setProduct] = useState({
    name: "",
    price: "",
    image: null,
    countInStock: "",
    description: "",
    descriptionDetail: "",
    discount: "",
    type: "",
    isBestSeller: false,
    origin: "",
    material: "",
    size: "",
    warranty: "",
  });

  const [selectedCategory, setSelectedCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setSelectedCategory(value);
    if (value === key) {
      setProduct({ ...product, type: newCategory });
    } else {
      setProduct({ ...product, type: value });
      setNewCategory("");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProduct({ ...product, image: file });
      console.log("Selected file:", file); 
      setError("");
    }
  };

  const handleAdd = (e) => {
    e.preventDefault();
    let type = product.type;
    if (!selectedCategory && !newCategory) {
      setError("Vui lòng chọn hoặc nhập loại sản phẩm");
      return;
    }

    if (selectedCategory === key) {
      type = newCategory;
    } else {
      type = selectedCategory;
    }

    if (
      !product.name ||
      !product.price ||
      !product.image ||
      !product.countInStock ||
      !type ||
      !product.origin ||
      !product.material ||
      !product.size ||
      !product.warranty
    ) {
      setError("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("price", product.price);
    formData.append("countInStock", product.countInStock);
    formData.append("description", product.description);
    formData.append("descriptionDetail", product.descriptionDetail);
    formData.append("discount", product.discount);
    formData.append("type", type);
    formData.append("isBestSeller", product.isBestSeller);
    formData.append("origin", product.origin);
    formData.append("material", product.material);
    formData.append("size", product.size);
    formData.append("warranty", product.warranty);
    formData.append("image", product.image);

    console.log("FormData image:", formData.get("image"));

    setLoading(true);
    axios
      .post(`${process.env.REACT_APP_URL_BACKEND}/product/create-product`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        setLoading(false);
        const { data } = response;

        if (data.status === "OK") {
          addProducts(data.data);
          closeModal();
        } else {
          setError(data.message || "Có lỗi xảy ra, vui lòng thử lại!");
          console.error("lỗi:", setError);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.error("Lỗi đăng ký:", err);
        setError("Không thể kết nối với server. Vui lòng thử lại!");
      });
  };

  return (
    <div className="modal fade show d-block" id="addProductModal">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Thêm Sản Phẩm</h5>
            <button type="button" className="btn-close" onClick={closeModal}></button>
          </div>
          <div className="modal-body">
            <label className="form-label">
              Ảnh sản phẩm (*)
              <input type="file" className="form-control mb-3" accept="image/*" onChange={handleFileChange} />
            </label>

            {product.image && (
              <img
                src={URL.createObjectURL(product.image)}
                alt="Product"
                style={{ width: "100px", height: "100px", objectFit: "cover", marginBottom: "10px" }}
              />
            )}

            <input
              type="text"
              className="form-control mb-3"
              placeholder="Tên sản phẩm (*)"
              value={product.name}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
            />

            <div className="mb-3">
              <label className="form-label">Loại Sản Phẩm</label>
              <select
                className="form-select"
                value={selectedCategory}
                onChange={handleCategoryChange}
                required
              >
                <option value="">-- Chọn loại sản phẩm (*) --</option>
                {[...new Set(products.map((productItem) => productItem.type))].map(
                  (type, index) => (
                    <option key={index} value={type}>
                      {type}
                    </option>
                  )
                )}
                <option value={key}>+ Thêm loại mới</option>
              </select>
            </div>

            {selectedCategory === key && (
              <div className="mb-3">
                <label className="form-label">Nhập Loại Mới</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nhập loại sản phẩm mới..."
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  required
                />
              </div>
            )}

            <input
              type="text"
              className="form-control mb-3"
              placeholder="Xuất xứ (*)"
              value={product.origin}
              onChange={(e) => setProduct({ ...product, origin: e.target.value })}
            />
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Chất liệu (*)"
              value={product.material}
              onChange={(e) => setProduct({ ...product, material: e.target.value })}
            />
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Kích thước (*)"
              value={product.size}
              onChange={(e) => setProduct({ ...product, size: e.target.value })}
            />
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Bảo hành (*)"
              value={product.warranty}
              onChange={(e) => setProduct({ ...product, warranty: e.target.value })}
            />

            <input
              type="number"
              className="form-control mb-3"
              placeholder="Giá (*)"
              value={product.price}
              onChange={(e) => setProduct({ ...product, price: e.target.value })}
            />

            <input
              type="number"
              className="form-control mb-3"
              placeholder="Số lượng (*)"
              value={product.countInStock}
              onChange={(e) => setProduct({ ...product, countInStock: e.target.value })}
            />

            <input
              type="number"
              className="form-control mb-3"
              placeholder="Giảm giá (%)"
              value={product.discount}
              onChange={(e) => setProduct({ ...product, discount: e.target.value })}
            />

            <textarea
              className="form-control mb-3"
              placeholder="Mô tả"
              value={product.description}
              onChange={(e) => setProduct({ ...product, description: e.target.value })}
            />

            <textarea
              className="form-control mb-3"
              placeholder="Mô tả chi tiết"
              value={product.descriptionDetail}
              onChange={(e) => setProduct({ ...product, descriptionDetail: e.target.value })}
            />

            <div className="form-check mb-3 fw-bofd">
              <input
                type="checkbox"
                className="form-check-input"
                id="bestSeller"
                checked={product.isBestSeller}
                onChange={(e) => setProduct({ ...product, isBestSeller: e.target.checked })}
              />
              <label className="form-check-label" htmlFor="bestSeller">
                Sản phẩm bán chạy
              </label>
              <br></br>
              {error ? <code>{error}</code> : null}
            </div>

            <button className="btn btn-primary w-100" onClick={handleAdd} disabled={loading}>
              {loading ? "Đang xử lý..." : "Thêm"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;