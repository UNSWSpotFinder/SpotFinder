import React, {
    useState,
    ChangeEvent,
    useContext,
    LabelHTMLAttributes,
  } from 'react';
  import dayjs from 'dayjs';
  import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
  import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
  import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
  import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
  import './HomePage.css';
  import {
    useNavigate,
    BrowserRouter,
    Routes,
    Route,
    Link,
    useLocation,
  } from 'react-router-dom';
  import {
    AdminLoginPage,
    UserLoginPage,
    UserLoginPageForgetPassword,
  } from './Login';
  import { UserRegistPage, AdminRegistPage } from './Regist';
  import { motion, AnimatePresence } from 'framer-motion';
  import { useError } from './API';
  import './SpecificSpot.css';
  export function HomeSpecificLarge() {
    const { _ , setOpenSnackbar } = useError();
    let token = localStorage.getItem('token') || null;
    let currentuser = localStorage.getItem('email') || null;
    console.log(token);
    // 跳转车位选择页
    // 调库
    let navigate = useNavigate();
    const location = useLocation(); // 获取当前的location对象
    // 进入用户登录页面
    let goesLoginUser = () => {
      navigate(location.pathname+'/userlogin');
    };
    // 进入用户注册页面
    let goesRegistUser = () => {
      navigate(location.pathname+'/userregist');
    };
    let goesBack = () => {
        localStorage.removeItem('spotID');
        if(localStorage.getItem('token')){
            navigate('/'+localStorage.getItem('email'));
        }
        else{
            navigate('/');
        }
        
    }
    let goesDashboard = () => {
      navigate('/'+currentuser+'/dashboard');
    };
    let logout = () => {
      if (localStorage.getItem('token')) {
        localStorage.removeItem('token');
        if(localStorage.getItem('spotID')){
            navigate('/tourists/'+localStorage.getItem('spotID'));
        }
        else{
            navigate('/');
        }

        setOpenSnackbar({
          severity: 'success',
          message: 'Logout successful',
          timestamp: new Date().getTime(),
        });
      }
    };
  
    // 主页内容
    return (
      // 主页背景框
      <div className='HomeOverall'>
        {/* 根据路由返回不同的model */}
        {/* 导航栏 */}
        <div className='Navbar'>
          {/* Logo图像 */}
          <button className='backgo' onClick={goesBack}>Back</button>
          <img
            src='/img/LOGO.svg'
            className='Applogo'
          ></img>
          {/* 登录注册按钮组 */}
          {token ? (
            <div className='signwarper'>
              <button className='sign' onClick={goesDashboard}>
                DashBoard
              </button>
              {/* 注册 */}
              <button className='sign' onClick={logout}>
                Exit
              </button>
            </div>
          ) : (
            <div className='signwarper'>
              <button className='sign' onClick={goesLoginUser}>
                Sign in
              </button>
              {/* 注册 */}
              <button className='sign' onClick={goesRegistUser}>
                Sign up
              </button>
            </div>
          )}
        </div>
        {/* 所有车位列表 */}
        <div className='ListingPart'>
          <div className='SpaceOverall'>
            <img
              className='spaceimg'
              src='/img/sample.jpeg'
              width={'116px'}
              height={'116px'}
            ></img>
            <div className='info'>
              <div className='right-top'>
                <p className='space-title'>UNSW Parking Space</p>
                <div className='rate-part'>
                  <img src='/img/star.png' className='rate-img'></img>
                  <p className='rate-txt'>5.0</p>
                </div>
              </div>
              <p className='space-price'>$38.00/day</p>
              <p className='space-location'>66 Kingsford, Sydney, NSW, 2018</p>
              <p className='space-type'>Fits a 4WD/SUV</p>
              <div className='right-bottom'>
                <div className='order-part'>
                  <img src='/img/booking.png' className='order-times'></img>
                  <p className='times'>1000</p>
                </div>
                <button className='specific-info'>Book Now</button>
              </div>
            </div>
          </div>
          <div className='SpaceOverall'>
            <img
              className='spaceimg'
              src='/img/sample.jpeg'
              width={'116px'}
              height={'116px'}
            ></img>
            <div className='info'>
              <div className='right-top'>
                <p className='space-title'>UNSW Parking Space</p>
                <div className='rate-part'>
                  <img src='/img/star.png' className='rate-img'></img>
                  <p className='rate-txt'>5.0</p>
                </div>
              </div>
              <p className='space-price'>$38.00/day</p>
              <p className='space-location'>66 Kingsford, Sydney, NSW, 2018</p>
              <p className='space-type'>Fits a 4WD/SUV</p>
              <div className='right-bottom'>
                <div className='order-part'>
                  <img src='/img/booking.png' className='order-times'></img>
                  <p className='times'>1000</p>
                </div>
                <button className='specific-info'>Book Now</button>
              </div>
            </div>
          </div>
          <div className='SpaceOverall'>
            <img
              className='spaceimg'
              src='/img/sample.jpeg'
              width={'116px'}
              height={'116px'}
            ></img>
            <div className='info'>
              <div className='right-top'>
                <p className='space-title'>UNSW Parking Space</p>
                <div className='rate-part'>
                  <img src='/img/star.png' className='rate-img'></img>
                  <p className='rate-txt'>5.0</p>
                </div>
              </div>
              <p className='space-price'>$38.00/day</p>
              <p className='space-location'>66 Kingsford, Sydney, NSW, 2018</p>
              <p className='space-type'>Fits a 4WD/SUV</p>
              <div className='right-bottom'>
                <div className='order-part'>
                  <img src='/img/booking.png' className='order-times'></img>
                  <p className='times'>1000</p>
                </div>
                <button className='specific-info'>Book Now</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }