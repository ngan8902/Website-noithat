import React, { useState, useEffect } from "react";
import axios from "axios";

const AddressSelector = ({ setNewAddress, savedAddress }) => { 
    const removeDiacritics = (str) => {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    };

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const [provinceInput, setProvinceInput] = useState("");
    const [districtInput, setDistrictInput] = useState("");
    const [wardInput, setWardInput] = useState("");

    const [provinceSuggestions, setProvinceSuggestions] = useState([]);
    const [districtSuggestions, setDistrictSuggestions] = useState([]);
    const [wardSuggestions, setWardSuggestions] = useState([]);

    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedWard, setSelectedWard] = useState("");

    const [street, setStreet] = useState("");
    const [houseNumber, setHouseNumber] = useState("");
    const [selectedAddressText, setSelectedAddressText] = useState("");

    // Lấy danh sách tỉnh/thành phố
    useEffect(() => {
        axios.get("https://provinces.open-api.vn/api/?depth=1")
            .then(response => setProvinces(response.data))
            .catch(error => console.error("Lỗi khi lấy danh sách tỉnh/thành phố:", error));
    }, []);

    // Xử lý nhập tỉnh/thành phố
    const handleProvinceChange = (e) => {
        const value = e.target.value;
        setProvinceInput(value);
        const normalizedValue = removeDiacritics(value);

        const found = provinces.find(p => removeDiacritics(p.name).includes(normalizedValue));
        setSelectedProvince(found ? found.code : value);
        setProvinceSuggestions(provinces.filter(p => removeDiacritics(p.name).includes(normalizedValue)));
    };

    const handleSelectProvince = (province) => {
        setProvinceInput(province.name);
        setSelectedProvince(province.code);
        setProvinceSuggestions([]);
    };

    // Khi chọn tỉnh, lấy danh sách quận/huyện
    useEffect(() => {
        if (selectedProvince && typeof selectedProvince === "number") {
            axios.get(`https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`)
                .then(response => setDistricts(response.data.districts))
                .catch(error => console.error("Lỗi khi lấy danh sách quận/huyện:", error));
        } else {
            setDistricts([]);
            setWards([]);
        }
    }, [selectedProvince]);

    // Xử lý nhập quận/huyện
    const handleDistrictChange = (e) => {
        const value = e.target.value;
        setDistrictInput(value);
        const normalizedValue = removeDiacritics(value);
        const found = districts.find(d => removeDiacritics(d.name).includes(normalizedValue));
        setSelectedDistrict(found ? found.code : value);
        setDistrictSuggestions(districts.filter(d => removeDiacritics(d.name).includes(normalizedValue)));
    };

    const handleSelectDistrict = (district) => {
        setDistrictInput(district.name);
        setSelectedDistrict(district.code);
        setDistrictSuggestions([]);
    };

    // Khi chọn quận, lấy danh sách phường/xã
    useEffect(() => {
        if (selectedDistrict && typeof selectedDistrict === "number") {
            axios.get(`https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`)
                .then(response => setWards(response.data.wards))
                .catch(error => console.error("Lỗi khi lấy danh sách phường/xã:", error));
        } else {
            setWards([]);
        }
    }, [selectedDistrict]);

    // Xử lý nhập phường/xã
    const handleWardChange = (e) => {
        const value = e.target.value;
        setWardInput(value);
        const normalizedValue = removeDiacritics(value);
        const found = wards.find(w => removeDiacritics(w.name).includes(normalizedValue));
        setSelectedWard(found ? found.code : value);
        setWardSuggestions(wards.filter(w => removeDiacritics(w.name).includes(normalizedValue)));
    };

    const handleSelectWard = (ward) => {
        setWardInput(ward.name);
        setSelectedWard(ward.code);
        setWardSuggestions([]);
    };

    // Cập nhật địa chỉ hiển thị
    useEffect(() => {
        if (savedAddress) { 
            const parts = savedAddress.split(", ");
            setHouseNumber(parts[0] || "");
            setStreet(parts[1] || "");

            // Tìm và đặt tỉnh
            const provinceName = parts[parts.length - 1]; 
            const foundProvince = provinces.find(p => p.name === provinceName);
            if (foundProvince) {
                setProvinceInput(foundProvince.name);
                setSelectedProvince(foundProvince.code);
            }

            // Tìm và đặt huyện
            const districtName = parts[parts.length - 2];
            const foundDistrict = districts.find(d => d.name === districtName);
            if (foundDistrict) {
                setDistrictInput(foundDistrict.name);
                setSelectedDistrict(foundDistrict.code);
            }

            // Tìm và đặt xã
            const wardName = parts[parts.length - 3]; 
            const foundWard = wards.find(w => w.name === wardName);
            if (foundWard) {
                setWardInput(foundWard.name);
                setSelectedWard(foundWard.code);
            }
            setSelectedAddressText(savedAddress);
            setNewAddress(savedAddress);
        } else {
            const provinceName = provinces.find(p => p.code === selectedProvince)?.name || (typeof selectedProvince === "string" ? selectedProvince : "");
            const districtName = districts.find(d => d.code === selectedDistrict)?.name || (typeof selectedDistrict === "string" ? selectedDistrict : "");
            const wardName = wards.find(w => w.code === selectedWard)?.name || (typeof selectedWard === "string" ? selectedWard : "");

            const fullAddress = `${houseNumber ? houseNumber + ", " : ""}${street ? street + ", " : ""}${wardName ? wardName + ", " : ""}${districtName ? districtName + ", " : ""}${provinceName}`;
            setSelectedAddressText(fullAddress);
            setNewAddress(fullAddress);
        }
    }, [selectedProvince, selectedDistrict, selectedWard, street, houseNumber, provinces, districts, wards, setNewAddress, savedAddress]);

    return (
        <div>
            <div className="alert alert-info mt-3">
                <strong>Địa chỉ:</strong> {selectedAddressText || "Chưa hoàn thành"}
            </div>

            <InputField label="Tỉnh/Thành phố" value={provinceInput} onChange={handleProvinceChange} suggestions={provinceSuggestions} onSelect={handleSelectProvince} />
            <InputField label="Quận/Huyện" value={districtInput} onChange={handleDistrictChange} suggestions={districtSuggestions} onSelect={handleSelectDistrict} disabled={!selectedProvince} />
            <InputField label="Phường/Xã" value={wardInput} onChange={handleWardChange} suggestions={wardSuggestions} onSelect={handleSelectWard} disabled={!selectedDistrict} />

            <div className="mb-3">
                <label className="form-label fw-bold">Tên Đường</label>
                <input type="text" className="form-control" value={street} onChange={(e) => setStreet(e.target.value)} disabled={!selectedWard} />
            </div>

            <div className="mb-3">
                <label className="form-label fw-bold">Số Nhà</label>
                <input type="text" className="form-control" value={houseNumber} onChange={(e) => setHouseNumber(e.target.value)} disabled={!street} />
            </div>
        </div>
    );
};

const InputField = ({ label, value, onChange, suggestions, onSelect, disabled }) => (
    <div className="mb-3 position-relative">
        <label className="form-label fw-bold">{label}</label>
        <input type="text" className="form-control" value={value} onChange={onChange} disabled={disabled} />
        {suggestions.length > 0 && (
            <ul className="list-group mt-1">
                {suggestions.map(item => (
                    <li key={item.code} className="list-group-item list-group-item-action" onClick={() => onSelect(item)}>
                        {item.name}
                    </li>
                ))}
            </ul>
        )}
    </div>
);

export default AddressSelector;