import React, { useState, useEffect } from "react";
import axios from "axios";

const AddressSelector = ({ setNewAddress }) => {
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
    const [streetSuggestions, setStreetSuggestions] = useState([]);
    const [houseNumber, setHouseNumber] = useState("");

    const [selectedAddressText, setSelectedAddressText] = useState("");

    // Lấy danh sách tỉnh/thành phố
    useEffect(() => {
        axios.get("https://provinces.open-api.vn/api/?depth=1")
            .then(response => setProvinces(response.data))
            .catch(error => console.error("Lỗi khi lấy danh sách tỉnh/thành phố:", error));
    }, []);

    // Khi nhập tỉnh/thành phố, tìm kiếm gợi ý
    useEffect(() => {
        if (provinceInput.length >= 1) {
            setProvinceSuggestions(
                provinces.filter(province => province.name.toLowerCase().includes(provinceInput.toLowerCase()))
            );
        } else {
            setProvinceSuggestions([]);
        }
    }, [provinceInput, provinces]);

    // Khi chọn tỉnh/thành phố, lấy danh sách quận/huyện
    useEffect(() => {
        if (selectedProvince) {
            axios.get(`https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`)
                .then(response => setDistricts(response.data.districts))
                .catch(error => console.error("Lỗi khi lấy danh sách quận/huyện:", error));
        } else {
            setDistricts([]);
            setWards([]);
        }
    }, [selectedProvince]);

    // Khi nhập quận/huyện, tìm kiếm gợi ý
    useEffect(() => {
        if (districtInput.length > 1) {
            setDistrictSuggestions(
                districts.filter(district => district.name.toLowerCase().includes(districtInput.toLowerCase()))
            );
        } else {
            setDistrictSuggestions([]);
        }
    }, [districtInput, districts]);

    // Khi chọn quận/huyện, lấy danh sách phường/xã
    useEffect(() => {
        if (selectedDistrict) {
            axios.get(`https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`)
                .then(response => setWards(response.data.wards))
                .catch(error => console.error("Lỗi khi lấy danh sách phường/xã:", error));
        } else {
            setWards([]);
        }
    }, [selectedDistrict]);

    // Khi nhập phường/xã, tìm kiếm gợi ý
    useEffect(() => {
        if (wardInput.length > 1) {
            setWardSuggestions(
                wards.filter(ward => ward.name.toLowerCase().includes(wardInput.toLowerCase()))
            );
        } else {
            setWardSuggestions([]);
        }
    }, [wardInput, wards]);

    useEffect(() => {
        if (street.length > 2 && selectedProvince && selectedDistrict) {
            const fetchStreets = async () => {
                try {
                    const response = await axios.get(
                        `https://nominatim.openstreetmap.org/search`,
                        {
                            params: {
                                format: "json",
                                country: "Vietnam",
                                state: provinces.find(p => p.code === Number(selectedProvince))?.name || "",
                                county: districts.find(d => d.code === Number(selectedDistrict))?.name || "",
                                city: wards.find(w => w.code === Number(selectedWard))?.name || "",
                                street: street,
                                addressdetails: 1,
                                limit: 5
                            }
                        }
                    );
                    setStreetSuggestions(response.data.map(item => item.address?.road || "Không có tên đường"));
                } catch (error) {
                    console.error("Lỗi khi lấy danh sách đường:", error);
                }
            };

            const debounceTimeout = setTimeout(fetchStreets, 500);
            return () => clearTimeout(debounceTimeout);
        } else {
            setStreetSuggestions([]);
        }
    }, [street, selectedProvince, selectedDistrict, selectedWard, districts, provinces, wards]);

    const handleSelectStreet = (streetName) => {
        setStreet(streetName);
        setStreetSuggestions([]);
    };

    // Cập nhật địa chỉ
    useEffect(() => {
        const provinceName = provinces.find(p => p.code === Number(selectedProvince))?.name || "";
        const districtName = districts.find(d => d.code === Number(selectedDistrict))?.name || "";
        const wardName = wards.find(w => w.code === Number(selectedWard))?.name || "";

        const fullAddress = `${houseNumber ? houseNumber + ", " : ""}${street ? street + ", " : ""}${wardName ? wardName + ", " : ""}${districtName ? districtName + ", " : ""}${provinceName}`;
        setSelectedAddressText(fullAddress);

        if (provinceName && districtName && wardName) {
            setNewAddress(fullAddress);
        }
    }, [selectedProvince, selectedDistrict, selectedWard, street, houseNumber, provinces, districts, wards, setNewAddress]);

    return (
        <div>
            <div className="alert alert-info mt-3">
                <strong>Địa chỉ:</strong> {selectedAddressText || "Chưa hoàn thành"}
            </div>

            <div className="mb-3 position-relative">
                <label className="form-label fw-bold">Tỉnh/Thành phố</label>
                <input
                    type="text"
                    className="form-control"
                    value={provinceInput}
                    onChange={(e) => setProvinceInput(e.target.value)}
                />
                {provinceSuggestions.length > 0 && (
                    <ul className="list-group mt-1">
                        {provinceSuggestions.map(province => (
                            <li key={province.code}
                                className="list-group-item list-group-item-action"
                                onClick={() => {
                                    setSelectedProvince(province.code);
                                    setProvinceInput(province.name);
                                    setProvinceSuggestions([]);
                                }}>
                                {province.name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="mb-3 position-relative">
                <label className="form-label fw-bold">Quận/Huyện</label>
                <input
                    type="text"
                    className="form-control"
                    value={districtInput}
                    onChange={(e) => setDistrictInput(e.target.value)}
                    disabled={!selectedProvince}
                />
                {districtSuggestions.length > 0 && (
                    <ul className="list-group mt-1">
                        {districtSuggestions.map(district => (
                            <li key={district.code}
                                className="list-group-item list-group-item-action"
                                onClick={() => {
                                    setSelectedDistrict(district.code);
                                    setDistrictInput(district.name);
                                    setDistrictSuggestions([]);
                                }}>
                                {district.name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="mb-3 position-relative">
                <label className="form-label fw-bold">Phường/Xã</label>
                <input
                    type="text"
                    className="form-control"
                    value={wardInput}
                    onChange={(e) => setWardInput(e.target.value)}
                    disabled={!selectedDistrict}
                />
                {wardSuggestions.length > 0 && (
                    <ul className="list-group mt-1">
                        {wardSuggestions.map(ward => (
                            <li key={ward.code}
                                className="list-group-item list-group-item-action"
                                onClick={() => {
                                    setSelectedWard(ward.code);
                                    setWardInput(ward.name);
                                    setWardSuggestions([]);
                                }}>
                                {ward.name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="mb-3">
                <label className="form-label fw-bold">Tên Đường</label>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Nhập tên đường"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    disabled={!selectedWard}
                />
                {streetSuggestions.length > 1 && (
                    <ul className="list-group mt-1">
                        {streetSuggestions.map((suggestion, index) => (
                            <li
                                key={index}
                                className="list-group-item list-group-item-action"
                                onClick={() => {
                                    handleSelectStreet(suggestion);
                                }}
                            >
                                {suggestion}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="mb-3">
                <label className="form-label fw-bold">Số Nhà</label>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Nhập số nhà"
                    value={houseNumber}
                    onChange={(e) => setHouseNumber(e.target.value)}
                    disabled={!street}
                />
            </div>
        </div>
    );
};

export default AddressSelector;
