import React, { useState } from "react";

const CustomerReviews = ({ reviews }) => {
    if (typeof reviews === "number") {
        return (
            <div>
                <div>
                    <h5 className="fw-bold mb-0">Đánh Giá Trung Bình</h5>
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
            </div>
        );
    } else {
        return (
            <div>
                <div className="d-flex align-items-center justify-content-between mb-2">
                    <p className="text-muted mb-0">Chưa có đánh giá nào.</p>
                </div>
            </div>
        );
    }
};

export default CustomerReviews;