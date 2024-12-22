import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import React, { useState, useEffect, createContext, useContext } from 'react';
import './CarSpaceOpearation.css';
const port = '8080';
// remove the last segment of the pathname
export function removeLastSegment(pathname) {
  const segments = pathname.split('/');
  segments.pop(); // Remove the last segment
  return segments.join('/') + '/'; // Join the remaining segments, ensure at least a root '/' is returned
}
// calculate the total distance of all the intervals
export const CalculateAllTime = (Alltime, bookway) => {
  // First, sort the intervals based on their start time
  const sortedIntervals = Alltime.sort(
    (a, b) => new Date(a.startDate) - new Date(b.startDate)
  );
  // Initialize an array to hold the merged intervals
  const mergedIntervals = [];
  // Iterate through the sorted intervals
  for (const interval of sortedIntervals) {
    // If mergedIntervals is empty or current interval does not overlap
    if (
      mergedIntervals.length === 0 ||
      new Date(interval.startDate) >
        new Date(mergedIntervals[mergedIntervals.length - 1].endDate)
    ) {
      mergedIntervals.push({ ...interval }); // Add a copy of the interval to mergedIntervals
    } else {
      // There's an overlap, so merge the current interval with the last interval in mergedIntervals
      mergedIntervals[mergedIntervals.length - 1].endDate = new Date(
        Math.max(
          new Date(mergedIntervals[mergedIntervals.length - 1].endDate),
          new Date(interval.endDate)
        )
      );
    }
  }
  let TotalDistance = mergedIntervals.reduce((total, item) => {
    // Assuming GetDistanceAll returns a numeric value representing the distance
    return total + GetDistanceAll(item.startDate, bookway, item.endDate);
  }, 0); // Initialize the total with 0
  return TotalDistance;
};
// when the image is hovered, the image will change
export const HoverImage = (src) => {
  // State to track whether the image is being hovered
  const [isHovered, setIsHovered] = useState(false);

  // Event handler for mouse enter
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  // Event handler for mouse leave
  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <img
      className='CnhQ7Answer'
      // Use the hovered image source if the mouse is over the component, otherwise use the default source
      src={isHovered ? '/img/DEL.png' : src.src}
      alt={src.alt}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    />
  );
};
// get the distance between two dates
export const GetDistance = (startDate, endDate) => {
  // Check if both start and end dates are provided
  if (startDate && endDate) {
    // Create new Date objects to ensure consistency
    const date1 = new Date(String(startDate));
    const date2 = new Date(String(endDate));

    // Set the time portion of the dates to midnight (UTC)
    date1.setUTCHours(0, 0, 0, 0);
    date2.setUTCHours(0, 0, 0, 0);
    // Calculate the time difference in milliseconds
    const timeDistance = Math.abs(date2.getTime() - date1.getTime());

    // Calculate the number of days and round up to the nearest whole number
    const daysDistance = Math.ceil(timeDistance / (1000 * 60 * 60 * 24));

    // Return the calculated number of days
    return daysDistance;
  }
  return 0;
};
// get the sum of each distance between two dates in an array
export const GetDistanceAll = (startDate, bookway, endDate) => {
  // Check if both start and end dates are provided
  if (startDate && endDate) {
    // Create new Date objects to ensure consistency
    const date1 = new Date(String(startDate));
    const date2 = new Date(String(endDate));
    // Calculate the time difference in milliseconds
    const timeDistance = Math.abs(date2.getTime() - date1.getTime());
    // Calculate the number of days and round up to the nearest whole number
    if (bookway === 'H') {
      return Math.ceil(timeDistance / (1000 * 60 * 60));
    }
    // Calculate the number of days and round up to the nearest whole number
    else if (bookway === 'D') {
      return Math.ceil(timeDistance / (1000 * 60 * 60 * 24));
    }
    // Calculate the number of days and round up to the nearest whole number
    else if (bookway === 'W') {
      return Math.ceil(timeDistance / (1000 * 60 * 60 * 24 * 7));
    }
    // Return the calculated number of days
    return NaN;
  }
  return 0;
};
// meet the error log
export const meetErrorLog = (error) => {
  let errorText = '';
  // switch case to show the error
  switch (error) {
    case 'info':
      errorText = 'Invalid username or password !';
      break;
    case 'access':
      errorText = 'No permission, please log in first!';
      break;
    default:
      errorText = 'Network error! Please try again.';
      break;
  }
  return errorText;
};
// the ErrorContext to show the error
export const ErrorContext = createContext({
  // set the snackbarData to show the error
  snackbarData: {
    severity: 'info',
    message: '1',
    timestamp: new Date().getTime(),
  },
  setOpenSnackbar: () => {}, // 提供一个空函数避免调用时出错
});
// warp the error context
export const useError = () => useContext(ErrorContext);
// create the error provider
export const ErrorProvider = ({ children }) => {
  // State to manage the Snackbar data
  const [snackbarData, setSnackbarData] = useState({
    severity: 'success',
    message: '',
    timestamp: new Date().getTime(),
  });
  // Function to set the Snackbar data
  const setOpenSnackbar = (data) => {
    setSnackbarData(data);
  };
  // Provide the ErrorContext to the children components
  return (
    <ErrorContext.Provider value={{ snackbarData, setOpenSnackbar }}>
      {children}
    </ErrorContext.Provider>
  );
};
// The message to be displayed in the Snackbar
export const GlobalSnackbar = () => {
  const { snackbarData } = useError();
  // State to manage the visibility of the Snackbar
  const [open, setOpen] = useState(false);
  // Effect to show the Snackbar when a new message is received
  useEffect(() => {
    if (snackbarData.message) {
      setOpen(true);
    }
  }, [snackbarData.message, snackbarData.timestamp]);
  // handle the close of the snackbar
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };
  // Return the Snackbar component
  return (
    // Snackbar component with automatic hiding and custom styling
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity={snackbarData.severity}>
        {snackbarData.message}
      </Alert>
    </Snackbar>
  );
};
// the api to send the email code
export const callAPIsendEmailCode = (path, input) => {
  return new Promise((resolve, reject) => {
    fetch('/api/' + String(path), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    })
      .then((response) => {
        if (response.ok) {
          console.log(response);
          return resolve(response);
        } else if (response.status === 400) {
          const errorReason = 'Email not correct!';
          return reject(errorReason);
        } else {
          const errorReason = 'There is a problem with the network connection!';
          return reject(errorReason);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });
};
// the api to verify the email code
export const callAPIverifyEmailCode = (path, input) => {
  return new Promise((resolve, reject) => {
    console.log('/api/' + String(path));
    fetch('/api/' + String(path), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    })
      .then((response) => {
        if (response.ok) {
          console.log('success');
          return resolve(response.json());
        } else if (response.status === 400) {
          const errorReason = 'Incorrect verification code.';
          return reject(errorReason);
        } else {
          const errorReason = 'There is a problem with the network connection!';
          return reject(errorReason);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });
};
// the api to login the admin
export const callAPILoginAdmin = (path, input) => {
  return new Promise((resolve, reject) => {
    console.log(input);
    console.log('/api/' + String(path));
    fetch('/api/' + String(path), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    })
      .then((response) => {
        if (response.ok) {
          console.log('success');
          return resolve(response.json());
        } else if (response.status === 401) {
          const errorReason =
            'Username does not exist or password is incorrect!';
          return reject(errorReason);
        } else if (response.status === 500) {
          const errorReason =
            'Username does not exist or password is incorrect!';
          return reject(errorReason);
        } else {
          const errorReason = 'There is a problem with the network connection!';
          return reject(errorReason);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });
};
// the api to register the user
export const callAPIRegistUser = (path, input) => {
  return new Promise((resolve, reject) => {
    console.log(input);
    console.log('/api/' + String(path));
    fetch('/api/' + String(path), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    })
      .then((response) => {
        if (response.status === 200) {
          console.log('success');
          return response.json().then((data) => resolve(data));
        } else {
          // if the status code is not 200, we need to parse the JSON to find out the reason for the error
          response
            .json()
            .then((data) => {
              console.log(data.error);
              let errorReason = 'An unknown error occurred.';
              if (data.error === 'Date format error') {
                errorReason = 'Please choose a valid birthday.';
              } else if (data.error) {
                errorReason = 'User has been registered!';
              }
              return reject(errorReason);
            })
            .catch(() => {
              reject(new Error('Error parsing response JSON.'));
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });
};
// the api to register the admin
export const callAPIRegistAdmin = (path, input) => {
  return new Promise((resolve, reject) => {
    console.log(input);
    console.log('/api/' + String(path));
    fetch('/api/' + String(path), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    })
      .then((response) => {
        if (response.status === 200) {
          console.log('success');
          return response.json().then((data) => resolve(data));
        } else {
          // if the status code is not 200, we need to parse the JSON to find out the reason for the error
          response
            .json()
            .then((data) => {
              let errorReason = 'An unknown error occurred.';
              if (data.error === 'invalid manager') {
                errorReason =
                  'It looks like you are not an employee of our company.';
              } else if (data.error) {
                errorReason = 'User has been registered!';
              }
              return reject(errorReason);
            })
            .catch(() => {
              reject(new Error('Error parsing response JSON.'));
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });
};
// the api to login the user
export const callAPILoginUser = (path, input) => {
  return new Promise((resolve, reject) => {
    console.log(input);
    console.log('/api/' + String(path));
    fetch('/api/' + String(path), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    })
      .then((response) => {
        if (response.ok) {
          console.log('success');
          return resolve(response.json());
        } else if (response.status === 401) {
          const errorReason =
            'Username does not exist or password is incorrect!';
          return reject(errorReason);
        } else if (response.status === 500) {
          const errorReason =
            'Username does not exist or password is incorrect!';
          return reject(errorReason);
        } else {
          const errorReason = 'There is a problem with the network connection!';
          return reject(errorReason);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });
};
// the api to reset the password of the user
export const callAPIResetPwdUser = (path, input) => {
  return new Promise((resolve, reject) => {
    console.log(input);
    console.log('/api/' + String(path));
    fetch('/api/' + String(path), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    })
      .then((response) => {
        if (response.ok) {
          console.log('success');
          return resolve(response.json());
        } else if (response.status === 401) {
          const errorReason =
            'Username does not exist or password is incorrect!';
          return reject(errorReason);
        } else {
          const errorReason = 'There is a problem with the network connection!';
          return reject(errorReason);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });
};
// the api to create a new spot
export const callAPICreateSpot = (path, input, token) => {
  return new Promise((resolve, reject) => {
    console.log(input);
    console.log('token: ' + token);
    console.log('/api/' + String(path));
    fetch('/api/' + String(path), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${String(token)}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    })
      .then((response) => {
        if (response.status === 200) {
          console.log('success');
          return response.json().then((data) => resolve(data));
        } else {
          // 如果状态码不是200，我们要解析JSON来找出错误原因
          response
            .json()
            .then((data) => {
              console.log(data.error);
              let errorReason = 'An unknown error occurred.';
              if (data.error === 'invalid manager') {
                errorReason =
                  'It looks like you are not an employee of our company.';
              } else if (data.error) {
                errorReason = 'User has been registered!';
              }
              reject(errorReason);
            })
            .catch(() => {
              reject(new Error('Error parsing response JSON.'));
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });
};
// the api to edit the spot
export const callAPIEditSpot = (path, input, token) => {
  return new Promise((resolve, reject) => {
    console.log(input);
    console.log('token: ' + token);
    console.log('/api/' + String(path));
    fetch('/api/' + String(path), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${String(token)}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    })
      .then((response) => {
        if (response.status === 200) {
          console.log('success');
          return response.json().then((data) => resolve(data));
        } else {
          // 如果状态码不是200，我们要解析JSON来找出错误原因
          response
            .json()
            .then((data) => {
              console.log(data.error);
              let errorReason = 'An unknown error occurred.';
              if (data.error === 'invalid manager') {
                errorReason =
                  'It looks like you are not an employee of our company.';
              } else if (data.error) {
                errorReason = 'User has been registered!';
              }
              reject(errorReason);
            })
            .catch(() => {
              reject(new Error('Error parsing response JSON.'));
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });
};
// the api to get all the spots
export const callAPIGetAllSpot = (path, token, page) => {
  return new Promise((resolve, reject) => {
    console.log('token: ' + token);
    console.log('/api/' + String(path));
    fetch(
        '/api/' +
        String(path) +
        '/?isVisible=true&page=' +
        page +
        '&pageSize=15',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
      .then((response) => {
        if (response.status === 200) {
          console.log('success');
          console.log(response);
          return response.json().then((data) => resolve(data));
        } else {
          // 如果状态码不是200，我们要解析JSON来找出错误原因
          response
            .json()
            .then((data) => {
              console.log(data.error);
              let errorReason = 'An unknown error occurred.';
              if (data.error === 'invalid manager') {
                errorReason =
                  'It looks like you are not an employee of our company.';
              } else if (data.error) {
                errorReason = 'Some error occurred,try again!';
              }
              reject(errorReason);
            })
            .catch(() => {
              reject(new Error('Error parsing response JSON.'));
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });
};
// the api to get the specific spot
export const callAPIGetSpecSpot = (path) => {
  return new Promise((resolve, reject) => {
    console.log('/api/' + String(path));
    fetch('/api/' + String(path), {
      method: 'GET',
      headers: {},
    })
      .then((response) => {
        if (response.status === 200) {
          console.log('success');
          console.log(response);
          return response.json().then((data) => resolve(data));
        } else {
          // 如果状态码不是200，我们要解析JSON来找出错误原因
          response
            .json()
            .then((data) => {
              console.log(data.error);
              let errorReason = 'An unknown error occurred.';
              if (data.error === 'invalid manager') {
                errorReason = '';
              } else if (data.error) {
                errorReason = '';
              }
              reject(errorReason);
            })
            .catch(() => {
              reject(new Error('Error parsing response JSON.'));
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });
};
// the api to get the specific user info
export const callAPIGetSpecUserInfo = (path) => {
  return new Promise((resolve, reject) => {
    console.log('/api/' + String(path));
    fetch('/api/' + String(path), {
      method: 'GET',
      headers: {},
    })
      .then((response) => {
        if (response.status === 200) {
          console.log('success');
          console.log(response);
          return response.json().then((data) => resolve(data));
        } else {
          // 如果状态码不是200，我们要解析JSON来找出错误原因
          response
            .json()
            .then((data) => {
              console.log(data.error);
              let errorReason = 'An unknown error occurred.';
              if (data.error === '') {
                errorReason = '';
              } else if (data.error) {
                errorReason = '';
              }
              reject(errorReason);
            })
            .catch(() => {
              reject(new Error('Error parsing response JSON.'));
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });
};
// the api to approve the spot
export const callAPIApproveSpot = (path, SpotId, token) => {
  return new Promise((resolve, reject) => {
    fetch(
      '/api/' + String(path) + '/' +
        String(SpotId),
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${String(token)}`,
          'Content-Type': 'application/json',
        },
      }
    )
      .then((response) => {
        if (response.status === 200) {
          console.log('success');
          console.log(response);
          if (response) {
            return resolve(response);
          }
        } else {
          // 如果状态码不是200，我们要解析JSON来找出错误原因
          response
            .json()
            .then((data) => {
              console.log(data.error);
              let errorReason = 'An unknown error occurred.';
              if (data.error === '') {
                errorReason = '';
              } else if (data.error) {
                errorReason = '';
              }
              reject(errorReason);
            })
            .catch(() => {
              reject(new Error('Error parsing response JSON.'));
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });
};
// the api to block the spot
export const callAPIBlockSpot = (path, SpotId, token) => {
  return new Promise((resolve, reject) => {
    fetch(
      '/api/' +
        String(SpotId),
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${String(token)}`,
          'Content-Type': 'application/json',
        },
      }
    )
      .then((response) => {
        if (response.status === 200) {
          console.log('success');
          console.log(response);
          if (response) {
            return resolve(response);
          }
        } else {
          // 如果状态码不是200，我们要解析JSON来找出错误原因
          response
            .json()
            .then((data) => {
              console.log(data.error);
              let errorReason = 'An unknown error occurred.';
              if (data.error === '') {
                errorReason = '';
              } else if (data.error) {
                errorReason = '';
              }
              reject(errorReason);
            })
            .catch(() => {
              reject(new Error('Error parsing response JSON.'));
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });
};
// the api to hidden the spot
export const callAPIHiddenSpot = (path, SpotId, token) => {
  return new Promise((resolve, reject) => {
    fetch(
      '/api/' +
        String(SpotId),
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${String(token)}`,
          'Content-Type': 'application/json',
        },
      }
    )
      .then((response) => {
        if (response.status === 200) {
          console.log('success');
          console.log(response);
          if (response) {
            return resolve(response);
          }
        } else {
          // if the status code is not 200, we need to parse the JSON to find out the error reason
          response
            .json()
            .then((data) => {
              console.log(data.error);
              let errorReason = 'An unknown error occurred.';
              if (data.error === '') {
                errorReason = '';
              } else if (data.error) {
                errorReason = '';
              }
              reject(errorReason);
            })
            .catch(() => {
              reject(new Error('Error parsing response JSON.'));
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });
};
// the api to create the order
export const callAPICreateOrder = (path, token, input) => {
  return new Promise((resolve, reject) => {
    console.log(input);
    console.log('token: ' + token);
    console.log('/api/' + String(path));
    fetch('/api/' + String(path), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${String(token)}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    })
      .then((response) => {
        if (response.status === 200) {
          console.log('success');
          return response.json().then((data) => resolve(data));
        } else {
          //  if the error is invalid manager, it means the user is not an employee of the company
          response
            .json()
            .then((data) => {
              console.log(data.error);
              let errorReason = 'An unknown error occurred.';
              if (data.error === 'invalid manager') {
                errorReason =
                  'It looks like you are not an employee of our company.';
              } else if (data.error) {
                errorReason = 'User has been registered!';
              }
              reject(errorReason);
            })
            .catch(() => {
              reject(new Error('Error parsing response JSON.'));
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });
};

// the api to get all review
export const callAPIGetAllreview = (path) => {
  return new Promise((resolve, reject) => {
    console.log('/api/' + String(path));
    fetch('/api/' + String(path), {
      method: 'GET',
      headers: {},
    })
      .then((response) => {
        if (response.status === 200) {
          console.log('success');
          console.log(response);
          return response.json().then((data) => resolve(data));
        } else {
          // 如果状态码不是200，我们要解析JSON来找出错误原因
          response
            .json()
            .then((data) => {
              console.log(data.error);
              let errorReason = 'An unknown error occurred.';
              if (data.error === '') {
                errorReason = '';
              } else if (data.error) {
                errorReason = '';
              }
              reject(errorReason);
            })
            .catch(() => {
              reject(new Error('Error parsing response JSON.'));
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });
};
// the api to get a specific vocher
export const callAPIGetSpecificVocher = (path, token) => {
  return new Promise((resolve, reject) => {
    console.log('/api/' + String(path));
    fetch('/api/' + String(path), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${String(token)}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.status === 200) {
          console.log('success');
          console.log(response);
          return response.json().then((data) => resolve(data));
        } else if (response.status === 404) {
          let errorReason = 'Voucher not found.';
          reject(errorReason);
        } else {
          // 如果状态码不是200，我们要解析JSON来找出错误原因
          response
            .json()
            .then((data) => {
              console.log(data.error);
              let errorReason = 'Voucher has been used.';
              reject(errorReason);
            })
            .catch((error) => {
              console.log(error);
              reject(new Error('Error parsing response JSON.'));
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });
};
// the api to use a specific vocher
export const callAPIUseSpecificVocher = (path, token) => {
  return new Promise((resolve, reject) => {
    console.log('/api/' + String(path));
    fetch('/api/' + String(path), {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${String(token)}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.status === 200) {
          console.log('success');
          console.log(response);
          return response.json().then((data) => resolve(data));
        } else if (response.status === 404) {
          let errorReason = 'Voucher not found.';
          reject(errorReason);
        } else {
          // 如果状态码不是200，我们要解析JSON来找出错误原因
          response
            .json()
            .then(() => {
              let errorReason = 'Voucher has been used.';
              reject(errorReason);
            })
            .catch(() => {
              reject(new Error('Error parsing response JSON.'));
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });
};
