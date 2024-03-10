import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import React, { useState, useEffect, createContext,useContext } from 'react';

import { styled } from '@mui/material';
const port = '8080';
export const meetErrorLog = (error) => {
    console.log(error);
    let errorText = '';
    // switch case to show the error
    switch (error) {
      case 'info':
        errorText = 'Invalid username or password !';
        break;
      case 'access':
        errorText = 'No permission, please log in first!';
        break;
      default:
        errorText = 'Network error! Please try again.';
        break;
    }
    return errorText;
  };
export const ErrorContext = createContext({
    snackbarData: { severity: 'info', message: '1',timestamp: new Date().getTime()},
    setOpenSnackbar: () => {}, // 提供一个空函数避免调用时出错
  });
export const useError = () => useContext(ErrorContext);
export const ErrorProvider = ({ children }) => {
  const [snackbarData, setSnackbarData] = useState({
    severity: 'success',
    message: '',
    timestamp: new Date().getTime()
  });
  const setOpenSnackbar = (data) => {
    setSnackbarData(data);
  };
  return (
    <ErrorContext.Provider value={{snackbarData,setOpenSnackbar}}>
      {children}
    </ErrorContext.Provider>
  );
};
// The message to be displayed in the Snackbar
export const GlobalSnackbar = () => {
const { snackbarData, setOpenSnackbar } = useError();
// State to manage the visibility of the Snackbar
const [open, setOpen] = useState(false);
  useEffect(() => {
    console.log('Alert severity:', snackbarData.severity);
    console.log('Alert :', snackbarData.message);
    if (snackbarData.message) {
      setOpen(true);
    }
  }, [snackbarData.message, snackbarData.timestamp]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

return (
    // Snackbar component with automatic hiding and custom styling
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={snackbarData.severity}>
        {snackbarData.message}
        </Alert>
  </Snackbar>
);
};
export const callAPIsendEmailCode = (path,input)=>{
    return new Promise((resolve, reject) =>{
        fetch('http://localhost:'+String(port)+'/'+String(path),{
        method:'POST',
        headers: { 'Content-Type': 'application/json' },
        body:JSON.stringify(input),
        })
        .then((response)=>{
            if(response.ok){
                console.log('success');
                console.log(response);
                return resolve(response);
            }
            else if (response.status===400){
                const errorReason = 'Email not correct!';
                return reject(errorReason);
            }
            else{
                const errorReason = 'There is a problem with the network connection!';
                return reject(errorReason);
            }
        })
        .catch((error)=>{
            console.log(error);
        })
    })
    
}
export const callAPIverifyEmailCode = (path,input)=>{
    return new Promise((resolve, reject) =>{
        console.log(input);
        console.log('http://localhost:'+String(port)+'/'+String(path));
        fetch('http://localhost:'+String(port)+'/'+String(path),{
        method:'POST',
        headers: { 'Content-Type': 'application/json' },
        body:JSON.stringify(input),
        })
        .then((response)=>{
            if(response.ok){
                console.log('success');
                return resolve(response.json());
            }
            else if (response.status===400){
                const errorReason = 'Incorrect verification code.';
                return reject(errorReason);
            }
            else{
                const errorReason = 'There is a problem with the network connection!';
                return reject(errorReason);
            }
        })
        .catch((error)=>{
            console.log(error);
        })
    })
    
}
export const callAPIloginUser=(path,input)=>{

}
// 用户注册
export const callAPIRegistUser=(path,input)=>{
     return new Promise((resolve, reject) =>{
        console.log(input);
        console.log('http://localhost:'+String(port)+'/'+String(path));
        fetch('http://localhost:'+String(port)+'/'+String(path),{
        method:'POST',
        headers: { 'Content-Type': 'application/json' },
        body:JSON.stringify(input),
        })
        .then((response)=>{
            if(response.ok){
                console.log('success');
                return resolve(response.json());
            }
            else if (response.status===417){
                const errorReason = 'This email has been registed!';
                return reject(errorReason);
            }
            else{
                const errorReason = 'There is a problem with the network connection!';
                return reject(errorReason);
            }
        })
        .catch((error)=>{
            console.log(error);
        })
    })
}
// 管理员注册
export const callAPIRegistAdmin=(path,input)=>{
    return new Promise((resolve, reject) =>{
       console.log(input);
       console.log('http://localhost:'+String(port)+'/'+String(path));
       fetch('http://localhost:'+String(port)+'/'+String(path),{
       method:'POST',
       headers: { 'Content-Type': 'application/json' },
       body:JSON.stringify(input),
       })
       .then((response)=>{
        if (response.status === 200) {
            console.log('success');
            return response.json().then(data => resolve(data));
          } else {
            // 如果状态码不是200，我们要解析JSON来找出错误原因
            response.json().then(data => {
              let errorReason = 'An unknown error occurred.';
              if(data.error=='invalid manager'){
                errorReason = 'It looks like you are not an employee of our company.';
              }
              else if(data.error){
                errorReason = 'User has been registered!';
              }
              reject(errorReason);
            })
            .catch(() => { reject(new Error('Error parsing response JSON.'));});
          }
       })
       .catch((error)=>{
           console.log(error);
       })
   })
}
// 用户登录
export const callAPILoginUser=(path,input)=>{
    return new Promise((resolve, reject) =>{
       console.log(input);
       console.log('http://localhost:'+String(port)+'/'+String(path));
       fetch('http://localhost:'+String(port)+'/'+String(path),{
       method:'POST',
       headers: { 'Content-Type': 'application/json' },
       body:JSON.stringify(input),
       })
       .then((response)=>{
           if(response.ok){
               console.log('success');
               return resolve(response.json());
           }
           else if (response.status===401){
               const errorReason = 'Username does not exist or password is incorrect!';
               return reject(errorReason);
           }
           else if (response.status===500){
            const errorReason = 'Username does not exist or password is incorrect!';
            return reject(errorReason);
          }
           else{
               const errorReason = 'There is a problem with the network connection!';
               return reject(errorReason);
           }
       })
       .catch((error)=>{
           console.log(error);
       })
   })
}
// 密码修改
export const callAPIResetPwdUser=(path,input)=>{
    return new Promise((resolve, reject) =>{
       console.log(input);
       console.log('http://localhost:'+String(port)+'/'+String(path));
       fetch('http://localhost:'+String(port)+'/'+String(path),{
       method:'POST',
       headers: { 'Content-Type': 'application/json' },
       body:JSON.stringify(input),
       })
       .then((response)=>{
           if(response.ok){
               console.log('success');
               return resolve(response.json());
           }
           else if (response.status===401){
               const errorReason = 'Username does not exist or password is incorrect!';
               return reject(errorReason);
           }
           else{
               const errorReason = 'There is a problem with the network connection!';
               return reject(errorReason);
           }
       })
       .catch((error)=>{
           console.log(error);
       })
   })
}