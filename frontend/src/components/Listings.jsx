import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OrdersModal from './OrdersModal'; 
import { getUserInfo, getSpotDetails, getReceivedBookingsInfo } from './API';
import './Listings.css';


const Listings = () => {
  const navigate=useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showOrdersModal, setShowOrdersModal] = useState(false);
  const [spotsInfo, setSpotsInfo] = useState([]); // store spots info
  const [receivedBookingsInfo, setReceivedBookingsInfo] = useState([]); // store received bookings info

  const [selectedSpotId, setSelectedSpotId] = useState(null); // current selected spotID
  const [ordersForSelectedSpot, setOrdersForSelectedSpot] = useState([]); // orders for the selected spot

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUserInfo();
        // parse ownedSpot JSON string
        let parsedOwnedSpot = [];
        if (data.message.ownedSpot) {
          const ownedSpotObject = JSON.parse(data.message.ownedSpot);
          if (ownedSpotObject.OwnedSpot) {
            parsedOwnedSpot = ownedSpotObject.OwnedSpot;
            // get details of all spots in parallel
            const spotsDetailsPromises = parsedOwnedSpot.map(spotId => getSpotDetails(spotId));
            const spotsDetails = await Promise.all(spotsDetailsPromises);
            // set spots info
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

  // update received bookings info
  const fetchOrders = async () => {
    try {
      const receivedBookingsData = await getReceivedBookingsInfo();
      console.log('ReceivedBookingsInfo:', receivedBookingsData.orders);
      setReceivedBookingsInfo(receivedBookingsData.orders);
    } catch (error) {
      console.error('Error fetching received bookings info:', error);
    }
  };

  // initialize the received bookings info
  useEffect(() => {
    fetchOrders();
  }, []);
  

  // open the delete confirm modal
  const openDeleteConfirm = () => {
    setShowDeleteConfirm(true);
  };
  
  // close the delete confirm modal
  const closeDeleteConfirm = () => {
    setShowDeleteConfirm(false);
  };

  // TODO:handle delete listing
  const handleDelete = () => {
    console.log("Listing deleted");
    closeDeleteConfirm();
    // setSnackbarMessage('Listing deleted successfully!');
    // setOpenSnackbar(true);
  };

  // 打开订单详情弹窗
  // the modal of order details
  const openOrdersModal = (spot) => {
    console.log('receivedBookingsInfo:', receivedBookingsInfo);
    const ordersForSpot = receivedBookingsInfo.filter(order => order.SpotID === spot.ID);
    setSelectedSpotId(spot.ID); // set the current selected spotID
    setOrdersForSelectedSpot(ordersForSpot);
    setShowOrdersModal(true); 
  };
  
  // close the modal of order details
  const closeOrdersModal = () => {
    setShowOrdersModal(false);
  };

  const goesCreate=()=>{
    navigate('/'+localStorage.getItem('email')+'/createspace');
  }


   // render listings based on spotID
   const renderListings = () => {
    const goesEdit=(event)=>{
      navigate('/'+localStorage.getItem('email')+'/editspace/'+event.target.id);
    }
    return spotsInfo.map((spot, index) => {
      if (spot.message) {
        // reset the address format
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

      {/* show the modal of deleting */}
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
      {/* show the modal of orders */}
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