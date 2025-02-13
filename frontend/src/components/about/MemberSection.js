import React from "react";

const MemberSection = ({ name, role, image }) => {
  return (
    <div className="col-md-4 mb-4 text-center">
      <img
        alt={role}
        className="rounded-circle mb-3"
        height="200"
        width="200"
        src={image}
      />
      <h5 className="fw-bold">{name}</h5>
      <p className="text-muted">{role}</p>
    </div>
  );
};

export default MemberSection;
