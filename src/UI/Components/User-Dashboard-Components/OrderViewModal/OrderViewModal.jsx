import React, { useEffect, useState } from 'react'
import './OrderViewModal.css'
import { IoIosClose } from 'react-icons/io'
import Image from 'next/image'
import axios from 'axios'
import { formatedPrice, url } from '@/utils/api'
import Loader from '../../Loader/Loader'

const OrderViewModal = ({ viewModal, setViewModal, orderId }) => {



    const handleCloseOrderView = () => {
        setViewModal(false)
    }

    const [loader, setLoader] = useState(false);
    const [orderData, setOrderData] = useState({})
    const handleOrderDetails = async () => {
        const api = `${url}/api/v1/orders/get_by_id?_id=${orderId}`;

        try {
            setLoader(true);
            const response = await axios.get(api);
            if (response.status === 200) {
                setOrderData(response.data.order)
            }
        } catch (error) {
            setLoader(false);
            console.error("UnExpected Server Error", error);
        } finally { setLoader(false) }
    }

    useEffect(() => {
        handleOrderDetails()
    }, [orderId])

    const invoiceDetails = [
        {
            section: 'Invoice to:', details: [
                { name: `${orderData?.billing?.first_name} ${orderData?.billing?.last_name}`, valOne: orderData?.billing?.address_1, valTwo: orderData?.billing?.phone }
            ]
        },
        {
            section: 'Invoice from:', details: [
                { name: '101 East Venango St', valOne: '(349) 898-4389', valTwo: 'meccacustomercare@gmail.com' }
            ]
        },
        {
            section: 'Payment Method:', details: [
                { name: (orderData?.payment_method === 'cybersource_credit_card' || data.payment_method === 'authorize_net' ) && 'Credit Card', valOne: orderData?.transaction_id }
            ]
        },
    ]

    function formatDateToReadable(isoDate) {
        const date = new Date(isoDate);
        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    }

    return (
        <div className={`order-view-modal-main ${viewModal ? 'show-product-modal' : ''}`} onClick={handleCloseOrderView}>
            {loader && <Loader />}
            <div className='order-view-modal-inner-sec' onClick={(e) => e.stopPropagation()}>
                {/* <button className='order-close-btn' onClick={handleCloseOrderView}>
                <IoIosClose size={25} color='#595959' />
            </button> */}

                {/* Body */}
                <div className='order-view-modal-body'>
                    <div className='order-body-head'>
                        <h3>Invoice</h3>
                        <Image src={'/Assets/Logo/main-logo.png'} width={200} height={40} alt='logo' />
                    </div>

                    <div className='date-and-invoice-number-contianer'>
                        <span>
                            <h3>Invoice #</h3>
                            <p>INV-{orderData?.uid} </p>
                        </span>
                        <span>
                            <h3>Date:</h3>
                            {/* <p>12 July 2025</p> */}
                            <p>{formatDateToReadable(orderData?.createdAt)}</p>
                        </span>
                    </div>

                    <div className='order-personal-details-container'>
                        {invoiceDetails.map((item, index) => (
                            <div key={index} className='order-detail-single-column'>
                                <h3>{item.section}</h3>
                                {item.details.map((innerItem, innerIndex) => (
                                    <span key={innerIndex} className='order-details-single-values'>
                                        <p>{innerItem.name}</p>
                                        <p>{innerItem.valOne}</p>
                                        <p>{innerItem.valTwo}</p>
                                    </span>
                                ))}
                            </div>
                        ))}
                    </div>

                    <div className='ordered-products-details-table-contianer'>
                        <table className='responsive-order-details-table'>
                            <thead className='order-table-head'>
                                <tr>
                                    <th>Item ID</th>
                                    <th className='order-peoduct-name'>Name</th>
                                    <th className='order-product-price'>Price</th>
                                    <th>Protected</th>
                                    <th>Quantity</th>
                                    <th className='order-product-price'>Total</th>
                                </tr>
                            </thead>
                            <tbody className='order-table-body'>
                                {orderData?.items?.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.variation_id === 0 ? item.product_id : `${item.variation_id}  `}</td>
                                        <td className='order-peoduct-name'>{item.name}</td>
                                        <td className='order-product-price'>{item.sale_price !== 0 ? formatedPrice(item.sale_price) : formatedPrice(item.regular_price)}</td>
                                        <td>{item.is_protected === 1 ? <span style={{display: 'flex', flexDirection: 'column', width: '100%', fontSize: '8px', lineHeight: 1.2, fontWeight: 400}}><p style={{fontSize: '12px', lineHeight: 1.2, fontWeight: 400}}>Yes</p> ({formatedPrice(item.protected_price)})</span> : 'No'}</td>
                                        <td>{item.quantity}</td>
                                        <td className='order-product-price'>{formatedPrice(item.total)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className='ordered-products-total-container'>
                        <div className='ordered-products-total-items'>
                            <span>
                                <p>Sub Total</p>
                                <p>{formatedPrice(orderData?.sub_total)}</p>
                            </span>
                            {
                                orderData?.professional_assembled === 1 && <span>
                                    <p>White Glove</p>
                                    <p>{formatedPrice(orderData?.professional_assembled_price)}</p>
                                </span>
                            }
                            {
                                orderData?.cart_protected === 1 && <span>
                                    <p>Protection Plan</p>
                                    <p>{formatedPrice(orderData?.cart_protection_price)}</p>
                                </span>
                            }
                            {orderData?.is_shipping === 1 ? (
                                <span>
                                    <p>Shipping</p>
                                    <p>{orderData?.shipping_cost === 0 ? 'FREE' : formatedPrice(orderData?.shipping_cost)}</p>
                                </span>
                            ) : (
                                <span>
                                    <p>Shipping</p>
                                    <p>Local Pickup</p>
                                </span>
                            )}

                            <span>
                                <p>Tax</p>
                                <p>{formatedPrice(orderData?.tax)}</p>
                            </span>
                            <div className='ordered-products-grand-total'>
                                <h3>Total Amount</h3>
                                <h3>{formatedPrice(orderData?.total)}</h3>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div className='order-view-modal-footer-contianer'>
                    <h3>Terms & Conditions</h3>
                    <p>
                        All items are carefully inspected prior to delivery. Any damages or missing parts must be reported within 24 hours of
                        receiving the order. Custom-made items are non-refundable once confirmed. Delivery timelines are estimates and may
                        be affected by unforeseen delays.
                    </p>
                </div>

            </div>
        </div>
    )
}

export default OrderViewModal
