import React from 'react';
import './Profile.css'; // 假设你有一个专门的CSS文件

const Profile = () => {
  return (
    <div className='profile-container'>
      {/* 左侧个人信息的输入字段 */}
      <div className='personal-info'>
        <div>
          <label htmlFor='name'>Name: </label>
          <input type='text' placeholder='Name' />
        </div>
        <div>
          <label htmlFor='Email'>Name: </label>
          <input type='text' placeholder='Name' />
        </div>

        
      </div>

      {/* 右侧头像信息 */}
      <div className='avatar-section'>
        
        <img src='/path/to/avatar.jpg' alt='Profile Avatar' className='profile-avatar' />
        <button className='edit-photo-btn'>Edit Profile Photo</button>
      </div>
    </div>
  );
}

export default Profile;
