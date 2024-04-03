import { useNavigate,useParams } from 'react-router-dom';
import { useState, useEffect, useRef,useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useError } from './API';
import { getCarInfo } from './components/API'
import { AppContext } from './App';
import './CarInfo.css';
// 车位选择页面
export function CarSpaceChoice() {
  const { contextState, updateContextState } = useContext(AppContext);
  const {username, Spotid} = useParams(); 
  const { _, setOpenSnackbar } = useError();
  // 路由控制
  let navigate = useNavigate();
  // 回到主页
  let backhome = () => {
    if(Spotid){
      navigate('/'+username+'/detail/'+Spotid);
    }
    else{
      navigate('/'+username);
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
  const [cars,setCars]=useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCarInfo();
        console.log('Car data:', data);
        setCars(data.cars);
      } catch (error) {
        console.error('Error fetching car info:', error);
      }
    }
    fetchData();
  }, []);

  let choose = (car) => {
      let carType = car.Type;
      let carPlate=car.Plate;
      let carCharge=car.Charge;
      let CarPicture=car.Picture;
      localStorage.setItem("carId",car.ID);
      if(contextState.CarPlate!==carPlate){
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
            {cars.map((car) => (
            <div key={car.ID} className={contextState.CarPlate === car.Plate?'Onecar selected':'Onecar'} onClick={()=>choose(car)}>
              <img src={car.Picture} className='carthumb'></img>
              <div className='carinfo-right'>
                  <div className='carinfo-right-top'>
                    <p className='carinfo-brand'>{car.Brand}</p>
                    <p className='carinfo-brand'>{car.Type}</p>
                    <p className='carinfo-id'>{car.Plate}</p>
                  </div>
                </div>
            </div>
          ))}
          <div className='addcar' onClick={goesCreatCar}>
            <img src='/img/addusr.png' height={'30px'} className='addimg'></img>
            <p className='addtxt'>Add car here</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}


