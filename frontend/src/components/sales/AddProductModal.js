import React, { useState } from "react";

const AddProductModal = ({ setProducts, closeModal }) => {
  const [form, setForm] = useState({ name: "", price: "", quantity: "" });

  const handleAdd = () => {
    setProducts((prev) => [
      ...prev,
      { ...form, id: prev.length ? Math.max(...prev.map(p => p.id)) + 1 : 1 },
    ]);
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
            <input type="text" className="form-control mb-3" placeholder="Tên sản phẩm" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input type="number" className="form-control mb-3" placeholder="Giá" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            <input type="number" className="form-control mb-3" placeholder="Số lượng" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
            <button className="btn btn-primary w-100" onClick={handleAdd}>Thêm</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;
