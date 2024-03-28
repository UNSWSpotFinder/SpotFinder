import React from 'react';

const BookingDetailModal = ({ closeBookingDetailModal }) => {

    return (
        <div className='booking-detail-modal'>

          <div className='space-title'>UNSW parking space</div>
          <div className='space-address'>66 Kingsford, Sydney, NSW, 2018</div>
          <div className='space-type'>Fit tp SUV/4WD</div>
          <div className='space-info'>space info</div>
          <div>轮播图</div>
          <div className='provider-info'>provider detail
            <div> provider img</div>
            <div className='provider-name'>provider name</div>
          </div>
          <div className='middle-container'>
            <div className='space-park-time'>26/2/2024 - 28/2/2024</div>
            <div className='total-cost'>Total cost:$114</div>
            <div className='vihicle'>Lamborghini</div>

          </div>
          <div className='bottom-container'></div>


        </div>
    )
}

export default BookingDetailModal;