import React, { useEffect, useState } from 'react'
import './AddressesTab.css';
import axios from 'axios';
import { formatPhoneNumber, url } from '../../../../utils/api';
import Loader from '../../Loader/Loader';
import { useParams } from 'next/navigation';
import { IoIosClose } from 'react-icons/io';
import { FaHome } from "react-icons/fa";

const AddressesTab = ({ userAddresses, setTrigerPoint, data }) => {

  const params = useParams();
  const id = params.id;
  const [loading, setLoading] = useState(false);
  const [modalType, setModalType] = useState('');
  const [isEditTrue, setIsEdit] = useState(false);


  const [billingPayload, setBillingPayload] = useState({
    billingAddress: {
      first_name: userAddresses?.billing_address?.first_name,
      last_name: userAddresses?.billing_address?.last_name,
      address_1: userAddresses?.billing_address?.address_1,
      city: userAddresses?.billing_address?.city,
      state: userAddresses?.billing_address?.state,
      postal_code: userAddresses?.billing_address?.postal_code,
      country: 'USA',
      phone: userAddresses?.billing_address?.phone,
      alt_phone: userAddresses?.billing_address?.alt_phone,
    }
  })

  const [shippingPayload, setShippingPayload] = useState({
    userId: '',
    shippingAddress: {
      first_name: userAddresses?.shipping_address?.first_name,
      last_name: userAddresses?.shipping_address?.last_name,
      address_1: userAddresses?.shipping_address?.address_1,
      city: userAddresses?.shipping_address?.city,
      state: userAddresses?.shipping_address?.state,
      postal_code: userAddresses?.shipping_address?.postal_code,
      country: 'USA',
      phone: userAddresses?.billing_address?.phone,
      alt_phone: userAddresses?.billing_address?.alt_phone,
      // email: userAddresses?.email,
      // phone: '090078601'
    }
  })


  const fetchZipInfo = async (zip) => {
    try {
      const res = await fetch(`https://api.zippopotam.us/us/${zip}`);
      if (!res.ok) throw new Error("ZIP not found");

      const data = await res.json();
      const city = data.places[0]['place name'];
      const state = data.places[0]['state'];

      if (modalType === 'billing-address') {
        setBillingPayload(prev => ({
          ...prev,
          billingAddress: {
            ...prev.billingAddress,
            city,
            state,
          },
        }));
      } else {
        setShippingPayload(prev => ({
          ...prev,
          shippingAddress: {
            ...prev.shippingAddress,
            city,
            state,
          },
        }));
      }
    } catch (error) {
      console.error('Failed to auto-fill address:', error);
    }
  };

  const handleEditBillingAddress = (clickType) => {
    setIsEdit(true)
    setModalType(clickType)
  }
  const handleEditShippingClose = () => {
    setIsEdit(false);
    setModalType('')
  }
  const handleInputData = (e) => {
    const { name, value } = e.target;

    if (modalType === 'billing-address') {
      setBillingPayload((prevPayload) => ({
        ...prevPayload, 
        ...(name === 'email' ? { email: value } : {
          billingAddress: {
            ...prevPayload.billingAddress, 
            [name]: name === 'phone' ? formatPhoneNumber(value) : name === 'alt_phone' ? formatPhoneNumber(value) : value, 
          },
        }), 
      }));
    } else if (modalType === 'shipping-address') {
      setShippingPayload((prevPayload) => ({
        ...prevPayload, 
        ...(name === 'email' ? { email: value } : {
          shippingAddress: {
            ...prevPayload.shippingAddress, // Spread existing shippingAddress
            [name]: value, // Dynamically update the field in shippingAddress
          },
        })
      }));
    }
  }
  const handleUpdateAddress = async () => {
    const billingApi = `/api/v1/web-users/update-billing/${id}`
    const shippingApi = `/api/v1/web-users/update-shipping-address`;
    const userToken = localStorage.getItem('userToken');
    try {

      if (modalType === 'billing-address') {
        setLoading(true)
        // const response = await axios.put(`${url}${billingApi}`, billingPayload);
        const response = await axios.put(
          `${url}${billingApi}`,
          billingPayload,
          {
            headers: {
              Authorization: userToken, // Replace with your actual token variable
              'Content-Type': 'application/json', // Optional but good practice
            }
          }
        );
        if (response.status === 200) {
          setTrigerPoint(true)
        } else {
          console.error("Request response failed");
        }
      } else if (modalType === 'shipping-address') {
        setLoading(true)
        const response = await axios.put(`${url}${shippingApi}`, shippingPayload);
        if (response.status === 200) {
          setTrigerPoint(true)
        } else {
          console.error("Request response failed");
        }
      }

    } catch (error) {
      setLoading(false)
      console.error("UnExpected Server Error", error);
      return {
        error: true,
        message: "Server Error"
      }
    } finally {
      setLoading(false)
      setIsEdit(false)
    }
  }
  // zip state city
  const handleZipCodeChange = async (e) => {
    const zip = e.target.value;

    // Update zip in the form
    const updatedPayload = { ...billingPayload };
    if (modalType === 'billing-address') {
      updatedPayload.billingAddress.postal_code = zip;
      setBillingPayload(updatedPayload);
    } else {
      const updatedShipping = { ...shippingPayload };
      updatedShipping.shippingAddress.postal_code = zip;
      setShippingPayload(updatedShipping);
    }

    if (zip.length === 5) {
      try {
        const res = await fetch(`https://api.zippopotam.us/us/${zip}`);
        if (!res.ok) throw new Error("Invalid ZIP");

        const data = await res.json();
        const city = data.places[0]['place name'];
        const state = data.places[0]['state'];

        if (modalType === 'billing-address') {
          setBillingPayload(prev => ({
            ...prev,
            billingAddress: {
              ...prev.billingAddress,
              city,
              state,
            }
          }));
        } else {
          setShippingPayload(prev => ({
            ...prev,
            shippingAddress: {
              ...prev.shippingAddress,
              city,
              state,
            }
          }));
        }
      } catch (err) {
        console.error('ZIP lookup failed:', err);
      }
    }
  };


  useEffect(() => {
    const zip =
      modalType === 'billing-address'
        ? billingPayload?.billingAddress?.postal_code
        : shippingPayload?.shippingAddress?.postal_code;

    if (zip && zip.length === 5) {
      fetchZipInfo(zip);
    }
  }, [
    billingPayload?.billingAddress?.postal_code,
    shippingPayload?.shippingAddress?.postal_code,
    modalType
  ]);

  useEffect(() => {
    const uuid = localStorage.getItem('uuid')
    if (modalType === 'billing-address') {
      setBillingPayload((prevPayload) => ({
        ...prevPayload,
        userId: uuid
      }));
    } else if (modalType === 'shipping-address') {
      setShippingPayload((prevPayload) => ({
        ...prevPayload,
        userId: uuid
      }));
    }
  }, [modalType])

  return (
    <div className='addresses-main-container'>
      
      {loading && <Loader />}

      <div className='billing-and-shipping-addresses'>
        <div className='user-billing-address'>
          <div>
            <FaHome size={60} color='#595959' />
          </div>
          <div className='billing-address-details'>
            <div className='title-and-edit-icon'>
              <h3>Billing Address</h3>
              <img src={'/Assets/icons/edit.png'} alt='edit icon' onClick={() => handleEditBillingAddress('billing-address')} />
            </div>
            <div className='billing-address-show'>
              <span className='address-show-detail-span'>
                <p>Name</p>
                <h3>{userAddresses?.billing_address?.first_name} {userAddresses?.billing_address?.last_name}</h3>
              </span>
              <span className='address-show-detail-span'>
                <p>Email</p>
                <h3>{userAddresses?.email}</h3>
              </span>
              {/* <span className='address-show-detail-span'>
                <p>Phone</p>
                <h3>{userAddresses?.billing_address?.phone}</h3>
              </span> */}
              <span className='address-show-detail-span'>
                <p>Address 1</p>
                <h3>{userAddresses?.billing_address?.address_1}</h3>
              </span>
              {/* <span className='address-show-detail-span'>
                <p>Address 2</p>
                <h3>{userAddresses?.billing_address?.address_2}</h3>
              </span> */}
              <span className='address-show-detail-span'>
                <p>Postal Cose</p>
                <h3>{userAddresses?.billing_address?.postal_code}</h3>
              </span>
              <span className='address-show-detail-span'>
                <p>City</p>
                <h3>{userAddresses?.billing_address?.city} {userAddresses?.billing_address?.state}</h3>
              </span>


              {/* <p>{userAddresses?.billing_address?.first_name} {userAddresses?.billing_address?.last_name}</p> */}
              {/* <p>{userAddresses?.email}</p> */}
              {/* <p>{userAddresses?.billing_address?.phone}</p> */}
              {/* <p>{userAddresses?.billing_address?.address_1}</p> */}
              {/* <p>{userAddresses?.billing_address?.address_2}</p> */}
              {/* <p>{userAddresses?.billing_address?.postal_code}</p> */}
              {/* <p>{userAddresses?.billing_address?.city} {userAddresses?.billing_address?.state}</p> */}
            </div>
          </div>
        </div>


      </div>

      <div className={`address-edit-modal ${isEditTrue ? 'show-address-edit-modal' : ''}`}>

        <div className='address-edit-modal-content'>

          <div className='address-edit-modal-head'>

            <h3 className='address-edit-main-heading'>{modalType === 'billing-address' ? 'Billing Address Update' : 'Shipping Address Update'}</h3>
            
            <button className='address-edit-modal-close-button' onClick={handleEditShippingClose}>
              <IoIosClose size={25} color='#595959' />
            </button>

          </div>

          <div className='address-edit-modal-body'>

            <div className='two-inputs-row'>

              <label className='label-with-input'>
                First Name
                <input
                  className='input-with-label'
                  type='text'
                  placeholder='First Name'
                  name='first_name'
                  value={
                    modalType === 'billing-address'
                      ? billingPayload?.billingAddress?.first_name
                      : shippingPayload?.shippingAddress?.first_name
                  }
                  onChange={handleInputData}
                />
              </label>

              <label className='label-with-input'>
                Last Name
                <input
                  className='input-with-label'
                  type='text'
                  placeholder='Last Name'
                  name='last_name'
                  value={modalType === 'billing-address'
                    ? billingPayload?.billingAddress?.last_name
                    : shippingPayload?.shippingAddress?.last_name
                  }
                  onChange={handleInputData}
                />
              </label>

            </div>

            <div className='country-indication'>
              <p className='country-region'>Country/Region</p>
              <h3 className='only-country'>United States (USA)</h3>
            </div>

            <div className='two-inputs-row'>

              <label className='label-with-input'>
                Phone
                <input
                  className='input-with-label'
                  type='text'
                  placeholder='Phone'
                  name='phone'
                  value={
                    modalType === 'billing-address'
                      ? billingPayload?.billingAddress?.phone
                      : shippingPayload?.shippingAddress?.phone
                  }
                  onChange={handleInputData}
                />
              </label>

              <label className='label-with-input'>
                Alternative Phone
                <input
                  className='input-with-label'
                  type='text'
                  placeholder='Alternative Phone'
                  name='alt_phone'
                  value={modalType === 'billing-address'
                    ? billingPayload?.billingAddress?.alt_phone
                    : shippingPayload?.shippingAddress?.alt_phone
                  }
                  onChange={handleInputData}
                />
              </label>

            </div>

            <div className='double-address'>

              <label className='label-with-input'>
                Street Address
                <input
                  className='input-with-label'
                  type='text'
                  placeholder='House number & Street number'
                  name='address_1'
                  value={modalType === 'billing-address'
                    ? billingPayload?.billingAddress?.address_1
                    : shippingPayload?.shippingAddress?.address_1
                  }
                  onChange={handleInputData}
                />
              </label>

              <input className='input-with-label' type='text' placeholder='Apartment, suite, unit etc' />

            </div>

            <div className='zip_city_state_input_container'>

              <label className='label-with-input'>
                Zip Code
                <input
                  className='input-with-label'
                  type='text'
                  placeholder='123123'
                  name='postal_code'
                  value={modalType === 'billing-address'
                    ? billingPayload?.billingAddress?.postal_code
                    : shippingPayload?.shippingAddress?.postal_code
                  }
                  onChange={handleZipCodeChange}
                />
              </label>

              <label className='label-with-input'>
                Towt/City
                <input
                  className='input-with-label'
                  type='text'
                  placeholder='New York'
                  name='city'
                  value={modalType === 'billing-address'
                    ? billingPayload?.billingAddress?.city
                    : shippingPayload?.shippingAddress?.city
                  }
                  onChange={handleInputData}
                />
              </label>

              <label className='label-with-input'>
                State
                <input
                  className='input-with-label'
                  type='text'
                  placeholder='Pennsylvenian'
                  name='state'
                  value={modalType === 'billing-address'
                    ? billingPayload?.billingAddress?.state
                    : shippingPayload?.shippingAddress?.state
                  }
                  onChange={handleZipCodeChange}
                />
              </label>

            </div>

            <div className='update-address-div'>
              <button className='update-address-button' onClick={handleUpdateAddress}>
                Update Address
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

export default AddressesTab
