import React, { useState, useEffect } from "react";
import useProductStore from "../../store/productStore";
import axios from "axios"
import { getCookie } from "../../utils/cookie.util";
import { STAFF_TOKEN_KEY } from "../../constants/authen.constant";

const EditProductModal = ({ product, closeModal }) => {
  const [form, setForm] = useState({
    name: '',
    price: '',
    countInStock: '',
    image: ''
  });
  const { setProducts } = useProductStore((state) => state)
  const [, setErrorMessage] = useState("");


  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || '',
        price: product.price || '',
        countInStock: product.countInStock || '',
        image: product.image || ''
      });
    }
  }, [product]);


  // const handleSave = async () => {
  //   if (!products || !products._id) {
  //     console.log("Không tìm thấy sản phẩm");
  //     return;
  //   }

  //   try {
  //     const updatedData = {
  //       name: form.name,
  //       email: form.email,
  //       phone: form.phone,
  //     };

  //     const response = await axios.put(
  //       `${process.env.REACT_APP_URL_BACKEND}/product/update-product/${products._id}`);

  //     console.log("Cập nhật thành công:", response.data);
  //     setProducts(response.data.data);
  //     closeModal();
  //     setErrorMessage("Cập nhật sản phẩm thành công!");
  //   } catch (error) {
  //     console.error("Lỗi cập nhật thông tin:", error);
  //     setErrorMessage("Có lỗi xảy ra khi cập nhật. Vui lòng thử lại!");
  //   }
  // };

  const handleSave = async () => {
    if (!product || !product._id) {
      console.log("Không tìm thấy sản phẩm");
      return;
    }

    try {
      const updatedData = {
        name: form.name,
        price: form.price,
        countInStock: form.countInStock,
        image: form.image || ''
      };

      const response = await axios.put(
        `${process.env.REACT_APP_URL_BACKEND}/product/update-product/${product._id}`,
        updatedData, {
        headers: {
          'staff-token': getCookie(STAFF_TOKEN_KEY)
        }
      }
      );
      window.location.reload()
      console.log("Cập nhật thành công:", response.data);
      setProducts((prevProducts) =>
        prevProducts.map((p) =>
          p._id === product._id ? response.data.data : p
        )
      );
    } catch (error) {
      console.error("Lỗi cập nhật thông tin:", error);
      setErrorMessage("Có lỗi xảy ra khi cập nhật. Vui lòng thử lại!");
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

  return (
    <div className="modal fade show d-block" id="editProductModal">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Sửa Sản Phẩm</h5>
            <button type="button" className="btn-close" onClick={closeModal}></button>
          </div>
          <div className="modal-body">
            <label className="form-label">
              Đổi ảnh sản phẩm
              <input type="file" className="form-control mb-3" onChange={handleFileChange} />
            </label>
            {form.image && <img
              src={form.image}
              alt="Product"
              style={{ width: "100px", height: "100px", objectFit: "cover", marginBottom: "10px" }}
            />}
            <input type="text" className="form-control mb-3" placeholder="Tên sản phẩm" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input type="number" className="form-control mb-3" placeholder="Giá" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            <input type="number" className="form-control mb-3" placeholder="Số lượng" value={form.countInStock} onChange={(e) => setForm({ ...form, countInStock: e.target.value })} />
            <button className="btn btn-primary w-100" onClick={handleSave}>Lưu</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;
