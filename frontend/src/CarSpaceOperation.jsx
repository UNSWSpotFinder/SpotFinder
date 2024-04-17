import React, { useState, useRef, useEffect } from 'react';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import './HomePage.css';
import './CarSpaceOpearation.css';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useError,
  GetDistance,
  HoverImage,
  callAPICreateSpot,
  callAPIGetSpecSpot,
  callAPIEditSpot,
} from './API';

// CreatHostingPage
export const CreateSpace = () => {
  //
  const [Useable, setUseable] = useState(false);
  const { setOpenSnackbar } = useError();
  // link the ref for thumb and other img
  const RefT = useRef(null);
  const RefFile = useRef(null);
  // if the button click then open the file loader
  const HandleT = () => {
    if (RefT.current) {
      RefT.current.click();
    }
  };
  // if the button click then open the file loader
  const HandleFile = () => {
    if (RefFile.current) {
      RefFile.current.click();
    }
  };
  const navigate = useNavigate();
  // set title empty;
  const [lengthOfTitle, setlength] = useState(0);
  // set type empty;
  const [SpaceType, setType] = useState('');
  // set charge empty;
  const [charge, setCharge] = useState('');
  // when the charge change
  const ChangeCharge = (event) => {
    const target = event.target;
    if (target.id) {
      setCharge(target.id);
    }
  };
  // set passway empty;
  const [PassWay, setPassWay] = useState('');
  // when the passway change
  const ChangePassWay = (event) => {
    const target = event.target;
    if (target.id) {
      setPassWay(target.id);
    }
  };
  // set all booking type false
  const [isHour, setisHour] = useState(false);
  const [isDay, setisDay] = useState(false);
  const [isWeek, setWeek] = useState(false);
  // set type empty;
  const [CarType, setCarType] = useState('');
  // set contry empty
  const [Country, setCountry] = useState('');
  const handleCountryChange = (event) => {
    setCountry(event.target.value);
  };
  // set street empty
  const [Street, setStreet] = useState('');
  const handleStreetChange = (event) => {
    setStreet(event.target.value);
  };
  // set city empty
  const [City, setCity] = useState('');
  const handleCityChange = (event) => {
    setCity(event.target.value);
  };
  // set state empty
  const [State, setState] = useState('');
  const handleStateChange = (event) => {
    setState(event.target.value);
  };
  // set postcode empty
  const [Postcode, setPostcode] = useState('');
  const handlePostcodeChange = (event) => {
    setPostcode(event.target.value);
  };
  // set thumbil empty
  const [Thumbil, setThumbil] = useState('');
  // set all facility false
  const [Title, setTitle] = useState('');
  const handleTitleChange = (event) => {
    setTitle(event.target.value);
    setlength(event.target.value.length);
  };
  // set price for daily
  const [PriseDay, setPriceDay] = useState('');
  const handlePriceDayChange = (event) => {
    setPriceDay(event.target.value);
  };
  // set price for daily
  const [PriseWeek, setPriceWeek] = useState('');
  const handlePriceWeekChange = (event) => {
    setPriceWeek(event.target.value);
  };
  // set price for daily
  const [PriseHour, setPriceHour] = useState('');
  const handlePriceHourChange = (event) => {
    setPriceHour(event.target.value);
  };
  // when the type is changed
  const ChangeType = (event) => {
    const target = event.target;
    if (target.id) {
      setType(target.id);
    }
  };
  // when the car type is changed
  const ChangeCarType = (event) => {
    const target = event.target;
    if (target.id) {
      setCarType(target.id);
    }
  };
  // goes to the host page
  const goesHost = () => {
    navigate(-1);
  };
  // set all errorText shown false
  const [ErrorText1, setErrorText1] = useState(false);
  const [ErrorText2, setErrorText2] = useState(false);
  const [ErrorText3, setErrorText3] = useState(false);
  const [ErrorText4, setErrorText4] = useState(false);
  const [ErrorText5, setErrorText5] = useState(false);
  const [ErrorText6, setErrorText6] = useState(false);
  const [ErrorText7, setErrorText7] = useState(false);
  const [ErrorText8, setErrorText8] = useState(false);
  const [ErrorText9, setErrorText9] = useState(false);
  // set all errorText shown false
  const setAllfalse = () => {
    setErrorText1(false);
    setErrorText2(false);
    setErrorText3(false);
    setErrorText4(false);
    setErrorText5(false);
    setErrorText6(false);
    setErrorText7(false);
    setErrorText8(false);
    setErrorText9(false);
  };
  // set all scroll position empty
  const [errorContent, setErrorContent] = useState('');
  // set all scroll position empty
  const scrollToQ1 = useRef(null);
  const scrollToQ2 = useRef(null);
  const scrollToQ3 = useRef(null);
  const scrollToQ4 = useRef(null);
  const scrollToQ5 = useRef(null);
  const scrollToQ6 = useRef(null);
  const scrollToQ7 = useRef(null);
  const scrollToQ8 = useRef(null);
  const scrollToQ9 = useRef(null);
  // set all image empty
  const [AllImaegsString, setSelectedImageString] = useState([]);
  // convert the image to string
  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      // read the image
      const reader = new FileReader();
      reader.onload = (event) => {
        // set the image
        if (event.target) {
          const base64String = event.target.result;
          resolve(base64String);
        }
      };
      // when meet error
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  };
  // convert all images to string
  const convertAllImagesToBase64 = (imageFiles) => {
    const base64Promises = imageFiles.map((file) => convertImageToBase64(file));
    return Promise.all(base64Promises);
  };
  // check a image is a 64base Image
  const isValidBase64Image = (base64String) => {
    // if not valid Base64 image
    if (!base64String.startsWith('data:image/')) {
      return false;
    }
    try {
      // if the image is empty
      if (base64String.trim() === '') {
        return false;
      }
      const datas = base64String;
      const realdata = String(datas.split(',')[1]);
      // Decode the base64 string
      const decodedData = btoa(atob(realdata));
      // if the decode and encode is same then true;
      return decodedData === realdata;
    } catch (error) {
      // when meet error show error
      setOpenSnackbar({
        severity: 'error',
        message: 'Your image is not follow 64base encode !',
      });
      setOpenSnackbar({
        severity: 'error',
        message: '',
      });
      console.log(error);
      return false; // Invalid base64 or unable to decode
    }
  };
  // add the thumbil to the page
  const AddThumbil = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      // get the first element
      const file = files[0];
      // start render
      const reader = new FileReader();
      if (file) {
        // loading these image
        reader.onload = (event) => {
          if (event.target) {
            // if the data is valid then set it else prompt error
            const base64Data = event.target.result;
            if (isValidBase64Image(base64Data)) {
              // valid file
              setAllfalse();
              console.log(base64Data);
              setThumbil(base64Data);
            } else {
              // invalid file
              setAllfalse();
              setErrorContent('Not a valid image!');
              setErrorText7(true);
            }
          }
        };
        // when meet error
        reader.onerror = (event) => {
          // if the target is not null
          if (event.target) {
            // show error
            console.error('Error reading file:', event.target.error);
            setAllfalse();
            setErrorContent('Error reading file');
            setErrorText7(true);
          }
        };
        // start read the file
        reader.readAsDataURL(file);
      }
    }
  };
  // initial the file is null
  const [fileInputValue, setFileInputValue] = useState('');
  // add the image to the page
  const AddImage = (event) => {
    // get the files
    const files = event.target.files;
    // if the files is not null
    if (files && files.length > 0) {
      // get the all files
      const promises = Array.from(files).map((file) => {
        return new Promise((resolve, reject) => {
          // read the file
          const reader = new FileReader();
          // when the file is loaded
          reader.onload = (event) => {
            // if the target is not null
            if (event.target) {
              // get the base64 string
              const base64Data = event.target.result;
              // if the image is valid
              if (isValidBase64Image(base64Data)) {
                // valid file
                resolve(file);
              } else {
                // invalid file
                reject(new Error('Not a valid image!'));
              }
            }
          };
          // when meet error
          reader.onerror = (event) => {
            // if the target is not null
            if (event.target) {
              // show error
              console.error('Error reading file:', event.target.error);
              reject(new Error('Error reading file'));
            }
          };
          // start read the file
          reader.readAsDataURL(file);
        });
      });
      // when all files is loaded
      Promise.all(promises)
        // if the files is valid
        .then((results) => {
          // get the valid files
          const validFiles = results;
          // set all errormessgae hidden
          setAllfalse();
          // set the file input value
          convertAllImagesToBase64(validFiles)
            .then((base64Strings) => {
              // add the image to the page
              const base64array = base64Strings;
              setSelectedImageString([...AllImaegsString, ...base64array]);
            })
            .catch((error) => {
              // if the image is not valid
              // show error
              setOpenSnackbar({
                severity: 'error',
                message: 'Your Image upload has some error, please try again!',
              });
              setOpenSnackbar({
                severity: 'error',
                message: '',
              });
              // show error
              console.error(error);
            });
          // set the file input value to null
          setFileInputValue('');
        })
        .catch((error) => {
          // if the image is not valid
          // show error
          setOpenSnackbar({
            severity: 'error',
            message: 'Your Image upload has some error, please try again!',
          });
          // show error
          setOpenSnackbar({
            severity: 'error',
            message: '',
          });
          // set all errormessgae hidden
          setAllfalse();
          // show error
          setErrorContent(error);
          // scroll to the error message
          setErrorText7(true);
        });
    }
  };
  // remove the image from the page
  const RemoveImage = (index) => {
    // create new image list, remove the image
    const updatedImagesString = AllImaegsString.filter(
      (_, i) => String(i) !== index
    );
    setSelectedImageString(updatedImagesString);
  };
  // scroll to a element
  const scrollToElement = (ref) => {
    // if the ref is not null
    if (ref.current) {
      // scroll to the element
      console.log(ref.current);
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  // set the time interval
  const [timeIntervals, setTimeIntervals] = useState([]);
  const [FirstStart, setFirstStart] = useState(null);
  const [FirstEnd, setFirstEnd] = useState(null);
  const [Firstdistance, setDistance] = useState(0);
  // change the first available date
  const FirstStartChange = (date) => {
    setFirstStart(date);
    setDistance(GetDistance(date, FirstEnd));
  };
  // change the first available date
  const FirstEndChange = (date) => {
    setFirstEnd(date);
    setDistance(GetDistance(FirstStart, date));
  };
  // add an element to the interval
  const addTimeInterval = () => {
    setTimeIntervals((currentInterval) => [
      ...currentInterval,
      {
        id: Date.now(), // unique id
        startDate: null,
        endDate: null,
        distance: 0,
      },
    ]);
  };
  // when the start date change, then change the distance
  const handleStartDateChange = (index, date) => {
    setTimeIntervals((currentInterval) => {
      // add the new interval
      const newIntervals = currentInterval ? [...currentInterval] : [];
      const already = newIntervals[index];
      // check the interval is exist or not
      if (already) {
        // set the new interval value
        newIntervals[index] = {
          id: already.id,
          startDate: date,
          endDate: already.endDate,
          distance: GetDistance(date, already.endDate),
        };
      }
      // return the new interval or not
      return newIntervals || [];
    });
  };
  // when the end date change, then change the distance
  const handleEndDateChange = (index, date) => {
    // set the new interval value
    setTimeIntervals((currentInterval) => {
      // get the index of a interval
      const newIntervals = currentInterval ? [...currentInterval] : [];
      const already = newIntervals[index];
      // update the interval value
      if (already) {
        newIntervals[index] = {
          id: already.id,
          startDate: already.startDate,
          endDate: date,
          distance: GetDistance(already.startDate, date),
        };
      }
      // return the new interval or not
      return newIntervals;
    });
  };
  // when the user want to delete a interval
  const deleteInterval = (id) => {
    // delete the interval by filter the id
    setTimeIntervals((prevIntervals) =>
      prevIntervals.filter((interval) => interval.id !== id)
    );
  };
  // creat a new hosting
  const CreateNow = () => {
    // set the useable to true
    setUseable(true);
    // init the data
    const data = {
      spotName: String(Title),
      spotType: String(SpaceType),
      Size: String(CarType),
      charge: String(charge),
      passWay: String(PassWay),
      spotAddr: JSON.stringify({
        Country: Country,
        City: City,
        State: State,
        Postcode: Postcode,
        Street: Street,
      }),
      isDayRent: isDay,
      isOurRent: isHour,
      isWeekRent: isWeek,
      pricePerDay: parseFloat(PriseDay) || 0,
      pricePerHour: parseFloat(PriseHour) || 0,
      pricePerWeek: parseFloat(PriseWeek) || 0,
      pictures: Thumbil,
      morePictures: AllImaegsString,
      availableTime: timeIntervals,
    };
    // the price pattern
    const pricePattern = /^[1-9]\d{0,4}$/;
    // set confirmflag to true
    let Confirmflag = true;
    console.log(data);
    if (data) {
      // inital the data
      // if the spot type is empty
      if (data.spotType.length === 0) {
        console.log('no type');
        Confirmflag = false;
        setAllfalse();
        setErrorContent('You must select one type for your spot.');
        setErrorText1(true);
        scrollToElement(scrollToQ1);
        setUseable(false);
      }
      // if the spot size is empty
      if (Confirmflag && data.Size.length === 0) {
        console.log('no type');
        Confirmflag = false;
        setAllfalse();
        setErrorContent('You must select one type of car for your spot');
        setErrorText2(true);
        scrollToElement(scrollToQ2);
        setUseable(false);
      }
      // if the address is not empty
      if (Confirmflag && data.spotAddr) {
        setAllfalse();
        const letterPattern = /[a-zA-Z]+/;
        const numericPattern = /^[0-9]+$/;
        // if the content is not valid
        if (!letterPattern.test(Country)) {
          console.log('invalid country');
          setErrorContent('Your country name is invalid');
          Confirmflag = false;
        } else if (!letterPattern.test(Street)) {
          // if the street is not valid
          setErrorContent('Your street name is invalid');
          Confirmflag = false;
          console.log('invalid country');
        } else if (!letterPattern.test(City)) {
          // if the city is not valid
          setErrorContent('Your city name is invalid');
          Confirmflag = false;
          console.log('invalid country');
        } else if (!letterPattern.test(State)) {
          // if the state is not valid
          setErrorContent('Your state name is invalid');
          Confirmflag = false;
          console.log('invalid country');
        } else if (!numericPattern.test(Postcode)) {
          // if the postcode is not valid
          setErrorContent('Your Postcode name is invalid');
          Confirmflag = false;
          console.log('invalid postcode');
        }
        if (!Confirmflag) {
          // if the errorText is not valid
          setErrorText3(true);
          console.log(scrollToQ3);
          scrollToElement(scrollToQ3);
        }
        setUseable(false);
      }
      // if the spot passway is empty
      if (Confirmflag && data.passWay.length === 0) {
        console.log('no Passway');
        setAllfalse();
        setErrorContent('You must set a Passway for your hosting');
        setErrorText4(true);
        scrollToElement(scrollToQ4);
        Confirmflag = false;
        setUseable(false);
      }
      // if the spot charge is empty
      if (Confirmflag && data.charge.length === 0) {
        console.log('no title');
        setAllfalse();
        setErrorContent('You must set a charge information for your hosting.');
        setErrorText5(true);
        scrollToElement(scrollToQ5);
        Confirmflag = false;
        setUseable(false);
      }
      // if the spot title is empty
      if (Confirmflag && data.spotName.length === 0) {
        console.log('no title');
        setAllfalse();
        setErrorContent('You must set a title for your hosting');
        setErrorText6(true);
        scrollToElement(scrollToQ6);
        Confirmflag = false;
        setUseable(false);
      }
      // if the available booking way is empty
      if (Confirmflag && !(isDay || isHour || isWeek)) {
        console.log('No price');
        // set the error text
        setAllfalse();
        setErrorContent('Your must accept one kind of rent way');
        setErrorText7(true);
        Confirmflag = false;
        scrollToElement(scrollToQ7);
        setUseable(false);
      }
      // if the booking way allow the day rent
      if (Confirmflag && isDay && !pricePattern.test(PriseDay)) {
        console.log('No price');
        setAllfalse();
        setErrorContent('Your price must between 1 to 99999');
        setErrorText7(true);
        Confirmflag = false;
        scrollToElement(scrollToQ7);
        setUseable(false);
      }
      // if the booking way allow the hour rent
      if (Confirmflag && isHour && !pricePattern.test(PriseHour)) {
        console.log('No price');
        setAllfalse();
        setErrorContent('Your price must between 1 to 99999');
        setErrorText7(true);
        Confirmflag = false;
        scrollToElement(scrollToQ7);
        setUseable(false);
      }
      // if the booking way allow the week rent
      if (Confirmflag && isWeek && !pricePattern.test(PriseWeek)) {
        console.log('No price');
        setAllfalse();
        setErrorContent('Your price must between 1 to 99999');
        setErrorText7(true);
        Confirmflag = false;
        scrollToElement(scrollToQ7);
        setUseable(false);
      }
      // if the available time is not empty
      if (Confirmflag && (FirstStart === null || FirstEnd === null)) {
        // set all the error text false
        setAllfalse();
        setErrorContent('Your all of the time choice can not be null.');
        setErrorText8(true);
        Confirmflag = false;
        scrollToElement(scrollToQ8);
        setUseable(false);
      }
      // if all the available time is not empty
      if (Confirmflag) {
        // filter the invalid time
        const res = data.availableTime.filter((value) => {
          return value.startDate === null || value.endDate === null;
        });
        // if the result is not empty
        if (res.length !== 0) {
          // tell the user the error
          setAllfalse();
          setErrorContent('Your all of the time choice can not be null.');
          setErrorText8(true);
          Confirmflag = false;
          scrollToElement(scrollToQ8);
          setUseable(false);
        }
      }
      // if the image is empty
      if (Confirmflag && Thumbil === '') {
        setAllfalse();
        setErrorContent('You must show your hosting pictures to us');
        setErrorText9(true);
        Confirmflag = false;
        scrollToElement(scrollToQ9);
        setUseable(false);
      }
      // if the confirm flag is true
      if (Confirmflag) {
        // add the first time to the available time
        data.availableTime.unshift({
          id: Date.now(), // unique id
          startDate: FirstStart,
          endDate: FirstEnd,
          distance: GetDistance(FirstStart, FirstEnd),
        });
        // convert the available time to string
        data.availableTime = JSON.stringify(data.availableTime);
        // convert the more pictures to string
        data.morePictures = JSON.stringify(data.morePictures);
        // call the api to create the spot
        callAPICreateSpot('spot/create', data, localStorage.getItem('token'))
          .then((response) => {
            // if the response is ok
            console.log(response);
            // set the open snackbar to show the success message
            setOpenSnackbar({
              severity: 'success',
              message: 'Create Spot Successful!',
              timestamp: new Date().getTime(),
            });
            // navigate to the previous page
            navigate(-1);
          })
          // if the response is not ok
          .catch((error) => {
            // set the open snackbar to show the error message
            console.log(data);
            // call the snackbar to show the error message
            setOpenSnackbar({
              severity: 'warning',
              message: error,
              timestamp: new Date().getTime(),
            });
            // set the useable to false
            setUseable(false);
          });
      }
    } else {
      // set the useable to false
      setUseable(false);
    }
  };
  return (
    <div className='CreatChannelOverall'>
      <div className='CreatNewHeader'>
        <div className='CreateLogo'>
          <img className='ct-logo' src='/img/LOGO.svg' alt=''></img>
        </div>
        <div className='HeaderRightButtonPart'>
          <p className='HeaderRightButtonself' onClick={goesHost}>
            Exit
          </p>
        </div>
      </div>
      <div className='Q1' ref={scrollToQ1} id='Q1'>
        <p className='QoneQuestionPart'>
          Which of these best describes your CarSpace?
        </p>
        <div className='QoneAnswerPart'>
          <input
            className='QoneSelect'
            type='radio'
            name='accommodation'
            id='Carport'
            onClick={ChangeType}
          ></input>
          <label
            className={
              SpaceType === 'Carport' ? 'QoneShowSelected' : 'QoneShowSelect'
            }
            htmlFor='Carport'
            id='Hous'
          >
            Carport
          </label>
          <input
            className='QoneSelect'
            type='radio'
            name='accommodation'
            id='Driveway'
            onClick={ChangeType}
          />
          <label
            className={
              SpaceType === 'Driveway' ? 'QoneShowSelected' : 'QoneShowSelect'
            }
            htmlFor='Driveway'
            id='Apart'
          >
            Driveway
          </label>
          <input
            className='QoneSelect'
            type='radio'
            name='accommodation'
            id='Garage'
            onClick={ChangeType}
          />
          <label
            className={
              SpaceType === 'Garage' ? 'QoneShowSelected' : 'QoneShowSelect'
            }
            id='caBIN'
            htmlFor='Garage'
            checked={SpaceType === 'Cabin'}
          >
            Garage
          </label>
          <input
            className='QoneSelect'
            type='radio'
            name='accommodation'
            id='Parking-lot'
            onClick={ChangeType}
          />
          <label
            className={
              SpaceType === 'Parking-lot'
                ? 'QoneShowSelected'
                : 'QoneShowSelect'
            }
            htmlFor='Parking-lot'
            id='Hot'
            checked={SpaceType === 'Hotel'}
          >
            Parking-lot
          </label>
        </div>
        {ErrorText1 && <p className='CreateError'>{errorContent}</p>}
      </div>
      <div className='Q' ref={scrollToQ2} id='Q2'>
        <p className='QtwoQ'>
          What type of cars can be parked in this parking space?
        </p>
        <p className='QtwoQsub'>
          Choose the largest vehicle your parking space can accommodate.
        </p>
        <div className='QoneAnswerPart'>
          <input
            className='QoneSelect'
            type='radio'
            name='cartype'
            id='Bike'
            onClick={ChangeCarType}
          ></input>
          <label
            className={
              CarType === 'Bike' ? 'QfourShowSelected' : 'QfourShowSelect'
            }
            htmlFor='Bike'
            id='Hous'
          >
            Bike
          </label>
          <input
            className='QoneSelect'
            type='radio'
            name='cartype'
            id='Sedan'
            onClick={ChangeCarType}
          />
          <label
            className={
              CarType === 'Sedan' ? 'QfourShowSelected' : 'QfourShowSelect'
            }
            htmlFor='Sedan'
            id='Apart'
          >
            Sedan
          </label>
          <input
            className='QoneSelect'
            type='radio'
            name='cartype'
            id='Hatchback'
            onClick={ChangeCarType}
          />
          <label
            className={
              CarType === 'Hatchback' ? 'QfourShowSelected' : 'QfourShowSelect'
            }
            id='caBIN'
            htmlFor='Hatchback'
          >
            Hatchback
          </label>
          <input
            className='QoneSelect'
            type='radio'
            name='cartype'
            id='4WD/SUV'
            onClick={ChangeCarType}
          />
          <label
            className={
              CarType === '4WD/SUV' ? 'QfourShowSelected' : 'QfourShowSelect'
            }
            htmlFor='4WD/SUV'
            id='Hot'
          >
            4WD/SUV
          </label>
          <input
            className='QoneSelect'
            type='radio'
            name='cartype'
            id='VAN'
            onClick={ChangeCarType}
          />
          <label
            className={
              CarType === 'VAN' ? 'QfourShowSelected' : 'QfourShowSelect'
            }
            htmlFor='VAN'
            id='Hot'
            checked={SpaceType === 'Hotel'}
          >
            VAN
          </label>
        </div>
        {ErrorText2 && <p className='CreateError'>{errorContent}</p>}
      </div>
      <div className='Q' ref={scrollToQ3} id='Q3'>
        <p className='QtwoQ'>Tell us about your address</p>
        <p className='QtwoQsub'>
          Your location will help customers better find parking spaces.
        </p>
        <div className='QtwoQasw'>
          <div className='QtwoQaswrow' tabIndex={0}>
            <label className='QtwoQaswLable'>Country/Region</label>
            <input
              className='QtwoQaswInput'
              id='country'
              value={Country}
              onChange={handleCountryChange}
            ></input>
          </div>
          <div className='QtwoQaswrow' tabIndex={0}>
            <label className='QtwoQaswLable'>Street address</label>
            <input
              className='QtwoQaswInput'
              id='street'
              value={Street}
              onChange={handleStreetChange}
            ></input>
          </div>
          <div className='QtwoQaswrow' tabIndex={0}>
            <label className='QtwoQaswLable'>Suburb/city</label>
            <input
              className='QtwoQaswInput'
              id='city'
              value={City}
              onChange={handleCityChange}
            ></input>
          </div>
          <div className='QtwoQaswrow' tabIndex={0}>
            <label className='QtwoQaswLable'>State/territory</label>
            <input
              className='QtwoQaswInput'
              id='state'
              value={State}
              onChange={handleStateChange}
            ></input>
          </div>
          <div className='QtwoQaswrow' tabIndex={0}>
            <label className='QtwoQaswLable'>Postcode</label>
            <input
              className='QtwoQaswInput'
              id='postcode'
              value={Postcode}
              onChange={handlePostcodeChange}
            ></input>
          </div>
        </div>
        {ErrorText3 && <p className='CreateError'>{errorContent}</p>}
      </div>
      <div className='Q' ref={scrollToQ4} id='Q4'>
        <p className='Q4q'>Tell customers how to park in your space ?</p>
        <p className='QtwoQsub'>
          Make sure your parking space is accessible to customers.
        </p>
        <div className='QoneAnswerPart'>
          <input
            className='QoneSelect'
            type='checkbox'
            name='passway'
            id='Nones'
            onChange={ChangePassWay}
          />
          <label
            className={
              PassWay === 'Nones' ? 'QfourShowSelected' : 'QfourShowSelect'
            }
            id='wifi'
            htmlFor='Nones'
          >
            None
          </label>
          <input
            className='QoneSelect'
            type='checkbox'
            name='passway'
            id='Physical key'
            onChange={ChangePassWay}
          />
          <label
            className={
              PassWay === 'Physical key'
                ? 'QfourShowSelected'
                : 'QfourShowSelect'
            }
            htmlFor='Physical key'
            id='tv'
          >
            {'Physical key'}
          </label>
          <input
            className='QoneSelect'
            type='checkbox'
            name='passway'
            id='Password'
            onChange={ChangePassWay}
          />
          <label
            className={
              PassWay === 'Password' ? 'QfourShowSelected' : 'QfourShowSelect'
            }
            htmlFor='Password'
            id='kitch'
          >
            Password
          </label>
          <input
            className='QoneSelect'
            type='checkbox'
            name='passway'
            id='Digital Card'
            onChange={ChangePassWay}
          />
          <label
            className={
              PassWay === 'Digital Card'
                ? 'QfourShowSelected'
                : 'QfourShowSelect'
            }
            htmlFor='Digital Card'
            id='washing-machine'
          >
            {'Digital Card'}
          </label>
        </div>
        {ErrorText4 && <p className='CreateError'>{errorContent}</p>}
      </div>
      <div className='Q' ref={scrollToQ5} id='Q5'>
        <p className='Q4q'>
          Tell guests what type of the Electric charging this space parking
          offer?
        </p>
        <p className='QtwoQsub'>
          Equipped with charging stations will make your parking space stand
          out.
        </p>
        <div className='QoneAnswerPart'>
          <input
            className='QoneSelect'
            type='checkbox'
            name='charge'
            id='None'
            onChange={ChangeCharge}
          />
          <label
            className={
              charge === 'None' ? 'QfourShowSelected' : 'QfourShowSelect'
            }
            id='wifi'
            htmlFor='None'
          >
            None
          </label>
          <input
            className='QoneSelect'
            type='checkbox'
            name='charge'
            id='Wall(AU/NZ)'
            onChange={ChangeCharge}
          />
          <label
            className={
              charge === 'Wall(AU/NZ)' ? 'QfourShowSelected' : 'QfourShowSelect'
            }
            htmlFor='Wall(AU/NZ)'
            id='tv'
          >
            {'Wall(AU/NZ)'}
          </label>
          <input
            className='QoneSelect'
            type='checkbox'
            name='charge'
            id='SAE J-1772'
            onChange={ChangeCharge}
          />
          <label
            className={
              charge === 'SAE J-1772' ? 'QfourShowSelected' : 'QfourShowSelect'
            }
            htmlFor='SAE J-1772'
            id='kitch'
          >
            {'SAE J-1772'}
          </label>

          <input
            className='QoneSelect'
            type='checkbox'
            name='charge'
            id='Type2'
            onChange={ChangeCharge}
          />
          <label
            className={
              charge === 'Type2' ? 'QfourShowSelected' : 'QfourShowSelect'
            }
            htmlFor='Type2'
            id='washing-machine'
          >
            {'Type2'}
          </label>
          <input
            className='QoneSelect'
            type='checkbox'
            name='charge'
            id='CHAdeMO'
            onChange={ChangeCharge}
          />
          <label
            className={
              charge === 'CHAdeMO' ? 'QfourShowSelected' : 'QfourShowSelect'
            }
            htmlFor='CHAdeMO'
            id='air-cond'
          >
            CHAdeMO
          </label>
          <input
            className='QoneSelect'
            type='checkbox'
            name='accommodation'
            id='Free-Parking'
            onChange={ChangeCharge}
          />
        </div>
        {ErrorText5 && <p className='CreateError'>{errorContent}</p>}
      </div>
      <div className='Q' ref={scrollToQ6} id='Q6'>
        <p className='Q4q'>Now, lets give your spot a title.</p>
        <p className='QtwoQsub'>
          Short titles work best. Have fun with it—you can always change it
          later.
        </p>
        <div className='QoneAnswerPart'>
          <textarea
            className='Q5A'
            id='hosting-title'
            maxLength={32}
            onChange={handleTitleChange}
            value={Title}
          ></textarea>
        </div>
        <p className='LengthDetector'>{lengthOfTitle}/32</p>
        {ErrorText6 && <p className='CreateError'>{errorContent}</p>}
      </div>
      <div className='Q' ref={scrollToQ7} id='Q7'>
        <p className='Q4q'>Next we'll help you set up your parking revenue.</p>
        <p className='QtwoQsub'>
          You can change it anytime and 15% of the fee your earned would be
          deducted by the platform as the service fee.
        </p>
        <div className='Q6aDiv'>
          <div className='Q6-row'>
            <div className='row-left'>
              <input
                type='checkbox'
                className='Q6ck'
                checked={isHour}
                onChange={() => {
                  setisHour(!isHour);
                }}
              ></input>
              <p className='Q6AP'>I'm okay with hourly rentals.</p>
            </div>
            <div className='row-right'>
              <p className='Q6AP'>$</p>
              <input
                className='Q6aInput'
                id='price'
                placeholder='0'
                maxLength={5}
                value={PriseHour}
                onChange={handlePriceHourChange}
                disabled={!isHour}
              ></input>
              <p className='Q6AP'>per hour.</p>
            </div>
          </div>

          <div className='Q6-row'>
            <div className='row-left'>
              <input
                type='checkbox'
                className='Q6ck'
                checked={isDay}
                onChange={() => {
                  setisDay(!isDay);
                }}
              ></input>
              <p className='Q6AP'>I'm okay with daily rentals.</p>
            </div>
            <div className='row-right'>
              <p className='Q6AP'>$</p>
              <input
                className='Q6aInput'
                id='price'
                placeholder='0'
                maxLength={5}
                value={PriseDay}
                onChange={handlePriceDayChange}
                disabled={!isDay}
              ></input>
              <p className='Q6AP'>per day.</p>
            </div>
          </div>
          <div className='Q6-row'>
            <div className='row-left'>
              <input
                type='checkbox'
                className='Q6ck'
                checked={isWeek}
                onChange={() => {
                  setWeek(!isWeek);
                }}
              ></input>
              <p className='Q6AP'>I'm okay with weekly rentals.</p>
            </div>
            <div className='row-right'>
              <p className='Q6AP'>$</p>
              <input
                className='Q6aInput'
                id='price'
                placeholder='0'
                maxLength={5}
                value={PriseWeek}
                onChange={handlePriceWeekChange}
                disabled={!isWeek}
              ></input>
              <p className='Q6AP'>per week.</p>
            </div>
          </div>
        </div>
        {ErrorText7 && <p className='CreateError'>{errorContent}</p>}
      </div>
      <div className='Q' ref={scrollToQ8} id='Q8'>
        <p className='Q4q'>
          Now let's set the available time for the parking space.
        </p>
        <p className='QtwoQsub'>You can change it anytime.</p>
        <div className='Q6aDiv'>
          <div className='PublishInfo'>
            <div className='IntervalHeader'>
              <p className='PublishTitle'>Available Time</p>
              <button className='AddInterval' onClick={addTimeInterval}>
                Add available time
              </button>
            </div>
            <div className='TimeInterval'>
              <div className='IntervalHeader'>
                <div className='Avtxt'>Available Time{' ' + 1}</div>
              </div>
              <div className='IntervalContent'>
                <div className='TimeBlock'>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker', 'DatePicker']}>
                      <DatePicker
                        label='Start Date'
                        value={FirstStart}
                        onChange={(date) => {
                          if (date) FirstStartChange(date);
                        }}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </div>
                <p className='TO'> - </p>
                <div className='TimeBlock'>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker', 'DatePicker']}>
                      <DatePicker
                        label='End Date'
                        value={FirstEnd}
                        onChange={(date) => {
                          if (date) FirstEndChange(date);
                        }}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </div>
              </div>
              <div className='IntervalBottom'>
                <div className='Pricetxt'>Totol Day{'  ' + Firstdistance}</div>
              </div>
            </div>
            {timeIntervals.map((interval, index) => (
              <div className='TimeInterval' key={interval.id}>
                <div className='IntervalHeader'>
                  <div className='Avtxt'>Available Time{' ' + (index + 2)}</div>
                  <button
                    className='ClearInterval'
                    onClick={() => {
                      deleteInterval(interval.id);
                    }}
                  >
                    Delete Interval
                  </button>
                </div>
                <div className='IntervalContent'>
                  <div className='TimeBlock'>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={['DatePicker', 'DatePicker']}>
                        <DatePicker
                          label='Start Date'
                          value={interval.startDate}
                          onChange={(date) => {
                            if (date) handleStartDateChange(index, date);
                          }}
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                  </div>
                  <p className='TO'> - </p>
                  <div className='TimeBlock'>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={['DatePicker', 'DatePicker']}>
                        <DatePicker
                          label='End Date'
                          value={interval.startDate}
                          onChange={(date) => {
                            if (date) handleEndDateChange(index, date);
                          }}
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                  </div>
                </div>
                <div className='IntervalBottom'>
                  <div className='Pricetxt'>
                    Totol Day{'  ' + interval.distance}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {ErrorText8 && <p className='CreateError'>{errorContent}</p>}
      </div>
      <div className='Q' ref={scrollToQ9} id='Q9'>
        <p className='Q4q'>Add some photos of your barn</p>
        <p className='QtwoQsub'>
          You’ll need one photos to get started. This photo would as your
          hosting Thumbnail.
        </p>
        <div className='Q7aDiv'>
          <input
            className='QoneSelect'
            id='upload'
            onChange={AddThumbil}
            type='file'
            ref={RefT}
            accept='image/*'
          ></input>
          <img
            className='UploadIMG'
            id='callupload'
            onClick={HandleT}
            src={Thumbil || '/img/addusr.png'}
            alt='Upload from your device'
          ></img>
        </div>
        {ErrorText9 && <p className='CreateError'>{errorContent}</p>}
      </div>
      <div className='Q' id='Q10'>
        <p className='Q4q'>Add more photos of your barn</p>
        <p className='QtwoQsub'>
          This is optional if you want show more of your hosting. You can add
          more or make changes later. The first photo would as your hosting
          Thumbnail.
        </p>
        <div className='Q7aDiv'>
          <input
            className='QoneSelect'
            id='upload'
            onChange={AddImage}
            type='file'
            ref={RefFile}
            value={fileInputValue}
            accept='image/*'
          ></input>
          <button className='UploadButton' onClick={HandleFile}>
            Upload from your device
          </button>
        </div>
        {AllImaegsString.map((item, index) => (
          <div
            className='LasteachImage'
            key={index}
            onClick={() => RemoveImage(String(index))}
          >
            <HoverImage src={item} alt={`Image ${index}`} />
          </div>
        ))}
      </div>
      <div className='QButton'>
        <button
          className='CreatButton'
          onClick={CreateNow}
          disabled={Useable}
          type='button'
        >
          Create your hosting
        </button>
      </div>
    </div>
  );
};

// EditHostingPage
export const EditSpace = () => {
  // get the snackbar to show the error
  const { setOpenSnackbar } = useError();
  // get the spot id from the url
  const { Spotid } = useParams();
  // when load the page get the details of the spot
  useEffect(() => {
      // get the details of the spot
  let getDetail = (Spotid) => {
    // call the api to get the details of the spot
    callAPIGetSpecSpot('spot/' + Spotid)
      .then((response) => {
        // if the response is successful
        console.log(response);
        // set the details of the spot
        setCarType(response.message.Size);
        setCharge(response.message.Charge);
        setPassWay(response.message.PassWay);
        setType(response.message.SpotType);
        setTitle(response.message.SpotName);
        setisDay(response.message.IsDayRent);
        setPriceDay(response.message.PricePerDay);
        setisHour(response.message.IsHourRent);
        setPriceHour(response.message.PricePerHour);
        setWeek(response.message.IsWeekRent);
        setPriceWeek(response.message.PricePerWeek);
        setThumbil(response.message.Pictures);
        // phrse the string to get the array of images
        const res = JSON.parse(response.message.MorePictures);
        // set the selected images
        setSelectedImageString(res);
        console.log(res);
        // try to parse the address
        try {
          // parse the address
          // set all the address details
          const ads = JSON.parse(response.message.SpotAddr);
          console.log(ads);
          setState(ads.State);
          setStreet(ads.Street);
          setCity(ads.City);
          setCountry(ads.Country);
          setPostcode(ads.Postcode);
        } catch (e) {
          // set the address details
          const ads = response.message.SpotAddr.split(',');
          console.log(ads);
          setState(ads[0]);
          setStreet(ads[0]);
          setCity(ads.City[1]);
          setCountry(ads[2]);
          setPostcode(ads.Postcode[2]);
        }
        // phrse the string to get the array of time intervals
        // const ads = JSON.parse(response.message.SpotAddr);
        // console.log(ads);
        // setState(ads.State);
        // setStreet(ads.Street);
        // setCity(ads.City);
        // setCountry(ads.Country);
        // setPostcode(ads.Postcode);
        // phase all the time intervals
        let all_time = JSON.parse(response.message.AvailableTime);
        // set all the time intervals
        all_time = all_time.map((item) => ({
          ...item,
          startDate: dayjs(item.startDate),
          endDate: dayjs(item.endDate),
        }));
        // print the time intervals
        console.log(all_time);
        // set the first time interval
        setFirstStart(all_time[0].startDate);
        // set the first end time interval
        setFirstEnd(all_time[0].endDate);
        // set the first distance
        setDistance(all_time[0].distance);
        // update the time intervals
        setTimeIntervals((timeIntervals) => [...all_time.slice(1)]);
      })
      .catch((error) => {
        // if the response is not successful
        // tell the user that the spot is not found
        setOpenSnackbar({
          severity: 'warning',
          message: error,
          timestamp: new Date().getTime(),
        });
      });
  };
    getDetail(Spotid);
  }, [Spotid,setOpenSnackbar]);
  // link the ref for thumb and other img
  const RefT = useRef(null);
  const RefFile = useRef(null);
  // if the button click then open the file loader
  const HandleT = () => {
    if (RefT.current) {
      RefT.current.click();
    }
  };
  // if the button click then open the file loader
  const HandleFile = () => {
    if (RefFile.current) {
      RefFile.current.click();
    }
  };
  const navigate = useNavigate();
  // set title empty;
  const [lengthOfTitle, setlength] = useState(0);
  // set type empty;
  const [SpaceType, setType] = useState('');
  // set charge empty;
  const [charge, setCharge] = useState('');
  // when the charge change
  const ChangeCharge = (event) => {
    const target = event.target;
    if (target.id) {
      setCharge(target.id);
    }
  };
  // when the passway change
  const [PassWay, setPassWay] = useState('');
  // when the passway change
  const ChangePassWay = (event) => {
    const target = event.target;
    if (target.id) {
      setPassWay(target.id);
    }
  };
  // set the isHour, isDay, isWeek all false
  const [isHour, setisHour] = useState(false);
  const [isDay, setisDay] = useState(false);
  const [isWeek, setWeek] = useState(false);
  // set type empty;
  const [CarType, setCarType] = useState('');
  // set contry empty
  const [Country, setCountry] = useState('');
  // when the country change
  const handleCountryChange = (event) => {
    setCountry(event.target.value);
  };
  // set street empty
  const [Street, setStreet] = useState('');
  // when the street change
  const handleStreetChange = (event) => {
    setStreet(event.target.value);
  };
  // set city empty
  const [City, setCity] = useState('');
  // when the city change
  const handleCityChange = (event) => {
    setCity(event.target.value);
  };
  // set state empty
  const [State, setState] = useState('');
  // when the state change
  const handleStateChange = (event) => {
    setState(event.target.value);
  };
  // set postcode empty
  const [Postcode, setPostcode] = useState('');
  // when the postcode change
  const handlePostcodeChange = (event) => {
    setPostcode(event.target.value);
  };
  // set thumbil empty
  const [Thumbil, setThumbil] = useState('');
  // set all facility false
  const [Title, setTitle] = useState('');
  // when the title change
  const handleTitleChange = (event) => {
    setTitle(event.target.value);
    setlength(event.target.value.length);
  };
  // set price for daily
  const [PriseDay, setPriceDay] = useState('');
  // when the price change
  const handlePriceDayChange = (event) => {
    setPriceDay(event.target.value);
  };
  // set price for daily
  const [PriseWeek, setPriceWeek] = useState('');
  // when the price change
  const handlePriceWeekChange = (event) => {
    setPriceWeek(event.target.value);
  };
  // set price for daily
  const [PriseHour, setPriceHour] = useState('');
  // when the price change
  const handlePriceHourChange = (event) => {
    setPriceHour(event.target.value);
  };
  // when the type is changed
  const ChangeType = (event) => {
    const target = event.target;
    if (target.id) {
      setType(target.id);
    }
  };
  // when the car type is changed
  const ChangeCarType = (event) => {
    const target = event.target;
    if (target.id) {
      setCarType(target.id);
    }
  };
  // goes to the host page
  const goesHost = () => {
    navigate(-1);
  };
  // set all errorText shown false
  const [ErrorText1, setErrorText1] = useState(false);
  const [ErrorText2, setErrorText2] = useState(false);
  const [ErrorText3, setErrorText3] = useState(false);
  const [ErrorText4, setErrorText4] = useState(false);
  const [ErrorText5, setErrorText5] = useState(false);
  const [ErrorText6, setErrorText6] = useState(false);
  const [ErrorText7, setErrorText7] = useState(false);
  const [ErrorText8, setErrorText8] = useState(false);
  const [ErrorText9, setErrorText9] = useState(false);
  // set all errorText shown false
  const setAllfalse = () => {
    setErrorText1(false);
    setErrorText2(false);
    setErrorText3(false);
    setErrorText4(false);
    setErrorText5(false);
    setErrorText6(false);
    setErrorText7(false);
    setErrorText8(false);
    setErrorText9(false);
  };
  // set all scroll position empty
  const [errorContent, setErrorContent] = useState('');
  // set all scroll position empty
  const scrollToQ1 = useRef(null);
  const scrollToQ2 = useRef(null);
  const scrollToQ3 = useRef(null);
  const scrollToQ4 = useRef(null);
  const scrollToQ5 = useRef(null);
  const scrollToQ6 = useRef(null);
  const scrollToQ7 = useRef(null);
  const scrollToQ8 = useRef(null);
  const scrollToQ9 = useRef(null);
  // set all image empty
  const [AllImaegsString, setSelectedImageString] = useState([]);
  // convert the image to string
  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      // read the image
      const reader = new FileReader();
      reader.onload = (event) => {
        // set the image
        if (event.target) {
          const base64String = event.target.result;
          resolve(base64String);
        }
      };
      // when meet error
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  };
  // convert all images to string
  const convertAllImagesToBase64 = (imageFiles) => {
    const base64Promises = imageFiles.map((file) => convertImageToBase64(file));
    return Promise.all(base64Promises);
  };
  // check a image is a 64base Image
  const isValidBase64Image = (base64String) => {
    // if not valid Base64 image
    if (!base64String.startsWith('data:image/')) {
      return false;
    }
    try {
      // if the image is empty
      if (base64String.trim() === '') {
        return false;
      }
      const datas = base64String;
      const realdata = String(datas.split(',')[1]);
      // Decode the base64 string
      const decodedData = btoa(atob(realdata));
      // if the decode and encode is same then true;
      return decodedData === realdata;
    } catch (error) {
      // when meet error show error
      setOpenSnackbar({
        severity: 'error',
        message: 'Your image is not follow 64base encode !',
      });
      setOpenSnackbar({
        severity: 'error',
        message: '',
      });
      console.log(error);
      return false; // Invalid base64 or unable to decode
    }
  };
  // add the thumbil to the page
  const AddThumbil = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      // get the first element
      const file = files[0];
      // start render
      const reader = new FileReader();
      if (file) {
        // loading these image
        reader.onload = (event) => {
          if (event.target) {
            // if the data is valid then set it else prompt error
            const base64Data = event.target.result;
            if (isValidBase64Image(base64Data)) {
              // valid file
              setAllfalse();
              console.log(base64Data);
              setThumbil(base64Data);
            } else {
              // invalid file
              setAllfalse();
              setErrorContent('Not a valid image!');
              setErrorText7(true);
            }
          }
        };
        // when meet error
        reader.onerror = (event) => {
          // if the target is not null
          if (event.target) {
            // show error
            console.error('Error reading file:', event.target.error);
            setAllfalse();
            setErrorContent('Error reading file');
            setErrorText7(true);
          }
        };
        // start read the file
        reader.readAsDataURL(file);
      }
    }
  };
  // initial the file is null
  const [fileInputValue, setFileInputValue] = useState('');
  // add the image to the page
  const AddImage = (event) => {
    // get the files
    const files = event.target.files;
    // if the files is not null
    if (files && files.length > 0) {
      // get the all files
      const promises = Array.from(files).map((file) => {
        return new Promise((resolve, reject) => {
          // read the file
          const reader = new FileReader();
          // when the file is loaded
          reader.onload = (event) => {
            // if the target is not null
            if (event.target) {
              // get the base64 string
              const base64Data = event.target.result;
              // if the image is valid
              if (isValidBase64Image(base64Data)) {
                // valid file
                resolve(file);
              } else {
                // invalid file
                reject(new Error('Not a valid image!'));
              }
            }
          };
          // when meet error
          reader.onerror = (event) => {
            // if the target is not null
            if (event.target) {
              // show error
              console.error('Error reading file:', event.target.error);
              reject(new Error('Error reading file'));
            }
          };
          // start read the file
          reader.readAsDataURL(file);
        });
      });
      // when all files is loaded
      Promise.all(promises)
        // if the files is valid
        .then((results) => {
          // get the valid files
          const validFiles = results;
          // set all errormessgae hidden
          setAllfalse();
          // set the file input value
          convertAllImagesToBase64(validFiles)
            .then((base64Strings) => {
              // add the image to the page
              const base64array = base64Strings;
              setSelectedImageString([...AllImaegsString, ...base64array]);
            })
            .catch((error) => {
              // if the image is not valid
              // show error
              setOpenSnackbar({
                severity: 'error',
                message: 'Your Image upload has some error, please try again!',
              });
              setOpenSnackbar({
                severity: 'error',
                message: '',
              });
              // show error
              console.error(error);
            });
          // set the file input value to null
          setFileInputValue('');
        })
        .catch((error) => {
          // if the image is not valid
          // show error
          setOpenSnackbar({
            severity: 'error',
            message: 'Your Image upload has some error, please try again!',
          });
          // show error
          setOpenSnackbar({
            severity: 'error',
            message: '',
          });
          // set all errormessgae hidden
          setAllfalse();
          // show error
          setErrorContent(error);
          // scroll to the error message
          setErrorText7(true);
        });
    }
  };
  // remove the image from the page
  const RemoveImage = (index) => {
    // create new image list, remove the image
    const updatedImagesString = AllImaegsString.filter(
      (_, i) => String(i) !== index
    );
    setSelectedImageString(updatedImagesString);
  };
  // scroll to a element
  const scrollToElement = (ref) => {
    // if the ref is not null
    if (ref.current) {
      // scroll to the element
      console.log(ref.current);
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  // set the time interval
  const [timeIntervals, setTimeIntervals] = useState([]);
  const [FirstStart, setFirstStart] = useState(null);
  const [FirstEnd, setFirstEnd] = useState(null);
  const [Firstdistance, setDistance] = useState(0);
  // change the first available date
  const FirstStartChange = (date) => {
    setFirstStart(date);
    setDistance(GetDistance(date, FirstEnd));
  };
  // change the first available date
  const FirstEndChange = (date) => {
    setFirstEnd(date);
    setDistance(GetDistance(FirstStart, date));
  };
  // add an element to the interval
  const addTimeInterval = () => {
    setTimeIntervals((currentInterval) => [
      ...currentInterval,
      {
        id: Date.now(), // unique id
        startDate: null,
        endDate: null,
        distance: 0,
      },
    ]);
  };
  // when the start date change, then change the distance
  const handleStartDateChange = (index, date) => {
    setTimeIntervals((currentInterval) => {
      // add the new interval
      const newIntervals = currentInterval ? [...currentInterval] : [];
      const already = newIntervals[index];
      // check the interval is exist or not
      if (already) {
        // set the new interval value
        newIntervals[index] = {
          id: already.id,
          startDate: date,
          endDate: already.endDate,
          distance: GetDistance(date, already.endDate),
        };
      }
      // return the new interval or not
      return newIntervals || [];
    });
  };
  // when the end date change, then change the distance
  const handleEndDateChange = (index, date) => {
    // set the new interval value
    setTimeIntervals((currentInterval) => {
      // get the index of a interval
      const newIntervals = currentInterval ? [...currentInterval] : [];
      const already = newIntervals[index];
      // update the interval value
      if (already) {
        newIntervals[index] = {
          id: already.id,
          startDate: already.startDate,
          endDate: date,
          distance: GetDistance(already.startDate, date),
        };
      }
      // return the new interval or not
      return newIntervals;
    });
  };
  // when the user want to delete a interval
  const deleteInterval = (id) => {
    // delete the interval by filter the id
    setTimeIntervals((prevIntervals) =>
      prevIntervals.filter((interval) => interval.id !== id)
    );
  };
  // creat a new hosting
  const EditNow = (id) => {
    // init the data
    const data = {
      spotName: String(Title),
      spotType: String(SpaceType),
      Size: String(CarType),
      charge: String(charge),
      passWay: String(PassWay),
      spotAddr: JSON.stringify({
        Country: Country,
        City: City,
        State: State,
        Postcode: Postcode,
        Street: Street,
      }),
      isDayRent: isDay,
      isOurRent: isHour,
      isWeekRent: isWeek,
      pricePerDay: parseFloat(PriseDay) || 0,
      pricePerHour: parseFloat(PriseHour) || 0,
      pricePerWeek: parseFloat(PriseWeek) || 0,
      pictures: Thumbil,
      morePictures: AllImaegsString,
      availableTime: timeIntervals,
    };
    // the price pattern
    const pricePattern = /^[1-9]\d{0,4}$/;
    // set confirmflag to true
    let Confirmflag = true;
    console.log(data);
    if (data) {
      // inital the data
      // if the title is empty
      if (data.spotType.length === 0) {
        console.log('no type');
        Confirmflag = false;
        setAllfalse();
        setErrorContent('You must select one type for your spot.');
        setErrorText1(true);
        scrollToElement(scrollToQ1);
      }
      // if the space size is empty
      if (Confirmflag && data.Size.length === 0) {
        console.log('no type');
        Confirmflag = false;
        setAllfalse();
        setErrorContent('You must select one type of car for your spot');
        setErrorText2(true);
        scrollToElement(scrollToQ2);
      }
      // if the address is not empty
      if (Confirmflag && data.spotAddr) {
        setAllfalse();
        const letterPattern = /[a-zA-Z]+/;
        const numericPattern = /^[0-9]+$/;
        // if the content is not valid
        if (!letterPattern.test(Country)) {
          console.log('invalid country');
          setErrorContent('Your country name is invalid');
          Confirmflag = false;
        } else if (!letterPattern.test(Street)) {
          // if the street is not valid
          setErrorContent('Your street name is invalid');
          Confirmflag = false;
          console.log('invalid country');
        } else if (!letterPattern.test(City)) {
          // if the city is not valid
          setErrorContent('Your city name is invalid');
          Confirmflag = false;
          console.log('invalid country');
        } else if (!letterPattern.test(State)) {
          // if the state is not valid
          setErrorContent('Your state name is invalid');
          Confirmflag = false;
          console.log('invalid country');
        } else if (!numericPattern.test(Postcode)) {
          // if the postcode is not valid
          setErrorContent('Your Postcode name is invalid');
          Confirmflag = false;
          console.log('invalid postcode');
        }
        if (!Confirmflag) {
          // if the errorText is not valid
          setErrorText3(true);
          console.log(scrollToQ3);
          scrollToElement(scrollToQ3);
        }
      }
      // if the spot passway is empty
      if (Confirmflag && data.passWay.length === 0) {
        console.log('no Passway');
        setAllfalse();
        setErrorContent('You must set a Passway for your hosting');
        setErrorText4(true);
        scrollToElement(scrollToQ4);
        Confirmflag = false;
      }
      // if the spot charge is empty
      if (Confirmflag && data.charge.length === 0) {
        console.log('no title');
        setAllfalse();
        setErrorContent('You must set a charge information for your hosting.');
        setErrorText5(true);
        scrollToElement(scrollToQ5);
        Confirmflag = false;
      }
      // if the spot name is empty
      if (Confirmflag && data.spotName.length === 0) {
        console.log('no title');
        setAllfalse();
        setErrorContent('You must set a title for your hosting');
        setErrorText6(true);
        scrollToElement(scrollToQ6);
        Confirmflag = false;
      }
      // if all the rent way is false
      if (Confirmflag && !(isDay || isHour || isWeek)) {
        console.log('No price');
        setAllfalse();
        setErrorContent('Your must accept one kind of rent way');
        setErrorText7(true);
        Confirmflag = false;
        scrollToElement(scrollToQ7);
      }
      // if the rent way is day and the price is not valid
      if (Confirmflag && isDay && !pricePattern.test(PriseDay)) {
        console.log('No price');
        setAllfalse();
        setErrorContent('Your price must between 1 to 99999');
        setErrorText7(true);
        Confirmflag = false;
        scrollToElement(scrollToQ7);
      }
      // if the rent way is hour and the price is not valid
      if (Confirmflag && isHour && !pricePattern.test(PriseHour)) {
        console.log('No price');
        setAllfalse();
        setErrorContent('Your price must between 1 to 99999');
        setErrorText7(true);
        Confirmflag = false;
        scrollToElement(scrollToQ7);
      }
      // if the rent way is week and the price is not valid
      if (Confirmflag && isWeek && !pricePattern.test(PriseWeek)) {
        console.log('No price');
        setAllfalse();
        setErrorContent('Your price must between 1 to 99999');
        setErrorText7(true);
        Confirmflag = false;
        scrollToElement(scrollToQ7);
      }
      // if the first duration is null
      if (Confirmflag && (FirstStart === null || FirstEnd === null)) {
        setAllfalse();
        setErrorContent('Your all of the time choice can not be null.');
        setErrorText8(true);
        Confirmflag = false;
        scrollToElement(scrollToQ8);
      }
      // if the confirmflag is true
      if (Confirmflag) {
        // filter the invalid time choice
        const res = data.availableTime.filter((value) => {
          return value.startDate === null || value.endDate === null;
        });
        // if there exist invalid time choice
        if (res.length !== 0) {
          // set the error message
          setAllfalse();
          setErrorContent('Your all of the time choice can not be null.');
          // set the error text
          setErrorText8(true);
          Confirmflag = false;
          scrollToElement(scrollToQ8);
        }
      }
      // if the image is empty
      if (Confirmflag && Thumbil === '') {
        setAllfalse();
        setErrorContent('You must show your hosting pictures to us');
        setErrorText9(true);
        Confirmflag = false;
        scrollToElement(scrollToQ9);
      }
      // if the confirmflag is true
      if (Confirmflag) {
        // add the new available time
        data.availableTime.unshift({
          id: Date.now(), // unique id
          startDate: FirstStart,
          endDate: FirstEnd,
          distance: GetDistance(FirstStart, FirstEnd),
        });
        // phase the time choice
        data.availableTime = JSON.stringify(data.availableTime);
        // phase the more pictures
        data.morePictures = JSON.stringify(data.morePictures);
        // call the api to edit the spot
        callAPIEditSpot(
          'spot/modifySpotInfo/' + id,
          data,
          localStorage.getItem('token')
        )
          .then((response) => {
            // if the response is success
            console.log(response);
            // set the open snackbar message
            setOpenSnackbar({
              severity: 'success',
              message: 'Edit Spot Successful!',
              timestamp: new Date().getTime(),
            });
            // navigate to the previous page
            navigate(-1);
          })
          .catch((error) => {
            // if the response is error
            // set the open snackbar message
            setOpenSnackbar({
              severity: 'warning',
              message: error,
              timestamp: new Date().getTime(),
            });
          });
      }
    }
  };
  return (
    <div className='CreatChannelOverall'>
      <div className='CreatNewHeader'>
        <div className='CreateLogo'>
          <img className='ct-logo' src='/img/LOGO.svg' alt=''></img>
        </div>
        <div className='HeaderRightButtonPart'>
          <p className='HeaderRightButtonself' onClick={goesHost}>
            Exit
          </p>
        </div>
      </div>
      <div className='Q1' ref={scrollToQ1} id='Q1'>
        <p className='QoneQuestionPart'>
          Which of these best describes your CarSpace?
        </p>
        <div className='QoneAnswerPart'>
          <input
            className='QoneSelect'
            type='radio'
            name='accommodation'
            id='Carport'
            onClick={ChangeType}
          ></input>
          <label
            className={
              SpaceType === 'Carport' ? 'QoneShowSelected' : 'QoneShowSelect'
            }
            htmlFor='Carport'
            id='Hous'
          >
            Carport
          </label>
          <input
            className='QoneSelect'
            type='radio'
            name='accommodation'
            id='Driveway'
            onClick={ChangeType}
          />
          <label
            className={
              SpaceType === 'Driveway' ? 'QoneShowSelected' : 'QoneShowSelect'
            }
            htmlFor='Driveway'
            id='Apart'
          >
            Driveway
          </label>
          <input
            className='QoneSelect'
            type='radio'
            name='accommodation'
            id='Garage'
            onClick={ChangeType}
          />
          <label
            className={
              SpaceType === 'Garage' ? 'QoneShowSelected' : 'QoneShowSelect'
            }
            id='caBIN'
            htmlFor='Garage'
            checked={SpaceType === 'Cabin'}
          >
            Garage
          </label>
          <input
            className='QoneSelect'
            type='radio'
            name='accommodation'
            id='Parking-lot'
            onClick={ChangeType}
          />
          <label
            className={
              SpaceType === 'Parking-lot'
                ? 'QoneShowSelected'
                : 'QoneShowSelect'
            }
            htmlFor='Parking-lot'
            id='Hot'
            checked={SpaceType === 'Hotel'}
          >
            Parking-lot
          </label>
        </div>
        {ErrorText1 && <p className='CreateError'>{errorContent}</p>}
      </div>
      <div className='Q' ref={scrollToQ2} id='Q2'>
        <p className='QtwoQ'>
          What type of cars can be parked in this parking space?
        </p>
        <p className='QtwoQsub'>
          Choose the largest vehicle your parking space can accommodate.
        </p>
        <div className='QoneAnswerPart'>
          <input
            className='QoneSelect'
            type='radio'
            name='cartype'
            id='Bike'
            onClick={ChangeCarType}
          ></input>
          <label
            className={
              CarType === 'Bike' ? 'QfourShowSelected' : 'QfourShowSelect'
            }
            htmlFor='Bike'
            id='Hous'
          >
            Bike
          </label>
          <input
            className='QoneSelect'
            type='radio'
            name='cartype'
            id='Sedan'
            onClick={ChangeCarType}
          />
          <label
            className={
              CarType === 'Sedan' ? 'QfourShowSelected' : 'QfourShowSelect'
            }
            htmlFor='Sedan'
            id='Apart'
          >
            Sedan
          </label>
          <input
            className='QoneSelect'
            type='radio'
            name='cartype'
            id='Hatchback'
            onClick={ChangeCarType}
          />
          <label
            className={
              CarType === 'Hatchback' ? 'QfourShowSelected' : 'QfourShowSelect'
            }
            id='caBIN'
            htmlFor='Hatchback'
          >
            Hatchback
          </label>
          <input
            className='QoneSelect'
            type='radio'
            name='cartype'
            id='4WD/SUV'
            onClick={ChangeCarType}
          />
          <label
            className={
              CarType === '4WD/SUV' ? 'QfourShowSelected' : 'QfourShowSelect'
            }
            htmlFor='4WD/SUV'
            id='Hot'
          >
            4WD/SUV
          </label>
          <input
            className='QoneSelect'
            type='radio'
            name='cartype'
            id='VAN'
            onClick={ChangeCarType}
          />
          <label
            className={
              CarType === 'VAN' ? 'QfourShowSelected' : 'QfourShowSelect'
            }
            htmlFor='VAN'
            id='Hot'
            checked={SpaceType === 'Hotel'}
          >
            VAN
          </label>
        </div>
        {ErrorText2 && <p className='CreateError'>{errorContent}</p>}
      </div>
      <div className='Q' ref={scrollToQ3} id='Q3'>
        <p className='QtwoQ'>Tell us about your address</p>
        <p className='QtwoQsub'>
          Your location will help customers better find parking spaces.
        </p>
        <div className='QtwoQasw'>
          <div className='QtwoQaswrow' tabIndex={0}>
            <label className='QtwoQaswLable'>Country/Region</label>
            <input
              className='QtwoQaswInput'
              id='country'
              value={Country}
              onChange={handleCountryChange}
            ></input>
          </div>
          <div className='QtwoQaswrow' tabIndex={0}>
            <label className='QtwoQaswLable'>Street address</label>
            <input
              className='QtwoQaswInput'
              id='street'
              value={Street}
              onChange={handleStreetChange}
            ></input>
          </div>
          <div className='QtwoQaswrow' tabIndex={0}>
            <label className='QtwoQaswLable'>Suburb/city</label>
            <input
              className='QtwoQaswInput'
              id='city'
              value={City}
              onChange={handleCityChange}
            ></input>
          </div>
          <div className='QtwoQaswrow' tabIndex={0}>
            <label className='QtwoQaswLable'>State/territory</label>
            <input
              className='QtwoQaswInput'
              id='state'
              value={State}
              onChange={handleStateChange}
            ></input>
          </div>
          <div className='QtwoQaswrow' tabIndex={0}>
            <label className='QtwoQaswLable'>Postcode</label>
            <input
              className='QtwoQaswInput'
              id='postcode'
              value={Postcode}
              onChange={handlePostcodeChange}
            ></input>
          </div>
        </div>
        {ErrorText3 && <p className='CreateError'>{errorContent}</p>}
      </div>
      <div className='Q' ref={scrollToQ4} id='Q4'>
        <p className='Q4q'>Tell customers how to park in your space ?</p>
        <p className='QtwoQsub'>
          Make sure your parking space is accessible to customers.
        </p>
        <div className='QoneAnswerPart'>
          <input
            className='QoneSelect'
            type='checkbox'
            name='passway'
            id='Nones'
            onChange={ChangePassWay}
          />
          <label
            className={
              PassWay === 'Nones' ? 'QfourShowSelected' : 'QfourShowSelect'
            }
            id='wifi'
            htmlFor='Nones'
          >
            None
          </label>
          <input
            className='QoneSelect'
            type='checkbox'
            name='passway'
            id='Physical key'
            onChange={ChangePassWay}
          />
          <label
            className={
              PassWay === 'Physical key'
                ? 'QfourShowSelected'
                : 'QfourShowSelect'
            }
            htmlFor='Physical key'
            id='tv'
          >
            {'Physical key'}
          </label>
          <input
            className='QoneSelect'
            type='checkbox'
            name='passway'
            id='Password'
            onChange={ChangePassWay}
          />
          <label
            className={
              PassWay === 'Password' ? 'QfourShowSelected' : 'QfourShowSelect'
            }
            htmlFor='Password'
            id='kitch'
          >
            Password
          </label>
          <input
            className='QoneSelect'
            type='checkbox'
            name='passway'
            id='Digital Card'
            onChange={ChangePassWay}
          />
          <label
            className={
              PassWay === 'Digital Card'
                ? 'QfourShowSelected'
                : 'QfourShowSelect'
            }
            htmlFor='Digital Card'
            id='washing-machine'
          >
            {'Digital Card'}
          </label>
        </div>
        {ErrorText4 && <p className='CreateError'>{errorContent}</p>}
      </div>
      <div className='Q' ref={scrollToQ5} id='Q5'>
        <p className='Q4q'>
          Tell guests what type of the Electric charging this space parking
          offer?
        </p>
        <p className='QtwoQsub'>
          Equipped with charging stations will make your parking space stand
          out.
        </p>
        <div className='QoneAnswerPart'>
          <input
            className='QoneSelect'
            type='checkbox'
            name='charge'
            id='None'
            onChange={ChangeCharge}
          />
          <label
            className={
              charge === 'None' ? 'QfourShowSelected' : 'QfourShowSelect'
            }
            id='wifi'
            htmlFor='None'
          >
            None
          </label>
          <input
            className='QoneSelect'
            type='checkbox'
            name='charge'
            id='Wall(AU/NZ)'
            onChange={ChangeCharge}
          />
          <label
            className={
              charge === 'Wall(AU/NZ)' ? 'QfourShowSelected' : 'QfourShowSelect'
            }
            htmlFor='Wall(AU/NZ)'
            id='tv'
          >
            {'Wall(AU/NZ)'}
          </label>
          <input
            className='QoneSelect'
            type='checkbox'
            name='charge'
            id='SAE J-1772'
            onChange={ChangeCharge}
          />
          <label
            className={
              charge === 'SAE J-1772' ? 'QfourShowSelected' : 'QfourShowSelect'
            }
            htmlFor='SAE J-1772'
            id='kitch'
          >
            {'SAE J-1772'}
          </label>

          <input
            className='QoneSelect'
            type='checkbox'
            name='charge'
            id='Type2'
            onChange={ChangeCharge}
          />
          <label
            className={
              charge === 'Type2' ? 'QfourShowSelected' : 'QfourShowSelect'
            }
            htmlFor='Type2'
            id='washing-machine'
          >
            {'Type2'}
          </label>
          <input
            className='QoneSelect'
            type='checkbox'
            name='charge'
            id='CHAdeMO'
            onChange={ChangeCharge}
          />
          <label
            className={
              charge === 'CHAdeMO' ? 'QfourShowSelected' : 'QfourShowSelect'
            }
            htmlFor='CHAdeMO'
            id='air-cond'
          >
            CHAdeMO
          </label>
          <input
            className='QoneSelect'
            type='checkbox'
            name='accommodation'
            id='Free-Parking'
            onChange={ChangeCharge}
          />
        </div>
        {ErrorText5 && <p className='CreateError'>{errorContent}</p>}
      </div>
      <div className='Q' ref={scrollToQ6} id='Q6'>
        <p className='Q4q'>Now, lets give your spot a title.</p>
        <p className='QtwoQsub'>
          Short titles work best. Have fun with it—you can always change it
          later.
        </p>
        <div className='QoneAnswerPart'>
          <textarea
            className='Q5A'
            id='hosting-title'
            maxLength={32}
            onChange={handleTitleChange}
            value={Title}
          ></textarea>
        </div>
        <p className='LengthDetector'>{lengthOfTitle}/32</p>
        {ErrorText6 && <p className='CreateError'>{errorContent}</p>}
      </div>
      <div className='Q' ref={scrollToQ7} id='Q7'>
        <p className='Q4q'>Next we'll help you set up your parking revenue.</p>
        <p className='QtwoQsub'>
          You can change it anytime and 15% of the fee your earned would be
          deducted by the platform as the service fee.
        </p>
        <div className='Q6aDiv'>
          <div className='Q6-row'>
            <div className='row-left'>
              <input
                type='checkbox'
                className='Q6ck'
                checked={isHour}
                onChange={() => {
                  setisHour(!isHour);
                }}
              ></input>
              <p className='Q6AP'>I'm okay with hourly rentals.</p>
            </div>
            <div className='row-right'>
              <p className='Q6AP'>$</p>
              <input
                className='Q6aInput'
                id='price'
                placeholder='0'
                maxLength={5}
                value={PriseHour}
                onChange={handlePriceHourChange}
                disabled={!isHour}
              ></input>
              <p className='Q6AP'>per hour.</p>
            </div>
          </div>

          <div className='Q6-row'>
            <div className='row-left'>
              <input
                type='checkbox'
                className='Q6ck'
                checked={isDay}
                onChange={() => {
                  setisDay(!isDay);
                }}
              ></input>
              <p className='Q6AP'>I'm okay with daily rentals.</p>
            </div>
            <div className='row-right'>
              <p className='Q6AP'>$</p>
              <input
                className='Q6aInput'
                id='price'
                placeholder='0'
                maxLength={5}
                value={PriseDay}
                onChange={handlePriceDayChange}
                disabled={!isDay}
              ></input>
              <p className='Q6AP'>per day.</p>
            </div>
          </div>
          <div className='Q6-row'>
            <div className='row-left'>
              <input
                type='checkbox'
                className='Q6ck'
                checked={isWeek}
                onChange={() => {
                  setWeek(!isWeek);
                }}
              ></input>
              <p className='Q6AP'>I'm okay with weekly rentals.</p>
            </div>
            <div className='row-right'>
              <p className='Q6AP'>$</p>
              <input
                className='Q6aInput'
                id='price'
                placeholder='0'
                maxLength={5}
                value={PriseWeek}
                onChange={handlePriceWeekChange}
                disabled={!isWeek}
              ></input>
              <p className='Q6AP'>per week.</p>
            </div>
          </div>
        </div>
        {ErrorText7 && <p className='CreateError'>{errorContent}</p>}
      </div>
      <div className='Q' ref={scrollToQ8} id='Q8'>
        <p className='Q4q'>
          Now let's set the available time for the parking space.
        </p>
        <p className='QtwoQsub'>You can change it anytime.</p>
        <div className='Q6aDiv'>
          <div className='PublishInfo'>
            <div className='IntervalHeader'>
              <p className='PublishTitle'>Available Time</p>
              <button className='AddInterval' onClick={addTimeInterval}>
                Add available time
              </button>
            </div>
            <div className='TimeInterval'>
              <div className='IntervalHeader'>
                <div className='Avtxt'>Available Time{' ' + 1}</div>
              </div>
              <div className='IntervalContent'>
                <div className='TimeBlock'>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker', 'DatePicker']}>
                      <DatePicker
                        label='Start Date'
                        value={FirstStart}
                        minDate={dayjs(new Date())}
                        onChange={(date) => {
                          if (date) FirstStartChange(date);
                        }}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </div>
                <p className='TO'> - </p>
                <div className='TimeBlock'>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker', 'DatePicker']}>
                      <DatePicker
                        label='End Date'
                        value={FirstEnd}
                        minDate={dayjs(FirstStart)}
                        onChange={(date) => {
                          if (date) FirstEndChange(date);
                        }}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </div>
              </div>
              <div className='IntervalBottom'>
                <div className='Pricetxt'>Totol Day{'  ' + Firstdistance}</div>
              </div>
            </div>
            {timeIntervals.map((interval, index) => (
              <div className='TimeInterval' key={interval.id}>
                <div className='IntervalHeader'>
                  <div className='Avtxt'>Available Time{' ' + (index + 2)}</div>
                  <button
                    className='ClearInterval'
                    onClick={() => {
                      deleteInterval(interval.id);
                    }}
                  >
                    Delete Interval
                  </button>
                </div>
                <div className='IntervalContent'>
                  <div className='TimeBlock'>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={['DatePicker', 'DatePicker']}>
                        <DatePicker
                          label='Start Date'
                          value={interval.startDate}
                          minDate={dayjs(new Date())}
                          onChange={(date) => {
                            if (date) handleStartDateChange(index, date);
                          }}
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                  </div>
                  <p className='TO'> - </p>
                  <div className='TimeBlock'>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={['DatePicker', 'DatePicker']}>
                        <DatePicker
                          label='End Date'
                          minDate={dayjs(interval.startDate)}
                          value={interval.endDate}
                          onChange={(date) => {
                            if (date) handleEndDateChange(index, date);
                          }}
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                  </div>
                </div>
                <div className='IntervalBottom'>
                  <div className='Pricetxt'>
                    Totol Day{'  ' + interval.distance}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {ErrorText8 && <p className='CreateError'>{errorContent}</p>}
      </div>
      <div className='Q' ref={scrollToQ9} id='Q9'>
        <p className='Q4q'>Add some photos of your barn</p>
        <p className='QtwoQsub'>
          You’ll need one photos to get started. This photo would as your
          hosting Thumbnail.
        </p>
        <div className='Q7aDiv'>
          <input
            className='QoneSelect'
            id='upload'
            onChange={AddThumbil}
            type='file'
            ref={RefT}
            accept='image/*'
          ></input>
          <img
            className='UploadIMG'
            id='callupload'
            onClick={HandleT}
            src={Thumbil || '/img/addusr.png'}
            alt='Upload from your device'
          ></img>
        </div>
        {ErrorText9 && <p className='CreateError'>{errorContent}</p>}
      </div>
      <div className='Q' id='Q10'>
        <p className='Q4q'>Add more photos of your barn</p>
        <p className='QtwoQsub'>
          This is optional if you want show more of your hosting. You can add
          more or make changes later. The first photo would as your hosting
          Thumbnail.
        </p>
        <div className='Q7aDiv'>
          <input
            className='QoneSelect'
            id='upload'
            onChange={AddImage}
            type='file'
            ref={RefFile}
            value={fileInputValue}
            accept='image/*'
          ></input>
          <button className='UploadButton' onClick={HandleFile}>
            Upload from your device
          </button>
        </div>
        {AllImaegsString.map((item, index) => (
          <div
            className='LasteachImage'
            key={index}
            onClick={() => RemoveImage(String(index))}
          >
            <HoverImage src={item} alt={`Image ${index}`} />
          </div>
        ))}
      </div>
      <div className='QButton'>
        <button
          className='CreatButton'
          onClick={() => EditNow(Spotid)}
          type='button'
        >
          Edit your hosting
        </button>
      </div>
    </div>
  );
};
