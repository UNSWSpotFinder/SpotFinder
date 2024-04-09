import React, { useEffect, useState } from 'react';
import Rating from '@mui/material/Rating';
import Snackbar from '@mui/material/Snackbar';
import BookingDetailModal from './BookingDetailModal'
import { getMyBookingsInfo, getSpotDetails, cancelBooking } from './API';
import './Bookings.css';

const Bookings = () => {
  const [showBookingDetailModal, setShowBookingDetailModal] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [myBookingsInfo, setMyBookingsInfo] = useState([]); // 存储获取到的 bookings 信息
  const [spotsInfo, setSpotsInfo] = useState([]); // 存储获取到的 spots 详细信息
  const [currentView, setCurrentView] = useState('Current');   // 新增状态来追踪当前是'Current' 还是 'Past'
  const currentBookings = myBookingsInfo.filter(booking => booking.Status === 'Pending');
  const pastBookings = myBookingsInfo.filter(booking => booking.Status === 'Completed');

  // 用于存储要cancel的booking的ID
  const [selectedBookingID, setSelectedBookingID] = useState(null);
  // 用于存储要显示的booking的详细信息
  const [selectedBookingDetails, setSelectedBookingDetails] = useState(null);
  const [selectedSpotInfo, setSelectedSpotInfo] = useState(null);

  const [rating, setRating] = useState(1); // 设置评分

  // 切换视图的函数
  const switchToCurrent = () => {
    setCurrentView('Current');
  };

  const switchToPast = () => {
    setCurrentView('Past');
  };

  // 获取orders和spots信息
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


  // 获取orders和spots信息
  useEffect(() => {
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
  const openCancelModal = (bookingID) => {
    setSelectedBookingID(bookingID); // 存储当前要取消的预订 ID
    console.log('Cancel Booking ID:', bookingID);
    setShowCancelConfirm(true);
  };

  // 关闭“取消订单”确认框
  const closeCancelConfirm = () => {
    setShowCancelConfirm(false);
  };
  
  // 取消订单列表项
  const handleCancel = () => {
      cancelBooking(selectedBookingID).then(() => {
        // 成功取消后的操作，例如提示用户，更新状态等
        console.log("Booking cancelled successfully");
  
        // 重新获取预订信息来更新 UI
        fetchBookingsAndSpots();

        // 关闭确认框
        setShowCancelConfirm(false);
  
        // 清除选中的预订 ID
        setSelectedBookingID(null);
      }).catch(error => {
        // 处理错误，提示用户取消失败
        console.error("Error cancelling the booking:", error);
      });
    
  };



  // 打开订单详情弹窗
  const openBookingDetailModal = (booking, spot) => {
    // 保存选中的booking和spot信息
    setSelectedBookingDetails(booking); 
    setSelectedSpotInfo(spot);
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
                <button className='booking-detail-btn' onClick={() => openBookingDetailModal(booking, spotsInfo.find(spot => spot.ID === booking.SpotID))}>Details</button>
                  {/* 只有当booking.Status为'Pending'时，才显示Cancel按钮 */}
                  {booking.Status === 'Pending' && (
                    <button className='booking-cancel-btn' onClick={() => openCancelModal(booking.ID)}>Cancel</button>
                  )}
                  {/* 只有当booking.Status为'Completed'时，才显示Review按钮 */}
                  {booking.Status === 'Completed' && (
                    // <button className='booking-review-btn'>Review</button>  
                    <Rating
                    className='rating-stars'
                    name={`unique-rating-${booking.ID}`} // 确保name属性是唯一的
                    value={rating}
                    onChange={(event, newValue) => {
                      setRating(newValue);
                      // 这里可以添加代码来处理评分变化，例如保存评分到服务器
                    }}
                  />         
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
          <BookingDetailModal
            closeBookingDetailModal={closeBookingDetailModal}
            bookingDetails={selectedBookingDetails}
            spotInfo={selectedSpotInfo}
          />
        )}
    </div>
  );
}

export default Bookings;