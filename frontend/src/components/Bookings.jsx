import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import Rating from '@mui/material/Rating';
import Snackbar from '@mui/material/Snackbar';
import BookingDetailModal from './BookingDetailModal'
import { getMyBookingsInfo, getSpotDetails, cancelBooking, createReport, createReview } from './API';
import './Bookings.css';

const Bookings = () => {
  const [showBookingDetailModal, setShowBookingDetailModal] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [myBookingsInfo, setMyBookingsInfo] = useState([]);
  const [spotsInfo, setSpotsInfo] = useState([]);
  const [currentView, setCurrentView] = useState('Current');
  const currentBookings = myBookingsInfo.filter(booking => booking.Status === 'Pending');
  const pastBookings = myBookingsInfo.filter(booking => booking.Status === 'Completed');
  const [selectedBookingID, setSelectedBookingID] = useState(null);
  const [selectedBookingDetails, setSelectedBookingDetails] = useState(null);
  const [selectedSpotInfo, setSelectedSpotInfo] = useState(null);
  const [rating, setRating] = useState(1);
  const navigate = useNavigate();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const handleSnackbarClose = () => setOpenSnackbar(false);

  const [showBookingReportModal, setShowBookingReportModal] = useState(false);
  const [reportContent, setReportContent] = useState('');

  const [showBookingReviewModal, setShowBookingReviewModal] = useState(false);
  const [reviewContent, setReviewContent] = useState('');

  const [selectedSpotID, setSelectedSpotID] = useState(null); // save the ID of chosen Spot

  // switch to current/past bookings
  const switchToCurrent = () => {
    setCurrentView('Current');
  };

  const switchToPast = () => {
    setCurrentView('Past');
  };
  

  // get bookings and spots information
  const fetchBookingsAndSpots = async () => {
    try {
      // get bookings info
      const bookingDataResult = await getMyBookingsInfo();
      const bookingsArray = bookingDataResult.orders;   

      // get all spots info related to bookings
      const spotsInfoPromises = bookingsArray.map(booking => {
        return getSpotDetails(booking.SpotID);
      });

      const spotsDetails = await Promise.all(spotsInfoPromises);
      const structuredSpotsInfo = spotsDetails.map(detail => detail.message || {});
      
      setMyBookingsInfo(bookingsArray);
      setSpotsInfo(structuredSpotsInfo);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // get bookings and spots information
  useEffect(() => {
    fetchBookingsAndSpots();
  }, []);

  // parse address
  function parseAddress(spotAddr) {
    try {
      const address = JSON.parse(spotAddr);
      return `${address.Street}, ${address.City}, ${address.State}, ${address.Country}, ${address.Postcode}`;
    } catch (e) {
      return 'Default Address';
    }}

  // format booking time
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
        // format start and end date
        const formattedStart = new Date(startDate).toLocaleString('en-AU', options);
        const formattedEnd = new Date(endDate).toLocaleString('en-AU', options);
        return `${formattedStart} - ${formattedEnd}`;
      }
    } catch (e) {
      return 'Invalid booking time';
    }
    return 'No booking time available';
  } 

  // open cancel modal
  const openCancelModal = (bookingID) => {
    setSelectedBookingID(bookingID);
    setShowCancelConfirm(true);
  };

  // Close the "Cancel Booking" confirmation dialog
  const closeCancelConfirm = () => {
    setShowCancelConfirm(false);
  };
  
  // open report modal
  const openReportModal = (spotID) => {
    setSelectedSpotID(spotID);
    setShowBookingReportModal(true);
  };

  // Close the "Report Booking" dialog
  const closeReportModal=()=>{
    setShowBookingReportModal(false);
  }

  // open review modal
  const openReviewModal=(bookingID)=>{
    setSelectedBookingID(bookingID);
    setShowBookingReviewModal(true);
  }

  // close the "Review Booking" modal
  const closeReviewModal=()=>{
    setShowBookingReviewModal(false);
  }

  // handle cancel booking
  const handleCancel = () => {
      cancelBooking(selectedBookingID).then(() => {
        setSnackbarMessage('Booking cancelled successfully.');
        setOpenSnackbar(true);
        fetchBookingsAndSpots();
        setShowCancelConfirm(false);
        setSelectedBookingID(null);
      }).catch(error => {
        console.error("Error cancelling the booking:", error);
        setSnackbarMessage('Failed to cancel the booking.');
        setOpenSnackbar(true);
      });
  };

  // Open the booking detail modal
  const openBookingDetailModal = (booking, spot) => {
    setSelectedBookingDetails(booking); 
    setSelectedSpotInfo(spot);
    setShowBookingDetailModal(true);
  };
  
  // close the booking detail modal
  const closeBookingDetailModal = () => {
    setShowBookingDetailModal(false);
  };

  // Submit the report
  const handleReportSubmit = () => {
    if (selectedSpotID && reportContent.trim()) {
      createReport(selectedSpotID, reportContent)
        .then(result => {
          if (result === null) {
            setSnackbarMessage('Report submitted successfully.');
            setOpenSnackbar(true);
          } else {
            throw new Error('Unexpected result: ' + result);
          }
        })
        .catch(error => {
          console.error("Error submitting the report:", error);
          setSnackbarMessage('Failed to submit the report: ' + (error.message || "Unknown error"));
          setOpenSnackbar(true);
        })
        .finally(() => {
          setShowBookingReportModal(false);
          setReportContent('');
          setSelectedSpotID(null);
        });
    } else {
      console.log("Missing Spot ID or report content is empty.");
      setSnackbarMessage('Report cannot be empty.');
      setOpenSnackbar(true);
    }
  };

  // Submit the review
  const handleReviewSubmit = () => {
    if (selectedBookingID && reviewContent.trim()) {
      createReview(selectedBookingID, reviewContent, rating)
        .then(result => {
            setSnackbarMessage('Review submitted successfully.');
            setOpenSnackbar(true);
        })
        .catch(error => {
          console.error("Error submitting the review:", error);
          setSnackbarMessage('Failed to submit the review: ' + (error.message || "Unknown error"));
          setOpenSnackbar(true);
        })
        .finally(() => {
          setShowBookingReviewModal(false); 
          setReviewContent(''); 
          setSelectedBookingID(null);
        });
    } else {
      console.log("Missing Booking ID or review content is empty.");
      setSnackbarMessage('Review cannot be empty.');
      setOpenSnackbar(true);
    }
  }
  
  // click to find spot
  const ClickToFindSpot = (event) => {
    event.preventDefault();
    const email = localStorage.getItem('email');
    if (email) {
      navigate(`/${email}`);
    }
  };

  return (
    <div className='dashboard-bookings'>
      <div className="button-part">
        <div className='booking-btn'>
          <button
            className={`current-booking-title ${currentView === 'Current' ? 'active' : ''}`}
            onClick={switchToCurrent}
          >
            Current Bookings: {currentBookings.length}
          </button>
          <button
            className={`past-booking-title ${currentView === 'Past' ? 'active' : ''}`}
            onClick={switchToPast}
          >
            Past Bookings: {pastBookings.length}
          </button>
        </div>
        <button className='add-a-new-booking-btn' onClick={ClickToFindSpot}> Add a new booking</button>
      </div>
      <div className='booking-part'>
  <h3 className='bookings-title'>{currentView === 'Current' ? 'Current bookings' : 'Past bookings'}</h3>
  {/* when currentView is 'Current'，check whether currentBookings is empty */}
  {currentView === 'Current' && currentBookings.length === 0 ? (
    <div className="no-bookings-message">
      <div>Current, you have no bookings yet.
        <Link to="#" onClick={ClickToFindSpot}>Find your first spot!</Link>
      </div>
    </div>
  ) : currentView === 'Past' && pastBookings.length === 0 ? (
    // when currentView is 'Past'，check whether pastBookings is empty
    <div className="no-bookings-message">
      <div>Current, you have no bookings yet.
        <Link to="#" onClick={ClickToFindSpot}>Find your first spot!</Link>
      </div>
    </div>
  ) : (
    // show the current or past booking list
    (currentView === 'Current' ? currentBookings : pastBookings).map((booking, index) => {
      const spotInfo = spotsInfo.find(spot => spot.ID === booking.SpotID);
      return (
        <div key={booking.ID} className='single-booking-info'>
          <div className='picture'>
            <img src={spotInfo.Pictures} alt="Thumbnail" />
          </div>
          <div className='space-information'>
            <div className='space-title'>{spotInfo.SpotName}</div>
            <div className='space-park-time'>{formatBookingTime(booking.BookingTime)}</div>
            <div className='total-cost'>Total cost: ${booking.Cost}</div>
            <div className='space-address'>{parseAddress(spotInfo?.SpotAddr)}</div>
            <div className='space-type'>{spotInfo.SpotType}</div>
            <div className='way-to-access'>{spotInfo.PassWay}</div>
          </div>
          <div className='right-btn-part'>
            <button className='booking-detail-btn' onClick={() => openBookingDetailModal(booking, spotInfo)}>Detail</button>
            {booking.Status === 'Pending' && (
              <>
                <button className='booking-report-btn' onClick={() => openReportModal(spotInfo.ID)}>Report</button>
                <button className='booking-cancel-btn' onClick={() => openCancelModal(booking.ID)}>Cancel</button>
              </>
            )}
            {booking.Status === 'Completed' && (
              <button className='booking-review-btn' onClick={() => openReviewModal(booking.ID)}>Review</button>
            )}
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
          <div className='cancel-confirm-title'>Are you sure to cancel the book?</div>
          <button onClick={closeCancelConfirm} className="close-btn">✖</button>
        </div>
        <div className="form-buttons">
          <button onClick={handleCancel} className='cancel-confirm-btn'>Yes</button>
          <button onClick={closeCancelConfirm} className='cancel-cancel-btn'>No</button>
        </div>
        </div>
      </div>
      )}

      {/* show booking details modal */}
      {showBookingDetailModal && (
          <BookingDetailModal
            closeBookingDetailModal={closeBookingDetailModal}
            bookingDetails={selectedBookingDetails}
            spotInfo={selectedSpotInfo}
          />
        )}

      {/* show Booking Report modal */}
      {showBookingReportModal && (
        <div className='modal-overlay'>
          <div className='modal-content'>
            <div className="orders-modal-header">
              <div className='cancel-confirm-title'>Report your issue</div>
              <button onClick={closeReportModal} className="close-btn">✖</button>
            </div>
            <div> Please write down your reason to report the spot:</div>
            <textarea required
            type="text"
            value={reportContent}
            onChange={(e) => setReportContent(e.target.value)}
            className='reason-input'
            />
            <button onClick={() => handleReportSubmit()} className='report-submit-btn'>Submit</button>
          </div>
        </div>
      )}

      {/* show Booking Review modal */}
      {showBookingReviewModal && (
        <div className='modal-overlay'>
          <div className='modal-content'>
            <div className="orders-modal-header">
              <div className='cancel-confirm-title'>Spot Review</div>
              <button onClick={closeReviewModal} className="close-btn">✖</button>
            </div>
            <div> Please write down your review of this spot:</div>

            <Rating
              className='rating-stars'
              // name={`unique-rating-${booking.ID}`} 
              value={rating}
              onChange={(event, newValue) => {
                setRating(newValue);
              }}
            />
            <textarea required
            type="text"
            value={reviewContent}
            onChange={(e) => setReviewContent(e.target.value)}
            className='reason-input'
            />
            <button onClick={handleReviewSubmit} className='report-submit-btn'>Submit</button>
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
}

export default Bookings;