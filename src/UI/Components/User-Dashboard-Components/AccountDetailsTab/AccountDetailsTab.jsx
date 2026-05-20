import React, { useState, useRef, useEffect } from 'react'
import './AccountDetailsTab.css';
import { CiUser } from "react-icons/ci";
import { capitalize, formatPhoneNumber, url } from '../../../../utils/api';
// import { FaEdit } from "react-icons/fa";
// import BillingAddressModal from '../../../../Global-Components/BillingAddressModal/BillingAddressModal';
import axios from 'axios';
import { useParams } from 'next/navigation';
import StatusModal from '@/UI/Modals/StatusModal/StatusModal';
import { IoIosCheckmarkCircleOutline, IoIosCloseCircleOutline } from "react-icons/io";
import { BsExclamationCircle } from "react-icons/bs";

const AccountDetailsTab = ({ data, setLoading }) => {
  const fileInputRef = useRef(null)
  const [userDetails, setUserDetails] = useState({
    first_name: data?.first_name ?? '',
    last_name: data?.last_name ?? '',
    email: data?.email,
    profile_image: data?.image
  })



  const [imgUrl, setImgUrl] = useState('')



  const handleButtonclick = () => {
    fileInputRef.current.click();
  }

  const [isImageChange, setIsImageChange] = useState(false);
  const handleProfileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const maxSize = 2 * 1024 * 1024; // 2MB in bytes

      if (file.size > maxSize) {
        setShowStatus(true);
        setStatusModalData({
          status: 'Warning',
          message: "Image size must not exceed 2MB. Please upload a smaller file.",
          textColor: '#FFA500',
          icon: <BsExclamationCircle size={60} color='#FFA500' />
        })
        return;
      }

      const imageUrl = URL.createObjectURL(file);
      setImgUrl(imageUrl);
      setIsImageChange(true);

      setUserDetails((prevInfo) => ({
        ...prevInfo,
        profile_image: file
      }));
    }

  }
  const params = useParams();
  const id = params.id;
  const [userToken, setUserToken] = useState('');
  useEffect(() => {
    const getToken = localStorage.getItem('userToken');
    if (getToken) {
      setUserToken(getToken)
    }
  }, [])

  const [showStatus, setShowStatus] = useState(false);
  // const [successLoader, setSuccessLoader] = useState(false);
  const [statusModalData, setStatusModalData] = useState({
    status: '',
    message: '',
    textColor: '',
    icon: null
  })
  const handleUpdateUserDetails = async () => {
    const api = `${url}/api/v1/web-users/update-image/${id}`
    const formData = new FormData();

    formData.append('image', userDetails.profile_image)

    try {
      setLoading(true)
      const response = await axios.put(api, formData, {
        headers: {
          Authorization: userToken,
        }
      })
      if (response.status === 200) {
        setIsImageChange(false);
        setLoading(false);
        setShowStatus(true);
        setStatusModalData({
          status: response.data.status,
          message: response.data.message,
          textColor: 'green',
          icon: <IoIosCheckmarkCircleOutline size={60} color='green' />
        })
      }
    } catch (error) {
      console.error("UnExpected Server Error", error);
      setShowStatus(true)
      setLoading(false)
      setStatusModalData({
        status: 'Failed',
        message: error.response.data.message,
        textColor: 'red',
        icon: <IoIosCloseCircleOutline size={60} color='red' />
      })
    } finally {
      setIsImageChange(false)
      setLoading(false)
    }
  }

  const handleUserDetailsChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevInfo) => ({
      ...prevInfo,
      [name]: name === 'contact' ? formatPhoneNumber(value) : value
    }));
  }

  // const [openBillingModal, setOpenBillingModal] = useState(false);
  // const handleOpenBillingModal = () => {
  //   setOpenBillingModal(true)
  // }


  // const handleBillingModalclose = () => {
  //   setOpenBillingModal(false);
  // }

  function formatToUSTime(isoString) {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York', // Change to desired US timezone if needed
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  }


  // useDisableBodyScroll(openBillingModal)


  return (
    <div className='account-details-main-section'>
      <div className='account-details-inner-section'>
        <div className='account-detail-user-profile'>
          <div className='account-detail-user-profile-container' onClick={handleButtonclick}>
            {userDetails.profile_image !== null ? (
              imgUrl !== '' ? <img src={imgUrl} alt='user profile' className='user-profile-picture' /> : <img src={url + userDetails.profile_image} alt='user profile' className='user-profile-picture' />
            ) : (
              <CiUser color='var(--secondary-color)' size={80} />
            )}
          </div>

          <input type='file' ref={fileInputRef} style={{ display: 'none' }} onChange={handleProfileChange} />
          {isImageChange ? (
            <button className='upload-image-button' onClick={handleUpdateUserDetails}>
              Update
            </button>
          ) : (
            <button className='upload-image-button' onClick={handleButtonclick}>
              Change
            </button>
          )}
        </div>

        <div className='account-details-user-info'>

          <div className='user-info-head'>
            <h3>User Information</h3>
            {/* <button>
              <FaEdit size={24} color='var(--secondary-color)' onClick={handleOpenBillingModal} />
            </button> */}
          </div>

          <div className='user-info-body'>
            {Object.entries(userDetails).map((([key, value]) =>
              key !== 'profile_image' && (
                <label>
                  {capitalize(key)}
                  <input
                    type='text'
                    name={key}
                    value={value}
                    onChange={handleUserDetailsChange}
                  />
                </label>
              )
            ))}
          </div>

          <div className='last-login-and-update-container'>
            <span className='last-login-and-update'>
              <p>Last Login:</p>
              <h3>{formatToUSTime(data?.lastLogin)}</h3>
            </span>
            <span className='last-login-and-update'>
              <p>Last Update:</p>
              <h3>{formatToUSTime(data?.updatedAt)}</h3>
            </span>
          </div>

        </div>

      </div>





      {/* <BillingAddressModal
        showBilling={openBillingModal}
        handleCloseBillingModal={handleBillingModalclose}
      /> */}

      <StatusModal
        showModal={showStatus}
        setShowModal={setShowStatus}
        status={statusModalData.status}
        message={statusModalData.message}
        statusIcon={statusModalData.icon}
        textColor={statusModalData.textColor}
      />
    </div>
  )
}

export default AccountDetailsTab
