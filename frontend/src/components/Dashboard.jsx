import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import { getUserInfo, topUpAccount, withdrawAccount } from './API';
import './Dashboard.css';

const Dashboard = () => {
    // 定义初始状态
    const [userInfo, setUserInfo] = useState({
      name: '',
      account: 0,
      earning: 0,
      avatar: 'https://via.placeholder.com/150'
    });

    // 控制充值弹窗的显示与否以及充值金额
    const [isTopUpModalVisible, setIsTopUpModalVisible] = useState(false);
    const [topUpAmount, setTopUpAmount] = useState('');
    const [isWithdrawModalVisible, setIsWithdrawModalVisible] = useState(false);
    const [withdrawAmount, setWithdrawAmount] = useState('');

    const navigate = useNavigate();
    const goesCreateSpot = (event)=>{
      event.preventDefault(); // 阻止链接的默认行为
      const user = localStorage.getItem('email');
      navigate('/'+user+'/createspace');
    }

  // 进入 Dashboard 组件时获取用户信息
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUserInfo();
        console.log('data:', data);
        // 解析 ownedSpot JSON 字符串
        let parsedOwnedSpot = [];
        if (data.message.ownedSpot) {
          const ownedSpotObject = JSON.parse(data.message.ownedSpot);
          if (ownedSpotObject.OwnedSpot) {
            parsedOwnedSpot = ownedSpotObject.OwnedSpot;
            console.log('parsedOwnedSpot:', parsedOwnedSpot);
          }
        }
        // 检查头像数据是否存在，并且是否以base64格式开头
        const base64Prefix = 'data:image/jpeg;base64,';
        const avatarData = data.message.avatar;
        const updatedAvatar = avatarData && avatarData.startsWith(base64Prefix)
          ? avatarData
          : `${base64Prefix}${avatarData}`;

        // data对象中包含用户信息
        setUserInfo({
          name: data.message.name,
          account: data.message.account,
          earning: data.message.earning,
          avatar: updatedAvatar,
          ownedSpot: parsedOwnedSpot
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
    const email = localStorage.getItem('email');
    if (email) {
      navigate(`/${email}`); // 使用email值进行导航
    }
  };

    
  const handleTopUpInputChange = (event) => {
    setTopUpAmount(event.target.value);
  };

  const handleTopUpSubmit = () => {
    // 验证输入是否为有效数字
    const amount = parseFloat(topUpAmount);
    if (isNaN(amount) || amount <= 0) {
      // TODO:使用snackbar或其他通知组件显示错误信息
      alert('Please enter a valid amount to top up.'); 
      return;
    }
  
    topUpAccount(amount).then(response => {
      // 处理成功响应，如更新UI或通知用户
      console.log('Top up successful', response);
      setIsTopUpModalVisible(false); // 关闭弹窗
      setTopUpAmount(''); // 重置充值金额
      // 这里更新userInfo状态以反映新的账户余额
      setUserInfo(prevState => ({
        ...prevState,
        account: prevState.account + amount,
      }));
    }).catch(error => {
      console.error('Top up failed:', error);
      alert('Top up failed, please try again.'); // 实际应用中应使用更友好的通知方式
    });
  };

  // 取消充值
  const handleCancelTopUp = () => {
    setIsTopUpModalVisible(false);
    setTopUpAmount('');
  };

  const showTopUpModal = () => {
    setIsTopUpModalVisible(true);
  };


    // 处理提现输入变化
    const handleWithdrawInputChange = (event) => {
      setWithdrawAmount(event.target.value);
    };
  
  // 处理提现提交
  const handleWithdrawSubmit = () => {
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount to withdraw.');
      return;
    }

    withdrawAccount(amount).then(response => {
      console.log('Withdraw successful', response);
      setIsWithdrawModalVisible(false);
      setWithdrawAmount('');
      // 更新userInfo状态以反映新的账户余额
      setUserInfo(prevState => ({
        ...prevState,
        account: prevState.account - amount,
      }));
    }).catch(error => {
      console.error('Withdraw failed:', error);
      alert('Withdraw failed, please try again.');
    });
  };
  
  // 处理提现取消
  const handleCancelWithdraw = () => {
    setIsWithdrawModalVisible(false);
    setWithdrawAmount('');
  };

      // 显示提现弹窗
  const showWithdrawModal = () => {
    setIsWithdrawModalVisible(true);
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
              <div className='number'>${userInfo.account.toFixed(2)}</div>
              <div className='title'>So far, you've earned: </div>
              <div className='number'>${userInfo.earning.toFixed(2)}</div>
              <button className='top-up-btn' onClick={showTopUpModal}>Top up</button>
              <button className='withdraw-btn' onClick={showWithdrawModal}>Withdraw</button>
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
          <Link to="#" onClick={goesCreateSpot}>Lease my spot</Link>
        </div>
      </div>


      {/* 底部Voucher区域 */}
      <div className="second-vouchers">
        <h3>Vouchers</h3>
        <div>You have no vouchers.</div>

      </div>
      

      {/* 充值弹窗 */}
      {isTopUpModalVisible && (
      <div className="modal">
          <div className="modal-content">
              <h5>Please input the number you want to top up:</h5>
              <input
                  type="number"
                  value={topUpAmount}
                  onChange={handleTopUpInputChange}
                  placeholder="Enter amount to top up"
                  className='top-up-input'
              />
              <div className="modal-actions">
                <button onClick={handleTopUpSubmit} className='submit-btn'>Submit</button>
                <button onClick={handleCancelTopUp} className='cancel-btn'>Cancel</button>      
              </div>
          </div>
      </div>
  )}
        {/* 提现弹窗 */}
        {isWithdrawModalVisible && (
        <div className="modal">
          <div className="modal-content">
            <h5>Withdraw From Your Account</h5>
            <input
              type="number"
              value={withdrawAmount}
              onChange={handleWithdrawInputChange}
              placeholder="Enter amount to withdraw"
              className='top-up-input'
            />
            <div className="modal-actions">
            <button onClick={handleWithdrawSubmit} className='submit-btn'>Submit</button>
              <button onClick={handleCancelWithdraw} className='cancel-btn'>Cancel</button>
              
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;