import React, { useState, useContext, useEffect } from 'react';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { styled } from '@mui/material';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import './HomePage.css';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { getUserInfo } from './components/API';
import {
  useError,
  callAPIGetSpecSpot,
  callAPIGetSpecUserInfo,
  GetDistanceAll,
  CalculateAllTime,
  callAPICreateOrder,
  callAPIGetAllreview,
  callAPIGetSpecificVocher,
  callAPIUseSpecificVocher,
} from './API';
import { withdrawAccount } from './components/API';
import './SpecificSpot.css';
import Rating from '@mui/material/Rating';
import { AppContext } from './App';
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
// this function is the confirmation of the confirm booking.
const CfmContent = styled('div')({
  position: 'absolute',
  zIndex: '4',
  width: '90%',
  height: '640px',
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
  height: '310px',
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
  height: '30px',
});
const CfmRow3 = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  alignItems: 'center',
  height: '30px',
  margin: '0px',
  padding: '0px',
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
  margin: '10px 10% 0px 10%',
  paddingBottom: '0px',
  borderBottom: '1px solid rgb(220, 220, 220)',
});
const CfmLefttxt = styled('p')({
  textAlign: 'left',
  margin: '0px',
  marginBottom: '5px',
  padding: '0px',
  fontSize: '15px',
  color: 'rgb(42, 42, 42)',
});
const CfmBigtxt = styled('p')({
  textAlign: 'left',
  margin: '0px 10px 15px 10px',
  fontSize: '20px',
  maxWidth: '100%',
  wordWrap: 'break-word',
});
const CfmRightttxt = styled('p')({
  textAlign: 'left',
  margin: '0px 10px 15px 10px',
  fontSize: '15px',
  color: 'rgb(85, 85, 85)',
  maxWidth: '100%',
  wordWrap: 'break-word',
});
const CfmRightBigttxt = styled('p')({
  textAlign: 'left',
  margin: '0px 10px 10px 10px',
  fontSize: '15px',
  color: 'rgb(85, 85, 85)',
  maxWidth: '100%',
  wordWrap: 'break-word',
});
const CfmRightttxt2 = styled('p')({
  margin: '0px 0px 0px 0px',
  fontSize: '15px',
  color: 'rgb(85, 85, 85)',
  wordWrap: 'break-word',
});
const CfmBottom = styled('div')({
  width: '90%',
  marginLeft: '10%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
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
const ReserveConfirm = styled('button')({
  marginBottom: '15px',
  backgroundColor: '#E22229',
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
    backgroundColor: '#9e0005',
    color: 'white',
  },
  '&:disabled': {
    opacity: '0.5',
    cursor: 'not-allowed',
  },
});
export const SendWelcomeMessage = (receiverID, Content) => {
  console.log('Connecting to WebSocket...');
  let websocket = new WebSocket(`ws://localhost:8080/ws`);
  const token = localStorage.getItem('token') || null;
  websocket.onopen = () => {
    // 当WebSocket连接打开时的回调函数
    console.log('WebSocket Connected');
    websocket.send(JSON.stringify({ type: 'authenticate', token: token })); // 发送认证信息
    const message = {
      Type: 'message',
      receiverId: parseInt(receiverID, 10), // 将receiverID转换为十进制
      content: Content,
    };
    console.log(message);
    websocket.send(JSON.stringify(message));
  };
  websocket.onerror = (error) => {
    console.error('WebSocket Error:', error);
  };

  return () => {
    if (websocket) {
      websocket.close();
    }
  };
};
// This is the confirm page for the user to confirm the booking
export const ConfirmBook = ({ data, isOpen, close }) => {
  // get the set open snackbar function
  const { setOpenSnackbar } = useError();
  // initial the topup state to false
  // when the user balance is not enough, the topup state will be true
  const [topup, settp] = useState(false);
  // initial the canOrder state to false
  // when the user balance is enough, the canOrder state will be true
  // when the user click the confirm button, the canOrder state will be true
  // when the query is success, the canOrder state will be false
  const [canOrder, setcanOrder] = useState(false);
  // inital the confirm state to false
  // when the user pay the order, the confirm state will be true
  const [ConfirmState, setConfirmState] = useState(false);
  // set the context state
  const { contextState } = useContext(AppContext);
  // use the navigate to go to the user page
  const [Balance, setBalance] = useState('');
  // store the discount
  const [DisAccount, setDisAccount] = useState(0);
  // whether use the discount
  const [useDiscount,setUseDiscount]=useState(false);
  // initial the selectedOption state to 0
  // 0 means pay by balance
  // 1 means pay by visa card
  const [selectedOption, setSelectedOption] = useState('0');
  // when the payment method is selected, the selectedOption state will be changed
  const [theVocher, setTheVocher] = useState('');
  // the final price
  const [TotalPrice,setTotalPrice]=useState(0);
  // when the payment method is selected, the selectedOption state will be changed
  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };
  // get token from the context
  let token = localStorage.getItem('token') || null;
  // reload the page when the price or payment method is changed
  useEffect(() => {
    setTotalPrice(data.TotalPrice-DisAccount<0?0:data.TotalPrice-DisAccount);
    // get the user balance
    getUserInfo()
      .then((response) => {
        // when the query is success, the user balance will be set
        console.log(response.message.Account);
        setBalance(response.message.Account);
      })
      // when the query is failed, the error will be catched
      .catch((error) => {});
    // when the user balance is not enough and the payment method is SpotAccount, the topup state will be true
    if (selectedOption === '0' && Balance - TotalPrice < 0) {
      // open the snackbar to remind the user to topup
      setOpenSnackbar({
        severity: 'warning',
        message: 'Your available balance is not enough, please Topup',
        timestamp: new Date().getTime(),
      });
      // set the topup state to true
      setcanOrder(true);
      // set the topup state to true
      settp(true);
      return;
    } else {
      // set the can order state to false
      setcanOrder(false);
      // set the topup state to false
      settp(false);
    }
  }, [Balance, data.TotalPrice, isOpen, selectedOption, DisAccount,TotalPrice]);
  // when the user pay by visa card, waiting for payment
  // when the payment state is changed, the confirm state will be changed
  // use the lodash library
  const _lodash = require('lodash');
  useEffect(() => {
    // when the payed has a value, the confirm state will be changed
    if (localStorage.getItem('payed')) {
      // get the payed value
      let k_r = localStorage.getItem('payed') === 'true' ? true : false;
      console.log(k_r);
      // set the can order state to false
      setcanOrder(false);
      // if payment is success
      if (k_r) {
        // convert the date format to JSON format
        let temp = _lodash.cloneDeep(data.BookingDuration);
        console.log(temp);
        temp.map((item) => {
          item.startDate = item.startDate.format().toString();
          item.endDate = item.endDate.format().toString();
          return item;
        });
        // initial the data to be sent
        let tempdata = {
          bookingTime: temp,
          carID: Number(localStorage.getItem('carId')),
          cost: TotalPrice,
        };
        // call the api to create the order
        callAPICreateOrder(
          'spots/' + localStorage.getItem('spotID') + '/orders',
          localStorage.getItem('token'),
          tempdata
        )
          .then((response) => {
            // if the query is success, the snackbar will be opened
            setOpenSnackbar({
              severity: 'success',
              message: 'You successfully pay your order!Thank you.',
              timestamp: new Date().getTime(),
            });
            console.log(data.OwnerID);
            SendWelcomeMessage(data.OwnerID,'Hi, I have successfully paid the order for your spot "'+data.SpotName+'", please check it.');
                  // if the user use the vocher
            if(useDiscount){
              // call the api to use the vocher
              callAPIUseSpecificVocher('vouchers/use/' + theVocher, token)
              .then((response)=>{
                // reset the discount
                setDisAccount(0);
                setUseDiscount(false);
                setTheVocher('');
                console.log(response);
              })
              .catch((error)=>{
                console.log(error);
              })
            }
            // set the confirm state to true
            setConfirmState(k_r);
          })
          .catch((error) => {
            // if the query is failed, the snackbar will be opened
            setOpenSnackbar({
              severity: 'warning',
              message: 'There exist some error, please try again.',
              timestamp: new Date().getTime(),
            });
          });
      }
    }
    // after the payment, the payed value will be removed
    localStorage.removeItem('payed');
  }, [localStorage.getItem('payed'), data, TotalPrice]);
  // initial the navigate function
  const navigate = useNavigate();
  // get the username and Spot id from the url
  const { username, Spotid } = useParams();
  // go to the main page
  const goesMain = () => {
    navigate('/' + localStorage.getItem('email') + '/dashboard/bookings');
    localStorage.removeItem('payed');
  };
  // try to got the vocher
  const VerifyVocher = () => {
    // call the api to get the specific vocher
    callAPIGetSpecificVocher('vouchers/info/' + theVocher, token)
    .then((response)=>{
      // if the vocher is valid and not used, the snackbar will be opened
      console.log(response);
      if(response.value && response.used === false){
        setOpenSnackbar({
          severity: 'success',
          message: 'Voucher is valid got discount $' + response.value + '.',
          timestamp: new Date().getTime(),
        });
        // if the discount is more than the total price, the discount will be set to total price - 1
        if(response.value > data.TotalPrice){
          response.value = data.TotalPrice-1;
        }
        // set the discount account
        setDisAccount(response.value);
        // set the use discount state to true
        setUseDiscount(true);
      }
      else{
        setOpenSnackbar({
          severity: 'warning',
          message: 'Voucher is invalid.',
          timestamp: new Date().getTime(),
        });
      }
    })
    .catch((error)=>{
      setOpenSnackbar({
        severity: 'warning',
        message: error,
        timestamp: new Date().getTime(),
      });
    })
  }
  // go to the topup page
  const goesTopUp = () => {
    navigate('/' + localStorage.getItem('email') + '/dashboard');
    localStorage.removeItem('payed');
  };
  // go back to detail page
  const back = () => {
    setConfirmState(false);
    localStorage.removeItem('payed');
    close();
  };
  // this function used when the user click the confirm button
  const ReverseBook = () => {
    // if the user balance is not enough and the payment method is SpotAccount, the snackbar will be opened
    if (selectedOption === 0 && Balance - TotalPrice < 0) {
      setOpenSnackbar({
        severity: 'warning',
        message: 'Your available balance is not enough, please Topup',
        timestamp: new Date().getTime(),
      });
      return;
    }
    // use the lodash library
    const _lodash = require('lodash');
    // convert the date format to JSON format
    let temp = _lodash.cloneDeep(data.BookingDuration);
    temp.map((item) => {
      item.startDate = item.startDate.format().toString();
      item.endDate = item.endDate.format().toString();
      return item;
    });
    // initial the data to be sent
    let tempdata = {
      bookingTime: temp,
      carID: Number(localStorage.getItem('carId')),
      cost: TotalPrice,
    };
    // set the can order state to true
    setcanOrder(true);
    // if the payment method is Visa Card
    if (selectedOption === '1') {
      // set the payprice to be the total price
      localStorage.setItem('Payprice', TotalPrice);
      // go to the visa payment page
      navigate('/' + username + '/detail/' + Spotid + '/Visa');
      return;
    }
    // call the api to create the order
    callAPICreateOrder(
      'spots/' + localStorage.getItem('spotID') + '/orders',
      localStorage.getItem('token'),
      tempdata
    )
    .then((response) => {
      // if the query is success, the snackbar will be opened
      setOpenSnackbar({
        severity: 'success',
        message: 'You successfully pay your order!Thank you.',
        timestamp: new Date().getTime(),
      });
      // if the payment method is SpotAccount
      // deduct the balance
      if (selectedOption === '0') {
        withdrawAccount(TotalPrice);
      }
      // if the user use the vocher
      if(useDiscount){
        // call the api to use the vocher
        callAPIUseSpecificVocher('vouchers/use/' + theVocher, token)
        .then((response)=>{
          // reset the discount
          setDisAccount(0);
          setUseDiscount(false);
          setTheVocher('');
          console.log(response);
        })
        .catch((error)=>{
          console.log(error);
        })
      }
      // set the confirm state to true
      setConfirmState(true);
      // set the can order state to false
      setcanOrder(false);
      console.log(data.OwnerID);
      SendWelcomeMessage(data.OwnerID,'Hi, I have successfully paid the order for your spot "'+data.SpotName+'", please check it.');
      return;
    })
    .catch((error) => {
      // if the query is failed, the snackbar will be opened
      setOpenSnackbar({
        severity: 'warning',
        message: 'There exist some error, please try again.',
        timestamp: new Date().getTime(),
      });
      // set the can order state to false
      setcanOrder(false);
      return;
    });
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
            <CfmRightBigttxt>{'Hosted by ' + data.Owner}</CfmRightBigttxt>
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
            <CfmRow3>
              <CfmLefttxt>Access Way</CfmLefttxt>
              <CfmRightttxt>{data.Passway}</CfmRightttxt>
            </CfmRow3>
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
              <CfmRow2 key={date.Tid}>
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
        </CfmCenterContent>
        <CfmRowP>
          <CfmLefttxt>Total Price</CfmLefttxt>
          <CfmRightttxt>${String(TotalPrice)}</CfmRightttxt>
        </CfmRowP>
        <div className='payment-part'>
          <p className='payment_method'>Select your payment method</p>
          <select
            className='payment-choice'
            value={selectedOption}
            onChange={handleSelectChange}
          >
            <option className='choice-p' value='0'>
              SpotAccount
            </option>
            <option className='choice-p' value='1'>
              Visa Card
            </option>
          </select>
        </div>
        {selectedOption === '0' && (
          <div className='balance-part'>
            <CfmLefttxt>Your Available Balance</CfmLefttxt>
            <p className='balance-value'>
              ${Number(Balance).toFixed(2) + ' - ($' + data.TotalPrice + ' - $' + DisAccount+')'}
            </p>
            <p className='balance-value'>
              ${(Number(Balance) - TotalPrice).toFixed(2)}
            </p>
          </div>
        )}
        {selectedOption === '1' && (
          <div className='balance-part'>
            <p className='payment-message'>
              Your payment would through online payment platform.
            </p>
          </div>
        )}
        <div className='vochar-part'>
          <CfmLefttxt>{'Vocher Code(if applicatable)'}</CfmLefttxt>
          <input className='vorcher-inp' maxLength={8} value={theVocher} onChange={(event)=>{setTheVocher(event.target.value);setUseDiscount(false);setDisAccount(0);}}></input>
          <button disabled={useDiscount} className='verify-vocher' onClick={VerifyVocher}>{ useDiscount ? '$' + DisAccount + ' Discount' : 'Verify' }</button>
        </div>
        <CfmBottom>
          {(selectedOption === '1' || !topup) && (
            <ReserveConfirm
              disabled={canOrder}
              onClick={() => {
                if (ConfirmState) {
                  goesMain();
                } else {
                  ReverseBook();
                }
              }}
            >
              {ConfirmState
                ? 'Goes to view your Booking'
                : 'Pay for $' + String(TotalPrice) + ' AUD'}
            </ReserveConfirm>
          )}
          {selectedOption === '0' && topup && (
            <ReserveConfirm
              onClick={() => {
                goesTopUp();
              }}
            >
            {'Goes to TopUp'}
            </ReserveConfirm>
          )}
        </CfmBottom>
      </CfmContent>
    </div>
  );
  return isOpen ? conponment : null;
};
//
export const VisaPayment = () => {
  // set the snackbar to tell the user some system message
  const { setOpenSnackbar } = useError();
  // initial the card number, first name, last name, cvc, expire date
  const [cardnumber, setnumber] = useState('');
  const [Fname, setFname] = useState('');
  const [Lname, setLname] = useState('');
  const [CVC, setCVC] = useState('');
  const [Expire, setexpire] = useState('');
  // initial the navigate function
  let navigate = useNavigate();
  // get the price from the local storage
  let Price = Number(localStorage.getItem('Payprice')).toFixed(2);
  // go back to order confirm page, and set the payed to false
  const back = () => {
    localStorage.setItem('payed', 'false');
    navigate(-1);
  };
  // validate the card number, first name, last name, cvc, expire date
  function validateInput(cardnumber, Fname, Lname, CVC, Expire) {
    // use the regular expression to validate the input
    const cardNumberPattern = /^\d{16}$/;
    const namePattern = /^[A-Z]+$/;
    const cvcPattern = /^\d{3}$/;
    const expirePattern = /^(0[1-9]|1[0-2])\/(\d{2})$/;

    // check the input is valid or not
    const isCardNumberValid = cardNumberPattern.test(cardnumber);
    const isFnameValid = namePattern.test(Fname);
    const isLnameValid = namePattern.test(Lname);
    const isCVCValid = cvcPattern.test(CVC);
    const isExpireValid = expirePattern.test(Expire);
    // if the card number is not valid, show the snackbar
    if (!isCardNumberValid) {
      setOpenSnackbar({
        severity: 'warning',
        message: 'Payment Wrong, card number incorrect.',
        timestamp: new Date().getTime(),
      });
    }
    // if other input is not valid, show the snackbar
    else if (!isExpireValid || !isCVCValid || !isFnameValid || !isLnameValid) {
      setOpenSnackbar({
        severity: 'warning',
        message: 'Payment Wrong, card details incorrect.',
        timestamp: new Date().getTime(),
      });
    }
    // the result only when all the input is valid is true
    return (
      isCardNumberValid &&
      isFnameValid &&
      isLnameValid &&
      isCVCValid &&
      isExpireValid
    );
  }
  // when user try to pay, validate the input
  const pay = () => {
    // get the validate result
    let confirm = validateInput(cardnumber, Fname, Lname, CVC, Expire);
    // if card is correct
    if (confirm) {
      // set payed to true and return to the confirm page
      localStorage.setItem('payed', 'true');
      navigate(-1);
    }
  };
  return (
    <div className='payment'>
      <div className='payment-cont'>
        <div className='payment-header'>
          <button className='payment-cancel' onClick={back}>
            Cancel Payment
          </button>
        </div>
        <div className='payment-center'>
          <div className='CardName'>
            <div className='CardNum-payment'>
              <label className='payment-title'>CARD NUMBER</label>
              <input
                className='cardnuminput-payment'
                placeholder='0000 0000 0000 0000'
                value={cardnumber}
                onChange={(event) => {
                  setnumber(event.target.value);
                }}
              ></input>
            </div>
            <div className='CardNum-payment'>
              <label className='payment-title'>EXPIRY</label>
              <input
                className='nameinput-payment'
                placeholder='MM/YY'
                value={Expire}
                onChange={(event) => {
                  setexpire(event.target.value);
                }}
              ></input>
            </div>
          </div>
          <div className='CardName'>
            <div className='PartName'>
              <label className='payment-title'>FIRST NAME</label>
              <input
                className='nameinput-payment'
                placeholder='XXXX'
                value={Fname}
                onChange={(event) => {
                  setFname(event.target.value);
                }}
              ></input>
            </div>
            <div className='PartName'>
              <label className='payment-title'>FAMILY NAME</label>
              <input
                className='nameinput-payment'
                placeholder='XXXX'
                value={Lname}
                onChange={(event) => {
                  setLname(event.target.value);
                }}
              ></input>
            </div>
            <div className='PartName'>
              <label className='payment-title'>CVC</label>
              <input
                className='cvc-payment'
                placeholder='XXX'
                value={CVC}
                onChange={(event) => {
                  setCVC(event.target.value);
                }}
              ></input>
            </div>
          </div>
          <div className='Tot-part'>
            <p className='Tot-PAY'>Total Price</p>
            <p className='Tot-PAY'>${Price}</p>
          </div>
          <button className='pay-button' onClick={pay}>
            Process payment
          </button>
        </div>
      </div>
    </div>
  );
};
// this is the component for the user to browse a specific parking spot
export function HomeSpecificLarge() {
  // set the snackbar to tell the user some system message
  const { snackbarData, setOpenSnackbar } = useError();
  // get the username and spot id from the url
  const { username } = useParams();
  // get the context state and update function
  const { contextState } = useContext(AppContext);
  // set the book way to the context state
  const [bookway, setbookway] = useState(contextState.BookWay);
  // set the is booked to false
  const [isbook, setIsbook] = useState(false);
  // initial the total price as 0
  const [TotalPrice, setTotalPrice] = useState(0);
  // initial the owner not the same as the user
  const [sameOwner, setsameOwner] = useState(false);
  const [allReview, setAllReview] = useState([]);
  // when close the book, set the isbook to false
  const closebook = () => {
    setIsbook(false);
  };
  // when the user try to confirm the book
  const Confirm = () => {
    // check whether the first duration is valid
    if (FirstStart === null || FirstEnd === null) {
      // if not, show the snackbar
      setOpenSnackbar({
        severity: 'warning',
        message:
          'Please check your parking time, the park-in time and drive-out time of each time slot cannot be empty.',
        timestamp: new Date().getTime(),
      });
      return;
    }
    // initial the temp object
    let temp = {
      Tid: Date.now().toString(), // unique id
      startDate: FirstStart,
      endDate: FirstEnd,
      distance: Firstdistance.toString(),
    };
    // if the car plate is empty, show the snackbar
    if (contextState.CarPlate === '') {
      setOpenSnackbar({
        severity: 'warning',
        message: 'Please select the vehicle you want to park.',
        timestamp: new Date().getTime(),
      });
      return;
    }
    // check whether all time intervals are valid
    let check_null = timeIntervals.find(
      (item) => item.startDate === null || item.endDate === null
    );
    // if there exist some invalid time intervals, show the snackbar
    if (check_null) {
      setOpenSnackbar({
        severity: 'warning',
        message: 'You must set All booking duration correctly!',
        timestamp: new Date().getTime(),
      });
      return;
    }
    // let the result intervals be the time intervals
    let resultIntervals = timeIntervals;
    // update the data for creating the booking
    setdata((prevData) => ({
      ...prevData,
      BookingDuration: [temp, ...resultIntervals],
      BookWay: bookway,
      TotalPrice: sameOwner
        ? Number((TotalPrice * 0.15).toFixed(2))
        : TotalPrice,
    }));
    // set the isbook to true
    setTimeout(() => {
      setIsbook(true);
      console.log(data);
    }, 300);
  };
  // when the user change the book way
  const handlebookway = (event) => {
    setbookway(event.target.value);
  };
  // setting the images for the slider
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  // get all the pictures for the parking spot
  const [allpic, setallpic] = useState([]);
  // get the token and current user
  let token = localStorage.getItem('token') || null;
  let currentuser = localStorage.getItem('email') || null;
  // initial the spot info
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
  // initial the order information
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
  // when the user try to select the car
  const CarSelect = () => {
    // if the user is not logged in, go to the login page
    // else, go to the car select page
    if (localStorage.token) {
      window.scrollTo(0, 0);
      let spotid = localStorage.getItem('spotID');
      navigate('/' + username + '/detail/' + spotid + '/choose');
    } else {
      window.scrollTo(0, 0);
      goesLoginUser();
    }
  };
  // when the isbook changes, refresh the detail of the parking spot
  useEffect(() => {
    // this function is used to calculate the total price
    const getDetail = () => {
      // get the current user
      const currentname = localStorage.getItem('username') || null;
      // get the spot id
      const carId = localStorage.getItem('spotID') || null;
      // call the api to get the spot detail
      callAPIGetSpecSpot('spot/' + carId)
        .then((response) => {
          // if the response is ok, set the info
          console.log(response);
          setInfo(response.message);
          // phrase all the pictures for the slider
          const res = JSON.parse(response.message.MorePictures);
          // phrase the available time to the array
          const avtime = JSON.parse(response.message.AvailableTime);
          // set the data for the booking
          setdata((prevData) => ({
            ...prevData,
            AvailableTime: avtime,
            Charge: response.message.Charge,
            Passway: response.message.PassWay,
            SpotName: response.message.SpotName,
            SpotType: response.message.SpotType,
            Size: response.message.Size,
            BookWay: bookway,
            OwnerID: response.message.OwnerID
          }));
          // if the pictures is empty, set the pictures to the first picture
          if (res.length === 0) {
            res.unshift(response.message.Pictures);
          }
          // set the first picture to the main picture
          res.unshift(response.message.Pictures);
          // try to phrase the address
          try {
            // phrase the address
            const ads = JSON.parse(response.message.SpotAddr);
            // set the address to data
            setdata((prevData) => ({
              ...prevData,
              Street: ads.Street,
              City: ads.City,
              Country: ads.Country,
              State: ads.State,
              Postcode: ads.Postcode,
            }));
          } catch (e) {
            // if the address is not a json, set the address to the first address
            // split the address
            const ads = response.message.SpotAddr.split(',');
            // set the address to data
            setdata((prevData) => ({
              ...prevData,
              Street: ads[0],
              City: ads[1],
              Country: ads[0],
              State: ads[1],
              Postcode: ads[0],
            }));
          }
          // set the pictures to show
          setallpic(res);
          // call the api to get the owner information
          callAPIGetSpecUserInfo('user/simpleInfo/' + response.message.OwnerID)
            .then((response) => {
              // if the response is ok, set the owner information
              console.log(response.message);
              // if the owner is the current user, set the same owner to true
              if (response.message.name === currentname) {
                setsameOwner(true);
              }
              // set the owner information
              setdata((prevData) => ({
                ...prevData,
                Profile: response.message.avatar,
                Owner: response.message.name,
              }));
            })
            // if the response is not ok, show the error
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          // tell the user that the spot is not found
          setOpenSnackbar({
            severity: 'warning',
            message: error,
            timestamp: new Date().getTime(),
          });
        });
    };
    getDetail();
    const getReview = () => {
      const carId = localStorage.getItem('spotID') || null;
      callAPIGetAllreview('spots/' + carId + '/reviews')
        .then((response) => {
          console.log(response);
          if (response && response.reviews) {
            setAllReview(response.reviews);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getReview();
  }, [isbook, bookway, username, snackbarData]);
  // initial the navigation
  let navigate = useNavigate();
  // initial the location
  // get current location
  const location = useLocation();
  // goes to the login page
  let goesLoginUser = () => {
    navigate(location.pathname + '/userlogin');
  };
  // goes to the register page
  let goesRegistUser = () => {
    navigate(location.pathname + '/userregist');
  };
  // goes to the Home page
  let goesBack = () => {
    // remove the spot id
    localStorage.removeItem('spotID');
    // if the user is logged in, go to the user page
    // else go to the home page
    if (localStorage.getItem('token')) {
      navigate('/' + localStorage.getItem('email'));
    } else {
      navigate('/');
    }
  };
  // goes to the dashboard
  let goesDashboard = () => {
    navigate('/' + currentuser + '/dashboard');
  };
  // when the user click the logout button
  let logout = () => {
    // if the user is logged in, clear the local storage
    if (localStorage.getItem('token')) {
      localStorage.clear();
      // if the user in the spot detail page, stay in the page
      if (localStorage.getItem('spotID')) {
        navigate('/tourists/detail/' + localStorage.getItem('spotID'));
      } else {
        // else, go to the home page
        navigate('/');
      }
      // tell the user that the logout is successful
      setOpenSnackbar({
        severity: 'success',
        message: 'Logout successful',
        timestamp: new Date().getTime(),
      });
    }
  };
  // initialize the time intervals as empty
  const [timeIntervals, setTimeIntervals] = useState([]);
  // initialize the first start and end time as null
  const [FirstStart, setFirstStart] = useState(null);
  const [FirstEnd, setFirstEnd] = useState(null);
  // initialize the distance as 0
  const [Firstdistance, setDistance] = useState(0);
  // when the time intervals change, calculate the total price
  useEffect(() => {
    // this function is used to calculate the total price
    const calculateTotalPrice = (distance) => {
      // according to the book way, calculate the total price
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
    // calculate the total time
    let res = CalculateAllTime(
      [
        {
          Tid: Date.now().toString(), // unique id
          startDate: FirstStart,
          endDate: FirstEnd,
          distance: 0,
        },
        ...timeIntervals,
      ],
      bookway
    );
    console.log(res);
    // set the total distance as the sum of all the distance
    setDistance(GetDistanceAll(FirstStart, bookway, FirstEnd));
    // set the total price for the booking
    setTotalPrice(calculateTotalPrice(res));
    // set the total time for the booking
    console.log(timeIntervals);
  }, [
    timeIntervals,
    FirstStart,
    FirstEnd,
    bookway,
    info.PricePerHour,
    info.PricePerDay,
    info.PricePerWeek,
  ]);
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
        Tid: Date.now().toString(), // unique id
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
          Tid: already.Tid,
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
          Tid: already.Tid,
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
      prevIntervals.filter((interval) => interval.Tid !== id)
    );
  };
  // check the interval is available or not
  const isInAvailableRange = (date) => {
    // convert the date to dayjs
    const dateJS = dayjs(date);
    // check the date is in one of the available range or not
    return data.AvailableTime.some((item) => {
      // get the start and end date
      const start = dayjs(item.startDate).subtract(1, 'day');
      const end = dayjs(item.endDate).subtract(1, 'day');
      return dateJS.isSameOrAfter(start) && dateJS.isSameOrBefore(end);
    });
  };
  // start date should be in the available range
  const DisabledStartDate = (date) => {
    return !isInAvailableRange(date);
  };
  // end date should be in the available range and after the start date
  const DisabledEndDate = (date, currentdate) => {
    // if the start date is not selected, then return true
    if (!currentdate) return true;
    // get the selected start range
    const selectedStartRange = data.AvailableTime.find(
      (item) =>
        currentdate.isSameOrAfter(dayjs(item.startDate).subtract(1, 'day')) &&
        currentdate.isSameOrBefore(dayjs(item.endDate).subtract(1, 'day'))
    );
    // console.log(selectedStartRange);
    // if the start date is not selected, then return true
    if (!selectedStartRange) return true;
    // return the date is in the available range or not
    return (
      !dayjs(date).isSameOrAfter(currentdate) ||
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
        <img src='/img/LOGO.svg' className='Applogo' alt=''></img>
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
              <img className='speimg' src={image} alt={`Slide ${index}`} />
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
            <img src={data.Profile} className='profile' alt=''></img>
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
                  {bookway === 'H' ? (
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
                  {bookway === 'H' ? (
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
              <div className='TimeInterval-book' key={interval.Tid}>
                <div className='IntervalContent'>
                  <div className='TimeBlock'>
                    {bookway === 'H' ? (
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
                    {bookway === 'H' ? (
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
                      deleteInterval(interval.Tid);
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
              <p className={sameOwner ? 'PriceValue-del' : 'PriceValue'}>
                ${TotalPrice}
              </p>
              {sameOwner && (
                <p className='PriceValue'>{(TotalPrice * 0.15).toFixed(2)}</p>
              )}
              {sameOwner && (
                <p className='discount-reason'>{'(Owner booking)'}</p>
              )}
            </div>
            <button className='confirm-btn' onClick={Confirm}>
              Appointment
            </button>
          </div>
        </div>
        <div className='car-select'>
          <div className='car-select-left'>
            <p className='car-title'>Charge of motor vehicle</p>
            <input
              className='car-content'
              disabled={true}
              value={contextState.CarCharge}
            ></input>

            <p className='car-title'>Type of montor vecicle</p>
            <input
              className='car-content'
              disabled={true}
              value={contextState.CarType}
            ></input>

            <p className='car-title'>Vehicle registration number</p>
            <input
              className='car-content'
              disabled={true}
              value={contextState.CarPlate}
            ></input>

            <img src={contextState.CarPicture || '/img/LOGO.svg'} className='carprofile' alt='No Car Select'></img>
            <button className='choose-car' onClick={CarSelect}>
              Select Your Car
            </button>
          </div>
        </div>
      </div>
      <div className='Review-part'>
        <p className='ReviewTitle'>Reviews</p>
        {allReview.map((info, index) => (
          <div
            key={info.ID}
            className={index % 2 === 0 ? 'Review-row-odd' : 'Review-row'}
          >
            <img
              className='Review-left-img'
              src={info.Rater.Avatar}
              alt=''
            ></img>
            <div className='Review-right'>
              <div className='Review-top'>
                <p className='r-name'>{info.Rater.Name}</p>
                <div className='black-star'>
                  <Rating name='read-only' value={info.Rating} readOnly />
                  <p className='r-rating'>{info.Rating + ' Marks'}</p>
                </div>
              </div>
              <p className='Review-bottom'>{info.Comment}</p>
            </div>
          </div>
        ))}
        <div className={allReview.length % 2 === 0 ? 'Review-row-odd' : 'Review-row'} >
            <p className='Review-bottom-N'>{'No more Reviews'}</p>
        </div>
      </div>
    </div>
  );
}
