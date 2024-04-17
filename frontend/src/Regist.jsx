import { useNavigate, useLocation } from 'react-router-dom';
import { useState,useEffect } from 'react';
import './Regist.css';
import { motion } from 'framer-motion';
import * as React from 'react';

import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  useError,
  callAPIverifyEmailCode,
  callAPIsendEmailCode,
  callAPIRegistUser,
  callAPIRegistAdmin,
  removeLastSegment,
} from './API';
// User registration page
export function UserRegistPage() {
  // initialize the location
  const location = useLocation();
  // initialize the navigate
  let navigate = useNavigate();
  // get the error message
  const { setOpenSnackbar } = useError();
  // initialize the state of the button
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  // initialize the state of the password visibility
  const [passwordVisibility1, setPasswordVisibility1] = useState(false);
  const [passwordVisibility2, setPasswordVisibility2] = useState(false);
  // initialize the state of the birthday
  const [BirthDate, setBirthDate] = useState(dayjs(new Date()));
  // initialize the state of the verify visibility
  const [verifyVisibility, setverifyVisibility] = useState(false);
  // initialize the state of the verifyed for email verification
  const [isverifyed, setisverifyed] = useState(false);
  // initialize the verify has no error
  const [isverifyError, setisverifyError] = useState(false);
  // initialize the email
  const [Email, setEmail] = useState('');
  // initialize the password
  const [Password, setPassword] = useState('');
  // confirm the password
  const [Password1, setPassword1] = useState('');
  // the password change
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };
  // the password1 change
  const handlePassword1Change = (event) => {
    setPassword1(event.target.value);
  };
  // verify code
  const [code, setCode] = useState('');
  // verify code change
  const handleCodeChange = (event) => {
    setCode(event.target.value);
  };
  // phone
  const [phone, setPhone] = useState('');
  const handlePhoneChange = (event) => {
    setPhone(event.target.value);
  };
  // name
  const [name, setName] = useState('');
  const handleNameChange = (event) => {
    setName(event.target.value);
  };
  // target for register the APP
  const [target, setTarget] = useState(null);
  const handleOptionChange = (option) => {
    setTarget(option);
  };
  // choose the thumbil
  const [Thumbil, setThumbil] = useState('');
  // the birthday change
  const handleBirthdayChange = (date) => {
    console.log(dayjs(date));
    setBirthDate(dayjs(date));
  };
  // open the file chooser
  const EditPhoto = () => {
    document.getElementById('fileInput').click();
  };
  // function to change the thumbil
  const AddThumbil = (event) => {
    // get the files
    const files = event.target.files;
    // if the files is not null
    if (files && files.length > 0) {
      // get the first element
      const file = files[0];
      // start render
      const reader = new FileReader();
      // loading these image
      reader.onload = (event) => {
        if (event.target) {
          // if the data is valid then set it else prompt error
          const base64Data = event.target.result;
          setThumbil(base64Data);
        }
      };
      // when meet error
      reader.onerror = (event) => {
        // if the target is not null
        if (event.target) {
          // show error
          console.error('Error reading file:', event.target.error);
        }
      };
      if (file) {
        // start read the file
        reader.readAsDataURL(file);
      }
      else{
        // if the file is null then read the default image
        reader.readAsDataURL('/img/LOGO.svg');
      }
    }
  };
  // handle the email change
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };
  // go back to the previous page
  let backhome = () => {
    navigate(-1);
  };
  // go to the login page
  let goeslogin = () => {
    const temp = removeLastSegment(location.pathname);
    console.log(temp);
    navigate(temp + 'userlogin');
  };
  // set the button to clickable state after 30 seconds
  useEffect(() => {
    let timeoutId;
    // set a timer to reset the button to clickable state after 30 seconds
    if (isButtonDisabled) {
      timeoutId = setTimeout(() => {
        setIsButtonDisabled(false);
      }, 30000); // 30 秒
    }
    // clear the timeout to avoid memory leak
    return () => clearTimeout(timeoutId);
  }, [isButtonDisabled]);
  // send the verification code
  function sendCode() {
    // if the button is disabled then prompt the user
    if (isButtonDisabled) {
      // set a snackbar to prompt the user
      setOpenSnackbar({
        severity: 'info',
        message: 'Verification codes are sent too frequently',
        timestamp: new Date().getTime(),
      });
      return;
    }
    // define the data
    const data = {
      to: Email,
    };
    // set the button to disabled state
    setIsButtonDisabled(true);
    // call the API to send the code to user
    callAPIsendEmailCode('user/create/sendEmail', data)
      .then((response) => {
        // when meet success
        // set verify visibility to true
        setverifyVisibility(true);
        // set the button to disabled state to avoid user click it again
        setIsButtonDisabled(true);
        console.log(response);
        // set open snackbar to prompt the user
        setOpenSnackbar({
          severity: 'success',
          message: 'We have send to ' + Email + ' a code.',
          timestamp: new Date().getTime(),
        });
      })
      .catch((error) => {
        // when meet error
        console.log(error);
        setIsButtonDisabled(false);
        setOpenSnackbar({
          severity: 'error',
          message: error,
          timestamp: new Date().getTime(),
        });
      });
  }
  // this function is used to verify the email
  function verifyEmail() {
    // define the data
    const data = {
      code: code,
      email: Email,
    };
    // call api to verify the email code
    callAPIverifyEmailCode('user/create/verifyEmail', data)
      .then((response) => {
        console.log(response);
        // when meet success
        // close the verify dialog
        setverifyVisibility(false);
        // set the isverifyed to true
        setisverifyed(true);
        // set the isverifyError to false
        setisverifyError(false);
        // set the open snackbar to prompt the user
        setOpenSnackbar({
          severity: 'success',
          message: Email + ' has a been verifed!',
          timestamp: new Date().getTime(),
        });
      })
      .catch((error) => {
        // when meet error
        // set open snackbar to prompt the user
        setOpenSnackbar({
          severity: 'error',
          message: error,
          timestamp: new Date().getTime(),
        });
        console.log(error);
      });
  }
  // this function is used to register the user
  function Regist() {
    // if the email is not verified then prompt the user
    if (!isverifyed) {
      setOpenSnackbar({
        severity: 'info',
        message: 'Please Verify your Email address first!',
        timestamp: new Date().getTime(),
      });
      return;
    }
    // if the phone is null then prompt the user
    if (phone === '') {
      setOpenSnackbar({
        severity: 'warning',
        message: 'Please fill in your mobile phone number.',
        timestamp: new Date().getTime(),
      });
      return;
    }
    // if the name is null then prompt the user
    if (name === '') {
      setOpenSnackbar({
        severity: 'warning',
        message: 'Please fill in a name so we know how to call you.',
        timestamp: new Date().getTime(),
      });
      return;
    }
    // if the password length is not between 6-16 then prompt the user
    if (Password.length < 6 || Password.length > 16) {
      setOpenSnackbar({
        severity: 'warning',
        message: 'Password must be between 6-16 characters!',
        timestamp: new Date().getTime(),
      });
      return;
    }
    // if the password is not the same as the rePassword then prompt the user
    if (Password !== Password1) {
      setOpenSnackbar({
        severity: 'warning',
        message: 'The two password inputs are inconsistent!',
        timestamp: new Date().getTime(),
      });
      return;
    }
    // if the thumbil is null then prompt the user
    if(AddThumbil===''){
      setOpenSnackbar({
        severity: 'warning',
        message: 'Please upload your frofile photo for our platform security!',
        timestamp: new Date().getTime(),
      });
      return;
    }
    // format the birth date
    const formattedDate = dayjs(BirthDate).format('DD/MM/YYYY');
    // define the data to register the user
    const data = {
      avatar: Thumbil,
      dateBirth: formattedDate,
      email: Email,
      name: name,
      password: Password,
      phone: phone,
      rePassword: Password1,
    };
    // call the api to register the user
    callAPIRegistUser('user/create', data)
      .then((response) => {
        // when meet success
        console.log(response);
        // set the open snackbar to prompt the user
        setOpenSnackbar({
          severity: 'success',
          message: 'Welcome join SpotFinder ' + name + '.',
          timestamp: new Date().getTime(),
        });
        // redirect the user to the login page
        const temp = removeLastSegment(location.pathname);
        console.log(temp);
        navigate(temp + 'userlogin');
      })
      .catch((error) => {
        // when meet error
        console.log(error);
        // set the open snackbar to prompt the user
        setOpenSnackbar({
          severity: 'warning',
          message: error,
          timestamp: new Date().getTime(),
        });
      });
  }
  return (
    <div className='overall'>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className='backgrounds'
      ></motion.div>
      <motion.div
        className='contentoverall'
        initial={{ y: '50%', opacity: 0 }}
        animate={{ y: '0%', opacity: 1 }}
        exit={{ y: '50%', opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className='back'>
          <button onClick={backhome} type='button' className='backbtn'>
            ×
          </button>
        </div>
        <div className='contentmain'>
          <img src='img/LOGO.svg' height={'100 px'} className='Logo' alt=''></img>
          <div className='LoginUser'>
            <p className='welcomemain'>Welcome to Join SpotFinder</p>
            <p className='welcomesub'>
              What is your reason for signing up today?
            </p>
            <form className='w-100'>
              <div className='form-check alcenter'>
                <input
                  className='checker'
                  type='radio'
                  checked={target === 'parking'}
                  onChange={() => handleOptionChange('parking')}
                ></input>
                <label className='welcomesub zeropd'>
                  I am looking for parking space.
                </label>
              </div>
              <div className='form-check alcenter mb-4'>
                <input
                  className='checker'
                  type='radio'
                  checked={target === 'earning'}
                  onChange={() => handleOptionChange('earning')}
                ></input>
                <label className='welcomesub zeropd'>
                  I want to earn money from my space.
                </label>
              </div>
              <div className='formpart-col'>
                <label
                  htmlFor='exampleInputEmail1'
                  className='form-label title'
                >
                  Email
                </label>
                <div className='emailverify'>
                  <input
                    type='email'
                    className='form-control rightcontrol-r '
                    disabled={isverifyed}
                    onChange={handleEmailChange}
                    value={Email}
                  ></input>
                  <button
                    className='sendcode'
                    disabled={isverifyed || isButtonDisabled}
                    type='button'
                    onClick={sendCode}
                  >
                    {isverifyed
                      ? 'Verified'
                      : verifyVisibility
                      ? 'Resend code'
                      : 'Send code'}
                  </button>
                </div>
                {verifyVisibility && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <label className='form-label title'>
                      Verification code
                    </label>
                    <div className='emailverify'>
                      <input
                        type='email'
                        className='form-control rightcontrol-r setmargin'
                        onChange={handleCodeChange}
                        value={code}
                      ></input>
                      <button
                        className='verify'
                        type='button'
                        onClick={verifyEmail}
                      >
                        Verify
                      </button>
                    </div>
                    {isverifyError && (
                      <div className='welcomesub zeropd'>Incorrect code</div>
                    )}
                    <div id='emailHelp' className='form-text helpmsg'>
                      We'll never share your email with anyone else.
                    </div>
                  </motion.div>
                )}
              </div>
              <div className='formpart-col'>
                <label className='form-label title'>Phone</label>
                <input
                  className='form-control rightcontrol setmargin'
                  value={phone}
                  onChange={handlePhoneChange}
                ></input>
              </div>
              <div className='formpart-col'>
                <label className='form-label title'>Preferred name</label>
                <input
                  className='form-control rightcontrol setmargin'
                  value={name}
                  onChange={handleNameChange}
                ></input>
              </div>
              <div className='formpart-col'>
                <label className='form-label title'>Date of Birth</label>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    className='setmargin daterightcontrol title'
                    label='DateBirth'
                    value={BirthDate}
                    onChange={handleBirthdayChange}
                  ></DatePicker>
                </LocalizationProvider>
              </div>
              <div className='formpart-col'>
                <label className='form-label title'>Password</label>
                <input
                  type={passwordVisibility1 ? 'text' : 'password'}
                  autoComplete='new-password'
                  className='form-control rightcontrol setmargin'
                  value={Password}
                  onChange={handlePasswordChange}
                ></input>
              </div>
              <div className='formpart-row'>
                <div className='seepart'>
                  <input
                    type='checkbox'
                    onChange={() =>
                      setPasswordVisibility1(!passwordVisibility1)
                    }
                    className='checks'
                  ></input>
                  <label className='pwdsee' htmlFor='exampleCheck1'>
                    show password
                  </label>
                </div>
              </div>
              <div className='formpart-col'>
                <label className='form-label title'>
                  Password Confirmation
                </label>
                <input
                  type={passwordVisibility2 ? 'text' : 'password'}
                  autoComplete='new-password'
                  className='form-control rightcontrol setmargin'
                  value={Password1}
                  onChange={handlePassword1Change}
                ></input>
              </div>
              <div className='formpart-row'>
                <div className='seepart'>
                  <input
                    type='checkbox'
                    onChange={() =>
                      setPasswordVisibility2(!passwordVisibility2)
                    }
                    className='checks'
                  ></input>
                  <label className='pwdsee' htmlFor='exampleCheck1'>
                    show password
                  </label>
                </div>
              </div>
              <div className='formpart-img'>
                <img
                  src={Thumbil}
                  className='profilephoto'
                  width='100 px'
                  height='100px'
                  alt=''
                ></img>
                <input
                  type='file'
                  id='fileInput'
                  style={{ display: 'none' }}
                  onChange={AddThumbil}
                />
                <button
                  onClick={EditPhoto}
                  type='button'
                  className='changeprofile'
                >
                  Select your profile photo
                </button>
              </div>
              <button
                type='button'
                className='btn btn-primary logbtn'
                onClick={Regist}
              >
                SIGN UP
              </button>
            </form>
            <div className='logbottom'>
              <p className='welcomesub'>Already have an account?</p>
              <p className='forget' onClick={goeslogin}>
                Click here to Sign in
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
// admin regist page
export function AdminRegistPage() {
  // set error to provide error message
  const { setOpenSnackbar } = useError();
  // initial the link to navigate
  let navigate = useNavigate();
  // initial the password visibility
  const [passwordVisibility1, setPasswordVisibility1] = useState(false);
  const [passwordVisibility2, setPasswordVisibility2] = useState(false);
  // initial the email
  const [Email, setEmail] = useState('');
  // initial the password
  const [Password, setPassword] = useState('');
  // when the password is changed, set the password
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };
  // initial the password1
  const [Password1, setPassword1] = useState('');
  // when the password1 is changed, set the password1
  const handlePassword1Change = (event) => {
    setPassword1(event.target.value);
  };
  // initial the phone number
  const [phone, setPhone] = useState('');
  // when the phone number is changed, set the phone number
  const handlePhoneChange = (event) => {
    setPhone(event.target.value);
  };
  // initial the name
  const [name, setName] = useState('');
  // when the name is changed, set the name
  const handleNameChange = (event) => {
    setName(event.target.value);
  };
  // initial the birth date
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };
  // go back to the home page
  let backhome = () => {
    navigate('/');
  };
  // go to the login page
  let goeslogin = () => {
    navigate('/adminlogin');
  };
  // when the user click the register button, check the input and register
  function Regist() {
    // if the phone number is empty, provide a warning
    if (phone ==='') {
      setOpenSnackbar({
        severity: 'warning',
        message: 'Please fill in your mobile phone number.',
        timestamp: new Date().getTime(),
      });
      return;
    }
    // if the name is empty, provide a warning
    if (name === '') {
      setOpenSnackbar({
        severity: 'warning',
        message: 'Please fill in a name so we know how to call you.',
        timestamp: new Date().getTime(),
      });
      return;
    }
    // if the password not between 6-16 characters, provide a warning
    if (Password.length < 6 || Password.length > 16) {
      setOpenSnackbar({
        severity: 'warning',
        message: 'Password must be between 6-16 characters!',
        timestamp: new Date().getTime(),
      });
      return;
    }
    // if the password1 not match the password, provide a warning
    if (Password !== Password1) {
      setOpenSnackbar({
        severity: 'warning',
        message: 'The two password inputs are inconsistent!',
        timestamp: new Date().getTime(),
      });
      return;
    }
    // initial the data to regist
    const data = {
      adminID: Email,
      name: name,
      password: Password,
      phone: phone,
      rePassword: Password1,
    };
    // call the api to register the admin
    callAPIRegistAdmin('manager/create', data)
      .then((response) => {
        // if the response is success, provide a success message
        setOpenSnackbar({
          severity: 'success',
          message: 'Admin ' + name + ' registed.',
          timestamp: new Date().getTime(),
        });
        // navigate to the login page
        navigate('/adminlogin');
      })
      .catch((error) => {
        // if the response is error, provide a warning message
        console.log(error);
        setOpenSnackbar({
          severity: 'warning',
          message: error,
          timestamp: new Date().getTime(),
        });
      });
  }
  return (
    <div className='overall'>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className='backgrounds'
      ></motion.div>
      <motion.div
        className='contentoverall'
        initial={{ y: '50%', opacity: 0 }}
        animate={{ y: '0%', opacity: 1 }}
        exit={{ y: '50%', opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className='back'>
          <button onClick={backhome} type='button' className='backbtn'>
            ×
          </button>
        </div>
        <div className='contentmain'>
          <img src='img/LOGO.svg' height={'100 px'} className='Logo' alt=''></img>
          <div className='LoginUser-admin'>
            <p className='welcomemain-admin'>Welcome to Join SpotFinder</p>
            <form className='w-100'>
              <div className='formpart-col'>
                <label className='form-label title'>AdminID</label>
                <input
                  type='email'
                  className='form-control setmargin'
                  onChange={handleEmailChange}
                  value={Email}
                  autoComplete='username'
                ></input>
              </div>
              <div className='formpart-col'>
                <label className='form-label title'>Phone</label>
                <input
                  className='form-control setmargin'
                  value={phone}
                  onChange={handlePhoneChange}
                  autoComplete='phone'
                ></input>
              </div>
              <div className='formpart-col'>
                <label className='form-label title'>Preferred name</label>
                <input
                  className='form-control setmargin'
                  value={name}
                  onChange={handleNameChange}
                  autoComplete='name'
                ></input>
              </div>
              <div className='formpart-col'>
                <label className='form-label title'>Password</label>
                <input
                  type={passwordVisibility1 ? 'text' : 'password'}
                  autoComplete='new-password'
                  className='form-control setmargin'
                  value={Password}
                  onChange={handlePasswordChange}
                ></input>
              </div>
              <div className='formpart-row'>
                <div className='seepart'>
                  <input
                    type='checkbox'
                    onChange={() =>
                      setPasswordVisibility1(!passwordVisibility1)
                    }
                    className='checks'
                  ></input>
                  <label className='pwdsee' htmlFor='exampleCheck1'>
                    show password
                  </label>
                </div>
              </div>
              <div className='formpart-col'>
                <label className='form-label title'>
                  Password Confirmation
                </label>
                <input
                  type={passwordVisibility2 ? 'text' : 'password'}
                  autoComplete='new-password'
                  className='form-control setmargin'
                  value={Password1}
                  onChange={handlePassword1Change}
                ></input>
              </div>
              <div className='seepart'>
                <input
                  type='checkbox'
                  onChange={() => setPasswordVisibility2(!passwordVisibility2)}
                  className='checks'
                ></input>
                <label className='pwdsee' htmlFor='exampleCheck1'>
                  show password
                </label>
              </div>
              <button
                type='button'
                className='btn btn-primary logbtn-admin'
                onClick={Regist}
              >
                SIGN UP
              </button>
            </form>
            <div className='logbottom'>
              <p className='welcomesub'>Already have an account?</p>
              <p className='forget' onClick={goeslogin}>
                Click here to Sign in
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
