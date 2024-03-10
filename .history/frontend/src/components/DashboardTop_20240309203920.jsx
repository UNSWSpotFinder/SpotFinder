import React from 'react';
import { NavLink, Outlet NavLink } from 'react-router-dom';
import './DashboardTop.css';
import '../HomePage.css';

const DashboardTop = () => {
  return (
    <div className="dashboard-top">
      <div className="Navbar">
        {/* Logo图像 */}
        <img src='/img/LOGO.svg' className='Applogo'></img>
        {/* 搜索区域 */}
        <div className='SearchPart'>
          <img className='searchbtn' src='/img/search.png'></img>
          <input className='Searchbar' placeholder='Search by location'></input>
        </div>
        <button className='top-button'>Lease your car space</button>
        <button className='top-button'>Find a spot</button>
        <span>Hi, </span>
        <span>User name </span>
        <button className="button-with-image">
          <img src='/img/SignOut.svg' alt='Sign Out' className='sign-out-img' />
        </button>
      </div>

      {/* Top以下区域 */}
      <div className="content-area">
        {/* 侧边栏 */}
        <div className="side-nav">
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'side-nav-spcific active' : 'side-nav-spcific'}>Dashboard</NavLink>
          <NavLink to="/dashboard/bookings" className={({ isActive }) => isActive ? 'side-nav-spcific active' : 'side-nav-spcific'}>Bookings</NavLink>
          <NavLink to="/dashboard/listings" className={({ isActive }) => isActive ? 'side-nav-spcific active' : 'side-nav-spcific'}>Listings</NavLink>
          <NavLink to="/dashboard/messages" className={({ isActive }) => isActive ? 'side-nav-spcific active' : 'side-nav-spcific'}>Messages</NavLink>
          <NavLink to="/dashboard/profile" className={({ isActive }) => isActive ? 'side-nav-spcific active' : 'side-nav-spcific'}>Profile</NavLink>
        
        </div>
        {/* 主要内容区域 */}
        <div className="main-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardTop;
