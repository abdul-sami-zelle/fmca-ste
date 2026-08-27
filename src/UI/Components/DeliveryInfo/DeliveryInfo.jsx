// 'use client'

// import React, { useState, useRef, useImperativeHandle, forwardRef, useEffect } from 'react'
// import './DeliveryInfo.css';
// // import { Link, useNavigate } from 'react-router-dom';

// import { useMyOrders } from '@/context/orderContext/ordersContext';
// import { useRouter } from 'next/navigation';
// import { useGlobalContext } from '@/context/GlobalContext/globalContext';
// import { LiaShippingFastSolid } from "react-icons/lia"
// import { BsShop } from "react-icons/bs";
// import { useCart } from '@/context/cartContext/cartContext';
// import LocationPopUp from '../LocationPopUp/LocationPopUp';
// import InputText from '@/Global-Components/InputText/InputText';

// const DeliveryInfo = forwardRef((props, ref) => {


//     const { isDeliveryAllowed } = useGlobalContext();
//     const navigate = useRouter()
//     const signupEmailRef = useRef(null)
//     const firstNameRef = useRef(null)
//     const lastNameRef = useRef(null)
//     const emailRef = useRef(null)
//     const phoneRef = useRef(null)
//     const altPhoneRef = useRef(null);
//     const addressOneRef = useRef(null)
//     const addressTwoRef = useRef(null)
//     const cityRef = useRef(null)
//     const stateRef = useRef(null)
//     const postalCodeRef = useRef(null)
//     const [editZip, setEditZip] = useState(false)
//     const [isStarted, setIsStarted] = useState(false);

//     const [userId, setUserId] = useState('');
//     const [userToken, setUserToken] = useState('')

//     const [focusedField, setFocusedField] = useState("");
//     const [signupEmail, setSignupEmail] = useState("");

//     const {
//         orderPayload,
//         handleNestedValueChange,
//         handleZipCodeChange,
//         setOrderPayload,
//         handleBillingZipChange,
//         handleShippingZipChange,
//         handleNestedValueChangeShipping
//     } = useMyOrders();

//     const [error, setError] = useState({})


//     const handleNavigateToSignup = () => {

//         navigate.push('/my-account');
//     }


//     // const handleSubmitDeliveryInfo = () => {
//     //     let newErrors = {};

//     //     Object.keys(orderPayload?.billing).forEach((field) => {
//     //         if (field === 'address2') return;
//     //         if (field === 'alt_phone') return;

//     //         if (!orderPayload?.billing?.[field]?.trim()) {
//     //             newErrors[field] = `Required`;
//     //         }
//     //     });

//     //     if (Object.keys(newErrors)?.length > 0) {
//     //         setError((prev) => ({ ...prev, ...newErrors }));
//     //         console.error("Errors found: ", newErrors);
//     //         return false
//     //     }

//     //     setError({});
//     //     props.onSubmit();
//     //     return true;
//     // }

//       const handleSubmitDeliveryInfo = () => {
//     let newErrors = {};

//     if (selectedOption?.id === 'METHOD-3') {
//       Object.keys(orderPayload?.shipping).forEach((field) => {
//         if (field === "address_2") return;
//         if (field === "address_1") return;
//         if (field === "zip") return;
//         if (field === "city") return;
//         if (field === "state") return;
//         if (field === "alt_phone") return;

//         if (!orderPayload?.shipping?.[field]?.trim()) {
//           newErrors[field] = `Required`;
//         }
//       });

//       Object.keys(orderPayload?.billing).forEach((field) => {
//         if (field === "address_2") return;
//         if (field === "alt_phone") return;

//         if (!orderPayload?.billing?.[field]?.trim()) {
//           newErrors[field] = `Required`;
//         }
//       });

//     } else {
//       Object.keys(orderPayload?.shipping).forEach((field) => {
//         if (field === "address_2") return;
//         if (field === "alt_phone") return;

//         if (!orderPayload?.shipping?.[field]?.trim()) {
//           newErrors[field] = `Required`;
//         }
//       });

//       if (orderPayload?.shipToDiffAdd) {
//         Object.keys(orderPayload?.billing).forEach((field) => {
//           if (field === "address_2") return;
//           if (field === "alt_phone") return;

//           if (!orderPayload?.billing?.[field]?.trim()) {
//             newErrors[field] = `Required`;
//           }
//         });
//       }
//     }

//     if (Object.keys(newErrors).length > 0) {
//       setError((prev) => ({ ...prev, ...newErrors }));
//       console.error("Errors found: ", newErrors);
//       return false;
//     }

//     setError({});
//     props.onSubmit();
//     return true;
//   };

//     useImperativeHandle(ref, () => ({
//         validateAndSubmit: handleSubmitDeliveryInfo,
//     }));

//     useEffect(() => { }, [orderPayload])

//     const {
//         selectedOption,
//         handleChange,
//         selectedShippingMethods,
//         handleButtonClick,
//         info,
//         shippingMethods,
//         setSelectedShippingMethods,
//         getShippingMethods,
//     } = useGlobalContext();

//     const { subTotal } = useCart()

//     const [locationDetails, setLocationDetails] = useState({
//         zipCode: '',
//         city: '',
//         state: '',
//         country: ''
//     });

//     const handleCloseSearch = () => {
//         setEditZip(false)
//     }

//     useEffect(() => {
//         const id = localStorage.getItem('uuid');
//         const token = localStorage.getItem('userToken');

//         if (id && token) {
//             setUserId(id);
//             setUserToken(token)
//         }

//     }, [])

//     useEffect(() => {
//         if (shippingMethods) {
//             getShippingMethods(subTotal, shippingMethods['shippingMethods']);
//         }
//     }, []);

//     useEffect(() => {
//         if (shippingMethods) {
//             getShippingMethods(subTotal, shippingMethods['shippingMethods']);
//             setIsStarted(!isStarted);
//         }
//     }, [subTotal, shippingMethods]); // Dependency array for changes in subTotal or shippingMethods

//     useEffect(() => {
//         if (shippingMethods) {
//             getShippingMethods(subTotal, shippingMethods['shippingMethods']);
//         }
//     }, [isStarted])

//     return (
//         <div className='delivery-form-main-container'>


//             {selectedShippingMethods && (
//                 <div className='shipping-methods-checkout-main-contianer'>

//                     <h3 className='choose-delivery-checkout-heading'>Choose Delivery Options</h3>
//                     <div className='checkout-page-shipping-method-inner-container'>

//                         {selectedShippingMethods &&
//                             selectedShippingMethods?.map((option, index) => (
//                                 <div className='cart-delivary-card' onClick={() => handleChange(null, option)}>

//                                     {index === 0 ? <LiaShippingFastSolid color='var(--text-charcol)' className='cart-protection-card-icon' /> : <BsShop color='var(--text-charcol)' className='cart-protection-card-icon' />}

//                                     <div className='cart-protection-plan-details-container'>
//                                         <p className='cart-protection-plan-card-header'>{option.name}</p>
//                                     </div>
//                                     <div className='cart-protection-radio-container'>
//                                         <label
//                                             key={option.id}
//                                             className="custom-radio"
//                                             style={{
//                                                 display: "flex",
//                                                 alignItems: "flex-start",
//                                                 flexDirection: "row",
//                                                 justifyContent: "flex-start",
//                                                 // margin: "5px 0",
//                                                 gap: "10px",
//                                             }}
//                                         >
//                                             <input
//                                                 type="radio"
//                                                 name="options"
//                                                 value={option.id}
//                                                 checked={selectedOption?.id === option.id}
//                                                 readOnly
//                                                 onChange={(e) => handleChange(e, option, index)} // Pass the `option` object

//                                             />
//                                             <span className="radio-mark" />
//                                         </label>

//                                     </div>
//                                 </div>
//                             ))}
//                     </div>

//                 </div>
//             )}

//             <p>All Fields Required Unless indicated Optional </p>

//             <div className='delivery-form-signup-container'>
//                 <h3>Your Information</h3>

//                 <div
//                     onClick={() => { isDeliveryAllowed ? undefined : emailRef.current?.focus() }}
//                     style={{ border: error.email ? '1px solid var(--orange-outline)' : '' }}
//                     className={`delivery-input-container-email ${focusedField === 'email' || orderPayload.billing?.email ? "focused" : ""}`}
//                 >
//                     {isDeliveryAllowed && <div className='input-overlay'></div>}
//                     <label
//                         className="floating-label"
//                     >
//                         Email
//                     </label>
//                     <input
//                         type="text"
//                         ref={emailRef}
//                         readOnly={isDeliveryAllowed}
//                         className="input-field-email"
//                         onFocus={() => setFocusedField("email")}
//                         onBlur={() => setFocusedField("")}
//                         name='email'
//                         value={orderPayload.shipping?.email}
//                         onChange={handleNestedValueChangeShipping}

//                     />
//                 </div>
//                 {!userId && !userToken && <span>Already have an account <p onClick={handleNavigateToSignup}>SIGN IN</p></span>}
//                 {!userId && !userToken && <p>You Can Create an Account After Checkout.</p>}

//             </div>

//             <div className='delivery-info-input-main-container'>
//                 <h3>Delivery Information</h3>

//                 <div className='delivery-info-input-first-and-last-name'>

//                     <div
//                         className={`delivery-input-container ${focusedField === 'first_name' || orderPayload.billing?.first_name ? "focused" : ""}`}
//                         style={{ border: error.first_name ? '1px solid var(--orange-outline)' : '' }}
//                         onClick={() => { isDeliveryAllowed ? undefined : firstNameRef.current?.focus() }}
//                     >
//                         {isDeliveryAllowed && <div className='input-overlay'></div>}
//                         <label
//                             className="floating-label"
//                         >
//                             First Name
//                         </label>
//                         <input
//                             type="text"
//                             className="input-field-email"
//                             ref={firstNameRef}
//                             onFocus={() => setFocusedField("first_name")}
//                             onBlur={() => setFocusedField("")}
//                             name='first_name'
//                             value={orderPayload.shipping?.first_name}
//                             onChange={handleNestedValueChangeShipping}

//                         />
//                     </div>

//                     <div
//                         onClick={() => { isDeliveryAllowed ? undefined : lastNameRef.current?.focus() }}
//                         style={{ border: error.last_name ? '1px solid var(--orange-outline)' : '' }}
//                         className={`delivery-input-container ${focusedField === 'last_name' || orderPayload.billing?.last_name ? "focused" : ""}`}
//                     >
//                         {isDeliveryAllowed && <div className='input-overlay'></div>}
//                         <label
//                             className="floating-label"
//                         >
//                             Last Name
//                         </label>
//                         <input
//                             type="text"
//                             ref={lastNameRef}
//                             className="input-field-email"
//                             onFocus={() => setFocusedField("last_name")}
//                             onBlur={() => setFocusedField("")}
//                             onChange={handleNestedValueChangeShipping}
//                             name='last_name'
//                             value={orderPayload.shipping?.last_name}
//                         />
//                     </div>
//                 </div>

//                 <div className='delivery-info-email-and-phone'>

//                     <div
//                         onClick={() => { isDeliveryAllowed ? undefined : phoneRef.current?.focus() }}
//                         style={{ border: error.phone ? '1px solid var(--orange-outline)' : '' }}
//                         className={`delivery-input-container-phone ${focusedField === 'phone' || orderPayload.billing?.phone ? "focused" : ""}`}
//                     >
//                         {isDeliveryAllowed && <div className='input-overlay'></div>}
//                         <label
//                             className="floating-label"
//                         >
//                             Phone
//                         </label>
//                         <input
//                             type="text"
//                             ref={phoneRef}
//                             className="input-field-email"
//                             onFocus={() => setFocusedField("phone")}
//                             onBlur={() => setFocusedField("")}
//                             name='phone'
//                             value={orderPayload.shipping?.phone}
//                             onChange={handleNestedValueChangeShipping}
//                         />
//                     </div>

//                     <div
//                         onClick={() => { isDeliveryAllowed ? undefined : altPhoneRef.current?.focus() }}
//                         style={{ border: error.alt_phone ? '1px solid var(--orange-outline)' : '' }}
//                         className={`delivery-input-container-phone ${focusedField === 'alt_phone' || orderPayload.billing?.alt_phone ? "focused" : ""}`}
//                     >
//                         {isDeliveryAllowed && <div className='input-overlay'></div>}
//                         <label
//                             className="floating-label"
//                         >
//                             Alternate Phone
//                         </label>
//                         <input
//                             type="text"
//                             ref={altPhoneRef}
//                             className="input-field-email"
//                             onFocus={() => setFocusedField("alt_phone")}
//                             onBlur={() => setFocusedField("")}
//                             name='alt_phone'
//                             value={orderPayload.shipping?.alt_phone}
//                             onChange={handleNestedValueChangeShipping}
//                         />
//                     </div>

//                 </div>

//                 <div
//                     onClick={() => { isDeliveryAllowed ? undefined : addressOneRef.current?.focus() }}
//                     style={{ border: error.address_1 ? '1px solid var(--orange-outline)' : '' }}
//                     className={`delivery-input-container ${focusedField === 'address_1' || orderPayload.shipping?.address_1 ? "focused" : ""}`}
//                 >
//                     {isDeliveryAllowed && <div className='input-overlay'></div>}
//                     <label
//                         className="floating-label"
//                     >
//                         Address
//                     </label>
//                     <input
//                         type="text"
//                         ref={addressOneRef}
//                         className="input-field-email"
//                         onFocus={() => setFocusedField("address_1")}
//                         onBlur={() => setFocusedField()}
//                         name='address_1'
//                         onChange={handleNestedValueChangeShipping}
//                         value={orderPayload.shipping?.address_1}
//                     />
//                 </div>

//    <InputText
//                             label={"Apt, Suite, Building, (Optional)"}
//                             payload={orderPayload}
//                             error={error.address_2}
//                             isAllowed={isDeliveryAllowed}
//                             input_name={"address_2"}
//                             value={orderPayload?.shipping?.address_2}
//                             onChange={handleNestedValueChangeShipping}
//                         />


//                 {/* <div
//                     onClick={() => { isDeliveryAllowed ? undefined : addressTwoRef.current?.focus() }}
//                     className={`delivery-input-container ${focusedField === 'address2' || orderPayload.shipping?.address_2 ? "focused" : ""}`}
//                 >
//                     {isDeliveryAllowed && <div className='input-overlay'></div>}
//                     <label className="floating-label">Apt, Suite, Building, (Optional)</label>
//                     <input
//                         type="text"
//                         ref={addressTwoRef}
//                         className="input-field-email"
//                         onFocus={() => setFocusedField("address2")}
//                         onBlur={() => setFocusedField("")}
//                         name='address2'
//                         value={orderPayload.shipping?.address_2}
//                         onChange={handleNestedValueChangeShipping}
//                     />
//                 </div> */}

//                 <div className='delivery-options-city-and-state'>
//                     <div
//                         onClick={() => { isDeliveryAllowed ? undefined : postalCodeRef.current?.focus() }}
//                         style={{ border: error.postal_code ? '1px solid var(--orange-outline)' : '' }}
//                         className={`delivery-input-container-postal-code ${focusedField === 'postal_code' || orderPayload.shipping?.postal_code ? "focused" : ""}`}
//                     >
//                         {isDeliveryAllowed && <div className='input-overlay'></div>}
//                         <label
//                             className="floating-label"
//                         >
//                             Zip Code
//                         </label>
//                         <input
//                             type="text"
//                             ref={postalCodeRef}
//                             className="input-field-email cursor"
//                             onFocus={() => setFocusedField('postal_code')}
//                             onBlur={() => setFocusedField("")}
//                             name='postal_code'
//                             value={orderPayload.shipping?.postal_code}
//                             onChange={handleZipCodeChange}
//                             maxLength={5}
//                             // readOnly={editZip}
//                             readOnly
//                         />


//                     </div>

//                     <div
//                         onClick={() => { isDeliveryAllowed ? undefined : stateRef.current?.focus() }}
//                         style={{ border: error.state ? '1px solid var(--orange-outline)' : '' }}
//                         className={`delivery-input-container ${focusedField === 'state' || orderPayload.shipping?.state ? "focused" : ""}`}
//                     >
//                         {isDeliveryAllowed && <div className='input-overlay'></div>}
//                         <label
//                             className="floating-label"
//                         >
//                             State
//                         </label>
//                         <input
//                             type="text"
//                             ref={stateRef}
//                             className="input-field-email cursor"
//                             onFocus={() => setFocusedField("state")}
//                             onBlur={() => setFocusedField("")}
//                             name='state'
//                             readOnly
//                             value={orderPayload.shipping?.state}
//                             onChange={handleNestedValueChangeShipping}
//                         />
//                     </div>

//                     <div
//                         onClick={() => { isDeliveryAllowed ? undefined : cityRef.current?.focus() }}
//                         style={{ border: error.city ? '1px solid var(--orange-outline)' : '' }}
//                         className={`delivery-input-container ${focusedField === 'city' || orderPayload.shipping?.city ? "focused" : ""}`}
//                     >
//                         {isDeliveryAllowed && <div className='input-overlay'></div>}
//                         <label
//                             className="floating-label"
//                         >
//                             City
//                         </label>
//                         <input
//                             type="text"
//                             ref={cityRef}
//                             className="input-field-email cursor"
//                             onFocus={() => setFocusedField('city')}
//                             onBlur={() => setFocusedField("")}
//                             name='city'
//                             readOnly
//                             value={orderPayload.shipping?.city}
//                             onChange={handleNestedValueChangeShipping}
//                         />

//                     </div>

//                 </div>

//                 <button className='edit-or-not-zip-code' onClick={() => setEditZip((prev) => prev === false ? true : false)}>Change Zipcode?</button>

//                 {selectedOption?.id !== 'METHOD-3' && <div style={{
//                     display: "flex",
//                     width: "100%",
//                     gap: "20px",
//                     marginTop: "10px"
//                 }}>

//                     <h3 className="heading_3_checkout" >Billing Address</h3>
//                     <label className='email-blast-label' style={{ width: "fit-content" }}>
//                         <input
//                             type="checkbox"
//                             className='checkout-email-blast-checkbox'
//                             checked={!orderPayload.shipToDiffAdd}
//                             value={!orderPayload.shipToDiffAdd}
//                             onChange={(e) => {
//                                 const checked = !e.target.checked;

//                                 setOrderPayload(prev => ({
//                                     ...prev,
//                                     shipToDiffAdd: checked
//                                 }));
//                             }}
//                             required
//                         />
//                         same as shipping Address
//                     </label>

//                 </div>}


//                 {
//                     orderPayload.shipToDiffAdd === true && selectedOption?.id !== 'METHOD-3' && <>


//                         <InputText
//                             label={"Address *"}
//                             payload={orderPayload}
//                             error={error.address_1}
//                             isAllowed={isDeliveryAllowed}
//                             input_name={"address_1"}
//                             value={orderPayload?.billing?.address_1}
//                             onChange={handleNestedValueChange}
//                         />

//                         <InputText
//                             label={"Apt, Suite, Building, (Optional)"}
//                             payload={orderPayload}
//                             error={error.address_2}
//                             isAllowed={isDeliveryAllowed}
//                             input_name={"address_2"}
//                             value={orderPayload?.billing?.address_2}
//                             onChange={handleNestedValueChange}
//                         />

//                         <div className="delivery-options-city-and-state">
//                             <InputText
//                                 label={"Zip Code *"}
//                                 payload={orderPayload}
//                                 error={error.postal_code}
//                                 isAllowed={isDeliveryAllowed}
//                                 input_name={"postal_code"}
//                                 value={orderPayload?.billing?.postal_code}
//                                 onChange={handleBillingZipChange}
//                                 maxLen={5}
//                                 readOnly={false}
//                             />

//                             <InputText
//                                 label={"State *"}
//                                 payload={orderPayload}
//                                 error={error.state}
//                                 isAllowed={isDeliveryAllowed}
//                                 input_name={"state"}
//                                 value={orderPayload?.billing?.state}
//                                 onChange={handleNestedValueChange}
//                                 readOnly={false}
//                             />

//                             <InputText
//                                 label={"City *"}
//                                 payload={orderPayload}
//                                 error={error.city}
//                                 isAllowed={isDeliveryAllowed}
//                                 input_name={"city"}
//                                 value={orderPayload?.billing?.city}
//                                 onChange={handleNestedValueChange}
//                                 readOnly={false}
//                             />
//                         </div>
//                     </>
//                 }
//             </div>

//             <LocationPopUp
//                 searchLocation={editZip}
//                 handleCloseSearch={handleCloseSearch}
//                 setLocationDetails={setLocationDetails}
//                 locationDetails={locationDetails}
//             />

//         </div>
//     )
// })

// export default DeliveryInfo




'use client'

import React, { useState, useRef, useImperativeHandle, forwardRef, useEffect } from 'react'
import './DeliveryInfo.css';
// import { Link, useNavigate } from 'react-router-dom';

import { useMyOrders } from '@/context/orderContext/ordersContext';
import { useRouter } from 'next/navigation';
import { useGlobalContext } from '@/context/GlobalContext/globalContext';
import { LiaShippingFastSolid } from "react-icons/lia"
import { BsShop } from "react-icons/bs";
import { useCart } from '@/context/cartContext/cartContext';
import LocationPopUp from '../LocationPopUp/LocationPopUp';
import InputText from '@/Global-Components/InputText/InputText';

const DeliveryInfo = forwardRef((props, ref) => {


    const { isDeliveryAllowed } = useGlobalContext();
    const navigate = useRouter()
    const signupEmailRef = useRef(null)
    const firstNameRef = useRef(null)
    const lastNameRef = useRef(null)
    const emailRef = useRef(null)
    const phoneRef = useRef(null)
    const altPhoneRef = useRef(null);
    const addressOneRef = useRef(null)
    const addressTwoRef = useRef(null)
    const cityRef = useRef(null)
    const stateRef = useRef(null)
    const postalCodeRef = useRef(null)
    const [editZip, setEditZip] = useState(false)
    const [isStarted, setIsStarted] = useState(false);

    const [userId, setUserId] = useState('');
    const [userToken, setUserToken] = useState('')

    const [focusedField, setFocusedField] = useState("");
    const [signupEmail, setSignupEmail] = useState("");

    const {
        orderPayload,
        handleNestedValueChange,
        handleZipCodeChange,
        setOrderPayload,
        handleBillingZipChange,
        handleShippingZipChange,
        handleNestedValueChangeShipping
    } = useMyOrders();

    const [error, setError] = useState({})


    const handleNavigateToSignup = () => {

        navigate.push('/my-account');
    }


    // const handleSubmitDeliveryInfo = () => {
    //     let newErrors = {};

    //     Object.keys(orderPayload?.billing).forEach((field) => {
    //         if (field === 'address2') return;
    //         if (field === 'alt_phone') return;

    //         if (!orderPayload?.billing?.[field]?.trim()) {
    //             newErrors[field] = `Required`;
    //         }
    //     });

    //     if (Object.keys(newErrors)?.length > 0) {
    //         setError((prev) => ({ ...prev, ...newErrors }));
    //         console.error("Errors found: ", newErrors);
    //         return false
    //     }

    //     setError({});
    //     props.onSubmit();
    //     return true;
    // }

    const handleSubmitDeliveryInfo = () => {
        let newErrors = {};

        if (selectedOption?.id === 'METHOD-3') {
            Object.keys(orderPayload?.shipping).forEach((field) => {
                if (field === "address_2") return;
                if (field === "address_1") return;
                if (field === "zip") return;
                if (field === "city") return;
                if (field === "state") return;
                if (field === "alt_phone") return;

                if (!orderPayload?.shipping?.[field]?.trim()) {
                    newErrors[field] = `Required`;
                }
            });

            Object.keys(orderPayload?.billing).forEach((field) => {
                if (field === "address_2") return;
                if (field === "alt_phone") return;

                if (!orderPayload?.billing?.[field]?.trim()) {
                    newErrors[field] = `Required`;
                }
            });

        } else {
            Object.keys(orderPayload?.shipping).forEach((field) => {
                if (field === "address_2") return;
                if (field === "alt_phone") return;

                if (!orderPayload?.shipping?.[field]?.trim()) {
                    newErrors[field] = `Required`;
                }
            });

            if (orderPayload?.shipToDiffAdd) {
                Object.keys(orderPayload?.billing).forEach((field) => {
                    if (field === "address_2") return;
                    if (field === "alt_phone") return;

                    if (!orderPayload?.billing?.[field]?.trim()) {
                        newErrors[field] = `Required`;
                    }
                });
            }
        }

        if (Object.keys(newErrors).length > 0) {
            setError((prev) => ({ ...prev, ...newErrors }));
            console.error("Errors found: ", newErrors);
            return false;
        }

        setError({});
        props.onSubmit();
        return true;
    };

    useImperativeHandle(ref, () => ({
        validateAndSubmit: handleSubmitDeliveryInfo,
    }));

    useEffect(() => { }, [orderPayload])

    const {
        selectedOption,
        handleChange,
        selectedShippingMethods,
        handleButtonClick,
        info,
        shippingMethods,
        setSelectedShippingMethods,
        getShippingMethods,
    } = useGlobalContext();

    const { subTotal } = useCart()

    const [locationDetails, setLocationDetails] = useState({
        zipCode: '',
        city: '',
        state: '',
        country: ''
    });

    const handleCloseSearch = () => {
        setEditZip(false)
    }

    useEffect(() => {
        const id = localStorage.getItem('uuid');
        const token = localStorage.getItem('userToken');

        if (id && token) {
            setUserId(id);
            setUserToken(token)
        }

    }, [])

    useEffect(() => {
        if (shippingMethods) {
            getShippingMethods(subTotal, shippingMethods['shippingMethods']);
        }
    }, []);

    useEffect(() => {
        if (shippingMethods) {
            getShippingMethods(subTotal, shippingMethods['shippingMethods']);
            setIsStarted(!isStarted);
        }
    }, [subTotal, shippingMethods]); // Dependency array for changes in subTotal or shippingMethods

    useEffect(() => {
        if (shippingMethods) {
            getShippingMethods(subTotal, shippingMethods['shippingMethods']);
        }
    }, [isStarted])

    useEffect(() => {
        if (!orderPayload?.shipToDiffAdd) {
            setOrderPayload(prev => ({
                ...prev,
                billing: {
                    ...prev.shipping
                }
            }));
        }
    }, [
        orderPayload?.shipping,
        orderPayload?.shipToDiffAdd
    ]);

    return (
        <div className='delivery-form-main-container'>


            {selectedShippingMethods && (
                <div className='shipping-methods-checkout-main-contianer'>

                    <h3 className='choose-delivery-checkout-heading'>Choose Delivery Options</h3>
                    <div className='checkout-page-shipping-method-inner-container'>

                        {selectedShippingMethods &&
                            selectedShippingMethods?.map((option, index) => (
                                <div className='cart-delivary-card' onClick={() => handleChange(null, option)}>

                                    {index === 0 ? <LiaShippingFastSolid color='var(--text-charcol)' className='cart-protection-card-icon' /> : <BsShop color='var(--text-charcol)' className='cart-protection-card-icon' />}

                                    <div className='cart-protection-plan-details-container'>
                                        <p className='cart-protection-plan-card-header'>{option.name}</p>
                                    </div>
                                    <div className='cart-protection-radio-container'>
                                        <label
                                            key={option.id}
                                            className="custom-radio"
                                            style={{
                                                display: "flex",
                                                alignItems: "flex-start",
                                                flexDirection: "row",
                                                justifyContent: "flex-start",
                                                // margin: "5px 0",
                                                gap: "10px",
                                            }}
                                        >
                                            <input
                                                type="radio"
                                                name="options"
                                                value={option.id}
                                                checked={selectedOption?.id === option.id}
                                                readOnly
                                                onChange={(e) => handleChange(e, option, index)} // Pass the `option` object

                                            />
                                            <span className="radio-mark" />
                                        </label>

                                    </div>
                                </div>
                            ))}
                    </div>

                </div>
            )}

            <p>All Fields Required Unless indicated Optional </p>

            <div className='delivery-form-signup-container'>
                <h3>Your Information</h3>

                <div
                    onClick={() => { isDeliveryAllowed ? undefined : emailRef.current?.focus() }}
                    style={{ border: error.email ? '1px solid var(--orange-outline)' : '' }}
                    className={`delivery-input-container-email ${focusedField === 'email' || orderPayload.billing?.email ? "focused" : ""}`}
                >
                    {isDeliveryAllowed && <div className='input-overlay'></div>}
                    <label
                        className="floating-label"
                    >
                        Email
                    </label>
                    <input
                        type="text"
                        ref={emailRef}
                        readOnly={isDeliveryAllowed}
                        className="input-field-email"
                        onFocus={() => setFocusedField("email")}
                        onBlur={() => setFocusedField("")}
                        name='email'
                        value={orderPayload.shipping?.email}
                        onChange={handleNestedValueChangeShipping}

                    />
                </div>
                {!userId && !userToken && <span>Already have an account <p onClick={handleNavigateToSignup}>SIGN IN</p></span>}
                {!userId && !userToken && <p>You Can Create an Account After Checkout.</p>}

            </div>

            <div className='delivery-info-input-main-container'>
                <h3>Delivery Information</h3>

                <div className='delivery-info-input-first-and-last-name'>

                    <div
                        className={`delivery-input-container ${focusedField === 'first_name' || orderPayload.billing?.first_name ? "focused" : ""}`}
                        style={{ border: error.first_name ? '1px solid var(--orange-outline)' : '' }}
                        onClick={() => { isDeliveryAllowed ? undefined : firstNameRef.current?.focus() }}
                    >
                        {isDeliveryAllowed && <div className='input-overlay'></div>}
                        <label
                            className="floating-label"
                        >
                            First Name
                        </label>
                        <input
                            type="text"
                            className="input-field-email"
                            ref={firstNameRef}
                            onFocus={() => setFocusedField("first_name")}
                            onBlur={() => setFocusedField("")}
                            name='first_name'
                            value={orderPayload.shipping?.first_name}
                            onChange={handleNestedValueChangeShipping}

                        />
                    </div>

                    <div
                        onClick={() => { isDeliveryAllowed ? undefined : lastNameRef.current?.focus() }}
                        style={{ border: error.last_name ? '1px solid var(--orange-outline)' : '' }}
                        className={`delivery-input-container ${focusedField === 'last_name' || orderPayload.billing?.last_name ? "focused" : ""}`}
                    >
                        {isDeliveryAllowed && <div className='input-overlay'></div>}
                        <label
                            className="floating-label"
                        >
                            Last Name
                        </label>
                        <input
                            type="text"
                            ref={lastNameRef}
                            className="input-field-email"
                            onFocus={() => setFocusedField("last_name")}
                            onBlur={() => setFocusedField("")}
                            onChange={handleNestedValueChangeShipping}
                            name='last_name'
                            value={orderPayload.shipping?.last_name}
                        />
                    </div>
                </div>

                <div className='delivery-info-email-and-phone'>

                    <div
                        onClick={() => { isDeliveryAllowed ? undefined : phoneRef.current?.focus() }}
                        style={{ border: error.phone ? '1px solid var(--orange-outline)' : '' }}
                        className={`delivery-input-container-phone ${focusedField === 'phone' || orderPayload.billing?.phone ? "focused" : ""}`}
                    >
                        {isDeliveryAllowed && <div className='input-overlay'></div>}
                        <label
                            className="floating-label"
                        >
                            Phone
                        </label>
                        <input
                            type="text"
                            ref={phoneRef}
                            className="input-field-email"
                            onFocus={() => setFocusedField("phone")}
                            onBlur={() => setFocusedField("")}
                            name='phone'
                            value={orderPayload.shipping?.phone}
                            onChange={handleNestedValueChangeShipping}
                        />
                    </div>

                    <div
                        onClick={() => { isDeliveryAllowed ? undefined : altPhoneRef.current?.focus() }}
                        style={{ border: error.alt_phone ? '1px solid var(--orange-outline)' : '' }}
                        className={`delivery-input-container-phone ${focusedField === 'alt_phone' || orderPayload.billing?.alt_phone ? "focused" : ""}`}
                    >
                        {isDeliveryAllowed && <div className='input-overlay'></div>}
                        <label
                            className="floating-label"
                        >
                            Alternate Phone
                        </label>
                        <input
                            type="text"
                            ref={altPhoneRef}
                            className="input-field-email"
                            onFocus={() => setFocusedField("alt_phone")}
                            onBlur={() => setFocusedField("")}
                            name='alt_phone'
                            value={orderPayload.shipping?.alt_phone}
                            onChange={handleNestedValueChangeShipping}
                        />
                    </div>

                </div>

                <div
                    onClick={() => { isDeliveryAllowed ? undefined : addressOneRef.current?.focus() }}
                    style={{ border: error.address_1 ? '1px solid var(--orange-outline)' : '' }}
                    className={`delivery-input-container ${focusedField === 'address_1' || orderPayload.shipping?.address_1 ? "focused" : ""}`}
                >
                    {isDeliveryAllowed && <div className='input-overlay'></div>}
                    <label
                        className="floating-label"
                    >
                        Address
                    </label>
                    <input
                        type="text"
                        ref={addressOneRef}
                        className="input-field-email"
                        onFocus={() => setFocusedField("address_1")}
                        onBlur={() => setFocusedField()}
                        name='address_1'
                        onChange={handleNestedValueChangeShipping}
                        value={orderPayload.shipping?.address_1}
                    />
                </div>

                <InputText
                    label={"Apt, Suite, Building, (Optional)"}
                    payload={orderPayload}
                    error={error.address_2}
                    isAllowed={isDeliveryAllowed}
                    input_name={"address_2"}
                    value={orderPayload?.shipping?.address_2}
                    onChange={handleNestedValueChangeShipping}
                />


                {/* <div
                    onClick={() => { isDeliveryAllowed ? undefined : addressTwoRef.current?.focus() }}
                    className={`delivery-input-container ${focusedField === 'address2' || orderPayload.shipping?.address_2 ? "focused" : ""}`}
                >
                    {isDeliveryAllowed && <div className='input-overlay'></div>}
                    <label className="floating-label">Apt, Suite, Building, (Optional)</label>
                    <input
                        type="text"
                        ref={addressTwoRef}
                        className="input-field-email"
                        onFocus={() => setFocusedField("address2")}
                        onBlur={() => setFocusedField("")}
                        name='address2'
                        value={orderPayload.shipping?.address_2}
                        onChange={handleNestedValueChangeShipping}
                    />
                </div> */}

                <div className='delivery-options-city-and-state'>
                    <div
                        onClick={() => { isDeliveryAllowed ? undefined : postalCodeRef.current?.focus() }}
                        style={{ border: error.postal_code ? '1px solid var(--orange-outline)' : '' }}
                        className={`delivery-input-container-postal-code ${focusedField === 'postal_code' || orderPayload.shipping?.postal_code ? "focused" : ""}`}
                    >
                        {isDeliveryAllowed && <div className='input-overlay'></div>}
                        <label
                            className="floating-label"
                        >
                            Zip Code
                        </label>
                        <input
                            type="text"
                            ref={postalCodeRef}
                            className="input-field-email cursor"
                            onFocus={() => setFocusedField('postal_code')}
                            onBlur={() => setFocusedField("")}
                            name='postal_code'
                            value={orderPayload.shipping?.postal_code}
                            onChange={handleZipCodeChange}
                            maxLength={5}
                            // readOnly={editZip}
                            readOnly
                        />


                    </div>

                    <div
                        onClick={() => { isDeliveryAllowed ? undefined : stateRef.current?.focus() }}
                        style={{ border: error.state ? '1px solid var(--orange-outline)' : '' }}
                        className={`delivery-input-container ${focusedField === 'state' || orderPayload.shipping?.state ? "focused" : ""}`}
                    >
                        {isDeliveryAllowed && <div className='input-overlay'></div>}
                        <label
                            className="floating-label"
                        >
                            State
                        </label>
                        <input
                            type="text"
                            ref={stateRef}
                            className="input-field-email cursor"
                            onFocus={() => setFocusedField("state")}
                            onBlur={() => setFocusedField("")}
                            name='state'
                            readOnly
                            value={orderPayload.shipping?.state}
                            onChange={handleNestedValueChangeShipping}
                        />
                    </div>

                    <div
                        onClick={() => { isDeliveryAllowed ? undefined : cityRef.current?.focus() }}
                        style={{ border: error.city ? '1px solid var(--orange-outline)' : '' }}
                        className={`delivery-input-container ${focusedField === 'city' || orderPayload.shipping?.city ? "focused" : ""}`}
                    >
                        {isDeliveryAllowed && <div className='input-overlay'></div>}
                        <label
                            className="floating-label"
                        >
                            City
                        </label>
                        <input
                            type="text"
                            ref={cityRef}
                            className="input-field-email cursor"
                            onFocus={() => setFocusedField('city')}
                            onBlur={() => setFocusedField("")}
                            name='city'
                            readOnly
                            value={orderPayload.shipping?.city}
                            onChange={handleNestedValueChangeShipping}
                        />

                    </div>

                </div>

                <button className='edit-or-not-zip-code' onClick={() => setEditZip((prev) => prev === false ? true : false)}>Change Zipcode?</button>

                {selectedOption?.id !== 'METHOD-3' && <div style={{
                    display: "flex",
                    width: "100%",
                    gap: "20px",
                    marginTop: "10px"
                }}>

                    <h3 className="heading_3_checkout" >Billing Address</h3>
                    <label className='email-blast-label' style={{ width: "fit-content" }}>
                        {/* <input
                            type="checkbox"
                            className='checkout-email-blast-checkbox'
                            checked={!orderPayload.shipToDiffAdd}
                            value={!orderPayload.shipToDiffAdd}
                            onChange={(e) => {
                                const checked = !e.target.checked;

                                setOrderPayload(prev => ({
                                    ...prev,
                                    shipToDiffAdd: checked
                                }));
                            }}
                            required
                        /> */}
                        <input
                            type="checkbox"
                            className="checkout-email-blast-checkbox"
                            checked={!orderPayload.shipToDiffAdd}
                            value={!orderPayload.shipToDiffAdd}
                            onChange={(e) => {
                                const checked = !e.target.checked;

                                setOrderPayload(prev => ({
                                    ...prev,
                                    shipToDiffAdd: checked,

                                    billing: !checked
                                        ? {
                                            ...prev.shipping
                                        }
                                        : {
                                            ...prev.billing
                                        }
                                }));
                            }}
                            required
                        />
                        same as shipping Address
                    </label>

                </div>}


                {
                    orderPayload.shipToDiffAdd === true && selectedOption?.id !== 'METHOD-3' && <>


                        <InputText
                            label={"Address *"}
                            payload={orderPayload}
                            error={error.address_1}
                            isAllowed={isDeliveryAllowed}
                            input_name={"address_1"}
                            value={orderPayload?.billing?.address_1}
                            onChange={handleNestedValueChange}
                        />

                        <InputText
                            label={"Apt, Suite, Building, (Optional)"}
                            payload={orderPayload}
                            error={error.address_2}
                            isAllowed={isDeliveryAllowed}
                            input_name={"address_2"}
                            value={orderPayload?.billing?.address_2}
                            onChange={handleNestedValueChange}
                        />

                        <div className="delivery-options-city-and-state">
                            <InputText
                                label={"Zip Code *"}
                                payload={orderPayload}
                                error={error.postal_code}
                                isAllowed={isDeliveryAllowed}
                                input_name={"postal_code"}
                                value={orderPayload?.billing?.postal_code}
                                onChange={handleBillingZipChange}
                                maxLen={5}
                                readOnly={false}
                            />

                            <InputText
                                label={"State *"}
                                payload={orderPayload}
                                error={error.state}
                                isAllowed={isDeliveryAllowed}
                                input_name={"state"}
                                value={orderPayload?.billing?.state}
                                onChange={handleNestedValueChange}
                                readOnly={false}
                            />

                            <InputText
                                label={"City *"}
                                payload={orderPayload}
                                error={error.city}
                                isAllowed={isDeliveryAllowed}
                                input_name={"city"}
                                value={orderPayload?.billing?.city}
                                onChange={handleNestedValueChange}
                                readOnly={false}
                            />
                        </div>
                    </>
                }
            </div>

            <LocationPopUp
                searchLocation={editZip}
                handleCloseSearch={handleCloseSearch}
                setLocationDetails={setLocationDetails}
                locationDetails={locationDetails}
            />

        </div>
    )
})

export default DeliveryInfo