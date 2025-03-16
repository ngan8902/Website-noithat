import React, { useState } from "react";
import AddressSelector from "../AddressSelector";

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
    const [errors, setErrors] = useState({ fullname: "", phone: "" });
    const [isFullnameValid, setIsFullnameValid] = useState(false);
    const [isPhoneValid, setIsPhoneValid] = useState(false);

    // Kiểm tra tên khách hàng không chứa số
    const validateFullname = (name) => {
        return /^[A-Za-zÀ-ỹ\s]+$/.test(name.trim());
    };

    // Kiểm tra số điện thoại có đúng định dạng không
    const validatePhone = (phone) => {
        return /^(03|05|08|09)[0-9]{8}$/.test(phone);
    };

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

        if (name === "fullname") {
            const isValid = validateFullname(value);
            setIsFullnameValid(isValid);
            setErrors(prev => ({
                ...prev,
                fullname: isValid ? "" : "Tên không được chứa số hoặc ký tự đặc biệt!"
            }));

            if (!isValid) {
                setReceiver(prev => ({ ...prev, phone: "" }));
                setIsPhoneValid(false);
            }
        }
        
        if (name === "phone" && isFullnameValid) { // Chỉ cho nhập nếu tên hợp lệ
            const isValid = validatePhone(value);
            setIsPhoneValid(isValid);
            setErrors(prev => ({
                ...prev,
                phone: isValid ? "" : "Số điện thoại phải có 10 số và phải đúng định dạng!"
            }));

            if (!isValid) {
                setSelectedAddress("");
            }
        }
    };

    return (
        <div className="col-md-6">
            <h5 className="fw-bold">Thông Tin Người Nhận Hàng</h5>
            <h6 className="text-danger">
                <i> Bạn cần nhập đầy đủ thông tin và chọn phương thức thanh toán trước khi mua hàng! </i>
            </h6>
            <form>
                <div className="mb-3">
                    <label className="form-label">Họ và Tên</label>
                    <input
                        type="text"
                        className={`form-control ${errors.fullname ? "is-invalid" : ""}`}
                        placeholder="Họ và tên người nhận"
                        name="fullname"
                        value={receiver?.fullname || ""}
                        onChange={handleInputChange}
                        required
                    />
                    {errors.fullname && <div className="invalid-feedback">{errors.fullname}</div>}
                </div>

                <div className="mb-3">
                    <label className="form-label">Số Điện Thoại</label>
                    <input
                        type="tel"
                        className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                        placeholder="Số điện thoại người nhận"
                        name="phone"
                        value={receiver?.phone || ""}
                        onChange={handleInputChange}
                        disabled={!isFullnameValid}
                        required
                    />
                    {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                </div>

                <div className="mb-3">
                    <label className="form-label">Chọn Địa Chỉ</label>
                    <select 
                        className="form-select" 
                        value={selectedAddress || ""} 
                        onChange={handleAddressChange}
                        disabled={!isPhoneValid}
                    >
                        {savedAddresses.map((addr) => (
                            <option key={addr.id} value={addr.address}>{addr.address}</option>
                        ))}
                        <option value={key}>Nhập địa chỉ mới</option>
                    </select>
                </div>

                {isAddingNewAddress && <AddressSelector setNewAddress={setNewAddress} />}
            </form>
        </div>
    );
};

export default CustomerInfo;
