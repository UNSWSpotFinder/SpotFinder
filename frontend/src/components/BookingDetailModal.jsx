import React from 'react';
import EventIcon from '@mui/icons-material/Event';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import IconButton from '@mui/material/IconButton';
import './BookingDetailModal.css';

const BookingDetailModal = ({ closeBookingDetailModal }) => {
  const handleScheduleChange = () => {
    console.log('schedule change');
  }

  const handleVehicleChange = () => {
    console.log('vehicle change');
  }

  return (
    <div className="orders-modal-overlay">
      <div className="orders-modal-content">
        {/* 标题区域 */}
        <div className="orders-modal-header">
          <div className='booking-detail-title'>Booking Details</div>
          <button onClick={closeBookingDetailModal} className="close-btn">✖</button>
        </div>

        {/* 车位信息区域 */}
        <div className='spot-info-container'>
          <div className="spot-info-top">
            {/* 左侧的名称、地址、类型、轮播图 */}
            <div className="left-spot-details">
              <div className='spot-title'>UNSW Parking Space</div>
              <div className='location'>66 Kingsford, Sydney, NSW, 2018, Australia</div>
              <div className='spot-type'>Fit to SUV / 4WD</div>
              {/* TODO:轮播图 */}
              <div className="carousel-container"></div>
            </div>
            
            {/* 右侧的provider信息 */}
            <div className="right-provider-info">
              <div className='provider-avatar'>Provider avatar</div>
              <div className='provider-name'>Provider name</div>

            </div>
          </div>
          <div className='spot-info-middle'>
            <div className='booking-period'>
              Time: 26/2/2024-28/2/2024
              <div>
                <IconButton onClick={handleScheduleChange}>
                  <EventIcon /> 
                </IconButton>
              </div>
            </div>
            <div className='booking-total-cost'>Total cost: $114</div>
            <div className='booking-vehicle'>
              Your vehicle: Lamborghini
              <div>
                <IconButton onClick={handleVehicleChange}>
                  <DirectionsCarIcon />
                </IconButton>
              </div>
            </div>

          </div>
          <div className='spot-info-bottom'>
            <div className='way-to-access'>Indoor lot</div>
            <div className='way-to-access'>Keys</div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default BookingDetailModal;
