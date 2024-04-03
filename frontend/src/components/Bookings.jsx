import React, { useEffect, useState } from 'react';
import BookingDetailModal from './BookingDetailModal'
import './Bookings.css';
import { getMyBookingsInfo } from './API';

const Bookings = () => {
  const [showBookingDetailModal, setShowBookingDetailModal] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [mybookingsInfo, setMyBookingsInfo] = useState([]); // 存储获取到的 bookings 信息

    // 获取车辆信息
    useEffect(() => {
      const fetchData = async () => {
        try {
          const data = await getMyBookingsInfo();
          console.log('My Bookings data:', data);
          setMyBookingsInfo(data.cars);
        } catch (error) {
          console.error('Error fetching car info:', error);
        }
      }
      fetchData();
    }, []);


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
        <button className='booking-title'>Current Bookings: 1</button>
        <button className='add-a-new-booking-btn'> Add a new booking</button>
      </div>

      <div className='booking-part'>
        <h3 className='bookings-title'>Bookings</h3>
          {/* 单个booking */}
          <div className='single-booking-info'>
            <div className='picture'><img  alt="Thumbnail" /> </div>

            <div className='space-information'>
              <div className='space-title'>UNSW parking space</div>
              <div className='space-rate'>96</div>
              <div className='space-park-time'>26/2/2024 - 28/2/2024</div>
              <div className='total-cost'>Total cost:$114</div>
              <div className='space-address'>66 Kingsford, Sydney, NSW, 2018</div>
              <div className='space-type'>Indoor lot</div>
              <div className='way-to-access'>Pass Way</div>
            </div>
            <div className='right-btn-part'>
              <button className='booking-detail-btn' onClick={openBookingDetailModal}>Details</button>
              <button className='booking-cancel-btn' onClick={openCancelModal}>Cancel</button>
            </div>
          </div>
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