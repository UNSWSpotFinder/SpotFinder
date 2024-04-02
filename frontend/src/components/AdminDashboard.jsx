import React, { useEffect, useState,useContext,useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import { getAllSpots,getAllNotApprovedSpots } from './API';
import '../HomePage.css';
import { useError } from '../API';
import { AppContext } from '../App';


const AdminDashboard = () => {
  const { contextState, updateContextState } = useContext(AppContext);
  let handleLocation = (event)=>{
    updateContextState({
      Carlocation:event.target.value
    });
  }
  const [spots, setSpots] = useState([]);
  const [AppSpots,setAppSpots]=useState([]);
  const [filteredSpot, setfilrerSpot] = useState([]);
  const [filteredSpotApp, setfilrerSpotApp] = useState([]);
  const navigate = useNavigate();
  const { _, setOpenSnackbar } = useError();
  const [isLoading,setIsLoading] = useState(false);
  const [isLoadingApp,setIsLoadingApp]=useState(false);
  const ApproveRef = useRef(null);
  const PublishRef = useRef(null);
  let logout = () => {
    if (localStorage.getItem('token')) {
      localStorage.clear();
      navigate('/');
      setOpenSnackbar({
        severity: 'success',
        message: 'Logout successful',
        timestamp: new Date().getTime(),
      });
    }
  };
  useEffect(()=>{
    let datas=spots;
    let datasApp=AppSpots;
    if (contextState.Carlocation !== '') {
      datas = datas.filter((data) => {
        return data.SpotName.includes(contextState.Carlocation);
      });
      datasApp = datasApp.filter((data) => {
        return data.SpotName.includes(contextState.Carlocation);
      });
    }
    setfilrerSpot(datas);
    setfilrerSpotApp(datasApp);
  },[contextState.Carlocation, spots,AppSpots])
  useEffect(()=>{
    getNewApprove();
    getNewSpot();
  },[]);
  useEffect(() => {
    const apListener = () => {
      const ap = ApproveRef.current;
      if (!isLoadingApp && ap.scrollHeight - ap.scrollTop <= ap.clientHeight) {
        setIsLoadingApp(true);
        console.log("Reached the bottom");
        getNewApprove();
      }
    };
    const scListener = () => {
      const sc = PublishRef.current;
      if (!isLoading && sc.scrollHeight - sc.scrollTop <= sc.clientHeight) {
        setIsLoading(true);
        console.log("Reached the bottom");
        getNewSpot();
      }
    };
    const element = PublishRef.current;
    const element2= ApproveRef.current;
    console.log(element);
    element.addEventListener('scroll', scListener);
    element2.addEventListener('scroll',apListener);

    return () => {
      element.removeEventListener('scroll', scListener);
      element2.removeEventListener('scroll',apListener);
    };
  }, []); 
  const getNewSpot=() =>{
    console.log('ty');
    getAllSpots()
    .then((data) => {
      console.log('o');
      console.log(data);
      const datanow = data.message || [];
      setSpots((prevSpots) => [...prevSpots, ...datanow]); 
      setIsLoading(false);
      // console.log('Spots:', data.message);
      // console.log('Rendering spots:', spots);
      // console.log('Rendering spots:', spots[1].SpotName);
    })
    .catch((error) => {
      console.error('Failed to fetch spots:', error);
    });
  }
  const getNewApprove=()=>{
    getAllNotApprovedSpots()
    .then((data) => {
      console.log('n');
      console.log(data);
      const datanow2 = data.message || [];
      setAppSpots((prevSpots) => [...prevSpots, ...datanow2]); 
      setIsLoadingApp(false);
    })
    .catch((error) => {
      console.error('Failed to fetch spots:', error);
    });
  }
  const goToDetails = (spotId) => {
    navigate(`/admin/${localStorage.getItem('email')}/${spotId}`);
  };
  const goToApprove = (spotId) => {
    navigate(`/admin/${localStorage.getItem('email')}/Approve/${spotId}`);
  }
  return (
    <div className='admin-dashboard'>
      {/* 顶部区域 */}
      <div>
        <div className='Navbar'>
          {/* Logo图像 */}
          <img src='/img/LOGO.svg' alt='logo' className='Applogo'></img>
          <div className='SearchPartsmall-m'>
          {/* 搜索图标 */}
          <img className='searchbtnsmall-m' src='/img/search.png'></img>
          {/* 搜索输入框 */}
          <input
            className='Searchbar'
            placeholder='Search by Spot name'
            value={contextState.Carlocation}
            onChange={handleLocation}
          ></input>
        </div>
          {/* 管理员信息 */}
          <div className='hint-msg'></div>
          {/* 登出按钮 */}
          <button className='button-with-image' onClick={logout}>
            <img
              src='/img/SignOut.svg'
              alt='Sign Out'
              className='sign-out-img'
            />
          </button>
        </div>
      </div>
      {/* 车位列表区域 */}
      <p className='title-for-spot'>Spot to Approve</p>
      <div className='container-half' ref={ApproveRef}>
        {filteredSpotApp.map((spot, index) => (
          <div key={index} className='SpaceOverall manager'>
            <img
              className='spaceimg'
              src={
                spot.Picture.includes('base64,')
                  ? spot.Picture
                  : 'data:image/jpeg;base64,' + spot.Picture
              }
              alt='Spot'
            ></img>
            <div className='info'>
              <div className='right-top'>
                <p className='space-title'>
                  {spot.SpotName + ' ' + spot.SpotType}
                </p>
                <div className='rate-part'>
                  <img
                    src='/img/star.png'
                    className='rate-img'
                    alt='Rate'
                  ></img>
                  <p className='rate-txt'>{spot.Rate}</p>
                </div>
              </div>
              <p className='space-price'>
                {'$' + spot.PricePerHour.toFixed(2) +'/Hour, '+'$' + spot.PricePerDay.toFixed(2) + '/Day'}
              </p>
              <p className='space-price no-mg'>
              {'$' + spot.PricePerWeek.toFixed(2) + '/Week'}
              </p>
              <p className='space-location'>
                {(() => {
                  try {
                    // Assuming the JSON.parse(spot.SpotAddr) is an object with a property you want to display
                    // For example, if it's an object like { "address": "123 Main St." }
                    // you could return the address like so:
                    const add = JSON.parse(spot.SpotAddr);
                    return (
                      add.Street +
                      ', ' +
                      add.City +
                      ', ' +
                      add.State +
                      ', ' +
                      add.Country +
                      ', ' +
                      add.Postcode
                    ); // replace 'address' with the actual property name you want to display
                  } catch (e) {
                    return spot.SpotAddr; // or return some default message or component
                  }
                })()}
              </p>
              <p className='space-type'>Fits a {spot.Size}</p>
              <div className='right-bottom'>
                <div className='order-part'>
                  <img
                    src='/img/booking.png'
                    className='order-times'
                    alt='Orders'
                  ></img>
                  <p className='times'>{spot.OrderNum}</p>
                </div>
                <button
                  className='specific-info'
                  onClick={() => goToApprove(spot.ID)}
                >
                  Process Approve
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredSpotApp.length===0 && (<p className='Appnull'>There aren't any such spots that need to be APPROVED at the moment.</p>)}
      </div>
      <p className='title-for-spot border-given'>Published Car Spot</p>
      <div className='container-all' ref={PublishRef}>
        {filteredSpot.map((spot, index) => (
          <div key={index} className='SpaceOverall manager'>
            <img
              className='spaceimg'
              src={
                spot.Picture.includes('base64,')
                  ? spot.Picture
                  : 'data:image/jpeg;base64,' + spot.Picture
              }
              alt='Spot'
            ></img>
            <div className='info'>
              <div className='right-top'>
                <p className='space-title'>
                  {spot.SpotName + ' ' + spot.SpotType}
                </p>
                <div className='rate-part'>
                  <img
                    src='/img/star.png'
                    className='rate-img'
                    alt='Rate'
                  ></img>
                  <p className='rate-txt'>{spot.Rate}</p>
                </div>
              </div>
              <p className='space-price'>
                {'$' + spot.PricePerHour.toFixed(2) +'/Hour, '+'$' + spot.PricePerDay.toFixed(2) + '/Day'}
              </p>
              <p className='space-price no-mg'>
              {'$' + spot.PricePerWeek.toFixed(2) + '/Week'}
              </p>
              <p className='space-location'>
                {(() => {
                  try {
                    // Assuming the JSON.parse(spot.SpotAddr) is an object with a property you want to display
                    // For example, if it's an object like { "address": "123 Main St." }
                    // you could return the address like so:
                    const add = JSON.parse(spot.SpotAddr);
                    return (
                      add.Street +
                      ', ' +
                      add.City +
                      ', ' +
                      add.State +
                      ', ' +
                      add.Country +
                      ', ' +
                      add.Postcode
                    ); // replace 'address' with the actual property name you want to display
                  } catch (e) {
                    return spot.SpotAddr; // or return some default message or component
                  }
                })()}
              </p>
              <p className='space-type'>Fits a {spot.Size}</p>
              <div className='right-bottom'>
                <div className='order-part'>
                  <img
                    src='/img/booking.png'
                    className='order-times'
                    alt='Orders'
                  ></img>
                  <p className='times'>{spot.OrderNum}</p>
                </div>
                <button
                  className='specific-info'
                  onClick={() => goToDetails(spot.ID)}
                >
                  Check Details
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredSpot.length===0 && (<p className='Appnull'>Sorry, There aren't any such spots.</p>)}
      </div>
    </div>
  );
};

export default AdminDashboard;
