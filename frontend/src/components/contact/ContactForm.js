import React, { useState } from "react";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Tin nhắn của bạn đã được gửi!");
    setFormData({ name: "", email: "", message: "" }); // Reset form
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
        <button type="submit" className="btn btn-dark w-100">Gửi Tin Nhắn</button>
      </form>
    </div>
  );
};

export default ContactForm;
