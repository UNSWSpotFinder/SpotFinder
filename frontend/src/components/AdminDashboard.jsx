import React, { useEffect, useState, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import {
  getAllSpots,
  getAllNotApprovedSpots,
  callAPIgetAllreport,
  callAPIsolved,
  callAPIgetNumberManager,
  callAPIgetNumberSpots,
  callAPIgetTotalEarning,
  callAPIgetNumberUser,
  callAPIgetNumberOrders,
  callAPIgetNumberSpotsAv,
  callAPIgetNumberSpotsHd,
  callAPIgetNumberOrdersNow,
  callAPIgetNumberOrdersComp
} from './API';
import '../HomePage.css';
import { useError } from '../API';
import { AppContext } from '../App';
// this is the admin dashboard
const AdminDashboard = () => {
  // get the context state
  const { contextState, updateContextState } = useContext(AppContext);
  // when the location is changed
  let handleLocation = (event) => {
    updateContextState({
      Carlocation: event.target.value,
    });
  };
  // the page number of approved spots
  const [pageA, setPageA] = useState(1);
  // the page number of all spots
  const [pageB, setPageB] = useState(1);
  // all reports
  const [reports, setReports] = useState([]);
  // the report is done or not
  const [isLReport, setisreport] = useState(true);
  // all reports are done or not
  const [finishedReport, setFinishedReport] = useState(false);
  // store all spots
  const [spots, setSpots] = useState([]);
  // store all approved spots
  const [AppSpots, setAppSpots] = useState([]);
  // store all spot meeting the filter
  const [filteredSpot, setfilrerSpot] = useState([]);
  // store all approved spot meeting the filter
  const [filteredSpotApp, setfilrerSpotApp] = useState([]);
  // check all approved spots are done or not
  const [finishedApp, setfinishedApp] = useState(false);
  // check all spots are done or not
  const [finishedSpot, setfinishedSpot] = useState(false);
  // use to navigate
  const navigate = useNavigate();
  // get the error
  const { setOpenSnackbar } = useError();
  // check the page is loading or not
  const [isL, setL] = useState(true);
  // check the page approve is loading or not
  const [isLApp, setLApp] = useState(true);
  // ref the report, approve, publish
  const ApproveRef = useRef(null);
  const ReportRef = useRef(null);
  const PublishRef = useRef(null);
  // check the report is loading or not
  const [reportC, setC] = useState(false);
  // store the total user
  const [totalUser,settotalUser]=useState(0);
  // store the total order, completed order, now order
  const [totalOrder,setOrder]=useState(0);
  const [totalCporder,setCpOrder]=useState(0);
  const [totalNorder,setNOrder]=useState(0);
  // store the total manager, total spot, total available spot, total hd spot
  const [totalManager,setManager]=useState(0);
  const [totalSpot,setSpot]=useState(0);
  const [totalAvailSpot,setAvailSpot]=useState(0);
  const [totalHdSpot,setHdSpot]=useState(0);
  // store the total earning, today earning
  const [totalEarning,settotalEarning]=useState(0);
  const [todayEarning,setTodayEarning]=useState(0);
  // logout function
  let logout = () => {
    // clear the local storage
    if (localStorage.getItem('token')) {
      localStorage.clear();
      navigate('/');
      // set the snackbar
      setOpenSnackbar({
        severity: 'success',
        message: 'Logout successful',
        timestamp: new Date().getTime(),
      });
    }
  };
  // get system data
  useEffect(()=>{
    // get the number of manager
    const getNumberManager = () => {
      callAPIgetNumberManager()
        .then((data) => {
          console.log(data);
          setManager(data.totalManagers);
        })
        .catch((error) => {
          console.error('Failed to fetch spots:', error);
        });
    }
  // get the all number of orders
  const getNumberOrders = () => {
    callAPIgetNumberOrders()
      .then((data) => {
        console.log(data);
        setOrder(data.totalOrders);
      })
      .catch((error) => {
        console.error('Failed to fetch spots:', error);
      });
  }
  // get the all number of completed orders
  const getNumberOrdersComp = () => {
    callAPIgetNumberOrdersComp()
      .then((data) => {
        console.log(data);
        setCpOrder(data.totalOrders);
      })
      .catch((error) => {
        console.error('Failed to fetch spots:', error);
      });
  }
  // get the all number of orders now
  const getNumberOrdersNow = () => {
    callAPIgetNumberOrdersNow()
      .then((data) => {
        console.log(data);
        setNOrder(data.totalOrders);
      })
      .catch((error) => {
        console.error('Failed to fetch spots:', error);
      });
  }
  // get the total user registered
  const getNumberUser = () => {
    callAPIgetNumberUser()
      .then((data) => {
        console.log(data);
        settotalUser(data.totalUsers);
      })
      .catch((error) => {
        console.error('Failed to fetch spots:', error);
      });
  }
  // get the total spots
  const getNumberSpots = () => {
    callAPIgetNumberSpots()
      .then((data) => {
        console.log(data);
        setSpot(data.totalSpots);
      })
      .catch((error) => {
        console.error('Failed to fetch spots:', error);
      });
  }
  // get the total published spots
  const getNumAvSpot=()=>{
    callAPIgetNumberSpotsAv()
    .then((data) => {
      console.log(data);
      setAvailSpot(data.totalSpots)
    })
    .catch((error) => {
      console.error('Failed to fetch spots:', error);
    });
  }
  // get the total disabled spots
  const getNumHdSpot=()=>{
    callAPIgetNumberSpotsHd()
    .then((data) => {
      setHdSpot(data.totalSpots)
      console.log(data);
    })
    .catch((error) => {
      console.error('Failed to fetch spots:', error);
    });
  }
  // get the total earning of the system
  const getTotalEarning=()=>{
    callAPIgetTotalEarning()
    .then((data) => {
      console.log(data);
      settotalEarning(data.totalProfit);
      setTodayEarning(data.dailyCost.TotalCost);
    })
    .catch((error) => {
      console.error('Failed to fetch spots:', error);
    });
  }
  // call the function to show all system data
  getNumberManager();
  getNumberOrders();
  getNumberOrdersComp();
  getNumberOrdersNow();
  getNumberUser();
  getNumberSpots();
  getNumAvSpot();
  getNumHdSpot();
  getTotalEarning();
  },[])
  // when the page load refresh all spot data
  useEffect(() => {
    // filter the spot data when the search bar is changed
    let datas = spots;
    let datasApp = AppSpots;
    // filter the spot data when the search bar is changed
    if (contextState.Carlocation !== '') {
      // get new spots and spots to approve
      datas = datas.filter((data) => {
        return data.SpotName.includes(contextState.Carlocation);
      });
      datasApp = datasApp.filter((data) => {
        return data.SpotName.includes(contextState.Carlocation);
      });
    }
    // update the spot data
    setfilrerSpot(datas);
    setfilrerSpotApp(datasApp);
    // update the spot data
  }, [contextState.Carlocation, spots, AppSpots]);
  // use Effect to get all the report
  useEffect(() => {
    // get all the report
    const getReport = () => {
      callAPIgetAllreport()
        .then((data) => {
          // if the report is empty
          const datanow = data.report || [];
          // sort the report by is solved
          datanow.sort((a, b) => {
            return a.IsSolved - b.IsSolved;
          });
          // update the report data
          setReports(() => [...datanow]);
          // set report is all loaded
          setisreport(false);
          // if no more report set the report is finished
          if (data.report === null || data.report.length <= 15) {
            setFinishedReport(true);
          }
        })
        .catch((error) => {
          console.error('Failed to fetch spots:', error);
          setisreport(false);
        });
    };
    getReport();
  }, [reportC]);
  // use Effect to get all the spot
  useEffect(() => {
    // get all the spot
    const getNewSpot = () => {
      getAllSpots(pageB)
        .then((data) => {
          // if the spot is empty
          const datanow = data.message || [];
          // refresh the spot data
          setSpots((prevSpots) => [...prevSpots, ...datanow]);
          // if the spot is empty set the spot is finished
          if (data.message === null || data.message.length < 15) {
            setfinishedSpot(true);
          }
          // set the spot is all loaded
          setL(false);
          // set the page to the next page
          setPageB(pageB + 1);
        })
        .catch((error) => {
          console.error('Failed to fetch spots:', error);
          setL(false);
        });
    };
    if (isL) {
      getNewSpot();
    }
  }, [isL, pageB]);
  // use Effect to get all the spot to approve
  useEffect(() => {
    // get all the spot to approve
    const getNewApprove = () => {
      getAllNotApprovedSpots(pageA)
        .then((data) => {
          // if the spot is empty
          const datanow2 = data.message || [];
          // refresh the spot data
          setAppSpots((prevSpots) => [...prevSpots, ...datanow2]);
          // if no more spot set the spot is finished
          if (data.message === null || data.message.length < 15) {
            setfinishedApp(true);
          }
          // set the spot is all loaded
          setLApp(false);
          // set the page to the next page
          setPageA(pageA + 1);
        })
        .catch((error) => {
          console.error('Failed to fetch spots:', error);
          setLApp(false);
        });
    };
    // if the spot is not loading
    if (isLApp) {
      // get the spot to approve
      getNewApprove();
    }
  }, [isLApp, pageA]);
  // use Effect to define all the event listener
  useEffect(() => {
    // this is to fetch more data when the report is scrolled to the bottom
    const rpListener = () => {
      const rp = ReportRef.current;
      if (!isLReport && rp.scrollHeight - rp.scrollTop <= rp.clientHeight) {
        setisreport(true);
        console.log('Reached the bottom');
      }
    };
    // this is to fetch more data when the not published spot is scrolled to the bottom
    const apListener = () => {
      const ap = ApproveRef.current;
      if (!isLApp && ap.scrollHeight - ap.scrollTop <= ap.clientHeight) {
        setLApp(true);
        console.log('Reached the bottom');
      }
    };
    // this is to fetch more data when the published spot is scrolled to the bottom
    const scListener = () => {
      const sc = PublishRef.current;
      if (!isL && sc.scrollHeight - sc.scrollTop <= sc.clientHeight) {
        setL(true);
        console.log('Reached the bottom');
      }
    };
    // get the element
    const element = PublishRef.current;
    const element2 = ApproveRef.current;
    const element3 = ReportRef.current;
    // add the event listener to the element
    element.addEventListener('scroll', scListener);
    element2.addEventListener('scroll', apListener);
    element3.addEventListener('scroll', rpListener);
    // remove the event listener when the component is unmounted
    return () => {
      element.removeEventListener('scroll', scListener);
      element2.removeEventListener('scroll', apListener);
    };
  }, [isL, isLApp, isLReport]);
  // go to the details page
  const goToDetails = (spotId) => {
    navigate(`/admin/${localStorage.getItem('AdminId')}/${spotId}`);
  };
  // go to the approve page
  const goToApprove = (spotId) => {
    navigate(`/admin/${localStorage.getItem('AdminId')}/Approve/${spotId}`);
  };
  // go to the report page
  const goToReport = (ReportId, spotId) => {
    navigate(
      `/admin/${localStorage.getItem('AdminId')}/Report/${ReportId}/${spotId}`
    );
  };
  // when a report is solved
  const Solved = (ReportId, rep) => {
    // call the api to solve the report
    callAPIsolved(ReportId).then(() => {
      // set the report is solved
      rep.IsSolved = !rep.IsSolved;
      // set the report is changed
      setC(!reportC);
      // set the snackbar is open
      setOpenSnackbar({
        severity: 'success',
        message: 'Solved successful',
        timestamp: new Date().getTime()
      })
    }).catch((error) => {
      // set the snackbar is open
      setOpenSnackbar({
        severity: 'error',
        message: 'Solved failed',
        timestamp: new Date().getTime()
      })
    });
  };
  return (
    <div className='admin-dashboard'>
      {/* 顶部区域 */}
      <div>
        <div className='Navbar'>
          {/* Logo图像 */}
          <img src='/img/LOGO.svg' alt='logo' className='Applogo'></img>
          <div className='SearchPartsmall-m'>
            {/* 搜索图标 */}
            <img
              className='searchbtnsmall-m'
              src='/img/search.png'
              alt=''
            ></img>
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
            <p className='circle-text blue-c'>{totalSpot}</p>
          </div>
          <p className='DataMeaning blue-c'>Total Spot</p>
        </div>
        <div className='Data'>
          <div className='circle blue-heavy'>
            <p className='circle-text blue-heavy-c'>{totalAvailSpot}</p>
          </div>
          <p className='DataMeaning blue-heavy-c'>Available Spot</p>
        </div>
        <div className='Data'>
          <div className='circle blue-small'>
            <p className='circle-text blue-small-c'>{totalHdSpot}</p>
          </div>
          <p className='DataMeaning blue-small-c'>Hidden Spot</p>
        </div>
        <div className='Data'>
          <div className='circle green'>
            <p className='circle-text green-c'>{totalOrder}</p>
          </div>
          <p className='DataMeaning green-c'>Total Order</p>
        </div>
        <div className='Data'>
          <div className='circle green-heavy'>
            <p className='circle-text green-heavy-c'>{totalCporder}</p>
          </div>
          <p className='DataMeaning green-heavy-c'>Complete Order</p>
        </div>
        <div className='Data'>
          <div className='circle green-small'>
            <p className='circle-text green-small-c'>{totalNorder}</p>
          </div>
          <p className='DataMeaning green-small-c'>Ongoing Order</p>
        </div>
      </div>
      <div className='Data-way'>
        <div className='Data'>
            <div className='circle red'>
              <p className='circle-text red-c'>{totalUser}</p>
            </div>
            <p className='DataMeaning red-c'>User Number</p>
          </div>
        <div className='Data'>
          <div className='circle purple'>
            <p className='circle-text purple-c'>{totalManager}</p>
          </div>
          <p className='DataMeaning purple-c'>Staff Number</p>
        </div>
      </div>
      <div className='Total-Earing'>
        <p className='Total-Earing-title'>Earned</p>
        <p className='Total-Earing-content'>${totalEarning.toFixed(2)}</p>
        <p className='Total-Earing-content-change'>today</p>
        <p className='changes'>{'(+$'+todayEarning.toFixed(2)+')'}</p>
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
              <p className='space-email'>{rep.Reporter.Email}</p>
              <p className='report-content'>{rep.Reason}</p>
              <p className='spot-info-label'>{'Spot Information'}</p>
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
                        'located in ' +
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
                  onClick={() => goToReport(rep.ID, rep.Spot.ID)}
                  disabled={rep.IsSolved}
                >
                  Check Report
                </button>
                <button
                  className='specific-info-report solved'
                  onClick={() => {
                    Solved(rep.ID, rep);
                  }}
                  disabled={rep.IsSolved}
                >
                  {rep.IsSolved ? 'Solved' : 'Mark as Sloved'}
                </button>
              </div>
            </div>
          </div>
        ))}
        {reports.length === 0 && !isLReport && (
          <p className='Appnull'>
            {"There aren't any report that need to be SOLVED at the moment."}
          </p>
        )}
        {isLReport && !finishedReport && (
          <p className='Loading'>{'Loading...'}</p>
        )}
        {finishedReport && <p className='fin'>{'No more report'}</p>}
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
                {'$' +
                  spot.PricePerHour.toFixed(2) +
                  '/Hour, ' +
                  '$' +
                  spot.PricePerDay.toFixed(2) +
                  '/Day'}
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
        {filteredSpotApp.length === 0 && !isLApp && (
          <p className='Appnull'>{"Sorry, There aren't any such spots."}</p>
        )}
        {isLApp && !finishedApp && <p className='Loading'>{'Loading...'}</p>}
        {finishedApp && <p className='fin'>{'No more spot'}</p>}
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
                {'$' +
                  spot.PricePerHour.toFixed(2) +
                  '/Hour, ' +
                  '$' +
                  spot.PricePerDay.toFixed(2) +
                  '/Day'}
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
        {filteredSpot.length === 0 && !isL && (
          <p className='Appnull'>{"Sorry, There aren't any such spots."}</p>
        )}
        {isL && !finishedSpot && <p className='Loading'>{'Loading...'}</p>}
        {finishedSpot && <p className='fin'>{'No more spot'}</p>}
      </div>
    </div>
  );
};

export default AdminDashboard;
