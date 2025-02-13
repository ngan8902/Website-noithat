const SidebarFilter = () => {
    return (
        <div className="col-md-3 mb-4">
            <h5 className="fw-bold">Bộ Lọc</h5>
            <form>
                <div className="mb-3">
                    <label htmlFor="priceRange" className="form-label">Khoảng Giá</label>
                    <select className="form-select" id="priceRange">
                        <option value="">Chọn khoảng giá</option>
                        <option value="1">Dưới 5,000,000 VND</option>
                        <option value="2">5,000,000 - 10,000,000 VND</option>
                        <option value="3">10,000,000 - 15,000,000 VND</option>
                        <option value="4">Trên 15,000,000 VND</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="materialSelect" className="form-label">Chất Liệu</label>
                    <select className="form-select" id="materialSelect">
                        <option value="">Chọn chất liệu</option>
                        <option value="leather">Da</option>
                        <option value="fabric">Vải</option>
                        <option value="wood">Gỗ</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-dark w-100">Áp Dụng</button>
            </form>
        </div>
    );
};

export default SidebarFilter;
