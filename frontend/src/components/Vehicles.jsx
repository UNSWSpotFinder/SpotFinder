import React, { useEffect, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import './Vehicles.css';
import { getCarInfo, deleteCar } from './API';
import AddVehicleModal from './AddVehicles';
import EditVehicleModal from './EditVehicles';

const Vehicles = () => {
  const [carsInfo, setCarsInfo] = useState([]); 
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [vehicleBrand, setVehicleBrand] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [vehicleSize, setVehicleSize] = useState('');
  const [vehicleCharge, setVehicleCharge] = useState('');
  const [avatar, setAvatar] = useState('');
  const [editingCarId, setEditingCarId] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteCarId, setDeleteCarId] = useState('');

  // get vehicles info
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCarInfo();
        // console.log('Car data:', data);
        setCarsInfo(data.cars);
      } catch (error) {
        console.error('Error fetching car info:', error);
      }
    }
    fetchData();
  }, []);

  // add vehicle and fresh the page
  const handleVehicleAdded = async () => {
    setIsAddModalOpen(false);
    try {
      const updatedCars = await getCarInfo();
      setCarsInfo(updatedCars.cars);
      setSnackbarMessage('Successfully added a vehicle!');
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error fetching car info:', error);
    }
  };

  // edit vehicle and fresh the page
  const handleVehicleEdited = async () => {
    setIsEditModalOpen(false);
    try {
      const updatedCars = await getCarInfo();
      setCarsInfo(updatedCars.cars);
      setSnackbarMessage('Successfully edited a vehicle!');
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error fetching car info:', error);
    }
  };

  // Open the delete confirmation modal
  const openDeleteConfirm = (car) => {
    setShowDeleteConfirm(true);
    setDeleteCarId(car.ID);
  };
  
  // close the delete confirmation modal
  const closeDeleteConfirm = () => {
    setShowDeleteConfirm(false);
  };

  // close Snackbar
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  // handle delete car info
  const handleDelete = async () => {
    try {
      await deleteCar(deleteCarId);
      setSnackbarMessage('Vehicle deleted successfully!');
      setOpenSnackbar(true);
      closeDeleteConfirm();
  
      // Get the updated list of cars
      const updatedCars = await getCarInfo();
      setCarsInfo(updatedCars.cars);
    } catch (error) {
      console.error('Error deleting car:', error);
      setSnackbarMessage('Vehicle deleted unsuccessfully. Please try again.');
      setOpenSnackbar(true);
    }
  };

  // click the add button and set the model to add mode
  const openAddModal = () => {
    setIsAddModalOpen(true);
    setVehicleBrand('');
    setVehiclePlate('');
    setVehicleType('');
    setVehicleSize('');
    setVehicleCharge('');
    setAvatar(''); 
  };

  const closeAddModal = () => setIsAddModalOpen(false);

  // open edit modal
  const openEditModal = (car) => {
    setIsEditModalOpen(true);
    setEditingCarId(car.ID);
    setVehicleBrand(car.Brand);
    setVehiclePlate(car.Plate);
    setVehicleType(car.Type);
    setVehicleSize(car.Size);
    setVehicleCharge(car.Charge === 'Yes' ? 'Yes' : 'No');
    setAvatar(car.Picture);
  };

  // colse edit modal
  const closeEditModal = () => setIsEditModalOpen(false);

  return (
    <div className='dashboard-vehicles'>
      {/* top button part */}
      <div className="button-part">
        <button className='vehicle-title'>Current Vehicles: {carsInfo.length}</button>
        <button onClick={openAddModal} className='add-a-car-btn'>Add a new vehicle</button>
      </div>
      {/* vehicle part */}
      <div className='vehicle-part'>
        <h3 className='my-vehicle-title'>My vehicles</h3>
        {/* specific car info */}
        {carsInfo.map((car) => (
           <div key={car.ID} className='specific-vehicle'>
           <div className='left-picture'>
             <img className='vehicle-picture' src={car.Picture} alt='Vehicle' />
           </div>
           <div className='middle-info'>
             <div className='vehicle-row'>
               <div className='vehicle-brand'>{car.Brand}</div>
               <div className='vehicle-plate'>{car.Plate}</div>
             </div>
             <div className='vehicle-row'>
               <div className='vehicle-type'>{car.Type}</div>
               <div className='vehicle-size'>{car.Size}</div>
             </div>
             <div className='vehicle-charge'>{car.Charge}</div>
           </div>
           <div className='right-btn-part'>
             <button className='edit-btn' onClick={() => openEditModal(car)}>Edit</button>
             <button className='delete-btn' onClick={() => openDeleteConfirm(car)}>Delete</button>
           </div>
         </div>
       ))}
      </div>

      {/* add/edit spot modal */}
      {isAddModalOpen && 
        (<AddVehicleModal 
          onClose={closeAddModal} 
          onAdded={handleVehicleAdded} 
          closeAddModal={closeAddModal}
          />)}
      {isEditModalOpen && (
        <EditVehicleModal
          onClose={closeEditModal}
          onEdited={handleVehicleEdited}
          EditingCarId={editingCarId}
          VehicleBrand={vehicleBrand}
          VehiclePlate={vehiclePlate}
          VehicleType={vehicleType}
          VehicleSize={vehicleSize}
          VehicleCharge={vehicleCharge}
          Avatar={avatar}
          closeEditModal={closeEditModal}
        />
      )}

      {/* delete confirmation modal */}
      {showDeleteConfirm && (
      <div className='modal-overlay'>
        <div className='modal-content'>
          <h3>Are you sure you want to delete?</h3>
          <div className="form-buttons">
            <button onClick={handleDelete} className='delete-confirm-btn'>Yes, I want to delete.</button>
            <button onClick={closeDeleteConfirm} className='delete-cancel-btn'>No, I want to keep it.</button>
          </div>
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

export default Vehicles;