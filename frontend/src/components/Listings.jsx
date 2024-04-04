import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OrdersModal from './OrdersModal'; 
import { getUserInfo, getSpotDetails, getReceivedBookingsInfo } from './API';
import './Listings.css';


const Listings = () => {
  const navigate=useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showOrdersModal, setShowOrdersModal] = useState(false);
  const [spotsInfo, setSpotsInfo] = useState([]); // 存储获取到的 spots 详细信息
  const [receivedBookingsInfo, setReceivedBookingsInfo] = useState([]); // 存储获取到的 received bookings 信息

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUserInfo();
        // 解析 ownedSpot JSON 字符串
        let parsedOwnedSpot = [];
        if (data.message.ownedSpot) {
          const ownedSpotObject = JSON.parse(data.message.ownedSpot);
          if (ownedSpotObject.OwnedSpot) {
            parsedOwnedSpot = ownedSpotObject.OwnedSpot;
            // 并行获取所有 spots 的详细信息
            const spotsDetailsPromises = parsedOwnedSpot.map(spotId => getSpotDetails(spotId));
            const spotsDetails = await Promise.all(spotsDetailsPromises);
            // 更新状态以反映获取到的 spots 信息
            setSpotsInfo(spotsDetails);
            console.log('Spots details:', spotsDetails);
          }
        }
      } catch (error) {
        console.error('Error fetching user info or spots details:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getReceivedBookingsInfo();
        console.log('Received bookings data:', data);
        setReceivedBookingsInfo(data.message);
      } catch (error) {
        console.error('Error fetching received bookings info:', error);
      }
    }
    fetchData();
  }, []);
  

  // 打开删除确认框
  const openDeleteConfirm = () => {
    setShowDeleteConfirm(true);
  };
  
  // 关闭删除确认框
  const closeDeleteConfirm = () => {
    setShowDeleteConfirm(false);
  };

  // TODO:删除列表项
  const handleDelete = () => {
    console.log("Listing deleted");
    // 在这里关闭确认弹窗
    closeDeleteConfirm();
  
    // 显示一个删除成功的提示
    // setSnackbarMessage('Listing deleted successfully!');
    // setOpenSnackbar(true);
  };

    // 打开订单详情弹窗
  const openOrdersModal = () => {
    setShowOrdersModal(true);
  };
  
  // 关闭订单详情弹窗
  const closeOrdersModal = () => {
    setShowOrdersModal(false);
  };


  const goesCreate=()=>{
    navigate('/'+localStorage.getItem('email')+'/createspace');
  }


   // 根据spotID动态生成列表信息的函数
   const renderListings = () => {
    const goesEdit=(event)=>{
      navigate('/'+localStorage.getItem('email')+'/editspace/'+event.target.id);
    }
    return spotsInfo.map((spot, index) => {
      if (spot.message) {
        // 重设地址格式
        const addr = JSON.parse(spot.message.SpotAddr);
        const formattedAddr = `${addr.Street}, ${addr.City}, ${addr.State}, ${addr.Postcode}, ${addr.Country}`;

        return (
          <div className='listing-info' key={index}>
            <div className='picture'>      
              <img src={spot.message.Pictures} alt="Thumbnail" />
            </div>
            <div className='space-information'>
              <div className='spot-title'>{spot.message.SpotName}</div>
              <div className='location'>{formattedAddr}</div>
              <div className='spot-type'>{spot.message.SpotType}</div>
              <div className='way-to-access'>{spot.message.PassWay}</div>
              <div className='spot-current-state'>
                Current state: {spot.message.IsVisible ? 'Unapproved' : 'Approved'}
              </div>
            </div>
            <div className='manipulation-link'>
              <div className='first-line-link'>
                <button className='edit-btn' id={spot.message.ID} onClick={goesEdit}>Edit</button>
                <button className='delete-btn' onClick={openDeleteConfirm}>Delete</button>
              </div>
              <div className='second-line-btn'>
                <button className='check-orders-button' onClick={openOrdersModal}>Check orders</button>
              </div>     
            </div>
            <div className='price'>
              <div className='price-item1'>${spot.message.PricePerWeek} /WEEK</div>
              <div className='price-item2'>${spot.message.PricePerDay} /DAY</div>
              <div className='price-item3'>${spot.message.PricePerHour} /Hour</div>
            </div>
          </div>
        );
      }
      return null;
    });
  };

  return (
    <div className='dashboard-listings'>    
      <div className="button-part">
        <button className='listing-title'>Current Listings: {spotsInfo.length}</button>
        <button className='add-a-spot-btn' onClick={goesCreate}>Lease a new spot</button>
      </div>     
      <div className="list-part">
        <h3 className='listings-title'>Listings</h3>
        {renderListings()}
      </div>

      {/* 显示delete弹窗 */}
      {showDeleteConfirm && (
      <div className='modal-overlay'>
        <div className='modal-content'>
          <h3>Are you sure you want to delete?</h3>
      <div className="form-buttons">
        <button onClick={handleDelete} className='delete-confirm-btn'>Delete</button>
        <button onClick={closeDeleteConfirm} className='delete-cancel-btn'>Cancel</button>
      </div>
    </div>
      </div>
)}
      {/* 显示order弹窗 */}
      {showOrdersModal && (
        <OrdersModal closeOrdersModal={closeOrdersModal} />
      )}
    </div>
  );
}

export default Listings;