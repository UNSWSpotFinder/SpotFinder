import React from 'react';
import './OrdersModal.css';

const OrdersModal = ({ closeOrdersModal }) => {
  return (
    <div className="orders-modal-overlay">
      <div className="orders-modal-content">
        {/* 标题区域 */}
        <div className="orders-modal-header">
          <div className='current-state-title'>Current State</div>
          <button onClick={closeOrdersModal} className="close-btn">✖</button>
        </div>

        {/* 车位信息区域 */}
        <div className="spot-info">
          {/* 左侧的名称、地址和大小信息 */}
          <div className="spot-details">
            <div>North Sydney spot</div>
            <p>111 Fig Tree La, North Sydney, NSW, 2018, Australia</p>
            <p>Fit to SUV / 4WD</p>
          </div>
          
          {/* 右侧的通行方式和电费信息 */}
          <div className="spot-access">
            <p>Indoor lot</p>
            <p>Keys</p>
          </div>
        </div>

        {/* TODO:轮播图 */}
        <div className="carousel-container">
        </div>

        {/* 已租出的订单信息 */}
        <div className="order-info">
          <div className="renter-info">
            <img src="path-to-renter-avatar.jpg" alt="Renter Avatar" />
            <p>Jack Sparrow</p>
            <p>Has already rented this spot</p>
          </div>
          <div className="rental-details">
            <p>Time: 26/2/2024 - 28/2/2024</p>
            <p>Total earning: $45.00</p>
            <p>Vehicle: Benz E300</p>
          </div>
          <div className="button-part">
            <button>Leave a message</button>
            <button>Cancel this booking</button>
          </div>
        </div>

        {/* 未租出的订单信息 */}
        <div className="order-info">
          <div className="renter-info">
            <img src="path-to-renter-avatar.jpg" alt="Renter Avatar" />
            <p>Barbossa</p>
            <p>Would like to rent this spot</p>
          </div>
          <div className="rental-details">
            <p>Time: 1/3/2024 - 7/3/2024</p>
            <p>Total earning: $80.00</p>
            <p>Vehicle: Toyota Yaris</p>
          </div>
          <div className="button-part">
            <button>Accept</button>
            <button>Decline</button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OrdersModal;
