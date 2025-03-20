const CustomerReviews = ({ reviews }) => {
    return (
        <div>
            <h5 className="fw-bold mb-3">Đánh Giá Khách Hàng</h5>
            {reviews && reviews.length > 0 ? (
                reviews.map((review, index) => (
                    <div className="mb-3" key={index}>
                        <p className="mb-1"><strong>{review.name}</strong></p>
                        <p className="text-muted mb-1">{review.comment}</p>
                        <div className="text-warning">
                            {Array.from({ length: Math.floor(review.rating) }, (_, i) => (
                                <i key={i} className="bi bi-star"></i>
                            ))}
                            {review.rating % 1 !== 0 && <i className="bi bi-star-half"></i>}
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-muted">Chưa có đánh giá nào.</p>
            )}
        </div>
    );
};

export default CustomerReviews;
