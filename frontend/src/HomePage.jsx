import React, { useState, useContext, useEffect, useRef } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DatePicker } from '@mui/x-date-pickers';
import './HomePage.css';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { callAPIGetAllSpot, useError } from './API';
import { AppContext } from './App';
function AllSpoting() {
  // initialize the page number as 1
  const [page,setPage] = useState(1);
  // initialize the spot list
  const { contextState } = useContext(AppContext);
  // use the navigate function to navigate to the detail page
  const navigate = useNavigate();
  const [isBottom, setIsBottom] = useState(false);
  // when user want to see the detail of the spot
  const goesSpecific = (event) => {
    // get the target spot id
    const target = event.target;
    // store the spot id in the local storage
    localStorage.setItem('spotID', target.id);
    // if the target has an id, then navigate to the detail page
    if (target.id) {
      // scroll to the top of the page
      window.scrollTo(0, 0);
      // if the user is logged in, then navigate to the detail page with the username
      if (localStorage.getItem('token')) {
        const username = localStorage.getItem('email');
        navigate('/' + username + '/detail/' + target.id);
      } else {
        // if the user is not logged in, then navigate to the detail page without the username
        navigate('/tourists/detail/' + target.id);
      }
    }
  };
  // initialize snackbar to show the error message
  const { setOpenSnackbar } = useError();
  // get the spot list
  let [allSpot, setAllSpot] = useState([]);
  // get the filtered spot list
  let [filteredSpot, setfilrerSpot] = useState([]);
  // initialize the content reference
  const contentRef = useRef(null);
  // initialize the loading status as true
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // get the new spot list
    function getNewSpot() {
      // call the API to get the new spot list
      callAPIGetAllSpot('spot/list', localStorage.getItem('token'), page)
        .then((response) => {
          // if the response is not null, then update the spot list
          if (response && response.message) {
            // update the spot list
            
            setAllSpot((prevSpots) => [...prevSpots, ...response.message]); // Correctly update state
            // page number plus 1
            setPage(page+1);
          }
          if(!response.message){
            setIsBottom(true);
          }
          setIsLoading(false); // 完成加载后设置为 false
        })
        .catch((error) => {
          // open the snackbar to show the error message
          setOpenSnackbar({
            severity: 'warning',
            message: error,
            timestamp: new Date().getTime(),
          });
          setIsLoading(false); // 完成加载后设置为 false
        });
    }
    if (isLoading) {
      // get the new spot list
      getNewSpot();
    }
  }, [isLoading, page, setOpenSnackbar]);
  // load the page
  useEffect(() => {
    
    // add the scroll listener
    const scListener = () => {
      // get the content reference
      const sc = contentRef.current;
      // if not loading and the scroll bar reaches the bottom, then load the new spot
      // if we reach the bottom of the page and not loading, then load the new spot
      if (!isLoading && sc.scrollHeight - sc.scrollTop <= sc.clientHeight) {
        setIsLoading(true);
        console.log('Reached the bottom');
      }
    };
    // get the content reference
    const element = contentRef.current;
    // add the scroll listener
    element.addEventListener('scroll', scListener);
    // remove the scroll listener for the cleanup
    return () => {
      element.removeEventListener('scroll', scListener);
    };
  }, [isLoading]);
  // when the page number changes, load the new spot
  useEffect(() => {
    // filter the spot list based on the booking way
    let filter = allSpot.filter((data) => {
      if (contextState.BookWay === 'H') {
        return data.IsHourRent;
      } else if (contextState.BookWay === 'D') {
        return data.IsDayRent;
      } else if (contextState.BookWay === 'W') {
        return data.IsWeekRent;
      } else {
        return true;
      }
    });
    // filter the spot list based on the price range
    let min_p = contextState.minPrise;
    let max_p = contextState.maxPrise;
    // if the min price is empty, then set it as 0
    if (min_p === '') {
      min_p = '0';
    }
    // if the max price is empty, then set it as 99999
    if (max_p === '') {
      max_p = '99999';
    }
    // filter the spot list based on the price range
    filter = filter.filter((data) => {
      // if the booking way is hourly, then filter the spot list based on the hourly price
      if (data.IsHourRent && contextState.BookWay === 'H') {
        return (
          parseFloat(min_p) <= data.PricePerHour &&
          data.PricePerHour <= parseFloat(max_p)
        );
      }
      // if the booking way is daily, then filter the spot list based on the daily price
      else if (data.IsDayRent && contextState.BookWay === 'D') {
        return (
          parseFloat(min_p) <= data.PricePerDay &&
          data.PricePerDay <= parseFloat(max_p)
        );
      }
      // if the booking way is weekly, then filter the spot list based on the weekly price
      else if (data.IsWeekRent && contextState.BookWay === 'W') {
        return (
          parseFloat(min_p) <= data.PricePerWeek &&
          data.PricePerWeek <= parseFloat(max_p)
        );
      }
      return false;
    });
    // filter the spot list based on the location
    if (contextState.Carlocation !== '') {
      filter = filter.filter((data) => {
        let res = '';
        try {
          // Assuming the JSON.parse(spot.SpotAddr) is an object with a property you want to display
          // For example, if it's an object like { "address": "123 Main St." }
          // you could return the address like so:
          const add = JSON.parse(data.SpotAddr);
          res =
            add.Street +
            ', ' +
            add.City +
            ', ' +
            add.State +
            ', ' +
            add.Country +
            ', ' +
            add.Postcode; // replace 'address' with the actual property name you want to display
        } catch (e) {
          res = data.SpotAddr; // or return some default message or component
        }
        // filter the spot list based on the location
        return res.includes(contextState.Carlocation);
      });
    }
    // filter the spot list based on the car type
    if (contextState.CarType !== '') {
      // filter the spot list based on the car type
      filter = filter.filter((data) => {
        return data.Size === contextState.CarType;
      });
    }
    // filter the spot list based on the start and end day
    if(contextState.StartDay !== null && contextState.EndDay !== null){
      // filter the spot list which has one available time that is between the start and end day
      filter = filter.filter((data) => {
        let phasedata = JSON.parse(data.AvailableTime);
        // for each available time, check if the start and end day is between the available time
        let result = phasedata.find((times) => {
          return dayjs(times.startDate) <= contextState.StartDay && dayjs(times.endDate)  >= contextState.EndDay;
        });
        if(result){
          return true;
        }
        else{
          return false;
        }
      });
    }
    // get the order method
    if (contextState.order_rank_way === 0) {
      // increasing order of score
      if (contextState.score_rank_way === 1) {
        filter.sort((a, b) => {
          return b.Rate - a.Rate;
        });
      }
      // decreasing order of score
      else if (contextState.score_rank_way === 2) {
        filter.sort((a, b) => {
          return a.Rate - b.Rate;
        });
      }
    } else if (contextState.score_rank_way === 0) {
      // descending order of order number
      if (contextState.order_rank_way === 1) {
        filter.sort((a, b) => {
          return b.OrderNum - a.OrderNum;
        });
      }
      // increasing order of order number
      else if (contextState.order_rank_way === 2) {
        filter.sort((a, b) => {
          return a.OrderNum - b.OrderNum;
        });
      }
    } else if (
      contextState.order_rank_way === 1 &&
      contextState.score_rank_way === 1
    ) {
      // descending order of rate and order number
      filter.sort((a, b) => {
        if (a.Rate !== b.Rate) {
          return b.Rate - a.Rate;
        }
        return b.OrderNum - a.OrderNum;
      });
    } else if (
      contextState.order_rank_way === 1 &&
      contextState.score_rank_way === 2
    ) {
      filter.sort((a, b) => {
        // increase order of rate and order number
        if (a.Rate !== b.Rate) {
          return a.Rate - b.Rate;
        }
        return b.OrderNum - a.OrderNum;
      });
    } else if (
      contextState.order_rank_way === 2 &&
      contextState.score_rank_way === 1
    ) {
      // increase order of rate and order number
      filter.sort((a, b) => {
        if (a.Rate !== b.Rate) {
          return b.Rate - a.Rate;
        }
        return a.OrderNum - b.OrderNum;
      });
    } else if (
      contextState.order_rank_way === 2 &&
      contextState.score_rank_way === 2
    ) {
      // increase order of rate and order number
      filter.sort((a, b) => {
        if (a.Rate !== b.Rate) {
          return a.Rate - b.Rate;
        }
        return a.OrderNum - b.OrderNum;
      });
    }
    // log the filtered spot list
    console.log(filter);
    setfilrerSpot(filter);
  }, [contextState, allSpot]);

  return (
    <div className='container-all' ref={contentRef}>
      {filteredSpot.map((spot, index) => (
        <div key={index} className='SpaceOverall'>
          <img
            className='spaceimg'
            alt=''
            src={
              spot.Picture || 'img/sample.jpeg'
            }
          ></img>
          <div className='info'>
            <div className='right-top'>
              <p className='space-title'>
                {spot.SpotName + ' ' + spot.SpotType}
              </p>
              <div className='rate-part'>
                <img src='img/star.png' className='rate-img' alt=''></img>
                <p className='rate-txt'>{spot.Rate}</p>
              </div>
            </div>
            {contextState.BookWay === 'H' && (
              <p className='space-price'>
                ${spot.PricePerHour.toFixed(2)}/hour
              </p>
            )}
            {contextState.BookWay === 'D' && (
              <p className='space-price'>${spot.PricePerDay.toFixed(2)}/day</p>
            )}
            {contextState.BookWay === 'W' && (
              <p className='space-price'>
                ${spot.PricePerWeek.toFixed(2)}/week
              </p>
            )}
            <p className='space-location'>
              {(() => {
                try {
                  // Assuming the JSON.parse(spot.SpotAddr) is an object with a property you want to display
                  // For example, if it's an object like { "address": "123 Main St." }
                  // you could return the address like so:
                  const add = JSON.parse(spot.SpotAddr);
                  return (
                    add.Street +
                    ', ' +
                    add.City +
                    ', ' +
                    add.State +
                    ', ' +
                    add.Country +
                    ', ' +
                    add.Postcode
                  ); // replace 'address' with the actual property name you want to display
                } catch (e) {
                  return spot.SpotAddr; // or return some default message or component
                }
              })()}
            </p>
            <p className='space-type'>Fits a {spot.Size}</p>
            <div className='right-bottom'>
              <div className='order-part'>
                <img src='img/booking.png' className='order-times' alt=''></img>
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
      { !isBottom && isLoading && <p className='Lod'>Loading...</p>}
      { (isBottom || (filteredSpot.length===0 && !isLoading)) && <p className='Lod'>No more Spots</p>}
    </div>
  );
}
// This is the large version of the home page
export function HomePageLarge() {
  
  // get the token from the local storage
  let token = localStorage.getItem('token') || null;
  // get the current user from the local storage
  let currentuser = localStorage.getItem('email') || null;
  // get the admin id from the local storage
  let AdminId = localStorage.getItem('AdminId') || null;
  // use the navigate function
  let navigate = useNavigate();
  useEffect(() => {
    if (AdminId) {
      navigate('/admin/' + AdminId);
    }
    if (currentuser) {
      navigate('/' + currentuser);
    }
  },[]);

  // according to the current user, navigate to the corresponding page
  // get the context state and update function
  const { contextState, updateContextState } = useContext(AppContext);
  // get the min and max price
  const [minP, setminP] = useState(contextState.minPrise);
  const [maxP, setmaxP] = useState(contextState.maxPrise);
  // handle the change of the start date
  const handleStartDate = (event) => {
    updateContextState({
      StartDay: event,
    });
  };
  // handle the change of the end date
  const handleEndDate = (event) => {
    updateContextState({
      EndDay: event,
    });
  };
  // handle the change of the pop way
  const handlePopChange = (event) => {
    // get the value of the event
    let res = event.target.value;
    // update the context state
    updateContextState({
      order_rank_way: Number(res),
    });
    // log the context state
    console.log(contextState);
  };
  // handle the change of the location
  const handleLocation = (event) => {
    // update the context state
    updateContextState({
      Carlocation: event.target.value,
    });
  };
  // handle the change of the order way
  const handleOrdChange = (event) => {
    let res = event.target.value;
    // update the context state
    updateContextState({
      score_rank_way: Number(res),
    });
    console.log(contextState);
  };
  // handle the change of the book way
  const handleOrdwayChange = (event) => {
    // update the context state
    updateContextState({
      BookWay: event.target.value,
    });
    console.log(contextState);
  };
  // handle the change of the min and max price
  const handleminpriceChange = (event) => {
    setminP(event.target.value);
    updateContextState({
      minPrise: event.target.value,
    });
  };
  // handle the change of the max price
  const handlemaxpriceChange = (event) => {
    setmaxP(event.target.value);
    updateContextState({
      maxPrise: event.target.value,
    });
  };
  // get the snackbar to show the message
  const { setOpenSnackbar } = useError();
  // go to the user login page
  let goesLoginUser = () => {
    navigate('/userlogin');
  };
  // go to the user register page
  let goesRegistUser = () => {
    navigate('/userregist');
  };
  // go to the dashboard page
  let goesDashboard = () => {
    navigate('/' + currentuser + '/dashboard');
  };
  // go to the create space page
  let CreatSpace = () => {
    // get the token from the local storage
    if (token) {
      navigate('/' + currentuser + '/createspace');
    }
    // goes to the user login page
    else {
      navigate('/userlogin');
    }
  };
  // go to the choose car page
  let ChooseCar = () => {

    // get the token from the local storage
    if (token) {
      // navigate to the choose car page
      navigate('/' + currentuser + '/choose');
    } else {
      // navigate to the user login page
      navigate('/userlogin');
    }
  };
  // goes to the logout page
  let logout = () => {
    // if the token is in the local storage
    if (localStorage.getItem('token')) {
      // clear the local storage
      localStorage.clear();
      // navigate to the home page
      navigate('/');
      // show the snackbar message of logout successful
      setOpenSnackbar({
        severity: 'success',
        message: 'Logout successful',
        timestamp: new Date().getTime(),
      });
    }
  };
  const [clickCount, setClickCount] = useState(0);

  // set the time limit of the continuous click, for example, the three consecutive clicks must be completed within 500 milliseconds
  const clickTimeLimit = 1000;
  // set the timeout id
  let timeoutId = null;
  // go to the admin login page
  const goesLoginAdmin = () => {
    // set a timer for the first click
    if (clickCount === 0) {
      // if the user does not complete the five consecutive clicks within the specified time, the click count will be reset
      timeoutId = setTimeout(() => {
        setClickCount(0);
      }, clickTimeLimit);
    }
    // set the new count
    const newCount = clickCount + 1;
    setClickCount(newCount);
    // if the user completes the five consecutive clicks within the specified time, the click count will be reset
    if (newCount === 5) {
      clearTimeout(timeoutId);
      navigate('/adminlogin');
      setClickCount(0);
    }
  };
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
          alt=''
          onClick={goesLoginAdmin}
        ></img>
        {/* 搜索区域 */}
        <div className='SearchPart'>
          {/* 搜索图标 */}
          <img className='searchbtn-home' src='/img/search.png' alt=''></img>
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
        <img src='/img/car.png' width={'100%'} alt=''></img>
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

// Small Screen for the HomePage
export function HomePageSmall() {
  // initial the local storage
  let currentuser = localStorage.getItem('email') || null;
  // get the contextState and updateContextState
  const { contextState, updateContextState } = useContext(AppContext);
  // when the start date change
  const handleStartDate = (event) => {
    updateContextState({
      StartDay: event,
    });
  };
  // when the end date change
  const handleEndDate = (event) => {
    updateContextState({
      EndDay: event,
    });
  };
  // when the pop rank way change
  const handlePopChange = (event) => {
    let res = event.target.value;
    updateContextState({
      score_rank_way: Number(res),
    });
    console.log(contextState);
  };
  // when the Location change
  const handleLocation = (event) => {
    updateContextState({
      Carlocation: event.target.value,
    });
  };
  // when the order rank way change
  const handleOrdChange = (event) => {
    let res = event.target.value;
    updateContextState({
      order_rank_way: Number(res),
    });
  };
  // when the book way change
  const handleOrdwayChange = (event) => {
    updateContextState({
      BookWay: event.target.value,
    });
  };
  // when the min price change
  const handleminpriceChange = (event) => {
    updateContextState({
      minPrise: event.target.value,
    });
  };
  // when the max price change
  const handlemaxpriceChange = (event) => {
    updateContextState({
      maxPrise: event.target.value,
    });
  };
  // initial the click count as 0
  const [clickCount, setClickCount] = useState(0);
  // set the time limit
  const clickTimeLimit = 1000;
  let timeoutId = null;
  // click 5 times to enter the admin login page
  const goesLoginAdmin = () => {
    if (clickCount === 0) {
      // when the user click the button, it will set a timer
      // if user not click the button in the time limit, it will reset the click count
      timeoutId = setTimeout(() => {
        // reset the click count
        setClickCount(0);
      }, clickTimeLimit);
    }
    // update the click count
    const newCount = clickCount + 1;
    // set the click count
    setClickCount(newCount);
    // if the click count is 5, it will enter the admin login page
    if (newCount === 5) {
      // go to the admin login page
      clearTimeout(timeoutId);
      navigate('/adminlogin');
      setClickCount(0);
    }
  };
  // Choose the car
  let ChooseCar = () => {
    // get the token
    if (token) {
      // go to the choose car page
      navigate('/' + currentuser + '/choose');
    } else {
      // go to the user login page
      navigate('/userlogin');
    }
  };
  // set the snackbar
  const { setOpenSnackbar } = useError();
  // get the token
  let token = localStorage.getItem('token');
  // use the navigate
  let navigate = useNavigate();
  // go to the user login page
  let goesLoginUser = () => {
    navigate('/userlogin');
  };
  // go to the user register page
  let goesRegistUser = () => {
    navigate('/userregist');
  };
  // const [parkingTime, setParkingTime] = useState(dayjs(new Date()));
  // const [leavingTime, setLeavingTime] = useState(dayjs(new Date()));
  // const handleParkingTimeChange = (time) => {
  //   setParkingTime(time);
  // };
  // const handleLeavingTimeChange = (time) => {
  //   setLeavingTime(time);
  // };
  // go to the logout page
  let logout = () => {
    // if the token is exist, it will clear the local storage and go to the home page
    if (localStorage.getItem('token')) {
      localStorage.clear();
      // navigate to the home page
      navigate('/');
      // set the snackbar
      setOpenSnackbar({
        severity: 'success',
        message: 'Logout successful',
        timestamp: new Date().getTime(),
      });
    }
  };
  // go to the dashboard page
  let goesDashboard = () => {
    navigate('/:username/dashboard');
  };
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
          alt=''
        ></img>
        {/* 搜索区域 */}
        <div className='SearchPartsmall'>
          {/* 搜索图标 */}
          <img className='searchbtnsmall' src='/img/search.png' alt=''></img>
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
        <img src='/img/car.png' width={'100%'} alt=''></img>
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
