import React, { useEffect, useState } from 'react'
import './OrdersTab.css';
import arrowLeft from '../../../../Assets/icons/arrow-left-charcol.png';
import arrowRight from '../../../../Assets/icons/arrow-right-charcol.png';
import Loader from '../../Loader/Loader';
import OrderViewModal from '../OrderViewModal/OrderViewModal';
import Pagination from '../../../../Global-Components/Pagination/Pagination';
import { useRouter } from 'next/navigation';
import { HiDotsHorizontal } from "react-icons/hi";
import OrderViewSecondModal from '../OrderViewModal/OrderViewSecondModal';
import generateInvoicePDF from '../OrderInvoice/OrderInvoice';
import { useUserDashboardContext } from '@/context/userDashboardContext/userDashboard';
import axios from 'axios';
import { url } from '@/utils/api';

const OrdersTab = ({ data }) => {



  const dataPerPage = 10;
  const [currentTableDataIndex, setCurrentTableDataIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const ordersData = [
    {
      row: 'TableHeah', tableHeadData:
        [
          'Order Number',
          'Invoice',
          'Date',
          'Status',
          'Total',
          'Action'
        ],
      tableBody: data?.orders?.map((item, index) => ({
        orderNumber: item.order_number,
        invoice: item.inv_number,
        date: item.date,
        status: item?.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1).toLowerCase() : '',
        total: `$${item.total} for ${item.items} items`,
        order_id: item?.order_id
      }))
    }
  ]


  const totalItems = ordersData[0]?.tableBody.length || 0;
  const totalPages = Math.ceil(totalItems / dataPerPage);

  const handleNextPage = () => {
    setCurrentTableDataIndex((prevIndex) => {
      if (prevIndex < totalPages - 1) {
        setLoading(true);
        setTimeout(() => setLoading(false), 1500);
        return prevIndex + 1;
      }
      return prevIndex;
    });
  };

  const handlePrevPage = () => {
    setCurrentTableDataIndex((prevIndex) => {
      if (prevIndex > 0) {
        setLoading(true);
        setTimeout(() => setLoading(false), 1500);
        return prevIndex - 1;
      }
      return prevIndex;
    });
  };

  const handleActivePage = (pageNumber) => {
    setLoading(true);
    setCurrentTableDataIndex(pageNumber - 1);
    setTimeout(() => setLoading(false), 1500);
  };

  const starterIndex = currentTableDataIndex * dataPerPage;
  const endIndex = starterIndex + dataPerPage;
  const currentItems = ordersData[0]?.tableBody.slice(starterIndex, endIndex) || [];

  // View Modal
  const [viewProductModal, setViewProductModal] = useState(false)
  const [selectedProductData, setSelectedProductData] = useState([])
  const [showActionButtons, setShowActionButton] = useState(null);

  const [orderID, setOrderId] = useState('')

  const handleViewInvoice = async (item) => {
    const response = await axios.get(`${url}/api/v1/orders/get_by_id?_id=${item.order_id}`)
    if(response.status === 200) {
      generateInvoicePDF(response.data.order)
    }
  }


  const handleViewProductData = (data) => {
    setShowActionButton(null)
    setViewProductModal(true);
    setSelectedProductData(data);
    setOrderId(data.order_id);
  }

  const handleTrackOrder = () => {
    window.open('https://track.myfurnituremecca.com/', '_blank');
    setShowActionButton(null);
  }

  useEffect(() => {
    if (viewProductModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [viewProductModal])



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

  const handleActionButtons = (index) => {
    setShowActionButton((prevInd) => prevInd !== index ? index : null);
  }


  return (
    <div className='dash-orders-main-container'>
      {loading && <Loader />}
      <table className='order-table'>
        {/* [
          'Order Number',
          'Invoice',
          'Date',
          'Status',
          'Total',
          'Action'
        ],
        <tr>
              {items.tableHeadData.map((headItems, headItemIndex) => (
                <th className={headItems === 'Date' || headItems === 'Order Number' ? 'action-td' : ''} key={headItemIndex}>{headItems}</th>
              ))}
            </tr> */}
        {ordersData.map((items, index) => (
          <>
            <tr>
              {items.tableHeadData.map((headItems, headItemIndex) => (
                <th className={headItems === 'Date' || headItems === 'Order Number' ? 'action-td' : ''} key={headItemIndex}>{headItems}</th>
              ))}
            </tr>
            {currentItems.map((tbody, tindex) => (
              <tr key={tindex}>
                <td className='action-td'>{tbody.orderNumber}</td>
                <td>{tbody.invoice}</td>
                <td className='action-td'>{formatToUSTime(tbody.date)}</td>
                <td>{tbody.status}</td>
                <td>{tbody.total}</td>
                <td >
                  <div className='table-action-buttons'>
                    <button onClick={() => handleViewInvoice(tbody)}>View</button>
                    <button onClick={() => handleViewProductData(tbody)}>Invoice</button>
                    <button onClick={() => handleTrackOrder(tbody)}>Reschedule</button>
                  </div>

                  <div className='table-mobile-action-container'>
                    <button onClick={() => handleActionButtons(tindex)}>
                      <HiDotsHorizontal size={15} color='#595959' />
                    </button>

                    <div className={`table-mobile-buttons-container ${showActionButtons === tindex ? 'show-action-button-container' : ''}`}>
                      <button onClick={generateInvoicePDF}>View</button>
                      <button onClick={() => handleViewProductData(tbody)}>Invoice</button>
                      <button onClick={() => handleTrackOrder(tbody)}>Reschedule</button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </>
        ))}
      </table>
      <div className='paginations'>
        {data?.orders?.length > 10 && <Pagination
          activePageIndex={currentTableDataIndex + 1}
          totalPages={{ totalPages }}
          handleActivePage={handleActivePage}
          handleNextPage={handleNextPage}
          handlePrevPage={handlePrevPage}
        />}



      </div>
      {/* <OrderViewModal
        viewModal={viewProductModal}
        setViewModal={setViewProductModal}
        orderId={orderID}
      /> */}
      <OrderViewSecondModal
        viewModal={viewProductModal}
        setViewModal={setViewProductModal}
        orderId={orderID}
      />
    </div>
  )
}

export default OrdersTab
