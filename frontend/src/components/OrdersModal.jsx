import React from 'react';
import './OrdersModal.css';
import './Listings.css';

const OrdersModal = ({ closeOrdersModal }) => {
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
            <div className='spot-title'>North Sydney spot</div>
            <div className='location'>111 Fig Tree La, North Sydney, NSW, 2018, Australia</div>
            <div className='spot-type'>Fit to SUV / 4WD</div>
          </div>
          
          {/* 右侧的通行方式和电费信息 */}
          <div className="spot-access">
            <div className='way-to-access'>Indoor lot</div>
            <div className='way-to-access'>Keys</div>
          </div>
        </div>

        {/* TODO:轮播图 */}
        <div className="carousel-container">
        </div>

        {/* 已租出的订单信息 */}
        <div className="order-info">
          <div className="custome-info">
            <img src="path-to-custome-avatar.jpg" alt="Custome Avatar" className='order-car-img'/>
            <div>Jack Sparrow</div>
            <div className='order-hint-msg'>Has already rented this spot</div>
          </div>
          <div className="custome-details">
            <div className='order-info-spec'>Time: 26/2/2024 - 28/2/2024</div>
            <div className='order-info-spec'>Total earning: $45.00</div>
            <div className='order-info-spec'>Vehicle: Benz E300</div>
          </div>
          <div className="modal-button-part">
            <button className='send-msg-btn'>Send a msg</button>
            <button className='order-cancel-btn'>Cancel</button>
          </div>
        </div>

        {/* 未租出的订单信息 */}
        <div className="order-info">
          <div className="custome-info">
            <img src="path-to-custome-avatar.jpg" alt="Custome Avatar" />
            <div>Barbossa</div>
            <div className='order-hint-msg'>Would like to rent this spot</div>
          </div>
          <div className="custome-details">
            <div className='order-info-spec'>Time: 1/3/2024 - 7/3/2024</div>
            <div className='order-info-spec'>Total earning: $80.00</div>
            <div className='order-info-spec'>Vehicle: Toyota Yaris</div>
          </div>
          <div className="modal-button-part">
            <button className='accept-btn'>Accept</button>
            <button className='order-cancel-btn'>Decline</button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OrdersModal;
