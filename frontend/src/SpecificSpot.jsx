import React, {
  useState,
  ChangeEvent,
  useContext,
  LabelHTMLAttributes,
  useEffect,
} from 'react';
import { styled } from '@mui/material';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers';
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
import { motion, AnimatePresence } from 'framer-motion';
import { useError, callAPIGetSpecSpot, GetDistance } from './API';
import './SpecificSpot.css';
import { indigo } from '@mui/material/colors';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import { AppContext } from './App';
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
  // use the navigate to go to the user page
  const navigate = useNavigate();
  // get the hosting id from the url
  const { HostingId } = useParams();
  // go to the user page
  const goesMain = () => {
    navigate('/user/' + data.Booker);
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
          <CfmClose onClick={back}>
            {ConfirmState ? 'Back' : 'Cancel'}
          </CfmClose>
          <CfmHead>Hosting Paying</CfmHead>
        </CfmHeight>
        <CfmCenterContent>
          <CfmRow>
            <CfmBigtxt>{data.metadata}</CfmBigtxt>
            <CfmRightttxt>{'Hosted by ' + data.owner}</CfmRightttxt>
          </CfmRow>
          <CfmRowCol>
            <CfmLefttxt>Hosting Address</CfmLefttxt>
            <CfmRightttxt>{'1111111'}</CfmRightttxt>
          </CfmRowCol>
          <CfmRowCol>
            <CfmLefttxt>Facilities</CfmLefttxt>
            <CfmGuest>
              <CfmGuestBlock>
                <LogoPath src='/img/Guest.png'></LogoPath>
                <CfmValuettxt>{}</CfmValuettxt>
              </CfmGuestBlock>
              <CfmGuestBlock>
                <LogoPath src='/img/bath.png'></LogoPath>
                <CfmValuettxt>{}</CfmValuettxt>
              </CfmGuestBlock>
              <CfmGuestBlock>
                <LogoPath src='/img/bedroom.png'></LogoPath>
                <CfmValuettxt>{data.metadata}</CfmValuettxt>
              </CfmGuestBlock>
              <CfmGuestBlock>
                <LogoPath src='/img/bed.png'></LogoPath>
                <CfmValuettxt>{data.metadata}</CfmValuettxt>
              </CfmGuestBlock>
            </CfmGuest>
            <CfmFac>
            </CfmFac>
          </CfmRowCol>
          <CfmRowCol>
            <CfmLefttxt>Spoting Date</CfmLefttxt>
            <CfmRow2>
              <CfmRightttxt2>
                {dayjs(data.CheckinDate).format('MM/DD/YYYY') +
                  ' - ' +
                  dayjs(data.CheckoutDate).format('MM/DD/YYYY')}
              </CfmRightttxt2>
              <CfmRightttxt2>
                {GetDistance(data.CheckinDate, data.CheckoutDate) + ' night'}
              </CfmRightttxt2>
            </CfmRow2>
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
  const [isbook, setIsbook] = useState(false);
  const closebook = () => {
    setIsbook(false);
  };
  const Confirm = () => {
    setIsbook(true);
  };
  const { contextState, updateContextState } = useContext(AppContext);
  const [bookway, setbookway] = useState(contextState.BookWay);
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
  const { _, setOpenSnackbar } = useError();
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
    Size: 0,
    SpotName: '',
    SpotAddr: '',
    SpotType: '',
    AvailableTime: '',
  });
  useEffect(() => {
    getDetail();
    console.log(isbook);
  }, [isbook]);
  console.log(token);
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
  let getDetail = () => {
    const carId = localStorage.getItem('spotID');
    callAPIGetSpecSpot('spot/' + carId)
      .then((response) => {
        console.log(response);
        setInfo(response.message);
        const res = JSON.parse(response.message.MorePictures);
        res.unshift(response.message.Pictures);
        console.log(res);
        setallpic(res);
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
      localStorage.removeItem('token');
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
  const [errorContent, setErrorContent] = useState('');
  const [ErrorText8, setErrorText8] = useState(false);
  const [timeIntervals, setTimeIntervals] = useState([]);
  const [FirstStart, setFirstStart] = useState(null);
  const [FirstEnd, setFirstEnd] = useState(null);
  const [Firstdistance, setDistance] = useState(0);
  // change the first available date
  const FirstStartChange = (date) => {
    setFirstStart(date);
    setDistance(GetDistance(date, FirstEnd));
  };
  // change the first available date
  const FirstEndChange = (date) => {
    setFirstEnd(date);
    setDistance(GetDistance(FirstStart, date));
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
          distance: GetDistance(date, already.endDate),
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
          distance: GetDistance(already.startDate, date),
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
  // 主页内容
  return (
    // 主页背景框
    <div className='HomeOverall'>
      <ConfirmBook data={info} isOpen={isbook} close={closebook} />
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
                src={'data:image/jpeg;base64,' + image}
                alt={`Slide ${index}`}
              />
            </div>
          ))}
          {/* <img
            className='thumbial'
            src={'data:image/jpeg;base64,' + info.Pictures}
          ></img> */}
        </Slider>
      </div>
      <div className='Info-Part'>
        <div className='Info-Left'>
          <div className='NamePart'>
            <p className='titleName'>{info.SpotName + ' ' + info.SpotType}</p>
          </div>
          <div className='Address-Part'>
            <p className='label-value-ad'>{info.SpotAddr}</p>
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
            <img src='/img/LOGO.svg' className='profile'></img>
            <p className='user_name'>{info.OwnerID}</p>
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
        <div className='time-range'>
          <p className='timetitle'>Available time 1</p>
          <p className='timetitle'>from</p>
          <p className='daterangetxt'>02/05/2022</p>
          <p className='timetitle'>to</p>
          <p className='daterangetxt'>02/04/2023</p>
        </div>
        <div className='time-range'>
          <p className='timetitle'>Available time 2</p>
          <p className='timetitle'>from</p>
          <p className='daterangetxt'>02/05/2024</p>
          <p className='timetitle'>to</p>
          <p className='daterangetxt'>02/04/2026</p>
        </div>
        <div className='time-range'>
          <p className='timetitle'>Available time 2</p>
          <p className='timetitle'>from</p>
          <p className='daterangetxt'>02/05/2028</p>
          <p className='timetitle'>to</p>
          <p className='daterangetxt'>02/04/2030</p>
        </div>
      </div>
      <div className='Order-part'>
        <div className='order-time'>
          <div className='PublishInfo-park'>
            <div className='IntervalHeader-book'>
              <p className='PublishTitle'>Booking Time</p>
              <div className='display-flex'>
                <p className='bkt'>BookType</p>
                <select
                  defaultValue={bookway}
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
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={['DateTimePicker']}>
                        <DateTimePicker
                          label='Start Date'
                          value={FirstStart}
                          onChange={(date) => {
                            if (date) FirstStartChange(date);
                          }}
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                  ) : (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={['DatePicker']}>
                        <DatePicker
                          label='Start Date'
                          value={FirstStart}
                          onChange={(date) => {
                            if (date) FirstStartChange(date);
                          }}
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                  )}
                </div>
                <p className='TO'> - </p>
                <div className='TimeBlock'>
                  {bookway == 'H' ? (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={['DateTimePicker']}>
                        <DateTimePicker
                          label='End Date'
                          value={FirstEnd}
                          onChange={(date) => {
                            if (date) FirstEndChange(date);
                          }}
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                  ) : (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={['DatePicker']}>
                        <DatePicker
                          label='End Date'
                          value={FirstEnd}
                          onChange={(date) => {
                            if (date) FirstEndChange(date);
                          }}
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                  )}
                </div>
              </div>
            </div>
            {timeIntervals.map((interval, index) => (
              <div className='TimeInterval-book' key={interval.id}>
                <div className='IntervalContent'>
                  <div className='TimeBlock'>
                    {bookway == 'H' ? (
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DateTimePicker']}>
                          <DateTimePicker
                            label='Start Date'
                            value={interval.startDate}
                            onChange={(date) => {
                              if (date) handleStartDateChange(index, date);
                            }}
                          />
                        </DemoContainer>
                      </LocalizationProvider>
                    ) : (
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DatePicker']}>
                          <DatePicker
                            label='Start Date'
                            value={interval.startDate}
                            onChange={(date) => {
                              if (date) handleStartDateChange(index, date);
                            }}
                          />
                        </DemoContainer>
                      </LocalizationProvider>
                    )}
                  </div>
                  <p className='TO'> - </p>
                  <div className='TimeBlock'>
                    {bookway == 'H' ? (
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DateTimePicker']}>
                          <DateTimePicker
                            label='End Date'
                            value={interval.startDate}
                            onChange={(date) => {
                              if (date) handleEndDateChange(index, date);
                            }}
                          />
                        </DemoContainer>
                      </LocalizationProvider>
                    ) : (
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DatePicker']}>
                          <DatePicker
                            label='End Date'
                            value={interval.startDate}
                            onChange={(date) => {
                              if (date) handleEndDateChange(index, date);
                            }}
                          />
                        </DemoContainer>
                      </LocalizationProvider>
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
          {ErrorText8 && <p className='CreateError'>{errorContent}</p>}
          <div className='confirm-part'>
            <div className='PriceTotal'>
              <p className='Pricetxt'>Total Price</p>
              <p className='PriceValue'>$0</p>
            </div>
            <button className='confirm-btn' onClick={Confirm}>
              Appointment
            </button>
          </div>
        </div>
        <div className='car-select'>
          <div className='car-select-left'>
            <p className='car-title'>Brand of motor vehicle</p>
            <input className='car-content' disabled={true}></input>

            <p className='car-title'>Type of montor vecicle</p>
            <input className='car-content' disabled={true}></input>

            <p className='car-title'>Vehicle registration number</p>
            <input className='car-content' disabled={true}></input>

            <img src='/img/car.jpeg' className='carprofile'></img>
            <button className='choose-car'>Select Your Car</button>
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
