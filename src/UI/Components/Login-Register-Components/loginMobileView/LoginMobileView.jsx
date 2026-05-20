import React, { useState } from 'react'
import './LoginMobileView.css';
import { url } from '../../../../utils/api';
import { useUserDashboardContext } from '../../../../context/userDashboardContext/userDashboard';
// import { useNavigate } from 'react-router-dom';
import loadingIcon from "../../../../Assets/Loader-animations/loader-check-two.gif"
import { useRouter } from 'next/navigation';

const LoginMobileView = ({ mobileSignupClicked, handleRegisteView, setSnakeBarMessage, setShowSnakeBar }) => {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setToken } = useUserDashboardContext();
  // const navigate = useNavigate()
  const router = useRouter()

  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    // Simple validation for the form

    setError('');
    setLoading(true);

    // Prepare FormData
    const formData = new FormData();
    formData.append('email', loginEmail);
    formData.append('password', loginPassword);

    try {
      // Send POST request with FormData to the API
      const response = await fetch(`${url}/api/v1/web-users/login`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        setToken(result.token, result?.data?._id)
        setLoginEmail('');
        setLoginPassword('');
        setLoading(false);
        router.push(`/user-dashboard/${result?.data?._id}`)
      } else if (response.status === 400) {
        setShowSnakeBar(true)
        setSnakeBarMessage("Invalid Email");
      } else if (response.status === 401) {
        setShowSnakeBar(true)
        setSnakeBarMessage("Invalid Password");
      } else {
        // Handle error
        setShowSnakeBar(true)
        setSnakeBarMessage(result.message || 'Something went wrong');
        setLoading(false);
      }

    } catch (error) {
      // Handle network error
      setError('Network error, please try again later.');
      setLoading(false);
    } finally {
      setLoading(false);
      setLoading(false);
    }
  };

  return (
    <div className={`mobile-login-main ${mobileSignupClicked ? 'slide-login-sec-right' : ''}`}>
      <div className='login-sec-signup-btn-div'>
        <p>Don't you have a account?</p>
        <button onClick={handleRegisteView}>Sign up</button>
      </div>
      <form onSubmit={handleSubmitLogin} className='mobile-login-sec-inputs'>
        <h3>Login</h3>
        <label className='mobile-login-input-label'>
          Email
          <input
            className='login-and-register-input'
            type='email'
            placeholder='Email'
            value={loginEmail} required
            onChange={(e) => setLoginEmail(e.target.value)}
          />
        </label>
        <label className='mobile-login-input-label'>
          Password
          <input
            className='login-and-register-input'
            type='text'
            required
            placeholder='Password'
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
          />
        </label>
        <div type='submit' className='mobile-logn-sec-login-btn-div'>
          <button>Login</button>
        </div>
      </form>
      {loading && <div className="loading_reg">
        <img src={loadingIcon} alt="" />
        <p>Please Wait...</p>
      </div>}
    </div>
  )
}

export default LoginMobileView
