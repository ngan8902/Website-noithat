import React, { useState } from "react";

const CustomerInfo = ({ hasAddress, savedAddresses, selectedAddress, setSelectedAddress, newAddress, setNewAddress }) => {
    const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);

    const handleAddressChange = (e) => {
        const value = e.target.value;
        setSelectedAddress(value);
        setIsAddingNewAddress(value === "");
    };

    return (
        <div className="col-md-6">
            <h5 className="fw-bold">Thông Tin Khách Hàng</h5>
            <form>
                <div className="mb-3">
                    <label className="form-label">Họ và Tên</label>
                    <input type="text" className="form-control" value="" readOnly />
                </div>
                <div className="mb-3">
                    <label className="form-label">Số Điện Thoại</label>
                    <input type="tel" className="form-control" value="" readOnly />
                </div>
                <div className="mb-3">
                    <label className="form-label">Chọn Địa Chỉ</label>
                    {hasAddress ? (
                        <select className="form-select" value={selectedAddress} onChange={handleAddressChange}>
                            {savedAddresses.map((addr) => (
                                <option key={addr.id} value={addr.address}>{addr.address}</option>
                            ))}
                            <option value="">Nhập địa chỉ mới</option>
                        </select>
                    ) : (
                        <p className="text-danger">Bạn chưa có địa chỉ, vui lòng nhập địa chỉ mới!</p>
                    )}
                </div>

                {isAddingNewAddress && (
                    <div className="mb-3">
                        <label className="form-label">Thêm Địa Chỉ Mới</label>
                        <input
                            type="text"
                            className="form-control"
                            value={newAddress}
                            onChange={(e) => setNewAddress(e.target.value)}
                            required
                        />
                    </div>
                )}
            </form>
        </div>
    );
};

export default CustomerInfo;
