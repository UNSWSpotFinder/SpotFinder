import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import Rating from '@mui/material/Rating';
import Snackbar from '@mui/material/Snackbar';
import BookingDetailModal from './BookingDetailModal'
import { getMyBookingsInfo, getSpotDetails, cancelBooking, createReport } from './API';
import './Bookings.css';

const Bookings = () => {
  const [showBookingDetailModal, setShowBookingDetailModal] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [myBookingsInfo, setMyBookingsInfo] = useState([]);
  const [spotsInfo, setSpotsInfo] = useState([]);
  const [currentView, setCurrentView] = useState('Current');
  const currentBookings = myBookingsInfo.filter(booking => booking.Status === 'Pending');
  const pastBookings = myBookingsInfo.filter(booking => booking.Status === 'Completed');
  const [selectedBookingID, setSelectedBookingID] = useState(null);
  const [selectedBookingDetails, setSelectedBookingDetails] = useState(null);
  const [selectedSpotInfo, setSelectedSpotInfo] = useState(null);
  const [rating, setRating] = useState(1);
  const navigate = useNavigate();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const handleSnackbarClose = () => setOpenSnackbar(false);

  const [showBookingReportModal, setShowBookingReportModal] = useState(false);
  const [reportContent, setReportContent] = useState('');

  const [showBookingReviewModal, setShowBookingReviewModal] = useState(false);
  const [reviewContent, setReviewContent] = useState('');

  const [selectedSpotID, setSelectedSpotID] = useState(null); // 保存选中的 Spot ID

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

      const spotsDetails = await Promise.all(spotsInfoPromises);
      const structuredSpotsInfo = spotsDetails.map(detail => detail.message || {});
      // console.log('Structured Spots Info:', structuredSpotsInfo);
      
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
    }}

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
    // console.log('Cancel Booking ID:', bookingID);
    setShowCancelConfirm(true);
  };

  // 关闭“取消订单”确认框
  const closeCancelConfirm = () => {
    setShowCancelConfirm(false);
  };
  
  // 打开订单report弹窗
  const openReportModal = (spotID) => {
    setSelectedSpotID(spotID);  // 保存 Spot ID
    console.log("Opening report modal for Spot ID:", spotID);
    setShowBookingReportModal(true);
  };
  // 关闭订单report弹窗
  const closeReportModal=()=>{
    setShowBookingReportModal(false);
  }

  // 打开订单Review弹窗
  const openReviewModal=()=>{
    setShowBookingReviewModal(true);
  }
  // 关闭订单Review弹窗
  const closeReviewModal=()=>{
    setShowBookingReviewModal(false);
  }

  // 取消订单列表项
  const handleCancel = () => {
      cancelBooking(selectedBookingID).then(() => {
        // 成功取消后的操作，例如提示用户，更新状态等
        setSnackbarMessage('Booking cancelled successfully.');
        setOpenSnackbar(true);
        fetchBookingsAndSpots(); // 重新获取预订信息来更新 UI
        setShowCancelConfirm(false);
        setSelectedBookingID(null);// 清除选中的预订 ID
      }).catch(error => {
        // 处理错误，提示用户取消失败
        console.error("Error cancelling the booking:", error);
        setSnackbarMessage('Failed to cancel the booking.');
        setOpenSnackbar(true);
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

  // 上传举报信息
  const handleReportSubmit = () => {
    // console.log('Report Content:', reportContent);
    // console.log('Selected Spot ID:', selectedSpotID);
    if (selectedSpotID && reportContent.trim()) {
      createReport(selectedSpotID, reportContent)
        .then(result => {
          if (result === null) {
            setSnackbarMessage('Report submitted successfully.');
            setOpenSnackbar(true);
          } else {
            // 如果结果不为 null，则抛错误
            throw new Error('Unexpected result: ' + result);
          }
        })
        .catch(error => {
          console.error("Error submitting the report:", error);
          setSnackbarMessage('Failed to submit the report: ' + (error.message || "Unknown error"));
          setOpenSnackbar(true);
        })
        .finally(() => {
          // 无论请求成功还是失败，最后都会执行的代码
          setShowBookingReportModal(false); // 关闭模态框
          setReportContent(''); // 清空报告内容
          setSelectedSpotID(null); // 清空选中的 Spot ID
        });
    } else {
      // 如果报告内容为空，则直接通知用户
      console.log("Missing Spot ID or report content is empty.");
      setSnackbarMessage('Report cannot be empty.');
      setOpenSnackbar(true);
    }
  };
  
  



  // 用于点击链接时执行的函数
  const ClickToFindSpot = (event) => {
    event.preventDefault(); // 阻止链接的默认行为
    const email = localStorage.getItem('email');
    if (email) {
      navigate(`/${email}`); // 使用email值进行导航
    }
  };



  return (
    <div className='dashboard-bookings'>
      {/* 组件的JSX结构 */}
      <div className="button-part">
        <div className='booking-btn'>
          <button
            className={`current-booking-title ${currentView === 'Current' ? 'active' : ''}`}
            onClick={switchToCurrent}
          >
            Current Bookings: {currentBookings.length}
          </button>
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
          {myBookingsInfo.length > 0 ? (currentView === 'Current' ? currentBookings : pastBookings).map((booking, index) => {
            // 根据booking的SpotID找到对应的spot信息
            const spotInfo = spotsInfo.find(spot => spot.ID === booking.SpotID);
            // console.log('Spot Info:', spotInfo);
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
                    <div>
                      <button className='booking-report-btn' onClick={() => openReportModal(spotInfo.ID)}>Report</button>
                      <button className='booking-cancel-btn' onClick={() => openCancelModal(booking.ID)}>Cancel</button>
                    </div>
                  )}
                  {/* 只有当booking.Status为'Completed'时，才显示Review按钮 */}
                  {booking.Status === 'Completed' && (
                    <div>
                      <button className='booking-review-btn' onClick={openReviewModal}>Review</button>
                    </div>  
                  )}
                </div>
              </div>
            );
          }) : (          
        <div className="no-bookings-message">
          <div>You haven't placed any bookings yet.  
            <Link to="#" onClick={ClickToFindSpot}>Find your first spot!</Link>
          </div>
        </div>)}
      </div>
      {/* 显示cancel弹窗 */}
      {showCancelConfirm && (
      <div className='modal-overlay'>
        <div className='modal-content'>
        <div className="orders-modal-header">
          <div className='cancel-confirm-title'>Are you sure to cancel the book?</div>
          <button onClick={closeCancelConfirm} className="close-btn">✖</button>
        </div>
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

      {/* 显示 Booking Report 弹窗 */}
      {showBookingReportModal && (
        <div className='modal-overlay'>
          <div className='modal-content'>
            <div className="orders-modal-header">
              <div className='cancel-confirm-title'>Report your issue</div>
              <button onClick={closeReportModal} className="close-btn">✖</button>
            </div>
            <div> Please write down your reason to report the spot:</div>
            <textarea required
            type="text"
            value={reportContent}
            onChange={(e) => setReportContent(e.target.value)}
            className='reason-input'
            />
            <button onClick={() => handleReportSubmit()} className='report-submit-btn'>Submit</button>
          </div>
        </div>
      )}

      {/* 显示 Booking Review 弹窗 */}
      {showBookingReviewModal && (
        <div className='modal-overlay'>
          <div className='modal-content'>
            <div className="orders-modal-header">
              <div className='cancel-confirm-title'>Spot Review</div>
              <button onClick={closeReviewModal} className="close-btn">✖</button>
            </div>
            <div> Please write down your review of this spot:</div>

            <Rating
              className='rating-stars'
              // name={`unique-rating-${booking.ID}`} 
              value={rating}
              onChange={(event, newValue) => {
                setRating(newValue);
                // TODO:处理评分变化，例如保存评分到服务器
              }}
            />
            <textarea required
            type="text"
            value={reviewContent}
            onChange={(e) => setReviewContent(e.target.value)}
            className='reason-input'
            />
            <button onClick={handleReportSubmit} className='report-submit-btn'>Submit</button>
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
}

export default Bookings;