import React, { useState, useEffect } from "react";
import axios from 'axios';


const CustomerInfo = ({ hasAddress, savedAddresses, selectedAddress, setSelectedAddress, newAddress, setNewAddress }) => {
    const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
    const [receiver, setReceiver] = useState({
        fullName: "",
        phone: "",
        address: "",
    });

    // Xử lý khi chọn địa chỉ có sẵn hoặc nhập địa chỉ mới
    const handleAddressChange = (e) => {
        const value = e.target.value;
        setSelectedAddress(value);
        setIsAddingNewAddress(value === "");

        if (value !== "") {
            const selected = savedAddresses.find(addr => addr.address === value);
            if (selected) {
                setReceiver(selected);
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setReceiver(prev => ({ ...prev, [name]: value }));
    };

    const saveNewAddress = async (receiver) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_URL_BACKEND}/address/save-new-address`, {
                fullName: receiver.fullName || "Khách vãng lai",
                phone: receiver.phone || "Chưa cung cấp",
                address: receiver.address,
                userId: receiver.userId || null
            });

            if (response.status === 201) {
                console.log("Địa chỉ mới đã được lưu:", response.data);
            }
        } catch (error) {
            console.error("Lỗi khi lưu địa chỉ mới:", error);
        }
    };

    useEffect(() => {
        if (isAddingNewAddress && receiver.address.trim() !== "") {
            console.log("Gửi API để lưu địa chỉ mới:", receiver.address);
            saveNewAddress(receiver);
        }
    }, [isAddingNewAddress, receiver]);// [receiver.address]);


    return (
        <div className="col-md-6">
            <h5 className="fw-bold">Thông Tin Người Nhận Hàng</h5>
            <h6 className="text-danger"> <i> Bạn cần nhập đầy đủ thông tin và chọn phương thức thanh toán trước khi mua hàng! </i></h6>
            <form>
                <div className="mb-3">
                    <label className="form-label">Họ và Tên</label>
                    <input type="text"
                        className="form-control"
                        placeholder="Họ và tên người nhận"
                        name="fullName"
                        value={receiver.fullName}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Số Điện Thoại</label>
                    <input type="tel"
                        className="form-control"
                        placeholder="Số điện thoại người nhận"
                        name="phone"
                        value={receiver.phone}
                        onChange={handleInputChange}
                        required
                    />
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
                            placeholder="Địa chỉ mới"
                            name="address"
                            value={receiver.address}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                )}
            </form>
        </div>
    );
};

export default CustomerInfo;
