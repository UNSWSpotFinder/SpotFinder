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
  const [isLoading, setIsLoading] = useState(true);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');

  useEffect(() => {
    setIsLoading(true);
    getUserInfo().then(data => {
      // fill in user information
      const userInfo = data.message;

      setName(userInfo.Name);
      setEmail(userInfo.Email);
      setPhone(userInfo.Phone);
      // format the date
      const dateParts = userInfo.DateBirth.split('/');
      const convertedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
      setDateOfBirth(convertedDate);
    // parse address information
      if (userInfo.Addr) {
        try {
          // set the whole JSON string
          const jsonString = `{${userInfo.Addr}}`;
          const addrObject = JSON.parse(jsonString);
          setAddress(addrObject.address);
          setCity(addrObject.city);
          setState(addrObject.state);
          setPostcode(addrObject.postcode);
          setCountry(addrObject.country);
        } catch (error) {
          console.error('Error parsing address:', error);
        }
      }
      // set the avatar image
      const avatarData = userInfo.Avatar;
      if (avatarData) {
        setAvatar(avatarData);
      }
      setIsLoading(false); // Set loading to false after data is processed
    })
        .catch(error => {
      console.error('Error fetching user info:', error);
      setIsLoading(false); // Ensure loading is set to false even on error
    });
  }, []);

  // Convert the date to a format that the backend can understand
  const convertDateToBackendFormat = (date) => {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  };

  // set the uploaded image into base64 format
  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Validate the form information entered by the user
  const validateForm = () => {
    if (!name.trim() || !email.trim() || !phone.trim() || !dateOfBirth.trim()) {
      setSnackbarMessage('Name, Email, Phone Number, and Date of Birth are required.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return false; 
    }
  
    // validate email format
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(email.toLowerCase())) {
      setSnackbarMessage('Please enter a valid email address.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return false;
    }
    return true;
  };
  
  // handleSave function to send the user information to the API
  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    // build the information object to send
    const fullAddress = `"country":"${country}", "address":"${address}", "city":"${city}", "state":"${state}", "postcode":"${postcode}"`;
    const userInfo = {
      address: fullAddress,
      avata: avatar,
      dateBirth: convertDateToBackendFormat(dateOfBirth),
      email: email,
      name: name,
      phone: phone,
    };

    // update user information
    updateUserInfo(userInfo).then(() => {
      setSnackbarMessage('Successfully modified your profile!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    }).catch(error => {
      setSnackbarMessage('Something went wrong, please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    });
  };

  return (
    <div className="profile-container">
      <div className="info-avatar-container">
        {/* left part: user info */}
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
        {/* right part:avatar */}
        <div className="avatar-section">
          <div className="avatar-container">
            {isLoading ? (             
              <div>Loading...</div>  // loading state
            ) : (
              <img src={avatar} alt="Profile Avatar" className="profile-avatar" />
            )}
            <div className='choose file '>
            <label htmlFor="file-upload" className="custom-file-upload">Choose File</label>
            <input type="file" id="file-upload" name="avatar" accept="image/*" onChange={handleAvatarChange} style={{display: "none"}}/>
            </div>    
          </div>
        </div>
      </div>
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