import { useNavigate } from 'react-router-dom';
import './Login.css';
import { useState } from 'react';
import { motion,AnimatePresence } from 'framer-motion';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import {
    useError,
    callAPIverifyEmailCode,
    callAPIsendEmailCode
  } from './API';
// 用户登录页面
export function UserLoginPage(){
    const { _ , setOpenSnackbar } = useError();
    // 路由控制
    let navigate = useNavigate();
    // 密码可见性
    const [passwordVisibility, setPasswordVisibility] = useState(false);
    // 用户名密码状态记录
    const [Email,setEmail]=useState('');
    const [Password,setPassword]=useState('');
    // 回到主页
    let backhome = ()=>{
        navigate('/');
    }
    // 用户注册页
    let goesRegist= ()=>{
        navigate('/userregist');
    }
    // 忘记密码页
    let forgetpassword = () => {
        navigate('/password');
    }
    // 密码更改
    let passwordChange = (event) => {
        setPassword(event.target.value);
    }
    // 邮箱更改
    let emailChange = (event) => {
        setEmail(event.target.value);
    }
    // 检查登录
    function login(){
        if(Password ==='123456' && Email==='123456'){
            navigate('/user/123456');
            setOpenSnackbar({
                severity: 'success',
                message:  'Login successful',
                timestamp: new Date().getTime()
            });
        }
        else{
            console.log('not corect '+Password+' '+ Email);
            setOpenSnackbar({
                severity: 'warning',
                message:  'Password Incorrect!',
                timestamp: new Date().getTime()
            });

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
                <div className='contentmain'>
                    {/* logo */}
                    <img src='img/LOGO.svg' height={'100 px'} className='Logo'></img>
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
                                <input type="email" onChange={emailChange} autoComplete="current-username" className="form-control rightcontrol setmargin" id="exampleInputEmail1"></input>
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
                                <a className='forget' onClick={forgetpassword}>Forget your password?</a>
                            </div>
                            {/* 登录按钮 */}
                            <button type="button" className="btn btn-primary logbtn" onClick={login}>SIGN IN</button>
                        </form>
                        {/* 尾部提示 */}
                        <div className='logbottom'>
                            <p className='welcomesub'>Do not have an account?</p>
                            <a onClick={goesRegist} className='forget'>Click here to Sign up</a>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
// 用户忘记密码页面
export function UserLoginPageForgetPassword(){
    // 上下文错误
    const { snackbarData, setOpenSnackbar } = useError();
    // 初始化路由切换器
    let navigate = useNavigate();
    // 验证器可见性，验证状态，是否验证错误
    const [verifyVisibility, setverifyVisibility] = useState(false);
    const [isverifyed, setisverifyed] = useState(false);
    const [isverifyError, setisverifyError] = useState(false);
    // 两个密码可见性
    const [passwordVisibility1, setPasswordVisibility1] = useState(false);
    const [passwordVisibility2, setPasswordVisibility2] = useState(false);
    // 用户名
    const [Email,setEmail]=useState('');
    // 验证码
    const [code,setCode]=useState('');
    // 新密码和确认新密码
    const [Password1,setPassword1]=useState('');
    const [Password2,setPassword2]=useState('');
    const handleEmailChange = (event) => {
        setEmail(event.target.value);
      };
    const handleCodeChange = (event) => {
    setCode(event.target.value);
    };
    const handlePWD1Change = (event) => {
        setPassword1(event.target.value);
      };
    const handlePWD2Change = (event) => {
        setPassword2(event.target.value);
    };
    let backhome = ()=>{
        navigate('/');
    }
    let goesRegist= ()=>{
        navigate('/userregist');
    }
    let forgetpassword = () => {
        navigate('/password');
    }
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
                    <img src='img/LOGO.svg' height={'100 px'} className='Logo'></img>
                    <div className='LoginUser'>
                        <p className='welcomemain'>We will reset your password for you</p>
                        <form className='w-100'>
                            {!isverifyed && (<div>
                                <p className='welcomesub'>First tell us your login email</p>
                                <div className='formpart-col'>
                                    <label htmlFor="exampleInputEmail1" className="form-label title">Email</label>
                                    <div className='emailverify'>
                                        <input type="email" className="form-control rightcontrol-r setmargin"  onChange={handleEmailChange} value={Email}></input>
                                        <button className='sendcode' disabled={isverifyed} type='button' onClick={sendCode}>{isverifyed?'Verified':(verifyVisibility?'Resend code':'Send code')}</button>
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
                            <button type="button" className="btn btn-primary logbtn">Reset Password</button>
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
export function AdminLoginPage(){
    let navigate = useNavigate();
    let backhome = ()=>{
        navigate('/');
    }
    return(
        <div className='overall'>
            <div className='backgrounds'></div>
            <div  className='contentoverall'>
                <p>AdminLogin</p>
                <button onClick={backhome}>Back</button>
            </div>
        </div>
    )
}