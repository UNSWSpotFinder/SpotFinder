import React from 'react';
import './Profile.css'; // 确保此CSS文件存在并包含下面的样式

const Profile = () => {
  return (
    <div className="profile-container">
      <div className="personal-info">
        <form>
          <div className="form-group">
            <label htmlFor="firstName">First Name*</label>
            <input type="text" id="firstName" name="firstName" />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Last Name*</label>
            <input type="text" id="lastName" name="lastName" />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email*</label>
            <input type="email" id="email" name="email" />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input type="tel" id="phone" name="phone" />
          </div>
          <div className="form-group">
            <label htmlFor="dob">Date of Birth</label>
            <input type="date" id="dob" name="dob" />
          </div>
          <div className="form-group">
            <label htmlFor="country">Country/State</label>
            <select id="country" name="country">
              <option value="australia">Australia</option>
              {/* Add other country options here */}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input type="text" id="address" name="address" />
          </div>
          {/* Add additional form groups as needed */}
          <div className="form-group action-buttons">
            <button type="button" className="cancel-button">Cancel</button>
            <button type="submit" className="save-button">Save</button>
          </div>
        </form>
      </div>
      <div className="avatar-section">
        <div className="avatar-container">
          <img src="/path/to/avatar.jpg" alt="Profile Avatar" className="profile-avatar" />
          <button className="edit-photo-btn">Edit Profile Photo</button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
