import React from "react";
import { useNavigate } from "react-router-dom";

const FeaturedProducts = () => {
  const navigate = useNavigate();
  
  const products = [
    {
      title: "Sofa Sang Trọng",
      description: "Một chiếc sofa đẳng cấp cho phòng khách của bạn.",
      image: "/assets/sofa/sofa.jpg",
      route: "/sofa"
    },
    {
      title: "Bàn Ăn Hiện Đại",
      description: "Thiết kế hiện đại và tinh tế cho không gian bếp.",
      image: "/assets/ban-an/ban-an.jpg",
      route: "/ban-an"
    },
    {
      title: "Ghế Thư Giãn",
      description: "Thư giãn sau một ngày dài với chiếc ghế êm ái.",
      image: "/assets/ghe-thu-gian/ghe-thu-gian.jpg",
      route: "/ghe-thu-gian"
    }
  ];

  const handleViewDetail = (route) => {
    navigate(route);
  };

  return (
    <section className="py-5">
      <div className="container">
        <h2 className="text-center fw-bold mb-5">Sản Phẩm Nổi Bật</h2>
        <div className="row g-4">
          {products.map((product, index) => (
            <div className="col-md-4" key={index}>
              <div className="card h-100">
                <img src={product.image} className="card-img-top" alt={product.title} />
                <div className="card-body">
                  <h5 className="card-title">{product.title}</h5>
                  <p className="card-text">{product.description}</p>
                  <button className="btn btn-link text-decoration-none" onClick={() => handleViewDetail(product.route)}>
                    Xem Chi Tiết
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;