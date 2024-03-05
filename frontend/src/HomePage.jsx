import React, {
    useState,
    ChangeEvent,
    useContext,
    LabelHTMLAttributes,
  } from 'react';
import './HomePage.css';
import { useNavigate,BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import {AdminLoginPage,UserLoginPage,UserLoginPageForgetPassword } from './Login';
import { UserRegistPage,AdminRegistPage } from './Regist';
import { motion,AnimatePresence } from 'framer-motion';
// 未登录状态的用户页面
export function HomePageUnlog() {
    // 调库
    let navigate = useNavigate();
    const location = useLocation(); // 获取当前的location对象
    // 进入用户登录页面
    let goesLoginUser=()=>{
        navigate('/userlogin');
    }
    // 进入用户注册页面
    let goesRegistUser=()=>{
        navigate('/userregist');
    }
    // 进入Admin登录页面
    let goesLoginAdmin=()=>{
        navigate('/adminlogin');
    }
    // 进入Admin注册页面
    let goesRegistAdmin=()=>{
        navigate('/adminregist');
    }
    // 主页内容
    return (
      // 主页背景框
      <div className='HomeOverall'>
            {/* 根据路由返回不同的model */}
            <Routes>
                <Route path="/userlogin"   element={<UserLoginPage/>} />
                <Route path="/password" element={<UserLoginPageForgetPassword/>}/> 
                <Route path="/userregist"  element={<UserRegistPage/>} /> 
                <Route path="/adminlogin"  element={<AdminLoginPage/>} /> 
                <Route path="/adminregist" element={<AdminRegistPage/>} />
            </Routes>
        {/* 导航栏 */}
        <div className='Navbar'>
            {/* Logo图像 */}
            <img src='/img/LOGO.svg' className='Applogo'></img>
            {/* 搜索区域 */}
            <div className='SearchPart'>
                {/* 搜索图标 */}
                <img className='searchbtn' src='/img/search.png'></img>
                {/* 搜索输入框 */}
                <input className='Searchbar' placeholder='Search by location'></input>
            </div>
            {/* 新建车位按钮 */}
            <button className='newspace'>Lease your Car Space</button>
            {/* 登录注册按钮组 */}
            <div className='signwarper'>
                {/* 登录 */}
                <button className='sign' onClick={goesLoginUser}>Sign in</button>
                {/* 注册 */}
                <button className='sign' onClick={goesRegistUser}>Sign up</button>
            </div>
        </div>
        {/* 欢迎部分 */}
        <div className='WelcomePart'>

        </div>
        {/* 过滤器部分 */}
        <div className='FilterPart'>

        </div>
        {/* 所有车位列表 */}
        <div className='ListingPart'>

        </div>
      </div>
    );
  }

export function HomePageUser() {
    return (
      <div >
        <div>Hello, World!</div>
        <p>This is my new function component.</p>
      </div>
    );
  }

export function HomePageAdmin() {
    return (
      <div >
        <div>Hello, World!</div>
        <p>This is my new function component.</p>
      </div>
    );
}
