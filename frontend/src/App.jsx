import logo from './logo.svg';
import React, {
  useState,
  useEffect,
  useRef,
  ChangeEvent,
  LabelHTMLAttributes,
  createContext,
  useContext,
  ReactNode,
} from 'react';
import {HomePageLarge,HomePageAdminSmall,HomePageAdminLarge,HomePageSmall} from './HomePage';
import { UserRegistPage,AdminRegistPage } from './Regist';
import { ErrorProvider, GlobalSnackbar, ErrorContext } from './API';
import { BrowserRouter, Routes, Route, Link,useParams} from 'react-router-dom';
import './App.css';
import {AdminLoginPage,UserLoginPage,UserLoginPageForgetPassword } from './Login';
import{
  CreatSpace, EditSpace
} from './CarSpaceOperation';
// 导入Dashboard相关页面组件
import DashboardTop from './components/DashboardTop';
import Dashboard from './components/Dashboard';
import Bookings from './components/Bookings';
import Listings from './components/Listings';
import Profile from './components/Profile';
import Messages from './components/Messages';
import Vehicles from './components/Vehicles';

function App() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    // 添加一个事件监听器，以便在窗口大小改变时更新windowWidth状态
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    // 清除事件监听器以避免内存泄漏
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  let layoutComponentHost;
  let LayoutComponentHome;
  let LayoutDetail;
  if (windowWidth > 800) {
    layoutComponentHost = null;
    LayoutComponentHome = <HomePageLarge/>;
    LayoutDetail = null;
  } else {
    layoutComponentHost = null;
    LayoutComponentHome = <HomePageSmall/>;;
    LayoutDetail = null;
  }
  return(
    <ErrorProvider>
      <GlobalSnackbar/>
        <BrowserRouter>
            <Routes>
                <Route path="/userlogin"   element={<UserLoginPage/>} />
                <Route path="/password" element={<UserLoginPageForgetPassword/>}/> 
                <Route path="/userregist"  element={<UserRegistPage/>} /> 
                <Route path="/adminlogin"  element={<AdminLoginPage/>} /> 
                <Route path="/adminregist" element={<AdminRegistPage/>} />
                <Route path='/*' element={<></>}/>
            </Routes>
          <Routes>
            <Route path="/:username" element={LayoutComponentHome} />
            <Route path="/:username/createspace" element = {<CreatSpace/>} />
            <Route path="/:username/editspace" element = {<EditSpace/>} />
            {/* DashboardTop作为父路由 */}
            <Route path="/:username/dashboard" element={<DashboardTop />}>
            <Route index element={<Dashboard />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="listings" element={<Listings />} />
            <Route path="profile" element={<Profile />} />
            <Route path="vehicles" element={<Vehicles />} />
            <Route path="messages" element={<Messages />} />
          </Route>
            {/* Keep the wildcard route to catch all and render Home */}
            <Route path="/*" element={LayoutComponentHome} />
          </Routes>
        </BrowserRouter>
    </ErrorProvider>
  )
}

export default App;
