import React, { useState } from "react";

const key = "BGHUSY73645";

const CustomerInfo = ({
    hasAddress,
    savedAddresses,
    selectedAddress,
    setSelectedAddress,
    newAddress, 
    setNewAddress,
    receiver, 
    setReceiver
}) => {
    const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
   
    const handleAddressChange = (e) => {
        const value = e.target.value;
        if (value === key) {
            setIsAddingNewAddress(true);
            setSelectedAddress("");
            setNewAddress("");
        } else {
            setIsAddingNewAddress(false);
            setSelectedAddress(value);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setReceiver(prev => ({ ...prev, [name]: value }));
    };
    return (
        <div className="col-md-6">
            <h5 className="fw-bold">Thông Tin Người Nhận Hàng</h5>
            <h6 className="text-danger"> <i> Bạn cần nhập đầy đủ thông tin và chọn phương thức thanh toán trước khi mua hàng! </i></h6>
            <form>
                <div className="mb-3">
                    <label className="form-label">Họ và Tên</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Họ và tên người nhận"
                        name="fullname"
                        value={receiver?.fullname || ""}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Số Điện Thoại</label>
                    <input
                        type="tel"
                        className="form-control"
                        placeholder="Số điện thoại người nhận"
                        name="phone"
                        value={receiver?.phone || ""}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Chọn Địa Chỉ</label>
                    <select className="form-select" value={selectedAddress || ""} onChange={handleAddressChange}>
                        {savedAddresses.map((addr) => (
                            <option key={addr.id} value={addr.address}>{addr.address}</option>
                        ))}
                        <option value={key}>Nhập địa chỉ mới</option>
                    </select>
                </div>

                {isAddingNewAddress && (
                    <div className="mb-3">
                        <label className="form-label">Thêm Địa Chỉ Mới</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Nhập địa chỉ mới"
                            value={newAddress || ""}
                            onChange={(e) => setNewAddress(e.target.value)}
                        />
                    </div>
                )}
            </form>
        </div>
    );
};

export default CustomerInfo;
