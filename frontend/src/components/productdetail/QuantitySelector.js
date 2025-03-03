const QuantitySelector = ({ quantity, increaseQuantity, decreaseQuantity }) => {
    return (
        <div className="d-flex align-items-center my-3">
            <p className="me-3">Chọn số lượng</p>
            <button 
                className="btn btn-outline-dark" 
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
            >
                -
            </button>
            <span className="mx-3">{quantity}</span>
            <button 
                className="btn btn-outline-dark" 
                onClick={increaseQuantity}
            >
                +
            </button>
        </div>
    );
};

export default QuantitySelector;
