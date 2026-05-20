import React ,{useEffect} from 'react'
import './DeliveryOptions.css';
import { useGlobalContext } from '../../../context/GlobalContext/globalContext';
import { MdLocalShipping } from "react-icons/md";
import { IoLocation } from "react-icons/io5";


const DeliveryOptions = () => {
  const { info ,shippingMethods} = useGlobalContext();
  useEffect(()=>{
  },[shippingMethods])
  return (
    <div className='delivery-options-main'>
        <div className='zip-code-section'>
            <p>Delivery Options for</p>
            <h3>{info.locationData.zipCode} {info.locationData.stateCode}</h3>
        </div>
        {
            shippingMethods &&
            shippingMethods['shippingMethods'].map((item)=>{
                return <div className='delivery-details'>
                    {item.id ==="METHOD-3" ? <IoLocation/> : <MdLocalShipping/>}
                <div className='delivery-delails-inner'>
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                </div>
            </div>
            })
        }
        

        {/* <div className='pick-up-avail-or-not'>
            <img src={location} alt='location' />
            <div className='pick-up-inner'>
                <h3>Local PickUp</h3>
            </div>
        </div> */}
    </div>
  )
}

export default DeliveryOptions
