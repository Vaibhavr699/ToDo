import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100 text-gray-900">
      <Header />
      <main className="flex-grow container mx-auto px-4 ">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
