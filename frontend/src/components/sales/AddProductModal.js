import React, { useState } from "react";
import useProductStore from "../../store/productStore";

const AddProductModal = ({ setProducts, closeModal }) => {
  const [form, setForm] = useState({ name: "", price: "", quantity: "" });
  const { addProducts } = useProductStore();

  const handleAdd = () => {
    if (!form.name || !form.price || !form.quantity) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    const newProduct = {
      name: form.name,
      price: parseFloat(form.price),
      quantity: parseInt(form.quantity, 10),
    };

    addProducts(newProduct);
    closeModal();
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
              <input type="file" className="form-control mb-3" onChange={handleFileChange}/>
            </label>
            {form.image && <img 
              src={form.image} 
              alt="Product" 
              style={{ width: "100px", height: "100px", objectFit: "cover", marginBottom: "10px" }} 
              className="m-3"
            />}
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
