import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import OrdersModal from './OrdersModal'; 
import { getUserInfo, getSpotDetails, getReceivedBookingsInfo } from './API';
import './Listings.css';

const Listings = () => {
  const navigate=useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showOrdersModal, setShowOrdersModal] = useState(false);
  const [spotsInfo, setSpotsInfo] = useState([]); 
  const [receivedBookingsInfo, setReceivedBookingsInfo] = useState([]);
  const [selectedSpotId, setSelectedSpotId] = useState(null);
  const [ordersForSelectedSpot, setOrdersForSelectedSpot] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUserInfo();
        // parsed OwnedSpot
        let parsedOwnedSpot = [];
        if (data.message.OwnedSpot) {
          const ownedSpotObject = JSON.parse(data.message.OwnedSpot);
          if (ownedSpotObject.OwnedSpot) {
            parsedOwnedSpot = ownedSpotObject.OwnedSpot;
            // get all spots' details in parallel
            const spotsDetailsPromises = parsedOwnedSpot.map(spotId => getSpotDetails(spotId));
            const spotsDetails = await Promise.all(spotsDetailsPromises);
            setSpotsInfo(spotsDetails);
          }
        }
      } catch (error) {
        console.error('Error fetching user info or spots details:', error);
      }
    };
    fetchData();
  }, []);

  // get orders info
  const fetchOrders = async () => {
    try {
      const receivedBookingsData = await getReceivedBookingsInfo();
      setReceivedBookingsInfo(receivedBookingsData.orders);
    } catch (error) {
      console.error('Error fetching received bookings info:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);
  
  // open delete confirm
  const openDeleteConfirm = () => {
    setShowDeleteConfirm(true);
  };
  
  // close delete confirm
  const closeDeleteConfirm = () => {
    setShowDeleteConfirm(false);
  };

  // handle delete
  const handleDelete = () => {
    closeDeleteConfirm();
  };

  // open orders modal
  const openOrdersModal = (spot) => {
    const ordersForSpot = receivedBookingsInfo.filter(order => order.SpotID === spot.ID);
    setSelectedSpotId(spot.ID);
    setOrdersForSelectedSpot(ordersForSpot);
    setShowOrdersModal(true);
  };
  
  // close orders modal
  const closeOrdersModal = () => {
    setShowOrdersModal(false);
  };

  const goesCreate=()=>{
    navigate('/'+localStorage.getItem('email')+'/createspace');
  }
  const createSpacePath = `/${localStorage.getItem('email')}/createspace`;

  //  generate the listing information based on the spotID
   const renderListings = () => {
    const goesEdit=(event)=>{
      navigate('/'+localStorage.getItem('email')+'/editspace/'+event.target.id);
    }
    if (spotsInfo.length === 0) {
      // No spots available, show a message and a link to create a new spot
      return (
        <div className="no-spots-message">
          <p>Currently, you have not listed any spots. <Link to={createSpacePath}>List your first spot.</Link></p>
        </div>
      );
    } else { 
    return spotsInfo.map((spot, index) => {
      if (spot.message) {
        // parse the address object
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
                <button className='delete-btn' onClick={() => openDeleteConfirm(spot.message.ID)}>Delete</button>
              </div>
              <div className='second-line-btn'>
              <button className='check-orders-button' onClick={() => openOrdersModal(spot.message)}>Check orders</button>
              </div>     
            </div>
            <div className='price'>
              <div className='price-item1'>${spot.message.PricePerHour} /Hour</div>
              <div className='price-item2'>${spot.message.PricePerDay} /DAY</div>
              <div className='price-item3'>${spot.message.PricePerWeek} /WEEK</div>
            </div>
          </div>
        );
      }
      return null;
    });}
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
      {/* show delete modal */}
      {showDeleteConfirm && (
      <div className='modal-overlay'>
        <div className='modal-content'>
        <div className="orders-modal-header">
          <div className='delete-confirm-title'>Are you sure to delete this spot?</div>
          <button onClick={closeDeleteConfirm} className="close-btn">✖</button>
        </div>          
      <div className="form-buttons">
        <button onClick={handleDelete} className='delete-confirm-btn'>Delete</button>
        <button onClick={closeDeleteConfirm} className='delete-cancel-btn'>Cancel</button>
      </div>
    </div>
      </div>
)}
      {/* show order modal */}
      {showOrdersModal && (
        <OrdersModal
          closeOrdersModal={closeOrdersModal}
          spot={spotsInfo.find(spot => spot.message.ID === selectedSpotId)?.message}
          orders={ordersForSelectedSpot}
          fetchOrders={fetchOrders}
        />
      )}
    </div>
  );
}

export default Listings;