import React from 'react';
import './Profile.css';

const Profile = () => {
  return (
    <div className="profile-container">
      <div className="info-avatar-container">
        <div className="personal-info">
          {/* 左侧信息部分 */}
          <form>
            <div className="form-group">
              <label htmlFor="Name">Your name*</label>
              <input type="text" id="Name" name="Name" />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email*</label>
              <input type="email" id="email" name="email" />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone Number*</label>
              <input type="tel" id="phone" name="phone" />
            </div>
            <div className="form-group">
              <label htmlFor="dob">Date of Birth*</label>
              <input type="date" id="dob" name="dob" />
            </div>
            <div className="form-group">
              <label htmlFor="country">Country/State</label>
              <select id="country" name="country">
                <option value="australia">Australia</option>
                {/* 其他国家选项 */}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input type="text" id="address" name="address" />
            </div>
          </form>
        </div>
        <div className="avatar-section">
          {/* 右侧头像部分 */}
          <div className="avatar-container">
            <img src="/path/to/avatar.jpg" alt="Profile Avatar" className="profile-avatar" />
            <button className="edit-photo-btn">Edit Profile Photo</button>
          </div>
        </div>
      </div>
      <div className="action-buttons-container">
        {/* 取消/保存按钮 */}
        <div className="action-buttons">
          <button type="button" className="cancel-button">Cancel</button>
          <button type="submit" className="save-button">Save</button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
