import React, {
  useState,
  useEffect,
} from 'react';
import {HomePageLarge, HomePageSmall} from './HomePage';
import { UserRegistPage,AdminRegistPage } from './Regist';
import { ErrorProvider, GlobalSnackbar } from './API';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import {AdminLoginPage,UserLoginPage,UserLoginPageForgetPassword } from './Login';
import{
  CreateSpace, EditSpace
} from './CarSpaceOperation';
import{
  CarSpaceChoice
} from './CarInfo';
import {
  HomeSpecificLarge,
  VisaPayment
} from './SpecificSpot';
// import responding components for dashboard
import DashboardTop from './components/DashboardTop';
import Dashboard from './components/Dashboard';
import Bookings from './components/Bookings';
import Listings from './components/Listings';
import Profile from './components/Profile';
import Messages from './components/Messages';
import Vehicles from './components/Vehicles';
import AdminDashboard from './components/AdminDashboard';
import {ManagerEditSpace, ManagerApproveEditSpace, ManagerProcessReport} from './CheckDetail';
// create a context object
export const AppContext = React.createContext();
// define the App provider
export const AppProvider = ({ children }) => {
  // save the state of the information
  const [contextState, setContextState] = useState({
    order_rank_way: 0,
    score_rank_way: 0,
    maxPrise: '',
    minPrise: '',
    CarType: '',
    CarPlate: '',
    CarCharge: '',
    CarPicture:'',
    BookWay:'H',
    StartDay: null,
    EndDay: null,
    Carlocation:''
  });
  // refresh the state method
  const updateContextState = (newState) => {
    setContextState((prevState) => ({ ...prevState, ...newState }));
  };
  // return the provider
  return (
    <AppContext.Provider value={{ contextState, updateContextState }}>
      {children}
    </AppContext.Provider>
  );
};

// Main App component
function App() {
  // get the window width
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  // use the effect to get the window width
  useEffect(() => {
    // add an event listener to update the windowWidth state when the window size changes
    const handleResize = () => {
      // update the window width
      setWindowWidth(window.innerWidth);
    };
    // add the event listener
    window.addEventListener('resize', handleResize);
    // clear the event listener to avoid memory leaks
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  // define the layout components for Home page
  // define the layout components for Host page
  // define the layout components for Detail page
  // let layoutComponentHost;
  let LayoutComponentHome;
  let LayoutDetail;
  // if the window width is greater than 800px, use the large layout
  if (windowWidth > 800) {
    // set all the layout components to large layout
    // layoutComponentHost = null;
    LayoutComponentHome = <HomePageLarge/>;
    LayoutDetail = <HomeSpecificLarge/>;
  } 
  // if the window width is less than or equal to 800px, use the small layout
  else {
    // set all the layout components to small layout
    // layoutComponentHost = null;
    LayoutComponentHome = <HomePageSmall/>;;
    LayoutDetail = <HomeSpecificLarge/>;
  }
  // create a catch all route handler 
  const CatchAllRouteHandler = () => {
    // get the current location
    let location = useLocation();
    // if the location is the user login page, render the user login page
    if (location.pathname.endsWith('/userlogin')) {
      return <UserLoginPage />;
    }
    // if the location is the user registration page, render the user registration page
    if (location.pathname.endsWith('/userregist')) {
      return <UserRegistPage />;
    }

    // Handle other cases or redirect to the home page
    return null;
  };
  return(
    <AppProvider>
      <ErrorProvider>
        <GlobalSnackbar/>
          <BrowserRouter>
            <Routes>
                {/* all module route */}
                <Route path="/password" element={<UserLoginPageForgetPassword/>}/> 
                <Route path='/:username/detail/:Spotid/Visa' element={<VisaPayment/>}/>
                <Route path="/adminlogin"  element={<AdminLoginPage/>} />
                <Route path="/adminregist" element={<AdminRegistPage/>} />
                <Route path="/:username/choose" element={<CarSpaceChoice/>} />
                <Route path="/:username/detail/:Spotid/choose" element={<CarSpaceChoice/>} />
                <Route path="/:username/editcar/*" element={null} />
                <Route path="/:username/addcar" element={null} />
                <Route path='/*' element={<CatchAllRouteHandler/>}/>
            </Routes>
            <Routes>
              {/* all real route */}
              <Route path="/admin/:adminid" element={<AdminDashboard/>} />
              <Route path = "/:username/:adminid/:Spotid" element = {<ManagerEditSpace/>} />
              <Route path = "/:username/:adminid/Approve/:Spotid" element = {<ManagerApproveEditSpace/>} />
              <Route path = "/:username/:adminid/Report/:Reportid/:Spotid" element = {<ManagerProcessReport/>} />
              <Route path = "/:username" element={LayoutComponentHome} />
              <Route path = "/:username/createspace" element = {<CreateSpace/>} />
              <Route path = "/:username/editspace/:Spotid" element = {<EditSpace/>} />
              <Route path = '/tourists/detail/*' element={LayoutDetail}/>
              <Route path = '/:username/detail/*' element={LayoutDetail}/>
              {/* DashboardTop as father router */}
              <Route path="/:username/dashboard" element={<DashboardTop />}>
              <Route index element={<Dashboard />} />
              <Route path="bookings" element={<Bookings />} />
              <Route path="listings" element={<Listings />} />
              <Route path="profile" element={<Profile />} />
              <Route path="vehicles" element={<Vehicles />} />
              <Route path="messages" element={<Messages />} />
            </Route>
              {/* Keep the wildcard route to catch all and render Home */}
              <Route path="/*" element={LayoutComponentHome} />
            </Routes>
          </BrowserRouter>
      </ErrorProvider>
    </AppProvider>
  )
}

export default App;
