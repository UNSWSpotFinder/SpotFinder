const baseUrl = 'http://localhost:8080';

// get user info（get）
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

// get user simple info（get）
export const getUserSimpleInfo = (id) => {
  return new Promise((resolve, reject) => {      
    const endpoint = `${baseUrl}/user/simpleInfo/${id}`;
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

// modify user info（post）
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
  
  

// get user's spots list（get）
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
          console.log(errorReason);
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


// get all spots（get）
export const getAllSpots = (page) => {
  return new Promise((resolve, reject) => {
    const endpoint = `${baseUrl}/spot/list/?isVisible=true&page=${page}&pageSize=15`; 
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
          console.log(errorReason);
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
export const getAllNotApprovedSpots = (page) => {
  return new Promise((resolve, reject) => {
    const endpoint = `${baseUrl}/spot/list/?isVisible=false&page=${page}&pageSize=15`;
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
          console.log(errorReason);
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


// users top up（post）
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


// users withdraw（post）
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

// users create vehicles(post)
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

// get user's vehicles list and info(get)
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


// modify user's vehicles info (post)
export const updateCarInfo = (carID, carInfo) => {
  const endpoint = `${baseUrl}/car/modifyCarInfo/${carID}`;
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
      throw new Error('Network response was not ok');
    }
    return null;
  })
  .catch(error => {
    console.error('There has been a problem with your fetch operation:', error);
    throw error;
  });
};

// users delete vehicles(delete)
export const deleteCar = (carID) => {
  const endpoint = `${baseUrl}/car/deleteCar/${carID}`;
  const token = localStorage.getItem('token');

  return fetch(endpoint, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return null;
  })
  .catch(error => {
    console.error('There has been a problem with your fetch operation:', error);
    throw error;
  });
};

// users get info of specific car(get)
export const getSpecificCarInfo = (carID) => {
  return new Promise((resolve, reject) => {      
    const endpoint = `${baseUrl}/car/getCar/${carID}`;
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

// get users orders info
export const getMyBookingsInfo = () => {
  return new Promise((resolve, reject) => {      
    const endpoint = `${baseUrl}/user/orders/asUser`;
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

// get users orders info as provider(get)
export const getReceivedBookingsInfo = () => {
  return new Promise((resolve, reject) => {      
    const endpoint = `${baseUrl}/user/orders/asOwner`;
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

// cancel orders(put)
export const cancelBooking = (orderID) => {
  const endpoint = `${baseUrl}/order/${orderID}/cancel`;
  const token = localStorage.getItem('token');

  return fetch(endpoint, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
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

// create report of spots (post)
export const createReport = (spotID, reportMessage) => {
  const endpoint = `${baseUrl}/spots/${spotID}/report`;
  const token = localStorage.getItem('token');

  return fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ message: reportMessage }), 
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return null;
  })
  .catch(error => {
    console.error('There has been a problem with your fetch operation:', error);
    throw error;
  });
};


// call API to get all report
export const callAPIgetAllreport = () => {
  const endpoint = `${baseUrl}/manager/report`;
  const token = localStorage.getItem('token');

  return fetch(endpoint, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
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

// call API to slove one report
export const callAPIsolved = (reportid) => {
  const endpoint = `${baseUrl}/manager/report/solve?report_id=${reportid}&result=failure`;
  const token = localStorage.getItem('token');

  return fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
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

// create a review of order(post)
export const createReview = (orderID, reviewContent, reviewRating) => {
  const endpoint = `${baseUrl}/order/${orderID}/reviews`;
  const token = localStorage.getItem('token');

  if (typeof reviewContent !== 'string' || typeof reviewRating !== 'number') {
    throw new Error('Invalid input: Content must be a string and rating must be a number.');
  }

  const review = {
    content: reviewContent,
    rating: reviewRating
  };

  return fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(review),
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status}`);
    }
    return response.json();
  })
  .catch(error => {
    console.error('There has been a problem with your fetch operation:', error);
    throw error;
  });
};

// get reviews of a spot(get)
export const getReviews = (spotID) => {
  return new Promise((resolve, reject) => {
    const endpoint = `${baseUrl}/spots/${spotID}/reviews`;
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
          console.log(errorReason);
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