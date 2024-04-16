import React, { useEffect, useState } from 'react';
import { NavLink, Outlet,useNavigate } from 'react-router-dom';
import { getUserInfo } from './API';
import './DashboardTop.css';
import {
  useError
} from '../API';

const DashboardTop = () => {
  let { setOpenSnackbar }=useError();
  let navigate=useNavigate();
  let currentuser = localStorage.getItem('email') || null;
  let goesHome=()=>{
    navigate('/'+currentuser);
  }
  let goesCreateSpot = ()=>{
    const user=localStorage.getItem('email');
    navigate('/'+user+'/createspace');
  }
  let logout=()=>{
    localStorage.clear();
    navigate('/');
    setOpenSnackbar({
      severity: 'success',
      message: 'Logout successful',
      timestamp: new Date().getTime()
    });
  }

  const [userInfo, setUserInfo] = useState({
    name: '',
  });

    // 进入 Dashboard 组件时获取用户信息
    useEffect(() => {
      const fetchData = async () => {
        try {
          const data = await getUserInfo();  
          // data对象中包含用户信息
          setUserInfo({
            name: data.message.name,
          });
        } catch (error) {
          console.error('Error fetching user info:', error);
        }
      };
      fetchData();
    }, []);

  return (
    <div className="dashboard-top">
      <div className="Navbar">
        {/* Logo图像 */}
        <img src='/img/LOGO.svg' alt='logo' className='Applogo' onClick={goesHome}></img>
        {/* 搜索区域 */}
        <div className='SearchPart'>
          <img className='searchbtn' alt='search btn' src='/img/search.png'></img>
          <input className='Searchbar' placeholder='Search by location'></input>
        </div>
        {/* 搜索车位/出租车位 */}
        <button className='top-button' onClick={goesCreateSpot} >Lease my spots</button>
        <button className='top-button' onClick={goesHome}>Find a spot</button>
        {/* 用户信息 */}
        <span> Hi,</span>
        <span>{userInfo.name}</span>
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
