import { useNavigate,useParams } from 'react-router-dom';
import { useState, useEffect,useContext } from 'react';
import { motion } from 'framer-motion';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useError } from './API';
import { getCarInfo } from './components/API'
import { AppContext } from './App';
import './CarInfo.css';
// car space choice page
export function CarSpaceChoice() {
  // get the context value
  const { contextState, updateContextState } = useContext(AppContext);
  // get the username and spotid
  const {username, Spotid} = useParams(); 
  // open the snackbar when error occurs
  const { setOpenSnackbar } = useError();
  // get the navigate function
  let navigate = useNavigate();
  // go back to the previous page
  let backhome = () => {
    // if there is a spotid, go to the detail page
    if(Spotid){
      navigate('/'+username+'/detail/'+Spotid);
    }
    // else go to the home page
    else{
      navigate('/'+username);
    }

  };
  // go to the car creation page
  let goesCreatCar = () => {
    // go to the car creation page
    navigate('/' + username + '/dashboard/vehicles');
  };
  // set the car information to the local storage
  let setCar = (CarPlate,CarType,CarCharge) => {
    localStorage.setItem('CarPlate',CarPlate);
    localStorage.setItem('CarType',CarType);
    localStorage.setItem('CarCharge',CarCharge)
  };
  // get the car information
  const [cars,setCars]=useState([]);
  // use the effect to get the car information
  useEffect(() => {
    // fetch the car information
    const fetchData = async () => {
      try {
        const data = await getCarInfo();
        console.log('Car data:', data);
        setCars(data.cars);
      } catch (error) {
        console.error('Error fetching car info:', error);
      }
    }
    // call the fetch data function
    fetchData();
  }, []);
  // when user choose a car
  let choose = (car) => {
      // get the car information 
      let carType = car.Type;
      let carPlate=car.Plate;
      let carCharge=car.Charge;
      let CarPicture=car.Picture;
      // set the car information to the local storage
      localStorage.setItem("carId",car.ID);
      // if the current car is not the same as the chosen car
      if(contextState.CarPlate!==carPlate){
        // set car information because the user choose a car
        updateContextState({
          CarType:carType,
          CarPlate:carPlate,
          CarCharge:carCharge,
          CarPicture:CarPicture
        });
        // tell the user that the car is chosen
        setOpenSnackbar({
          severity: 'success',
          message: 'You choose a car with type ' + carType +'.',
          timestamp: new Date().getTime()
        });
        // set the car information to the local storage
        setCar(carPlate,carType,carCharge);
      }
      // if the current car is the same as the chosen car
      else{
        // set car information because the user cancel the car
        updateContextState({
          CarType:'',
          CarPlate:'',
          CarCharge:'',
          CarPicture:''
        });
        // tell the user that the car is canceled
        setOpenSnackbar({
          severity: 'success',
          message: 'You cancel the car choose.',
          timestamp: new Date().getTime()
        });
      }
      // go back to the previous page
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
              <img src={car.Picture} className='carthumb' alt=''></img>
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
            <img src='/img/addusr.png' height={'30px'} className='addimg' alt=''></img>
            <p className='addtxt'>Add car here</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}


