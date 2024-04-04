import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BookingDetailModal from './BookingDetailModal'
import { getMyBookingsInfo, getSpotDetails } from './API';
import Snackbar from '@mui/material/Snackbar';
import './Bookings.css';


const Bookings = () => {
  const [showBookingDetailModal, setShowBookingDetailModal] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [myBookingsInfo, setMyBookingsInfo] = useState([]); // 存储获取到的 bookings 信息
  const [spotsInfo, setSpotsInfo] = useState([]); // 存储获取到的 spots 详细信息

  // 新增状态来追踪当前是'Current' 还是 'Past'
  const [currentView, setCurrentView] = useState('Current');

  // 分类订单
  const currentBookings = myBookingsInfo.filter(booking => booking.Status === 'Pending');
  const pastBookings = myBookingsInfo.filter(booking => booking.Status === 'Complete');

  // 切换视图的函数
  const switchToCurrent = () => {
    setCurrentView('Current');
  };

  const switchToPast = () => {
    setCurrentView('Past');
  };


  // 获取orders和spots信息
  useEffect(() => {
    const fetchBookingsAndSpots = async () => {
      try {
        // 获取预订信息
        const bookingDataResult = await getMyBookingsInfo();
        const bookingsArray = bookingDataResult.orders;
        console.log('My Bookings array:', bookingsArray);
        
        // 获取所有bookings相关的spots信息
        const spotsInfoPromises = bookingsArray.map(booking => {
          return getSpotDetails(booking.SpotID);
        });
  
        // 等待所有spot信息的promises解决
        const spotsDetails = await Promise.all(spotsInfoPromises);
  
        // 储存spots信息
        const structuredSpotsInfo = spotsDetails.map(detail => detail.message || {});
        console.log('Structured Spots Info:', structuredSpotsInfo);
        
        // 设置状态
        setMyBookingsInfo(bookingsArray);
        setSpotsInfo(structuredSpotsInfo);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchBookingsAndSpots();
  }, []);

  // 解析地址
  function parseAddress(spotAddr) {
    try {
      const address = JSON.parse(spotAddr);
      return `${address.Street}, ${address.City}, ${address.State}, ${address.Country}, ${address.Postcode}`;
    } catch (e) {
      return 'Default Address';
    }
  }

  // 解析时间
  function formatBookingTime(bookingTimeJson) {
    try {
      const bookingTimeArray = JSON.parse(bookingTimeJson);
      if (bookingTimeArray.length > 0) {
        const { startDate, endDate } = bookingTimeArray[0];
        // 为格式化函数指定时区选项
        const options = {
          day: '2-digit', month: '2-digit', year: 'numeric',
          hour: '2-digit', minute: '2-digit', hour12: false,
          timeZone: 'UTC' // 指定时区为UTC
        };
        // 转换并格式化时间
        const formattedStart = new Date(startDate).toLocaleString('en-AU', options);
        const formattedEnd = new Date(endDate).toLocaleString('en-AU', options);
        return `${formattedStart} - ${formattedEnd}`;
      }
    } catch (e) {
      return 'Invalid booking time';
    }
    return 'No booking time available';
  }
  

  // 打开“取消订单”详情弹窗
  const openCancelModal = () => {
    setShowCancelConfirm(true);
  };

  // 关闭“取消订单”确认框
  const closeCancelConfirm = () => {
    setShowCancelConfirm(false);
  };
  
  // TODO:取消订单列表项
  const handleCancel = () => {
    console.log("Booking cancel");
    // 在这里关闭确认弹窗
    closeCancelConfirm();
  
    // 显示一个删除cancel的提示
    // setSnackbarMessage('Booking cancel successfully!');
    // setOpenSnackbar(true);
  };



  // 打开订单详情弹窗
  const openBookingDetailModal = () => {
    setShowBookingDetailModal(true);
  };
  
  // 关闭订单详情弹窗
  const closeBookingDetailModal = () => {
    setShowBookingDetailModal(false);
  };


  return (
    <div className='dashboard-bookings'>
      {/* 组件的JSX结构 */}

      <div className="button-part">
        <div className='booking-btn'>
          {/* <button className='current-booking-title'>Current Bookings: {}</button> */}
          <button
            className={`current-booking-title ${currentView === 'Current' ? 'active' : ''}`}
            onClick={switchToCurrent}
          >
            Current Bookings: {currentBookings.length}
          </button>
          {/* <button className='past-booking-title'>Past Bookings: {}</button> */}
          <button
            className={`past-booking-title ${currentView === 'Past' ? 'active' : ''}`}
            onClick={switchToPast}
          >
            Past Bookings: {pastBookings.length}
          </button>
        </div>
        <button className='add-a-new-booking-btn'> Add a new booking</button>
      </div>

      <div className='booking-part'>
      <h3 className='bookings-title'>{currentView === 'Current' ? 'Current Bookings' : 'Past Bookings'}</h3>
          {/* 单个booking */}
          {(currentView === 'Current' ? currentBookings : pastBookings).map((booking, index) => {
            // 根据booking的SpotID找到对应的spot信息
            const spotInfo = spotsInfo.find(spot => spot.ID === booking.SpotID);

            return (
              <div key={booking.ID} className='single-booking-info'>
                <div className='picture'>
                  <img src={spotInfo.Pictures} alt="Thumbnail" />
                </div>

                <div className='space-information'>
                  <div className='space-title'>{spotInfo.SpotName}</div>
                  {/* 格式化日期、地址 */}
                  <div className='space-park-time'>{formatBookingTime(booking.BookingTime)}</div>
                  <div className='total-cost'>Total cost:${booking.Cost}</div>
                  <div className='space-address'>{parseAddress(spotInfo?.SpotAddr)}</div>
                  <div className='space-type'>{spotInfo.SpotType}</div>
                  <div className='way-to-access'>{spotInfo.PassWay}</div>
                </div>
                <div className='right-btn-part'>
                  <button className='booking-detail-btn' onClick={() => openBookingDetailModal(booking.ID)}>Details</button>
                  {/* 只有当booking.Status为'Pending'时，才显示Cancel按钮 */}
                  {booking.Status === 'Pending' && (
                    <button className='booking-cancel-btn' onClick={() => openCancelModal(booking.ID)}>Cancel</button>
                  )}
                </div>
              </div>
            );
          })}







      </div>
      {/* 显示cancel弹窗 */}
      {showCancelConfirm && (
      <div className='modal-overlay'>
        <div className='modal-content'>
          <h3>Are you sure to cancel the book?</h3>
          <div className="form-buttons">
            <button onClick={handleCancel} className='cancel-confirm-btn'>Yes</button>
            <button onClick={closeCancelConfirm} className='cancel-cancel-btn'>No</button>
          </div>
        </div>
      </div>
)}

      {/* 显示booking details 弹窗 */}
      {showBookingDetailModal && (
        <BookingDetailModal closeBookingDetailModal={closeBookingDetailModal} />
      )}
    </div>
  );
}

export default Bookings;