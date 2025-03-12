import React, { useState } from "react";
import AddProductModal from "./AddProductModal";
import EditProductModal from "./EditProductModal";
import useProductStore from "../../store/productStore";

const ProductList = () => {
  const { getProducts, products, removeProduct } = useProductStore((state) => state);
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalType, setModalType] = useState(null);

  const handleDelete = (_id) => {
    removeProduct(_id);
    window.location.reload()
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
          id="searchProduct"
          name="searchProduct"
          placeholder="Tìm kiếm sản phẩm theo ID hoặc tên sản phẩm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div
        style={{
          maxHeight: products.length > 4 ? "400px" : "auto",
          overflowY: products.length > 4 ? "auto" : "visible",
          border: "1px solid #ddd",
          borderRadius: "5px",
          marginTop: "10px",
        }}
      >
        <table className="table table-bordered mt-3">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Hình Ảnh</th>
              <th>Tên Sản Phẩm</th>
              <th>Giá</th>
              <th>Số Lượng</th>
              <th>Mức Giảm Giá</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {products && products.length > 0 ? (
              products.filter(product => 
                product.name.toLowerCase().includes(search.toLowerCase()) || 
                product.productCode.toLowerCase().includes(search.toLowerCase())
              ).map((product) => (
                <tr key={product._id} >
                  <td>{product.productCode || ""}</td>
                  <td>
                    <img src={product.image || "https://via.placeholder.com/100"}
                      alt={product.name}
                      style={{ width: "100px", height: "100px", objectFit: "cover" }} />
                  </td>
                  <td>{product.name}</td>
                  <td>{product.price} VND</td>
                  <td>{product.countInStock}</td>
                  <td>{product.discount} %</td>
                  <td>
                    <button className="btn btn-warning btn-sm" onClick={() => openEditModal(product)}>Sửa</button>
                    <button className="btn btn-danger btn-sm ms-2" onClick={() => handleDelete(product._id)}>Xóa</button>
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
      </div>

      {modalType === "add" && <AddProductModal closeModal={closeModal} refreshProducts={getProducts} />}
      {modalType === "edit" && selectedProduct && <EditProductModal product={selectedProduct} closeModal={closeModal} />}

    </div>
  );
};

export default ProductList;
