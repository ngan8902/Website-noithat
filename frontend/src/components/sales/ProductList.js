import React, { useEffect, useState } from "react";
import AddProductModal from "./AddProductModal";
import EditProductModal from "./EditProductModal";
import useProductStore from "../../store/productStore";

const ProductList = () => {
  const { getProducts, products, removeProduct } = useProductStore((state) => state);
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalType, setModalType] = useState(null);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  const handleDelete = async (_id) => {
    await removeProduct(_id);
    getProducts();
  };

  const openAddModal = () => setModalType("add");
  const openEditModal = (product) => {
    setSelectedProduct(product);
    setModalType("edit");
  };
  const closeModal = () => {
    setModalType(null);
    setSelectedProduct(null);
  };

  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(search.toLowerCase()) ||
    product.productCode?.toLowerCase().includes(search.toLowerCase())
  );

  console.log("Danh sách sản phẩm:", products);
  console.log("Sản phẩm sau khi lọc:", filteredProducts);

  return (
    <div id="products" className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold">Danh Sách Sản Phẩm</h5>
        <button className="btn btn-primary mb-3" onClick={openAddModal}>Thêm Sản Phẩm</button>
      </div>

      <div className="input-group mt-2">
        <span className="input-group-text"><i className="bi bi-search"></i></span>
        <input
          type="text"
          className="form-control"
          placeholder="Tìm kiếm sản phẩm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div style={{ border: "1px solid #ddd", maxHeight: "450px", overflow: "hidden" }}>
        <table className="table table-bordered mt-3">
          <thead className="table-dark" style={{ textAlign: "center", verticalAlign: "middle" }}>
            <tr>
              <th style={{ width: "10%" }}>ID</th>
              <th style={{ width: "8%" }}>Hình Ảnh</th>
              <th style={{ width: "30%" }}>Tên Sản Phẩm</th>
              <th style={{ width: "10%" }}>Giá</th>
              <th style={{ width: "10%" }}>Số Lượng</th>
              <th style={{ width: "10%" }}>Mức Giảm Giá</th>
              <th style={{ width: "15%" }}>Hành Động</th>
            </tr>
          </thead>
        </table>

        <div
          style={{
            maxHeight: "350px",
            overflowY: "auto",
            overflowX: "none",
            scrollbarWidth: "none",
            msOverflowStyle: "none"
          }}
          className="hide-scrollbar"
        >
          <table className="table table-bordered">
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product._id}>
                  <td style={{ width: "10%" }}>{product.productCode || ""}</td>
                  <td style={{ width: "8%" }}>
                    <img
                      src={product.image || "https://via.placeholder.com/100"}
                      alt={product.name}
                      style={{ width: "100px", height: "100px", objectFit: "cover" }}
                    />
                  </td>
                  <td style={{ width: "30%" }}>{product.name}</td>
                  <td style={{ width: "10%" }}>{product.price} VND</td>
                  <td style={{ width: "10%" }}>{product.countInStock}</td>
                  <td style={{ width: "10%" }}>{product.discount} %</td>
                  <td style={{ width: "15%", textAlign: "center", verticalAlign: "middle" }}>
                    <button className="btn btn-warning btn-sm" onClick={() => openEditModal(product)}>Sửa</button>
                    <button className="btn btn-danger btn-sm ms-2" onClick={() => handleDelete(product._id)}>Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {modalType === "add" && <AddProductModal closeModal={closeModal} refreshProducts={getProducts} />}
      {modalType === "edit" && selectedProduct && <EditProductModal product={selectedProduct} closeModal={closeModal} />}
    </div>
  );
};

export default ProductList;
