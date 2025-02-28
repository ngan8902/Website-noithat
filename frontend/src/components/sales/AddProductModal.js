import React, { useState } from "react";
import useProductStore from "../../store/productStore";

const AddProductModal = ({ setProducts, closeModal }) => {
  const [form, setForm] = useState({
    image: "",
    name: "",
    type: "",
    price: "",
    quantity: "",
    discount: "",
  });

  const { addProducts } = useProductStore();

  const categories = ["Sofa", "Bàn ăn", "Ghế"];
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setForm({ ...form, type: e.target.value });
    if (e.target.value !== "new") {
      setNewCategory("");
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

  const handleAdd = () => {
    if (!form.name || !form.price || !form.quantity || (!selectedCategory && !newCategory)) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    const finalCategory = selectedCategory === "new" ? newCategory : selectedCategory;

    const newProduct = {
      ...form,
      price: parseFloat(form.price),
      quantity: parseInt(form.quantity, 10),
      discount: parseFloat(form.discount) || 0,
      type: finalCategory,
    };

    addProducts(newProduct);
    closeModal();
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
            {form.image && (
              <img
                src={form.image}
                alt="Product"
                style={{ width: "100px", height: "100px", objectFit: "cover", marginBottom: "10px" }}
                className="m-3"
              />
            )}

            <input
              type="text"
              className="form-control mb-3"
              placeholder="Tên sản phẩm"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
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
                {categories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
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

            <input
              type="number"
              className="form-control mb-3"
              placeholder="Giá"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />

            <input
              type="number"
              className="form-control mb-3"
              placeholder="Số lượng"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            />

            <input
              type="number"
              className="form-control mb-3"
              placeholder="Giảm giá (%)"
              value={form.discount}
              onChange={(e) => setForm({ ...form, discount: e.target.value })}
            />

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
