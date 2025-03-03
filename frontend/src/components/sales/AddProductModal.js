import React, { useState } from "react";
import axios from "axios";
import useProductStore from "../../store/productStore";

const AddProductModal = ({ closeModal, refreshProducts }) => {
  const [ setError ] = useState('');
  const { addProducts, products } = useProductStore((state) => state);

  const [product, setProduct] = useState({
    name: "",
    price: "",
    image: "",
    countInStock: "",
    description:"",
    descriptionDetail: "",
    discount: "",
    type: "",
    isBestSeller: false,
    origin: "",
    material: "",
    size: "",
    warranty: ""
  });

  const [selectedCategory, setSelectedCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setSelectedCategory(value);
    if (value === "new") {
      setProduct({ ...product, type: newCategory });
    } else {
      setProduct({ ...product, type: value });
      setNewCategory("");
    }
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!product.name || !product.price || !product.image || !product.countInStock || !product.type || (!selectedCategory && !newCategory) || !product.origin || !product.material || !product.size || !product.warranty) {
      setError("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    console.log("Dữ liệu gửi lên API:", product);

    const finalCategory = selectedCategory === "new" ? newCategory : selectedCategory;

    const newProduct = {
      ...product,
      price: parseFloat(product.price),
      countInStock: parseInt(product.countInStock, 10),
      discount: parseFloat(product.discount) || 0,
      type: finalCategory,
    };

    axios
      .post(`${process.env.REACT_APP_URL_BACKEND}/product/create-product`, newProduct).then((response) => {
        console.log("Phản hồi từ server:", response);
        const { data } = response;

        if (data.status === 'OK') {
          addProducts(newProduct)
          window.location.reload()
        } else {
          setError(data.message || "Có lỗi xảy ra, vui lòng thử lại!");
          console.error('lỗi:', setError)
        }
      })
      .catch((err) => {
        console.error("Lỗi đăng ký:", err);
        setError("Không thể kết nối với server. Vui lòng thử lại!");
      });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProduct({ ...product, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
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
              Ảnh sản phẩm
              <input type="file" className="form-control mb-3" accept="image/*" onChange={handleFileChange} />
            </label>
            {product.image && (
              <img
                src={product.image}
                alt="Product"
                style={{ width: "100px", height: "100px", objectFit: "cover", marginBottom: "10px" }}
                className="m-3"
              />
            )}

            <input
              type="text"
              className="form-control mb-3"
              placeholder="Tên sản phẩm"
              value={product.name}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
            />

            <div className="mb-3">
              <label className="form-label fw-bold">Loại Sản Phẩm</label>
              <select
                className="form-select"
                value={selectedCategory}
                onChange={handleCategoryChange}
                required
              >
               <option value="">-- Chọn loại sản phẩm --</option>
                {[...new Set(products.map((productItem) => productItem.type))].map((type, index) => (
                  <option key={index} value={type}>{type}</option>
                ))}
                <option value="new">+ Thêm loại mới</option>
              </select>
            </div>

            {selectedCategory === "new" && (
              <div className="mb-3">
                <label className="form-label fw-bold">Nhập Loại Mới</label>
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

            <input type="text" className="form-control mb-3" placeholder="Xuất xứ" value={product.origin} onChange={(e) => setProduct({ ...product, origin: e.target.value })} />
            <input type="text" className="form-control mb-3" placeholder="Chất liệu" value={product.material} onChange={(e) => setProduct({ ...product, material: e.target.value })} />
            <input type="text" className="form-control mb-3" placeholder="Kích thước" value={product.size} onChange={(e) => setProduct({ ...product, size: e.target.value })} />
            <input type="text" className="form-control mb-3" placeholder="Bảo hành" value={product.warranty} onChange={(e) => setProduct({ ...product, warranty: e.target.value })} />

            <input
              type="number"
              className="form-control mb-3"
              placeholder="Giá"
              value={product.price}
              onChange={(e) => setProduct({ ...product, price: e.target.value })}
            />

            <input
              type="number"
              className="form-control mb-3"
              placeholder="Số lượng"
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

            <div className="form-check mb-3">
              <input
                type="checkbox"
                className="form-check-input"
                id="bestSeller"
                checked={product.isBestSeller}
                onChange={(e) => setProduct({ ...product, isBestSeller: e.target.checked })}
              />
              <label className="form-check-label" htmlFor="bestSeller">Sản phẩm bán chạy</label>
            </div>

            <button className="btn btn-primary w-100" onClick={handleAdd}>
              Thêm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;
