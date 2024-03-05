import logo from './logo.svg';
import React, {
  useState,
  useEffect,
  useRef,
  ChangeEvent,
  LabelHTMLAttributes,
  createContext,
  useContext,
  ReactNode,
} from 'react';
import {HomePageUnlog,HomePageUser,HomePageAdmin} from './HomePage';
import { ErrorProvider, GlobalSnackbar, ErrorContext } from './API';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css';

function App() {
  return(
    <ErrorProvider>
      <GlobalSnackbar/>
      <BrowserRouter>
        <Routes>
          <Route path="/user/*" element={<HomePageUser/>} /> 
          <Route path="/Dashboard/" element={<div>Dashboard</div>} /> 
          <Route path="/*" element={<HomePageUnlog/>} />
        </Routes>
      </BrowserRouter>
    </ErrorProvider>
  )
}

export default App;
