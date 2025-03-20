import React from 'react';
import AuthenAdmin from '../authentication/AuthenAdmin.component';

const AdminLayout = ({ children }) => {
  return (
    <div>
      <AuthenAdmin />
      {children}
    </div>
  );
};

export default AdminLayout;