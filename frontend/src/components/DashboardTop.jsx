import React from 'react';
import { NavLink, Outlet,useNavigate } from 'react-router-dom';
import './DashboardTop.css';

import {
  useError
} from '../API';
const DashboardTop = () => {
  let { _ , setOpenSnackbar }=useError();
  let navigate=useNavigate();
  let token = localStorage.getItem('token') || null;
  let currentuser = localStorage.getItem('email') || null;
  let goesHome=()=>{
    navigate('/'+currentuser);
  }
  let logout=()=>{
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    navigate('/');
    setOpenSnackbar({
      severity: 'success',
      message: 'Logout successful',
      timestamp: new Date().getTime()
    });
  }
  return (
    <div className="dashboard-top">
      <div className="Navbar">
        {/* Logo图像 */}
        <img src='/img/LOGO.svg' alt='logo' className='Applogo'></img>
        {/* 搜索区域 */}
        <div className='SearchPart'>
          <img className='searchbtn' alt='search btn' src='/img/search.png'></img>
          <input className='Searchbar' placeholder='Search by location'></input>
        </div>
        {/* 搜索车位/出租车位 */}
        <button className='top-button' >Lease my spots</button>
        <button className='top-button' onClick={goesHome}>Find a spot</button>
        {/* 用户信息 */}
        <span> Hi,</span>
        <span>{currentuser}</span>
        {/* 登出按钮 */}
        <button className="button-with-image">
          <img src='/img/SignOut.svg' alt='Sign Out' className='sign-out-img' onClick={logout}/>
        </button>
      </div>

      {/* Top以下区域 */}
      <div className="content-area">
        {/* 侧边栏 */}
        <div className="side-nav">
          <NavLink to={`/${currentuser}/dashboard`} className={({ isActive }) => isActive ? 'side-nav-spcific active' : 'side-nav-spcific'} end>Dashboard</NavLink>
          <NavLink to={`/${currentuser}/dashboard/bookings`}className={({ isActive }) => isActive ? 'side-nav-spcific active' : 'side-nav-spcific'}>Bookings</NavLink>
          <NavLink to={`/${currentuser}/dashboard/listings`} className={({ isActive }) => isActive ? 'side-nav-spcific active' : 'side-nav-spcific'}>Listings</NavLink>
          <NavLink to={`/${currentuser}/dashboard/messages`} className={({ isActive }) => isActive ? 'side-nav-spcific active' : 'side-nav-spcific'}>Messages</NavLink>
          <NavLink to={`/${currentuser}/dashboard/profile`} className={({ isActive }) => isActive ? 'side-nav-spcific active' : 'side-nav-spcific'}>Profile</NavLink>
          <NavLink to={`/${currentuser}/dashboard/vehicles`} className={({ isActive }) => isActive ? 'side-nav-spcific active' : 'side-nav-spcific'}>Vehicles</NavLink>
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
