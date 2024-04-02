import React, {
  useState,
  ChangeEvent,
  useContext,
  LabelHTMLAttributes,
  useEffect,
} from 'react';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { styled } from '@mui/material';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import dayjs from 'dayjs';
import { DatePicker, dayCalendarSkeletonClasses } from '@mui/x-date-pickers';
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
  useParams,
} from 'react-router-dom';
import {
  AdminLoginPage,
  UserLoginPage,
  UserLoginPageForgetPassword,
} from './Login';
import { UserRegistPage, AdminRegistPage } from './Regist';
import { motion, AnimatePresence, distance } from 'framer-motion';
import {
  useError,
  callAPIGetSpecSpot,
  GetDistance,
  callAPIGetSpecUserInfo,
  GetDistanceAll,
  CalculateAllTime,
} from './API';
import './SpecificSpot.css';
import { indigo } from '@mui/material/colors';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import { AppContext } from './App';
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
// this function is the confirmation of the confirm booking.
const CfmContent = styled('div')({
  position: 'absolute',
  zIndex: '4',
  width: '80%',
  height: '550px',
  backgroundColor: 'rgb(255, 255, 255)',
  borderRadius: '10px',
  boxShadow: '0px 1px 10px 1px rgba(42, 42, 42, 0.5)',
});
const CfmHeight = styled('div')({
  width: '100%',
  height: '50px',
  display: 'flex',
  alignItems: 'center',
  borderBottom: '1px solid rgb(200, 200, 200)',
});
const CfmClose = styled('button')({
  alignItems: 'center',
  justifyContent: 'center',
  height: '30px',
  margin: '0px',
  marginLeft: '10px',
  cursor: 'pointer',
  display: 'flex',
  border: '1px solid black',
  width: '90px',
  fontWeight: '500',
  letterSpacing: '0.2px',
  backgroundColor: 'rgb(255, 255, 255)',
  // margin: '20px 0px 10px 0px',
  padding: '0px 10px 0px 10px',
  borderRadius: '20px',
});
const CfmCenterContent = styled('div')({
  position: 'relative',
  fontSize: '20px',
  margin: '0px',
  padding: '20px 0px 0px 0px',
  height: '400px',
  overflowY: 'scroll',
  textAlign: 'center',
  color: 'rgb(0, 0, 0)',
});
const CfmRow = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  height: '40px',
  margin: '0px 10% 0px 10%',
  borderBottom: '1px solid rgb(220, 220, 220)',
});
const CfmRow2 = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  alignItems: 'center',
  height: '40px',
});
const CfmRowP = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  margin: '20px 10% 0px 10%',
  borderBottom: '1px solid rgb(220, 220, 220)',
});
const CfmRowCol = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  height: 'auto',
  margin: '10px 10% 0px 10%',
  paddingBottom: '10px',
  borderBottom: '1px solid rgb(220, 220, 220)',
});
const CfmLefttxt = styled('p')({
  textAlign: 'left',
  margin: '0px',
  marginBottom: '10px',
  fontSize: '15px',
  color: 'rgb(42, 42, 42)',
});
const CfmBigtxt = styled('p')({
  textAlign: 'left',
  margin: '0px 10px 10px 10px',
  fontSize: '20px',
  maxWidth: '100%',
  wordWrap: 'break-word',
});
const CfmRightttxt = styled('p')({
  textAlign: 'left',
  margin: '0px 10px 10px 10px',
  fontSize: '14px',
  color: 'rgb(85, 85, 85)',
  maxWidth: '100%',
  wordWrap: 'break-word',
});
const CfmRightttxt2 = styled('p')({
  margin: '0px 0px 10px 0px',
  fontSize: '15px',
  color: 'rgb(85, 85, 85)',
  wordWrap: 'break-word',
});
const CfmValuettxt = styled('p')({
  textAlign: 'left',
  margin: '0px',
  marginLeft: '10px',
  fontSize: '13px',
  color: 'rgb(0, 0, 0)',
  width: 'auto',
  fontWeight: '500',
});
const CfmGuest = styled('div')({
  width: '100%',
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'left',
  marginbBottm: '5px',
});
const CfmFac = styled('div')({
  width: '100%',
  display: 'flex',
  flexWrap: 'wrap',
  '@media (max-width: 700px)': {
    justifyContent: 'left',
  },
  '@media (min-width: 700px)': {
    justifyContent: 'space-around',
  },
});
const CfmBottom = styled('div')({
  width: '100%',
  display: 'flex',
  height: '50px',
  justifyContent: 'center',
});
const CfmGuestBlock = styled('div')({
  margin: '0px 10px 0px 0px',
  alignItems: 'center',
  width: 'auto',
  display: 'flex',
});
const CfmHead = styled('p')({
  '@media (max-width: 390px)': {
    margin: '20px 30px 0px 0px',
  },
  '@media (min-width: 390px)': {
    margin: '20px 90px 0px 0px',
  },
  fontSize: '20px',
  width: '100%',
  height: '50px',
  textAlign: 'center',
  letterSpacing: '0.2px',
  color: 'rgb(48, 48, 48)',
});
const LogoPath = styled('img')({
  width: '13px',
  height: '13px',
});
const ReserveConfirm = styled('button')({
  marginBottom: '15px',
  backgroundColor: 'rgb(0, 128, 255)',
  fontSize: '16px',
  width: '90%',
  fontWeight: '500',
  letterSpacing: '1px',
  height: '50px',
  border: '0px',
  margin: '10px 0px 0px 0px',
  borderRadius: '7px',
  color: 'white',
  '&:hover': {
    backgroundColor: 'rgb(0, 109, 218);',
    color: 'white',
  },
  '&:disabled': {
    opacity: '0.5',
    cursor: 'not-allowed',
  },
});
export const ConfirmBook = ({ data, isOpen, close }) => {
  // inital the confirm state to false
  const [ConfirmState, setConfirmState] = useState(false);
  const { contextState, updateContextState } = useContext(AppContext);
  // use the navigate to go to the user page
  const navigate = useNavigate();
  // get the hosting id from the url
  const { HostingId } = useParams();
  // go to the user page
  const goesMain = () => {
    navigate('/user/' + localStorage.getItem('email'));
  };
  // go back to detail page
  const back = () => {
    setConfirmState(false);
    close();
  };
  // get the set open snackbar function
  const { _, setOpenSnackbar } = useError();
  // this function used when the user click the confirm button
  const ReverseBook = () => {
    // change the conponment
    console.log(data);
  };
  let conponment = (
    <div className='CfmAll'>
      <div className='CfmBack'></div>
      <CfmContent>
        <CfmHeight>
          <CfmClose onClick={back}>{ConfirmState ? 'Back' : 'Cancel'}</CfmClose>
          <CfmHead>Spot Paying</CfmHead>
        </CfmHeight>
        <CfmCenterContent>
          <CfmRow>
            <CfmBigtxt>{data.SpotName + ' ' + data.SpotType}</CfmBigtxt>
            <CfmRightttxt>{'Hosted by ' + data.Owner}</CfmRightttxt>
          </CfmRow>
          <CfmRowCol>
            <CfmLefttxt>Hosting Address</CfmLefttxt>
            <CfmRightttxt>
              {data.Street +
                ', ' +
                data.City +
                ', ' +
                data.State +
                ', ' +
                data.Country +
                ', ' +
                data.Postcode}
            </CfmRightttxt>
          </CfmRowCol>
          <CfmRowCol>
            <CfmLefttxt>Access Way</CfmLefttxt>
            <CfmRightttxt>{data.Passway}</CfmRightttxt>
          </CfmRowCol>
          <CfmRowCol>
            <CfmLefttxt>Facilities</CfmLefttxt>
            <CfmRightttxt>
              {'Fits a ' +
                data.Size +
                ' with ' +
                data.Charge +
                ' charging post'}
            </CfmRightttxt>
          </CfmRowCol>
          <CfmRowCol>
            <CfmLefttxt>Parking Car Infomation</CfmLefttxt>
            <CfmRow2>
              <CfmRightttxt2>Brand of motor vehicle</CfmRightttxt2>
              <CfmRightttxt2>{contextState.CarType}</CfmRightttxt2>
            </CfmRow2>
            <CfmRow2>
              <CfmRightttxt2>Vehicle registration number</CfmRightttxt2>
              <CfmRightttxt2>{contextState.CarPlate}</CfmRightttxt2>
            </CfmRow2>
          </CfmRowCol>
          <CfmRowCol>
            <CfmLefttxt>Booking Time</CfmLefttxt>
            {data.BookingDuration.map((date, index) => (
              <CfmRow2 key={date.id}>
                <CfmRightttxt2>
                  {data.BookWay === 'H'
                    ? 'From ' +
                      dayjs(date.startDate).format('YYYY-MM-DD HH:mm') +
                      '  to  ' +
                      dayjs(date.endDate).format('YYYY-MM-DD HH:mm')
                    : 'From ' +
                      dayjs(date.startDate).format('YYYY-MM-DD') +
                      ' to ' +
                      dayjs(date.endDate).format('YYYY-MM-DD')}
                </CfmRightttxt2>
                <CfmRightttxt2>
                  {data.BookWay === 'H' && date.distance + ' hours'}
                  {data.BookWay === 'D' && date.distance + ' days'}
                  {data.BookWay === 'W' && date.distance + ' weeks'}
                </CfmRightttxt2>
              </CfmRow2>
            ))}
          </CfmRowCol>
          <CfmRowP>
            <CfmLefttxt>Total Price</CfmLefttxt>
            <CfmRightttxt>${String(data.TotalPrice)}</CfmRightttxt>
          </CfmRowP>
        </CfmCenterContent>
        <CfmBottom>
          <ReserveConfirm
            onClick={() => {
              if (ConfirmState) {
                goesMain();
              } else {
                ReverseBook();
              }
            }}
          >
            {ConfirmState
              ? 'Goes to HomePage'
              : 'Pay for $' + String(data.TotalPrice) + ' AUD'}
          </ReserveConfirm>
        </CfmBottom>
      </CfmContent>
    </div>
  );
  return isOpen ? conponment : null;
};
export function HomeSpecificLarge() {
  const { _, setOpenSnackbar } = useError();
  const {username, Spotid}=useParams();
  const { contextState, updateContextState } = useContext(AppContext);
  const [bookway, setbookway] = useState(contextState.BookWay);
  const [isbook, setIsbook] = useState(false);
  const [TotalPrice, setTotalPrice] = useState(0);
  const closebook = () => {
    setIsbook(false);
  };
  const Confirm = () => {
    let temp = {
      id: Date.now(), // unique id
      startDate: FirstStart,
      endDate: FirstEnd,
      distance: Firstdistance,
    };
    if (FirstStart === null || FirstEnd === null) {
      setOpenSnackbar({
        severity: 'warning',
        message: 'Please check your parking time, the park-in time and drive-out time of each time slot cannot be empty.',
        timestamp: new Date().getTime(),
      });
      return;
    }
    if (contextState.CarPlate===''){
      setOpenSnackbar({
        severity: 'warning',
        message: 'Please select the vehicle you want to park.',
        timestamp: new Date().getTime(),
      });
      return;
    }
    let check_null = timeIntervals.find(
      (item) => item.startDate === null || item.endDate === null
    );
    if (check_null) {
      setOpenSnackbar({
        severity: 'warning',
        message: 'You must set All booking duration correctly!',
        timestamp: new Date().getTime(),
      });
      return;
    }
    setdata((prevData) => ({
      ...prevData,
      BookingDuration: [temp, ...timeIntervals],
      BookWay: bookway,
      TotalPrice: TotalPrice,
    }));
    console.log(timeIntervals);

    setTimeout(() => {
      setIsbook(true);
      console.log(data);
    }, 300);
  };

  const handlebookway = (event) => {
    setbookway(event.target.value);
  };
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const [allpic, setallpic] = useState([]);
  let token = localStorage.getItem('token') || null;
  let currentuser = localStorage.getItem('email') || null;
  const [info, setInfo] = useState({
    Pictures: '',
    Charge: 'None',
    MorePictures: [],
    OrderNumber: '',
    OwnerID: null,
    PassWay: '',
    PricePerDay: 0,
    PricePerHour: 0,
    PricePerWeek: 0,
    IsDayRent: false,
    IsHourRent: false,
    IsWeekRent: true,
    Rate: 0,
    Size: '',
    SpotName: '',
    SpotAddr: '',
    SpotType: '',
    AvailableTime: '',
  });
  const [data, setdata] = useState({
    Street: '',
    City: '',
    Country: '',
    State: '',
    Postcode: '',
    AvailableTime: [],
    PassWay: '',
    Charge: 'None',
    SpotName: '',
    SpotType: '',
    Size: 0,
    BookingDuration: [],
    CarNum: '',
    Profile: '',
    Owner: '',
    TotalPrice: 0,
    BookWay: '',
  });
  const CarSelect=()=>{
    if(localStorage.token){
      window.scrollTo(0, 0);
      let spotid=localStorage.getItem('spotID');
      navigate('/'+username+'/detail/'+spotid+'/choose');
    }
    else{
      window.scrollTo(0, 0);
      goesLoginUser();
    }
  }
  useEffect(() => {
    getDetail();
    console.log(isbook);
  }, [isbook]);
  // 跳转车位选择页
  // 调库
  let navigate = useNavigate();
  const location = useLocation(); // 获取当前的location对象
  // 进入用户登录页面
  let goesLoginUser = () => {
    navigate(location.pathname + '/userlogin');
  };
  // 进入用户注册页面
  let goesRegistUser = () => {
    navigate(location.pathname + '/userregist');
  };
  let goesBack = () => {
    localStorage.removeItem('spotID');
    if (localStorage.getItem('token')) {
      navigate('/' + localStorage.getItem('email'));
    } else {
      navigate('/');
    }
  };
  const calculateTotalPrice = (distance) => {
    switch (bookway) {
      case 'H':
        return distance * info.PricePerHour;
      case 'D':
        return distance * info.PricePerDay;
      case 'W':
        return distance * info.PricePerWeek;
      default:
        return 0; // Handle unexpected bookway values gracefully
    }
  };
  let getDetail = () => {
    const carId = localStorage.getItem('spotID');
    callAPIGetSpecSpot('spot/' + carId)
      .then((response) => {
        console.log(response);
        setInfo(response.message);
        const res = JSON.parse(response.message.MorePictures);
        const avtime = JSON.parse(response.message.AvailableTime);
        setdata((prevData) => ({
          ...prevData,
          AvailableTime: avtime,
          Charge: response.message.Charge,
          Passway: response.message.PassWay,
          SpotName: response.message.SpotName,
          SpotType: response.message.SpotType,
          Size: response.message.Size,
          BookWay: bookway,
        }));
        if (res.length === 0) {
          res.unshift(response.message.Pictures);
        }
        res.unshift(response.message.Pictures);
        try {
          const ads = JSON.parse(response.message.SpotAddr);
          console.log(ads);
          setdata((prevData) => ({
            ...prevData,
            Street: ads.Street,
            City: ads.City,
            Country: ads.Country,
            State: ads.State,
            Postcode: ads.Postcode,
          }));
        } catch (e) {
          const ads = response.message.SpotAddr.split(',');
          console.log(ads);
          setdata((prevData) => ({
            ...prevData,
            Street: ads[0],
            City: ads[1],
            Country: ads[0],
            State: ads[1],
            Postcode: ads[0],
          }));
        }
        setallpic(res);
        callAPIGetSpecUserInfo('user/simpleInfo/' + response.message.OwnerID)
          .then((response) => {
            setdata((prevData) => ({
              ...prevData,
              Profile: response.message.avatar,
              Owner: response.message.name,
            }));
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        setOpenSnackbar({
          severity: 'warning',
          message: error,
          timestamp: new Date().getTime(),
        });
      });
  };
  let goesDashboard = () => {
    navigate('/' + currentuser + '/dashboard');
  };
  let logout = () => {
    if (localStorage.getItem('token')) {
      localStorage.clear();
      if (localStorage.getItem('spotID')) {
        navigate('/tourists/detail/' + localStorage.getItem('spotID'));
      } else {
        navigate('/');
      }
      setOpenSnackbar({
        severity: 'success',
        message: 'Logout successful',
        timestamp: new Date().getTime(),
      });
    }
  };
  const [timeIntervals, setTimeIntervals] = useState([]);
  const [FirstStart, setFirstStart] = useState(null);
  const [FirstEnd, setFirstEnd] = useState(null);
  const [Firstdistance, setDistance] = useState(0);
  useEffect(() => {
    let res = CalculateAllTime(
      [
        {
          id: Date.now(), // unique id
          startDate: FirstStart,
          endDate: FirstEnd,
          distance: 0,
        },
        ...timeIntervals,
      ],
      bookway
    );
    console.log(res);
    setDistance(res);
    setTotalPrice(calculateTotalPrice(res));
  }, [timeIntervals, FirstStart, FirstEnd, bookway]);
  // change the first available date
  const FirstStartChange = (date) => {
    setFirstStart(date);
  };
  // change the first available date
  const FirstEndChange = (date) => {
    setFirstEnd(date);
  };
  // add an element to the interval
  const addTimeInterval = () => {
    setTimeIntervals((currentInterval) => [
      ...currentInterval,
      {
        id: Date.now(), // unique id
        startDate: null,
        endDate: null,
        distance: 0,
      },
    ]);
  };
  // when the start date change, then change the distance
  const handleStartDateChange = (index, date) => {
    setTimeIntervals((currentInterval) => {
      // add the new interval
      const newIntervals = currentInterval ? [...currentInterval] : [];
      const already = newIntervals[index];
      // check the interval is exist or not
      if (already) {
        // set the new interval value
        newIntervals[index] = {
          id: already.id,
          startDate: date,
          endDate: already.endDate,
          distance: GetDistanceAll(date, bookway, already.endDate),
        };
      }
      // return the new interval or not
      return newIntervals || [];
    });
  };
  // when the end date change, then change the distance
  const handleEndDateChange = (index, date) => {
    // set the new interval value
    setTimeIntervals((currentInterval) => {
      // get the index of a interval
      const newIntervals = currentInterval ? [...currentInterval] : [];
      const already = newIntervals[index];
      // update the interval value
      if (already) {
        newIntervals[index] = {
          id: already.id,
          startDate: already.startDate,
          endDate: date,
          distance: GetDistanceAll(already.startDate, bookway, date),
        };
      }
      // return the new interval or not
      return newIntervals;
    });
  };
  // when the user want to delete a interval
  const deleteInterval = (id) => {
    // delete the interval by filter the id
    setTimeIntervals((prevIntervals) =>
      prevIntervals.filter((interval) => interval.id !== id)
    );
  };

  // 检查日期是否在任一可用时间段内
  const isInAvailableRange = (date) => {
    const dateJS = dayjs(date);
    return data.AvailableTime.some((item) => {
      const start = dayjs(item.startDate).subtract(1, 'day');
      const end = dayjs(item.endDate).subtract(1, 'day');
      return dateJS.isSameOrAfter(start) && dateJS.isSameOrBefore(end);
    });
  };
  // 开始日期的 shouldDisableDate 函数
  const DisabledStartDate = (date) => {
    return !isInAvailableRange(date);
  };

  // 结束日期的 shouldDisableDate 函数，依赖于已选择的开始日期
  const DisabledEndDate = (date, FirstStart) => {
    if (!FirstStart) return true;

    const selectedStartRange = data.AvailableTime.find(
      (item) =>
        FirstStart.isSameOrAfter(dayjs(item.startDate).subtract(1, 'day')) &&
        FirstStart.isSameOrBefore(dayjs(item.endDate).subtract(1, 'day'))
    );
    data.AvailableTime.map((item) => {
      console.log(
        FirstStart.isSameOrAfter(dayjs(item.startDate).subtract(1, 'day')) &&
          FirstStart.isSameOrBefore(dayjs(item.endDate).subtract(1, 'day'))
      );
    });
    console.log(selectedStartRange);
    if (!selectedStartRange) return true;
    return (
      !dayjs(date).isSameOrAfter(FirstStart) ||
      !dayjs(date).isSameOrBefore(
        dayjs(selectedStartRange.endDate).subtract(1, 'day')
      )
    );
  };

  // 主页内容
  return (
    // 主页背景框
    <div className='HomeOverall'>
      <ConfirmBook data={data} isOpen={isbook} close={closebook} />
      {/* 根据路由返回不同的model */}
      {/* 导航栏 */}
      <div className='Navbar'>
        {/* Logo图像 */}
        <button className='backgo' onClick={goesBack}>
          Back
        </button>
        <img src='/img/LOGO.svg' className='Applogo'></img>
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
      <div className='imgPart'>
        <Slider {...settings} className='w100'>
          {allpic.map((image, index) => (
            <div key={index} className='headerimg'>
              <img
                className='speimg'
                src={ image }
                alt={`Slide ${index}`}
              />
            </div>
          ))}
        </Slider>
      </div>
      <div className='Info-Part'>
        <div className='Info-Left'>
          <div className='NamePart'>
            <p className='titleName'>{info.SpotName + ' ' + info.SpotType}</p>
          </div>
          <div className='Address-Part'>
            <p className='label-value-ad'>
              {data.Street +
                ', ' +
                data.City +
                ', ' +
                data.State +
                ', ' +
                data.Country +
                ', ' +
                data.Postcode}
            </p>
          </div>
          <div className='ChargePart'>
            <p className='size'>Fits to</p>
            <p className='size-v'>{info.Size}</p>
            <p className='size'>with</p>
            <p className='label-title'>{info.Charge}</p>
            <p className='label-value'>Charge equipment</p>
          </div>
        </div>
        <div className='Price'>
          {info.IsHourRent && (
            <div className='p-part-now'>
              <p className='price-per'>
                {info.IsHourRent ? '$' + info.PricePerHour.toFixed(2) : '--'}
              </p>
              <p className='way'>/ Hour</p>
            </div>
          )}
          {info.IsDayRent && (
            <div className='p-part-now'>
              <p className='price-per'>
                {info.IsDayRent ? '$' + info.PricePerDay.toFixed(2) : '--'}
              </p>
              <p className='way'>/ Day</p>
            </div>
          )}
          {info.IsWeekRent && (
            <div className='p-part-now'>
              <p className='price-per'>
                {info.IsWeekRent ? '$' + info.PricePerWeek.toFixed(2) : '--'}
              </p>
              <p className='way'>/ Week</p>
            </div>
          )}
        </div>
      </div>
      <div className='relevent-part'>
        <div className='relevent-left'>
          <div className='re-le-le'>
            <img
              src={ data.Profile }
              className='profile'
            ></img>
            <p className='user_name'>{data.Owner}</p>
          </div>
          <p className='provided'>Provided this car space</p>
        </div>
        <div className='relevent-center'>
          <p className='Review'>Review</p>
          <Rating
            name='read-only '
            className='black_star'
            value={info.Rate}
            readOnly
          />
        </div>
        <div className='relevent-right'>
          <div className='ReviewNum'>
            <p className='revnum'>0</p>
            <p className='revtit'>Total review</p>
          </div>
          <div className='ReviewNum'>
            <p className='revnum'>{info.OrderNum}</p>
            <p className='revtit'>People have rented it.</p>
          </div>
        </div>
      </div>
      <div className='Available-time'>
        {data.AvailableTime.map((item, index) => (
          <div key={index} className='time-range'>
            <p className='timetitle'>Available time {index + 1}</p>
            <p className='timetitle'>from</p>
            <p className='daterangetxt'>{item.startDate.slice(0, 10)}</p>
            <p className='timetitle'>to</p>
            <p className='daterangetxt'>{item.endDate.slice(0, 10)}</p>
          </div>
        ))}
      </div>
      <div className='Order-part'>
        <div className='order-time'>
          <div className='PublishInfo-park'>
            <div className='IntervalHeader-book'>
              <p className='PublishTitle'>Booking Time</p>
              <div className='display-flex'>
                <p className='bkt'>BookType</p>
                <select
                  value={bookway}
                  className='form-select mglr-r'
                  aria-label='Default select example'
                  onChange={handlebookway}
                >
                  {info.IsHourRent && <option value='H'>Hourly</option>}
                  {info.IsDayRent && <option value='D'>Daily</option>}
                  {info.IsWeekRent && <option value='W'>Weekly</option>}
                </select>
              </div>
              <button className='AddInterval-book' onClick={addTimeInterval}>
                Add booking time
              </button>
            </div>
            <div className='TimeInterval-book'>
              <div className='IntervalContent-top'>
                <div className='TimeBlock'>
                  {bookway == 'H' ? (
                    <div className='timechoice-s-spec'>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker
                          minDate={dayjs(new Date())}
                          shouldDisableDate={DisabledStartDate}
                          label='Park-in time'
                          value={FirstStart}
                          onChange={(date) => {
                            if (date) FirstStartChange(date);
                          }}
                        />
                      </LocalizationProvider>
                    </div>
                  ) : (
                    <div className='timechoice-s-spec'>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          minDate={dayjs(new Date())}
                          label='Park-in time'
                          value={FirstStart}
                          shouldDisableDate={DisabledStartDate}
                          onChange={(date) => {
                            if (date) FirstStartChange(date);
                          }}
                        />
                      </LocalizationProvider>
                    </div>
                  )}
                </div>
                <p className='TO'> - </p>
                <div className='TimeBlock'>
                  {bookway == 'H' ? (
                    <div className='timechoice-s-spec'>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker
                          minDate={dayjs(new Date())}
                          label='Drive-out time'
                          value={FirstEnd}
                          shouldDisableDate={(date) => {
                            return DisabledEndDate(date, FirstStart);
                          }}
                          onChange={(date) => {
                            if (date) FirstEndChange(date);
                          }}
                        />
                      </LocalizationProvider>
                    </div>
                  ) : (
                    <div className='timechoice-s-spec'>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label='Drive-out time'
                          value={FirstEnd}
                          shouldDisableDate={(date) => {
                            return DisabledEndDate(date, FirstStart);
                          }}
                          minDate={dayjs(new Date())}
                          onChange={(date) => {
                            if (date) FirstEndChange(date);
                          }}
                        />
                      </LocalizationProvider>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {timeIntervals.map((interval, index) => (
              <div className='TimeInterval-book' key={interval.id}>
                <div className='IntervalContent'>
                  <div className='TimeBlock'>
                    {bookway == 'H' ? (
                      <div className='timechoice-s-spec'>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DateTimePicker
                            minDate={dayjs(new Date())}
                            shouldDisableDate={DisabledStartDate}
                            label='Park-in time'
                            value={interval.startDate}
                            onChange={(date) => {
                              if (date) handleStartDateChange(index, date);
                            }}
                          />
                        </LocalizationProvider>
                      </div>
                    ) : (
                      <div className='timechoice-s-spec'>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            minDate={dayjs(new Date())}
                            label='Park-in time'
                            value={interval.startDate}
                            shouldDisableDate={DisabledStartDate}
                            onChange={(date) => {
                              if (date) handleStartDateChange(index, date);
                            }}
                          />
                        </LocalizationProvider>
                      </div>
                    )}
                  </div>
                  <p className='TO'> - </p>
                  <div className='TimeBlock'>
                    {bookway == 'H' ? (
                      <div className='timechoice-s-spec'>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DateTimePicker
                            label='Drive-out time'
                            minDate={dayjs(new Date())}
                            shouldDisableDate={(date) => {
                              return DisabledEndDate(date, interval.startDate);
                            }}
                            value={interval.startDate}
                            onChange={(date) => {
                              if (date) handleEndDateChange(index, date);
                            }}
                          />
                        </LocalizationProvider>
                      </div>
                    ) : (
                      <div className='timechoice-s-spec'>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            label='Drive-out time'
                            minDate={dayjs(new Date())}
                            shouldDisableDate={(date) => {
                              return DisabledEndDate(date, interval.startDate);
                            }}
                            value={interval.startDate}
                            onChange={(date) => {
                              if (date) handleEndDateChange(index, date);
                            }}
                          />
                        </LocalizationProvider>
                      </div>
                    )}
                  </div>
                  <button
                    className='ClearInterval-book'
                    onClick={() => {
                      deleteInterval(interval.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className='confirm-part'>
            <div className='PriceTotal'>
              <p className='Pricetxt'>Total Price</p>
              <p className='PriceValue'>${TotalPrice}</p>
            </div>
            <button className='confirm-btn' onClick={Confirm}>
              Appointment
            </button>
          </div>
        </div>
        <div className='car-select'>
          <div className='car-select-left'>
            <p className='car-title'>Charge of motor vehicle</p>
            <input className='car-content' disabled={true} value={contextState.CarCharge}></input>

            <p className='car-title'>Type of montor vecicle</p>
            <input className='car-content' disabled={true} value={contextState.CarType}></input>

            <p className='car-title'>Vehicle registration number</p>
            <input className='car-content' disabled={true} value={contextState.CarPlate}></input>

            <img src='/img/car.jpeg' className='carprofile'></img>
            <button className='choose-car'onClick={CarSelect}>Select Your Car</button>
          </div>
        </div>
      </div>
      <div className='Review-part'>
        <p className='ReviewTitle'>Reviews</p>
        <div className='Review-row-odd'>
          <img className='Review-left-img' src='/img/profile.png'></img>
          <div className='Review-right'>
            <div className='Review-top'>
              <p className='r-name'>BoyangYu</p>
              <Rating
                name='read-only '
                className='black-star'
                value={info.Rate}
                readOnly
              />
              <p className='r-name'>5.0</p>
            </div>
            <p className='Review-bottom'>
              This car space is good, and provider is very nice.
            </p>
          </div>
        </div>
        <div className='Review-row'>
          <img className='Review-left-img' src='/img/profile.png'></img>
          <div className='Review-right'>
            <div className='Review-top'>
              <p className='r-name'>WangYun Fan</p>
              <Rating
                name='read-only '
                className='black-star'
                value={3.3}
                readOnly
              />
              <p className='r-name'>3.2</p>
            </div>
            <p className='Review-bottom'>
              just can parking the space is hard to find.
            </p>
          </div>
        </div>
        <div className='Review-row-odd'>
          <img className='Review-left-img' src='/img/profile.png'></img>
          <div className='Review-right'>
            <div className='Review-top'>
              <p className='r-name'>Guo Jia QI</p>
              <Rating
                name='read-only '
                className='black-star'
                value={0}
                readOnly
              />
              <p className='r-name'>0.0</p>
            </div>
            <p className='Review-bottom'>This car space can not be found!.</p>
          </div>
        </div>
        <div className='Review-row'>
          <img className='Review-left-img' src='/img/profile.png'></img>
          <div className='Review-right'>
            <div className='Review-top'>
              <p className='r-name'>LongSi Zhuo</p>
              <Rating
                name='read-only '
                className='black-star'
                value={info.Rate}
                readOnly
              />
              <p className='r-name'>5.0</p>
            </div>
            <p className='Review-bottom'>
              This car space is good, and provider is very nice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
