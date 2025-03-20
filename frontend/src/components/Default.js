import React from 'react';
import Header from './header/Header';
import Footer from './Footer';
import Authen from './authentication/Authen.component';

const Default = ({ children }) => {
  return (
    <div>
      <Authen />
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default Default;