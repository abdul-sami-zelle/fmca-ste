import React, { useEffect, useState } from 'react'
import './DashboardTabs.css';
import DashTab from '../DashTab/DashTab';
import OrdersTab from '../OrderTab/OrdersTab';
import AddressesTab from '../AddressesTab/AddressesTab';
import AccountDetailsTab from '../AccountDetailsTab/AccountDetailsTab';
import Loader from '../../Loader/Loader';
import { url } from '../../../../utils/api';
import axios from 'axios';
import Favorites from '../DashTab/DashboardComponents/Favorites';
import { useParams } from 'next/navigation';
import { useList } from '@/context/wishListContext/wishListContext';

const DashboardTabs = ({ data }) => {
    const [loading, setLoading] = useState(false);
    const [trigerApi, setTrigerApi] = useState(false);
    const params = useParams();
    const id = params.id;
    const [userToken, setUserToken] = useState('');
    const { wishList } = useList()
    
    useEffect(() => {
        const getToken = localStorage.getItem('userToken');
        if (getToken) {
            setUserToken(getToken)
        }
    }, [])

    const [userData, setUserData] = useState();
    const getBillingData = async (userId, authToken) => {
        try {
            if (!authToken) {
                throw new Error("Authorization token missing");
            }

            const response = await axios.get(
                `${url}/api/v1/web-users/get/${userId}`,
                {
                    headers: {
                        authorization: `${authToken}`,
                    }
                }
            );
            if (response.status === 200) {

                setUserData(response.data.data)
                setTrigerApi(false)
            } else {
                console.error("Error fetching billing address data");
            }


        } catch (error) {
            console.error("Error fetching billing address:", error.message);
            throw error;
        }
    }

    useEffect(() => {
        const userId = localStorage.getItem('uuid')
        const authToken = localStorage.getItem('userToken')
        if (authToken) {
            getBillingData(userId, authToken)
        }
    }, [])

    useEffect(() => {
        const userId = localStorage.getItem('uuid')
        const authToken = localStorage.getItem('userToken')
        if (authToken) {
            getBillingData(userId, authToken)
        }
    }, [trigerApi === true])

    const dashTabsTitles = [
        'Dashboard',
        'Orders',
        'Addresses',
        'Wishlist',
        'Profile'
    ]

    const [currentTabIndex, setCurrentTabIndex] = useState(0)
    const handleTabOpen = (index) => {
        setLoading(true)
        setCurrentTabIndex(index);
        setTimeout(() => setLoading(false), 1000);
    }

    const [favoritesData, setFavoritesData] = useState([]);
    const handleFavoritesData = async () => {
        const api = `${url}/api/v1/web-users/wishlist/${id}`
        try {
            setLoading(true)
            const response = await axios.get(api,
                {
                    headers: {
                        Authorization: userToken, // Replace with your actual token variable
                        'Content-Type': 'application/json', // Optional but good practice
                    }
                });
            if (response.status === 200) {
                setFavoritesData(response.data.wishlist)
            }
        } catch (error) {
            setLoading(false);
            console.error("unExpected Server Error", error);
        } finally { setLoading(false) }
    }

    useEffect(() => {
        if (currentTabIndex === 3) {
            handleFavoritesData()
        }
    }, [currentTabIndex])

    useEffect(() => {
        if (currentTabIndex === 3) {
            handleFavoritesData()
        }
    }, [wishList])

    return (
        <div className='dashboard-all-tabs-toggler-main-container'>
            {loading && <Loader />}
            <div className='dashboard-tabs-toggle-nav'>
                {dashTabsTitles.map((item, index) => (
                    <h3
                        key={index}
                        className={`dash-single-tab-title ${currentTabIndex === index ? 'active-dash-tab' : ''}`}
                        onClick={() => handleTabOpen(index)}
                    >
                        {item}
                    </h3>
                ))}
            </div>
            {
                currentTabIndex === 0 ? <DashTab data={data} /> :
                    currentTabIndex === 1 ? <OrdersTab data={data} /> :
                        currentTabIndex === 2 ? <AddressesTab data={data} userAddresses={userData} setTrigerPoint={setTrigerApi} /> :
                            currentTabIndex === 3 ? <Favorites data={favoritesData} setloader={setLoading} /> :
                                currentTabIndex === 4 ? <AccountDetailsTab data={data} setLoading={setLoading} /> : <></>
            }
        </div>
    )
}

export default DashboardTabs
