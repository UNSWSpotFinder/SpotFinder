import React, { useEffect, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import { IconButton } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import './Vehicles.css';
import { getCarInfo } from './API';
import { useNavigate } from 'react-router-dom';
import AddVehicleModal from './AddVehicles';
import EditVehicleModal from './EditVehicles';

const Vehicles = () => {
  const [carsInfo, setCarsInfo] = useState([]); // 存储获取到的 cars 详细信息

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


  // 获取车辆信息
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCarInfo();
        console.log('Car data:', data);
        setCarsInfo(data.cars);
      } catch (error) {
        console.error('Error fetching car info:', error);
      }
    }
    fetchData();
  }, []);

  // 车辆添加后刷新页面
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

  // 车辆修改后刷新页面
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



  // 打开删除确认弹窗
  const openDeleteConfirm = () => {
    setShowDeleteConfirm(true);
  };
  
  // 关闭删除确认弹窗
  const closeDeleteConfirm = () => {
    setShowDeleteConfirm(false);
  };




  // 关闭Snackbar
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };



  // TODO:处理删除车辆信息
  const handleDelete = () => {
    console.log("Vehicle deleted");
  
    // 可以在这里关闭确认弹窗
    closeDeleteConfirm();
  
    // 显示一个删除成功的提示
    setSnackbarMessage('Vehicle deleted successfully!');
    setOpenSnackbar(true);
  };
  


  // 点击add按钮，设置model为add模式 打开模态框时，重置所有表单字段
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


  // 点击edit按钮
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

  // 关闭edit弹窗
  const closeEditModal = () => setIsEditModalOpen(false);;

    

  return (
    <div className='dashboard-vehicles'>
      {/* 上方按钮部分 */}
      <div className="button-part">
        <button className='vehicle-title'>Current Vehicles: {carsInfo.length}</button>
        <button onClick={openAddModal} className='add-a-car-btn'>Add a new vehicle</button>

      </div>
      {/* 下方车辆部分 */}
      <div className='vehicle-part'>
        <h3 className='my-vehicle-title'>My vehicles</h3>
        {/* 某个具体车辆部分 */}
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

      {/* add/edit spot弹窗 */}
      {isAddModalOpen && <AddVehicleModal onClose={closeAddModal} onAdded={handleVehicleAdded} />}
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
        />
      )}



      {/* 删除确认弹窗 */}
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