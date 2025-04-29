import React, { useState } from "react";
import { UPLOAD_URL } from '../../constants/url.constant'

const ManagerInfo = ({ staff }) => {
  const [showModal, setShowModal] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return "Chưa cập nhật";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  const calculateServiceDuration = (createdAt) => {
    if (!createdAt) return { years: 0, months: 0 };
    const startDate = new Date(createdAt);
    const now = new Date();
    let years = now.getFullYear() - startDate.getFullYear();
    let months = now.getMonth() - startDate.getMonth();
    if (months < 0) {
      years--;
      months += 12;
    }
    return { years, months };
  };

  const getOverviewMessage = () => {
    const gender = staff?.gender?.toLowerCase();
    const { years, months } = calculateServiceDuration(staff?.createdAt);

    let pronoun = "nhân viên";
    if (gender === "nam") pronoun = "anh";
    else if (gender === "nữ") pronoun = "chị";

    let serviceText = "";
    if (years === 0 && months > 0) {
      serviceText = `đã làm việc tại Furniture được khoảng ${months} tháng`;
    } else if (years > 0) {
      serviceText = `đã làm việc tại Furniture được khoảng ${years} năm${months > 0 ? ` ${months} tháng` : ""}`;
    } else {
      serviceText = `mới gia nhập Furniture`;
    }

    let closingSentence = "";
    if (years === 0 && months < 1) {
      closingSentence = `Chúng tôi mong ${pronoun} sẽ gắn bó và phát triển cùng Furniture.`;
    } else {
      closingSentence = `Chúng tôi ghi nhận sự đóng góp và chuyên môn của ${pronoun}.`;
    }

    return `${staff?.name} ${serviceText}. ${closingSentence}`;
  };

  const getImageUrl = (avatar, avatarDefault) => {
      let src;
      if (avatar && avatar.startsWith('http://')) {
        src = avatar;
      } else if (avatar) {
        src = `${UPLOAD_URL}${avatar}`;
      } else {
        src = avatarDefault;
      }
      return src;
    };

  return (
    <section className="py-5">
      <div className="container">
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card text-center shadow-sm border-0 p-3">
              <div className="card-body">
                <img
                  src={getImageUrl(staff?.avatar, '/images/guest.png')}
                  alt={staff?.name || "Employee"}
                  className="rounded-circle mb-3 border border-3 border-primary avatar"
                  width="150"
                  height="150"
                  onClick={() => setShowModal(true)}
                  style={{ cursor: "pointer" }}
                />
                <h5 className="card-title mb-1">{staff?.name}</h5>
                <p className="card-text small">
                  <i className="bi bi-envelope-fill me-2"></i> {staff?.email || "Chưa cập nhật"}
                </p>
                <p className="card-text small">
                  <i className="bi bi-phone-vibrate-fill me-2"></i> {staff?.phone || "Chưa cập nhật"}
                </p>
                <p className="text-muted small">
                  Gia nhập: {formatDate(staff?.createdAt)}
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-8 mb-4">
            <div className="card shadow-sm border-0 p-3">
              <div className="card-body">
                <h5 className="card-title fw-bold text-primary text-center mb-3">Thông Tin Chi Tiết</h5>
                <div className="row">
                  <div className="col-md-6">
                    <ul className="list-unstyled">
                      <li className="mb-2"><strong>Họ và Tên:</strong> {staff?.name}</li>
                      <li className="mb-2"><strong>Mã nhân viên:</strong> {staff?.staffcode || "Chưa cập nhật"}</li>
                      <li className="mb-2"><strong>Giới Tính:</strong> {staff?.gender || "Chưa cập nhật"}</li>
                      <li className="mb-2"><strong>Ngày Sinh:</strong> {formatDate(staff?.dob)}</li>
                      <li className="mb-2"><strong>Email:</strong> {staff?.email}</li>
                      <li className="mb-2"><strong>Số Điện Thoại:</strong> {staff?.phone}</li>
                      <li className="mb-2"><strong>Địa Chỉ:</strong> {staff?.address || "Chưa cập nhật"}</li>
                      <li className="mb-2"><strong>Ngày Gia Nhập:</strong> {formatDate(staff?.createdAt)}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card shadow-sm border-0 mt-4 p-4">
          <div className="card-body text-center">
            <h6 className="fw-bold text-primary mb-3">Tổng Quan Về Nhân Sự</h6>
            <p className="text-secondary fs-6">{getOverviewMessage()}</p>
          </div>
        </div>

        {showModal && (
          <div className="avatar-modal">
            <div className="avatar-modal-content">
              <span className="close" onClick={() => setShowModal(false)}>
                <i className="bi bi-x-circle-fill"></i>
              </span>
              <img
                src={getImageUrl(staff?.avatar, '/images/guest.png')}
                alt="Avatar"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ManagerInfo;
