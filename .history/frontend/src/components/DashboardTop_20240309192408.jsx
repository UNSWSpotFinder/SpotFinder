import React from 'react';
import { Outlet } from 'react-router-dom';
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
        <span>Boyang </span>
        <button>Sign out</button>
      </div>

      {/* Top以下区域 */}
      <div className="content-area">
        {/* 侧边栏 */}
        <div className="side-nav">
          <div className='side-nav'>Dashboard</div>
          <div>Bookings</div>
          <div>Listings</div>
          <div>Messages</div>
          <div>Profile</div>
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
