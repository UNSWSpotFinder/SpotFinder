import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import React, { useState, useEffect, createContext,useContext } from 'react';

import { styled } from '@mui/material';

export const ErrorContext = createContext({
    snackbarData: { severity: 'info', message: '1' },
    setOpenSnackbar: () => {}, // 提供一个空函数避免调用时出错
  });
export const useError = () => useContext(ErrorContext);
export const ErrorProvider = ({ children }) => {
  const [snackbarData, setSnackbarData] = useState({
    severity: 'success',
    message: '',
  });
  const setOpenSnackbar = (data) => {
    setSnackbarData(data);
  };
  return (
    <ErrorContext.Provider value={{snackbarData,setOpenSnackbar}}>
      {children}
    </ErrorContext.Provider>
  );
};
// The message to be displayed in the Snackbar
export const GlobalSnackbar = () => {
const { snackbarData, setOpenSnackbar } = useError();
// State to manage the visibility of the Snackbar
const [open, setOpen] = useState(false);
  useEffect(() => {
    console.log('Alert severity:', snackbarData.severity);
    console.log('Alert :', snackbarData.message);
    if (snackbarData.message) {
      setOpen(true);
    }
  }, [snackbarData.message]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

return (
    // Snackbar component with automatic hiding and custom styling
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={snackbarData.severity}>
        {snackbarData.message}
        </Alert>
  </Snackbar>
);
};
