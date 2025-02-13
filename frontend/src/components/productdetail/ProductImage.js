const ProductImage = ({ image, name }) => {
    return (
        <div className="col-md-6 mb-4">
            <img 
                src={image || "https://via.placeholder.com/500"} 
                className="img-fluid rounded shadow" 
                alt={name} 
            />
        </div>
    );
};

export default ProductImage;
