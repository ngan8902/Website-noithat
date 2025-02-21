const ProductImage = ({ image, name }) => {
    return (
        <div className="col-md-6 mb-4 d-flex align-items-center justify-content-center">
            <img 
                src={image || "https://via.placeholder.com/500"} 
                className="img-fluid rounded product-image" 
                alt={name} 
            />
        </div>
    );
};

export default ProductImage;
