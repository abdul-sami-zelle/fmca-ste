import React, { useEffect, useState, useImperativeHandle, ref, forwardRef, useRef } from 'react'
import './CreditCard.css'
import { useMyOrders } from '@/context/orderContext/ordersContext';
import { useGlobalContext } from '@/context/GlobalContext/globalContext';




const CreditCard = () => {
    const [focusedField, setFocusedField] = useState("");

    const {
        creditCardData,
        setCreditCardData,
        activePaymentMethods,
        error, 
        setError
    } = useMyOrders();

    const nameRef = useRef(null)


    const detectCardType = (cardNumber) => {
        const cardTypes = {
            visa: /^4/,
            mastercard: /^5/,
            amex: /^3[47]/, // American Express starts with 34 or 37
            discover: /^6/, // Discover cards typically start with 6
        };

        // Check the card number's first digit and match with card type
        for (const [type, regex] of Object.entries(cardTypes)) {
            if (regex.test(cardNumber)) {
                return type;
            }
        }

        return ''; // Default to empty string if no match found
    };

    useEffect(() => {

    }, [activePaymentMethods])

    const {isDeliveryAllowed} = useGlobalContext();

    return (
        <div className='credit-card-type-main-container'>
            <div className='credit-card-type-head'>
                <img src={'/Assets/icons/mastercard-1.png'} alt='card' />
                <img src={'/Assets/icons/visa-1.png'} alt='card' />
                <img src={'/Assets/icons/discover-1.png'} alt='card' />
                <img src={'/Assets/icons/ae-1.png'} alt='card' />
            </div>
            <div className='credit-card-type-body'>
                <div className='credit-card-inputs'>

                    <div onClick={() => {isDeliveryAllowed ? undefined : nameRef.current?.focus()}} className={`delivery-input-container ${focusedField === 'card_holder_name' || creditCardData.card_holder_name ? "focused" : ""} ${error.card_holder_name ? "error-border" : ""}`}>
                        {isDeliveryAllowed && <div className='input-overlay'></div>}
                        <label className="floating-label">
                            {error.card_holder_name ? <span className='error-message'>{error.card_holder_name}</span> : 'Card holder Name'}
                        </label>
                        <input
                            type="text"
                            className="input-field-email"
                            onFocus={() => setFocusedField("card_holder_name")}
                            onBlur={() => setFocusedField("")}
                            name='card_holder_name'
                            readOnly={isDeliveryAllowed}
                            value={creditCardData.card_holder_name}
                            onChange={(e) => {
                                if(isDeliveryAllowed) return
                                const { value } = e.target;
                                setCreditCardData((prevData) => ({
                                    ...prevData,
                                    card_holder_name: value
                                }))
                                setError(prev => ({ ...prev, card_holder_name: '' }));
                            }}
                        />
                    </div>

                    <div className={`delivery-input-container ${focusedField === 'card_number' || creditCardData.card_number ? "focused" : ""} ${error.card_number ? "error-border" : ""}`}>
                        {isDeliveryAllowed && <div className='input-overlay'></div>}
                        <label className="floating-label">
                            {error.card_number ? <span className='error-message'>{error.card_number}</span> : 'Card Number'}
                        </label>
                        <input
                            type="text"
                            className="input-field-email"
                            onFocus={() => setFocusedField("card_number")}
                            onBlur={() => setFocusedField("")}
                            readOnly={isDeliveryAllowed}
                            // onChange={handleDeliveryInfo}
                            name='card_number'
                            value={creditCardData.card_number}

                            onChange={(e) => {
                                if(isDeliveryAllowed) return
                                let { value } = e.target;
                                value = value.replace(/\D/g, ''); // Remove all non-digit characters
                                if (value.length > 16) {
                                    value = value.slice(0, 16); // Keep only the first 16 digits
                                }

                                // Format card number with dashes after every 4 digits
                                const formattedValue = value
                                    .replace(/(\d{4})(?=\d)/g, '$1-') // Add dash after every 4 digits
                                    .slice(0, 19); // Ensure the formatted value doesn't exceed 19 characters (4 sets of 4 digits + 3 dashes)

                                // Set card type based on the card number
                                const cardType = detectCardType(formattedValue.replace(/-/g, '')); // Remove dashes for detection

                                setCreditCardData((prevData) => ({
                                    ...prevData,
                                    card_number: formattedValue,
                                    card_type: cardType, // Set the detected card type
                                }));
                                setError(prev => ({ ...prev, card_number: '' }));
                            }}

                        />
                    </div>

                </div>

                <div className='credit-card-expiry-and-code-inputs'>

                    <div className={`delivery-input-container ${focusedField === 'expiry_date' || creditCardData.expiry_date ? "focused" : ""} ${error.expiry_date ? "error-border" : ""}`}>
                        {isDeliveryAllowed && <div className='input-overlay'></div>}
                        <label className="floating-label">
                            {error.expiry_date ? <span className='error-message'>{error.expiry_date}</span> : 'Expiry Date'}
                        </label>
                        <input
                            type="text"
                            className="input-field-email"
                            onFocus={() => setFocusedField("expiry_date")}
                            onBlur={() => setFocusedField("")}
                            name='expiry_date'
                            readOnly={isDeliveryAllowed}
                            value={creditCardData.expiry_date}

                            onChange={(e) => {
                                if(isDeliveryAllowed) return
                                let { value } = e.target;
                                value = value.replace(/[^0-9/]/g, '');
                                if (value.length === 2 && !value.includes('/')) {
                                    value = `${value}/`; // Add slash after the month
                                }
                                const [month, year] = value.split('/');
                                if (month && parseInt(month, 10) > 12) {
                                    value = ''; // Reset if month exceeds 12
                                    alert('Invalid month. Please enter a value between 01 and 12.');
                                }
                                if (value.length > 5) {
                                    value = value.slice(0, 5); // Limit length to MM/YY format
                                }
                                setCreditCardData((prevData) => ({
                                    ...prevData,
                                    expiry_date: value
                                }))
                                setError(prev => ({ ...prev, expiry_date: '' }));
                            }}

                        />
                    </div>

                    <div className={`delivery-input-container ${focusedField === 'sec_code' || creditCardData.sec_code ? "focused" : ""} ${error.sec_code? "error-border" : ""}`}>
                        {isDeliveryAllowed && <div className='input-overlay'></div>}
                        <label className="floating-label">
                            {error.sec_code ? <span className='error-message'>{error.sec_code}</span> : 'CVV'}
                        </label>
                        <input
                            type="text"
                            className="input-field-email"
                            onFocus={() => setFocusedField("sec_code")}
                            onBlur={() => setFocusedField("")}
                            name='sec_code'
                            readOnly={isDeliveryAllowed}
                            value={creditCardData.sec_code}

                            onChange={(e) => {
                                if(isDeliveryAllowed) return
                                let { value } = e.target;
                                value = value.replace(/\D/g, '');
                                if (value.length > 4) {
                                    value = value.slice(0, 4);  // Keep only the first 16 digits
                                }
                                const formattedValue = value
                                    .replace(/(\d{4})(?=\d)/g, '$1-')
                                setCreditCardData((prevData) => ({
                                    ...prevData,
                                    sec_code: formattedValue
                                }))
                                setError(prev => ({ ...prev, sec_code: '' }));
                            }}


                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreditCard
