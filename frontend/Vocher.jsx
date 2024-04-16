import { useNavigate,useParams } from 'react-router-dom';
import { useState, useEffect, useRef,useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useError } from './API';
import { AppContext } from './App';
import './CarInfo.css';
// 车位选择页面
export function VocherChoice() {
  const { contextState, updateContextState } = useContext(AppContext);
  const {username, Spotid} = useParams(); 
  const { setOpenSnackbar } = useError();
  // 路由控制
  let navigate = useNavigate();
  // 回到主页
  let backhome = () => {
    if(Spotid){
      navigate('/'+username+'/detail/'+Spotid);
    }
    else{
      navigate('/');
    }

  };
  let goesCreatCar = () => {
    navigate('/' + username + '/dashboard/vehicles');
  };
  let setCar = (CarPlate,CarType,CarCharge) => {
    localStorage.setItem('CarPlate',CarPlate);
    localStorage.setItem('CarType',CarType);
    localStorage.setItem('CarCharge',CarCharge)
  };
  let choose = () => {
      let carType = '4WD/SUV';
      let carPlate='WDS234';
      let carCharge='None';
      let CarPicture='';
      if(contextState.CarPlate!=='WDS234'){
        updateContextState({
          CarType:carType,
          CarPlate:carPlate,
          CarCharge:carCharge,
          CarPicture:CarPicture
        });
        setOpenSnackbar({
          severity: 'success',
          message: 'You choose a car with type ' + carType +'.',
          timestamp: new Date().getTime()
        });
        setCar(carPlate,carType,carCharge);
      }
      else{
        updateContextState({
          CarType:'',
          CarPlate:'',
          CarCharge:'',
          CarPicture:''
        });
        setOpenSnackbar({
          severity: 'success',
          message: 'You cancel the car choose.',
          timestamp: new Date().getTime()
        });
      }
      backhome();
      
  }
  return (
    // 主体
    <div className='overall'>
      {/* 背景黑色遮罩 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className='backgrounds'
      ></motion.div>
      {/* 内容 */}
      <motion.div
        className='contentoverall'
        initial={{ y: '50%', opacity: 0 }}
        animate={{ y: '0%', opacity: 1 }}
        exit={{ y: '50%', opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* 关闭按钮 */}
        <div className='back'>
          <button onClick={backhome} className='backbtn'>
            ×
          </button>
        </div>
        {/* 其余内容 */}
        <div className='contentmain-car'>
          {/* logo */}
          <div className={contextState.CarPlate==='WDS234'?'Onecar selected':'Onecar'} onClick={choose}>
            <img src='/img/car.jpeg' className='carthumb' alt=''></img>
            <div className='carinfo-right'>
              <div className='carinfo-right-top'>
                <p className='carinfo-brand'>4WD/SUV</p>
                <p className='carinfo-id'>T9823W</p>
              </div>
              <div className='carinfo-right-bottom'>
              </div>
            </div>
          </div>
          <div className='addcar' onClick={goesCreatCar}>
            <img alt='' src='/img/addusr.png' height={'30px'} className='addimg'></img>
            <p className='addtxt'>Add car here</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
// 车位新增页面
export function CarSpaceAdd() {
  const { setOpenSnackbar } = useError();
  // 路由控制
  let navigate = useNavigate();
  // 回到主页
  let backhome = () => {
    navigate(-1);
  };
  const RefT = useRef(null);
  const HandleT = () => {
    if (RefT.current) {
      RefT.current.click();
    }
  };
  const [Thumbil, setThumbil] = useState('');
  const [ErrorText7, setErrorText7] = useState(false);
  const [errorContent, setErrorContent] = useState('');
  const setAllfalse = () => {
    setErrorText7(false);
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
        timestamp: new Date().getTime()
      });
      console.log(error);
      return false; // Invalid base64 or unable to decode
    }
  };
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
  const AddCar = (event) => {
    setOpenSnackbar({
        severity:'success',
        message:'Car Add successful.',
        timestamp: new Date().getTime()
    });
    navigate(-1);
  };
  return (
    // 主体
    <div className='overall'>
      {/* 背景黑色遮罩 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className='backgrounds'
      ></motion.div>
      {/* 内容 */}
      <motion.div
        className='contentoverall'
        initial={{ y: '50%', opacity: 0 }}
        animate={{ y: '0%', opacity: 1 }}
        exit={{ y: '50%', opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* 关闭按钮 */}
        <div className='back'>
          <button onClick={backhome} className='backbtn'>
            ×
          </button>
        </div>
        {/* 其余内容 */}
        <div className='contentmain-caradd'>
          <p className='title-car'>Please let us know about your vehicle</p>
          <div className='car-row'>
            <label>Type of motor vehicle</label>
            <select defaultValue={'0'} className='selections-type'>
              <option value='0'>Bike</option>
              <option value='1'>Sedan</option>
              <option value='2'>Hatchback</option>
              <option value='3'>4WD/SUV</option>
              <option value='4'>VAN</option>
            </select>
          </div>
          <div className='car-row'>
            <label>Vehicle registration number</label>
            <input className='car-inp'></input>
          </div>
          <div className='car-row-2'>
            <label>Overall car picture</label>
            <input
              className='QoneSelect'
              id='upload-car'
              onChange={AddThumbil}
              type='file'
              ref={RefT}
              accept='image/*'
            ></input>
            <img
              id='car-img'
              onClick={HandleT}
              src={Thumbil || '/img/addusr.png'}
              alt='Upload from your device'
              height={'100 px'}
              className='thumb'
            ></img>
            <button className='Save' onClick={AddCar}>
              Save
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

