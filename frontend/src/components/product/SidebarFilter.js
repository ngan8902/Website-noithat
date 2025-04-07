import { useState } from "react";

const SidebarFilter = ({onFilterApply}) => {
    const [priceRange, setPriceRange] = useState("");
    const [rating, setRating] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        onFilterApply({ priceRange, rating });
    };

    return (
        <div className="col-md-3 mb-4">
            <h5 className="fw-bold">Bộ Lọc</h5>
            <form>
                <div className="mb-3">
                    <label htmlFor="priceRange" className="form-label">Khoảng Giá</label>
                    <select className="form-select" id="priceRange" value={priceRange} onChange={(e) => setPriceRange(e.target.value)}>
                        <option value="">Chọn khoảng giá</option>
                        <option value="1">Dưới 5,000,000 VND</option>
                        <option value="2">5,000,000 - 10,000,000 VND</option>
                        <option value="3">10,000,000 - 15,000,000 VND</option>
                        <option value="4">Trên 15,000,000 VND</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="rateSelect" className="form-label">Đánh Giá</label>
                    <select className="form-select" id="rateSelect" value={rating} onChange={(e) => setRating(e.target.value)}>
                        <option value="">Chọn đánh giá</option>
                        <option value="5">★★★★★</option>
                        <option value="4">★★★★☆</option>
                        <option value="3">★★★☆☆</option>
                    </select>
                </div>

                <button type="submit" className="btn btn-dark w-100" onClick={handleSubmit}>Áp Dụng</button>
            </form>
        </div>
    );
};

export default SidebarFilter;
