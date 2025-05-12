import React, { useEffect, useState } from "react";
import AddProductModal from "./AddProductModal";
import EditProductModal from "./EditProductModal";
import useProductStore from "../../store/productStore";
import { UPLOAD_URL } from '../../constants/url.constant';

const ProductList = () => {
  const { getProducts, products, removeProduct } = useProductStore((state) => state);
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalType, setModalType] = useState(null);

  console.log(products)
  const removeVietnameseTones = (str) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .toLowerCase();
  };

  useEffect(() => {
    getProducts();

    const interval = setInterval(() => {
      getProducts();
    }, 2000);

    return () => clearInterval(interval);
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

  const filteredProducts = products.filter((product) => {
    const searchText = removeVietnameseTones(search);
    const productName = removeVietnameseTones(product?.name || "");
    const productCode = removeVietnameseTones(product?.productCode || "");
    return productName.includes(searchText) || productCode.includes(searchText);
  });

  const getImageUrl = (image) => {
    if (!image) return "";

    // Nếu là link Google Drive
    if (image.includes("drive.google.com")) {
      const match = image.match(/id=([a-zA-Z0-9_-]+)/);
      const idFromViewLink = image.match(/\/d\/(.*?)\//);
      const id = match ? match[1] : idFromViewLink ? idFromViewLink[1] : null;

      if (id) {
        return `https://drive.google.com/uc?id=${id}`;
      }
    }

    // Nếu là link https bình thường
    if (image.startsWith("https://")) {
      return image;
    }

    // Nếu là file local trên server
    return `${UPLOAD_URL}${image}`;
  };



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

      {products.length <= 0 ? (
        <span className="dots"></span>
      ) : (
        <div
          style={{
            border: "1px solid #ddd",
            maxHeight: "450px",
            overflowY: "auto",
            overflowX: "auto",
          }}
          className="hide-scrollbar"
        >
          <table className="table table-bordered mt-3" style={{ minWidth: "1000px" }}>
            <thead className="table-dark" style={{ textAlign: "center", verticalAlign: "middle" }}>
              <tr>
                <th style={{ width: "10%" }}>ID</th>
                <th style={{ width: "10%" }}>Hình Ảnh</th>
                <th style={{ width: "30%" }}>Tên Sản Phẩm</th>
                <th style={{ width: "10%" }}>Giá</th>
                <th style={{ width: "10%" }}>Số Lượng</th>
                <th style={{ width: "10%" }}>Mức Giảm Giá</th>
                <th style={{ width: "15%" }}>Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => {
                return (
                  <tr key={product._id}>
                    <td>{product.productCode || ""}</td>
                    <td>
                      <img
                        src={getImageUrl(product?.image)}
                        alt={product.name}
                        style={{ width: "100px", height: "100px", objectFit: "cover" }}
                      />
                    </td>
                    <td>{product.name}</td>
                    <td>{product.price} VND</td>
                    <td>{product.countInStock}</td>
                    <td>{product.discount} %</td>
                    <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                      <button className="btn btn-warning btn-sm" onClick={() => openEditModal(product)}>Sửa</button>
                      <button className="btn btn-danger btn-sm ms-2" onClick={() => handleDelete(product._id)}>Xóa</button>
                    </td>
                  </tr>
                );
              })}

            </tbody>
          </table>
        </div>
      )}

      {modalType === "add" && <AddProductModal closeModal={closeModal} refreshProducts={getProducts} />}
      {modalType === "edit" && selectedProduct && <EditProductModal product={selectedProduct} closeModal={closeModal} />}
    </div>
  );
};

export default ProductList;
