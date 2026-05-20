'use client'
import React, { useState } from 'react'
import './DashTab.css';
import DashboardTab from './DashboardComponents/dashTab';
import SalesPerformance from './DashboardComponents/SalesPerformance';
import BarChart from './DashboardComponents/ordersChart';
import DashboardTab2 from './DashboardComponents/dashTab2';
import { IoMdLogOut } from "react-icons/io";
import { useUserDashboardContext } from '../../../../context/userDashboardContext/userDashboard';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaUserCircle } from "react-icons/fa";
import { url } from '@/utils/api';
import Loader from '../../Loader/Loader';
// import { useNavigate } from 'react-router-dom';


const DashCard = ({ data }) => {
  // const navigate = useNavigate();
  const router = useRouter();
  const { setUserToken } = useUserDashboardContext();
  const [loader, setLoader] = useState(false);

  const logout = async () => {
    setLoader(true)
    localStorage.removeItem('userToken');
    localStorage.removeItem('uuid');
    localStorage.setItem('cartUid', "null");
    setUserToken(null);
    // navigate("/my-account", { state: { message: "decided" } })
    router.push("/my-account",)
    // setLoader(false)
  }
  return (
    <div className='dash-tab-main-container'>
      {loader && <Loader />}
      <div className="most_upper_section">
        <div className="most_upper_section_left">
          <h2 className='greeting'><strong>Hey</strong>, {data?.first_name} {data?.last_name}</h2>
          <h3 className='descri'>Analyze your report</h3>
        </div>
        <div className="most_upper_section_right">
          <div className="profileAvatar">

            {data && data?.image ? (
              <Image src={`${url}${data?.image}`} width={60} height={60} alt='profile' />
            ) : (
              <span>
                <FaUserCircle size={60} color='var( --tertiary-color)' />
              </span>
            )}
          </div>
          <div className="logoutButton">
            <button onClick={() => { logout() }} >
              <p>Logout</p>
              <IoMdLogOut className='logout-btn-icon' />
            </button>
          </div>
        </div>

      </div>
      <div className='upper_tabs'>
        <DashboardTab name={"Total Orders"} thunder={'var(--orange-fill)'} value={data?.summary?.totalOrders} unit={data?.summary?.totalOrders > 1 ? "Orders" : "Order"} slug={"total-orders"} />
        <DashboardTab name={"Processing Orders"} thunder={'white'} value={data?.summary?.totalProcessingOrders} unit={data?.summary?.totalProcessingOrders > 1 ? "Orders" : "Order"} slug={"total-orders"} style_name={"white"} />
        <DashboardTab name={"Wishlist Items"} thunder={'white'} value={data?.summary?.totalWishlists} unit={data?.summary?.totalWishlists > 1 ? "Items" : "Item"} slug={"total-orders"} style_name={"white"}/>
      </div>

      <div className="lower_charts">
        <div className="lower_charts_1">
          <SalesPerformance data={data}/>
        </div>
        <div className="lower_charts_2">
          <BarChart data={data} />
        </div>

      </div>
    </div>
  )
}

export default DashCard