import React from 'react';
import { Outlet } from 'react-router-dom';
import './DashboardTop.css';

const DashboardTop = () => {
  return (
    <div className="dashboard-top">
      <div className="Navbar">
        <img src='/img/LOGO.svg' className='Applogo'></img>
                    {/* 搜索区域 */}
            <div className='SearchPart'>
                {/* 搜索图标 */}
                <img className='searchbtn' src='/img/search.png'></img>
                {/* 搜索输入框 */}
                <input className='Searchbar' placeholder='Search by location'></input>
            </div>
        <button>Lease your car space</button>
        <button>find a spot</button>
        <span>Hi, </span>
        <span>Boyang </span>
        <button>Sign out</button>
      </div>
      <div className="content-area">
        <div className="side-nav">
          <div>Dashboard</div>
          <div>Bookings</div>
          <div>Listings</div>
          <div>Messages</div>
          <div>Profile</div>
        </div>
        <div className="main-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardTop;
