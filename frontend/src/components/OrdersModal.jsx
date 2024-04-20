import React, { useEffect, useState } from 'react';
import { getUserSimpleInfo, cancelBooking, getSpecificCarInfo, getVoucher } from './API';
import Snackbar from '@mui/material/Snackbar';
import './OrdersModal.css';
import './Listings.css';

const OrdersModal = ({ closeOrdersModal, spot, orders, fetchOrders }) => {
  const [bookersInfo, setBookersInfo] = useState({}); 
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [selectedOrderID, setSelectedOrderID] = useState(null); // store the orderID of cancel order
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageContent, setMessageContent] = useState('');
  const [notificationContent, setNotificationContent] = useState('');

  const [selectedBookerID, setSelectedBookerID] = useState(null);
  const [selectedBooker,setSelectedBooker] = useState(null);
  const [carsInfo, setCarsInfo] = useState({});
  const [ws, setWs] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const handleSnackbarClose = () => setOpenSnackbar(false);

  useEffect(() => {
    let webSocket;
    // create a WebSocket connection
    const createWebSocketConnection = () => {
      const webSocket = new WebSocket('ws://longsizhuo.com/ws');

      webSocket.onopen = () => {
        console.log('WebSocket connection established');
        // send authentication information
        webSocket.send(JSON.stringify({ type: 'authenticate', token: localStorage.getItem('token') })); // 发送认证信息
      };

      webSocket.onclose = (event) => {
        if (!event.wasClean) {
          console.log('WebSocket disconnected unexpectedly, attempting to reconnect...');
          setTimeout(createWebSocketConnection, 5000); // try to reconnect after 5 secs
        }
      };

      webSocket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
      // store the WebSocket connection in the state
      setWs(webSocket);
    };

    // create a WebSocket connection when the component is mounted
    if (!ws) {
      createWebSocketConnection();
    }

  // Cleanup on unmount
  return () => {
    if (webSocket) {
      webSocket.onclose = () => {}; // Disable onclose handler to prevent reconnection after unmount
      webSocket.close();
    }
  };
}, [ws]);

  // get voucher code directly
  // useEffect(() => {
  //   getVoucher().then(voucherCode => {
  //     const voucher = voucherCode;
  //     // console.log('Voucher code:', voucher);
  //     // console.log('Voucher code:', voucher.Code)
  //     setVoucher(voucher);
  //   }).catch(voucherError => {
  //     console.error("Failed to fetch voucher:", voucherError);
  //   });
  // }, []);

  // handle cancel order
  const handleCancel = () => {
    cancelBooking(selectedOrderID).then(() => {
      // generate a voucher code for the user
      getVoucher().then(voucherCode => {
        const voucher = voucherCode.Code;
        // set the notification content including the voucher information
        const notificationMessage = `Your order has been cancelled. As a compensation, here is a voucher code for you: ${voucher}`;
        handleSendNotification(notificationMessage,selectedBookerID);

        // User interface feedback
        setSnackbarMessage('Order cancelled and voucher sent.');
        setOpenSnackbar(true);
      }).catch(voucherError => {
        console.error("Failed to fetch voucher:", voucherError);
        setSnackbarMessage('Order cancelled, but failed to send voucher.');
        setOpenSnackbar(true);
      });      


      // prompt user that the updated state
      setShowCancelConfirm(false);
      setSelectedOrderID(null);
      closeOrdersModal();
      setSnackbarMessage('Order cancelled successfully.');
      setOpenSnackbar(true);
      fetchOrders();
    }).catch(error => {
      console.error("Error cancelling the booking:", error);
    });
  };

  // open the cancel order confirm modal
  const openCancelModal = (orderID,BookerID) => {
    setSelectedBookerID(BookerID);
    
    setSelectedOrderID(orderID);
    setShowCancelConfirm(true);
  };

  // close the cancel order confirm modal
  const closeCancelConfirm = () => {
    setShowCancelConfirm(false);
  };

  useEffect(() => {
    // get all bookers simple info
    const loadBookersInfo = async () => {
      const bookersPromises = orders.map(order =>
        getUserSimpleInfo(order.BookerID).then(
          (data) => ({ id: order.BookerID, data: data.message })
        )
      );
      // wait for all promises to complete
      const bookers = await Promise.all(bookersPromises);
      // create a new object to store the user information
      const bookersData = bookers.reduce((acc, current) => {
        acc[current.id] = current.data;
        return acc;
      }, {});
      setBookersInfo(bookersData);
    };

    // get the vehicle information parked at some spot
    const loadCarsInfo = async () => {
      const carsInfoUpdates = {};
      const carRequests = orders.map(order => getSpecificCarInfo(order.CarID)
        .then(info => {
          carsInfoUpdates[order.CarID] = info.car;
        })
        .catch(error => {
          carsInfoUpdates[order.CarID] = 'This car has been deleted';
        })
      ); 
      await Promise.all(carRequests);
      setCarsInfo(carsInfoUpdates);
    };

    loadBookersInfo();

    if (orders.length > 0) {
      loadCarsInfo();
    }

    
  }, [orders]); // triggered when orders are updated

  // parse the address
  const addr = JSON.parse(spot.SpotAddr);
  const formattedAddr = `${addr.Street}, ${addr.City}, ${addr.State}, ${addr.Postcode}, ${addr.Country}`;

  // parse the booking time
  function formatBookingTime(bookingTimeJson) {
    try {
      const bookingTimeArray = JSON.parse(bookingTimeJson);
      if (bookingTimeArray.length > 0) {
        const { startDate, endDate } = bookingTimeArray[0];
        const options = {
          day: '2-digit', month: '2-digit', year: 'numeric',
          hour: '2-digit', minute: '2-digit', hour12: false,
          timeZone: 'UTC' // set UTC time zone
        };
        // Convert and format the time
        const formattedStart = new Date(startDate).toLocaleString('en-AU', options);
        const formattedEnd = new Date(endDate).toLocaleString('en-AU', options);
        return { start: formattedStart, end: formattedEnd };
      }
    } catch (e) {
      return 'Invalid booking time';
    }
    return 'No booking time available';
  }

  // open the message modal
  const openMessageModal = (bookerID,booker) => {
    setSelectedBookerID(bookerID);
    setSelectedBooker(booker);
    setShowMessageModal(true);
  };

  // close the message modal
  const closeMessageModal = () => {
    setShowMessageModal(false);
    setMessageContent('');
  };

  const handleSendMessage = () => {
    if (ws && ws.readyState === WebSocket.OPEN && messageContent && selectedBookerID) {
      // the message format expected by the server
      const message = {
        type: 'message',
        receiverId: parseInt(selectedBookerID,10),
        content: messageContent,
      };

      ws.send(JSON.stringify(message));
      setMessageContent('');
      closeMessageModal();
    } else {
      console.error('WebSocket is not open or no message content.');
    }
  };

  const handleSendNotification = (notificationMessage,selectedBookerID) => {
    if (ws && ws.readyState === WebSocket.OPEN && selectedBookerID && notificationMessage) {
      // the message format expected by the server
      const message = {
        type: 'notification',
        receiverId: parseInt(selectedBookerID, 10),
        content: notificationMessage,
      };
      ws.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not open or no message content.');
    }
  };

  return (
    <div className="orders-modal-overlay">
      <div className="orders-modal-content">
        {/* title part */}
        <div className="orders-modal-header">
          <div className='current-state-title'>Current Orders</div>
          <button onClick={closeOrdersModal} className="close-btn">✖</button>
        </div>
        {/* spot info area */}
        <div className="spot-info">
          {/* left part: title, addr, info  */}
          <div className="spot-details">
            <div className='img-container'><img src={spot.Pictures} alt="Spot" className='spot-img'/></div>
            <div>
              <div className='spot-title'>{spot.SpotName}</div>
              <div className='location'>{formattedAddr}</div>
              <div className='spot-size'>Fit to {spot.Size}</div>
            </div>
          </div>
        
          {/* right part: wat to access and spot type */}
          <div className="spot-access">
            <div className='way-to-access'>{spot.SpotType}</div>
            <div className='way-to-access'>{spot.PassWay}</div>
          </div>
        </div>

        <div className="carousel-container"></div>
        {/* traverse the orders array to display all related orders */}
        {orders.length === 0 ? (
          <div className="no-orders-message">There are no orders yet.</div>
        ) : (
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
                    <button className='order-cancel-btn' onClick={() => openCancelModal(order.ID, order.BookerID)}>Cancel</button>
                  )}
                  {/* {order.Status === 'Completed' &&(<btn className='order-review-btn'>Review</btn>)} */}
                </div>
              </div>
            );
          })
        )}
      </div>
      {/* show cancel modal */}
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

      {/* send msg modal */}
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