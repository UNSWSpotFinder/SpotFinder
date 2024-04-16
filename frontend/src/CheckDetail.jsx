import React, { useState, useRef, useEffect } from 'react';
import { styled } from '@mui/material';
import './CheckDetail.css';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import './HomePage.css';
import './CarSpaceOpearation.css';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useError,
  GetDistance,
  HoverImage,
  callAPIGetSpecSpot,
  callAPIEditSpot,
  callAPIApproveSpot,
  callAPIBlockSpot,
  callAPIHiddenSpot,
} from './API';
import { callAPIsolved } from './components/API';
const CfmContent = styled('div')({
  position: 'absolute',
  zIndex: '4',
  width: '80%',
  height: '350px',
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
const CfmRowCol = styled('div')({
  display: 'flex',
  fontSize: '20px',
  flexDirection: 'column',
  height: 'auto',
  margin: '10px 10% 0px 10%',
  paddingBottom: '10px',
});
const CfmLefttxt = styled('p')({
  textAlign: 'left',
  margin: '0px',
  marginBottom: '10px',
  fontSize: '16px',
  color: 'rgb(42, 42, 42)',
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
  backgroundColor: 'rgb(202, 16, 16)',
  fontSize: '16px',
  width: '80%',
  letterSpacing: '1px',
  height: '40px',
  border: '0px',
  margin: '10px 10%',
  borderRadius: '7px',
  color: 'white',
  '&:hover': {
    backgroundColor: 'rgb(154, 13, 13);',
    color: 'white',
  },
});
const ReserveConfirmblack = styled('button')({
  marginBottom: '15px',
  backgroundColor: 'rgb(0, 0, 0)',
  fontSize: '16px',
  width: '80%',
  letterSpacing: '1px',
  height: '40px',
  border: '0px',
  margin: '10px 10%',
  borderRadius: '7px',
  color: 'white',
  '&:hover': {
    color: 'rgb(180, 180, 180);',
  },
});
const ReserveConfirmgray = styled('button')({
  marginBottom: '15px',
  backgroundColor: 'rgb(245, 245, 245)',
  fontSize: '16px',
  width: '80%',
  letterSpacing: '1px',
  height: '40px',
  border: '0px',
  margin: '10px 10%',
  borderRadius: '7px',
  color: 'black',
  '&:hover': {
    backgroundColor: 'rgb(235, 235, 235)',
  },
});

export const SendAllKindFeedback = (receiverID, Content) => {
  console.log('Connecting to WebSocket...');
  let websocket = new WebSocket(`ws://localhost:8080/ws`);
  const token = localStorage.getItem('token');
  websocket.onopen = () => {
    // 当WebSocket连接打开时的回调函数
    console.log('WebSocket Connected');
    websocket.send(JSON.stringify({ type: 'authenticate', token: token })); // 发送认证信息
    const message = {
      Type: 'notification',
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
// 修改
export const ApproveCheck = ({ data, isOpen, close }) => {
  // get the set open snackbar function
  const { setOpenSnackbar } = useError();
  const { adminid, Spotid } = useParams();
  const [Feedback, setFeedback] = useState('No change, Default Approval.');
  // use the navigate to go to the user page
  const navigate = useNavigate();
  // get the hosting id from the url
  // go to the user page
  // go back to detail page
  const back = () => {
    close();
  };
  // this function used when the user click the confirm button
  const SendFeedback = () => {
    setOpenSnackbar({
      severity: 'success',
      message: 'Spot successfully approved!',
      timestamp: new Date().getTime(),
    });
    let WholeFeedback =
      'Your Spot named "' +
      data.spotName +
      '" has been edit and Published. Because ' +
      Feedback;
    SendAllKindFeedback(data.Owner, WholeFeedback);
    navigate('/admin/' + adminid);
  };
  const Approve = (id) => {
    callAPIApproveSpot('manager/approve', id, localStorage.getItem('token'))
      .then((response) => {
        console.log(response);
        SendFeedback();
      })
      .catch((error) => {
        console.log('np');
        console.log(data);
        setOpenSnackbar({
          severity: 'warning',
          message: error,
          timestamp: new Date().getTime(),
        });
      });
  };
  const EditInfo = (id) => {
    callAPIEditSpot(
      'spot/modifySpotInfo/' + id,
      data,
      localStorage.getItem('token')
    )
      .then((response) => {
        console.log(response);
        Approve(id);
      })
      .catch((error) => {
        console.log('np');
        console.log(data);
        setOpenSnackbar({
          severity: 'warning',
          message: error,
          timestamp: new Date().getTime(),
        });
      });
    // change the conponment
    console.log(data);
  };
  let conponment = (
    <div className='CfmAll'>
      <div className='CfmBack'></div>
      <CfmContent>
        <CfmHeight>
          <CfmClose onClick={back}>{'Back'}</CfmClose>
          <CfmHead>Spot Approve Response</CfmHead>
        </CfmHeight>
        <CfmRowCol>
          <CfmLefttxt>{'Your Feedback to the provider'}</CfmLefttxt>
          <textarea
            className='Feedback'
            value={Feedback}
            onChange={(event) => {
              setFeedback(event.target.value);
            }}
          ></textarea>
        </CfmRowCol>
        <ReserveConfirm
          onClick={() => {
            EditInfo(Spotid);
          }}
        >
          Send Feedback & Edit & Approve
        </ReserveConfirm>
      </CfmContent>
    </div>
  );
  return isOpen ? conponment : null;
};
export const EditCheck = ({ data, isOpen, close }) => {
  console.log(data);
  const [Feedback, setFeedback] = useState('No change.');
  const { adminid, Spotid, Reportid } = useParams();
  // use the navigate to go to the user page
  const navigate = useNavigate();
  // get the hosting id from the url
  // go to the user page
  // go back to detail page
  const back = () => {
    close();
  };
  const SendFeedback = () => {
    setOpenSnackbar({
      severity: 'success',
      message: 'Spot successfully approved!',
      timestamp: new Date().getTime(),
    });
    let WholeFeedback =
      'Your Spot named "' +
      data.spotName +
      '" has been Edited. Because ' +
      Feedback;
    SendAllKindFeedback(data.Owner, WholeFeedback);
    if (Reportid) {
      callAPIsolved(Reportid).then(() => {
        navigate('/admin/' + adminid);
      });
    } else {
      navigate('/admin/' + adminid);
    }
  };
  // get the set open snackbar function
  const { setOpenSnackbar } = useError();
  // this function used when the user click the confirm button
  const EditInfo = (id) => {
    callAPIEditSpot(
      'spot/modifySpotInfo/' + id,
      data,
      localStorage.getItem('token')
    )
      .then((response) => {
        console.log(response);
        setOpenSnackbar({
          severity: 'success',
          message: 'Edit Spot Successful!',
          timestamp: new Date().getTime(),
        });
        SendFeedback();
      })
      .catch((error) => {
        console.log('np');
        console.log(data);
        setOpenSnackbar({
          severity: 'warning',
          message: error,
          timestamp: new Date().getTime(),
        });
      });
    // change the conponment
    console.log(data);
  };
  let conponment = (
    <div className='CfmAll'>
      <div className='CfmBack'></div>
      <CfmContent>
        <CfmHeight>
          <CfmClose onClick={back}>{'Back'}</CfmClose>
          <CfmHead>Spot Edit Response</CfmHead>
        </CfmHeight>
        <CfmRowCol>
          <CfmLefttxt>{'Your Feedback to the provider'}</CfmLefttxt>
          <textarea
            className='Feedback'
            value={Feedback}
            onChange={(event) => {
              setFeedback(event.target.value);
            }}
          ></textarea>
        </CfmRowCol>
        <ReserveConfirm
          onClick={() => {
            EditInfo(Spotid);
          }}
        >
          Send Feedback & Edit
        </ReserveConfirm>
      </CfmContent>
    </div>
  );
  return isOpen ? conponment : null;
};
// 删除
export const DeleteCheck = ({ spotName, Owner, isOpen, close }) => {
  const { adminid, Spotid, Reportid } = useParams();
  const [Feedback, setFeedback] = useState(
    'The spot is not suitable for our platform.'
  );
  // use the navigate to go to the user page
  const navigate = useNavigate();
  // get the hosting id from the url
  // go to the user page
  // go back to detail page
  const back = () => {
    close();
  };
  const SendFeedback = () => {
    setOpenSnackbar({
      severity: 'success',
      message: 'Spot has been Blocked! All user would never see it.',
      timestamp: new Date().getTime(),
    });
    let WholeFeedback =
      'Your Spot named "' +
      spotName +
      '" has been Blocked. Because ' +
      Feedback;
    SendAllKindFeedback(Owner, WholeFeedback);
    if (Reportid) {
      callAPIsolved(Reportid).then(() => {
        navigate('/admin/' + adminid);
      });
    } else {
      navigate('/admin/' + adminid);
    }
  };
  // get the set open snackbar function
  const { setOpenSnackbar } = useError();
  // this function used when the user click the confirm button
  const DeleteInfo = (id) => {
    callAPIBlockSpot('manager/block', id, localStorage.getItem('token'))
      .then((response) => {
        console.log(response);
        SendFeedback();
      })
      .catch((error) => {
        console.log('np');
        setOpenSnackbar({
          severity: 'warning',
          message: error,
          timestamp: new Date().getTime(),
        });
      });
    // change the conponment
    console.log('DELETE SUCCESS' + id);
  };
  let conponment = (
    <div className='CfmAll'>
      <div className='CfmBack'></div>
      <CfmContent>
        <CfmHeight>
          <CfmClose onClick={back}>{'Back'}</CfmClose>
          <CfmHead>Spot Delete/Reject Response</CfmHead>
        </CfmHeight>
        <CfmRowCol>
          <CfmLefttxt>{'Your Reason to block this spot'}</CfmLefttxt>
          <textarea
            className='Feedback'
            value={Feedback}
            onChange={(event) => {
              setFeedback(event.target.value);
            }}
          ></textarea>
        </CfmRowCol>
        <ReserveConfirmblack
          onClick={() => {
            DeleteInfo(Spotid);
          }}
        >
          {'Send Feedback  &  (Delete/Reject)'}
        </ReserveConfirmblack>
      </CfmContent>
    </div>
  );
  return isOpen ? conponment : null;
};
export const HiddenCheck = ({ spotName, Owner, isOpen, close }) => {
  const { adminid, Spotid, Reportid } = useParams();
  const [Feedback, setFeedback] = useState(
    'The spot has many problems, please fix it. Thank you.'
  );
  // use the navigate to go to the user page
  const navigate = useNavigate();
  // get the hosting id from the url
  // go to the user page
  // go back to detail page
  const back = () => {
    close();
  };
  const SendFeedback = () => {
    setOpenSnackbar({
      severity: 'success',
      message: 'Spot has been Hidden! You can republish it later.',
      timestamp: new Date().getTime(),
    });
    let WholeFeedback =
      'Your Spot named "' + spotName + '" has been Hidden. Because ' + Feedback;
    SendAllKindFeedback(Owner, WholeFeedback);
    if (Reportid) {
      callAPIsolved(Reportid).then((response) => {
        navigate('/admin/' + adminid);
      });
    } else {
      navigate('/admin/' + adminid);
    }
  };
  // get the set open snackbar function
  const { setOpenSnackbar } = useError();
  // this function used when the user click the confirm button
  const HiddenInfo = (id) => {
    callAPIHiddenSpot('manager/invisible', id, localStorage.getItem('token'))
      .then((response) => {
        console.log(response);
        SendFeedback();
      })
      .catch((error) => {
        console.log('np');
        setOpenSnackbar({
          severity: 'warning',
          message: error,
          timestamp: new Date().getTime(),
        });
      });
    // change the conponment
    console.log('DELETE SUCCESS' + id);
  };
  let conponment = (
    <div className='CfmAll'>
      <div className='CfmBack'></div>
      <CfmContent>
        <CfmHeight>
          <CfmClose onClick={back}>{'Back'}</CfmClose>
          <CfmHead>Spot Hidden Response</CfmHead>
        </CfmHeight>
        <CfmRowCol>
          <CfmLefttxt>{'Your Reason to block this spot'}</CfmLefttxt>
          <textarea
            className='Feedback'
            value={Feedback}
            onChange={(event) => {
              setFeedback(event.target.value);
            }}
          ></textarea>
        </CfmRowCol>
        <ReserveConfirmgray
          onClick={() => {
            HiddenInfo(Spotid);
          }}
        >
          {'Send Feedback  &  Hidden'}
        </ReserveConfirmgray>
      </CfmContent>
    </div>
  );
  return isOpen ? conponment : null;
};

// EditHostingPage
export const ManagerEditSpace = () => {
  const { setOpenSnackbar } = useError();
  const [isOpenDelete, setOpenDelete] = useState(false);
  const [isOpenApprove, setOpenApprove] = useState(false);
  const [isOpenHidden, setOpenHidden] = useState(false);
  const [OwnerId, setOwnerId] = useState(null);
  const { adminid, Spotid } = useParams();
  console.log(adminid);
  console.log(Spotid);
  useEffect(() => {
    let getDetail = (Spotid) => {
      callAPIGetSpecSpot('spot/' + Spotid)
        .then((response) => {
          console.log(response);
          setCarType(response.message.Size);
          setOwnerId(response.message.OwnerID);
          setCharge(response.message.Charge);
          setPassWay(response.message.PassWay);
          setType(response.message.SpotType);
          setTitle(response.message.SpotName);
          setisDay(response.message.IsDayRent);
          setPriceDay(response.message.PricePerDay);
          setisHour(response.message.IsHourRent);
          setPriceHour(response.message.PricePerHour);
          setWeek(response.message.IsWeekRent);
          setPriceWeek(response.message.PricePerWeek);
          setThumbil(response.message.Pictures);
          const res = JSON.parse(response.message.MorePictures);
          setSelectedImageString(res);
          console.log(res);
          try {
            const ads = JSON.parse(response.message.SpotAddr);
            console.log(ads);
            setState(ads.State);
            setStreet(ads.Street);
            setCity(ads.City);
            setCountry(ads.Country);
            setPostcode(ads.Postcode);
          } catch (e) {
            const ads = response.message.SpotAddr.split(',');
            console.log(ads);
            setState(ads[0]);
            setStreet(ads[0]);
            setCity(ads.City[1]);
            setCountry(ads[2]);
            setPostcode(ads.Postcode[2]);
          }
          const ads = JSON.parse(response.message.SpotAddr);
          console.log(ads);
          setState(ads.State);
          setStreet(ads.Street);
          setCity(ads.City);
          setCountry(ads.Country);
          setPostcode(ads.Postcode);
          let all_time = JSON.parse(response.message.AvailableTime);
          all_time = all_time.map((item) => ({
            ...item,
            startDate: dayjs(item.startDate),
            endDate: dayjs(item.endDate),
          }));
          console.log(all_time);
          setFirstStart(all_time[0].startDate);
          setFirstEnd(all_time[0].endDate);
          setDistance(all_time[0].distance);
          setTimeIntervals((timeIntervals) => [...all_time.slice(1)]);
        })
        .catch((error) => {
          setOpenSnackbar({
            severity: 'warning',
            message: error,
            timestamp: new Date().getTime(),
          });
        });
    };
    getDetail(Spotid);
  }, [Spotid, setOpenSnackbar]);
  // link the ref for thumb and other img
  const RefT = useRef(null);
  const RefFile = useRef(null);
  // if the button click then open the file loader
  const HandleT = () => {
    if (RefT.current) {
      RefT.current.click();
    }
  };
  // if the button click then open the file loader
  const HandleFile = () => {
    if (RefFile.current) {
      RefFile.current.click();
    }
  };
  const navigate = useNavigate();
  // set title empty;
  const [lengthOfTitle, setlength] = useState(0);
  // set type empty;
  const [SpaceType, setType] = useState('');
  // set charge empty;
  const [charge, setCharge] = useState('');
  const ChangeCharge = (event) => {
    const target = event.target;
    if (target.id) {
      setCharge(target.id);
    }
  };
  const [PassWay, setPassWay] = useState('');
  const ChangePassWay = (event) => {
    const target = event.target;
    if (target.id) {
      setPassWay(target.id);
    }
  };
  const [SpotData, setData] = useState({});
  const [isHour, setisHour] = useState(false);
  const [isDay, setisDay] = useState(false);
  const [isWeek, setWeek] = useState(false);
  // set type empty;
  const [CarType, setCarType] = useState('');
  // set contry empty
  const [Country, setCountry] = useState('');
  const handleCountryChange = (event) => {
    setCountry(event.target.value);
  };
  // set street empty
  const [Street, setStreet] = useState('');
  const handleStreetChange = (event) => {
    setStreet(event.target.value);
  };
  // set city empty
  const [City, setCity] = useState('');
  const handleCityChange = (event) => {
    setCity(event.target.value);
  };
  // set state empty
  const [State, setState] = useState('');
  const handleStateChange = (event) => {
    setState(event.target.value);
  };
  // set postcode empty
  const [Postcode, setPostcode] = useState('');
  const handlePostcodeChange = (event) => {
    setPostcode(event.target.value);
  };
  // set thumbil empty
  const [Thumbil, setThumbil] = useState('');
  // set all facility false
  const [Title, setTitle] = useState('');
  const handleTitleChange = (event) => {
    setTitle(event.target.value);
    setlength(event.target.value.length);
  };
  // set price for daily
  const [PriseDay, setPriceDay] = useState('');
  const handlePriceDayChange = (event) => {
    setPriceDay(event.target.value);
  };
  // set price for daily
  const [PriseWeek, setPriceWeek] = useState('');
  const handlePriceWeekChange = (event) => {
    setPriceWeek(event.target.value);
  };
  // set price for daily
  const [PriseHour, setPriceHour] = useState('');
  const handlePriceHourChange = (event) => {
    setPriceHour(event.target.value);
  };
  // when the type is changed
  const ChangeType = (event) => {
    const target = event.target;
    if (target.id) {
      setType(target.id);
    }
  };
  const ChangeCarType = (event) => {
    const target = event.target;
    if (target.id) {
      setCarType(target.id);
    }
  };
  // goes to the host page
  const goesHost = () => {
    navigate(-1);
  };
  // set all errorText shown false
  const [ErrorText1, setErrorText1] = useState(false);
  const [ErrorText2, setErrorText2] = useState(false);
  const [ErrorText3, setErrorText3] = useState(false);
  const [ErrorText4, setErrorText4] = useState(false);
  const [ErrorText5, setErrorText5] = useState(false);
  const [ErrorText6, setErrorText6] = useState(false);
  const [ErrorText7, setErrorText7] = useState(false);
  const [ErrorText8, setErrorText8] = useState(false);
  const [ErrorText9, setErrorText9] = useState(false);
  const setAllfalse = () => {
    setErrorText1(false);
    setErrorText2(false);
    setErrorText3(false);
    setErrorText4(false);
    setErrorText5(false);
    setErrorText6(false);
    setErrorText7(false);
    setErrorText8(false);
    setErrorText9(false);
  };
  // set all scroll position empty
  const [errorContent, setErrorContent] = useState('');
  const scrollToQ1 = useRef(null);
  const scrollToQ2 = useRef(null);
  const scrollToQ3 = useRef(null);
  const scrollToQ4 = useRef(null);
  const scrollToQ5 = useRef(null);
  const scrollToQ6 = useRef(null);
  const scrollToQ7 = useRef(null);
  const scrollToQ8 = useRef(null);
  const scrollToQ9 = useRef(null);
  // set all image empty
  const [AllImaegsString, setSelectedImageString] = useState([]);
  // convert the image to string
  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      // read the image
      const reader = new FileReader();
      reader.onload = (event) => {
        // set the image
        if (event.target) {
          const base64String = event.target.result;
          resolve(base64String);
        }
      };
      // when meet error
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  };
  // convert all images to string
  const convertAllImagesToBase64 = (imageFiles) => {
    const base64Promises = imageFiles.map((file) => convertImageToBase64(file));
    return Promise.all(base64Promises);
  };
  // check a image is a 64base Image
  const isValidBase64Image = (base64String) => {
    // if not valid Base64 image
    if (!base64String.startsWith('data:image/')) {
      return false;
    }
    try {
      // if the image is empty
      if (base64String.trim() === '') {
        return false;
      }
      const datas = base64String;
      const realdata = String(datas.split(',')[1]);
      // Decode the base64 string
      const decodedData = btoa(atob(realdata));
      // if the decode and encode is same then true;
      return decodedData === realdata;
    } catch (error) {
      // when meet error show error
      setOpenSnackbar({
        severity: 'error',
        message: 'Your image is not follow 64base encode !',
      });
      console.log(error);
      return false; // Invalid base64 or unable to decode
    }
  };
  // add the thumbil to the page
  const AddThumbil = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      // get the first element
      const file = files[0];
      // start render
      const reader = new FileReader();
      if (file) {
        // loading these image
        reader.onload = (event) => {
          if (event.target) {
            // if the data is valid then set it else prompt error
            const base64Data = event.target.result;
            if (isValidBase64Image(base64Data)) {
              // valid file
              setAllfalse();
              console.log(base64Data);
              setThumbil(base64Data);
            } else {
              // invalid file
              setAllfalse();
              setErrorContent('Not a valid image!');
              setErrorText7(true);
            }
          }
        };
        // when meet error
        reader.onerror = (event) => {
          // if the target is not null
          if (event.target) {
            // show error
            console.error('Error reading file:', event.target.error);
            setAllfalse();
            setErrorContent('Error reading file');
            setErrorText7(true);
          }
        };
        // start read the file
        reader.readAsDataURL(file);
      }
    }
  };
  // initial the file is null
  const [fileInputValue, setFileInputValue] = useState('');
  // add the image to the page
  const AddImage = (event) => {
    // get the files
    const files = event.target.files;
    // if the files is not null
    if (files && files.length > 0) {
      // get the all files
      const promises = Array.from(files).map((file) => {
        return new Promise((resolve, reject) => {
          // read the file
          const reader = new FileReader();
          // when the file is loaded
          reader.onload = (event) => {
            // if the target is not null
            if (event.target) {
              // get the base64 string
              const base64Data = event.target.result;
              // if the image is valid
              if (isValidBase64Image(base64Data)) {
                // valid file
                resolve(file);
              } else {
                // invalid file
                reject(new Error('Not a valid image!'));
              }
            }
          };
          // when meet error
          reader.onerror = (event) => {
            // if the target is not null
            if (event.target) {
              // show error
              console.error('Error reading file:', event.target.error);
              reject(new Error('Error reading file'));
            }
          };
          // start read the file
          reader.readAsDataURL(file);
        });
      });
      // when all files is loaded
      Promise.all(promises)
        // if the files is valid
        .then((results) => {
          // get the valid files
          const validFiles = results;
          // set all errormessgae hidden
          setAllfalse();
          // set the file input value
          convertAllImagesToBase64(validFiles)
            .then((base64Strings) => {
              // add the image to the page
              const base64array = base64Strings;
              setSelectedImageString([...AllImaegsString, ...base64array]);
            })
            .catch((error) => {
              // if the image is not valid
              // show error
              setOpenSnackbar({
                severity: 'error',
                message: 'Your Image upload has some error, please try again!',
              });
              setOpenSnackbar({
                severity: 'error',
                message: '',
              });
              // show error
              console.error(error);
            });
          // set the file input value to null
          setFileInputValue('');
        })
        .catch((error) => {
          // if the image is not valid
          // show error
          setOpenSnackbar({
            severity: 'error',
            message: 'Your Image upload has some error, please try again!',
          });
          // show error
          setOpenSnackbar({
            severity: 'error',
            message: '',
          });
          // set all errormessgae hidden
          setAllfalse();
          // show error
          setErrorContent(error);
          // scroll to the error message
          setErrorText7(true);
        });
    }
  };
  // remove the image from the page
  const RemoveImage = (index) => {
    // create new image list, remove the image
    const updatedImagesString = AllImaegsString.filter(
      (_, i) => String(i) !== index
    );
    setSelectedImageString(updatedImagesString);
  };
  // scroll to a element
  const scrollToElement = (ref) => {
    // if the ref is not null
    if (ref.current) {
      // scroll to the element
      console.log(ref.current);
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  // 时间区间设置
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
  // creat a new hosting
  const EditNow = () => {
    const data = {
      spotName: String(Title),
      spotType: String(SpaceType),
      size: String(CarType),
      charge: String(charge),
      passWay: String(PassWay),
      spotAddr: JSON.stringify({
        Country: Country,
        City: City,
        State: State,
        Postcode: Postcode,
        Street: Street,
      }),
      Owner: OwnerId,
      isDayRent: isDay,
      isOurRent: isHour,
      isWeekRent: isWeek,
      pricePerDay: parseFloat(PriseDay) || 0,
      pricePerHour: parseFloat(PriseHour) || 0,
      pricePerWeek: parseFloat(PriseWeek) || 0,
      pictures: Thumbil,
      morePictures: AllImaegsString,
      availableTime: timeIntervals,
    };
    // the price pattern
    const pricePattern = /^[1-9]\d{0,4}$/;
    // set confirmflag to true
    let Confirmflag = true;
    console.log(data);
    if (data) {
      // inital the data
      // if the title is empty
      if (data.spotType.length === 0) {
        console.log('no type');
        Confirmflag = false;
        setAllfalse();
        setErrorContent('You must select one type for your spot.');
        setErrorText1(true);
        scrollToElement(scrollToQ1);
      }
      if (Confirmflag && data.size.length === 0) {
        console.log('no type');
        Confirmflag = false;
        setAllfalse();
        setErrorContent('You must select one type of car for your spot');
        setErrorText2(true);
        scrollToElement(scrollToQ2);
      }
      // if the address is not empty
      if (Confirmflag && data.spotAddr) {
        setAllfalse();
        const letterPattern = /[a-zA-Z]+/;
        const numericPattern = /^[0-9]+$/;
        // if the content is not valid
        if (!letterPattern.test(Country)) {
          console.log('invalid country');
          setErrorContent('Your country name is invalid');
          Confirmflag = false;
        } else if (!letterPattern.test(Street)) {
          // if the street is not valid
          setErrorContent('Your street name is invalid');
          Confirmflag = false;
          console.log('invalid country');
        } else if (!letterPattern.test(City)) {
          // if the city is not valid
          setErrorContent('Your city name is invalid');
          Confirmflag = false;
          console.log('invalid country');
        } else if (!letterPattern.test(State)) {
          // if the state is not valid
          setErrorContent('Your state name is invalid');
          Confirmflag = false;
          console.log('invalid country');
        } else if (!numericPattern.test(Postcode)) {
          // if the postcode is not valid
          setErrorContent('Your Postcode name is invalid');
          Confirmflag = false;
          console.log('invalid postcode');
        }
        if (!Confirmflag) {
          // if the errorText is not valid
          setErrorText3(true);
          console.log(scrollToQ3);
          scrollToElement(scrollToQ3);
        }
      }
      // if the title is empty
      if (Confirmflag && data.passWay.length === 0) {
        console.log('no Passway');
        setAllfalse();
        setErrorContent('You must set a Passway for your hosting');
        setErrorText4(true);
        scrollToElement(scrollToQ4);
        Confirmflag = false;
      }
      if (Confirmflag && data.charge.length === 0) {
        console.log('no title');
        setAllfalse();
        setErrorContent('You must set a charge information for your hosting.');
        setErrorText5(true);
        scrollToElement(scrollToQ5);
        Confirmflag = false;
      }
      // if the title is empty
      if (Confirmflag && data.spotName.length === 0) {
        console.log('no title');
        setAllfalse();
        setErrorContent('You must set a title for your hosting');
        setErrorText6(true);
        scrollToElement(scrollToQ6);
        Confirmflag = false;
      }
      // if the price is empty
      if (Confirmflag && !(isDay || isHour || isWeek)) {
        console.log('No price');
        setAllfalse();
        setErrorContent('Your must accept one kind of rent way');
        setErrorText7(true);
        Confirmflag = false;
        scrollToElement(scrollToQ7);
      }
      if (Confirmflag && isDay && !pricePattern.test(PriseDay)) {
        console.log('No price');
        setAllfalse();
        setErrorContent('Your price must between 1 to 99999');
        setErrorText7(true);
        Confirmflag = false;
        scrollToElement(scrollToQ7);
      }
      if (Confirmflag && isHour && !pricePattern.test(PriseHour)) {
        console.log('No price');
        setAllfalse();
        setErrorContent('Your price must between 1 to 99999');
        setErrorText7(true);
        Confirmflag = false;
        scrollToElement(scrollToQ7);
      }
      if (Confirmflag && isWeek && !pricePattern.test(PriseWeek)) {
        console.log('No price');
        setAllfalse();
        setErrorContent('Your price must between 1 to 99999');
        setErrorText7(true);
        Confirmflag = false;
        scrollToElement(scrollToQ7);
      }
      if (Confirmflag && (FirstStart === null || FirstEnd === null)) {
        setAllfalse();
        setErrorContent('Your all of the time choice can not be null.');
        setErrorText8(true);
        Confirmflag = false;
        scrollToElement(scrollToQ8);
      }
      if (Confirmflag) {
        const res = data.availableTime.filter((value) => {
          return value.startDate === null || value.endDate === null;
        });
        if (res.length !== 0) {
          setAllfalse();
          setErrorContent('Your all of the time choice can not be null.');
          setErrorText8(true);
          Confirmflag = false;
          scrollToElement(scrollToQ8);
        }
      }
      // if the image is empty
      if (Confirmflag && Thumbil === '') {
        setAllfalse();
        setErrorContent('You must show your hosting pictures to us');
        setErrorText9(true);
        Confirmflag = false;
        scrollToElement(scrollToQ9);
      }
      if (Confirmflag) {
        const firstDateRange = {
          id: Date.now(), // unique id
          startDate: FirstStart,
          endDate: FirstEnd,
          distance: GetDistance(FirstStart, FirstEnd),
        };
        const _lodash = require('lodash');
        let temp = _lodash.cloneDeep(data.availableTime);
        let result = [firstDateRange, ...temp];
        data.availableTime = JSON.stringify(result);

        data.morePictures = JSON.stringify(data.morePictures);
        setData(data);
        setOpenApprove(true);
      }
    }
  };
  const DeleteNow = () => {
    setOpenDelete(true);
  };
  const HiddenNow = () => {
    setOpenHidden(true);
  };
  return (
    <div className='CreatChannelOverall'>
      <EditCheck
        data={SpotData}
        isOpen={isOpenApprove}
        close={() => {
          setOpenApprove(false);
        }}
      />
      <HiddenCheck
        spotName={Title}
        Owner={OwnerId}
        isOpen={isOpenHidden}
        close={() => {
          setOpenHidden(false);
        }}
      />
      <DeleteCheck
        spotName={Title}
        Owner={OwnerId}
        isOpen={isOpenDelete}
        close={() => {
          setOpenDelete(false);
        }}
      />
      <div className='CreatNewHeader'>
        <div className='CreateLogo'>
          <img className='ct-logo' src='/img/LOGO.svg' alt=''></img>
        </div>
        <div className='HeaderRightButtonPart'>
          <p className='HeaderRightButtonself' onClick={goesHost}>
            Back
          </p>
        </div>
      </div>
      <div className='Q1' ref={scrollToQ1} id='Q1'>
        <p className='QoneQuestionPart'>
          Which of these best describes your CarSpace?
        </p>
        <div className='QoneAnswerPart'>
          <input
            className='QoneSelect'
            type='radio'
            name='accommodation'
            id='Carport'
            onClick={ChangeType}
          ></input>
          <label
            className={
              SpaceType === 'Carport' ? 'QoneShowSelected' : 'QoneShowSelect'
            }
            htmlFor='Carport'
            id='Hous'
          >
            Carport
          </label>
          <input
            className='QoneSelect'
            type='radio'
            name='accommodation'
            id='Driveway'
            onClick={ChangeType}
          />
          <label
            className={
              SpaceType === 'Driveway' ? 'QoneShowSelected' : 'QoneShowSelect'
            }
            htmlFor='Driveway'
            id='Apart'
          >
            Driveway
          </label>
          <input
            className='QoneSelect'
            type='radio'
            name='accommodation'
            id='Garage'
            onClick={ChangeType}
          />
          <label
            className={
              SpaceType === 'Garage' ? 'QoneShowSelected' : 'QoneShowSelect'
            }
            id='caBIN'
            htmlFor='Garage'
            checked={SpaceType === 'Cabin'}
          >
            Garage
          </label>
          <input
            className='QoneSelect'
            type='radio'
            name='accommodation'
            id='Parking-lot'
            onClick={ChangeType}
          />
          <label
            className={
              SpaceType === 'Parking-lot'
                ? 'QoneShowSelected'
                : 'QoneShowSelect'
            }
            htmlFor='Parking-lot'
            id='Hot'
            checked={SpaceType === 'Hotel'}
          >
            Parking-lot
          </label>
        </div>
        {ErrorText1 && <p className='CreateError'>{errorContent}</p>}
      </div>
      <div className='Q' ref={scrollToQ2} id='Q2'>
        <p className='QtwoQ'>
          What type of cars can be parked in this parking space?
        </p>
        <p className='QtwoQsub'>
          Choose the largest vehicle your parking space can accommodate.
        </p>
        <div className='QoneAnswerPart'>
          <input
            className='QoneSelect'
            type='radio'
            name='cartype'
            id='Bike'
            onClick={ChangeCarType}
          ></input>
          <label
            className={
              CarType === 'Bike' ? 'QfourShowSelected' : 'QfourShowSelect'
            }
            htmlFor='Bike'
            id='Hous'
          >
            Bike
          </label>
          <input
            className='QoneSelect'
            type='radio'
            name='cartype'
            id='Sedan'
            onClick={ChangeCarType}
          />
          <label
            className={
              CarType === 'Sedan' ? 'QfourShowSelected' : 'QfourShowSelect'
            }
            htmlFor='Sedan'
            id='Apart'
          >
            Sedan
          </label>
          <input
            className='QoneSelect'
            type='radio'
            name='cartype'
            id='Hatchback'
            onClick={ChangeCarType}
          />
          <label
            className={
              CarType === 'Hatchback' ? 'QfourShowSelected' : 'QfourShowSelect'
            }
            id='caBIN'
            htmlFor='Hatchback'
          >
            Hatchback
          </label>
          <input
            className='QoneSelect'
            type='radio'
            name='cartype'
            id='4WD/SUV'
            onClick={ChangeCarType}
          />
          <label
            className={
              CarType === '4WD/SUV' ? 'QfourShowSelected' : 'QfourShowSelect'
            }
            htmlFor='4WD/SUV'
            id='Hot'
          >
            4WD/SUV
          </label>
          <input
            className='QoneSelect'
            type='radio'
            name='cartype'
            id='VAN'
            onClick={ChangeCarType}
          />
          <label
            className={
              CarType === 'VAN' ? 'QfourShowSelected' : 'QfourShowSelect'
            }
            htmlFor='VAN'
            id='Hot'
            checked={SpaceType === 'Hotel'}
          >
            VAN
          </label>
        </div>
        {ErrorText2 && <p className='CreateError'>{errorContent}</p>}
      </div>
      <div className='Q' ref={scrollToQ3} id='Q3'>
        <p className='QtwoQ'>Tell us about your address</p>
        <p className='QtwoQsub'>
          Your location will help customers better find parking spaces.
        </p>
        <div className='QtwoQasw'>
          <div className='QtwoQaswrow' tabIndex={0}>
            <label className='QtwoQaswLable'>Country/Region</label>
            <input
              className='QtwoQaswInput'
              id='country'
              value={Country}
              onChange={handleCountryChange}
            ></input>
          </div>
          <div className='QtwoQaswrow' tabIndex={0}>
            <label className='QtwoQaswLable'>Street address</label>
            <input
              className='QtwoQaswInput'
              id='street'
              value={Street}
              onChange={handleStreetChange}
            ></input>
          </div>
          <div className='QtwoQaswrow' tabIndex={0}>
            <label className='QtwoQaswLable'>Suburb/city</label>
            <input
              className='QtwoQaswInput'
              id='city'
              value={City}
              onChange={handleCityChange}
            ></input>
          </div>
          <div className='QtwoQaswrow' tabIndex={0}>
            <label className='QtwoQaswLable'>State/territory</label>
            <input
              className='QtwoQaswInput'
              id='state'
              value={State}
              onChange={handleStateChange}
            ></input>
          </div>
          <div className='QtwoQaswrow' tabIndex={0}>
            <label className='QtwoQaswLable'>Postcode</label>
            <input
              className='QtwoQaswInput'
              id='postcode'
              value={Postcode}
              onChange={handlePostcodeChange}
            ></input>
          </div>
        </div>
        {ErrorText3 && <p className='CreateError'>{errorContent}</p>}
      </div>
      <div className='Q' ref={scrollToQ4} id='Q4'>
        <p className='Q4q'>Tell customers how to park in your space ?</p>
        <p className='QtwoQsub'>
          Make sure your parking space is accessible to customers.
        </p>
        <div className='QoneAnswerPart'>
          <input
            className='QoneSelect'
            type='checkbox'
            name='passway'
            id='Nones'
            onChange={ChangePassWay}
          />
          <label
            className={
              PassWay === 'Nones' ? 'QfourShowSelected' : 'QfourShowSelect'
            }
            id='wifi'
            htmlFor='Nones'
          >
            None
          </label>
          <input
            className='QoneSelect'
            type='checkbox'
            name='passway'
            id='Physical key'
            onChange={ChangePassWay}
          />
          <label
            className={
              PassWay === 'Physical key'
                ? 'QfourShowSelected'
                : 'QfourShowSelect'
            }
            htmlFor='Physical key'
            id='tv'
          >
            {'Physical key'}
          </label>
          <input
            className='QoneSelect'
            type='checkbox'
            name='passway'
            id='Password'
            onChange={ChangePassWay}
          />
          <label
            className={
              PassWay === 'Password' ? 'QfourShowSelected' : 'QfourShowSelect'
            }
            htmlFor='Password'
            id='kitch'
          >
            Password
          </label>
          <input
            className='QoneSelect'
            type='checkbox'
            name='passway'
            id='Digital Card'
            onChange={ChangePassWay}
          />
          <label
            className={
              PassWay === 'Digital Card'
                ? 'QfourShowSelected'
                : 'QfourShowSelect'
            }
            htmlFor='Digital Card'
            id='washing-machine'
          >
            {'Digital Card'}
          </label>
        </div>
        {ErrorText4 && <p className='CreateError'>{errorContent}</p>}
      </div>
      <div className='Q' ref={scrollToQ5} id='Q5'>
        <p className='Q4q'>
          Tell guests what type of the Electric charging this space parking
          offer?
        </p>
        <p className='QtwoQsub'>
          Equipped with charging stations will make your parking space stand
          out.
        </p>
        <div className='QoneAnswerPart'>
          <input
            className='QoneSelect'
            type='checkbox'
            name='charge'
            id='None'
            onChange={ChangeCharge}
          />
          <label
            className={
              charge === 'None' ? 'QfourShowSelected' : 'QfourShowSelect'
            }
            id='wifi'
            htmlFor='None'
          >
            None
          </label>
          <input
            className='QoneSelect'
            type='checkbox'
            name='charge'
            id='Wall(AU/NZ)'
            onChange={ChangeCharge}
          />
          <label
            className={
              charge === 'Wall(AU/NZ)' ? 'QfourShowSelected' : 'QfourShowSelect'
            }
            htmlFor='Wall(AU/NZ)'
            id='tv'
          >
            {'Wall(AU/NZ)'}
          </label>
          <input
            className='QoneSelect'
            type='checkbox'
            name='charge'
            id='SAE J-1772'
            onChange={ChangeCharge}
          />
          <label
            className={
              charge === 'SAE J-1772' ? 'QfourShowSelected' : 'QfourShowSelect'
            }
            htmlFor='SAE J-1772'
            id='kitch'
          >
            {'SAE J-1772'}
          </label>

          <input
            className='QoneSelect'
            type='checkbox'
            name='charge'
            id='Type2'
            onChange={ChangeCharge}
          />
          <label
            className={
              charge === 'Type2' ? 'QfourShowSelected' : 'QfourShowSelect'
            }
            htmlFor='Type2'
            id='washing-machine'
          >
            {'Type2'}
          </label>
          <input
            className='QoneSelect'
            type='checkbox'
            name='charge'
            id='CHAdeMO'
            onChange={ChangeCharge}
          />
          <label
            className={
              charge === 'CHAdeMO' ? 'QfourShowSelected' : 'QfourShowSelect'
            }
            htmlFor='CHAdeMO'
            id='air-cond'
          >
            CHAdeMO
          </label>
          <input
            className='QoneSelect'
            type='checkbox'
            name='accommodation'
            id='Free-Parking'
            onChange={ChangeCharge}
          />
        </div>
        {ErrorText5 && <p className='CreateError'>{errorContent}</p>}
      </div>
      <div className='Q' ref={scrollToQ6} id='Q6'>
        <p className='Q4q'>Now, lets give your spot a title.</p>
        <p className='QtwoQsub'>
          Short titles work best. Have fun with it—you can always change it
          later.
        </p>
        <div className='QoneAnswerPart'>
          <textarea
            className='Q5A'
            id='hosting-title'
            maxLength={32}
            onChange={handleTitleChange}
            value={Title}
          ></textarea>
        </div>
        <p className='LengthDetector'>{lengthOfTitle}/32</p>
        {ErrorText6 && <p className='CreateError'>{errorContent}</p>}
      </div>
      <div className='Q' ref={scrollToQ7} id='Q7'>
        <p className='Q4q'>Next we'll help you set up your parking revenue.</p>
        <p className='QtwoQsub'>You can change it anytime.</p>
        <div className='Q6aDiv'>
          <div className='Q6-row'>
            <div className='row-left'>
              <input
                type='checkbox'
                className='Q6ck'
                checked={isHour}
                onChange={() => {
                  setisHour(!isHour);
                }}
              ></input>
              <p className='Q6AP'>I'm okay with hourly rentals.</p>
            </div>
            <div className='row-right'>
              <p className='Q6AP'>$</p>
              <input
                className='Q6aInput'
                id='price'
                placeholder='0'
                maxLength={5}
                value={PriseHour}
                onChange={handlePriceHourChange}
                disabled={!isHour}
              ></input>
              <p className='Q6AP'>per hour.</p>
            </div>
          </div>

          <div className='Q6-row'>
            <div className='row-left'>
              <input
                type='checkbox'
                className='Q6ck'
                checked={isDay}
                onChange={() => {
                  setisDay(!isDay);
                }}
              ></input>
              <p className='Q6AP'>I'm okay with daily rentals.</p>
            </div>
            <div className='row-right'>
              <p className='Q6AP'>$</p>
              <input
                className='Q6aInput'
                id='price'
                placeholder='0'
                maxLength={5}
                value={PriseDay}
                onChange={handlePriceDayChange}
                disabled={!isDay}
              ></input>
              <p className='Q6AP'>per day.</p>
            </div>
          </div>
          <div className='Q6-row'>
            <div className='row-left'>
              <input
                type='checkbox'
                className='Q6ck'
                checked={isWeek}
                onChange={() => {
                  setWeek(!isWeek);
                }}
              ></input>
              <p className='Q6AP'>I'm okay with weekly rentals.</p>
            </div>
            <div className='row-right'>
              <p className='Q6AP'>$</p>
              <input
                className='Q6aInput'
                id='price'
                placeholder='0'
                maxLength={5}
                value={PriseWeek}
                onChange={handlePriceWeekChange}
                disabled={!isWeek}
              ></input>
              <p className='Q6AP'>per week.</p>
            </div>
          </div>
        </div>
        {ErrorText7 && <p className='CreateError'>{errorContent}</p>}
      </div>
      <div className='Q' ref={scrollToQ8} id='Q8'>
        <p className='Q4q'>
          Now let's set the available time for the parking space.
        </p>
        <p className='QtwoQsub'>You can change it anytime.</p>
        <div className='Q6aDiv'>
          <div className='PublishInfo'>
            <div className='IntervalHeader'>
              <p className='PublishTitle'>Available Time</p>
              <button className='AddInterval' onClick={addTimeInterval}>
                Add available time
              </button>
            </div>
            <div className='TimeInterval'>
              <div className='IntervalHeader'>
                <div className='Avtxt'>Available Time{' ' + 1}</div>
              </div>
              <div className='IntervalContent'>
                <div className='TimeBlock'>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker', 'DatePicker']}>
                      <DatePicker
                        label='Start Date'
                        value={FirstStart}
                        minDate={dayjs(new Date())}
                        onChange={(date) => {
                          if (date) FirstStartChange(date);
                        }}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </div>
                <p className='TO'> - </p>
                <div className='TimeBlock'>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker', 'DatePicker']}>
                      <DatePicker
                        label='End Date'
                        value={FirstEnd}
                        minDate={dayjs(FirstStart)}
                        onChange={(date) => {
                          if (date) FirstEndChange(date);
                        }}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </div>
              </div>
              <div className='IntervalBottom'>
                <div className='Pricetxt'>Totol Day{'  ' + Firstdistance}</div>
              </div>
            </div>
            {timeIntervals.map((interval, index) => (
              <div className='TimeInterval' key={interval.id}>
                <div className='IntervalHeader'>
                  <div className='Avtxt'>Available Time{' ' + (index + 2)}</div>
                  <button
                    className='ClearInterval'
                    onClick={() => {
                      deleteInterval(interval.id);
                    }}
                  >
                    Delete Interval
                  </button>
                </div>
                <div className='IntervalContent'>
                  <div className='TimeBlock'>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={['DatePicker', 'DatePicker']}>
                        <DatePicker
                          label='Start Date'
                          value={interval.startDate}
                          minDate={dayjs(new Date())}
                          onChange={(date) => {
                            if (date) handleStartDateChange(index, date);
                          }}
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                  </div>
                  <p className='TO'> - </p>
                  <div className='TimeBlock'>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={['DatePicker']}>
                        <DatePicker
                          label='End Date'
                          value={interval.endDate}
                          minDate={dayjs(interval.startDate)}
                          onChange={(date) => {
                            if (date) handleEndDateChange(index, date);
                          }}
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                  </div>
                </div>
                <div className='IntervalBottom'>
                  <div className='Pricetxt'>
                    Totol Day{'  ' + interval.distance}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {ErrorText8 && <p className='CreateError'>{errorContent}</p>}
      </div>
      <div className='Q' ref={scrollToQ9} id='Q9'>
        <p className='Q4q'>Add some photos of your barn</p>
        <p className='QtwoQsub'>
          You’ll need one photos to get started. This photo would as your
          hosting Thumbnail.
        </p>
        <div className='Q7aDiv'>
          <input
            className='QoneSelect'
            id='upload'
            onChange={AddThumbil}
            type='file'
            ref={RefT}
            accept='image/*'
          ></input>
          <img
            className='UploadIMG'
            id='callupload'
            onClick={HandleT}
            src={
              Thumbil.includes('base64')
                ? Thumbil
                : 'data:image/jpeg;base64,' + Thumbil || '/img/addusr.png'
            }
            alt='Upload from your device'
          ></img>
        </div>
        {ErrorText9 && <p className='CreateError'>{errorContent}</p>}
      </div>
      <div className='Q' id='Q10'>
        <p className='Q4q'>Add more photos of your barn</p>
        <p className='QtwoQsub'>
          This is optional if you want show more of your hosting. You can add
          more or make changes later. The first photo would as your hosting
          Thumbnail.
        </p>
        <div className='Q7aDiv'>
          <input
            className='QoneSelect'
            id='upload'
            onChange={AddImage}
            type='file'
            ref={RefFile}
            value={fileInputValue}
            accept='image/*'
          ></input>
          <button className='UploadButton' onClick={HandleFile}>
            Upload from your device
          </button>
        </div>
        {AllImaegsString.map((item, index) => (
          <div
            className='LasteachImage'
            key={index}
            onClick={() => RemoveImage(String(index))}
          >
            <HoverImage
              src={
                item.includes('base64')
                  ? item
                  : 'data:image/jpeg;base64,' + item || '/img/addusr.png'
              }
              alt={`Image ${index}`}
            />
          </div>
        ))}
      </div>
      <div className='QButton'>
        <button
          className='CreatButton-b'
          onClick={() => EditNow()}
          type='button'
        >
          Edit Spot
        </button>
        <button className='CreatButton-b white' onClick={() => HiddenNow()}>
          Hidden This Spot
        </button>
        <button className='CreatButton-b black' onClick={() => DeleteNow()}>
          Delete This Spot
        </button>
      </div>
    </div>
  );
};

export const ManagerApproveEditSpace = () => {
  const { setOpenSnackbar } = useError();
  const { adminid, Spotid } = useParams();
  const [isOpenDelete, setOpenDelete] = useState(false);
  const [isOpenApprove, setOpenApprove] = useState(false);
  const [SpotData, setData] = useState({});
  const [OwnerId, setOwnerId] = useState(null);
  console.log(adminid);
  console.log(Spotid);
  useEffect(() => {
    let getDetail = (Spotid) => {
      callAPIGetSpecSpot('spot/' + Spotid)
        .then((response) => {
          console.log(response);
          setCarType(response.message.Size);
          setOwnerId(response.message.OwnerID);
          setCharge(response.message.Charge);
          setPassWay(response.message.PassWay);
          setType(response.message.SpotType);
          setTitle(response.message.SpotName);
          setisDay(response.message.IsDayRent);
          setPriceDay(response.message.PricePerDay);
          setisHour(response.message.IsHourRent);
          setPriceHour(response.message.PricePerHour);
          setWeek(response.message.IsWeekRent);
          setPriceWeek(response.message.PricePerWeek);
          setThumbil(response.message.Pictures);
          const res = JSON.parse(response.message.MorePictures);
          setSelectedImageString(res);
          console.log(res);
          try {
            const ads = JSON.parse(response.message.SpotAddr);
            console.log(ads);
            setState(ads.State);
            setStreet(ads.Street);
            setCity(ads.City);
            setCountry(ads.Country);
            setPostcode(ads.Postcode);
          } catch (e) {
            const ads = response.message.SpotAddr.split(',');
            console.log(ads);
            setState(ads[0]);
            setStreet(ads[0]);
            setCity(ads.City[1]);
            setCountry(ads[2]);
            setPostcode(ads.Postcode[2]);
          }
          const ads = JSON.parse(response.message.SpotAddr);
          console.log(ads);
          setState(ads.State);
          setStreet(ads.Street);
          setCity(ads.City);
          setCountry(ads.Country);
          setPostcode(ads.Postcode);
          let all_time = JSON.parse(response.message.AvailableTime);
          all_time = all_time.map((item) => ({
            ...item,
            startDate: dayjs(item.startDate),
            endDate: dayjs(item.endDate),
          }));
          console.log(all_time);
          setFirstStart(all_time[0].startDate);
          setFirstEnd(all_time[0].endDate);
          setDistance(all_time[0].distance);
          setTimeIntervals((timeIntervals) => [...all_time.slice(1)]);
        })
        .catch((error) => {
          setOpenSnackbar({
            severity: 'warning',
            message: error,
            timestamp: new Date().getTime(),
          });
        });
    };
    getDetail(Spotid);
  }, [setOpenSnackbar, Spotid]);
  // link the ref for thumb and other img
  const RefT = useRef(null);
  const RefFile = useRef(null);
  // if the button click then open the file loader
  const HandleT = () => {
    if (RefT.current) {
      RefT.current.click();
    }
  };
  // if the button click then open the file loader
  const HandleFile = () => {
    if (RefFile.current) {
      RefFile.current.click();
    }
  };
  const navigate = useNavigate();
  // set title empty;
  const [lengthOfTitle, setlength] = useState(0);
  // set type empty;
  const [SpaceType, setType] = useState('');
  // set charge empty;
  const [charge, setCharge] = useState('');
  const ChangeCharge = (event) => {
    const target = event.target;
    if (target.id) {
      setCharge(target.id);
    }
  };
  const [PassWay, setPassWay] = useState('');
  const ChangePassWay = (event) => {
    const target = event.target;
    if (target.id) {
      setPassWay(target.id);
    }
  };
  const [isHour, setisHour] = useState(false);
  const [isDay, setisDay] = useState(false);
  const [isWeek, setWeek] = useState(false);
  // set type empty;
  const [CarType, setCarType] = useState('');
  // set contry empty
  const [Country, setCountry] = useState('');
  const handleCountryChange = (event) => {
    setCountry(event.target.value);
  };
  // set street empty
  const [Street, setStreet] = useState('');
  const handleStreetChange = (event) => {
    setStreet(event.target.value);
  };
  // set city empty
  const [City, setCity] = useState('');
  const handleCityChange = (event) => {
    setCity(event.target.value);
  };
  // set state empty
  const [State, setState] = useState('');
  const handleStateChange = (event) => {
    setState(event.target.value);
  };
  // set postcode empty
  const [Postcode, setPostcode] = useState('');
  const handlePostcodeChange = (event) => {
    setPostcode(event.target.value);
  };
  // set thumbil empty
  const [Thumbil, setThumbil] = useState('');
  // set all facility false
  const [Title, setTitle] = useState('');
  const handleTitleChange = (event) => {
    setTitle(event.target.value);
    setlength(event.target.value.length);
  };
  // set price for daily
  const [PriseDay, setPriceDay] = useState('');
  const handlePriceDayChange = (event) => {
    setPriceDay(event.target.value);
  };
  // set price for daily
  const [PriseWeek, setPriceWeek] = useState('');
  const handlePriceWeekChange = (event) => {
    setPriceWeek(event.target.value);
  };
  // set price for daily
  const [PriseHour, setPriceHour] = useState('');
  const handlePriceHourChange = (event) => {
    setPriceHour(event.target.value);
  };
  // when the type is changed
  const ChangeType = (event) => {
    const target = event.target;
    if (target.id) {
      setType(target.id);
    }
  };
  const ChangeCarType = (event) => {
    const target = event.target;
    if (target.id) {
      setCarType(target.id);
    }
  };
  // goes to the host page
  const goesHost = () => {
    navigate(-1);
  };
  // set all errorText shown false
  const [ErrorText1, setErrorText1] = useState(false);
  const [ErrorText2, setErrorText2] = useState(false);
  const [ErrorText3, setErrorText3] = useState(false);
  const [ErrorText4, setErrorText4] = useState(false);
  const [ErrorText5, setErrorText5] = useState(false);
  const [ErrorText6, setErrorText6] = useState(false);
  const [ErrorText7, setErrorText7] = useState(false);
  const [ErrorText8, setErrorText8] = useState(false);
  const [ErrorText9, setErrorText9] = useState(false);
  const setAllfalse = () => {
    setErrorText1(false);
    setErrorText2(false);
    setErrorText3(false);
    setErrorText4(false);
    setErrorText5(false);
    setErrorText6(false);
    setErrorText7(false);
    setErrorText8(false);
    setErrorText9(false);
  };
  // set all scroll position empty
  const [errorContent, setErrorContent] = useState('');
  const scrollToQ1 = useRef(null);
  const scrollToQ2 = useRef(null);
  const scrollToQ3 = useRef(null);
  const scrollToQ4 = useRef(null);
  const scrollToQ5 = useRef(null);
  const scrollToQ6 = useRef(null);
  const scrollToQ7 = useRef(null);
  const scrollToQ8 = useRef(null);
  const scrollToQ9 = useRef(null);
  // set all image empty
  const [AllImaegsString, setSelectedImageString] = useState([]);
  // convert the image to string
  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      // read the image
      const reader = new FileReader();
      reader.onload = (event) => {
        // set the image
        if (event.target) {
          const base64String = event.target.result;
          resolve(base64String);
        }
      };
      // when meet error
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  };
  // convert all images to string
  const convertAllImagesToBase64 = (imageFiles) => {
    const base64Promises = imageFiles.map((file) => convertImageToBase64(file));
    return Promise.all(base64Promises);
  };
  // check a image is a 64base Image
  const isValidBase64Image = (base64String) => {
    // if not valid Base64 image
    if (!base64String.startsWith('data:image/')) {
      return false;
    }
    try {
      // if the image is empty
      if (base64String.trim() === '') {
        return false;
      }
      const datas = base64String;
      const realdata = String(datas.split(',')[1]);
      // Decode the base64 string
      const decodedData = btoa(atob(realdata));
      // if the decode and encode is same then true;
      return decodedData === realdata;
    } catch (error) {
      // when meet error show error
      setOpenSnackbar({
        severity: 'error',
        message: 'Your image is not follow 64base encode !',
      });
      console.log(error);
      return false; // Invalid base64 or unable to decode
    }
  };
  // add the thumbil to the page
  const AddThumbil = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      // get the first element
      const file = files[0];
      // start render
      const reader = new FileReader();
      if (file) {
        // loading these image
        reader.onload = (event) => {
          if (event.target) {
            // if the data is valid then set it else prompt error
            const base64Data = event.target.result;
            if (isValidBase64Image(base64Data)) {
              // valid file
              setAllfalse();
              console.log(base64Data);
              setThumbil(base64Data);
            } else {
              // invalid file
              setAllfalse();
              setErrorContent('Not a valid image!');
              setErrorText7(true);
            }
          }
        };
        // when meet error
        reader.onerror = (event) => {
          // if the target is not null
          if (event.target) {
            // show error
            console.error('Error reading file:', event.target.error);
            setAllfalse();
            setErrorContent('Error reading file');
            setErrorText7(true);
          }
        };
        // start read the file
        reader.readAsDataURL(file);
      }
    }
  };
  // initial the file is null
  const [fileInputValue, setFileInputValue] = useState('');
  // add the image to the page
  const AddImage = (event) => {
    // get the files
    const files = event.target.files;
    // if the files is not null
    if (files && files.length > 0) {
      // get the all files
      const promises = Array.from(files).map((file) => {
        return new Promise((resolve, reject) => {
          // read the file
          const reader = new FileReader();
          // when the file is loaded
          reader.onload = (event) => {
            // if the target is not null
            if (event.target) {
              // get the base64 string
              const base64Data = event.target.result;
              // if the image is valid
              if (isValidBase64Image(base64Data)) {
                // valid file
                resolve(file);
              } else {
                // invalid file
                reject(new Error('Not a valid image!'));
              }
            }
          };
          // when meet error
          reader.onerror = (event) => {
            // if the target is not null
            if (event.target) {
              // show error
              console.error('Error reading file:', event.target.error);
              reject(new Error('Error reading file'));
            }
          };
          // start read the file
          reader.readAsDataURL(file);
        });
      });
      // when all files is loaded
      Promise.all(promises)
        // if the files is valid
        .then((results) => {
          // get the valid files
          const validFiles = results;
          // set all errormessgae hidden
          setAllfalse();
          // set the file input value
          convertAllImagesToBase64(validFiles)
            .then((base64Strings) => {
              // add the image to the page
              const base64array = base64Strings;
              setSelectedImageString([...AllImaegsString, ...base64array]);
            })
            .catch((error) => {
              // if the image is not valid
              // show error
              setOpenSnackbar({
                severity: 'error',
                message: 'Your Image upload has some error, please try again!',
              });
              setOpenSnackbar({
                severity: 'error',
                message: '',
              });
              // show error
              console.error(error);
            });
          // set the file input value to null
          setFileInputValue('');
        })
        .catch((error) => {
          // if the image is not valid
          // show error
          setOpenSnackbar({
            severity: 'error',
            message: 'Your Image upload has some error, please try again!',
          });
          // show error
          setOpenSnackbar({
            severity: 'error',
            message: '',
          });
          // set all errormessgae hidden
          setAllfalse();
          // show error
          setErrorContent(error);
          // scroll to the error message
          setErrorText7(true);
        });
    }
  };
  // remove the image from the page
  const RemoveImage = (index) => {
    // create new image list, remove the image
    const updatedImagesString = AllImaegsString.filter(
      (_, i) => String(i) !== index
    );
    setSelectedImageString(updatedImagesString);
  };
  // scroll to a element
  const scrollToElement = (ref) => {
    // if the ref is not null
    if (ref.current) {
      // scroll to the element
      console.log(ref.current);
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  // 时间区间设置
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
  // creat a new hosting
  const EditNow = (id) => {
    const data = {
      spotName: String(Title),
      spotType: String(SpaceType),
      size: String(CarType),
      charge: String(charge),
      passWay: String(PassWay),
      spotAddr: JSON.stringify({
        Country: Country,
        City: City,
        State: State,
        Postcode: Postcode,
        Street: Street,
      }),
      Owner: OwnerId,
      isDayRent: isDay,
      isOurRent: isHour,
      isWeekRent: isWeek,
      pricePerDay: parseFloat(PriseDay) || 0,
      pricePerHour: parseFloat(PriseHour) || 0,
      pricePerWeek: parseFloat(PriseWeek) || 0,
      pictures: Thumbil,
      morePictures: AllImaegsString,
      availableTime: timeIntervals,
    };
    // the price pattern
    const pricePattern = /^[1-9]\d{0,4}$/;
    // set confirmflag to true
    let Confirmflag = true;
    console.log(data);
    if (data) {
      // inital the data
      // if the title is empty
      if (data.spotType.length === 0) {
        console.log('no type');
        Confirmflag = false;
        setAllfalse();
        setErrorContent('You must select one type for your spot.');
        setErrorText1(true);
        scrollToElement(scrollToQ1);
      }
      if (Confirmflag && data.size.length === 0) {
        console.log('no type');
        Confirmflag = false;
        setAllfalse();
        setErrorContent('You must select one type of car for your spot');
        setErrorText2(true);
        scrollToElement(scrollToQ2);
      }
      // if the address is not empty
      if (Confirmflag && data.spotAddr) {
        setAllfalse();
        const letterPattern = /[a-zA-Z]+/;
        const numericPattern = /^[0-9]+$/;
        // if the content is not valid
        if (!letterPattern.test(Country)) {
          console.log('invalid country');
          setErrorContent('Your country name is invalid');
          Confirmflag = false;
        } else if (!letterPattern.test(Street)) {
          // if the street is not valid
          setErrorContent('Your street name is invalid');
          Confirmflag = false;
          console.log('invalid country');
        } else if (!letterPattern.test(City)) {
          // if the city is not valid
          setErrorContent('Your city name is invalid');
          Confirmflag = false;
          console.log('invalid country');
        } else if (!letterPattern.test(State)) {
          // if the state is not valid
          setErrorContent('Your state name is invalid');
          Confirmflag = false;
          console.log('invalid country');
        } else if (!numericPattern.test(Postcode)) {
          // if the postcode is not valid
          setErrorContent('Your Postcode name is invalid');
          Confirmflag = false;
          console.log('invalid postcode');
        }
        if (!Confirmflag) {
          // if the errorText is not valid
          setErrorText3(true);
          console.log(scrollToQ3);
          scrollToElement(scrollToQ3);
        }
      }
      // if the title is empty
      if (Confirmflag && data.passWay.length === 0) {
        console.log('no Passway');
        setAllfalse();
        setErrorContent('You must set a Passway for your hosting');
        setErrorText4(true);
        scrollToElement(scrollToQ4);
        Confirmflag = false;
      }
      if (Confirmflag && data.charge.length === 0) {
        console.log('no title');
        setAllfalse();
        setErrorContent('You must set a charge information for your hosting.');
        setErrorText5(true);
        scrollToElement(scrollToQ5);
        Confirmflag = false;
      }
      // if the title is empty
      if (Confirmflag && data.spotName.length === 0) {
        console.log('no title');
        setAllfalse();
        setErrorContent('You must set a title for your hosting');
        setErrorText6(true);
        scrollToElement(scrollToQ6);
        Confirmflag = false;
      }
      // if the price is empty
      if (Confirmflag && !(isDay || isHour || isWeek)) {
        console.log('No price');
        setAllfalse();
        setErrorContent('Your must accept one kind of rent way');
        setErrorText7(true);
        Confirmflag = false;
        scrollToElement(scrollToQ7);
      }
      if (Confirmflag && isDay && !pricePattern.test(PriseDay)) {
        console.log('No price');
        setAllfalse();
        setErrorContent('Your price must between 1 to 99999');
        setErrorText7(true);
        Confirmflag = false;
        scrollToElement(scrollToQ7);
      }
      if (Confirmflag && isHour && !pricePattern.test(PriseHour)) {
        console.log('No price');
        setAllfalse();
        setErrorContent('Your price must between 1 to 99999');
        setErrorText7(true);
        Confirmflag = false;
        scrollToElement(scrollToQ7);
      }
      if (Confirmflag && isWeek && !pricePattern.test(PriseWeek)) {
        console.log('No price');
        setAllfalse();
        setErrorContent('Your price must between 1 to 99999');
        setErrorText7(true);
        Confirmflag = false;
        scrollToElement(scrollToQ7);
      }
      if (Confirmflag && (FirstStart === null || FirstEnd === null)) {
        setAllfalse();
        setErrorContent('Your all of the time choice can not be null.');
        setErrorText8(true);
        Confirmflag = false;
        scrollToElement(scrollToQ8);
      }
      if (Confirmflag) {
        const res = data.availableTime.filter((value) => {
          return value.startDate === null || value.endDate === null;
        });
        if (res.length !== 0) {
          setAllfalse();
          setErrorContent('Your all of the time choice can not be null.');
          setErrorText8(true);
          Confirmflag = false;
          scrollToElement(scrollToQ8);
        }
      }
      // if the image is empty
      if (Confirmflag && Thumbil === '') {
        setAllfalse();
        setErrorContent('You must show your hosting pictures to us');
        setErrorText9(true);
        Confirmflag = false;
        scrollToElement(scrollToQ9);
      }
      if (Confirmflag) {
        let firstDateRange = {
          id: Date.now(), // unique id
          startDate: FirstStart,
          endDate: FirstEnd,
          distance: GetDistance(FirstStart, FirstEnd),
        };
        const _lodash = require('lodash');
        let temp = _lodash.cloneDeep(data.availableTime);
        let result = [firstDateRange, ...temp];
        data.availableTime = JSON.stringify(result);
        data.morePictures = JSON.stringify(data.morePictures);
        setData(data);
        setOpenApprove(true);
      }
    }
  };
  const DeleteNow = () => {
    setOpenDelete(true);
  };
  return (
    <div className='CreatChannelOverall'>
      <ApproveCheck
        data={SpotData}
        isOpen={isOpenApprove}
        close={() => {
          setOpenApprove(false);
        }}
      />
      <DeleteCheck
        spotName={Title}
        Owner={OwnerId}
        isOpen={isOpenDelete}
        close={() => {
          setOpenDelete(false);
        }}
      />
      <div className='CreatNewHeader'>
        <div className='CreateLogo'>
          <img className='ct-logo' src='/img/LOGO.svg' alt=''></img>
        </div>
        <div className='HeaderRightButtonPart'>
          <p className='HeaderRightButtonself' onClick={goesHost}>
            Back
          </p>
        </div>
      </div>
      <div className='Q1' ref={scrollToQ1} id='Q1'>
        <p className='QoneQuestionPart'>
          Which of these best describes your CarSpace?
        </p>
        <div className='QoneAnswerPart'>
          <input
            className='QoneSelect'
            type='radio'
            name='accommodation'
            id='Carport'
            onClick={ChangeType}
          ></input>
          <label
            className={
              SpaceType === 'Carport' ? 'QoneShowSelected' : 'QoneShowSelect'
            }
            htmlFor='Carport'
            id='Hous'
          >
            Carport
          </label>
          <input
            className='QoneSelect'
            type='radio'
            name='accommodation'
            id='Driveway'
            onClick={ChangeType}
          />
          <label
            className={
              SpaceType === 'Driveway' ? 'QoneShowSelected' : 'QoneShowSelect'
            }
            htmlFor='Driveway'
            id='Apart'
          >
            Driveway
          </label>
          <input
            className='QoneSelect'
            type='radio'
            name='accommodation'
            id='Garage'
            onClick={ChangeType}
          />
          <label
            className={
              SpaceType === 'Garage' ? 'QoneShowSelected' : 'QoneShowSelect'
            }
            id='caBIN'
            htmlFor='Garage'
            checked={SpaceType === 'Cabin'}
          >
            Garage
          </label>
          <input
            className='QoneSelect'
            type='radio'
            name='accommodation'
            id='Parking-lot'
            onClick={ChangeType}
          />
          <label
            className={
              SpaceType === 'Parking-lot'
                ? 'QoneShowSelected'
                : 'QoneShowSelect'
            }
            htmlFor='Parking-lot'
            id='Hot'
            checked={SpaceType === 'Hotel'}
          >
            Parking-lot
          </label>
        </div>
        {ErrorText1 && <p className='CreateError'>{errorContent}</p>}
      </div>
      <div className='Q' ref={scrollToQ2} id='Q2'>
        <p className='QtwoQ'>
          What type of cars can be parked in this parking space?
        </p>
        <p className='QtwoQsub'>
          Choose the largest vehicle your parking space can accommodate.
        </p>
        <div className='QoneAnswerPart'>
          <input
            className='QoneSelect'
            type='radio'
            name='cartype'
            id='Bike'
            onClick={ChangeCarType}
          ></input>
          <label
            className={
              CarType === 'Bike' ? 'QfourShowSelected' : 'QfourShowSelect'
            }
            htmlFor='Bike'
            id='Hous'
          >
            Bike
          </label>
          <input
            className='QoneSelect'
            type='radio'
            name='cartype'
            id='Sedan'
            onClick={ChangeCarType}
          />
          <label
            className={
              CarType === 'Sedan' ? 'QfourShowSelected' : 'QfourShowSelect'
            }
            htmlFor='Sedan'
            id='Apart'
          >
            Sedan
          </label>
          <input
            className='QoneSelect'
            type='radio'
            name='cartype'
            id='Hatchback'
            onClick={ChangeCarType}
          />
          <label
            className={
              CarType === 'Hatchback' ? 'QfourShowSelected' : 'QfourShowSelect'
            }
            id='caBIN'
            htmlFor='Hatchback'
          >
            Hatchback
          </label>
          <input
            className='QoneSelect'
            type='radio'
            name='cartype'
            id='4WD/SUV'
            onClick={ChangeCarType}
          />
          <label
            className={
              CarType === '4WD/SUV' ? 'QfourShowSelected' : 'QfourShowSelect'
            }
            htmlFor='4WD/SUV'
            id='Hot'
          >
            4WD/SUV
          </label>
          <input
            className='QoneSelect'
            type='radio'
            name='cartype'
            id='VAN'
            onClick={ChangeCarType}
          />
          <label
            className={
              CarType === 'VAN' ? 'QfourShowSelected' : 'QfourShowSelect'
            }
            htmlFor='VAN'
            id='Hot'
            checked={SpaceType === 'Hotel'}
          >
            VAN
          </label>
        </div>
        {ErrorText2 && <p className='CreateError'>{errorContent}</p>}
      </div>
      <div className='Q' ref={scrollToQ3} id='Q3'>
        <p className='QtwoQ'>Tell us about your address</p>
        <p className='QtwoQsub'>
          Your location will help customers better find parking spaces.
        </p>
        <div className='QtwoQasw'>
          <div className='QtwoQaswrow' tabIndex={0}>
            <label className='QtwoQaswLable'>Country/Region</label>
            <input
              className='QtwoQaswInput'
              id='country'
              value={Country}
              onChange={handleCountryChange}
            ></input>
          </div>
          <div className='QtwoQaswrow' tabIndex={0}>
            <label className='QtwoQaswLable'>Street address</label>
            <input
              className='QtwoQaswInput'
              id='street'
              value={Street}
              onChange={handleStreetChange}
            ></input>
          </div>
          <div className='QtwoQaswrow' tabIndex={0}>
            <label className='QtwoQaswLable'>Suburb/city</label>
            <input
              className='QtwoQaswInput'
              id='city'
              value={City}
              onChange={handleCityChange}
            ></input>
          </div>
          <div className='QtwoQaswrow' tabIndex={0}>
            <label className='QtwoQaswLable'>State/territory</label>
            <input
              className='QtwoQaswInput'
              id='state'
              value={State}
              onChange={handleStateChange}
            ></input>
          </div>
          <div className='QtwoQaswrow' tabIndex={0}>
            <label className='QtwoQaswLable'>Postcode</label>
            <input
              className='QtwoQaswInput'
              id='postcode'
              value={Postcode}
              onChange={handlePostcodeChange}
            ></input>
          </div>
        </div>
        {ErrorText3 && <p className='CreateError'>{errorContent}</p>}
      </div>
      <div className='Q' ref={scrollToQ4} id='Q4'>
        <p className='Q4q'>Tell customers how to park in your space ?</p>
        <p className='QtwoQsub'>
          Make sure your parking space is accessible to customers.
        </p>
        <div className='QoneAnswerPart'>
          <input
            className='QoneSelect'
            type='checkbox'
            name='passway'
            id='Nones'
            onChange={ChangePassWay}
          />
          <label
            className={
              PassWay === 'Nones' ? 'QfourShowSelected' : 'QfourShowSelect'
            }
            id='wifi'
            htmlFor='Nones'
          >
            None
          </label>
          <input
            className='QoneSelect'
            type='checkbox'
            name='passway'
            id='Physical key'
            onChange={ChangePassWay}
          />
          <label
            className={
              PassWay === 'Physical key'
                ? 'QfourShowSelected'
                : 'QfourShowSelect'
            }
            htmlFor='Physical key'
            id='tv'
          >
            {'Physical key'}
          </label>
          <input
            className='QoneSelect'
            type='checkbox'
            name='passway'
            id='Password'
            onChange={ChangePassWay}
          />
          <label
            className={
              PassWay === 'Password' ? 'QfourShowSelected' : 'QfourShowSelect'
            }
            htmlFor='Password'
            id='kitch'
          >
            Password
          </label>
          <input
            className='QoneSelect'
            type='checkbox'
            name='passway'
            id='Digital Card'
            onChange={ChangePassWay}
          />
          <label
            className={
              PassWay === 'Digital Card'
                ? 'QfourShowSelected'
                : 'QfourShowSelect'
            }
            htmlFor='Digital Card'
            id='washing-machine'
          >
            {'Digital Card'}
          </label>
        </div>
        {ErrorText4 && <p className='CreateError'>{errorContent}</p>}
      </div>
      <div className='Q' ref={scrollToQ5} id='Q5'>
        <p className='Q4q'>
          Tell guests what type of the Electric charging this space parking
          offer?
        </p>
        <p className='QtwoQsub'>
          Equipped with charging stations will make your parking space stand
          out.
        </p>
        <div className='QoneAnswerPart'>
          <input
            className='QoneSelect'
            type='checkbox'
            name='charge'
            id='None'
            onChange={ChangeCharge}
          />
          <label
            className={
              charge === 'None' ? 'QfourShowSelected' : 'QfourShowSelect'
            }
            id='wifi'
            htmlFor='None'
          >
            None
          </label>
          <input
            className='QoneSelect'
            type='checkbox'
            name='charge'
            id='Wall(AU/NZ)'
            onChange={ChangeCharge}
          />
          <label
            className={
              charge === 'Wall(AU/NZ)' ? 'QfourShowSelected' : 'QfourShowSelect'
            }
            htmlFor='Wall(AU/NZ)'
            id='tv'
          >
            {'Wall(AU/NZ)'}
          </label>
          <input
            className='QoneSelect'
            type='checkbox'
            name='charge'
            id='SAE J-1772'
            onChange={ChangeCharge}
          />
          <label
            className={
              charge === 'SAE J-1772' ? 'QfourShowSelected' : 'QfourShowSelect'
            }
            htmlFor='SAE J-1772'
            id='kitch'
          >
            {'SAE J-1772'}
          </label>

          <input
            className='QoneSelect'
            type='checkbox'
            name='charge'
            id='Type2'
            onChange={ChangeCharge}
          />
          <label
            className={
              charge === 'Type2' ? 'QfourShowSelected' : 'QfourShowSelect'
            }
            htmlFor='Type2'
            id='washing-machine'
          >
            {'Type2'}
          </label>
          <input
            className='QoneSelect'
            type='checkbox'
            name='charge'
            id='CHAdeMO'
            onChange={ChangeCharge}
          />
          <label
            className={
              charge === 'CHAdeMO' ? 'QfourShowSelected' : 'QfourShowSelect'
            }
            htmlFor='CHAdeMO'
            id='air-cond'
          >
            CHAdeMO
          </label>
          <input
            className='QoneSelect'
            type='checkbox'
            name='accommodation'
            id='Free-Parking'
            onChange={ChangeCharge}
          />
        </div>
        {ErrorText5 && <p className='CreateError'>{errorContent}</p>}
      </div>
      <div className='Q' ref={scrollToQ6} id='Q6'>
        <p className='Q4q'>Now, lets give your spot a title.</p>
        <p className='QtwoQsub'>
          Short titles work best. Have fun with it—you can always change it
          later.
        </p>
        <div className='QoneAnswerPart'>
          <textarea
            className='Q5A'
            id='hosting-title'
            maxLength={32}
            onChange={handleTitleChange}
            value={Title}
          ></textarea>
        </div>
        <p className='LengthDetector'>{lengthOfTitle}/32</p>
        {ErrorText6 && <p className='CreateError'>{errorContent}</p>}
      </div>
      <div className='Q' ref={scrollToQ7} id='Q7'>
        <p className='Q4q'>Next we'll help you set up your parking revenue.</p>
        <p className='QtwoQsub'>You can change it anytime.</p>
        <div className='Q6aDiv'>
          <div className='Q6-row'>
            <div className='row-left'>
              <input
                type='checkbox'
                className='Q6ck'
                checked={isHour}
                onChange={() => {
                  setisHour(!isHour);
                }}
              ></input>
              <p className='Q6AP'>I'm okay with hourly rentals.</p>
            </div>
            <div className='row-right'>
              <p className='Q6AP'>$</p>
              <input
                className='Q6aInput'
                id='price'
                placeholder='0'
                maxLength={5}
                value={PriseHour}
                onChange={handlePriceHourChange}
                disabled={!isHour}
              ></input>
              <p className='Q6AP'>per hour.</p>
            </div>
          </div>

          <div className='Q6-row'>
            <div className='row-left'>
              <input
                type='checkbox'
                className='Q6ck'
                checked={isDay}
                onChange={() => {
                  setisDay(!isDay);
                }}
              ></input>
              <p className='Q6AP'>I'm okay with daily rentals.</p>
            </div>
            <div className='row-right'>
              <p className='Q6AP'>$</p>
              <input
                className='Q6aInput'
                id='price'
                placeholder='0'
                maxLength={5}
                value={PriseDay}
                onChange={handlePriceDayChange}
                disabled={!isDay}
              ></input>
              <p className='Q6AP'>per day.</p>
            </div>
          </div>
          <div className='Q6-row'>
            <div className='row-left'>
              <input
                type='checkbox'
                className='Q6ck'
                checked={isWeek}
                onChange={() => {
                  setWeek(!isWeek);
                }}
              ></input>
              <p className='Q6AP'>I'm okay with weekly rentals.</p>
            </div>
            <div className='row-right'>
              <p className='Q6AP'>$</p>
              <input
                className='Q6aInput'
                id='price'
                placeholder='0'
                maxLength={5}
                value={PriseWeek}
                onChange={handlePriceWeekChange}
                disabled={!isWeek}
              ></input>
              <p className='Q6AP'>per week.</p>
            </div>
          </div>
        </div>
        {ErrorText7 && <p className='CreateError'>{errorContent}</p>}
      </div>
      <div className='Q' ref={scrollToQ8} id='Q8'>
        <p className='Q4q'>
          Now let's set the available time for the parking space.
        </p>
        <p className='QtwoQsub'>You can change it anytime.</p>
        <div className='Q6aDiv'>
          <div className='PublishInfo'>
            <div className='IntervalHeader'>
              <p className='PublishTitle'>Available Time</p>
              <button className='AddInterval' onClick={addTimeInterval}>
                Add available time
              </button>
            </div>
            <div className='TimeInterval'>
              <div className='IntervalHeader'>
                <div className='Avtxt'>Available Time{' ' + 1}</div>
              </div>
              <div className='IntervalContent'>
                <div className='TimeBlock'>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker', 'DatePicker']}>
                      <DatePicker
                        label='Start Date'
                        value={FirstStart}
                        minDate={dayjs(new Date())}
                        onChange={(date) => {
                          if (date) FirstStartChange(date);
                        }}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </div>
                <p className='TO'> - </p>
                <div className='TimeBlock'>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker', 'DatePicker']}>
                      <DatePicker
                        label='End Date'
                        value={FirstEnd}
                        minDate={dayjs(FirstStart)}
                        onChange={(date) => {
                          if (date) FirstEndChange(date);
                        }}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </div>
              </div>
              <div className='IntervalBottom'>
                <div className='Pricetxt'>Totol Day{'  ' + Firstdistance}</div>
              </div>
            </div>
            {timeIntervals.map((interval, index) => (
              <div className='TimeInterval' key={interval.id}>
                <div className='IntervalHeader'>
                  <div className='Avtxt'>Available Time{' ' + (index + 2)}</div>
                  <button
                    className='ClearInterval'
                    onClick={() => {
                      deleteInterval(interval.id);
                    }}
                  >
                    Delete Interval
                  </button>
                </div>
                <div className='IntervalContent'>
                  <div className='TimeBlock'>
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
                  </div>
                  <p className='TO'> - </p>
                  <div className='TimeBlock'>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={['DatePicker']}>
                        <DatePicker
                          label='End Date'
                          value={interval.endDate}
                          minDate={dayjs(interval.FirstStart)}
                          onChange={(date) => {
                            if (date) handleEndDateChange(index, date);
                          }}
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                  </div>
                </div>
                <div className='IntervalBottom'>
                  <div className='Pricetxt'>
                    Totol Day{'  ' + interval.distance}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {ErrorText8 && <p className='CreateError'>{errorContent}</p>}
      </div>
      <div className='Q' ref={scrollToQ9} id='Q9'>
        <p className='Q4q'>Add some photos of your barn</p>
        <p className='QtwoQsub'>
          You’ll need one photos to get started. This photo would as your
          hosting Thumbnail.
        </p>
        <div className='Q7aDiv'>
          <input
            className='QoneSelect'
            id='upload'
            onChange={AddThumbil}
            type='file'
            ref={RefT}
            accept='image/*'
          ></input>
          <img
            className='UploadIMG'
            id='callupload'
            onClick={HandleT}
            src={
              Thumbil.includes('base64')
                ? Thumbil
                : 'data:image/jpeg;base64,' + Thumbil || '/img/addusr.png'
            }
            alt='Upload from your device'
          ></img>
        </div>
        {ErrorText9 && <p className='CreateError'>{errorContent}</p>}
      </div>
      <div className='Q' id='Q10'>
        <p className='Q4q'>Add more photos of your barn</p>
        <p className='QtwoQsub'>
          This is optional if you want show more of your hosting. You can add
          more or make changes later. The first photo would as your hosting
          Thumbnail.
        </p>
        <div className='Q7aDiv'>
          <input
            className='QoneSelect'
            id='upload'
            onChange={AddImage}
            type='file'
            ref={RefFile}
            value={fileInputValue}
            accept='image/*'
          ></input>
          <button className='UploadButton' onClick={HandleFile}>
            Upload from your device
          </button>
        </div>
        {AllImaegsString.map((item, index) => (
          <div
            className='LasteachImage'
            key={index}
            onClick={() => RemoveImage(String(index))}
          >
            <HoverImage
              src={
                item.includes('base64')
                  ? item
                  : 'data:image/jpeg;base64,' + item || '/img/addusr.png'
              }
              alt={`Image ${index}`}
            />
          </div>
        ))}
      </div>
      <div className='QButton'>
        <button
          className='CreatButton-b'
          onClick={() => EditNow()}
          type='button'
        >
          Edit & Approve Spot
        </button>
        <button className='CreatButton-b white' onClick={goesHost}>
          Process later
        </button>
        <button className='CreatButton-b black' onClick={() => DeleteNow()}>
          Reject This Spot
        </button>
      </div>
    </div>
  );
};

export const ManagerProcessReport = () => {
  const { setOpenSnackbar } = useError();
  const [isOpenDelete, setOpenDelete] = useState(false);
  const [isOpenApprove, setOpenApprove] = useState(false);
  const [isOpenHidden, setOpenHidden] = useState(false);
  const { adminid, Spotid } = useParams();
  const [OwnerId, setOwnerId] = useState(null);
  console.log(adminid);
  console.log(Spotid);
  useEffect(() => {
    let getDetail = (Spotid) => {
      callAPIGetSpecSpot('spot/' + Spotid)
        .then((response) => {
          console.log(response);
          setCarType(response.message.Size);
          setOwnerId(response.message.OwnerID);
          setCharge(response.message.Charge);
          setPassWay(response.message.PassWay);
          setType(response.message.SpotType);
          setTitle(response.message.SpotName);
          setisDay(response.message.IsDayRent);
          setPriceDay(response.message.PricePerDay);
          setisHour(response.message.IsHourRent);
          setPriceHour(response.message.PricePerHour);
          setWeek(response.message.IsWeekRent);
          setPriceWeek(response.message.PricePerWeek);
          setThumbil(response.message.Pictures);
          const res = JSON.parse(response.message.MorePictures);
          setSelectedImageString(res);
          console.log(res);
          try {
            const ads = JSON.parse(response.message.SpotAddr);
            console.log(ads);
            setState(ads.State);
            setStreet(ads.Street);
            setCity(ads.City);
            setCountry(ads.Country);
            setPostcode(ads.Postcode);
          } catch (e) {
            const ads = response.message.SpotAddr.split(',');
            console.log(ads);
            setState(ads[0]);
            setStreet(ads[0]);
            setCity(ads.City[1]);
            setCountry(ads[2]);
            setPostcode(ads.Postcode[2]);
          }
          const ads = JSON.parse(response.message.SpotAddr);
          console.log(ads);
          setState(ads.State);
          setStreet(ads.Street);
          setCity(ads.City);
          setCountry(ads.Country);
          setPostcode(ads.Postcode);
          let all_time = JSON.parse(response.message.AvailableTime);
          all_time = all_time.map((item) => ({
            ...item,
            startDate: dayjs(item.startDate),
            endDate: dayjs(item.endDate),
          }));
          console.log(all_time);
          setFirstStart(all_time[0].startDate);
          setFirstEnd(all_time[0].endDate);
          setDistance(all_time[0].distance);
          setTimeIntervals((timeIntervals) => [...all_time.slice(1)]);
        })
        .catch((error) => {
          setOpenSnackbar({
            severity: 'warning',
            message: error,
            timestamp: new Date().getTime(),
          });
        });
    };
    getDetail(Spotid);
  }, [Spotid, setOpenSnackbar]);
  // link the ref for thumb and other img
  const RefT = useRef(null);
  const RefFile = useRef(null);
  // if the button click then open the file loader
  const HandleT = () => {
    if (RefT.current) {
      RefT.current.click();
    }
  };
  // if the button click then open the file loader
  const HandleFile = () => {
    if (RefFile.current) {
      RefFile.current.click();
    }
  };
  const navigate = useNavigate();
  // set title empty;
  const [lengthOfTitle, setlength] = useState(0);
  // set type empty;
  const [SpaceType, setType] = useState('');
  // set charge empty;
  const [charge, setCharge] = useState('');
  const ChangeCharge = (event) => {
    const target = event.target;
    if (target.id) {
      setCharge(target.id);
    }
  };
  const [PassWay, setPassWay] = useState('');
  const ChangePassWay = (event) => {
    const target = event.target;
    if (target.id) {
      setPassWay(target.id);
    }
  };
  const [SpotData, setData] = useState({});
  const [isHour, setisHour] = useState(false);
  const [isDay, setisDay] = useState(false);
  const [isWeek, setWeek] = useState(false);
  // set type empty;
  const [CarType, setCarType] = useState('');
  // set contry empty
  const [Country, setCountry] = useState('');
  const handleCountryChange = (event) => {
    setCountry(event.target.value);
  };
  // set street empty
  const [Street, setStreet] = useState('');
  const handleStreetChange = (event) => {
    setStreet(event.target.value);
  };
  // set city empty
  const [City, setCity] = useState('');
  const handleCityChange = (event) => {
    setCity(event.target.value);
  };
  // set state empty
  const [State, setState] = useState('');
  const handleStateChange = (event) => {
    setState(event.target.value);
  };
  // set postcode empty
  const [Postcode, setPostcode] = useState('');
  const handlePostcodeChange = (event) => {
    setPostcode(event.target.value);
  };
  // set thumbil empty
  const [Thumbil, setThumbil] = useState('');
  // set all facility false
  const [Title, setTitle] = useState('');
  const handleTitleChange = (event) => {
    setTitle(event.target.value);
    setlength(event.target.value.length);
  };
  // set price for daily
  const [PriseDay, setPriceDay] = useState('');
  const handlePriceDayChange = (event) => {
    setPriceDay(event.target.value);
  };
  // set price for daily
  const [PriseWeek, setPriceWeek] = useState('');
  const handlePriceWeekChange = (event) => {
    setPriceWeek(event.target.value);
  };
  // set price for daily
  const [PriseHour, setPriceHour] = useState('');
  const handlePriceHourChange = (event) => {
    setPriceHour(event.target.value);
  };
  // when the type is changed
  const ChangeType = (event) => {
    const target = event.target;
    if (target.id) {
      setType(target.id);
    }
  };
  const ChangeCarType = (event) => {
    const target = event.target;
    if (target.id) {
      setCarType(target.id);
    }
  };
  // goes to the host page
  const goesHost = () => {
    navigate(-1);
  };
  // set all errorText shown false
  const [ErrorText1, setErrorText1] = useState(false);
  const [ErrorText2, setErrorText2] = useState(false);
  const [ErrorText3, setErrorText3] = useState(false);
  const [ErrorText4, setErrorText4] = useState(false);
  const [ErrorText5, setErrorText5] = useState(false);
  const [ErrorText6, setErrorText6] = useState(false);
  const [ErrorText7, setErrorText7] = useState(false);
  const [ErrorText8, setErrorText8] = useState(false);
  const [ErrorText9, setErrorText9] = useState(false);
  const setAllfalse = () => {
    setErrorText1(false);
    setErrorText2(false);
    setErrorText3(false);
    setErrorText4(false);
    setErrorText5(false);
    setErrorText6(false);
    setErrorText7(false);
    setErrorText8(false);
    setErrorText9(false);
  };
  // set all scroll position empty
  const [errorContent, setErrorContent] = useState('');
  const scrollToQ1 = useRef(null);
  const scrollToQ2 = useRef(null);
  const scrollToQ3 = useRef(null);
  const scrollToQ4 = useRef(null);
  const scrollToQ5 = useRef(null);
  const scrollToQ6 = useRef(null);
  const scrollToQ7 = useRef(null);
  const scrollToQ8 = useRef(null);
  const scrollToQ9 = useRef(null);
  // set all image empty
  const [AllImaegsString, setSelectedImageString] = useState([]);
  // convert the image to string
  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      // read the image
      const reader = new FileReader();
      reader.onload = (event) => {
        // set the image
        if (event.target) {
          const base64String = event.target.result;
          resolve(base64String);
        }
      };
      // when meet error
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  };
  // convert all images to string
  const convertAllImagesToBase64 = (imageFiles) => {
    const base64Promises = imageFiles.map((file) => convertImageToBase64(file));
    return Promise.all(base64Promises);
  };
  // check a image is a 64base Image
  const isValidBase64Image = (base64String) => {
    // if not valid Base64 image
    if (!base64String.startsWith('data:image/')) {
      return false;
    }
    try {
      // if the image is empty
      if (base64String.trim() === '') {
        return false;
      }
      const datas = base64String;
      const realdata = String(datas.split(',')[1]);
      // Decode the base64 string
      const decodedData = btoa(atob(realdata));
      // if the decode and encode is same then true;
      return decodedData === realdata;
    } catch (error) {
      // when meet error show error
      setOpenSnackbar({
        severity: 'error',
        message: 'Your image is not follow 64base encode !',
      });
      console.log(error);
      return false; // Invalid base64 or unable to decode
    }
  };
  // add the thumbil to the page
  const AddThumbil = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      // get the first element
      const file = files[0];
      // start render
      const reader = new FileReader();
      if (file) {
        // loading these image
        reader.onload = (event) => {
          if (event.target) {
            // if the data is valid then set it else prompt error
            const base64Data = event.target.result;
            if (isValidBase64Image(base64Data)) {
              // valid file
              setAllfalse();
              console.log(base64Data);
              setThumbil(base64Data);
            } else {
              // invalid file
              setAllfalse();
              setErrorContent('Not a valid image!');
              setErrorText7(true);
            }
          }
        };
        // when meet error
        reader.onerror = (event) => {
          // if the target is not null
          if (event.target) {
            // show error
            console.error('Error reading file:', event.target.error);
            setAllfalse();
            setErrorContent('Error reading file');
            setErrorText7(true);
          }
        };
        // start read the file
        reader.readAsDataURL(file);
      }
    }
  };
  // initial the file is null
  const [fileInputValue, setFileInputValue] = useState('');
  // add the image to the page
  const AddImage = (event) => {
    // get the files
    const files = event.target.files;
    // if the files is not null
    if (files && files.length > 0) {
      // get the all files
      const promises = Array.from(files).map((file) => {
        return new Promise((resolve, reject) => {
          // read the file
          const reader = new FileReader();
          // when the file is loaded
          reader.onload = (event) => {
            // if the target is not null
            if (event.target) {
              // get the base64 string
              const base64Data = event.target.result;
              // if the image is valid
              if (isValidBase64Image(base64Data)) {
                // valid file
                resolve(file);
              } else {
                // invalid file
                reject(new Error('Not a valid image!'));
              }
            }
          };
          // when meet error
          reader.onerror = (event) => {
            // if the target is not null
            if (event.target) {
              // show error
              console.error('Error reading file:', event.target.error);
              reject(new Error('Error reading file'));
            }
          };
          // start read the file
          reader.readAsDataURL(file);
        });
      });
      // when all files is loaded
      Promise.all(promises)
        // if the files is valid
        .then((results) => {
          // get the valid files
          const validFiles = results;
          // set all errormessgae hidden
          setAllfalse();
          // set the file input value
          convertAllImagesToBase64(validFiles)
            .then((base64Strings) => {
              // add the image to the page
              const base64array = base64Strings;
              setSelectedImageString([...AllImaegsString, ...base64array]);
            })
            .catch((error) => {
              // if the image is not valid
              // show error
              setOpenSnackbar({
                severity: 'error',
                message: 'Your Image upload has some error, please try again!',
              });
              setOpenSnackbar({
                severity: 'error',
                message: '',
              });
              // show error
              console.error(error);
            });
          // set the file input value to null
          setFileInputValue('');
        })
        .catch((error) => {
          // if the image is not valid
          // show error
          setOpenSnackbar({
            severity: 'error',
            message: 'Your Image upload has some error, please try again!',
          });
          // show error
          setOpenSnackbar({
            severity: 'error',
            message: '',
          });
          // set all errormessgae hidden
          setAllfalse();
          // show error
          setErrorContent(error);
          // scroll to the error message
          setErrorText7(true);
        });
    }
  };
  // remove the image from the page
  const RemoveImage = (index) => {
    // create new image list, remove the image
    const updatedImagesString = AllImaegsString.filter(
      (_, i) => String(i) !== index
    );
    setSelectedImageString(updatedImagesString);
  };
  // scroll to a element
  const scrollToElement = (ref) => {
    // if the ref is not null
    if (ref.current) {
      // scroll to the element
      console.log(ref.current);
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  // 时间区间设置
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
  // creat a new hosting
  const EditNow = () => {
    const data = {
      spotName: String(Title),
      spotType: String(SpaceType),
      size: String(CarType),
      charge: String(charge),
      passWay: String(PassWay),
      spotAddr: JSON.stringify({
        Country: Country,
        City: City,
        State: State,
        Postcode: Postcode,
        Street: Street,
      }),
      Owner: OwnerId,
      isDayRent: isDay,
      isOurRent: isHour,
      isWeekRent: isWeek,
      pricePerDay: parseFloat(PriseDay) || 0,
      pricePerHour: parseFloat(PriseHour) || 0,
      pricePerWeek: parseFloat(PriseWeek) || 0,
      pictures: Thumbil,
      morePictures: AllImaegsString,
      availableTime: timeIntervals,
    };
    // the price pattern
    const pricePattern = /^[1-9]\d{0,4}$/;
    // set confirmflag to true
    let Confirmflag = true;
    console.log(data);
    if (data) {
      // inital the data
      // if the title is empty
      if (data.spotType.length === 0) {
        console.log('no type');
        Confirmflag = false;
        setAllfalse();
        setErrorContent('You must select one type for your spot.');
        setErrorText1(true);
        scrollToElement(scrollToQ1);
      }
      if (Confirmflag && data.size.length === 0) {
        console.log('no type');
        Confirmflag = false;
        setAllfalse();
        setErrorContent('You must select one type of car for your spot');
        setErrorText2(true);
        scrollToElement(scrollToQ2);
      }
      // if the address is not empty
      if (Confirmflag && data.spotAddr) {
        setAllfalse();
        const letterPattern = /[a-zA-Z]+/;
        const numericPattern = /^[0-9]+$/;
        // if the content is not valid
        if (!letterPattern.test(Country)) {
          console.log('invalid country');
          setErrorContent('Your country name is invalid');
          Confirmflag = false;
        } else if (!letterPattern.test(Street)) {
          // if the street is not valid
          setErrorContent('Your street name is invalid');
          Confirmflag = false;
          console.log('invalid country');
        } else if (!letterPattern.test(City)) {
          // if the city is not valid
          setErrorContent('Your city name is invalid');
          Confirmflag = false;
          console.log('invalid country');
        } else if (!letterPattern.test(State)) {
          // if the state is not valid
          setErrorContent('Your state name is invalid');
          Confirmflag = false;
          console.log('invalid country');
        } else if (!numericPattern.test(Postcode)) {
          // if the postcode is not valid
          setErrorContent('Your Postcode name is invalid');
          Confirmflag = false;
          console.log('invalid postcode');
        }
        if (!Confirmflag) {
          // if the errorText is not valid
          setErrorText3(true);
          console.log(scrollToQ3);
          scrollToElement(scrollToQ3);
        }
      }
      // if the title is empty
      if (Confirmflag && data.passWay.length === 0) {
        console.log('no Passway');
        setAllfalse();
        setErrorContent('You must set a Passway for your hosting');
        setErrorText4(true);
        scrollToElement(scrollToQ4);
        Confirmflag = false;
      }
      if (Confirmflag && data.charge.length === 0) {
        console.log('no title');
        setAllfalse();
        setErrorContent('You must set a charge information for your hosting.');
        setErrorText5(true);
        scrollToElement(scrollToQ5);
        Confirmflag = false;
      }
      // if the title is empty
      if (Confirmflag && data.spotName.length === 0) {
        console.log('no title');
        setAllfalse();
        setErrorContent('You must set a title for your hosting');
        setErrorText6(true);
        scrollToElement(scrollToQ6);
        Confirmflag = false;
      }
      // if the price is empty
      if (Confirmflag && !(isDay || isHour || isWeek)) {
        console.log('No price');
        setAllfalse();
        setErrorContent('Your must accept one kind of rent way');
        setErrorText7(true);
        Confirmflag = false;
        scrollToElement(scrollToQ7);
      }
      if (Confirmflag && isDay && !pricePattern.test(PriseDay)) {
        console.log('No price');
        setAllfalse();
        setErrorContent('Your price must between 1 to 99999');
        setErrorText7(true);
        Confirmflag = false;
        scrollToElement(scrollToQ7);
      }
      if (Confirmflag && isHour && !pricePattern.test(PriseHour)) {
        console.log('No price');
        setAllfalse();
        setErrorContent('Your price must between 1 to 99999');
        setErrorText7(true);
        Confirmflag = false;
        scrollToElement(scrollToQ7);
      }
      if (Confirmflag && isWeek && !pricePattern.test(PriseWeek)) {
        console.log('No price');
        setAllfalse();
        setErrorContent('Your price must between 1 to 99999');
        setErrorText7(true);
        Confirmflag = false;
        scrollToElement(scrollToQ7);
      }
      if (Confirmflag && (FirstStart === null || FirstEnd === null)) {
        setAllfalse();
        setErrorContent('Your all of the time choice can not be null.');
        setErrorText8(true);
        Confirmflag = false;
        scrollToElement(scrollToQ8);
      }
      if (Confirmflag) {
        const res = data.availableTime.filter((value) => {
          return value.startDate === null || value.endDate === null;
        });
        if (res.length !== 0) {
          setAllfalse();
          setErrorContent('Your all of the time choice can not be null.');
          setErrorText8(true);
          Confirmflag = false;
          scrollToElement(scrollToQ8);
        }
      }
      // if the image is empty
      if (Confirmflag && Thumbil === '') {
        setAllfalse();
        setErrorContent('You must show your hosting pictures to us');
        setErrorText9(true);
        Confirmflag = false;
        scrollToElement(scrollToQ9);
      }
      if (Confirmflag) {
        let firstDateRange = {
          id: Date.now(), // unique id
          startDate: FirstStart,
          endDate: FirstEnd,
          distance: GetDistance(FirstStart, FirstEnd),
        };
        const _lodash = require('lodash');
        let temp = _lodash.cloneDeep(data.availableTime);
        let result = [firstDateRange, ...temp];
        data.availableTime = JSON.stringify(result);
        data.morePictures = JSON.stringify(data.morePictures);
        setData(data);
        setOpenApprove(true);
      }
    }
  };
  const DeleteNow = () => {
    setOpenDelete(true);
  };
  const HiddenNow = () => {
    setOpenHidden(true);
  };
  return (
    <div className='CreatChannelOverall'>
      <EditCheck
        data={SpotData}
        isOpen={isOpenApprove}
        close={() => {
          setOpenApprove(false);
        }}
      />
      <HiddenCheck
        spotName={Title}
        Owner={OwnerId}
        isOpen={isOpenHidden}
        close={() => {
          setOpenHidden(false);
        }}
      />
      <DeleteCheck
        spotName={Title}
        Owner={OwnerId}
        isOpen={isOpenDelete}
        close={() => {
          setOpenDelete(false);
        }}
      />
      <div className='CreatNewHeader'>
        <div className='CreateLogo'>
          <img className='ct-logo' src='/img/LOGO.svg' alt=''></img>
        </div>
        <div className='HeaderRightButtonPart'>
          <p className='HeaderRightButtonself' onClick={goesHost}>
            Back
          </p>
        </div>
      </div>
      <div className='Q1' ref={scrollToQ1} id='Q1'>
        <p className='QoneQuestionPart'>
          Which of these best describes your CarSpace?
        </p>
        <div className='QoneAnswerPart'>
          <input
            className='QoneSelect'
            type='radio'
            name='accommodation'
            id='Carport'
            onClick={ChangeType}
          ></input>
          <label
            className={
              SpaceType === 'Carport' ? 'QoneShowSelected' : 'QoneShowSelect'
            }
            htmlFor='Carport'
            id='Hous'
          >
            Carport
          </label>
          <input
            className='QoneSelect'
            type='radio'
            name='accommodation'
            id='Driveway'
            onClick={ChangeType}
          />
          <label
            className={
              SpaceType === 'Driveway' ? 'QoneShowSelected' : 'QoneShowSelect'
            }
            htmlFor='Driveway'
            id='Apart'
          >
            Driveway
          </label>
          <input
            className='QoneSelect'
            type='radio'
            name='accommodation'
            id='Garage'
            onClick={ChangeType}
          />
          <label
            className={
              SpaceType === 'Garage' ? 'QoneShowSelected' : 'QoneShowSelect'
            }
            id='caBIN'
            htmlFor='Garage'
            checked={SpaceType === 'Cabin'}
          >
            Garage
          </label>
          <input
            className='QoneSelect'
            type='radio'
            name='accommodation'
            id='Parking-lot'
            onClick={ChangeType}
          />
          <label
            className={
              SpaceType === 'Parking-lot'
                ? 'QoneShowSelected'
                : 'QoneShowSelect'
            }
            htmlFor='Parking-lot'
            id='Hot'
            checked={SpaceType === 'Hotel'}
          >
            Parking-lot
          </label>
        </div>
        {ErrorText1 && <p className='CreateError'>{errorContent}</p>}
      </div>
      <div className='Q' ref={scrollToQ2} id='Q2'>
        <p className='QtwoQ'>
          What type of cars can be parked in this parking space?
        </p>
        <p className='QtwoQsub'>
          Choose the largest vehicle your parking space can accommodate.
        </p>
        <div className='QoneAnswerPart'>
          <input
            className='QoneSelect'
            type='radio'
            name='cartype'
            id='Bike'
            onClick={ChangeCarType}
          ></input>
          <label
            className={
              CarType === 'Bike' ? 'QfourShowSelected' : 'QfourShowSelect'
            }
            htmlFor='Bike'
            id='Hous'
          >
            Bike
          </label>
          <input
            className='QoneSelect'
            type='radio'
            name='cartype'
            id='Sedan'
            onClick={ChangeCarType}
          />
          <label
            className={
              CarType === 'Sedan' ? 'QfourShowSelected' : 'QfourShowSelect'
            }
            htmlFor='Sedan'
            id='Apart'
          >
            Sedan
          </label>
          <input
            className='QoneSelect'
            type='radio'
            name='cartype'
            id='Hatchback'
            onClick={ChangeCarType}
          />
          <label
            className={
              CarType === 'Hatchback' ? 'QfourShowSelected' : 'QfourShowSelect'
            }
            id='caBIN'
            htmlFor='Hatchback'
          >
            Hatchback
          </label>
          <input
            className='QoneSelect'
            type='radio'
            name='cartype'
            id='4WD/SUV'
            onClick={ChangeCarType}
          />
          <label
            className={
              CarType === '4WD/SUV' ? 'QfourShowSelected' : 'QfourShowSelect'
            }
            htmlFor='4WD/SUV'
            id='Hot'
          >
            4WD/SUV
          </label>
          <input
            className='QoneSelect'
            type='radio'
            name='cartype'
            id='VAN'
            onClick={ChangeCarType}
          />
          <label
            className={
              CarType === 'VAN' ? 'QfourShowSelected' : 'QfourShowSelect'
            }
            htmlFor='VAN'
            id='Hot'
            checked={SpaceType === 'Hotel'}
          >
            VAN
          </label>
        </div>
        {ErrorText2 && <p className='CreateError'>{errorContent}</p>}
      </div>
      <div className='Q' ref={scrollToQ3} id='Q3'>
        <p className='QtwoQ'>Tell us about your address</p>
        <p className='QtwoQsub'>
          Your location will help customers better find parking spaces.
        </p>
        <div className='QtwoQasw'>
          <div className='QtwoQaswrow' tabIndex={0}>
            <label className='QtwoQaswLable'>Country/Region</label>
            <input
              className='QtwoQaswInput'
              id='country'
              value={Country}
              onChange={handleCountryChange}
            ></input>
          </div>
          <div className='QtwoQaswrow' tabIndex={0}>
            <label className='QtwoQaswLable'>Street address</label>
            <input
              className='QtwoQaswInput'
              id='street'
              value={Street}
              onChange={handleStreetChange}
            ></input>
          </div>
          <div className='QtwoQaswrow' tabIndex={0}>
            <label className='QtwoQaswLable'>Suburb/city</label>
            <input
              className='QtwoQaswInput'
              id='city'
              value={City}
              onChange={handleCityChange}
            ></input>
          </div>
          <div className='QtwoQaswrow' tabIndex={0}>
            <label className='QtwoQaswLable'>State/territory</label>
            <input
              className='QtwoQaswInput'
              id='state'
              value={State}
              onChange={handleStateChange}
            ></input>
          </div>
          <div className='QtwoQaswrow' tabIndex={0}>
            <label className='QtwoQaswLable'>Postcode</label>
            <input
              className='QtwoQaswInput'
              id='postcode'
              value={Postcode}
              onChange={handlePostcodeChange}
            ></input>
          </div>
        </div>
        {ErrorText3 && <p className='CreateError'>{errorContent}</p>}
      </div>
      <div className='Q' ref={scrollToQ4} id='Q4'>
        <p className='Q4q'>Tell customers how to park in your space ?</p>
        <p className='QtwoQsub'>
          Make sure your parking space is accessible to customers.
        </p>
        <div className='QoneAnswerPart'>
          <input
            className='QoneSelect'
            type='checkbox'
            name='passway'
            id='Nones'
            onChange={ChangePassWay}
          />
          <label
            className={
              PassWay === 'Nones' ? 'QfourShowSelected' : 'QfourShowSelect'
            }
            id='wifi'
            htmlFor='Nones'
          >
            None
          </label>
          <input
            className='QoneSelect'
            type='checkbox'
            name='passway'
            id='Physical key'
            onChange={ChangePassWay}
          />
          <label
            className={
              PassWay === 'Physical key'
                ? 'QfourShowSelected'
                : 'QfourShowSelect'
            }
            htmlFor='Physical key'
            id='tv'
          >
            {'Physical key'}
          </label>
          <input
            className='QoneSelect'
            type='checkbox'
            name='passway'
            id='Password'
            onChange={ChangePassWay}
          />
          <label
            className={
              PassWay === 'Password' ? 'QfourShowSelected' : 'QfourShowSelect'
            }
            htmlFor='Password'
            id='kitch'
          >
            Password
          </label>
          <input
            className='QoneSelect'
            type='checkbox'
            name='passway'
            id='Digital Card'
            onChange={ChangePassWay}
          />
          <label
            className={
              PassWay === 'Digital Card'
                ? 'QfourShowSelected'
                : 'QfourShowSelect'
            }
            htmlFor='Digital Card'
            id='washing-machine'
          >
            {'Digital Card'}
          </label>
        </div>
        {ErrorText4 && <p className='CreateError'>{errorContent}</p>}
      </div>
      <div className='Q' ref={scrollToQ5} id='Q5'>
        <p className='Q4q'>
          Tell guests what type of the Electric charging this space parking
          offer?
        </p>
        <p className='QtwoQsub'>
          Equipped with charging stations will make your parking space stand
          out.
        </p>
        <div className='QoneAnswerPart'>
          <input
            className='QoneSelect'
            type='checkbox'
            name='charge'
            id='None'
            onChange={ChangeCharge}
          />
          <label
            className={
              charge === 'None' ? 'QfourShowSelected' : 'QfourShowSelect'
            }
            id='wifi'
            htmlFor='None'
          >
            None
          </label>
          <input
            className='QoneSelect'
            type='checkbox'
            name='charge'
            id='Wall(AU/NZ)'
            onChange={ChangeCharge}
          />
          <label
            className={
              charge === 'Wall(AU/NZ)' ? 'QfourShowSelected' : 'QfourShowSelect'
            }
            htmlFor='Wall(AU/NZ)'
            id='tv'
          >
            {'Wall(AU/NZ)'}
          </label>
          <input
            className='QoneSelect'
            type='checkbox'
            name='charge'
            id='SAE J-1772'
            onChange={ChangeCharge}
          />
          <label
            className={
              charge === 'SAE J-1772' ? 'QfourShowSelected' : 'QfourShowSelect'
            }
            htmlFor='SAE J-1772'
            id='kitch'
          >
            {'SAE J-1772'}
          </label>

          <input
            className='QoneSelect'
            type='checkbox'
            name='charge'
            id='Type2'
            onChange={ChangeCharge}
          />
          <label
            className={
              charge === 'Type2' ? 'QfourShowSelected' : 'QfourShowSelect'
            }
            htmlFor='Type2'
            id='washing-machine'
          >
            {'Type2'}
          </label>
          <input
            className='QoneSelect'
            type='checkbox'
            name='charge'
            id='CHAdeMO'
            onChange={ChangeCharge}
          />
          <label
            className={
              charge === 'CHAdeMO' ? 'QfourShowSelected' : 'QfourShowSelect'
            }
            htmlFor='CHAdeMO'
            id='air-cond'
          >
            CHAdeMO
          </label>
          <input
            className='QoneSelect'
            type='checkbox'
            name='accommodation'
            id='Free-Parking'
            onChange={ChangeCharge}
          />
        </div>
        {ErrorText5 && <p className='CreateError'>{errorContent}</p>}
      </div>
      <div className='Q' ref={scrollToQ6} id='Q6'>
        <p className='Q4q'>Now, lets give your spot a title.</p>
        <p className='QtwoQsub'>
          Short titles work best. Have fun with it—you can always change it
          later.
        </p>
        <div className='QoneAnswerPart'>
          <textarea
            className='Q5A'
            id='hosting-title'
            maxLength={32}
            onChange={handleTitleChange}
            value={Title}
          ></textarea>
        </div>
        <p className='LengthDetector'>{lengthOfTitle}/32</p>
        {ErrorText6 && <p className='CreateError'>{errorContent}</p>}
      </div>
      <div className='Q' ref={scrollToQ7} id='Q7'>
        <p className='Q4q'>Next we'll help you set up your parking revenue.</p>
        <p className='QtwoQsub'>You can change it anytime.</p>
        <div className='Q6aDiv'>
          <div className='Q6-row'>
            <div className='row-left'>
              <input
                type='checkbox'
                className='Q6ck'
                checked={isHour}
                onChange={() => {
                  setisHour(!isHour);
                }}
              ></input>
              <p className='Q6AP'>I'm okay with hourly rentals.</p>
            </div>
            <div className='row-right'>
              <p className='Q6AP'>$</p>
              <input
                className='Q6aInput'
                id='price'
                placeholder='0'
                maxLength={5}
                value={PriseHour}
                onChange={handlePriceHourChange}
                disabled={!isHour}
              ></input>
              <p className='Q6AP'>per hour.</p>
            </div>
          </div>

          <div className='Q6-row'>
            <div className='row-left'>
              <input
                type='checkbox'
                className='Q6ck'
                checked={isDay}
                onChange={() => {
                  setisDay(!isDay);
                }}
              ></input>
              <p className='Q6AP'>I'm okay with daily rentals.</p>
            </div>
            <div className='row-right'>
              <p className='Q6AP'>$</p>
              <input
                className='Q6aInput'
                id='price'
                placeholder='0'
                maxLength={5}
                value={PriseDay}
                onChange={handlePriceDayChange}
                disabled={!isDay}
              ></input>
              <p className='Q6AP'>per day.</p>
            </div>
          </div>
          <div className='Q6-row'>
            <div className='row-left'>
              <input
                type='checkbox'
                className='Q6ck'
                checked={isWeek}
                onChange={() => {
                  setWeek(!isWeek);
                }}
              ></input>
              <p className='Q6AP'>I'm okay with weekly rentals.</p>
            </div>
            <div className='row-right'>
              <p className='Q6AP'>$</p>
              <input
                className='Q6aInput'
                id='price'
                placeholder='0'
                maxLength={5}
                value={PriseWeek}
                onChange={handlePriceWeekChange}
                disabled={!isWeek}
              ></input>
              <p className='Q6AP'>per week.</p>
            </div>
          </div>
        </div>
        {ErrorText7 && <p className='CreateError'>{errorContent}</p>}
      </div>
      <div className='Q' ref={scrollToQ8} id='Q8'>
        <p className='Q4q'>
          Now let's set the available time for the parking space.
        </p>
        <p className='QtwoQsub'>You can change it anytime.</p>
        <div className='Q6aDiv'>
          <div className='PublishInfo'>
            <div className='IntervalHeader'>
              <p className='PublishTitle'>Available Time</p>
              <button className='AddInterval' onClick={addTimeInterval}>
                Add available time
              </button>
            </div>
            <div className='TimeInterval'>
              <div className='IntervalHeader'>
                <div className='Avtxt'>Available Time{' ' + 1}</div>
              </div>
              <div className='IntervalContent'>
                <div className='TimeBlock'>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker', 'DatePicker']}>
                      <DatePicker
                        label='Start Date'
                        value={FirstStart}
                        minDate={dayjs(new Date())}
                        onChange={(date) => {
                          if (date) FirstStartChange(date);
                        }}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </div>
                <p className='TO'> - </p>
                <div className='TimeBlock'>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker', 'DatePicker']}>
                      <DatePicker
                        label='End Date'
                        value={FirstEnd}
                        minDate={dayjs(FirstStart)}
                        onChange={(date) => {
                          if (date) FirstEndChange(date);
                        }}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </div>
              </div>
              <div className='IntervalBottom'>
                <div className='Pricetxt'>Totol Day{'  ' + Firstdistance}</div>
              </div>
            </div>
            {timeIntervals.map((interval, index) => (
              <div className='TimeInterval' key={interval.id}>
                <div className='IntervalHeader'>
                  <div className='Avtxt'>Available Time{' ' + (index + 2)}</div>
                  <button
                    className='ClearInterval'
                    onClick={() => {
                      deleteInterval(interval.id);
                    }}
                  >
                    Delete Interval
                  </button>
                </div>
                <div className='IntervalContent'>
                  <div className='TimeBlock'>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={['DatePicker', 'DatePicker']}>
                        <DatePicker
                          label='Start Date'
                          value={interval.startDate}
                          minDate={dayjs(new Date())}
                          onChange={(date) => {
                            if (date) handleStartDateChange(index, date);
                          }}
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                  </div>
                  <p className='TO'> - </p>
                  <div className='TimeBlock'>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={['DatePicker']}>
                        <DatePicker
                          label='End Date'
                          value={interval.endDate}
                          minDate={dayjs(interval.startDate)}
                          onChange={(date) => {
                            if (date) handleEndDateChange(index, date);
                          }}
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                  </div>
                </div>
                <div className='IntervalBottom'>
                  <div className='Pricetxt'>
                    Totol Day{'  ' + interval.distance}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {ErrorText8 && <p className='CreateError'>{errorContent}</p>}
      </div>
      <div className='Q' ref={scrollToQ9} id='Q9'>
        <p className='Q4q'>Add some photos of your barn</p>
        <p className='QtwoQsub'>
          You’ll need one photos to get started. This photo would as your
          hosting Thumbnail.
        </p>
        <div className='Q7aDiv'>
          <input
            className='QoneSelect'
            id='upload'
            onChange={AddThumbil}
            type='file'
            ref={RefT}
            accept='image/*'
          ></input>
          <img
            className='UploadIMG'
            id='callupload'
            onClick={HandleT}
            src={
              Thumbil.includes('base64')
                ? Thumbil
                : 'data:image/jpeg;base64,' + Thumbil || '/img/addusr.png'
            }
            alt='Upload from your device'
          ></img>
        </div>
        {ErrorText9 && <p className='CreateError'>{errorContent}</p>}
      </div>
      <div className='Q' id='Q10'>
        <p className='Q4q'>Add more photos of your barn</p>
        <p className='QtwoQsub'>
          This is optional if you want show more of your hosting. You can add
          more or make changes later. The first photo would as your hosting
          Thumbnail.
        </p>
        <div className='Q7aDiv'>
          <input
            className='QoneSelect'
            id='upload'
            onChange={AddImage}
            type='file'
            ref={RefFile}
            value={fileInputValue}
            accept='image/*'
          ></input>
          <button className='UploadButton' onClick={HandleFile}>
            Upload from your device
          </button>
        </div>
        {AllImaegsString.map((item, index) => (
          <div
            className='LasteachImage'
            key={index}
            onClick={() => RemoveImage(String(index))}
          >
            <HoverImage
              src={
                item.includes('base64')
                  ? item
                  : 'data:image/jpeg;base64,' + item || '/img/addusr.png'
              }
              alt={`Image ${index}`}
            />
          </div>
        ))}
      </div>
      <div className='QButton'>
        <button
          className='CreatButton-b'
          onClick={() => EditNow()}
          type='button'
        >
          Edit Spot
        </button>
        <button className='CreatButton-b white' onClick={() => HiddenNow()}>
          Hidden This Spot
        </button>
        <button className='CreatButton-b black' onClick={() => DeleteNow()}>
          Delete This Spot
        </button>
      </div>
    </div>
  );
};
