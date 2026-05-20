'use client'

import React, { useState, useEffect } from 'react'
import './UserDashboard.css';
import DashboardTabs from '../../Components/User-Dashboard-Components/DashboardTabs/DashboardTabs';
import { url } from '../../../utils/api';
import { useUserDashboardContext } from '../../../context/userDashboardContext/userDashboard';
import { useGlobalContext } from '../../../context/GlobalContext/globalContext';
import { useRouter } from 'next/navigation';
import Loader from '../Loader/Loader';

const UserDashboardClient = ({ id }) => {
  // const navigate = useNavigate();
  const router = useRouter();
  const { mainLoader, setMainLoader } = useGlobalContext();
  const { setUserToken } = useUserDashboardContext();
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [userData, setUserData] = useState({})
  const [loader, setLoader] = useState(false);
  // const [initialChecked, setInitialChecked] = useState(false);

  // const id = params.id;

  const checkToken = async () => {
    // const token = localStorage.getItem('userToken');
    const token = typeof window !== 'undefined' ? localStorage.getItem('userToken') : null;
    if (token) {
      try {
        setLoader(true)
        setMainLoader(true);
        const response = await fetch(`${url}/api/v1/web-users/verify-token`, {
          method: "GET",
          headers: {
            authorization: `${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          const response2 = await fetch(`${url}/api/v1/web-users/get/${id}`, {
            method: "GET",
            headers: {
              authorization: `${token}`,
            },
          });
          if (response2.ok) {
            const data = await response2.json();
            setUserData(data.data)
            setIsTokenValid(true);
            setLoader(false)
            setMainLoader(false);
          } else {

          }

        } else {
          localStorage.removeItem('userToken');
          setUserToken(null);
          setIsTokenValid(false);
          setMainLoader(false);
          setLoader(false)
          router.push("/my-account")
        }
      } catch (error) {
        localStorage.removeItem('userToken');
        setUserToken(null);
        setIsTokenValid(false);
        setMainLoader(false);
        setLoader(false)
        router.push("/my-account")
      } finally {
        setMainLoader(false);
        setLoader(false)
      }
    }
    else {
      setMainLoader(false);
      router.push("/my-account")
    }

  };

  const moveToLoginDash = async () => {
    if (!id) return
    await checkToken();
  }

  const [prevState, setPrevState] = useState(null);
  useEffect(() => {
    // Ensure this runs only in the browser
    const storedUuid = localStorage.getItem('uuid');
    if (storedUuid) {
      setPrevState(storedUuid);
    }
  }, []);


  // Check if the state exists and set default values accordingly
  useEffect(() => {
    if (!prevState) {
      moveToLoginDash();
    }
  }, [prevState]);

  useEffect(() => {
    if (userData.length === 0) {
      const userUid = localStorage.getItem('uuid')
      const userToken = localStorage.getItem('userToken')
      if (userUid && userToken) {
        moveToLoginDash()
      }
    }
  }, [userData])


  return (
    <div className='user-dashboard-main-page'>
      {Object.keys(userData).length === 0 && <Loader />}
      <div className='user-dashboard-main-heading'>
        <h3>My Account</h3>
      </div>
      <DashboardTabs data={userData} />
    </div>
  )
}

export default UserDashboardClient
