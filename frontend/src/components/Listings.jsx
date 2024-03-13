import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import OrdersModal from './OrdersModal'; 
import { getUserInfo, getSpotDetails } from './API';
import './Listings.css';

const Listings = () => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showOrdersModal, setShowOrdersModal] = useState(false);

  const [spotsInfo, setSpotsInfo] = useState([]); // 存储获取到的 spots 详细信息

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUserInfo();
        console.log('User data:', data);
        // 解析 ownedSpot JSON 字符串
        let parsedOwnedSpot = [];
        if (data.message.ownedSpot) {
          const ownedSpotObject = JSON.parse(data.message.ownedSpot);
          if (ownedSpotObject.OwnedSpot) {
            parsedOwnedSpot = ownedSpotObject.OwnedSpot;
            console.log('ParsedOwnedSpot:', parsedOwnedSpot);
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
  }, []); // 依赖数组为空表示这个效果只在组件挂载时执行一次
  

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
    // 可以在这里关闭确认弹窗
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



   // 根据spotID动态生成列表信息的函数
   const renderListings = () => {
    return spotsInfo.map((spot, index) => {
      if (spot.message) {
        return (
          <div className='listing-info' key={index}>
            <div className='picture'>
              {/* 假设 Pictures 字段包含图片 URL */}
              <img src={spot.message.Pictures} alt="Thumbnail" />
            </div>
            <div className='space-information'>
              <div className='spot-title'>{spot.message.SpotName}</div>
              <div className='location'>{spot.message.SpotAddr}</div>
              <div className='spot-type'>{spot.message.SpotType}</div>
              <div className='way-to-access'>{spot.message.PassWay}</div>
            </div>
            <div className='manipulation-link'>
              <div className='first-line-link'>
                <button className='edit-btn'>Edit</button>
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
        <button className='listing-title'>Current Listings: 1</button>
        <button className='add-a-spot-btn'>Lease a new spot</button>
      </div>     
      <div className="list-part">
        <h3 classname='listings-title'>Listings</h3>
        {renderListings()}


        {/* link to add */}
        <div className='hint-msg'>
          {/* TODO:这里需要之后修改链接路由*/}
          <div className='link-to-add'>
            <Link to="/home">Lease a new spot</Link>
          </div>  
        </div>
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