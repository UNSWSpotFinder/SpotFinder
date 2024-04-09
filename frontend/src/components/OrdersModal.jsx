import React, { useEffect, useState } from 'react';
import { getUserSimpleInfo, cancelBooking } from './API';
import './OrdersModal.css';
import './Listings.css';

const OrdersModal = ({ closeOrdersModal, spot, orders, fetchOrders }) => {
  const [bookersInfo, setBookersInfo] = useState({}); 
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [selectedOrderID, setSelectedOrderID] = useState(null); // 用于存储要cancel的order的ID

    // 取消订单列表项
  const handleCancel = () => {
    console.log('Cancelling order ID:', selectedOrderID);
    cancelBooking(selectedOrderID).then(() => {
      // 成功取消后的操作，例如提示用户，更新状态等
      console.log("Order cancelled successfully");
      fetchOrders(); // 
      // 关闭确认框
      setShowCancelConfirm(false);
      // 清除选中的预订 ID
      setSelectedOrderID(null);
    }).catch(error => {
      // 处理错误，提示用户取消失败
      console.error("Error cancelling the booking:", error);
    });
};

  // 打开“取消订单”详情弹窗
  const openCancelModal = (orderID) => {
    setSelectedOrderID(orderID); // 存储当前要取消的预订 ID
    console.log('Cancel order ID:', orderID);
    setShowCancelConfirm(true);
  };

  // 关闭“取消订单”确认框
  const closeCancelConfirm = () => {
    setShowCancelConfirm(false);
  };

  useEffect(() => {
    // 定义一个加载所有用户信息的异步函数
    const loadBookersInfo = async () => {
      const bookersPromises = orders.map(order =>
        getUserSimpleInfo(order.BookerID).then(
          (data) => ({ id: order.BookerID, data: data.message })
        )
      );
      // 等待所有用户信息的Promise完成
      const bookers = await Promise.all(bookersPromises);
      // 创建一个新的对象来存储用户信息
      const bookersData = bookers.reduce((acc, current) => {
        acc[current.id] = current.data;
        return acc;
      }, {});
      setBookersInfo(bookersData); // 更新状态
    };

    // 调用该函数
    loadBookersInfo();
  }, [orders]); // 当orders更新时触发

  // 重设地址格式
  const addr = JSON.parse(spot.SpotAddr);
  const formattedAddr = `${addr.Street}, ${addr.City}, ${addr.State}, ${addr.Postcode}, ${addr.Country}`;

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
        return { start: formattedStart, end: formattedEnd };
      }
    } catch (e) {
      return 'Invalid booking time';
    }
    return 'No booking time available';
  }


  return (
    <div className="orders-modal-overlay">
      <div className="orders-modal-content">
        {/* 标题区域 */}
        <div className="orders-modal-header">
          <div className='current-state-title'>Current Orders</div>
          <button onClick={closeOrdersModal} className="close-btn">✖</button>
        </div>

        {/* 车位信息区域 */}
        <div className="spot-info">
          {/* 左侧的名称、地址和大小信息 */}
          <div className="spot-details">
            <div className='img-container'><img src={spot.Pictures} alt="Spot" className='spot-img'/></div>
            <div>
              <div className='spot-title'>{spot.SpotName}</div>
              <div className='location'>{formattedAddr}</div>
              <div className='spot-size'>Fit to {spot.Size}</div>

            </div>
          </div>
        
          {/* 右侧的通行方式和电费信息 */}
          <div className="spot-access">
            <div className='way-to-access'>{spot.SpotType}</div>
            <div className='way-to-access'>{spot.PassWay}</div>
          </div>
        </div>

        {/* TODO:轮播图 */}
        <div className="carousel-container"></div>
        {/* 遍历orders数组来展示所有相关订单 */}
        {orders.length === 0 ? (
          <div className="no-orders-message">There are no orders yet.</div>
        ) : (
          // 遍历orders数组来展示所有相关订单
          orders.map(order =>{
            const { start, end } = formatBookingTime(order.BookingTime); 
            const booker = bookersInfo[order.BookerID];
            return (
              <div key={order.ID} className="order-info">
                <div className="custome-info">
                  <img src={booker ? booker.avatar : "default-avatar.jpg"} alt="Customer Avatar" className='order-car-img'/>
                  <div>{booker ? booker.name : "Loading..."}</div>
                  <div className='order-hint-msg'>Has rented this spot</div>
                </div>
                <div className="custome-details">
                  <div className='order-info-spec'>Start: {start}</div>
                  <div className='order-info-spec'>End: {end}</div>
                  <div className='order-info-spec'>Total earning: ${order.Cost}</div>
                  <div className='order-info-spec'>Current State:{order.Status}</div>
                  <div className='order-info-spec'>VehicleID: {order.CarID}</div>
                </div>
                <div className="modal-button-part">
                  <button className='send-msg-btn'>Send a msg</button>
                  {order.Status === 'Pending' && (
                    <button className='order-cancel-btn' onClick={() => openCancelModal(order.ID)}>Cancel</button>
                  )}
                  {/* {order.Status === 'Completed' &&(<btn className='order-review-btn'>Review</btn>)} */}
                </div>
              </div>
            );
          })
        )}
      </div>
            {/* 显示cancel弹窗 */}
            {showCancelConfirm && (
            <div className='modal-overlay'>
              <div className='modal-content'>
                <h3>Are you sure to cancel the order?</h3>
                <div className="form-buttons">
                  <button onClick={handleCancel} className='cancel-confirm-btn'>Yes</button>
                  <button onClick={closeCancelConfirm} className='cancel-cancel-btn'>No</button>
                </div>
              </div>
            </div>
      )}
    </div>
  );
};

export default OrdersModal;
