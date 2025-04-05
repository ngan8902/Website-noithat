import { useState } from "react";

const ProductImage = ({ image, name }) => {
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="col-md-6 mb-4 d-flex align-items-center justify-content-center">
            <img 
                src={image}
                alt={name}
                className="product-image"
                onClick={() => setShowModal(true)}
                style={{ cursor: "pointer" }}
            />

            {showModal && (
                <div className="avatar-modal" onClick={() => setShowModal(false)}>
                    <div className="avatar-modal-content">
                        <span className="close" onClick={() => setShowModal(false)}>
                        <i className="bi bi-x-circle-fill"></i>
                        </span>
                        <img src={image} alt={name} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductImage;
