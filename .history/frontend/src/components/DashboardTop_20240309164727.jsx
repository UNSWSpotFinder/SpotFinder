import React from 'react';
import { NavLink } from 'react-router-dom';
import './MainLayout.css'; // 假定你有一个CSS文件来为布局添加样式

const MainLayout = ({ children }) => {
  return (
    <div className="main-layout">
      <header className="main-header">
        <img src="logo.svg" alt="Logo" />
        <input type="text" placeholder="Search by location" />
        <button>Lease your car space</button>
        <button>Find a spot</button>
        <div>Hi, Boyang</div>
        <button>Sign Out</button>
      </header>
      <aside className="main-nav">
        <NavLink to="/dashboard" activeClassName="active">Dashboard</NavLink>
        <NavLink to="/bookings" activeClassName="active">Bookings</NavLink>
        <NavLink to="/listings" activeClassName="active">Listings</NavLink>
        <NavLink to="/profile" activeClassName="active">Profile</NavLink>
        <NavLink to="/messages" activeClassName="active">Messages</NavLink>
      </aside>
      <main className="content">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
