import React, { useState } from "react";
import AddProductModal from "./AddProductModal";
import EditProductModal from "./EditProductModal";

const ProductList = ({ products, setProducts }) => {
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalType, setModalType] = useState(null);

  const handleDelete = (id) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  const openAddModal = () => {
    setModalType("add");
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setModalType("edit");
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedProduct(null);
  };

  const filteredProducts = products.filter((p) =>
    p.id.toString().includes(search) ||
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div id="products" className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold">Danh Sách Sản Phẩm</h5>
        <button className="btn btn-primary mb-3" onClick={openAddModal}>Thêm Sản Phẩm</button>
      </div>

      <div className="input-group mt-2">
        <span className="input-group-text">
          <i className="bi bi-search"></i>
        </span>
        <input
          type="text"
          className="form-control"
          placeholder="Tìm kiếm sản phẩm theo ID hoặc tên sản phẩm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table className="table table-bordered mt-3">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Hình Ảnh</th>
            <th>Tên Sản Phẩm</th>
            <th>Giá</th>
            <th>Số Lượng</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>
                  <img src={product.image || "https://via.placeholder.com/100"} 
                  alt={product.name} 
                  style={{ width: "100px", height: "100px", objectFit: "cover" }}/>
                </td>
                <td>{product.name}</td>
                <td>{product.price} VND</td>
                <td>{product.quantity}</td>
                <td>
                  <button className="btn btn-warning btn-sm" onClick={() => openEditModal(product)}>Sửa</button>
                  <button className="btn btn-danger btn-sm ms-2" onClick={() => handleDelete(product.id)}>Xóa</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center text-muted">Không tìm thấy sản phẩm nào!</td>
            </tr>
          )}
        </tbody>
      </table>

      {modalType === "add" && <AddProductModal setProducts={setProducts} closeModal={closeModal} />}
      {modalType === "edit" && selectedProduct && <EditProductModal product={selectedProduct} setProducts={setProducts} closeModal={closeModal} />}
    </div>
  );
};

export default ProductList;
