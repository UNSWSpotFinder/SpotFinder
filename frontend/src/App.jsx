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
import {HomePageLarge,HomePageAdminSmall,HomePageAdminLarge,HomePageSmall} from './HomePage';
import { ErrorProvider, GlobalSnackbar, ErrorContext } from './API';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css';

function App() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    // 添加一个事件监听器，以便在窗口大小改变时更新windowWidth状态
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    // 清除事件监听器以避免内存泄漏
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  let layoutComponentHost;
  let LayoutComponentHome;
  let LayoutDetail;
  if (windowWidth > 760) {
    layoutComponentHost = null;
    LayoutComponentHome = <HomePageLarge/>;
    LayoutDetail = null;
  } else {
    layoutComponentHost = null;
    LayoutComponentHome = <HomePageSmall/>;;
    LayoutDetail = null;
  }
  return(
    <ErrorProvider>
      <GlobalSnackbar/>
        <BrowserRouter>
          <Routes>
            <Route path="/user/*" element = { LayoutComponentHome } /> 
            <Route path="/Dashboard/" element = { <div> Dashboard </div> } /> 
            <Route path="/*" element = { LayoutComponentHome } />
          </Routes>
        </BrowserRouter>
    </ErrorProvider>
  )
}

export default App;
