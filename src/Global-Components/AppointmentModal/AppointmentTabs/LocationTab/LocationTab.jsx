'use client'

import React, { useEffect, useState } from 'react'
import './LocationTab.css';
import { IoIosSearch, IoIosArrowDown } from "react-icons/io";
import { FaPhoneAlt } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import axios from 'axios';
import { url } from '../../../../utils/api';
import Loader from '../../../../UI/Components/Loader/Loader';

const LocationTab = ({ selectedTab, setSelectedTab, handleSelectStore }) => {


  const [nearStores, setNearStores] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleStorsData = async () => {
    const api = `/api/v1/stores/get`;
    try {
      setLoading(true);
      const response = await axios.get(url+api);
      if(response.status === 200) {
        setNearStores(response.data.data);
      }else {
        console.error("Error Fetching Stores Data", response.status);
      }
      setLoading(false);
    } catch (error) {
      console.error("UnExpected Server Error", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {handleStorsData()}, [])

  const [showLocationDetails, setShowLocationDetails] = useState(null);
  const handleLocationDetails = (index) => {
    setShowLocationDetails((prevIndex) => prevIndex === index ? null : index)
  }

  const handlePrevTab = () => {
    setSelectedTab(selectedTab - 1);
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className='location-tab-main-container'>
      {loading && <Loader />}
      <div className='location-tab-header'>
        <h3>
          Set up a time to consult with our room specialists to guide you through your shopping journey.
        </h3>

        <div className='location-search-container'>
          <IoIosSearch size={25} color='var(--secondary-color)' />
          <label>
            {/* Enter Zip Code or City  */}
            <input type='text' placeholder='Enter Zip Code or City' />
          </label>
        </div>

      </div>
      <div className='location-tab-body'>
        <div className='location-body-heading-and-title'>
          <h3>Select your Showroom</h3>
          <p>Displaying closest locations to <span>19134</span></p>
        </div>

        <div className='location-tab-store-list'>
          {nearStores.map((item, index) => (
            <div className='location-tab-store-item' key={index}>

              <div className='location-tab-store-head'>

                <div className='location-head-title-and-miles'>
                  <h3>{item.name}</h3>
                  <span>
                    <p>2.5 miles</p>
                    <IoIosArrowDown 
                      className={`location-tab-arrow ${showLocationDetails === index ?'rotate-location-tab-arrow' : ''}`} 
                      onClick={() => handleLocationDetails(index)} 
                      size={20} 
                      color='var(--secondary-color)' 
                    />
                  </span>
                </div>
                <button onClick={() => handleSelectStore(item)}>SELECT STORE</button>
              </div>

              <div className={`location-tab-store-details ${showLocationDetails === index ? 'show-location-details' : ''}`}>

                <div className='location-tab-store-left-section'>
                  <p>{item.address_1}</p>
                  <div className='location-tab-phone-and-direction'>
                    <span>
                      <FaPhoneAlt size={15} color='var(--secondary-color)' />
                      <p>{item.phone}</p>
                    </span>
                    <span>
                      <FaLocationDot size={15} color='var(--secondary-color)' />
                      <p>Get Directions</p>
                    </span>
                  </div>
                </div>

                <div className='location-tab-right-section'>
                  {item.timings.map((time, index) => (
                    <div className='location-tab-timing-single-card' key={index}>
                      <p>{time.day}</p>
                      <p>{time.time}</p>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          ))}
        </div>

        <div className='location-tab-buttons-container'>
          <button onClick={handlePrevTab}>Previous</button>
        </div>
      </div>
    </div>
  )
}

export default LocationTab
