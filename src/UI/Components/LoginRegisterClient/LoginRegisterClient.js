'use client'

import React, { useState, useEffect } from 'react'
import './LoginRegister.css'
import Register from '../../Components/Login-Register-Components/Register/Register'
import Login from '../../Components/Login-Register-Components/Login/Login'
import RegisterMobileView from '../../Components/Login-Register-Components/RegisterMobileView/RegisterMobileView'
import LoginMobileView from '../../Components/Login-Register-Components/loginMobileView/LoginMobileView'
// import { useLocation, useNavigate } from 'react-router-dom';
import { url } from '../../../utils/api';
import { useUserDashboardContext } from '../../../context/userDashboardContext/userDashboard'
import { useGlobalContext } from '../../../context/GlobalContext/globalContext'
import { useRouter } from 'next/navigation'
import SnakBar from '@/Global-Components/SnakeBar/SnakBar'

const LoginRegisterClient = () => {

  // const navigate = useNavigate();
  const router = useRouter()
  // const [signinClicked, setSigninClicked] = useState(false)
  // const [mobileSignupClicked, setMobileSignupClicked] = useState(true)

  const { setMainLoader } = useGlobalContext();
  const { setUserToken, signinClicked, setSigninClicked, mobileSignupClicked, setMobileSignupClicked } = useUserDashboardContext();

  const [isTokenValid, setIsTokenValid] = useState(false);


  const checkToken = async () => {
    if(typeof window !== 'undefined') {
      const token = localStorage.getItem('userToken');
      
      if (token) {
        try {
          setMainLoader(true);
          const response = await fetch(`${url}/api/v1/web-users/verify-token`, {
            method: "GET",
            headers: {
              authorization: `${token}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setUserToken(token);
            setIsTokenValid(true);
            setMainLoader(false);
            router.push("/user-dashboard")
          } else {
            console.warn("Token is invalid or expired. Removing it.");
            localStorage.removeItem('userToken');
            setUserToken(null);
            setIsTokenValid(false);
            setMainLoader(false);
          }
        } catch (error) {
          console.error("Error verifying token:", error);
          localStorage.removeItem('userToken');
          setUserToken(null);
          setIsTokenValid(false);
          setMainLoader(false);
        }
  
        setMainLoader(false);
      }
      else {
        setMainLoader(false);
      }
    }

  };


  const moveToLoginDash = async () => {
    await checkToken();
  }


  const [prevState, setPrevState] = useState(null);
  useEffect(() => {
    // Ensure this runs only in the browser
    if(typeof window !== 'undefined'){
      const storedUuid = localStorage.getItem('uuid');
      if (storedUuid) {
        setPrevState(storedUuid);
      }
    }
  }, []);


  // Check if the state exists and set default values accordingly
  useEffect(() => {
    if (!prevState) {
      moveToLoginDash();
    }
  }, [prevState]);

  const handleSigninSlide = () => {
    setSigninClicked(!signinClicked);
  }

  const handleMobileSignup = () => {
    setMobileSignupClicked(!mobileSignupClicked);
  }

  const [showSnakeBar, setShowSnakeBar] = useState(false);
    const [snakeBarMessage, setSnakeBarMessage] = useState();


    const handleCloseSnakeBar = () => {
        setShowSnakeBar(false)
    }

   

  return (
    <>
      <div className='login-register-main-page'>
        <Register
          handleBtnClicked={handleSigninSlide}
          signinClicked={signinClicked}
        />
        <Login
          signupclicked={signinClicked}
        />
      </div>
      <div className='mobile-login-and-register-page'>
        <LoginMobileView
          mobileSignupClicked={mobileSignupClicked}
          handleRegisteView={handleMobileSignup}
          setSnakeBarMessage={setSnakeBarMessage}
          setShowSnakeBar={setShowSnakeBar}
        />
        <RegisterMobileView
          mobileSignupClicked={mobileSignupClicked}
          handleRegisterView={handleMobileSignup}
          setSnakeBarMessage={setSnakeBarMessage}
          setShowSnakeBar={setShowSnakeBar}
        />
      </div>

      <SnakBar
        message={snakeBarMessage}
        openSnakeBarProp={showSnakeBar}
        setOpenSnakeBar={setShowSnakeBar}
        onClick={handleCloseSnakeBar}
      />
    </>
  )
}

export default LoginRegisterClient