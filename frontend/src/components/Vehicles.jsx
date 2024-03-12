import React, { useState } from 'react';
import { Snackbar, IconButton } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import './Vehicles.css';

const Vehicles = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [avatar, setAvatar] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [vehicleSize, setVehicleSize] = useState('');
  const [vehicleCharge, setVehicleCharge] = useState('');

  const [modalMode, setModalMode] = useState(''); // 'add' 或 'edit'

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);


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

  const handSizeChange = (event) => {
    setVehicleSize(event.target.value);
  }

  const handChargeChange = (event) => {
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
  const handleSubmit = (event) => {
    event.preventDefault();
    if(modalMode === 'add') {
      // 处理添加新车辆逻辑
    } else if (modalMode === 'edit') {
      // 处理编辑车辆信息逻辑
    }
  
    // 显示Snackbar提示
    setSnackbarMessage('Vehicle information updated successfully!');
    setOpenSnackbar(true);
    
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
  


  // 点击add按钮，设置model为add模式
  const openAddModal = () => {
    setModalMode('add');
    setIsModalOpen(true);
  };

  // 点击edit按钮，设置model为edit模式
  const openEditModal = () => {
    setModalMode('edit');
    setIsModalOpen(true);
  };
  



  return (
    <div className='dashboard-vehicles'>
      {/* 上方按钮部分 */}
      <div className="button-part">
        <button className='vehicle-title'>Current Vehicles: 1</button>
        <button className='add-a-car-btn' onClick={openAddModal}>Add a new vehicle</button>

      </div>
        {/* 下方车辆部分 */}
      <div className='vehicle-part'>
        <h3 className='my-vehicle-title'>My vehicles</h3>
        <div className='specific-vehicle'>
          <div className='left-picture'>
            <div className='vehicle-picture'>vehicle picture</div>
          </div>
          <div className='middle-info'>
            <div className='vehicle-row'>
              <div className='vehicle-brand'>Toyota</div>
              <div className='vehicle-plate'>NSW123456</div>
            </div>
            <div className='vehicle-row'>
              <div className='vehicle-type'>4WD/SUV</div>
              <div className='vehicle-size'>Small</div>
            </div>
            <div className='vehicle-charge'>charge</div>
          </div>
          <div className='right-btn-part'>
            <button className='edit-btn' onClick={openEditModal}>Edit</button>

            <div>
              <button className='delete-btn' onClick={openDeleteConfirm}>Delete</button>
            </div>
            
          </div>
        </div>
      </div>
      {/* add/edit spot弹窗 */}
      {isModalOpen && (
        <div className='modal-overlay'>
          <div className='modal-content'>
          <h3>{modalMode === 'add' ? 'Add a New Vehicle' : 'Edit Your Vehicle Information'}</h3>

            <form className='edit-form'>
              {/* 表单内容 */}
              <div className="form-group">
                <label htmlFor="brand">Brand of your vehicle</label>
                <input type="brand" id="brand" name="brand" className="input-box"  placeholder='e.g.Toyota'  />
              </div>
              <div className="form-group">
                <label htmlFor="plate">Plate of your vehicle</label>
                <input type="plate" id="plate" name="plate" className="input-box"  placeholder='e.g.NSW123456'  />
              </div>
              <div className="form-group">              
              <label htmlFor="type">Type of your vehicle</label>
                <select value={vehicleType} onChange={handleTypeChange}>
                  <option value="">Select</option>
                  <option value="bike">Bike</option>
                  <option value="hatchback">Hatchback</option>
                  <option value="sedan">Sedan</option>
                  <option value="suv">4DW/SUV</option>
                  <option value="truck">Van</option>
                  
                </select>
              </div>
              <div className="form-group">              
              <label htmlFor="type">Size of your vehicle</label>
                <select value={vehicleSize} onChange={handSizeChange}>
                  <option value="">Select</option>
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
              <div div className="form-group">
              <label htmlFor="charge">Does your vehicle need charging?</label>
                <select value={vehicleCharge} onChange={handChargeChange}>
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
              <div className="form-group">
                <input
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
                <button type='submit' className='submit-btn' onClick={handleSubmit}>Submit</button>
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
    </div>
    
  );
}

export default Vehicles;