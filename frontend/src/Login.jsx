import { useNavigate,useLocation } from 'react-router-dom';
import './Login.css';
import { useState,useEffect } from 'react';
import { motion } from 'framer-motion';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { getUserInfo } from './components/API'
import {
    useError,
    callAPIverifyEmailCode,
    callAPIsendEmailCode,
    callAPILoginUser,
    callAPIResetPwdUser,
    removeLastSegment,
    callAPILoginAdmin
  } from './API';

// user Login page
export function UserLoginPage(){
    // set the error message
    const { setOpenSnackbar } = useError();
    // location control
    let location = useLocation();
    // navigate control
    let navigate = useNavigate();
    // initial password visibility to false
    const [passwordVisibility, setPasswordVisibility] = useState(false);
    // initial the email and password
    const [Email,setEmail]=useState('');
    const [Password,setPassword]=useState('');
    // go back to the previous page
    let backhome = ()=>{
        navigate(-1);
    }
    // go to the register page
    let goesRegist= ()=>{
        // remove the last segment of the path
        const temp = removeLastSegment(location.pathname);
        console.log(temp);
        navigate(temp+'userregist');
    }
    // goes to the forget password page
    let forgetpassword = () => {
        navigate('/password');
    }
    // when the password is changed
    let passwordChange = (event) => {
        setPassword(event.target.value);
    }
    // when the email is changed
    let emailChange = (event) => {
        setEmail(event.target.value);
    }
    // when user try to login page
    function login(){
        // if the email or password is empty or the password length is not between 6 and 16
        if(Password.length<6 || Password.length > 16 || Email===''){
            // tell the user the email or password is invalid
            setOpenSnackbar({
                severity: 'warning',
                message:  'Invaild email or password.',
                timestamp: new Date().getTime()
            });
        }
        else{
            // initial the data
            const data={
                email: Email,
                password: Password
            }
            // call the API to login the user
            callAPILoginUser('login',data)
            .then((response)=>{
                // if the response is correct
                console.log(response);
                // tell the user the login is successful
                setOpenSnackbar({
                    severity:'success',
                    message:'Welcome back SpotFinder ' + Email + '.',
                    timestamp:new Date().getTime()
                });
                // store the token, email and username in the local storage
                localStorage.setItem('token',response.token);
                localStorage.setItem('email',Email);
                // get the user information
                getUserInfo().then((response)=>{
                    // store the username in the local storage
                    localStorage.setItem('username',response.message.name);
                }).catch((error)=>{
                    // call the user can not get the user information
                    setOpenSnackbar({
                        severity:'error',
                        message:'Can not get user information.',
                        timestamp:new Date().getTime()
                    });
                })
                // if the spotID is stored in the local storage
                if(localStorage.getItem('spotID')){
                    // goes to the spot detail page
                    navigate('/' + Email + '/detail/' + localStorage.getItem('spotID'));
                }
                else{
                    // goes to the Email page
                    navigate(`/${Email}`);
                }
                
            })
            .catch((error)=>{
                // if the response is not correct
                setOpenSnackbar({
                    severity:'warning',
                    message:error,
                    timestamp:new Date().getTime()
                });
            })
        }
    }
    // login page design
    return(
        // 主体
        <div className='overall'>
            {/* 背景黑色遮罩 */}
            <motion.div 
            initial={{opacity:0 }}
            animate={{opacity:0.3 }}
            exit =  {{opacity:0 }}
            transition={{ duration: 0.3 }}
            className='backgrounds'>
            </motion.div>
            {/* 内容 */}
            <motion.div className='contentoverall'
             initial={{ y: "50%", opacity:0 }}
             animate={{ y: "0%" ,opacity:1 }}
             exit = {{  y: "50%" ,opacity:0 }}
             transition={{ duration: 0.3 }}>
                {/* 关闭按钮 */}
                <div className='back'>
                    <button onClick={backhome} className='backbtn'>×</button>
                </div>
                {/* 其余内容 */}
                <div className='contentmain'>
                    {/* logo */}
                    <img src='/img/LOGO.svg' height={'100 px'} className='Logo' alt=''></img>
                    {/* 剩余内容 */}
                    <div className='LoginUser'>
                        {/* 欢迎语句 */}
                        <p className='welcomemain'>Welcome back to SpotFinder</p>
                        <p className='welcomesub'>Sign in to see what happen</p>
                        {/* 表单部分 */}
                        <form className='w-100'>
                            {/* 邮箱 */}
                            <div className='formpart-col'>
                             <label htmlFor="exampleInputEmail1" className="form-label title">Email</label>
                                <input type="email" onChange={emailChange} autoComplete="current-username" className="form-control rightcontrol setmargin"></input>
                                <div id="emailHelp" className="form-text helpmsg">We'll never share your email with anyone else.</div>
                            </div>
                            {/* 密码 */}
                            <div className='formpart-col'>
                            <label htmlFor="exampleInputPassword1" className="form-label title">Password</label>
                            <input type={passwordVisibility? "text": "password"} onChange={passwordChange} autoComplete="current-password" className="form-control rightcontrol setmargin" id="exampleInputPassword1"></input>
                            </div>
                            {/* 密码可见性 和  忘记密码*/}
                            <div className='formpart-row'>
                                {/* 密码可见性 */}
                                <div className='seepart'>
                                    <input type="checkbox" onChange={()=>setPasswordVisibility(!passwordVisibility)} className='checks' id="exampleCheck1"></input>
                                    <label className="pwdsee" htmlFor="exampleCheck1">show password</label>
                                </div>
                                {/* 忘记密码 */}
                                <p className='forget' onClick={forgetpassword}>Forget your password?</p>
                            </div>
                            {/* 登录按钮 */}
                            <button type="button" className="btn btn-primary logbtn" onClick={login}>SIGN IN</button>
                        </form>
                        {/* 尾部提示 */}
                        <div className='logbottom'>
                            <p className='welcomesub'>Do not have an account?</p>
                            <p onClick={goesRegist} className='forget'>Click here to Sign up</p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
// forget password page
export function UserLoginPageForgetPassword(){
    // is button disabled
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    useEffect(() => {
        // initialize a timeoutId
        // when the button is disabled, set a timer to set it back to enabled after 30 seconds
        if (isButtonDisabled) {
            // set the timeoutId
            setTimeout(() => {
                setIsButtonDisabled(false);
            }, 30000); // 30 秒
        }
    });
    // context error to notify the user
    const { setOpenSnackbar } = useError();
    // 初始化路由切换器
    // initialize the navigate
    let navigate = useNavigate();
    // verify visibility, verify status, is verify error
    const [verifyVisibility, setverifyVisibility] = useState(false);
    const [isverifyed, setisverifyed] = useState(false);
    const [isverifyError, setisverifyError] = useState(false);
    // two password visibility
    const [passwordVisibility1, setPasswordVisibility1] = useState(false);
    const [passwordVisibility2, setPasswordVisibility2] = useState(false);
    // initialize the username
    const [Email,setEmail]=useState('');
    // initialize the code
    const [code,setCode]=useState('');
    // initialize the new password and confirm new password
    const [Password1,setPassword1]=useState('');
    const [Password2,setPassword2]=useState('');
    // handle the change of the email
    const handleEmailChange = (event) => {
        setEmail(event.target.value);
      };
    // handle the change of the code
    const handleCodeChange = (event) => {
        setCode(event.target.value);
    };
    // handle the change of the password
    const handlePWD1Change = (event) => {
        setPassword1(event.target.value);
      };
    // handle the change of the password
    const handlePWD2Change = (event) => {
        setPassword2(event.target.value);
    };
    // back to the login page
    let backhome = ()=>{
        navigate(-1);
    }
    // when the user try to reset the password
    let resetPassword = () => {
        // if the password is not between 6-16 characters
        if(Password1.length<6||Password1.length>16){
            // open the snackbar to notify the user
            setOpenSnackbar({
                severity:'warning',
                message:'Password must be between 6-16 characters!',
                timestamp:new Date().getTime()
            });
            return;
        }
        // if the two passwords are inconsistent
        if (Password2 !== Password1) {
            // open the snackbar to notify the user
            setOpenSnackbar({
                severity:'warning',
                message:'The two password inputs are inconsistent!',
                timestamp:new Date().getTime()
            });
            return;
        }
        // initialize the data
        const data={
            email: Email,
            password: Password1,
            repassword: Password2
        }
        console.log(data);
        // call the api to reset the password
        callAPIResetPwdUser('user/modifyPasswd', data)
        .then((response)=>{
            // when meet success
            console.log(response);
            // set open snackbar
            setOpenSnackbar({
              severity: 'success',
              message: 'Password reset successful',
              timestamp: new Date().getTime()
            });
            // navigate to the login page
            navigate(-1);
        })
        // when meet error
        .catch((error)=>{
            // when meet error
            console.log(error);
            // set open snackbar to notify the user
            setOpenSnackbar({
                severity: 'error',
                message: error,
                timestamp: new Date().getTime()
            });
        })
    }
    // when the user try to send the code
    function sendCode() {
        // if the button is disabled
        if (isButtonDisabled) {
            // open the snackbar to notify the user
            setOpenSnackbar({
                severity:'info',
                message:'Verification codes are sent too frequently',
                timestamp:new Date().getTime()
            });
            return;
        }
        // initialize the data
        const data = {
          to: Email,
        };
        // call the api to send the email code
        callAPIsendEmailCode('user/create/sendEmail', data)
        .then((response)=>{
            // when meet success
            console.log(response);
            // set the visibility of the verify
            setverifyVisibility(true);
            // set the button to disabled
            setIsButtonDisabled(true);
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
    // when the user try to verify the email   
      function verifyEmail() {
        // initialize the data
        const data = {
          code: code,
          email: Email,
        };
        // log the data
        console.log(data);
        // call api to login
        callAPIverifyEmailCode('user/create/verifyEmail', data)
          .then((response) => {
            // when meet success
            console.log(response);
            // set open snackbar
            setverifyVisibility(false);
            // set the verify status
            setisverifyed(true);
            // set the verify error to false
            setisverifyError(false);
            // set open snackbar to notify the user
            setOpenSnackbar({
              severity: 'success',
              message: Email + ' has a been verifed!',
              timestamp: new Date().getTime()
            });
          })
          .catch((error) => {
            // when meet error
            // tell the user the error
            setOpenSnackbar({
              severity: 'error',
              message: error,
              timestamp: new Date().getTime()
            });
          });
      }
    return(
        <div className='overall'>
            <motion.div 
            initial={{opacity:0 }}
            animate={{opacity:0.3 }}
            exit =  {{opacity:0 }}
            transition={{ duration: 0.3 }}
            className='backgrounds'></motion.div>
            <motion.div className='contentoverall'
             initial={{ y: "50%", opacity:0 }}
             animate={{ y: "0%" ,opacity:1 }}
             exit = {{  y: "50%" ,opacity:0 }}
             transition={{ duration: 0.3 }}>
                <div className='back'>
                    <button onClick={backhome} className='backbtn'>×</button>
                </div>
                <div className='contentmain'>
                    <img src='img/LOGO.svg' height={'100 px'} className='Logo' alt=''></img>
                    <div className='LoginUser'>
                        <p className='welcomemain'>We will reset your password for you</p>
                        <form className='w-100'>
                            {!isverifyed && (<div>
                                <p className='welcomesub'>First tell us your login email</p>
                                <div className='formpart-col'>
                                    <label htmlFor="exampleInputEmail1" className="form-label title">Email</label>
                                    <div className='emailverify'>
                                        <input type="email" className="form-control rightcontrol-r setmargin" onChange={handleEmailChange} value={Email}></input>
                                        <button className='sendcode' disabled={isverifyed || isButtonDisabled} type='button' onClick={sendCode}>{isverifyed?'Verified':(verifyVisibility?'Resend code':'Send code')}</button>
                                    </div>
                                    {verifyVisibility && (
                                        <motion.div
                                        initial={{  opacity:0 }}
                                        animate={{ opacity:1 }}
                                        exit = {{  opacity:0 }}
                                        transition={{ duration: 0.5 }}
                                        >
                                            <label className="form-label title">Verification code</label>
                                            <div className='emailverify'>
                                                <input type="email" className="form-control rightcontrol-r setmargin"  onChange={handleCodeChange} value={code}></input>
                                                <button className='verify' type='button' onClick={verifyEmail}>Verify</button>
                                            </div>
                                            {isverifyError && <div className='welcomesub zeropd'>Incorrect code</div>}
                                        </motion.div>
                                    )}
                                </div>
                            </div>)}
                            {isverifyed &&(<motion.div 
                                        initial={{  opacity:0 }}
                                        animate={{ opacity:1 }}
                                        exit = {{  opacity:0 }}
                                        transition={{ duration: 0.5 }}
                            >
                            <div className='formpart-col'>
                            <label htmlFor="exampleInputPassword1" className="form-label title">New Password</label>
                            <input type={passwordVisibility1? "text": "password"} autoComplete="current-password" className="form-control rightcontrol setmargin" value={Password1} onChange={handlePWD1Change}></input>
                            </div>
                            <div className='formpart-row'>
                                <div className='seepart'>
                                <input type="checkbox" onChange={()=>setPasswordVisibility1(!passwordVisibility1)} className='checks' id="exampleCheck1"></input>
                                <label className="pwdsee" htmlFor="exampleCheck1">show password</label>
                                </div>
                            </div>
                            <div className='formpart-col'>
                            <label htmlFor="exampleInputPassword1" className="form-label title">New Password Confirmation</label>
                            <input type={passwordVisibility2? "text": "password"} autoComplete="current-password" className="form-control rightcontrol setmargin"  value={Password2} onChange={handlePWD2Change}></input>
                            </div>
                            <div className='formpart-row'>
                                <div className='seepart'>
                                    <input type="checkbox" onChange={()=>setPasswordVisibility2(!passwordVisibility2)} className='checks' id="exampleCheck1"></input>
                                    <label className="pwdsee" htmlFor="exampleCheck1">show password</label>
                                </div>
                            </div>
                            <button type="button" className="btn btn-primary logbtn" onClick={resetPassword}>Reset Password</button>
                            </motion.div>)
                            }
                        </form>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
// 管理员登录页面
// admin login page
export function AdminLoginPage(){
    // initialize the snackbar
    const { setOpenSnackbar } = useError();
    // control the route
    let navigate = useNavigate();
    // set the password visibility
    const [passwordVisibility, setPasswordVisibility] = useState(false);
    // 用户名密码状态记录
    // record the email and password
    const [Email,setEmail]=useState('');
    const [Password,setPassword]=useState('');
    // go back to the home page
    let backhome = ()=>{
        navigate('/');
    }
    // goes to admin register page
    let goesRegistAdmin = () => {
        navigate('/adminregist');
    }
    // when the password changes
    let passwordChange = (event) => {
        setPassword(event.target.value);
    }
    // when the email changes
    let emailChange = (event) => {
        setEmail(event.target.value);
    }
    // check the login
    function login(){
        // if the email or password length is not valid
        if(Password.length<6 || Password.length > 16 || Email===''){
            // show the snackbar
            setOpenSnackbar({
                severity: 'warning',
                message:  'Invaild email or password.',
                timestamp: new Date().getTime()
            });
        }
        // if the email and password are valid
        else{
            // initialize the data
            const data={
                adminID: Email,
                password: Password
            }
            // call the api to login
            callAPILoginAdmin('manager/login',data)
            .then((response)=>{
                // show the snackbar to welcome the user
                console.log(response);
                setOpenSnackbar({
                    severity:'success',
                    message:'Welcome to start your work for SpotFinder ' + Email + '.',
                    timestamp:new Date().getTime()
                });
                // store the token and admin id
                localStorage.setItem('token',response.token);
                localStorage.setItem('AdminId',Email);
                // navigate to the admin page
                navigate(`/admin/${Email}`);
            })
            .catch((error)=>{
                // show the snackbar to show the error
                setOpenSnackbar({
                    severity:'warning',
                    message:error,
                    timestamp:new Date().getTime()
                });
            })
        }
    }
    // 登录页面设计
    return(
        // 主体
        <div className='overall'>
            {/* 背景黑色遮罩 */}
            <motion.div 
            initial={{opacity:0 }}
            animate={{opacity:0.3 }}
            exit =  {{opacity:0 }}
            transition={{ duration: 0.3 }}
            className='backgrounds'>
            </motion.div>
            {/* 内容 */}
            <motion.div className='contentoverall'
             initial={{ y: "50%", opacity:0 }}
             animate={{ y: "0%" ,opacity:1 }}
             exit = {{  y: "50%" ,opacity:0 }}
             transition={{ duration: 0.3 }}>
                {/* 关闭按钮 */}
                <div className='back'>
                    <button onClick={backhome} className='backbtn'>×</button>
                </div>
                {/* 其余内容 */}
                <div className='contentmain-admin'>
                    {/* logo */}
                    <img src='img/LOGO.svg' height={'100 px'} className='Logo' alt=''></img>
                    {/* 剩余内容 */}
                    <div className='LoginUser-admin'>
                        {/* 欢迎语句 */}
                        <p className='welcomemain-admin'>Manage my SpotFinder</p>
                        {/* 表单部分 */}
                        <form className='w-100'>
                            {/* 邮箱 */}
                            <div className='formpart-col-admin'>
                             <label className="form-label title">AdminID</label>
                                <input type="email" onChange={emailChange} autoComplete="current-username" className="form-control setmargin"></input>
                                <div id="emailHelp" className="form-text helpmsg">Your AdminID is provided by the company.</div>
                            </div>
                            {/* 密码 */}
                            <div className='formpart-col-admin'>
                            <label htmlFor="exampleInputPassword1" className="form-label title">Password</label>
                            <input type={passwordVisibility? "text": "password"} onChange={passwordChange} autoComplete="current-password" className="form-control setmargin" id="exampleInputPassword1"></input>
                            </div>
                            {/* 密码可见性 */}
                            <div className='seepart'>
                                <input type="checkbox" onChange={()=>setPasswordVisibility(!passwordVisibility)} className='checks' id="exampleCheck1"></input>
                                <label className="pwdsee" htmlFor="exampleCheck1">show password</label>
                            </div>
                            {/* 登录按钮 */}
                            <button type="button" className="btn btn-primary logbtn-admin" onClick={login}>SIGN IN</button>
                        </form>
                        {/* 尾部提示 */}
                        <div className='logbottom-admin'>
                            <p className='welcomesub'>Do not have an account?</p>
                            <p onClick={goesRegistAdmin} className='forget'>Click here to Sign up</p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
