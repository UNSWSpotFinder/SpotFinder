import React, {
  useState,
  ChangeEvent,
  useContext,
  LabelHTMLAttributes,
  useEffect,
} from 'react';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DatePicker } from '@mui/x-date-pickers';
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
import { getUserInfo } from './components/API'
import { callAPIGetAllSpot, useError } from './API';
import { AppContext } from './App';
import { private_createTypography } from '@mui/material';
// 未登录状态的用户页面

function AllSpoting() {
  const { contextState, updateContextState } = useContext(AppContext);
  const navigate = useNavigate();
  const goesSpecific = (event) => {
    const target = event.target;
    localStorage.setItem('spotID', target.id);
    if (target.id) {
      if (localStorage.getItem('token')) {
        const username = localStorage.getItem('email');
        navigate('/' + username + '/detail/' + target.id);
      } else {
        navigate('/tourists/detail/' + target.id);
      }
    }
  };
  const { _, setOpenSnackbar } = useError();
  let [allSpot, setAllSpot] = useState([]);
  let [filteredSpot,setfilrerSpot]=useState([]);
  useEffect(() => {
    getNewSpot(); // Call on component mount
  }, []); // Empty dependency array means this effect runs once on mount
  useEffect(()=>{
    // 删选预订方式
    let filter = allSpot.filter((data)=>{
      if(contextState.BookWay=='H'){
          return data.IsHourRent;
      }
      else if(contextState.BookWay=='D'){
          return data.IsDayRent;
      }
      else{
          return data.isWeekRent;
      }
    });
    // 筛选价格
    let min_p=contextState.minPrise;
    let max_p=contextState.maxPrise;
    if(min_p===''){min_p='0'}
    if(max_p===''){max_p='99999'}
    filter = filter.filter((data)=>{
      if(data.IsHourRent && contextState.BookWay=='H'){
        return (parseFloat(min_p) <= data.PricePerHour && data.PricePerDay <= parseFloat(max_p));
      }
      else if(data.IsDayRent && contextState.BookWay=='D'){
        return parseFloat(min_p) <= data.PricePerDay && data.PricePerDay <= parseFloat(max_p);
      }
      else if(data.isWeekRent && contextState.BookWay=='W')  {
        return parseFloat(min_p) <= data.PricePerWeek && data.PricePerDay <= parseFloat(max_p);
      }
      return false;
    });
    console.log('minP'+min_p+'maxP'+max_p);
    // 筛选位置
    if(contextState.Carlocation!==''){
      filter=filter.filter((data)=>{
        return data.SpotAddr.includes(contextState.Carlocation);
      })
    }
    // 删选车位类型
    if(contextState.CarType!==''){
      filter=filter.filter((data)=>{
        return data.size===contextState.CarType;
      })
    }
    if(contextState.order_rank_way===true && contextState.score_rank_way==true){
      filter.sort((a, b) => {
        // 首先根据rate字段排序
        if (a.Rate !== b.Rate) {
          return b.Rate - a.Rate; // 降序排序，对于降序排序使用 b.rate - a.rate
        }
        return b.OrderNum - a.OrderNum; // 同样，这里是降序排序
      });
    }
    else if(contextState.order_rank_way===true && contextState.score_rank_way==false){
      filter.sort((a, b) => {
        // 首先根据rate字段排序
        if (a.Rate !== b.Rate) {
          return a.Rate - b.Rate; // 升序排序，对于降序排序使用 b.rate - a.rate
        }
        // 如果rate相同，根据number字段排序
        return b.OrderNum - a.OrderNum; // 这里是降序排序
      });
    }else if(contextState.order_rank_way===false && contextState.score_rank_way==true){
      filter.sort((a, b) => {
        // 首先根据rate字段排序
        if (a.Rate !== b.Rate) {
          return b.Rate - a.Rate; // 降序排序，对于降序排序使用 b.rate - a.rate
        }
        // 如果rate相同，根据number字段排序
        return a.OrderNum - b.OrderNum; // 这里是升序排序
      });
    }
    else if(contextState.order_rank_way===false && contextState.score_rank_way==false){
      filter.sort((a, b) => {
        // 首先根据rate字段排序
        if (a.Rate !== b.Rate) {
          return a.Rate - b.Rate; // 升序排序，对于降序排序使用 b.rate - a.rate
        }
        // 如果rate相同，根据number字段排序
        return a.OrderNum - b.OrderNum; // 同样，这里是升序排序
      });
    }
    console.log('order amount ' + contextState.order_rank_way + ' rate amount ' + contextState.score_rank_way);
    console.log(filter);
    setfilrerSpot(filter);
  },[contextState,allSpot]);
  function getNewSpot() {
    callAPIGetAllSpot('spot/list', localStorage.getItem('token'))
      .then((response) => {
        console.log(response);
        setAllSpot((prevSpots) => [...prevSpots, ...response.message]); // Correctly update state
      })
      .catch((error) => {
        setOpenSnackbar({
          severity: 'warning',
          message: error,
          timestamp: new Date().getTime(),
        });
      });
  }
  return (
    <div className='container-all'>
      {filteredSpot.map((spot, index) => (
        <div key={index} className='SpaceOverall'>
          <img
            className='spaceimg'
            src={'data:image/jpeg;base64,' + spot.Picture || 'img/sample.jpeg'}
          ></img>
          <div className='info'>
            <div className='right-top'>
              <p className='space-title'>
                {spot.SpotName + ' ' + spot.SpotType}
              </p>
              <div className='rate-part'>
                <img src='img/star.png' className='rate-img'></img>
                <p className='rate-txt'>{spot.Rate}</p>
              </div>
            </div>
            <p className='space-price'>$38.00/day</p>
            <p className='space-location'>{spot.SpotAddr}</p>
            <p className='space-type'>Fits a {spot.SpotType}</p>
            <div className='right-bottom'>
              <div className='order-part'>
                <img src='img/booking.png' className='order-times'></img>
                <p className='times'>{spot.OrderNum}</p>
              </div>
              <button
                className='specific-info'
                id={spot.ID}
                onClick={goesSpecific}
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function HomePageLarge() {
  const { contextState, updateContextState } = useContext(AppContext);
  const [orderway,setorderway] = useState('');
  const [minP, setminP] = useState(contextState.minPrise);
  const [maxP, setmaxP] = useState(contextState.maxPrise);
  const [fitsize, setsize] = useState(contextState.CarType);
  const [R, setR] = useState(contextState.score_rank_way);
  const [O, setO] = useState(contextState.order_rank_way);
  const [startDate, setstartDate] = useState(dayjs(contextState.StartDay));
  const [endDate, setendDate] = useState(dayjs(contextState.EndDay));
  const handleStartDate=(event)=>{
    setstartDate(event);
    updateContextState({
      StartDay: event
    });
  }
  const handleEndDate=(event)=>{
    setendDate(event);
    updateContextState({
      EndDay: event
    });
  }
  const handlePopChange = (event) => {
    let res = event.target.value;
    setR(res === '0');
    updateContextState({
      order_rank_way: (res==='0')
    });
    console.log(contextState);
  };
  const handleLocation = (event) => {
    setmaxP(event.target.value);
    updateContextState({
      Carlocation: event.target.value
    });
  }
  const handleOrdChange = (event) => {
    let res = event.target.value;
    setO(res === '0');
    updateContextState({
      score_rank_way: (res==='0')
    });
    console.log(contextState);
  };
  const handleOrdwayChange = (event) => {
    updateContextState({
      BookWay: event.target.value
    });
    console.log(contextState);
  };
  const handleminpriceChange=(event)=>{
    setminP(event.target.value);
    updateContextState({
      minPrise: event.target.value
    });
  }
  const handlemaxpriceChange=(event)=>{
    setmaxP(event.target.value);
    updateContextState({
      maxPrise: event.target.value
    });
  }
  const { _ , setOpenSnackbar } = useError();
  let token = localStorage.getItem('token') || null;
  let currentuser = localStorage.getItem('email') || null;
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
  let goesDashboard = () => {
    navigate('/' + currentuser + '/dashboard');
  };
  let CreatSpace = () => {
    if (token) {
      navigate('/' + currentuser + '/createspace');
    } else {
      navigate('/userlogin');
    }
  };
  let ChooseCar = () => {
    if (token) {
      navigate('/' + currentuser + '/choose');
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
          <img className='searchbtn-home' src='/img/search.png'></img>
          {/* 搜索输入框 */}
          <input className='Searchbar' placeholder='Search by location' value={contextState.Carlocation} onChange={handleLocation}></input>
        </div>
        {/* 新建车位按钮 */}
        <button className='newspace' onClick={CreatSpace}>
          Lease your Car Space
        </button>
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
        <p className = 'image-container-title'>
          Find Closer, Cheaper Parking Anywhere in Australia
        </p>
        <p className = 'image-container-sub'>
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
          defaultValue={contextState.order_rank_way}
          className='form-select mglr'
          aria-label='Default select example'
          onChange={handlePopChange}
        >
          <option value='0'>Highest sales</option>
          <option value='1'>Lowest sales</option>
        </select>
        <select
          defaultValue={contextState.score_rank_way}
          className='form-select mglr'
          aria-label='Default select example'
          onChange={handleOrdChange}
        >
          <option value='0'>Highest rates</option>
          <option value='1'>Lowest rates</option>
        </select>
        <select
          defaultValue={contextState.BookWay}
          className='form-select mglr-r'
          aria-label='Default select example'
          onChange={handleOrdwayChange}
        >
          <option value='H'>Hourly</option>
          <option value='D'>Daily</option>
          <option value='W'>Weekly</option>
        </select>
        {orderway==='H'?(
            <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              className='timechoice'
              label='Parking time'
              value={startDate}
              onChange={handleStartDate}
            />
            <DateTimePicker
              className='timechoice'
              label='Leaving time'
              value={endDate}
              onChange={handleEndDate}
            />
          </LocalizationProvider>
        ):
        (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            className='timechoice'
            label='Parking time'
            value={startDate}
            onChange={handleStartDate}
          />
          <DatePicker
            className='timechoice'
            label='Leaving time'
            value={endDate}
            onChange={handleEndDate}
          />
        </LocalizationProvider>
        )
        }
        <div className='pricerange'>
          <label className='pricerange'>MIN$</label>
          <input className='pricerange' value={minP} onChange={handleminpriceChange}></input>
        </div>
        <div className='pricerange'>
          <label className='pricerange'>MAX$</label>
          <input className='pricerange' value={maxP} onChange={handlemaxpriceChange}></input>
        </div>
        <button className='selectcar' onClick={ChooseCar}>
          SELECT YOUR CAR
        </button>
      </div>
      {/* 所有车位列表 */}
      <div className='ListingPart'>
        <AllSpoting />
      </div>
    </div>
  );
}

export function HomePageSmall() {
  let currentuser = localStorage.getItem('email') || null;
  const { contextState, updateContextState } = useContext(AppContext);
  const [orderway,setorderway] = useState('');
  const [minP, setminP] = useState(contextState.minPrise);
  const [maxP, setmaxP] = useState(contextState.maxPrise);
  const [fitsize, setsize] = useState(contextState.CarType);
  const [R, setR] = useState(contextState.score_rank_way);
  const [O, setO] = useState(contextState.order_rank_way);
  const [startDate, setstartDate] = useState(dayjs(contextState.StartDay));
  const [endDate, setendDate] = useState(dayjs(contextState.EndDay));
  const handleStartDate=(event)=>{
    setstartDate(event);
    updateContextState({
      StartDay: event
    });
  }
  const handleEndDate=(event)=>{
    setendDate(event);
    updateContextState({
      EndDay: event
    });
  }
  const handlePopChange = (event) => {
    let res = event.target.value;
    setR(res === '0');
    updateContextState({
      order_rank_way: (res==='0')
    });
    console.log(contextState);
  };
  const handleLocation = (event) => {
    setmaxP(event.target.value);
    updateContextState({
      Carlocation: event.target.value
    });
  }
  const handleOrdChange = (event) => {
    let res = event.target.value;
    setO(res === '0');
    updateContextState({
      score_rank_way: (res==='0')
    });
    console.log(contextState);
  };
  const handleOrdwayChange = (event) => {
    updateContextState({
      BookWay: event.target.value
    });
    console.log(contextState);
  };
  const handleminpriceChange=(event)=>{
    setminP(event.target.value);
    updateContextState({
      minPrise: event.target.value
    });
  }
  const handlemaxpriceChange=(event)=>{
    setmaxP(event.target.value);
    updateContextState({
      maxPrise: event.target.value
    });
  }
  const [clickCount, setClickCount] = useState(0);
  const goesSpecific = (event) => {
    const target = event.target;
    if (target.id) {
      if (localStorage.getItem('token')) {
        const username = localStorage.getItem('email');
        navigate('/' + username + '/' + target.id);
      } else {
        navigate('/' + target.id);
      }
    }
  };
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
  let ChooseCar = () => {
    if (token) {
      navigate('/' + currentuser + '/choose');
    } else {
      navigate('/userlogin');
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
    navigate('/:username/dashboard');
  };
  // 主页内容
  return (
    // 主页背景框
    <div className='HomeOverall'>
      {/* 导航栏 */}
      <div className='Navbar'>
        {/* Logo图像 */}
        <img
          src='/img/LOGO.svg'
          className='Applogo'
          onClick={goesLoginAdmin}
        ></img>
        {/* 搜索区域 */}
        <div className='SearchPartsmall'>
          {/* 搜索图标 */}
          <img className='searchbtnsmall' src='/img/search.png'></img>
          {/* 搜索输入框 */}
          <input className='Searchbar' placeholder='Search by location' value={contextState.Carlocation} onChange={handleLocation}></input>
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
              defaultValue={contextState.order_rank_way}
              className='form-select mglr-s'
              aria-label='Default select example'
              onChange={handleOrdChange}
            >
              <option value='0'>Highest sales</option>
              <option value='1'>Lowest sales</option>
            </select>
            <select
              defaultValue={contextState.score_rank_way}
              className='form-select mglr-s'
              aria-label='Default select example'
              onChange={handlePopChange}
            >
              <option value='0'>Highest rates</option>
              <option value='1'>Lowest rates</option>
            </select>
          </div>
          <div className='input-group width-20'>
            <span className='input-group-text'>MIN$</span>
            <input
              type='text'
              className='form-control'
              aria-label='Dollar amount (with dot and two decimal places)'
              value={contextState.minPrise} onChange={handleminpriceChange}
            ></input>
          </div>
          <div className='input-group width-20'>
            <span className='input-group-text'>MAX$</span>
            <input
              type='text'
              className='form-control'
              aria-label='Dollar amount (with dot and two decimal places)'
              value={contextState.maxPrise} onChange={handlemaxpriceChange}
            ></input>
          </div>
          {/* <div className='hflex'>
            <label className='pricerange-s'>MAX$</label>
            <input className='pricerange-s'></input>
          </div> */}

          <button className='selectcar' onClick={ChooseCar}>SELECT YOUR CAR</button>
        </div>
        <div className='filter-bottom'>
          <select
            defaultValue={contextState.BookWay}
            className='form-select mglr-s-r'
            aria-label='Default select example'
            onChange={handleOrdwayChange}
          >
            <option value='H'>Hourly</option>
            <option value='D'>Daily</option>
            <option value='W'>Weekly</option>
          </select>
          {contextState.BookWay==='H'?(
            <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              className='timechoice-s'
              label='Parking time'
              value={startDate}
              onChange={handleStartDate}
            />
            <DateTimePicker
              className='timechoice-s'
              label='Leaving time'
              value={endDate}
              onChange={handleEndDate}
            />
          </LocalizationProvider>
        ):
        (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            className='timechoice-s'
            label='Parking time'
            value={startDate}
            onChange={handleStartDate}
          />
          <DatePicker
            className='timechoice-s'
            label='Leaving time'
            value={endDate}
            onChange={handleEndDate}
          />
        </LocalizationProvider>
        )
        }
        </div>
      </div>
      {/* 所有车位列表 */}
      <AllSpoting/>
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
