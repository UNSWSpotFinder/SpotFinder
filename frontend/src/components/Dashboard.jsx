import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import { getUserInfo } from './API';
import './Dashboard.css';

const Dashboard = () => {
    // 定义初始状态
    const [userInfo, setUserInfo] = useState({
      name: '',
      account: 0,
      earning: 0,
      avatar: 'https://via.placeholder.com/150'
    });

    const navigate = useNavigate(); // 使用useNavigate钩子
  

  // 进入 Dashboard 组件时获取用户信息
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUserInfo();
        // 假设data对象中包含用户信息，你需要调整data的结构以匹配实际返回的结构
        setUserInfo({
          name: data.message.name,
          account: data.message.account, // 这里假设account信息在balance属性中
          earning: data.message.earning,
          avatar: data.message.avatar // 假设这是一个有效的图片URL或base64编码的图片数据
        });
        
        
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };
    fetchData();
  }, []);

    // 用于点击链接时执行的函数
    const ClickToFindSpot = (event) => {
      event.preventDefault(); // 阻止链接的默认行为
      const email = localStorage.getItem('email'); // 从localStorage获取email
      if (email) {
        navigate(`/${email}`); // 使用email值进行导航
      }
    };

  return (
    <div className="dashboard">
      {/* 顶部区域 */}
      <div className='top-info-part'>
        {/* 第一列显示用户头像及账户余额 */}
        <div className="first-column-account">
          <h5>Welcome back, {userInfo.name}</h5>
          <div className='avatar-plus-account-info'>
            <div className='left-avatar-container'>
            <img src={userInfo.avatar} alt='avatar' />
            </div>
            <div className='right-account-container'>
              <div className='title'>Total account balance: </div>
              <div className='number'>${userInfo.account}</div>
              <div className='title'>So far, you've earned: </div>
              <div className='number'>${userInfo.earning}</div>
              <button className='top-up-btn'>Top up</button>
              <button className='withdraw-btn'>Withdraw</button>
            </div>
          </div>
        </div>


        {/* 第二列显示当前预定数量 */}
        <div className='second-column-booking'>
          <h5>My Bookings</h5>
          <div className='booking-number'>1</div>
          <Link to="#" onClick={ClickToFindSpot}>Find a spot</Link>
        </div>

        {/* 第三列显示当前用户的车位数量 */}
        <div className='second-column-booking'>
          <h5>My Listings</h5>
          <div className='listing-number'>1</div>
          {/* TODO:这里需要之后修改链接路由 */}
          <Link to="/home">Lease my spot</Link>
        </div>
      </div>


      {/* 中部Bookings区域 */}
      <div className="second-bookings">
        <h3>Bookings</h3>
        {/* 如果没有bookings就新建一个 */}
        <div className='hint-msg'>
          <div className='first-sentence'>Haven't booked any spots yet? </div>
          {/* 点击跳转页面*/}
          <div className='second-sentence'>
            <Link to="#" onClick={ClickToFindSpot}>Click here</Link> <span>to find a spot!</span>
          </div>  
        </div>
      </div>
      
      {/* 底部Listingss区域 */}
      <div className="third-listings">
        <h3>Listings</h3>
        {/* 如果没有lisings就新建一个 */}
        <div className='hint-msg'>
          <div className='first-sentence'>Haven't tried to lease your spots? </div>
          {/* TODO:这里需要之后修改链接路由*/}
          <div className='second-sentence'>
            <Link to="/home">Click here</Link> <span>to lease your first spot!</span>
          </div>  
        </div>
      </div>
    </div>
  );
};

export default Dashboard;