import React, { useState } from "react";
import axios from "axios";
import useAuthStore from "../store/authStore";

const Comments = ({ productId, onSubmitSuccess }) => {
    const [comment, setComment] = useState("");
    const [err, setErr] = useState("");
    const [successMessage, setSuccessMessage] = useState(""); const { user } = useAuthStore();


    const handlePostComment = async () => {
        if (!comment.trim()) {
            setErr("Vui lòng nhập bình luận");
            return;
        }

        const formData = new FormData();
        formData.append("content", comment);
        if (user._id) {
            formData.append("userId", user._id);
        }

        try {
            await axios.post(
                `${process.env.REACT_APP_URL_BACKEND}/comments/${productId}/comments`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            setComment("");
            setSuccessMessage("Gửi bình luận thành công!");
            if (onSubmitSuccess) {
                onSubmitSuccess();
            }
        } catch (error) {
            console.error("Lỗi khi gửi bình luận và tệp đính kèm:", error);
            setErr("Đã có lỗi xảy ra khi gửi bình luận và tệp đính kèm. Vui lòng thử lại sau.");
        }
    };

    return (
        <div className="mb-3 mt-3 border p-3">
            <h5 className="fw-bold mb-3">Thêm Bình Luận Của Bạn</h5>
            <div className="mb-3">
                <label className="form-label">Bình luận:</label>
                <textarea
                    className="form-control"
                    rows="3"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Viết bình luận của bạn..."
                ></textarea>
            </div>
            {err && <div className="alert alert-danger">{err}</div>}
            {successMessage && <div className="alert alert-success">{successMessage}</div>}

            <button className="btn btn-primary" onClick={handlePostComment}>
                Gửi Bình Luận
            </button>
        </div>
    );
};

export default Comments;