import React, { useEffect, useState,useContext,useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import { getAllSpots, getAllNotApprovedSpots, callAPIgetAllreport, callAPIsolved } from './API';
import '../HomePage.css';
import { useError } from '../API';
import { AppContext } from '../App';


const AdminDashboard = () => {
  let pageA=1;
  let pageB=1;
  const { contextState, updateContextState } = useContext(AppContext);
  let handleLocation = (event)=>{
    updateContextState({
      Carlocation:event.target.value
    });
  }
  const [reports, setReports] = useState([]);
  const [isLReport,setisreport] = useState(true);
  const [finishedReport,setFinishedReport]=useState(false);
  const [spots, setSpots] = useState([]);
  const [AppSpots,setAppSpots]=useState([]);
  const [filteredSpot, setfilrerSpot] = useState([]);
  const [filteredSpotApp, setfilrerSpotApp] = useState([]);
  const [finishedApp,setfinishedApp]=useState(false);
  const [finishedSpot,setfinishedSpot]=useState(false);
  const navigate = useNavigate();
  const { _, setOpenSnackbar } = useError();
  let isLoading = false;
  let isLoadingApp = false;
  const [isL,setL]=useState(true);
  const [isLApp,setLApp]=useState(true);
  const ApproveRef = useRef(null);
  const ReportRef = useRef(null);
  const PublishRef = useRef(null);
  const getReport=()=>{
    callAPIgetAllreport().then((data) => {
      console.log('n');
      console.log(data)
      const datanow = data.report || [];
      console.log(datanow);
      setReports((prevSpots) => [...prevSpots, ...datanow]); 
      setisreport(false);
      if(data.report===null || data.report.length<=15){
        setFinishedReport(true);
      }
    })
    .catch((error) => {
      console.error('Failed to fetch spots:', error);
      isLoadingApp=false;
      setisreport(false);
    });
  }
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
    let datas = spots;
    let datasApp = AppSpots;
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
    console.log(isLoading);
    console.log(isLoadingApp);
  },[contextState.Carlocation, spots,AppSpots])
  useEffect(() => {
    getNewSpot();
    getNewApprove();
    getReport();
    const rpListener=()=>{
      const rp = ReportRef.current;
      if (!isLReport && rp.scrollHeight - rp.scrollTop <= rp.clientHeight) {
        setisreport(true);
        console.log("Reached the bottom");
        getReport();
      }
    }
    const apListener = () => {
      const ap = ApproveRef.current;
      if (!isLoadingApp && ap.scrollHeight - ap.scrollTop <= ap.clientHeight) {
        isLoadingApp=true;
        setLApp(true);
        console.log("Reached the bottom");
        getNewApprove();
      }
    };
    const scListener = (isLoading) => {
      const sc = PublishRef.current;
      // console.log(sc.scrollHeight - sc.scrollTop);
      // console.log(sc.clientHeight);
      console.log(isLoading);
      if (!isLoading && (sc.scrollHeight - sc.scrollTop <= sc.clientHeight)) {
        isLoading=true;
        setL(true);
        console.log(isLoading);
        console.log("Reached the bottom");
        getNewSpot();
      }
    };
    const element  = PublishRef.current;
    const element2 = ApproveRef.current;
    const element3 = ReportRef.current;
    console.log(element);
    element.addEventListener('scroll', ()=>{scListener(isLoading)});
    element2.addEventListener('scroll',apListener);
    element3.addEventListener('scroll',rpListener);

    return () => {
      element.removeEventListener('scroll', scListener);
      element2.removeEventListener('scroll',apListener);
    };
  }, []); 
  const getNewSpot=() =>{
    console.log('ty');
    getAllSpots(pageB)
    .then((data) => {
      console.log('o');
      console.log(data);
      const datanow = data.message || [];
      setSpots((prevSpots) => [...prevSpots, ...datanow]); 
      pageB = pageB + 1;
      console.log(pageB);
      console.log('Spots:', data.message);
      isLoading=false;
      setL(false);
      if(data.message===null || data.message.length<=15){
        setfinishedSpot(true);
      }
    })
    .catch((error) => {
      console.error('Failed to fetch spots:', error);
      isLoading=false;
      setL(false);
    });
  }
  const getNewApprove=()=>{
    getAllNotApprovedSpots(pageA)
    .then((data) => {
      console.log('n');
      console.log(data);
      const datanow2 = data.message || [];
      setAppSpots((prevSpots) => [...prevSpots, ...datanow2]); 
      pageA+=1;
      isLoadingApp=false;
      setLApp(false);
      if(data.message===null || data.message.length<=15){
        setfinishedApp(true);
      }
    })
    .catch((error) => {
      console.error('Failed to fetch spots:', error);
      isLoadingApp=false;
      setLApp(false);
    });
  }
  const goToDetails = (spotId) => {
    navigate(`/admin/${localStorage.getItem('AdminId')}/${spotId}`);
  };
  const goToApprove = (spotId) => {
    navigate(`/admin/${localStorage.getItem('AdminId')}/Approve/${spotId}`);
  }
  const goToReport = (ReportId,spotId) => {
    navigate(`/admin/${localStorage.getItem('AdminId')}/Report/${ReportId}/${spotId}`);
  }
  const Solved = (ReportId,rep) => {
    rep.IsSolved=!rep.IsSolved;
    callAPIsolved(ReportId);
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
      <p className='title-for-spot'>Overall Systeam Information</p>
      <div className='Data-way'>
        <div className='Data'>
          <div className='circle blue'>
            <p className='circle-text blue-c'>{298}</p>
          </div>
          <p className='DataMeaning blue-c'>Total Spot</p>
        </div>
        <div className='Data'>
          <div className='circle red'>
            <p className='circle-text red-c'>{300}</p>
          </div>
          <p className='DataMeaning red-c'>Total User</p>
        </div>
        <div className='Data'>
          <div className='circle green'>
            <p className='circle-text green-c'>{20}</p>
          </div>
          <p className='DataMeaning green-c'>Total Order</p>
        </div>
        <div className='Data'>
          <div className='circle yellow'>
            <p className='circle-text yellow'>{5}</p>
          </div>
          <p className='DataMeaning yellow-c'>Staff Number</p>
        </div>
        <div className='Data'>
          <div className='circle purple'>
            <p className='circle-text purple'>{992}</p>
          </div>
          <p className='DataMeaning purple-c'>Total Viewer</p>
        </div>
      </div>
      <div className='Total-Earing'>
        <p className='Total-Earing-title'>Earned</p>
        <p className='Total-Earing-content'>$9822.78</p>
        <p className='Total-Earing-content-change'>today</p>
        <p className='changes'>{'(+$243.57)'}</p>
      </div>
      <p className='title-for-spot'>Reported Information</p>
      <div className='container-half' ref={ReportRef}>
        {reports.map((rep, index) => (
          <div key={index} className='SpaceOverall manager'>
            <div className='info-report'>
              <div className='right-top'>
                <p className='space-title'>
                  {rep.Reporter.Name + '  Reported this spot'}
                </p>
              </div>
              <p className='space-email'>
                  {rep.Reporter.Email}
                </p>
              <p className='report-content'>
                {rep.Reason}
              </p>
              <p className='spot-info-label'>
              {'Spot Information'}
              </p>
              <div className='spot-info-details'>
              <p className='spot-name-detail'>{rep.Spot.SpotName}</p>
              <p className='space-location-report'>
              {(() => {
                  try {
                    // Assuming the JSON.parse(spot.SpotAddr) is an object with a property you want to display
                    // For example, if it's an object like { "address": "123 Main St." }
                    // you could return the address like so:
                    const add = JSON.parse(rep.Spot.SpotAddr);
                    return (
                      'located in '+
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
                    return rep.Spot.SpotAddr; // or return some default message or component
                  }
                })()}
              </p>
              </div>

              {/* <p className='space-type'>Fits a {spot.Size}</p> */}
              <div className='right-bottom-report'>
                <button
                  className='specific-info-report'
                  onClick={() => goToReport(rep.ID,rep.Spot.ID)}
                  disabled={rep.IsSolved}
                >
                  Check Report
                </button>
                <button
                  className='specific-info-report solved'
                  onClick={()=>{Solved(rep.ID,rep)}}
                  disabled={rep.IsSolved}
                >
                  {rep.IsSolved ?'Solved':'Mark as Sloved'}
                </button>
              </div>
            </div>
          </div>
        ))}
        {reports.length===0 && !isLReport &&(<p className='Appnull'>{"There aren't any report that need to be SOLVED at the moment."}</p>)}
        {isLReport && !finishedReport && (<p className='Loading'>{"Loading..."}</p>)}
        {finishedReport && (<p className='fin'>{"No more report"}</p>)}
      </div>
      <p className='title-for-spot border-given'>Spot to Approve</p>
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
        {filteredSpotApp.length===0 && !isLApp  && (<p className='Appnull'>{"Sorry, There aren't any such spots."}</p>)}
        {isLApp && !finishedApp && (<p className='Loading'>{"Loading..."}</p>)}
        {finishedApp && (<p className='fin'>{"No more spot"}</p>)}
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
        {filteredSpot.length===0 && !isL  && (<p className='Appnull'>{"Sorry, There aren't any such spots."}</p>)}
        {isL && !finishedSpot && (<p className='Loading'>{"Loading..."}</p>)}
        {finishedSpot && (<p className='fin'>{"No more spot"}</p>)}
      </div>
    </div>
  );
};

export default AdminDashboard;
