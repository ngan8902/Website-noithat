import React, { useState } from "react";
import useMailStore from "../../store/emailStore"

const ContactForm = () => {
  const {
    formData,
    isLoading,
    successMessage,
    errorMessage,
    setFormData,
    sendMail
  } = useMailStore();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMail();
  };

  return (
    <div className="col-md-6">
      <h5 className="fw-bold">Gửi Tin Nhắn</h5>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="contactName" className="form-label">Họ và Tên</label>
          <input
            type="text"
            className="form-control"
            id="contactName"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="contactEmail" className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            id="contactEmail"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="contactMessage" className="form-label">Tin nhắn</label>
          <textarea
            className="form-control"
            id="contactMessage"
            name="message"
            rows="4"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-dark w-100" disabled={isLoading}>
          {isLoading ? "Đang gửi..." : "Gửi Tin Nhắn"}
        </button>
        {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>}
        {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}
      </form>
    </div>
  );
};

export default ContactForm;
