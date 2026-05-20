import React, { useState } from 'react'
import './LocationPopUp.css';
import { useGlobalContext } from '../../../context/GlobalContext/globalContext';
import { CiLocationOn } from "react-icons/ci";
import Image from 'next/image';
import CloseButton from '@/Global-Components/CloseButton/CloseButton';


const LocationPopUp = ({ searchLocation, handleCloseSearch, setLocationDetails, locationDetails }) => {

  const {
    updateLocationData,
    zipCode,
    handleInputChange,
    handleButtonClick,
    zipLoading,
  } = useGlobalContext();


  const [userLocation, setUserLocation] = useState(null);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
          getLocationDetainsFromCoordinations('41.3976361', '-80.0684789');
        },
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  }

  const getLocationDetainsFromCoordinations = async (latitude, longitude) => {
    const apiKey = `AIzaSyB9nW_l7Dw8WnnSCOJyJSGjtTYyF9ct3qk`;
    // const googleKey = process.env.apiKey
    const link = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;
    try {
      const response = await fetch(link);
      const data = await response.json();

      if (data.status === 'OK') {
        const addressComponent = data.results[0].address_components;
        const locationData = {
          zipCode: '',
          stateCode: '',
          city: '',
          state: '',
          country: '',
          latitude: '41.3976361',
          longitude: '-80.0684789'
        }
        addressComponent.forEach(component => {
          if (component.types.includes('postal_code')) {
            locationData.zipCode = component.long_name;
          }
          if (component.types.includes('locality')) {
            locationData.city = component.long_name;
          }
          if (component.types.includes('administrative_area_level_1')) {
            locationData.state = component.long_name;
            locationData.stateCode = component.short_name
          }
          if (component.types.includes('country')) {
            locationData.country = component.long_name;
          }

        });
        updateLocationData(locationData);
        setLocationDetails(locationData);
        handleCloseSearch()
      } else {
        alert('Location details could not be retrieved.');
      }
    } catch (error) {
      console.error('Error fetching location details:', error);
      alert('Unable to retrieve location details.');
    }
  }
  return (
    <div
      className={`show-location-modal ${searchLocation ? 'increase-width-location-modal' : ''} `}
      onClick={handleCloseSearch}
    >
      <div
        className={`location-modal-containt-div ${searchLocation ? 'show-location-bar-inner-container' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        {searchLocation && (
          <CloseButton 
            handleClose={handleCloseSearch}
            position={'absolute'}
            top={'15px'}
            right={'15px'}
          />
        )}
        <div className='location-heading-and-search-bar-section'>
          <div className='location-modal-heading-container'>
            <span>
              <Image src={'/Assets/icon/location-outlined.svg'} width={80} height={80} alt='delivery' />
            </span>
            <h3>Delivery Location</h3>
          </div>
          <div className='location-search-and-icon'>
            <div className='location-searchand-button'>
              <input
                type="text"
                className="location-search-input"
                value={zipCode}
                onChange={handleInputChange} // Update state on input change
                placeholder="Enter zip code"
              />
              <button className="update-zip-btn" onClick={async () => { await handleButtonClick(); handleCloseSearch() }}>
                {zipLoading && <div className="loader_2" style={{background: '#FFF'}}></div>}
                {zipLoading ? ' Updating...' : 'Update Zip Code'}
              </button>
            </div>
            <div className='use-current-location' onClick={getCurrentLocation}>
              <CiLocationOn size={25} className='location-pop-up-location-icon' />
              {/* <img src={locationModalIcon} alt='location' /> */}
              <h3>Use Current Location</h3>
            </div>
          </div>
        </div>
        <div className='location-modal-detail-section'>
          <h3>Why your zip code is important</h3>
          <p>
            You'll see only the products that deliver to your area, so you can shop for (and get) what you want!?
          </p>
        </div>
      </div>

      {/* <ZipModal
        showMessage={wrongZip}
        errorDetail={wrongZipMessage}
        footerMessage={'Wrong Zip Code'}
        closeModal={handleZipWarningClose}
      /> */}
    </div>
  )
}

export default LocationPopUp
