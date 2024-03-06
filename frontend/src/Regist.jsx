import { useNavigate } from 'react-router-dom';
import { useState, useContext, useEffect } from 'react';
import './Regist.css';
import { motion } from 'framer-motion';
import * as React from 'react';

import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  useError,
  callAPIverifyEmailCode,
  callAPIsendEmailCode,
  callAPIRegistUser
} from './API';
// 用户注册页面
export function UserRegistPage() {
  // 上下文错误
  const { snackbarData, setOpenSnackbar } = useError();
  //  初始化路由选择器
  let navigate = useNavigate();
  // 两个密码可见性
  const [passwordVisibility1, setPasswordVisibility1] = useState(false);
  const [passwordVisibility2, setPasswordVisibility2] = useState(false);
  // 生日
  const [BirthDate, setBirthDate] = useState(dayjs(new Date()));
  // 验证码可见性 验证状态 是否出现验证错误
  const [verifyVisibility, setverifyVisibility] = useState(false);
  const [isverifyed, setisverifyed] = useState(false);
  const [isverifyError, setisverifyError] = useState(false);
  // 邮箱
  const [Email, setEmail] = useState('');
  // 密码
  const [Password, setPassword] = useState('');
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };
  // 确认密码
  const [Password1, setPassword1] = useState('');
  const handlePassword1Change = (event) => {
    setPassword1(event.target.value);
  };
  // 验证码
  const [code, setCode] = useState('');
  const handleCodeChange = (event) => {
    setCode(event.target.value);
  };
  // 手机号
  const [phone, setPhone] = useState('');
  const handlePhoneChange = (event) => {
    setPhone(event.target.value);
  };
  // 姓名
  const [name, setName] = useState('');
  const handleNameChange = (event) => {
    setName(event.target.value);
  };
  // 选择目的
  const [target, setTarget] = useState(null);
  const handleOptionChange = (option) => {
    setTarget(option);
  };
  // 选择头像
  const [selectedFileName, setSelectedFileName] = useState('/img/LOGO.svg');
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const filePath = file ? URL.createObjectURL(file) : '/img/LOGO.svg';
    setSelectedFileName(filePath);
  };
  const handleBirthdayChange = (date) => {
    console.log(dayjs(date));
    setBirthDate(dayjs(date));
  };
  const EditPhoto = () => {
    document.getElementById('fileInput').click();
  };
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };
  let backhome = () => {
    navigate('/');
  };
  let goeslogin = () => {
    navigate('/userlogin');
  };
  function sendCode() {
    const data = {
      to: Email,
    };
    callAPIsendEmailCode('user/create/sendEmail', data)
    .then((response)=>{
        console.log(response);
        setverifyVisibility(true);
        // set open snackbar
        setOpenSnackbar({
          severity: 'success',
          message: 'We have send to ' + Email + ' a code.',
          timestamp: new Date().getTime()
        });
    })
    .catch((error)=>{
        // when meet error
        console.log(error);
        setOpenSnackbar({
            severity: 'error',
            message: error,
            timestamp: new Date().getTime()
        });
    })
  }
  function verifyEmail() {
    const data = {
      code: code,
      email: Email,
    };
    console.log(data);
    // call api to login
    callAPIverifyEmailCode('user/create/verifyEmail', data)
      .then((response) => {
        console.log(response);
        // set open snackbar
        setverifyVisibility(false);
        setisverifyed(true);
        setisverifyError(false);
        setOpenSnackbar({
          severity: 'success',
          message: Email + ' has a been verifed!',
          timestamp: new Date().getTime()
        });
      })
      .catch((error) => {
        // when meet error
        setOpenSnackbar({
          severity: 'error',
          message: error,
          timestamp: new Date().getTime()
        });
        console.log(error);
      });
  }
  function Regist() {
    if(!isverifyed){
        setOpenSnackbar({
            severity:'info',
            message:'Please Verify your Email address first!',
            timestamp:new Date().getTime
        });
        return;
    }
    if (phone==''){
        setOpenSnackbar({
            severity:'warning',
            message:'Please fill in your mobile phone number.',
            timestamp:new Date().getTime
        });
        return;
    }
    if(name==''){
        setOpenSnackbar({
            severity:'warning',
            message:'Please fill in a name so we know how to call you.',
            timestamp:new Date().getTime
        });
        return;
    }
    if(Password.length<6||Password.length>16){
        setOpenSnackbar({
            severity:'warning',
            message:'Password must be between 6-16 characters!',
            timestamp:new Date().getTime
        });
        return;
    }
    if (Password !== Password1) {
        setOpenSnackbar({
            severity:'warning',
            message:'The two password inputs are inconsistent!',
            timestamp:new Date().getTime
        });
        return;
    }
    console.log(BirthDate);
    const formattedDate = dayjs(BirthDate).format('YYYY-MM-DD HH:mm:ss');
    console.log(formattedDate)
    const data={
        avatar: selectedFileName,
        dateBirth:formattedDate,
        email:Email,
        name:name,
        password:Password,
        phone: phone,
        rePassword: Password1
    }
    if(Password!=Password1){

    }
    callAPIRegistUser('user/create',data)
    .then((response)=>{
        console.log(response);
        setOpenSnackbar({
            severity:'success',
            message:'Welcome join SpotFinder ' + name + '.',
            timestamp:new Date().getTime
        })
    })
    .catch((error)=>{
        setOpenSnackbar({
            severity:'warning',
            message:error,
            timestamp:new Date().getTime
        });
    })
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
          <img src='img/LOGO.svg' height={'100 px'} className='Logo'></img>
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
                    className='form-control rightcontrol-r setmargin'
                    disabled={isverifyed}
                    onChange={handleEmailChange}
                    value={Email}
                  ></input>
                  <button
                    className='sendcode'
                    disabled={isverifyed}
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
                  src={selectedFileName}
                  className='profilephoto'
                  width='100 px'
                  height='100px'
                ></img>
                <input
                  type='file'
                  id='fileInput'
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
                <button
                  onClick={EditPhoto}
                  type='button'
                  className='changeprofile'
                >
                  Select your profile photo
                </button>
              </div>
              <button type='button' className='btn btn-primary logbtn' onClick={Regist}>
                SIGN UP
              </button>
            </form>
            <div className='logbottom'>
              <p className='welcomesub'>Already have an account?</p>
              <a className='forget' onClick={goeslogin}>
                Click here to Sign in
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
export function AdminRegistPage() {
  let navigate = useNavigate();
  let backhome = () => {
    navigate('/');
  };
  return (
    <div className='overall'>
      <div className='backgrounds'></div>
      <div className='contentoverall'>
        <p>AdminRegist</p>
        <button onClick={backhome}>Back</button>
      </div>
    </div>
  );
}
