import React, {
  useState,
  ChangeEvent,
  useContext,
  LabelHTMLAttributes,
  useEffect,
  useRef,
  contentRef
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
import { getUserInfo } from './components/API';
import { callAPIGetAllSpot, useError } from './API';
import { AppContext } from './App';
import { private_createTypography } from '@mui/material';
// 未登录状态的用户页面

function AllSpoting() {
  let page=1;
  const { contextState, updateContextState } = useContext(AppContext);
  const navigate = useNavigate();
  const goesSpecific = (event) => {
    const target = event.target;
    localStorage.setItem('spotID', target.id);
    if (target.id) {
      window.scrollTo(0, 0);
      if (localStorage.getItem('token')) {
        const username = localStorage.getItem('email');
        navigate('/' + username + '/detail/' + target.id);
      } else {
        navigate('/tourists/detail/' + target.id);
      }
    }
  };
  const { _ , setOpenSnackbar } = useError();
  let [allSpot, setAllSpot] = useState([]);
  let [filteredSpot, setfilrerSpot] = useState([]);
  const contentRef = useRef(null);
  const [isLoading,setIsLoading]=useState(false);
  useEffect(() => {
    getNewSpot();
    const scListener = () => {
      const sc = contentRef.current;
      if (!isLoading && sc.scrollHeight - sc.scrollTop <= sc.clientHeight) {
        setIsLoading(true);
        console.log("Reached the bottom");
        getNewSpot();
      }
    };
    const element = contentRef.current;
    console.log(element);
    element.addEventListener('scroll', scListener);

    return () => {
      element.removeEventListener('scroll', scListener);
    };
  }, []); 
  useEffect(() => {
    // 删选预订方式
    let filter = allSpot.filter((data) => {
      if (contextState.BookWay === "H") {
        return data.IsHourRent;
      } else if (contextState.BookWay === 'D') {
        return data.IsDayRent;
      } else if (contextState.BookWay === "W") {
        return data.IsWeekRent;
      } else {
        return true;
      }
    });
    // 筛选价格
    let min_p = contextState.minPrise;
    let max_p = contextState.maxPrise;
    if (min_p === '') {
      min_p = '0';
    }
    if (max_p === '') {
      max_p = '99999';
    }
    filter = filter.filter((data) => {
      if (data.IsHourRent && contextState.BookWay == 'H') {
        return (
          parseFloat(min_p) <= data.PricePerHour &&
          data.PricePerHour <= parseFloat(max_p)
        );
      } else if (data.IsDayRent && contextState.BookWay == 'D') {
        return (
          parseFloat(min_p) <= data.PricePerDay &&
          data.PricePerDay <= parseFloat(max_p)
        );
      } else if (data.IsWeekRent && contextState.BookWay == 'W') {
        return (
          parseFloat(min_p) <= data.PricePerWeek &&
          data.PricePerWeek <= parseFloat(max_p)
        );
      }
      return false;
    });
    // console.log('minP' + min_p + 'maxP' + max_p);
    // 筛选位置
    if (contextState.Carlocation !== '') {
      filter = filter.filter((data) => {
        console.log(data);
        let res='';
        try {
          // Assuming the JSON.parse(spot.SpotAddr) is an object with a property you want to display
          // For example, if it's an object like { "address": "123 Main St." }
          // you could return the address like so:
          const add = JSON.parse(data.SpotAddr);
          res = add.Street+', '+add.City+', '+add.State+', '+add.Country+', '+add.Postcode; // replace 'address' with the actual property name you want to display
        } catch (e) {
          res= data.SpotAddr; // or return some default message or component
        }
        return res.includes(contextState.Carlocation);
      });
    }
    // 删选车位类型
    if (contextState.CarType !== '') {
      filter = filter.filter((data) => {
        return data.Size === contextState.CarType;
      });
    }
    console.log(contextState.CarType);

    
    // get the order method
    if(contextState.order_rank_way === 0){
        if(contextState.score_rank_way === 1){
          filter.sort((a, b) => {
            return b.Rate - a.Rate;
          });
        }
        else if(contextState.score_rank_way === 2){
          filter.sort((a, b) => {
            return a.Rate - b.Rate;
          });
        }
    }
    else if(contextState.score_rank_way === 0){
      if(contextState.order_rank_way===1){
        filter.sort((a, b) => {
          return b.OrderNum - a.OrderNum;
        });
      }
      else if(contextState.order_rank_way===2){
        filter.sort((a, b) => {
          return a.OrderNum - b.OrderNum;
        });
      }
      
    }
    else if (
      contextState.order_rank_way === 1 &&
      contextState.score_rank_way === 1
    ) {
      filter.sort((a, b) => {
        // 首先根据rate字段排序
        if (a.Rate !== b.Rate) {
          return b.Rate - a.Rate; // 降序排序，对于降序排序使用 b.rate - a.rate
        }
        return b.OrderNum - a.OrderNum; // 同样，这里是降序排序
      });
    } else if (
      contextState.order_rank_way === 1 &&
      contextState.score_rank_way === 2
    ) {
      filter.sort((a, b) => {
        // 首先根据rate字段排序
        if (a.Rate !== b.Rate) {
          return a.Rate - b.Rate; // 升序排序，对于降序排序使用 b.rate - a.rate
        }
        // 如果rate相同，根据number字段排序
        return b.OrderNum - a.OrderNum; // 这里是降序排序
      });
    } else if (
      contextState.order_rank_way === 2 &&
      contextState.score_rank_way === 1
    ) {
      filter.sort((a, b) => {
        // 首先根据rate字段排序
        if (a.Rate !== b.Rate) {
          return b.Rate - a.Rate; // 降序排序，对于降序排序使用 b.rate - a.rate
        }
        // 如果rate相同，根据number字段排序
        return a.OrderNum - b.OrderNum; // 这里是升序排序
      });
    } else if (
      contextState.order_rank_way === 2 &&
      contextState.score_rank_way == 2
    ) {
      filter.sort((a, b) => {
        // 首先根据rate字段排序
        if (a.Rate !== b.Rate) {
          return a.Rate - b.Rate; // 升序排序，对于降序排序使用 b.rate - a.rate
        }
        // 如果rate相同，根据number字段排序
        return a.OrderNum - b.OrderNum; // 同样，这里是升序排序
      });
    }
    console.log(filter);
    setfilrerSpot(filter);
  }, [contextState, allSpot]);
  function getNewSpot() {
    callAPIGetAllSpot('spot/list', localStorage.getItem('token'),page)
      .then((response) => {
        console.log(response);
        if(response && response.message){
          setAllSpot((prevSpots) => [...prevSpots, ...response.message]); // Correctly update state
          setIsLoading(false); // 完成加载后设置为 false
          page=page+1;
        }
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
    <div className='container-all' ref={contentRef}>
      {filteredSpot.map((spot, index) => (
        <div key={index} className='SpaceOverall'>
          <img
            className='spaceimg'
            src={( spot.Picture.includes('data:image/jpeg;base64,')?spot.Picture: 'data:image/jpeg;base64,' + spot.Picture )|| 'img/sample.jpeg'}
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
            {contextState.BookWay=="H" && <p className='space-price'>${spot.PricePerHour.toFixed(2)}/hour</p>}
            {contextState.BookWay=="D" && <p className='space-price'>${spot.PricePerDay.toFixed(2)}/day</p>}
            {contextState.BookWay=="W" && <p className='space-price'>${spot.PricePerWeek.toFixed(2)}/week</p>}
            <p className='space-location'>
               {
                (() => {
                  try {
                    // Assuming the JSON.parse(spot.SpotAddr) is an object with a property you want to display
                    // For example, if it's an object like { "address": "123 Main St." }
                    // you could return the address like so:
                    const add = JSON.parse(spot.SpotAddr);
                    return add.Street+', '+add.City+', '+add.State+', '+add.Country+', '+add.Postcode; // replace 'address' with the actual property name you want to display
                  } catch (e) {
                    return spot.SpotAddr; // or return some default message or component
                  }
                })()
              }
            </p>
            <p className='space-type'>Fits a {spot.Size}</p>
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
  let token = localStorage.getItem('token') || null;
  let currentuser = localStorage.getItem('email') || null;
  let AdminId = localStorage.getItem('AdminId')||null;
  let navigate = useNavigate();
  useEffect(()=>{
    if(AdminId){
      navigate('/admin/' + AdminId);
    }
    if(currentuser){
      navigate('/' + currentuser);
    }
  },[])

  const { contextState, updateContextState } = useContext(AppContext);
  const [minP, setminP] = useState(contextState.minPrise);
  const [maxP, setmaxP] = useState(contextState.maxPrise);
  const handleStartDate = (event) => {
    updateContextState({
      StartDay: event,
    });
  };
  const handleEndDate = (event) => {
    updateContextState({
      EndDay: event,
    });
  };
  const handlePopChange = (event) => {
    let res = event.target.value;
    updateContextState({
      order_rank_way: Number(res),
    });
    console.log(contextState);
  };
  const handleLocation = (event) => {
    updateContextState({
      Carlocation: event.target.value,
    });
  };
  const handleOrdChange = (event) => {
    let res = event.target.value;
    updateContextState({
      score_rank_way: Number(res),
    });
    console.log(contextState);
  };
  const handleOrdwayChange = (event) => {
    updateContextState({
      BookWay: event.target.value,
    });
    console.log(contextState);
  };
  const handleminpriceChange = (event) => {
    setminP(event.target.value);
    updateContextState({
      minPrise: event.target.value,
    });
  };
  const handlemaxpriceChange = (event) => {
    setmaxP(event.target.value);
    updateContextState({
      maxPrise: event.target.value,
    });
  };
  const { _ , setOpenSnackbar } = useError();
  // 调库
  // 进入用户登录页面
  let goesLoginUser = () => {
    navigate('/userlogin');
  };
  // 进入用户注册页面
  let goesRegistUser = () => {
    navigate('/userregist');
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
      localStorage.clear();
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
          <input
            className='Searchbar'
            placeholder='Search by location'
            value={contextState.Carlocation}
            onChange={handleLocation}
          ></input>
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
          defaultValue={contextState.order_rank_way}
          className='form-select mglr'
          aria-label='Default select example'
          onChange={handlePopChange}
        >
          <option value={0}>Default</option>
          <option value={1}>Highest sales</option>
          <option value={2}>Lowest sales</option>
        </select>
        <select
          defaultValue={contextState.score_rank_way}
          className='form-select mglr'
          aria-label='Default select example'
          onChange={handleOrdChange}
        >
          <option value={0}>Default</option>
          <option value={1}>Highest rates</option>
          <option value={2}>Lowest rates</option>
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
        {contextState.BookWay === 'H' ? (
          <div className='fx-100-x-l'>
            <div className='timechoice'>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label='Parking'
                  value={contextState.StartDay}
                  onChange={handleStartDate}
                />
              </LocalizationProvider>
            </div>
            <div className='timechoice'>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label='Leaving'
                  value={contextState.EndDay}
                  onChange={handleEndDate}
                />
              </LocalizationProvider>
            </div>
          </div>
        ) : (
          <div className='fx-100-x-l'>
          <div className='timechoice'>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label='Parking'
                value={contextState.StartDay}
                onChange={handleStartDate}
              />
            </LocalizationProvider>
          </div>
          <div className='timechoice'>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label='Leaving'
                value={contextState.EndDay}
                onChange={handleEndDate}
              />
            </LocalizationProvider>
          </div>
        </div>
        )}
        <div className='pricerange'>
          <label className='pricerange'>MIN$</label>
          <input
            className='pricerange'
            value={minP}
            onChange={handleminpriceChange}
          ></input>
        </div>
        <div className='pricerange'>
          <label className='pricerange'>MAX$</label>
          <input
            className='pricerange'
            value={maxP}
            onChange={handlemaxpriceChange}
          ></input>
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
  const handleStartDate = (event) => {
    updateContextState({
      StartDay: event,
    });
  };
  const handleEndDate = (event) => {
    updateContextState({
      EndDay: event,
    });
  };
  const handlePopChange = (event) => {
    let res = event.target.value;
    updateContextState({
      score_rank_way: Number(res),
    });
    console.log(contextState);
  };
  const handleLocation = (event) => {
    updateContextState({
      Carlocation: event.target.value,
    });
  };
  const handleOrdChange = (event) => {
    let res = event.target.value;
    updateContextState({
      order_rank_way: Number(res),
    });
  };
  const handleOrdwayChange = (event) => {
    console.log(event.target.value);
    updateContextState({
      BookWay: event.target.value,
    });
  };
  const handleminpriceChange = (event) => {
    updateContextState({
      minPrise: event.target.value,
    });
  };
  const handlemaxpriceChange = (event) => {
    updateContextState({
      maxPrise: event.target.value,
    });
  };
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
      localStorage.clear();
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
          <input
            className='Searchbar'
            placeholder='Search by location'
            value={contextState.Carlocation}
            onChange={handleLocation}
          ></input>
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
              value={contextState.minPrise}
              onChange={handleminpriceChange}
            ></input>
          </div>
          <div className='input-group width-20'>
            <span className='input-group-text'>MAX$</span>
            <input
              type='text'
              className='form-control'
              aria-label='Dollar amount (with dot and two decimal places)'
              value={contextState.maxPrise}
              onChange={handlemaxpriceChange}
            ></input>
          </div>
          {/* <div className='hflex'>
            <label className='pricerange-s'>MAX$</label>
            <input className='pricerange-s'></input>
          </div> */}

          <button className='selectcar' onClick={ChooseCar}>
            SELECT YOUR CAR
          </button>
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
          {contextState.BookWay === 'H' ? (
            <div className='fx-100-x'>
              <div className='timechoice-s'>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    label='Parking time'
                    value={contextState.StartDay}
                    onChange={handleStartDate}
                  />
                </LocalizationProvider>
              </div>
              <div className='timechoice-s'>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    label='Leaving time'
                    value={contextState.StartDay}
                    onChange={handleEndDate}
                  />
                </LocalizationProvider>
              </div>
            </div>
          ) : (
            <div className='fx-100-x'>
              <div className='timechoice-s'>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label='Parking time'
                    value={contextState.EndDay}
                    onChange={handleStartDate}
                  />
                </LocalizationProvider>
              </div>
              <div className='timechoice-s'>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label='Leaving time'
                    value={contextState.EndDay}
                    onChange={handleEndDate}
                  />
                </LocalizationProvider>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* 所有车位列表 */}
      <AllSpoting />
    </div>
  );
}
