import React, { useState } from 'react';
import './FirstToKnow.css';
// import { Link } from 'react-router-dom';
import Link from 'next/link';
import axios from 'axios';
import LoaderAnimation from '../../../../Assets/Loader-animations/Animation - 1728736748029 (1).gif';
import checked from '../../../../Assets/checked.png';
// import { url } from '../../../../utils/api';
import { url } from '@/utils/api';

const FirstToKnow = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setError(''); // Reset error when the user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError('Email is required');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(`${url}/api/v1/activate-scoop/add`, { email });

      if (response.status === 201) {
        setIsSubscribed(true);
      } else if (response.status === 409) {
        setError('Email already exists');
      } else {
        setError(response.data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Error signing up:', error);
      if (error.response) {
        setError(error.response.data.message || 'Something went wrong, please try again later.');
      } else {
        setError('Network error, please try again later.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='first-to-know-main-container'>
      <h3 className='first-to-know-main-heading'>First To Know</h3>
      <div className='first-to-know-email-button-and-details'>
        {!isSubscribed ? (
          <>
            <p className='first-to-know-second-heading'>Join our mailing list</p>
            <form className='first-to-know-emal-btn' onSubmit={handleSubmit}>
              <input 
                type='text' 
                placeholder='Email Address...' 
                className='first-to-know-email-input' 
                value={email} 
                required
                onChange={handleEmailChange} 
              />
              {isSubmitting ? (
                <img className='scoop_loader' src={LoaderAnimation} alt='Loading...' />
              ) : (
                <button className='first-to-know-btn' type='submit' disabled={isSubmitting}>Sign up</button>
              )}
              {error && <p style={{ color: 'red' ,textAlign:"center" , fontSize:"12px",margin:"0" }}>{error}</p>}
            </form>
            <span className='first-to-know-privacy-policy'>By signing up you agree to our <Link  href={'/terms-and-conditions'} className='first-to-know-link'>Terms of use</Link> and <Link href={'/privacy-policy'} className='first-to-know-link'>Privacy Policy</Link></span>
          </>
        ) : (
          <div className='subscription_done'>
            <img src={checked} alt='checked' />
            <p className='done_message'>Congratulations!</p>
            <p className='done_message_2'>Your Subscription Has Been Done Successfully.</p>
            <p className='done_message_3'>Check your email</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FirstToKnow;