import React, { useEffect, useState } from 'react'
import './ShippingForm.css';
import SummaryInputFields from '../InputField/SummaryInputFields';
import { useMyOrders } from '../../../../context/orderContext/ordersContext';
import crossBtn from '../../../../Assets/icons/close-btn.png'
import { url } from '../../../../utils/api';

const ShippingForm = () => {
    const [isChecked, setIsChecked] = useState(false);
    const handleCheckboxClick = () => { setIsChecked(!isChecked) }

    const {
        orderPayload,
        emptyField,
        setEmptyField,
        handleNestedValueChange,
        setOrderPayload,
        handleNestedValueChangeShipping,
        loading,
        handleClickTop,
        handleTabOpen
    } = useMyOrders();

    const areBillingFieldsFilled = () => {
        const { billing } = orderPayload;
        const newErrorObj = {};

        // return Object.values(billing).every((value) => value.trim() !== "");
        for (const field in billing) {
            if (billing[field].trim() === "") {
                newErrorObj[field] = `required`
            }
        }
        setEmptyField(newErrorObj);
        return Object.keys(newErrorObj).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (areBillingFieldsFilled()) {
            handleTabOpen(1);
            handleClickTop()
        }
    };


    const [myAddressPopup, setMyAddressPopup] = useState(false)


    const handleSelectAddressPopup = () => {
        setMyAddressPopup(true);


    }

    const handleSelectedAddressPopupClose = () => {
        setMyAddressPopup(false)
    }

    const [tokenValid, setTokenValid] = useState(true)
    const [userAddress, setUserAddress] = useState({})
    
    const verifyToken = async () => {
        const token = localStorage.getItem('userToken');
        try {
            const response = await fetch(`${url}/api/v1/web-users/verify-token`, {
                method: 'GET',
                headers: {
                    authorization: `${token}`
                }
            })
            if (response.ok) {
                const userId = localStorage.getItem('uuid')
                try {
                    const userResponse = await fetch(`${url}/api/v1/web-users/get/${userId}`, {
                        method: 'GET',
                        headers: {
                            authorization: `${token}`
                        }
                    });
                    if (userResponse.ok) {
                        const data = await userResponse.json();
                        setUserAddress(data.data.billing_address);
                    }
                } catch (error) {

                }
                setTokenValid(true);
            } else {
                localStorage.removeItem('userToken')
                setTokenValid(false);
            }
        } catch (error) {
            console.error("server error")
        }
    }

    useEffect(() => {
        if(!userId) return
        verifyToken()
    }, [])

    useEffect(() => { }, [userAddress])

    const [isCheckedAddress, setIsCheckedAddress] = useState(false);
    const handleSelectAddress = () => {
        setIsCheckedAddress(!isCheckedAddress)
    }


    // const [userZip, setUserZip] = useState()
    const getZipAndState = (zip) => {
        
        let locationData;
        if (zip) {
            locationData = JSON.parse(zip)
            setOrderPayload((prevPayload) => ({
            ...prevPayload,
            billing: {
                ...prevPayload.billing,
                city: locationData?.locationData?.city,
                postal_code: locationData?.locationData?.zipCode,
                state: locationData?.locationData?.state,
            }
        }))
        } else {
        }
    }


    useEffect(() => {
        const zipCode = localStorage.getItem('other_info');
        getZipAndState(zipCode)
    }, [])

    const fillBillingAddress = () => {

        setOrderPayload((prevPayload) => ({
            ...prevPayload,
            billing: {
                ...prevPayload.billing,
                first_name: userAddress?.first_name,
                last_name: userAddress?.last_name,
                email: userAddress?.email,
                phone: userAddress?.phone,
                address_1: userAddress?.address_1,
                country: 'USA',
            } 
        }))

        setMyAddressPopup(false)
    }

    const checkEmptyOrNot = () => {
        return orderPayload?.billing?.first_name !== '' &&
            orderPayload.billing?.last_name !== '' &&
            orderPayload.billing?.email !== '' &&
            orderPayload.billing?.phone !== '' &&
            orderPayload.billing?.address_1 !== '' ? true : false
    }

    const clearFields = () => {
        setOrderPayload((prevPayload) => ({
            ...prevPayload,
            billing: {
                first_name: '',
                last_name: '',
                email: '',
                phone: '',
                address_1: '',
            }
        }))
    }



    const clearBtnVisible = checkEmptyOrNot()

    if (loading) {
        return <div>Loading....</div>
    }

    return (
        <>
            <form className='shipping-detail-form'>
                <div className='shipping-form-main-heading'>
                    <h3 className='shipping-form-heading'>Contact Information</h3>
                    {tokenValid ? (
                        <div className='shipping-form-edit-and-clear-form-buttons'>
                            <button
                                type='button'
                                className='shipping-form-head-tag'
                                onClick={handleSelectAddressPopup}
                            >
                                My Address
                            </button>
                            {clearBtnVisible ? (
                                <button onClick={clearFields} type='button' className='clear-shipping-form'>
                                    Clear
                                </button>
                            ) : (
                                <></>
                            )}

                        </div>

                    ) : (
                        <></>
                    )}

                </div>
                <div className='first-name-last-name'>
                    <SummaryInputFields
                        type={'text'}
                        value={orderPayload.billing?.first_name || ''}
                        label={'First Name'}
                        fieldRequired={true}
                        placeholder={'First Name'}
                        name={'first_name'}
                        required={'required'}
                        onChange={handleNestedValueChange}
                        error={emptyField.first_name}
                    />
                    <SummaryInputFields
                        type={'text'}
                        name={'last_name'}
                        value={orderPayload.billing?.last_name || ''}
                        label={'Last Name'}
                        fieldRequired={true}
                        placeholder={'Last Name'}
                        required={'required'}
                        onChange={handleNestedValueChange}
                        error={emptyField.last_name}
                    />
                </div>
                <div className='email-container'>
                    <SummaryInputFields
                        type={'text'}
                        value={orderPayload.billing?.email || ''}
                        label={'Email'}
                        fieldRequired={true}
                        placeholder={'Email'}
                        name={'email'}
                        required={'required'}
                        onChange={handleNestedValueChange}
                        error={emptyField.email}
                    />

                    <SummaryInputFields
                        type={'text'}
                        value={orderPayload.billing?.phone || ''}
                        label={'Contact'}
                        fieldRequired={true}
                        placeholder={'Contact'}
                        name={'phone'}
                        required={'required'}
                        onChange={handleNestedValueChange}
                        error={emptyField.phone}
                    />
                </div>
                <div className='country-region'>
                    <div className='country-region-headings'>
                        <p>Country/ Region</p>
                        <h3>United States (USA)</h3>
                    </div>
                    <div className='zipcode-enter-container'>
                        <label className='zipcode-label-and-input'>
                            <p className='zipcode-label-container'>Deliver to:
                                <strong>Austin-1232</strong>
                                {emptyField.postal_code &&
                                    <p
                                        className='error-msg'
                                        style={{ color: "red", fontSize: "12px", }}>
                                        {emptyField.postal_code}
                                    </p>
                                }
                            </p>
                            <div className='zipcode-input-container'>
                                <input
                                    type='text'
                                    placeholder='Zip Code'
                                    value={orderPayload.billing?.postal_code || ''}
                                    name='postal_code'
                                    className='zipcode-input-filed'
                                    required={true}
                                    onChange={handleNestedValueChange}
                                />
                                <button
                                    type='button'
                                    className='zipcode-update-button'
                                >
                                    Update
                                </button>
                            </div>

                        </label>

                        {/* <SummaryInputFields
                            type={'text'}
                            value={orderPayload.billing?.postal_code || ''}
                            label={'Zip Code'}
                            // fieldRequired={true}
                            name={'postal_code'}
                            required={'required'}
                            onChange={handleNestedValueChange}
                            error={emptyField.postal_code}
                        /> */}

                    </div>
                </div>
                <div className='shipping-address'>
                    <SummaryInputFields
                        type={'text'}
                        value={orderPayload.billing?.address_1 || ''}
                        label={'Street Address'}
                        fieldRequired={true}
                        placeholder={'House number & Street number'}
                        name={'address_1'}
                        required={'required'}
                        onChange={handleNestedValueChange}
                        error={emptyField.address_1}
                    />
                    <SummaryInputFields
                        type={'text'}
                        value={orderPayload.billing?.address_2 || ''}
                        placeholder={'Apartment, suite, unit etc'}
                        fieldRequired={false}
                        name={'address_2'}
                        onChange={handleNestedValueChange}
                        error={emptyField.address_2}
                    />
                </div>
                <div className='city-state-zip'>
                   <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        alignItems: 'start',
                        justifyContent: 'start',
                        gap: '5px'
                    }}> 
                        <p style={{
                            fontSize: '14px',
                            lineHeight: '18px',
                            fontWeight: 500
                        }}>State</p>
                        <h3 style={{
                            fontSize: '16px',
                            lineHeight: '22px',
                            fontWeight: 600
                        }}>{orderPayload.billing.city}</h3>
                    </div>

                    {/* <SummaryInputFields
                        type={'text'}
                        value={orderPayload.billing?.city || ''}
                        label={'Town/City'}
                        name={'city'}
                        required={'required'}
                        placeholder={'Pennsylvania'}
                        onChange={handleNestedValueChange}
                        error={emptyField.city}
                    /> */}

                    {/* <p>{orderPayload.billing.state}</p> */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        alignItems: 'start',
                        justifyContent: 'start',
                        gap: '5px'
                    }}>
                        <p style={{
                            fontSize: '14px',
                            lineHeight: '18px',
                            fontWeight: 500
                        }}>State</p>
                        <h3 style={{
                            fontSize: '16px',
                            lineHeight: '22px',
                            fontWeight: 600
                        }}>{orderPayload.billing.state}</h3>
                    </div>

                    {/* <SummaryInputFields
                        type={'text'}
                        value={orderPayload.billing?.state || ''}
                        label={'State'}
                        fieldRequired={true}
                        placeholder={'Philadelphia'}
                        name={'state'}
                        required={'required'}
                        onChange={handleNestedValueChange}
                        error={emptyField.state}
                    /> */}
                </div>

                {/* <div className='different-billing-option'>
                    <div className='different-billing-checkox'>
                        <input type='checkbox' id='defferent-billing' onClick={handleCheckboxClick} />
                        <label for='defferent-billing'>Ship to a different Address</label>
                    </div>
                    <div className={`defferent-billing-option-true ${isChecked ? 'show-defferent-billing-option' : ''}`}>
                        <div className='first-name-last-name'>
                            <SummaryInputFields
                                type={'text'}
                                value={orderPayload.shipping?.first_name || ''}
                                label={'First Name'}
                                fieldRequired={isChecked ? true : false}
                                placeholder={'First Name'}
                                name={'first_name'}
                                required={'required'}
                                onChange={handleNestedValueChangeShipping}
                                error={emptyField.first_name}
                            />
                            <SummaryInputFields
                                type={'text'}
                                name={'last_name'}
                                value={orderPayload.shipping?.last_name || ''}
                                label={'Last Name'}
                                fieldRequired={isChecked ? true : false}
                                placeholder={'Last Name'}
                                required={'required'}
                                onChange={handleNestedValueChangeShipping}
                                error={emptyField.last_name}
                            />
                        </div>
                        <div className='country-region'>
                            <p>Country/ Region</p>
                            <h3>United States (USA)</h3>
                        </div>
                        <div className='shipping-address'>
                            <SummaryInputFields
                                type={'text'}
                                value={orderPayload.shipping?.address_1 || ''}
                                label={'Street Address'}
                                fieldRequired={isChecked ? true : false}
                                placeholder={'House number & Street number'}
                                name={'address_1'}
                                required={'required'}
                                onChange={handleNestedValueChangeShipping}
                                error={emptyField.address_1}
                            />
                            <SummaryInputFields
                                type={'text'}
                                placeholder={'Apartment, suite, unit etc'}
                                value={orderPayload.shipping?.address_2 || ''}
                                fieldRequired={false}
                                name={'address_2'}
                                onChange={handleNestedValueChangeShipping}
                                error={emptyField.address_2}
                            />
                        </div>
                        <div className='city-state-zip'>
                            <SummaryInputFields
                                type={'text'}
                                value={orderPayload.shipping?.postal_code || ''}
                                label={'Zip Code'}
                                fieldRequired={isChecked ? true : false}
                                name={'postal_code'}
                                required={'required'}
                                onChange={handleNestedValueChangeShipping}
                                error={emptyField.postal_code}
                            />
                            <SummaryInputFields
                                type={'text'}
                                value={orderPayload.shipping?.city || ''}
                                label={'Town/City'}
                                name={'city'}
                                required={'required'}
                                onChange={handleNestedValueChangeShipping}
                                error={emptyField.city}
                            />
                            <SummaryInputFields
                                type={'text'}
                                value={orderPayload.shipping?.state || ''}
                                label={'State'}
                                fieldRequired={isChecked ? true : false}
                                placeholder={'Pennsylvanian'}
                                name={'state'}
                                required={'required'}
                                onChange={handleNestedValueChangeShipping}
                                error={emptyField.state}
                            />
                        </div>
                    </div>
                </div> */}

                <div className='order-note'>
                    <SummaryInputFields type={'text'} label={'Order Notes (Optional)'} placeholder={'Notes about your order, e.g Special  delivery notes'} />
                </div>
            </form>
            <div className='form-continue-to-payment-button'>
                {/* <button type='button' onClick={handleSubmit} className='desktop-billing-details-send-button'>
                    Continue
                </button> */}
            </div>

            <form className='mobile-view-shipping-details-form'>
                <div className='mobile-view-personal-details'>
                    <SummaryInputFields type={'text'} label={'First Name'} fieldRequired={true} placeholder={'First Name'} required={true} />
                    <SummaryInputFields type={'text'} label={'Last Name'} fieldRequired={true} placeholder={'Last Name'} required={true} />
                    <SummaryInputFields type={'text'} label={'Phone'} fieldRequired={true} placeholder={'Phone'} required={true} />
                    <SummaryInputFields type={'text'} label={'Email'} fieldRequired={true} placeholder={'Email'} required={true} />
                </div>
                <div className='mobile-delivery-details'>
                    <h3 className='mobile-delivery-headings'>Delivery Address</h3>
                    <SummaryInputFields type={'text'} label={'Address'} fieldRequired={true} placeholder={'Address'} required={true} />
                    <SummaryInputFields type={'text'} label={'Apt, Suite (Optional)'} fieldRequired={false} placeholder={'Apt, Suite'} required={true} />
                    {/* <SummaryInputFields type={'text'} label={'Phone'} fieldRequired={true} placeholder={'Phone'} required={true} /> */}
                    {/* <SummaryInputFields type={'text'} label={'Email'} fieldRequired={true} placeholder={'Email'} required={true} /> */}
                    <SummaryInputFields type={'text'} label={'City'} fieldRequired={true} placeholder={'City'} required={true} />
                    <div className='mobile-view-city-and-zip'>
                        <SummaryInputFields type={'text'} label={'Zip Code'} fieldRequired={true} placeholder={'Zip Code'} required={true} />
                        <SummaryInputFields type={'text'} label={'State'} placeholder={'State'} required={true} />
                    </div>
                </div>
                <div className='mobile-delivery-options-sections'>
                    <h3 className='mobile-delivery-options-heading'>Delivery Options:</h3>
                    <div className='mobile-delivery-option-details'>
                        <input type='radio' />
                        <div className='mobile-delivery-option-single-detail'>
                            <h3>White Glove : $199</h3>
                            <p>
                                Full delivery service to the room of your choice,
                                unpacking, assambling & trash removal.
                            </p>
                        </div>
                    </div>
                    <div className='mobile-delivery-option-details'>
                        <input type='radio' />
                        <div className='mobile-delivery-option-single-detail'>
                            <h3>Thrushhold: $149</h3>
                            <p>
                                Deliver inside the front door of your home. You do  the
                                unpacking & assambling.
                            </p>
                        </div>
                    </div>
                </div>
                <div className='mobile-pay-btn-section'>
                    <button onClick={() => handleTabOpen(1)}>
                        Continue to Payment
                    </button>
                </div>
            </form>

            {/* Address Popup */}
            <div className={`my-address-popup-main-container ${myAddressPopup ? 'show-address-modal' : ''}`}>
                <div className='my-address-popup-inner-container'>
                    <div className='address-popup-head'>
                        <h3 className='address-modal-main-heading'>Select Delivery Option</h3>
                        <button className='my-address-popup-close-button' onClick={handleSelectedAddressPopupClose}>
                            <img src={crossBtn} alt='close btn' />
                        </button>
                    </div>
                    {/* {userAddress && userAddress?.map((item, index) => ( */}
                    <div className='my-address-single-address-option'>
                        <label className='my-address-single-address-select'>
                            <input
                                type='radio'
                                className='my-address-select-radio'
                                isChecked={isCheckedAddress}
                                onChange={handleSelectAddress}
                            />
                            <span className='my-address-single-address-select-details'>
                                <p>{userAddress?.first_name} {userAddress?.last_name}</p>
                                <p>{userAddress?.address_1}</p>
                                <p>{userAddress?.city}</p>
                                <p>{userAddress?.postal_code}</p>
                                <p>{userAddress?.country}</p>
                            </span>
                        </label>
                    </div>
                    {/* ))} */}
                    <div className='selected-address-save-button-container'>
                        <button onClick={fillBillingAddress} className='selected-address-save-button'>
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ShippingForm
