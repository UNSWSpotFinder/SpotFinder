import React, { useEffect, useState } from 'react';
import { getUserSimpleInfo, cancelBooking, getSpecificCarInfo } from './API';
import Snackbar from '@mui/material/Snackbar';
import './OrdersModal.css';
import './Listings.css';

const OrdersModal = ({ closeOrdersModal, spot, orders, fetchOrders }) => {
  const [bookersInfo, setBookersInfo] = useState({}); 
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [selectedOrderID, setSelectedOrderID] = useState(null); // 用于存储要cancel的order的ID
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageContent, setMessageContent] = useState('');
  const [selectedBookerID, setSelectedBookerID] = useState(null);
  const [selectedBooker, setSelectedBooker] = useState(null);
  const [carsInfo, setCarsInfo] = useState({});

  const [ws, setWs] = useState(null);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

    // 关闭Snackbar
  const handleSnackbarClose = () => setOpenSnackbar(false);

  useEffect(() => {
    // 定义创建WebSocket连接的函数
    const createWebSocketConnection = () => {
      const webSocket = new WebSocket('ws://localhost:8080/ws');

      webSocket.onopen = () => {
        console.log('WebSocket connection established');
        // WebSocket连接建立后的操作，例如发送认证信息等
        webSocket.send(JSON.stringify({ type: 'authenticate', token: localStorage.getItem('token') })); // 发送认证信息
      };

      webSocket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      // 管理WebSocket实例
      setWs(webSocket);
    };

    // 只在组件挂载时创建WebSocket连接
    if (!ws) {
      createWebSocketConnection();
    }

    // 组件卸载时关闭WebSocket连接
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [ws]);

    // 取消订单列表项
  const handleCancel = () => {
    console.log('Cancelling order ID:', selectedOrderID);
    cancelBooking(selectedOrderID).then(() => {
      // 成功取消后的操作，例如提示用户，更新状态等
      setSnackbarMessage('Order cancelled successfully.');
      setOpenSnackbar(true);
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

    // 获取停在某spot的vehicle信息
    const loadCarsInfo = async () => {
      const carsInfoUpdates = {};
      const carRequests = orders.map(order => getSpecificCarInfo(order.CarID)
        .then(info => {
          console.log('Car info:', info.car);
          carsInfoUpdates[order.CarID] = info.car; // 如果成功获取，则存储车辆信息
        })
        .catch(error => {
          carsInfoUpdates[order.CarID] = 'This car has been deleted'; // 如果获取失败，则设置提示信息
        })
      );
  
      await Promise.all(carRequests);
      setCarsInfo(carsInfoUpdates); // 更新状态，存储每个车辆的信息或错误提示
    };

    // 调用该函数
    loadBookersInfo();

    if (orders.length > 0) {
      loadCarsInfo();
    }

    
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

  // 打开发送消息的弹窗
  const openMessageModal = (bookerID,booker) => {
    setSelectedBookerID(bookerID);
    setSelectedBooker(booker);
    setShowMessageModal(true);
  };

  // 关闭发送消息的弹窗
  const closeMessageModal = () => {
    setShowMessageModal(false);
    setMessageContent('');
  };

  const handleSendMessage = () => {
    if (ws && ws.readyState === WebSocket.OPEN && messageContent && selectedBookerID) {
      // 服务器期待的消息格式如下
      const message = {
        type: 'message',
        receiverId: parseInt(selectedBookerID,10),
        content: messageContent,
      };

      ws.send(JSON.stringify(message));

      // console.log(`Message sent to ${selectedBookerID}: ${messageContent}`);
      // 清理操作
      setMessageContent('');
      closeMessageModal();
    } else {
      console.error('WebSocket is not open or no message content.');
    }
  };

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
                  <div className='order-info-spec1'>Start: {start}</div>
                  <div className='order-info-spec1'>End: {end}</div>
                  <div className='order-info-spec2'>Total earning: ${order.Cost}</div>
                  <div className='order-info-spec3'>
                    {carsInfo[order.CarID] 
                      ? (typeof carsInfo[order.CarID] === 'string' 
                          ? carsInfo[order.CarID] 
                          : `${carsInfo[order.CarID].Brand}  ${carsInfo[order.CarID].Plate}`)
                      : 'Loading car information...'
                    }
                  </div>
                  <div className='order-info-spec4'>Current State:{order.Status}</div>
                </div>
                <div className="modal-button-part">
                  <button className='send-msg-btn' onClick={() => openMessageModal(order.BookerID, booker)}>Send a msg</button>
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
          <div className="orders-modal-header">
            <div className='cancel-confirm-title'>Are you sure to cancel the order?</div>
            <button onClick={closeCancelConfirm} className="close-btn">✖</button>
          </div>
          <div className="form-buttons">
            <button onClick={handleCancel} className='cancel-confirm-btn'>Yes</button>
            <button onClick={closeCancelConfirm} className='cancel-cancel-btn'>No</button>
          </div>
        </div>
      </div>
      )}

      {/* 发送消息的弹窗 */}
      {showMessageModal && (
        <div className="message-modal-overlay">
          <div className="message-modal-content">
            <div className="messages-modal-header">
              <div className='send-to-title'>Send to: {bookersInfo[selectedBookerID]?.name || 'Loading...'}</div>
              <button onClick={closeMessageModal} className="close-btn">✖</button>
            </div>
            <input required
              type="text"
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              placeholder="Enter your message here"
              className='message-input'
            />
            <button onClick={handleSendMessage} className='send-msg-confim-btn'>Send</button>
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

export default OrdersModal;