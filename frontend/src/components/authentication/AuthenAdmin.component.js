import React from 'react';
import useAuthAdminStore from '../../store/authAdminStore';
import { useLocation } from "react-router-dom";

const AuthenAdmin = () => {
  const authenticate = useAuthAdminStore((state) => state.auth);

  const { pathname } = useLocation();

  if (!pathname.includes("/forgot-password")) {
    authenticate().then((res) => {
      if (!res) window.location.replace("/admin/login");
    });
  }
  return (<></>);
};

export default AuthenAdmin;