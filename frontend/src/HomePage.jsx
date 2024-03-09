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
// 未登录状态的用户页面
export function HomePageLarge() {
  const { _, setOpenSnackbar } = useError();
  let token = localStorage.getItem('token');
  console.log(token);
  // 调库
  let navigate = useNavigate();
  const location = useLocation(); // 获取当前的location对象
  // 进入用户登录页面
  let goesLoginUser = () => {
    navigate('/userlogin');
  };
  // 进入用户注册页面
  let goesRegistUser = () => {
    navigate('/userregist');
  };
  // 进入Admin注册页面
  let goesRegistAdmin = () => {
    navigate('/adminregist');
  };
  let CreatSpace = () => {
    if (token) {
      console.log(token);
    } else {
      navigate('/userlogin');
    }
  };
  let ChooseCar = () => {
    if (token) {
      console.log(token);
    } else {
      navigate('/userlogin');
    }
  };
  let logout = () => {
    if (localStorage.getItem('token')) {
      localStorage.removeItem('token');
      navigate('/');
      setOpenSnackbar({
        severity: 'success',
        message: 'Logout successful',
        timestamp: new Date().getTime(),
      });
    }
  };
  const [clickCount, setClickCount] = useState(0);

  // 设置连续点击的时间限制，例如500毫秒内必须完成三连击
  const clickTimeLimit = 1000;

  let timeoutId = null;
  // 进入Admin登录页面
  const goesLoginAdmin = () => {
    if (clickCount === 0) {
      // 首次点击时，设置一个定时器
      // 如果用户在指定时间内没有完成三连击，将重置点击计数
      timeoutId = setTimeout(() => {
        setClickCount(0);
      }, clickTimeLimit);
    }

    const newCount = clickCount + 1;
    setClickCount(newCount);

    if (newCount === 5) {
      // 如果达到三连击，清除定时器，执行路由跳转，并重置点击计数
      clearTimeout(timeoutId);
      navigate('/adminlogin');
      setClickCount(0);
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
        <img
          src='/img/LOGO.svg'
          className='Applogo'
          onClick={goesLoginAdmin}
        ></img>
        {/* 搜索区域 */}
        <div className='SearchPart'>
          {/* 搜索图标 */}
          <img className='searchbtn' src='/img/search.png'></img>
          {/* 搜索输入框 */}
          <input className='Searchbar' placeholder='Search by location'></input>
        </div>
        {/* 新建车位按钮 */}
        <button className='newspace' onClick={CreatSpace}>
          Lease your Car Space
        </button>
        {/* 登录注册按钮组 */}
        {token ? (
          <div className='signwarper'>
            <button className='sign' onClick={goesLoginUser}>
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
      {/* 欢迎部分 */}
      <div>
        <img src='/img/car.png' width={'100%'}></img>
        <p className='image-container-title'>
          Find Closer, Cheaper Parking Anywhere in Australia
        </p>
        <p className='image-container-sub'>
          SpotFinder makes it easy to browse, book, and enjoy the parking spaces
          that work best for you wherever you are.
        </p>
        <p className='image-container-txt'>
          We will give you the best service!
        </p>
      </div>
      {/* 过滤器部分 */}
      <div className='FilterPart'>
        <select
          defaultValue={'0'}
          className='form-select mglr'
          aria-label='Default select example'
        >
          <option value='0'>Highest sales</option>
          <option value='1'>Lowest sales</option>
        </select>
        <select
          defaultValue={'0'}
          className='form-select mglr'
          aria-label='Default select example'
        >
          <option value='0'>Highest rates</option>
          <option value='1'>Lowest rates</option>
        </select>
        <select
          defaultValue={'0'}
          className='form-select mglr-r'
          aria-label='Default select example'
        >
          <option value='0'>Weekly</option>
          <option value='1'>Daily</option>
          <option value='2'>Hourly</option>
        </select>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            className='timechoice'
            label='Parking time'
            value={dayjs(new Date())}
          />
          <DateTimePicker
            className='timechoice'
            label='Leaving time'
            value={dayjs(new Date())}
          />
        </LocalizationProvider>
        <div className='pricerange'>
          <label className='pricerange'>MIN$</label>
          <input className='pricerange'></input>
        </div>
        <div className='pricerange'>
          <label className='pricerange'>MAX$</label>
          <input className='pricerange'></input>
        </div>
        <button className='selectcar' onClick={ChooseCar}>
          SELECT YOUR CAR
        </button>
      </div>
      {/* 所有车位列表 */}
      <div className='ListingPart'>
        <div className='SpaceOverall'>
          <img
            className='spaceimg'
            src='img/sample.jpeg'
            width={'116px'}
            height={'116px'}
          ></img>
          <div className='info'>
            <div className='right-top'>
              <p className='space-title'>UNSW Parking Space</p>
              <div className='rate-part'>
                <img src='img/star.png' className='rate-img'></img>
                <p className='rate-txt'>5.0</p>
              </div>
            </div>
            <p className='space-price'>$38.00/day</p>
            <p className='space-location'>66 Kingsford, Sydney, NSW, 2018</p>
            <p className='space-type'>Fits a 4WD/SUV</p>
            <div className='right-bottom'>
              <div className='order-part'>
                <img src='img/booking.png' className='order-times'></img>
                <p className='times'>1000</p>
              </div>
              <button className='specific-info'>Book Now</button>
            </div>
          </div>
        </div>
        <div className='SpaceOverall'>
          <img
            className='spaceimg'
            src='img/sample.jpeg'
            width={'116px'}
            height={'116px'}
          ></img>
          <div className='info'>
            <div className='right-top'>
              <p className='space-title'>UNSW Parking Space</p>
              <div className='rate-part'>
                <img src='img/star.png' className='rate-img'></img>
                <p className='rate-txt'>5.0</p>
              </div>
            </div>
            <p className='space-price'>$38.00/day</p>
            <p className='space-location'>66 Kingsford, Sydney, NSW, 2018</p>
            <p className='space-type'>Fits a 4WD/SUV</p>
            <div className='right-bottom'>
              <div className='order-part'>
                <img src='img/booking.png' className='order-times'></img>
                <p className='times'>1000</p>
              </div>
              <button className='specific-info'>Book Now</button>
            </div>
          </div>
        </div>
        <div className='SpaceOverall'>
          <img
            className='spaceimg'
            src='img/sample.jpeg'
            width={'116px'}
            height={'116px'}
          ></img>
          <div className='info'>
            <div className='right-top'>
              <p className='space-title'>UNSW Parking Space</p>
              <div className='rate-part'>
                <img src='img/star.png' className='rate-img'></img>
                <p className='rate-txt'>5.0</p>
              </div>
            </div>
            <p className='space-price'>$38.00/day</p>
            <p className='space-location'>66 Kingsford, Sydney, NSW, 2018</p>
            <p className='space-type'>Fits a 4WD/SUV</p>
            <div className='right-bottom'>
              <div className='order-part'>
                <img src='img/booking.png' className='order-times'></img>
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

export function HomePageSmall() {
    const [clickCount, setClickCount] = useState(0);

    // 设置连续点击的时间限制，例如500毫秒内必须完成三连击
    const clickTimeLimit = 1000;
  
    let timeoutId = null;
    // 进入Admin登录页面
    const goesLoginAdmin = () => {
      if (clickCount === 0) {
        // 首次点击时，设置一个定时器
        // 如果用户在指定时间内没有完成三连击，将重置点击计数
        timeoutId = setTimeout(() => {
          setClickCount(0);
        }, clickTimeLimit);
      }
  
      const newCount = clickCount + 1;
      setClickCount(newCount);
  
      if (newCount === 5) {
        // 如果达到三连击，清除定时器，执行路由跳转，并重置点击计数
        clearTimeout(timeoutId);
        navigate('/adminlogin');
        setClickCount(0);
      }
    };
  const { _, setOpenSnackbar } = useError();
  let token = localStorage.getItem('token');
  console.log(token);
  // 调库
  let navigate = useNavigate();
  const location = useLocation(); // 获取当前的location对象
  // 进入用户登录页面
  let goesLoginUser = () => {
    navigate('/userlogin');
  };
  // 进入用户注册页面
  let goesRegistUser = () => {
    navigate('/userregist');
  };
  // 进入Admin注册页面
  let goesRegistAdmin = () => {
    navigate('/adminregist');
  };
  const [parkingTime, setParkingTime] = useState(dayjs(new Date()));
  const [leavingTime, setLeavingTime] = useState(dayjs(new Date()));

  const handleParkingTimeChange = (time) => {
    setParkingTime(time);
  };

  const handleLeavingTimeChange = (time) => {
    setLeavingTime(time);
  };
  let logout = () => {
    if (localStorage.getItem('token')) {
      localStorage.removeItem('token');
      navigate('/');
      setOpenSnackbar({
        severity: 'success',
        message: 'Logout successful',
        timestamp: new Date().getTime(),
      });
    }
  };
  let goesDashboard = () => {
    navigate('/user/Dashboard');
  };
  // 主页内容
  return (
    // 主页背景框
    <div className='HomeOverall'>
      {/* 导航栏 */}
      <div className='Navbar'>
        {/* Logo图像 */}
        <img src='/img/LOGO.svg' className='Applogo' onClick={goesLoginAdmin}></img>
        {/* 搜索区域 */}
        <div className='SearchPartsmall'>
          {/* 搜索图标 */}
          <img className='searchbtnsmall' src='/img/search.png'></img>
          {/* 搜索输入框 */}
          <input className='Searchbar' placeholder='Search by location'></input>
        </div>
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
      {/* 欢迎部分 */}
      <div>
        <img src='/img/car.png' width={'100%'}></img>
        <p className='image-container-title-small'>
          Find Closer, Cheaper Parking Anywhere in Australia
        </p>
        <p className='image-container-sub-small'>
          SpotFinder makes it easy to browse, book, and enjoy the parking spaces
          that work best for you wherever you are.
        </p>
        <p className='image-container-txt-small'>
          We will give you the best service!
        </p>
      </div>
      {/* 过滤器部分 */}
      <div className='FilterPart-small'>
        <div className='filter-top'>
          <div className='inner-left'>
            <select
              defaultValue={'0'}
              className='form-select mglr-s'
              aria-label='Default select example'
            >
              <option value='0'>Highest sales</option>
              <option value='1'>Lowest sales</option>
            </select>
            <select
              defaultValue={'0'}
              className='form-select mglr-s'
              aria-label='Default select example'
            >
              <option value='0'>Highest rates</option>
              <option value='1'>Lowest rates</option>
            </select>
          </div>
          <div className="input-group width-20">
            <span className="input-group-text">MIN$</span>
            <input type="text" className="form-control" aria-label="Dollar amount (with dot and two decimal places)"></input>
          </div>
          <div className="input-group width-20">
            <span className="input-group-text">MAX$</span>
            <input type="text" className="form-control" aria-label="Dollar amount (with dot and two decimal places)"></input>
          </div>
          {/* <div className='hflex'>
            <label className='pricerange-s'>MAX$</label>
            <input className='pricerange-s'></input>
          </div> */}

          <button className='selectcar'>SELECT YOUR CAR</button>
        </div>
        <div className='filter-bottom'>
          <select
            defaultValue={'0'}
            className='form-select mglr-s-r'
            aria-label='Default select example'
          >
            <option value='0'>Weekly</option>
            <option value='1'>Daily</option>
            <option value='2'>Hourly</option>
          </select>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              className='timechoice-s'
              label='Parking time'
              value={parkingTime}
              onChange={handleParkingTimeChange}
            />
            <p> </p>
            <DateTimePicker
              className='timechoice-s'
              label='Leaving time'
              value={leavingTime}
              onChange={handleLeavingTimeChange}
            />
          </LocalizationProvider>
        </div>
      </div>
      {/* 所有车位列表 */}
      {/* 所有车位列表 */}
      <div className='ListingPart'>
        <div className='SpaceOverall'>
          <img
            className='spaceimg'
            src='img/sample.jpeg'
            width={'116px'}
            height={'116px'}
          ></img>
          <div className='info'>
            <div className='right-top'>
              <p className='space-title'>UNSW Parking Space</p>
              <div className='rate-part'>
                <img src='img/star.png' className='rate-img'></img>
                <p className='rate-txt'>5.0</p>
              </div>
            </div>
            <p className='space-price'>$38.00/day</p>
            <p className='space-location'>66 Kingsford, Sydney, NSW, 2018</p>
            <p className='space-type'>Fits a 4WD/SUV</p>
            <div className='right-bottom'>
              <div className='order-part'>
                <img src='img/booking.png' className='order-times'></img>
                <p className='times'>1000</p>
              </div>
              <button className='specific-info'>Book Now</button>
            </div>
          </div>
        </div>
        <div className='SpaceOverall'>
          <img
            className='spaceimg'
            src='img/sample.jpeg'
            width={'116px'}
            height={'116px'}
          ></img>
          <div className='info'>
            <div className='right-top'>
              <p className='space-title'>UNSW Parking Space</p>
              <div className='rate-part'>
                <img src='img/star.png' className='rate-img'></img>
                <p className='rate-txt'>5.0</p>
              </div>
            </div>
            <p className='space-price'>$38.00/day</p>
            <p className='space-location'>66 Kingsford, Sydney, NSW, 2018</p>
            <p className='space-type'>Fits a 4WD/SUV</p>
            <div className='right-bottom'>
              <div className='order-part'>
                <img src='img/booking.png' className='order-times'></img>
                <p className='times'>1000</p>
              </div>
              <button className='specific-info'>Book Now</button>
            </div>
          </div>
        </div>
        <div className='SpaceOverall'>
          <img
            className='spaceimg'
            src='img/sample.jpeg'
            width={'116px'}
            height={'116px'}
          ></img>
          <div className='info'>
            <div className='right-top'>
              <p className='space-title'>UNSW Parking Space</p>
              <div className='rate-part'>
                <img src='img/star.png' className='rate-img'></img>
                <p className='rate-txt'>5.0</p>
              </div>
            </div>
            <p className='space-price'>$38.00/day</p>
            <p className='space-location'>66 Kingsford, Sydney, NSW, 2018</p>
            <p className='space-type'>Fits a 4WD/SUV</p>
            <div className='right-bottom'>
              <div className='order-part'>
                <img src='img/booking.png' className='order-times'></img>
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

export function HomePageAdminLarge() {
  return (
    <div>
      <div>Hello, World!</div>
      <p>This is my new function component.</p>
    </div>
  );
}
export function HomePageAdminSmall() {
  return (
    <div>
      <div>Hello, World!</div>
      <p>This is my new function component.</p>
    </div>
  );
}
