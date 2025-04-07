import React from "react";

const CustomerReviews = ({ reviews }) => {
    if (typeof reviews === "number") {
        return (
            <div>
                <h5 className="fw-bold mb-3">Đánh Giá Trung Bình</h5>
                <div className="rating">
                    {[...Array(5)].map((_, starIndex) => {
                        if (starIndex < Math.floor(reviews)) {
                            return (
                                <i
                                    key={starIndex}
                                    className="bi bi-star-fill text-warning"
                                ></i>
                            );
                        } else if (starIndex < reviews) {
                            return (
                                <i
                                    key={starIndex}
                                    className="bi bi-star-half text-warning"
                                ></i>
                            );
                        } else {
                            return (
                                <i
                                    key={starIndex}
                                    className="bi bi-star text-secondary"
                                ></i>
                            );
                        }
                    })}
                </div>
            </div>
        );
    } else if (Array.isArray(reviews) && reviews.length > 0) {
        return (
            <div>
                <h5 className="fw-bold mb-3">Đánh Giá Khách Hàng</h5>
                {reviews.map((review, index) => (
                    <div className="mb-3" key={index}>
                        <div className="rating">
                            {[...Array(5)].map((_, starIndex) => (
                                <i
                                    key={starIndex}
                                    className={`bi ${starIndex < review.rating ? "bi-star-fill text-warning" : "bi-star text-secondary"}`}
                                ></i>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    } else {
        return <p className="text-muted">Chưa có đánh giá nào.</p>;
    }
};

export default CustomerReviews;