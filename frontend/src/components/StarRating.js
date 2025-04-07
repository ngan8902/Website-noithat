import React from "react";
import { FaStar } from "react-icons/fa";

const StarRating = ({ rating, onOptionSelect, orderItems }) => {
    const options = [
        { value: 5, label: "Rất thích" },
        { value: 4, label: "Thích" },
        { value: 3, label: "Ok" },
        { value: 2, label: "Không hài lòng" },
        { value: 1, label: "Thất vọng" },
    ];

    return (
        <div>
            {options.map((option) => (
                <div
                    key={option.value}
                    onClick={() => onOptionSelect(option.value)}
                    style={{
                        cursor: "pointer",
                        marginBottom: "10px",
                        padding: "10px",
                        border: "1px solid #ddd",
                        borderRadius: "5px",
                        transition: "background-color 0.3s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f0f0f0")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                    {Array.from({ length: 5 }, (_, index) => (
                        <FaStar
                            key={index}
                            color={index + 1 <= option.value ? "#ffc107" : "#e4e5e9"}
                        />
                    ))}
                    <span> - {option.label}</span>
                </div>
            ))}
            {rating && <p>Bạn đã đánh giá đơn hàng: {rating} <FaStar color={"#ffc107"} />.</p>}
        </div>
    );
};

export default StarRating;