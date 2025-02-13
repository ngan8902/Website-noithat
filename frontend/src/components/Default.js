import React from 'react';
import Header from './header/Header';
import Footer from './Footer';

const Default = ({ children }) => {
  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default Default;