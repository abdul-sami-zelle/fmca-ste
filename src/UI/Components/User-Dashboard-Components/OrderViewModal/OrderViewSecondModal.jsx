import React, { useEffect, useState } from 'react'
import './OrderViewModal.css';
import './OrderViewSecondModall.css'
import { IoIosClose } from 'react-icons/io'
import Image from 'next/image'
import axios from 'axios'
import { formatedPrice, url } from '@/utils/api'
import Loader from '../../Loader/Loader'

const OrderViewSecondModal = ({ viewModal, setViewModal, orderId }) => {

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
                { name: (orderData?.payment_method === 'cybersource_credit_card' || orderData?.payment_method === 'authorize_net') && 'Credit Card', valOne: orderData?.transaction_id }
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


                {/* Body */}
                <div className='order-view-modal-body'>
                    <div className='order-body-head'>
                        <h3>Invoice</h3>
                        <Image src={'/Assets/Logo/main-logo.png'} width={200} height={40} alt='logo' />
                    </div>

                    <div className='order-second-invoice-desc'>
                        <p>Note: Customer must provide valid phone number and address for delivery otherwise Furniture Mecca will not deliver any merchandise.</p>
                        <p>El cliente debe proporcionar un número de teléfono y una dirección válidos para la entrega; de lo contrario, Furniture Mecca no entregará ninguna mercancía.</p>
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
                                        <td>{item.is_protected === 1 ? <span style={{ display: 'flex', flexDirection: 'column', width: '100%', fontSize: '8px', lineHeight: 1.2, fontWeight: 400 }}><p style={{ fontSize: '12px', lineHeight: 1.2, fontWeight: 400 }}>Yes</p> ({formatedPrice(item.protected_price)})</span> : 'No'}</td>
                                        <td>{item.quantity}</td>
                                        <td className='order-product-price'>{formatedPrice(item.total)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className='second-invoice-order-total-and-costumer-agree'>
                        <div className='ordered-second-invoice-products-total-container'>
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

                        <div className='order-invoice-second-costumer-agree'>
                            <span>
                                <p>Note: Pickup available by appointment only on Monday, Tuesday, Thursday, Friday and Saturday. Call 215-352-1600 for Appointment.</p>
                                <p>Recogida disponible solo con cita previa los lunes, martes, jueves, viernes y sábados. Llame al 215-352-1600 para programar una cita.</p>
                            </span>
                            <p>All orders must be paid in full 72 hours prior to delivery or 72 hours prior to transport of merchandise to branch store for customer pickup.</p>

                            <div className='order-invoice-costumer-sign'>
                                <h3>Customer Signature</h3>
                                <div className='order-invoice-sign-line'></div>
                                {/* <p>_________________________</p> */}

                            </div>

                            <p>By signing here the customer has read the policy and agreed to the store’s terms and conditions.</p>
                        </div>
                    </div>


                </div>

                {/* Footer */}
                <div className='order-second-invoice-view-modal-footer-contianer'>
                    <label>
                        <input type='checkbox' />
                        Opt in to receive text and email blasts
                    </label>
                    <span>
                        <p>Reply HELP for help and STOP to opt-out. Message and Data rates may apply. </p>
                        <p>SMS SHARING DISCLOSURE: No mobile data will be shared with third parties/affiliates for marketing/ promotional purpose at any time.</p>
                    </span>
                </div>

            </div>
        </div>
    )
}

export default OrderViewSecondModal