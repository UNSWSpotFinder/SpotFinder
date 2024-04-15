import React, { useEffect, useState } from 'react';
import './BookingDetailModal.css';
import { getUserSimpleInfo, getSpecificCarInfo } from './API';

const BookingDetailModal = ({ closeBookingDetailModal, bookingDetails, spotInfo }) => {
  const [providerInfo, setProviderInfo] = useState({ avatar: '', name: '' });
  // console.log('Booking Details:', bookingDetails);

  const [carInfo, setCarInfo] = useState(null);
  const [loadingCarInfo, setLoadingCarInfo] = useState(true);

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

  useEffect(() => {
    const fetchProviderInfo = async () => {
      try {
          const providerData = await getUserSimpleInfo(spotInfo.OwnerID);
          setProviderInfo(providerData.message); 
      } catch (error) {
        console.error('Error fetching provider info:', error);
      }
    };
    fetchProviderInfo();
  }, [spotInfo]); 


  // 获取车辆信息
  useEffect(() => {
    const fetchCarInfo = async () => {
      try {
        setLoadingCarInfo(true);
        const response = await getSpecificCarInfo(bookingDetails.CarID);
        console.log('Car Info:', response.car);
        setCarInfo(response.car);
      } catch (error) {
        // 如果发生错误，则假设车辆已被删除
        setCarInfo('This car has been deleted');
      } finally {
        setLoadingCarInfo(false);
      }
    };

    if (bookingDetails.CarID) {
      fetchCarInfo();
    }
  }, [bookingDetails.CarID]);


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
            {/* 左侧的名称、地址、类型、缩略图、轮播图 */}
            <div className="left-spot-details">
              <div className='spot-thumbnail'>
                <img src={spotInfo.Pictures} alt="Thumbnail" />
              </div>
              <div className='spot-title'>{spotInfo.SpotName}</div>
              <div className='spot-address'>{parseAddress(spotInfo.SpotAddr)}</div>
              <div className='spot-type'>Fit to {spotInfo.SpotType}</div>
              <div className='way-to-access'>{spotInfo.PassWay}</div>
              {/* TODO:轮播图 */}
              {/* <div className="carousel-container"></div> */}
            </div>         
            {/* 右侧的provider信息 */}
            <div className="right-provider-info">
              <div className='provider-avatar'>
                <img src={providerInfo.avatar} alt="Provider avatar" />
              </div>
              <div className='provider-name'>Provider:{providerInfo.name}</div>           
            </div>
          </div>
          <div className='spot-info-middle'>
            <div className='booking-period'>{formatBookingTime(bookingDetails.BookingTime)}</div>
            <div className='booking-total-cost'>Total cost:${bookingDetails.Cost}</div>
            <div className='booking-vehicle'>

              {loadingCarInfo
              ? 'Loading car information...'
              : carInfo === 'This car has been deleted'
                ? carInfo
                : ` ${carInfo.Brand}  ${carInfo.Plate}`}
            <div>
          </div>
          </div>
          </div>
          <div className='spot-info-bottom'>
            {/* <div className='way-to-access'>Indoor lot</div>
            <div className='way-to-access'>Keys</div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailModal;