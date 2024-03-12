
const baseUrl = 'http://localhost:8080';

// 获取用户信息（get）
export const getUserInfo = () => {
    return new Promise((resolve, reject) => {      
      const endpoint = `${baseUrl}/user/info`;
      const token = localStorage.getItem('token');
  
      fetch(endpoint, {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }),
      })
      .then(response => {
        if (response.ok) {
          return response.json().then(data => resolve(data));
        } else {
          response.json().then(data => {
            const errorReason = data.message;
            reject(errorReason);
          }).catch(() => {
            reject(new Error('Error parsing response JSON.'));
          });
        }
      })
      .catch(error => {
        console.log(error);
        reject(new Error('Network error! Please try again.'));
      });
    });
  };

// 修改用户信息（put）
export const updateUserInfo = (userInfo) => {
    const endpoint = `${baseUrl}/user/modifyUserInfo`;
    const token = localStorage.getItem('token');
  
    return fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(userInfo),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
      throw error;
    });
  };
  
  