import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import { IconButton } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { updateCarInfo } from './API';
import './Vehicles.css';

const EditVehicleModal = ({ onClose, closeEditModal,  onEdited, EditingCarId, VehicleBrand, VehiclePlate, VehicleType, VehicleSize, VehicleCharge, Avatar  }) => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const [vehicleBrand, setVehicleBrand] = useState(VehicleBrand);
  const [vehiclePlate, setVehiclePlate] = useState(VehiclePlate);
  const [vehicleType, setVehicleType] = useState(VehicleType);
  const [vehicleSize, setVehicleSize] = useState(VehicleSize);
  const [vehicleCharge, setVehicleCharge] = useState(VehicleCharge);
  const [avatar, setAvatar] = useState(Avatar);

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    const vehicleInfo = {
      brand: vehicleBrand,
      charge: vehicleCharge,
      picture: avatar,
      plate: vehiclePlate,
      size: vehicleSize,
      type: vehicleType,
    };
      try {
        await updateCarInfo(EditingCarId.toString(), vehicleInfo); 
        onEdited();
        onClose(); 
        // setSnackbarMessage('Vehicle information updated successfully!');
        // setOpenSnackbar(true);
      } catch (error) {
        // 错误处理
        setSnackbarMessage('Failed to update vehicle: ' + error.message); 
        setOpenSnackbar(true);
      }
    }


  // 添加处理表单字段变化的函数
  const handleBrandChange = (event) => {
      setVehicleBrand(event.target.value);
  };

  const handlePlateChange = (event) => {
      setVehiclePlate(event.target.value);
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
    
  // 在每个表单控件的事件处理器中设置自定义的验证消息
  const handleInvalid = (event) => {
    event.target.setCustomValidity('This field cannot be left blank');
    };

  // 关闭Snackbar
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
        return;
    }
    setOpenSnackbar(false);
    };


  return (
  <div>
      <div className='modal-overlay'>
          <div className='modal-content'>
            <div className="orders-modal-header">
              <div className='current-state-title'> Edit a new Vehicle</div>
              <button className="close-btn" onClick={closeEditModal}>✖</button>
            </div>
  
          <form className='edit-form' onSubmit={handleEditSubmit}> 
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
                  <option value="Bike">Bike</option>
                  <option value="Hatchback">Hatchback</option>
                  <option value="Sedan">Sedan</option>
                  <option value="4WD/SUV">4WD/SUV</option>
                  <option value="VAN">VAN</option>
                  
              </select>
              </div>
              <div className="form-group">              
              <label htmlFor="type">Size of your vehicle</label>
              <select value={vehicleSize} onChange={handleSizeChange}> required
                  onInvalid={handleInvalid}
                  <option value="">Select</option>
                  <option value="Small">Small</option>
                  <option value="Medium">Medium</option>
                  <option value="Large">Large</option>
              </select>
              </div>
              <div div className="form-group">
              <label htmlFor="charge">Does your vehicle need charging?</label>
              <select value={vehicleCharge} onChange={handleChargeChange}> required
                  onInvalid={handleInvalid}
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
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
              {/* <button type='submit' className='submit-btn'>Submit</button> */}
              <button type='submit' className='submit-btn' onClick={handleEditSubmit}>Submit</button>
              <button type='button' onClick={onClose} className='cancel-btn'>Cancel</button>
              </div>
          </form>
          </div>
      </div>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
  </div>
  );
};

export default EditVehicleModal;