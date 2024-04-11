import React, { useState, useEffect } from 'react';
import { getUserInfo, updateUserInfo } from './API';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import './Profile.css';

const Profile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postcode, setPostcode] = useState('');
  const [country, setCountry] = useState('');
  const [avatar, setAvatar] = useState('/img/ProfilePhoto.svg'); 
  const [isLoading, setIsLoading] = useState(true);  // 跟踪头像加载情况

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');

  useEffect(() => {
    setIsLoading(true); // 开始获取数据时设置头像加载状态为true
    getUserInfo().then(data => {
      // console.log('User info:', data);
      // 填充用户信息
      const userInfo = data.message;

      setName(userInfo.name);
      setEmail(userInfo.email);
      setPhone(userInfo.phone);
      // 格式化日期
      const dateParts = userInfo.dateBirth.split('/');
      const convertedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
      setDateOfBirth(convertedDate);
    // 解析地址信息
      if (userInfo.addr) {
        try {
          // 构建一个完整的JSON字符串
          const jsonString = `{${userInfo.addr}}`;
          const addrObject = JSON.parse(jsonString);
          // 设置地址相关状态
          setAddress(addrObject.address);
          setCity(addrObject.city);
          setState(addrObject.state);
          setPostcode(addrObject.postcode);
          setCountry(addrObject.country);
        } catch (error) {
          console.error('Error parsing address:', error);
        }
      }
      // 将获取到的头像（base64）变为可显示的URL
      const avatarData = userInfo.avatar;
      if (avatarData) {
        // 检查 avatar data 是否 starts with 'data:image/jpeg;base64,'
        // const base64Prefix = 'data:image/jpeg;base64,';
        // const updatedAvatar = avatarData.startsWith(base64Prefix) ? avatarData : base64Prefix + avatarData;
        // setAvatar(updatedAvatar);
        setAvatar(avatarData);
      }
      setIsLoading(false); // Set loading to false after data is processed
    })
        .catch(error => {
      console.error('Error fetching user info:', error);
      setIsLoading(false); // Ensure loading is set to false even on error
    });
  }, []);

  // 处理日期变更，转换成后端能识别的格式
  const convertDateToBackendFormat = (date) => {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  };

  // 将用户新上传的图片变为Base64格式
  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result); // 将结果设置为avatar状态
      };
      reader.readAsDataURL(file);
    }
  };

  // 验证用户填写的表单信息格式是否正确
  const validateForm = () => {
    // 姓名，邮箱，电话和生日不能为空
    if (!name.trim() || !email.trim() || !phone.trim() || !dateOfBirth.trim()) {
      setSnackbarMessage('Name, Email, Phone Number, and Date of Birth are required.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return false; 
    }
  
    // 验证邮箱格式
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(email.toLowerCase())) {
      setSnackbarMessage('Please enter a valid email address.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return false;
    }
    return true;
  };
  

  // 用于提交表单的函数
  const handleSave = () => {
    if (!validateForm()) {
      return;
    }
    // 如果验证通过，则继续执行
    const fullAddress = `"country":"${country}", "address":"${address}", "city":"${city}", "state":"${state}", "postcode":"${postcode}"`;
    // 构建要发送的用户信息对象
    const userInfo = {
      address: fullAddress,
      avata: avatar,
      dateBirth: convertDateToBackendFormat(dateOfBirth),
      email: email,
      name: name,
      phone: phone,
    };
  
    // 查看封装数据
    console.log("Sending the following info to the API:", userInfo);
    // 调用API函数更新用户信息
    updateUserInfo(userInfo).then(() => {
      console.log('修改成功');
      // 弹出消息框提示用户或更新状态
      setSnackbarMessage('Successfully modified your profile!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    }).catch(error => {
      console.error('更新失败:', error);
      // 处理错误，显示错误消息
      setSnackbarMessage('Something went wrong, please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    });
  };

  return (
    <div className="profile-container">
      <div className="info-avatar-container">
        {/* 左侧个人信息部分 */}
        <div className="personal-info">   
          <form>
            <div className="form-group">
              <label htmlFor="Name">Your name*</label>
              <input type="text" id="Name" name="Name" value={name} className="input-box" onChange={e => setName(e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email*</label>
              <input type="email" id="email" name="email" value={email} className="input-box" onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone Number*</label>
              <input type="tel" id="phone" name="phone" value={phone} className="input-box" onChange={e => setPhone(e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="dob">Date of Birth*</label>
              <input type="date" id="dob" name="dob" value={dateOfBirth} className="input-box" onChange={e => setDateOfBirth(e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="country">Country</label>
              <input type="text" id="country" name="country" value={country} className="input-box" onChange={e => setCountry(e.target.value)}/>
            </div>
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input type="text" id="address" name="address" value={address} className="input-box" onChange={e => setAddress(e.target.value)}/>
            </div>
            <div className="form-row">
            <div className="form-group city">
              <label htmlFor="city">City</label>
              <input type="text" id="city" name="city" value={city} className="input-box" onChange={e => setCity(e.target.value)}/>
            </div>
            <div className="form-group city">
              <label htmlFor="state">State</label>
              <input type="text" id="state" name="state" value={state} className="input-box" onChange={e => setState(e.target.value)}/>
            </div>
            <div className="form-group postcode">
              <label htmlFor="postcode">Postcode</label>
              <input type="text" id="postcode" name="postcode" value={postcode} className="input-box" onChange={e => setPostcode(e.target.value)}/>
            </div>
          </div>

          </form>
        </div>
        {/* 右侧头像部分 */}
        <div className="avatar-section">
          <div className="avatar-container">
            {isLoading ? (             
              <div>Loading...</div>  // 当正在加载时，显示一个加载指示器
            ) : (
              <img src={avatar} alt="Profile Avatar" className="profile-avatar" />  // 当加载完成时，显示头像
            )}
            {/* 使用label模拟按钮 */}
            <div className='choose file '>
            <label htmlFor="file-upload" className="custom-file-upload">Choose File</label>
            <input type="file" id="file-upload" name="avatar" accept="image/*" onChange={handleAvatarChange} style={{display: "none"}}/>
            </div>    
          </div>
        </div>
      </div>
      {/* 取消/保存按钮 */}
      <div className="action-buttons-container">
        <div className="action-buttons">
          {/* <button type="button" className="cancel-button">Cancel</button> */}
          <button type="button" className="save-button" onClick={handleSave}>Save</button>
        </div>
      </div>
      <Snackbar open={snackbarOpen} 
      autoHideDuration={6000} 
      onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
            {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Profile;