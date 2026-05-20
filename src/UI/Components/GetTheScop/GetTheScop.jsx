import React, { useState, useEffect } from 'react'
import './GetTheScop.css';
import Link from 'next/link';
import axios from 'axios';
import checked from "../../../Assets/checked.png"
import LoaderAnimation from '../../../Assets/Loader-animations/loader-check-two.gif';
import { url } from '../../../utils/api';
import Image from 'next/image';

const GetTheScop = ({setShowSnakeBar, setSnakeBarMessage}) => {

  // State for email input and form submission status
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle email input change
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setError(''); // Reset error when the user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevent the default form submission

    if (!email) {
      setShowSnakeBar(true);
      setSnakeBarMessage('Email is required')
      return;
    }
    if (!validateEmail(email)) {
      setShowSnakeBar(true);
      setSnakeBarMessage('Please enter a valid email address')
      return;
    }

    setIsSubmitting(true);
    try {
      // Send data to API
      const response = await axios.post(`${url}/api/v1/activate-scoop/add`, {
        email,
      });


      // Handle success
      if (response.status === 201) {
        setIsSubscribed(true);
      }
      else if (response.status === 409) {
        setShowSnakeBar(true);
        setSnakeBarMessage('Email already exists')
      }
      else {
        setShowSnakeBar(true);
        setSnakeBarMessage(response.data.message || 'Something went wrong')
      }
    } catch (error) {
      // Handle error
      console.error('Error signing up:', error);
      setShowSnakeBar(true);
        setSnakeBarMessage('Error signing up')

      // Check if the error is due to the API response or a network issue
      if (error.response) {
        // If the error has a response (API returned an error)
        setShowSnakeBar(true);
        setSnakeBarMessage(error.response.data.message || 'Something went wrong, please try again later.')
      } else {
        // If there was a network error or no response
        setShowSnakeBar(true);
        setSnakeBarMessage('Network error, please try again later.')
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className='get-the-scop-main-container'>
        <div className='get-the-scop-form-container'>
          {!isSubscribed ? <div className='get-the-scop-form'>
            <h3>Get the Scoop</h3>
            <span className='get-the-scop-offers'>
              <p className='get-the-scoop-offers-keywords'> Discounts</p> |
              <p className='get-the-scoop-offers-keywords'> Offers</p> |
              <p className='get-the-scoop-offers-keywords'> Best Price</p>
            </span>
            <form className='get-the-scoop-form-input-and-button' onSubmit={handleSubmit}>
              <div className='get-the-scop-input'>
                <input
                  type='text'
                  placeholder='Email Address'
                  value={email}
                  onChange={handleEmailChange}
                />

                {isSubmitting ?
                  <Image className='scoop_loader' src={'/Assets/Loader-animations/loader-check-two.gif'} width={60} height={60} alt="" />
                  : <button className='get-the-scoop-submit-button' type='submit' disabled={isSubmitting}>
                    Sign me up
                  </button>}
              </div>
              {error && <p style={{ color: 'red' }}>{error}</p>}

            </form>
            <p className='get-the-scoop-terms-and-condition'>By Signing Up You Agree To Our <Link href={'/terms-and-conditions'} className='desktop-get-the-scoop-terms'> Terms of Use </Link> and <Link href={'/privacy-policy'} className='desktop-get-the-scoop-terms'> Privacy Policy </Link></p>

          </div> :
            <div className="subscription_done">
              <img src={checked} alt='checked' />
              <p className='done_message'>Congratulations!</p>
              <p className='done_message_2'>Your Subscription Has Been Done Successfully.</p>
              <p className='done_message_3'>Check your email</p>
            </div>}

          {/* <div className="divider_line_gts">

          </div> */}

          {/* <button onClick={() => { window.open("https://flyer.myfurnituremecca.com", "_blank"); }} className='see_all_promotions_btn'>View Exclusive Promotions</button> */}
        </div>

      </div>

      {/* Mobile view */}
      <div className='mobile-view-scop-main-container'>
        <div className='mobile-view-get0the-scoop-overlay'>
          <div className='mobile-view-get-scoop-heading'>
            <h3>Get The Scoop</h3>
            <span>
              <Link href={'#'}>Offer</Link> |
              <Link href={'#'}>Discounts</Link> |
              <Link href={'#'}>Best Prices</Link>
            </span>
          </div>
          {!isSubscribed ?
            <form style={{ width: "100%" }} onSubmit={handleSubmit}>

              <div className='mobile-view-get-scoop-input-and-button'>
                <input
                  type='text'
                  placeholder='Email Address'
                  value={email}
                  onChange={handleEmailChange}
                />
                {error && <p style={{ color: 'red', fontSize: "13px", margin: "0", padding: "0", lineHeight: "10px" }}>{error}</p>}
                {isSubmitting ? <Image className='scoop_loader' src={'/Assets/Loader-animations/loader-check-two.gif'} width={60} height={60} alt="" /> : <button type='submit' disabled={isSubmitting}>
                  Sign me up
                </button>}
              </div>

            </form>
            :
            <div className="subscription_done">
              <Image src={'/Assets/checked.png'} width={40} height={40} />
              <p className='done_message'>Congratulations!</p>
              <p className='done_message_2'>Your Subscription Has Been Done Successfully.</p>
              <p className='done_message_3'>Check your email</p>
            </div>}
          {/* <p className='mobile-view-conditions'>By signing up, you agree to our <Link href={'/privacy-policy'} className='mobile-view-get-the-scoop-conditions'> Privacy Policy </Link> and <Link href={'/terms-and-conditions'} className='mobile-view-get-the-scoop-conditions'> Terms of Use </Link>.</p> */}
          {/* <button onClick={() => { window.open("https://flyer.myfurnituremecca.com", "_blank"); }} className='see_all_promotions_btn'>View Exclusive Promotions</button> */}
        </div>
      </div>
    </>
  )
}

export default GetTheScop