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

// 修改用户信息（post）
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
  
  

// 获取特定用户的 spot 列表（get）
export const getSpotDetails = (spotId) => {
  return new Promise((resolve, reject) => {
    const endpoint = `${baseUrl}/spot/${spotId}`;
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


// 获取车位列表（get）
export const getAllSpots = () => {
  return new Promise((resolve, reject) => {
    const endpoint = `${baseUrl}/spot/list`; 

    fetch(endpoint, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
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


// 用户充值（post）
export const topUpAccount = (amount) => {
  const endpoint = `${baseUrl}/user/topUp`;
  const token = localStorage.getItem('token');

  return fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ amount }),
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


// 用户提现（post）
export const withdrawAccount = (amount) => {
  const endpoint = `${baseUrl}/user/withdraw`;
  const token = localStorage.getItem('token');

  return fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ amount }),
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

// 用户创建车辆(post)
export const createCarInfo = (carInfo) => {
  const endpoint = `${baseUrl}/car/create`;
  const token = localStorage.getItem('token');

  return fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(carInfo),
  })
  .then(response => {
    if (!response.ok) {
      return response.json().then(err => { throw err; });
    }
    return response.json();
  })
  .catch(error => {
    console.error('Error during fetch operation:', error);
  });
};

// 获取用户车辆信息(get)
export const getCarInfo = () => {
  return new Promise((resolve, reject) => {      
    const endpoint = `${baseUrl}/car/getMyCar`;
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

// 获取订单信息(get)
export const getBookingsInfo = () => {
  return new Promise((resolve, reject) => {      
    const endpoint = `${baseUrl}`;
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

