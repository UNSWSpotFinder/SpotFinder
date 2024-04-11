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
import { BrowserRouter, Routes, Route, Link,useParams, useLocation, useNavigate} from 'react-router-dom';
import './App.css';
import {AdminLoginPage,UserLoginPage,UserLoginPageForgetPassword } from './Login';
import{
  CreateSpace, EditSpace
} from './CarSpaceOperation';
import{
  CarSpaceChoice,
  CarSpaceAdd,
  CarSpaceEdit
} from './CarInfo';
import {
  HomeSpecificLarge
} from './SpecificSpot';
// 导入Dashboard相关页面组件
import DashboardTop from './components/DashboardTop';
import Dashboard from './components/Dashboard';
import Bookings from './components/Bookings';
import Listings from './components/Listings';
import Profile from './components/Profile';
import Messages from './components/Messages';
import Vehicles from './components/Vehicles';
import AdminDashboard from './components/AdminDashboard';
import dayjs from 'dayjs';
import {ManagerEditSpace,ManagerApproveEditSpace} from './CheckDetail';
// 创建一个 Context 对象
export const AppContext = React.createContext();

export const AppProvider = ({ children }) => {
  // 保存信息的状态
  const [contextState, setContextState] = useState({
    order_rank_way: 0,
    score_rank_way: 0,
    maxPrise: '',
    minPrise: '',
    CarType: '',
    CarPlate: '',
    CarCharge: '',
    CarPicture:'',
    BookWay:'H',
    StartDay: null,
    EndDay: null,
    Carlocation:''
  });

  // 更新状态的方法
  const updateContextState = (newState) => {
    setContextState((prevState) => ({ ...prevState, ...newState }));
  };

  return (
    <AppContext.Provider value={{ contextState, updateContextState }}>
      {children}
    </AppContext.Provider>
  );
};


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
    LayoutDetail = <HomeSpecificLarge/>;
  } else {
    layoutComponentHost = null;
    LayoutComponentHome = <HomePageSmall/>;;
    LayoutDetail = <HomeSpecificLarge/>;
  }
  const CatchAllRouteHandler = () => {
    let location = useLocation();
    
    if (location.pathname.endsWith('/userlogin')) {
      return <UserLoginPage />;
    }
    if (location.pathname.endsWith('/userregist')) {
      return <UserRegistPage />;
    }

    // Handle other cases or redirect
    return null;
  };
  return(
    <AppProvider>
      <ErrorProvider>
        <GlobalSnackbar/>
          <BrowserRouter>
            <Routes>
                <Route path="/password" element={<UserLoginPageForgetPassword/>}/> 
                <Route path="/adminlogin"  element={<AdminLoginPage/>} />
                <Route path="/adminregist" element={<AdminRegistPage/>} />
                <Route path="/:username/choose" element={<CarSpaceChoice/>} />
                <Route path="/:username/detail/:Spotid/choose" element={<CarSpaceChoice/>} />
                <Route path="/:username/editcar/*" element={null} />
                <Route path="/:username/addcar" element={null} />
                <Route path='/*' element={<CatchAllRouteHandler/>}/>
            </Routes>
            <Routes>
              <Route path="/admin/:adminid" element={<AdminDashboard/>} />
              <Route path = "/:username/:adminid/:Spotid" element = {<ManagerEditSpace/>} />
              <Route path = "/:username/:adminid/Approve/:Spotid" element = {<ManagerApproveEditSpace/>} />
              <Route path = "/:username" element={LayoutComponentHome} />
              <Route path = "/:username/createspace" element = {<CreateSpace/>} />
              <Route path = "/:username/editspace/:Spotid" element = {<EditSpace/>} />
              <Route path = '/tourists/detail/*' element={LayoutDetail}/>
              <Route path = '/:username/detail/*' element={LayoutDetail}/>
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
    </AppProvider>
  )
}

export default App;
