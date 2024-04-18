import React, { useEffect, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import { useNavigate, Link } from 'react-router-dom'; 
import { getUserInfo, topUpAccount, withdrawAccount, getReceivedBookingsInfo, getMyBookingsInfo } from './API';
import './Dashboard.css';

const Dashboard = () => {
  // the initial state of userInfo
  const [userInfo, setUserInfo] = useState({
    name: '',
    account: 0,
    earning: 0,
    avatar: 'https://via.placeholder.com/150'
  });

  const [isTopUpModalVisible, setIsTopUpModalVisible] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [isWithdrawModalVisible, setIsWithdrawModalVisible] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const navigate = useNavigate();
  const [receivedBookingsInfo, setReceivedBookingsInfo] = useState([]); // store the info of received bookings
  const [myBookingsInfo, setMyBookingsInfo] = useState([]);

  const goesCreateSpot = (event)=>{
    event.preventDefault();
    const user = localStorage.getItem('email');
    navigate('/'+user+'/createspace');
  }

  // get user Info when entering Dashboard
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUserInfo();
        // store spotID
        let parsedOwnedSpot = [];
        if (data.message.ownedSpot) {
          const ownedSpotObject = JSON.parse(data.message.ownedSpot);
          if (ownedSpotObject.OwnedSpot) {
            parsedOwnedSpot = ownedSpotObject.OwnedSpot;
          }
        }
        if(data.message){
          // data contains user information
          setUserInfo({
            name: data.message.Name,
            account: data.message.Account,
            earning: data.message.Earning,
            avatar: data.message.Avatar,
            ownedSpot: parsedOwnedSpot
          });
        }       
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };
    fetchData();
  }, []);

  // close Snackbar
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  // click to link to dashboard
  const ClickToFindSpot = (event) => {
    event.preventDefault();
    const email = localStorage.getItem('email');
    if (email) {
      navigate(`/${email}`);
    }
  };
 
  const handleTopUpInputChange = (event) => {
    setTopUpAmount(event.target.value);
  };

  const handleTopUpSubmit = () => {
    // verify that the input is a valid number
    const amount = parseFloat(topUpAmount);
    if (isNaN(amount) || amount <= 0) {
      setSnackbarMessage('Please enter a valid amount to top up.');
      setOpenSnackbar(true);
      return;
    }
    topUpAccount(amount).then(response => {
      // show message to user
      setSnackbarMessage('Top up successfully!');
      setOpenSnackbar(true);

      setIsTopUpModalVisible(false); // close the topup modal
      setTopUpAmount(''); // reset the topup amount
      // reset userInfo to update the account balance
      setUserInfo(prevState => ({
        ...prevState,
        account: prevState.account + amount,
      }));
    }).catch(error => {
      console.error('Top up failed:', error);
      setSnackbarMessage('Top up failed, please try again.');
      setOpenSnackbar(true);
    });
  };

  // cancel top up
  const handleCancelTopUp = () => {
    setIsTopUpModalVisible(false);
    setTopUpAmount('');
  };

  const showTopUpModal = () => {
    setIsTopUpModalVisible(true);
  };

  // handle withdraw input change
  const handleWithdrawInputChange = (event) => {
    setWithdrawAmount(event.target.value);
  };
  
  // handle withdraw submit
  const handleWithdrawSubmit = () => {
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      setSnackbarMessage('Please enter a valid amount to withdraw.');
      setOpenSnackbar(true);
      return;
    }
      // check whether the withdrawal amount exceeds the account balance
    if (amount > userInfo.account) {
      setSnackbarMessage('Cannot withdraw more than the account balance.');
      setOpenSnackbar(true); 
      return;
  }
    withdrawAccount(amount).then(response => {
      setSnackbarMessage('Withdraw successfully!');
      setOpenSnackbar(true);
      setIsWithdrawModalVisible(false);
      setWithdrawAmount('');
      // to show undated account balance
      setUserInfo(prevState => ({
        ...prevState,
        account: prevState.account - amount,
      }));
    }).catch(error => {
      console.error('Withdraw failed:', error);
      setSnackbarMessage('Withdraw failed, please try again.');
      setOpenSnackbar(true);
    });
  };
  
  // handle cancel withdraw
  const handleCancelWithdraw = () => {
    setIsWithdrawModalVisible(false);
    setWithdrawAmount('');
  };

  // show withdraw modal
  const showWithdrawModal = () => {
    setIsWithdrawModalVisible(true);
  };

  // get received bookings info
  const fetchOrders = async () => {
    try {
      const receivedBookingsData = await getReceivedBookingsInfo();
      setReceivedBookingsInfo(receivedBookingsData.orders);
    } catch (error) {
      console.error('Error fetching received bookings info:', error);
    }
  };

  // initialize received order information
  useEffect(() => {
    fetchOrders();
  }, []);

  // get orders and spots info
  const fetchBookings = async () => {
    try {
      // get user's bookings 
      const bookingDataResult = await getMyBookingsInfo();
      const bookingsArray = bookingDataResult.orders;   
      setMyBookingsInfo(bookingsArray);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  // get bookingsinfo
  useEffect(() => {
    fetchBookings();
  }, []);

  // caculate the number of current bookings
  const pendingBookingsCount = myBookingsInfo.filter(booking => booking.Status === 'Pending').length;

  return (
    <div className="dashboard">
      {/* top */}
      <div className='top-info-part'>
        {/* first column: user avatar and account balance */}
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
        {/* second column: number of current bookings */}

      </div>
      <div className='book-list-info'>
        <div className='second-column-booking'>
            <h5>My Bookings</h5>
            <div className='booking-number'>{pendingBookingsCount}</div>
            <Link to="#" onClick={ClickToFindSpot}>Find a spot</Link>
          </div>

          {/* third column: number of user's spots */}
          <div className='second-column-booking'>
            <h5>My Listings</h5>
            <div className='listing-number'>{receivedBookingsInfo.length}</div>
            <Link to="#" onClick={goesCreateSpot}>Lease my spot</Link>
          </div>
        </div>
      
      {/* top up modal */}
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
        {/* modal of withdraw */}
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
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </div>
  );
};

export default Dashboard;