import React, { useState } from 'react';
import { Snackbar, IconButton } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { createCarInfo } from './API';
import './Vehicles.css';

const AddVehicleModal = ({ onClose, onAdded, closeAddModal }) => {
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [vehicleBrand, setVehicleBrand] = useState('');
    const [vehiclePlate, setVehiclePlate] = useState('');
    const [vehicleType, setVehicleType] = useState('');
    const [vehicleSize, setVehicleSize] = useState('');
    const [vehicleCharge, setVehicleCharge] = useState('');
    const [avatar, setAvatar] = useState('');

    // Click the add button to set the model to add mode. 
    // When the modal box is opened, all form fields are reset.
    const handleAddSubmit = async (event) => {
        event.preventDefault();
        if (!avatar) {
            setSnackbarMessage('Please upload a vehicle picture.');
            setOpenSnackbar(true);
            return; // 不继续执行提交
        }
        const vehicleInfo = {
            brand: vehicleBrand,
            charge: vehicleCharge,
            picture: avatar,
            plate: vehiclePlate,
            size: vehicleSize,
            type: vehicleType
        };
        console.log(vehicleInfo);
        try {
            await createCarInfo(vehicleInfo);
            onAdded();
            onClose();
            } catch (error) {
            setSnackbarMessage('Failed to add vehicle.' + error.message);
            setOpenSnackbar(true);
            }
    }

    // handle the change of the form field
    const handleBrandChange = (event) => {
        setVehicleBrand(event.target.value);
    };

    const handlePlateChange = (event) => {
        setVehiclePlate(event.target.value);
    };

    // handle the change of the select field
    const handleTypeChange = (event) => {
    setVehicleType(event.target.value);
    };

    const handleSizeChange = (event) => {
    setVehicleSize(event.target.value);
    }

    const handleChargeChange = (event) => {
    setVehicleCharge(event.target.value);
    }

    // handle file upload
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result);
            };
            reader.readAsDataURL(file);
            event.target.setCustomValidity('');
        }
    };
        
    // 设置自定义的验证消息
    // Validate that input cannot be empty
    const handleInvalid = (event) => {
    event.target.setCustomValidity('Please upload your vehicle picture.');
    };

    // close Snackbar
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
              <div className='current-state-title'> Add a new Vehicle</div>
              <button className="close-btn" onClick={closeAddModal}>✖</button>
            </div>
            <form className='add-form' onSubmit={handleAddSubmit}> 
                {/* form content */}
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
                        id="upload-avatar"
                        type="file"
                        onChange={handleFileChange}
                        style={{ opacity: 0, position: 'absolute', zIndex: -1, width: '1px', height: '1px' }}
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

export default AddVehicleModal;