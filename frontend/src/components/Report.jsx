import React, {
    useState,
    ChangeEvent,
    useContext,
    LabelHTMLAttributes,
    useRef,
    useEffect,
    useError,useParams,useNavigate
  } from 'react';
  import { styled } from '@mui/material';

  import { callAPIApproveSpot, } from '../API';



const CfmContent = styled('div')({
    position: 'absolute',
    zIndex: '4',
    width: '80%',
    height: '350px',
    backgroundColor: 'rgb(255, 255, 255)',
    borderRadius: '10px',
    boxShadow: '0px 1px 10px 1px rgba(42, 42, 42, 0.5)',
  });
  const CfmHeight = styled('div')({
    width: '100%',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    borderBottom: '1px solid rgb(200, 200, 200)',
  });
  const CfmClose = styled('button')({
    alignItems: 'center',
    justifyContent: 'center',
    height: '30px',
    margin: '0px',
    marginLeft: '10px',
    cursor: 'pointer',
    display: 'flex',
    border: '1px solid black',
    width: '90px',
    fontWeight: '500',
    letterSpacing: '0.2px',
    backgroundColor: 'rgb(255, 255, 255)',
    // margin: '20px 0px 10px 0px',
    padding: '0px 10px 0px 10px',
    borderRadius: '20px',
  });
  const CfmRowCol = styled('div')({
    display: 'flex',
    fontSize: '20px',
    flexDirection: 'column',
    height: 'auto',
    margin: '10px 10% 0px 10%',
    paddingBottom: '10px',
  });
  const CfmLefttxt = styled('p')({
    textAlign: 'left',
    margin: '0px',
    marginBottom: '10px',
    fontSize: '16px',
    color: 'rgb(42, 42, 42)',
  });
  const CfmHead = styled('p')({
    '@media (max-width: 390px)': {
      margin: '20px 30px 0px 0px',
    },
    '@media (min-width: 390px)': {
      margin: '20px 90px 0px 0px',
    },
    fontSize: '20px',
    width: '100%',
    height: '50px',
    textAlign: 'center',
    letterSpacing: '0.2px',
    color: 'rgb(48, 48, 48)',
  });
  const ReserveConfirm = styled('button')({
    marginBottom: '15px',
    backgroundColor: 'rgb(202, 16, 16)',
    fontSize: '16px',
    width: '80%',
    letterSpacing: '1px',
    height: '40px',
    border: '0px',
    margin: '10px 10%',
    borderRadius: '7px',
    color: 'white',
    '&:hover': {
      backgroundColor: 'rgb(154, 13, 13);',
      color: 'white',
    },
  });
  const ReserveConfirmblack = styled('button')({
    marginBottom: '15px',
    backgroundColor: 'rgb(0, 0, 0)',
    fontSize: '16px',
    width: '80%',
    letterSpacing: '1px',
    height: '40px',
    border: '0px',
    margin: '10px 10%',
    borderRadius: '7px',
    color: 'white',
    '&:hover': {
      color: 'rgb(180, 180, 180);',
    },
  });
  const ReserveConfirmgray = styled('button')({
    marginBottom: '15px',
    backgroundColor: 'rgb(245, 245, 245)',
    fontSize: '16px',
    width: '80%',
    letterSpacing: '1px',
    height: '40px',
    border: '0px',
    margin: '10px 10%',
    borderRadius: '7px',
    color: 'black',
    '&:hover': {
      backgroundColor: 'rgb(235, 235, 235)',
    },
  });
  // 修改
  export const ApproveCheck = ({ data, isOpen, close }) => {
    // get the set open snackbar function
    const { _ , setOpenSnackbar } = useError();
    const { adminid, Spotid } = useParams();
    // use the navigate to go to the user page
    const navigate = useNavigate();
    // get the hosting id from the url
    // go to the user page
    // go back to detail page
    const back = () => {
      close();
    };
    // this function used when the user click the confirm button
    const SendFeedback = () => {
      setOpenSnackbar({
        severity: 'success',
        message: 'Spot successfully approved!',
        timestamp: new Date().getTime(),
      });
      navigate('/admin/' + adminid);
    };
    const Approve = (id) => {
      callAPIApproveSpot(
        'manager/approve',
        id,
        localStorage.getItem('token'),
      )
      .then((response) => {
          console.log(response);
          SendFeedback();
      })
      .catch((error) => {
          console.log('np');
          console.log(data);
          setOpenSnackbar({
            severity: 'warning',
            message: error,
            timestamp: new Date().getTime(),
          });
      });
    };
    // const EditInfo = (id) => {
    //   callAPIEditSpot(
    //     'spot/modifySpotInfo/' + id,
    //     data,
    //     localStorage.getItem('token')
    //   )
    //   .then((response) => {
    //       console.log(response);
    //       Approve(id);
    //   })
    //   .catch((error) => {
    //       console.log('np');
    //       console.log(data);
    //       setOpenSnackbar({
    //         severity: 'warning',
    //         message: error,
    //         timestamp: new Date().getTime(),
    //       });
    //   });
      // change the conponment
    //   console.log(data);
    // };
    let conponment = (
      <div className='CfmAll'>
        <div className='CfmBack'></div>
        <CfmContent>
          <CfmHeight>
            <CfmClose onClick={back}>{'Back'}</CfmClose>
            <CfmHead>Spot Approve Response</CfmHead>
          </CfmHeight>
          <CfmRowCol>
            <CfmLefttxt>{'Your Feedback to the provider'}</CfmLefttxt>
            <textarea defaultValue={'No change, Default Approval.'} className='Feedback'></textarea>
          </CfmRowCol>
          <ReserveConfirm>
            Add report
          </ReserveConfirm>
        </CfmContent>
      </div>
    );
    return isOpen ? conponment : null;
  };