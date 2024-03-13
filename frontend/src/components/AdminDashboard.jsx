import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import { getAllSpots } from './API'
import '../HomePage.css';


const AdminDashboard = () => {
  const [spots, setSpots] = useState([]);
  const navigate = useNavigate();

  // 新增goesSpecific函数
  const goesSpecific = (spotId) => {
    // 将用户导航到spot详情页面的逻辑
    // navigate(`/spot/${spotId}`);
  };

  useEffect(() => {
    getAllSpots().then(data => {
      setSpots(data.message);
      console.log('Spots:', data.message);
      console.log('Rendering spots:', spots);
      console.log('Rendering spots:', spots[1].SpotName);
    })
    .catch(error => {
      console.error('Failed to fetch spots:', error);
    });
  }, []);
  
    const goToDetails = (spotId) => {
      navigate(`/admindashboard/adminid/${spotId}`);
    };




  return (
    <div className='admin-dashboard'>
        {/* 顶部区域 */}
        <div className="dashboard-top">
            <div className="Navbar">
                {/* Logo图像 */}
                <img src='/img/LOGO.svg' alt='logo' className='Applogo'></img>
                <h4>Management system</h4>
                {/* 管理员信息 */}
                <div className='hint-msg'>
                </div>
                {/* 登出按钮 */}
                <button className="button-with-image">
                <img src='/img/SignOut.svg' alt='Sign Out' className='sign-out-img' />
                </button>
            </div>
        </div>
        {/* 车位列表区域 */}
        <div className='container-all'>
          {spots.map((spot, index) => (
            <div key={index} className='SpaceOverall'>
              <img
                className='spaceimg'
                src={'data:image/jpeg;base64,' + spot.Picture || 'img/sample.jpeg'}
                alt="Spot"
              ></img>
              <div className='info'>
                <div className='right-top'>
                  <p className='space-title'>
                    {spot.SpotName + ' ' + spot.SpotType}
                  </p>
                  <div className='rate-part'>
                    <img src='img/star.png' className='rate-img' alt="Rate"></img>
                    <p className='rate-txt'>{spot.Rate}</p>
                  </div>
                </div>
                <p className='space-price'>$38.00/day</p>
                <p className='space-location'>{spot.SpotAddr}</p>
                <p className='space-type'>Fits a {spot.SpotType}</p>
                <div className='right-bottom'>
                  <div className='order-part'>
                    <img src='img/booking.png' className='order-times' alt="Orders"></img>
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
        </div>
    </div>
  );
};


export default AdminDashboard;