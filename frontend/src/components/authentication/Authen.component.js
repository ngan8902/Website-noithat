import React from 'react';
import useAuthStore from '../../store/authStore';

const Authen = () => {
  const authenticate = useAuthStore((state) => state.auth);
  authenticate();
  return (<></>);
};

export default Authen;