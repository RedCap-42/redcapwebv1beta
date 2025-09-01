import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import './globals.css';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;