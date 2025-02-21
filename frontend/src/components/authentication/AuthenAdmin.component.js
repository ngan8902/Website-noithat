import React from 'react';
import useAuthAdminStore from '../../store/authAdminStore';

const AuthenAdmin = () => {
  const authenticate = useAuthAdminStore((state) => state.auth);
  authenticate().then((res) => {
    if (!res) window.location.replace("/admin/login");
  })
  return (<></>);
};

export default AuthenAdmin;