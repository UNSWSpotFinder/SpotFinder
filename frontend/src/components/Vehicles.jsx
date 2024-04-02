import React, { useEffect, useState } from 'react';
import { Snackbar } from '@mui/material';
import { IconButton } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import './Vehicles.css';
import { getCarInfo, createCarInfo } from './API';

const Vehicles = () => {
  const [carsInfo, setCarsInfo] = useState([]); // 存储获取到的 cars 详细信息
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState(''); // 'add' 或 'edit'
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const [vehicleBrand, setVehicleBrand] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [vehicleSize, setVehicleSize] = useState('');
  const [vehicleCharge, setVehicleCharge] = useState('');
  const [avatar, setAvatar] = useState('');

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



  // 打开edit/add spot弹窗
  const openModal = () => {
    setIsModalOpen(true);
  };

  // 关闭edit/add spot弹窗
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // 打开删除确认弹窗
  const openDeleteConfirm = () => {
    setShowDeleteConfirm(true);
  };
  
  // 关闭删除确认弹窗
  const closeDeleteConfirm = () => {
    setShowDeleteConfirm(false);
  };



  // 处理下拉选项改变的事件
  const handleTypeChange = (event) => {
    setVehicleType(event.target.value);
  };

  const handleSizeChange = (event) => {
    setVehicleSize(event.target.value);
  }

  const handleChargeChange = (event) => {
    setVehicleCharge(event.target.value);
  }

  // 关闭Snackbar
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  // 处理文件上传
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // TODO:处理表单提交
  const handleSubmit = async (event) => {
    event.preventDefault();
    const vehicleInfo = {
      brand: vehicleBrand,
      charge: vehicleCharge,
      picture: avatar,
      plate: vehiclePlate,
      size: vehicleSize,
      type: vehicleType
    };
    console.log('Vehicle info:', vehicleInfo);

    if(modalMode === 'add') {
      try {
        await createCarInfo(vehicleInfo);
        const updatedCars = await getCarInfo();
        setCarsInfo(updatedCars.cars); // 确保这里是响应体中的正确属性
        setSnackbarMessage('Vehicle added successfully!');
        setOpenSnackbar(true);
      } catch (error) {
        setSnackbarMessage('Failed to add vehicle.'); // 设置添加失败消息
        setOpenSnackbar(true); // 显示Snackbar
      }
    } else if (modalMode === 'edit') {
      setSnackbarMessage('Vehicle information updated successfully!'); // 设置编辑成功消息
      setOpenSnackbar(true); // 显示Snackbar
      // 处理编辑车辆信息逻辑
    }
    // 关闭弹窗
    closeModal();
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
    setModalMode('add');
    setIsModalOpen(true);
    // 重置表单字段
    setVehicleBrand('');
    setVehiclePlate('');
    setVehicleType('');
    setVehicleSize('');
    setVehicleCharge('');
    setAvatar(''); 

  };

  // 点击edit按钮，设置model为edit模式
  const openEditModal = () => {
    setModalMode('edit');
    setIsModalOpen(true);
  };

    // 添加处理表单字段变化的函数
    const handleBrandChange = (event) => {
      setVehicleBrand(event.target.value);
    };
  
    const handlePlateChange = (event) => {
      setVehiclePlate(event.target.value);
    };

    // 在每个表单控件的事件处理器中设置自定义的验证消息
    const handleInvalid = (event) => {
      event.target.setCustomValidity('This field cannot be left blank');
    };

    

  return (
    <div className='dashboard-vehicles'>
      {/* 上方按钮部分 */}
      <div className="button-part">
        <button className='vehicle-title'>Current Vehicles: {carsInfo.length}</button>
        <button className='add-a-car-btn' onClick={openAddModal}>Add a new vehicle</button>

      </div>
      {/* 下方车辆部分 */}
      <div className='vehicle-part'>
        <h3 className='my-vehicle-title'>My vehicles</h3>
        {/* 某个具体车辆部分 */}
        {carsInfo.map((car) => (
           <div key={car.ID} className='specific-vehicle'>
           <div className='left-picture'>
             {/* 假设您的API返回图片的base64编码，否则您可能需要调整这个 */}
             <img className='vehicle-picture' src={car.picture} alt='Vehicle' />
           </div>
           <div className='middle-info'>
             <div className='vehicle-row'>
               <div className='vehicle-brand'>{car.brand}</div>
               <div className='vehicle-plate'>{car.plate}</div>
             </div>
             <div className='vehicle-row'>
               <div className='vehicle-type'>{car.type}</div>
               <div className='vehicle-size'>{car.size}</div>
             </div>
             <div className='vehicle-charge'>{car.charge}</div>
           </div>
           <div className='right-btn-part'>
             <button className='edit-btn' onClick={() => openEditModal(car)}>Edit</button>
             <button className='delete-btn' onClick={() => openDeleteConfirm(car)}>Delete</button>
           </div>
         </div>
       ))}
      </div>

      {/* add/edit spot弹窗 */}
      {isModalOpen && (
        <div className='modal-overlay'>
          <div className='modal-content'>
          <h3>{modalMode === 'add' ? 'Add a New Vehicle' : 'Edit Your Vehicle Information'}</h3>

            <form className='edit-form' onSubmit={handleSubmit}> 
              {/* 表单内容 */}
              <div className="form-group">
                <label htmlFor="brand">Brand of your vehicle</label>
                <input required 
                  onInvalid={handleInvalid}
                  type="text" id="brand" name="brand" className="input-box"  placeholder='e.g.Toyota' value={vehicleBrand}  onChange={handleBrandChange}/>
              </div>
              <div className="form-group">
                <label htmlFor="plate">Plate of your vehicle</label>
                <input required 
                  onInvalid={handleInvalid}
                  type="text" id="plate" name="plate" className="input-box"  placeholder='e.g.NSW123456'  value={vehiclePlate} onChange={handlePlateChange}/>
              </div>
              <div className="form-group">              
              <label htmlFor="type">Type of your vehicle</label>
                <select value={vehicleType} onChange={handleTypeChange}> required
                  onInvalid={handleInvalid}
                  <option value="">Select</option>
                  <option value="bike">Bike</option>
                  <option value="hatchback">Hatchback</option>
                  <option value="sedan">Sedan</option>
                  <option value="suv">4WD/SUV</option>
                  <option value="truck">Van</option>
                  
                </select>
              </div>
              <div className="form-group">              
              <label htmlFor="type">Size of your vehicle</label>
                <select value={vehicleSize} onChange={handleSizeChange}> required
                  onInvalid={handleInvalid}
                  <option value="">Select</option>
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
              <div div className="form-group">
              <label htmlFor="charge">Does your vehicle need charging?</label>
                <select value={vehicleCharge} onChange={handleChargeChange}> required
                  onInvalid={handleInvalid}
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
              <div className="form-group">
                <input
                  required
                  onInvalid={handleInvalid}
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="upload-avatar"
                  type="file"
                  onChange={handleFileChange}
                />
                <label htmlFor="upload-avatar">
                <span className='upload-hint'>Click to upload your vehicle picture</span> 
                  <IconButton color="primary" aria-label="upload picture" component="span">
                    <PhotoCamera />
                  </IconButton>
                </label>
                {avatar && <img src={avatar} alt="Avatar Preview" style={{ width: '100px', height: '100px' }} />}
              </div>
              <div className="form-buttons">
                <button type='submit' className='submit-btn'>Submit</button>
                <button type='button' onClick={closeModal} className='cancel-btn'>Cancel</button>
              </div>
            </form>
          </div>
        </div>
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