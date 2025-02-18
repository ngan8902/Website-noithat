import React, { useState, useEffect } from "react";

const EditProductModal = ({ product, setProducts, closeModal }) => {
  const [form, setForm] = useState(product);

  useEffect(() => {
    setForm(product);
  }, [product]);

  const handleSave = () => {
    setProducts((prev) => prev.map((p) => (p.id === product.id ? form : p)));
    closeModal();
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
            <input type="text" className="form-control mb-3" placeholder="Tên sản phẩm" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input type="number" className="form-control mb-3" placeholder="Giá" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            <input type="number" className="form-control mb-3" placeholder="Số lượng" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
            <button className="btn btn-primary w-100" onClick={handleSave}>Lưu</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;
