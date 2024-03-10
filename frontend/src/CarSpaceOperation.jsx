import React, {
    useState,
    ChangeEvent,
    useContext,
    LabelHTMLAttributes,
  } from 'react';
  import dayjs from 'dayjs';
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
  } from 'react-router-dom';

export function CreatSpace(){
    let navigate=useNavigate();
    let email=localStorage.getItem('email');
    let goback=()=>{
        navigate(-1);
    }
    return(

        <div>
            <button onClick={goback}>Back</button>
            <p>CreatNewSpace</p></div>
    )
  }

export function EditSpace(){
    return
    (
        <div>EditNewSpace</div>
    )
  }