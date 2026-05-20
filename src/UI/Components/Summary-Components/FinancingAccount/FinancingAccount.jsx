import React, { useRef, useState } from "react";
import "./FinancingAccount.css";
import { useMyOrders } from "@/context/orderContext/ordersContext";
import { useGlobalContext } from "@/context/GlobalContext/globalContext";
import { formatPhoneNumber } from "@/utils/api";
import axios from "axios";

const FinancingAccount = ({
  topHeadng,
  askQuestion,
  applyText,
}) => {

  const { acimaDetails, setAcimaDetails, acimaErrors, setAcimaErrors } = useMyOrders();
  const {isDeliveryAllowed} = useGlobalContext();
  const nameRef = useRef(null);
  const [focusedField, setFocusedField] = useState("");

  const handleUpdateCityAndStateAccordingToPostalCode = async (postalCode) => {
    const api = `https://api.zippopotam.us/us/${postalCode}`;

    try {
      const response = await axios.get(api);
      if(response.status === 200) {
        const place = response.data.places?.[0]
        setAcimaDetails((prev) => ({
          ...prev,
          city: place?.['place name'],
          state: place?.['state abbreviation']
        }))
      }
    } catch (error) {
      console.error("Error", error)
    }
  }


  const handleZipCode =  (event) => {
    const value = event.target.value.replace(/[^0-9]/g, "")

    setAcimaDetails((prev) => ({
      ...prev,
      postal_code: value
    }))

    if(value.length === 5) {
      handleUpdateCityAndStateAccordingToPostalCode(value)
    }
  }


  return (
    <div className="payment-type-financing-main-container">
      <div className="payment-type-financing-heading">
        <h3>{topHeadng}</h3>
        <img src={"/Assets/icons/acima.png"} alt="financing card" />
      </div>

      <div className="payment-type-financing-inputs-main">

        {/* First And Last Name */}
        <div className="acima-method-input-dual-fields">

          {/* First Name */}
          <div
            onClick={() => {
              isDeliveryAllowed ? undefined : nameRef.current?.focus();
            }}
            className={`delivery-input-container ${
              focusedField === "first_name" ||
              acimaDetails.first_name
                ? "focused"
                : ""
            } ${acimaErrors.first_name ? "error-border" : ""}`}
          >
            {isDeliveryAllowed && <div className="input-overlay"></div>}
            <label className="floating-label">
              {acimaErrors.first_name ? (
                <span className="error-message">{acimaErrors.first_name}</span>
              ) : (
                "First Name"
              )}
            </label>
            <input
              type="text"
              className="input-field-email"
              onFocus={() => setFocusedField("first_name")}
              onBlur={() => setFocusedField("")}
              name="first_name"
              readOnly={isDeliveryAllowed}
              value={acimaDetails.first_name}
              onChange={(e) => {
                if (isDeliveryAllowed) return;
                const { value } = e.target;
                setAcimaDetails((prevData) => ({
                  ...prevData,
                  first_name: value,
                }));
                setAcimaErrors((prev) => ({ ...prev, first_name: "" }));
              }}
            />
          </div>

          {/* Last Name */}
          <div
            onClick={() => {
              isDeliveryAllowed ? undefined : nameRef.current?.focus();
            }}
            className={`delivery-input-container ${
              focusedField === "last_name" ||
              acimaDetails.last_name
                ? "focused"
                : ""
            } ${acimaErrors.last_name ? "error-border" : ""}`}
          >
            {isDeliveryAllowed && <div className="input-overlay"></div>}
            <label className="floating-label">
              {acimaErrors.last_name ? (
                <span className="error-message">{acimaErrors.last_name}</span>
              ) : (
                "Last Name"
              )}
            </label>
            <input
              type="text"
              className="input-field-email"
              onFocus={() => setFocusedField("last_name")}
              onBlur={() => setFocusedField("")}
              name="last_name"
              readOnly={isDeliveryAllowed}
              value={acimaDetails.last_name}
              onChange={(e) => {
                if (isDeliveryAllowed) return;
                const { value } = e.target;
                setAcimaDetails((prevData) => ({
                  ...prevData,
                  last_name: value,
                }));
                setAcimaErrors((prev) => ({ ...prev, last_name: "" }));
              }}
            />
          </div>

        </div>


        {/* Address 1*/}
        <div className="acima-method-input-dual-fields">

          {/* Zip */}
          {/* <div
            onClick={() => {
              isDeliveryAllowed ? undefined : nameRef.current?.focus();
            }}
            className={`delivery-input-container ${
              focusedField === "first_name" ||
              acimaDetails.first_name
                ? "focused"
                : ""
            } ${acimaErrors.first_name ? "error-border" : ""}`}
          >
            {isDeliveryAllowed && <div className="input-overlay"></div>}
            <label className="floating-label">
              {acimaErrors.first_name ? (
                <span className="error-message">{acimaErrors.first_name}</span>
              ) : (
                "First Name"
              )}
            </label>
            <input
              type="text"
              className="input-field-email"
              onFocus={() => setFocusedField("first_name")}
              onBlur={() => setFocusedField("")}
              name="first_name"
              readOnly={isDeliveryAllowed}
              value={acimaDetails.first_name}
              onChange={(e) => {
                if (isDeliveryAllowed) return;
                const { value } = e.target;
                setAcimaDetails((prevData) => ({
                  ...prevData,
                  first_name: value,
                }));
                setAcimaErrors((prev) => ({ ...prev, first_name: "" }));
              }}
            />
          </div> */}

          {/* Address*/}
          <div
            onClick={() => {
              isDeliveryAllowed ? undefined : nameRef.current?.focus();
            }}
            className={`delivery-input-container ${
              focusedField === "address_1" ||
              acimaDetails.address_1
                ? "focused"
                : ""
            } ${acimaErrors.address_1 ? "error-border" : ""}`}
          >
            {isDeliveryAllowed && <div className="input-overlay"></div>}
            <label className="floating-label">
              {acimaErrors.address_1 ? (
                <span className="error-message">{acimaErrors.address_1}</span>
              ) : (
                "Address"
              )}
            </label>
            <input
              type="text"
              className="input-field-email"
              onFocus={() => setFocusedField("address_1")}
              onBlur={() => setFocusedField("")}
              name="address_1"
              readOnly={isDeliveryAllowed}
              value={acimaDetails.address_1}
              onChange={(e) => {
                if (isDeliveryAllowed) return;
                const { value } = e.target;
                setAcimaDetails((prevData) => ({
                  ...prevData,
                  address_1: value,
                }));
                setAcimaErrors((prev) => ({ ...prev, address_1: "" }));
              }}
            />
          </div>

        </div>


        {/* Zipcode City State */}
        <div className="acima-method-input-dual-fields">

          {/* Zipcode*/}
          <div
            onClick={() => {
              isDeliveryAllowed ? undefined : nameRef.current?.focus();
            }}
            className={`delivery-input-container ${
              focusedField === "postal_code" ||
              acimaDetails.postal_code
                ? "focused"
                : ""
            } ${acimaErrors.postal_code ? "error-border" : ""}`}
          >
            {isDeliveryAllowed && <div className="input-overlay"></div>}
            <label className="floating-label">
              {acimaErrors.postal_code ? (
                <span className="error-message">{acimaErrors.postal_code}</span>
              ) : (
                "Zip Code"
              )}
            </label>
            <input
              type="text"
              className="input-field-email"
              onFocus={() => setFocusedField("postal_code")}
              onBlur={() => setFocusedField("")}
              name="postal_code"
              readOnly={isDeliveryAllowed}
              value={acimaDetails.postal_code}
              onChange={handleZipCode}
              maxLength={5}
            />
          </div>


          {/* City*/}
          <div
            onClick={() => {
              isDeliveryAllowed ? undefined : nameRef.current?.focus();
            }}
            className={`delivery-input-container ${
              focusedField === "city" ||
              acimaDetails.city
                ? "focused"
                : ""
            } ${acimaErrors.city ? "error-border" : ""}`}
          >
            {isDeliveryAllowed && <div className="input-overlay"></div>}
            <label className="floating-label">
              {acimaErrors.city ? (
                <span className="error-message">{acimaErrors.city}</span>
              ) : (
                "City"
              )}
            </label>
            <input
              type="text"
              className="input-field-email"
              onFocus={() => setFocusedField("city")}
              onBlur={() => setFocusedField("")}
              name="city"
              readOnly={isDeliveryAllowed}
              value={acimaDetails.city}
              onChange={(e) => {
                if (isDeliveryAllowed) return;
                const { value } = e.target;
                setAcimaDetails((prevData) => ({
                  ...prevData,
                  city: value,
                }));
                setAcimaErrors((prev) => ({ ...prev, city: "" }));
              }}
            />
          </div>


          {/* State*/}
          <div
            onClick={() => {
              isDeliveryAllowed ? undefined : nameRef.current?.focus();
            }}
            className={`delivery-input-container ${
              focusedField === "state" ||
              acimaDetails.state
                ? "focused"
                : ""
            } ${acimaErrors.state ? "error-border" : ""}`}
          >
            {isDeliveryAllowed && <div className="input-overlay"></div>}
            <label className="floating-label">
              {acimaErrors.state ? (
                <span className="error-message">{acimaErrors.state}</span>
              ) : (
                "State"
              )}
            </label>
            <input
              type="text"
              className="input-field-email"
              onFocus={() => setFocusedField("state")}
              onBlur={() => setFocusedField("")}
              name="state"
              readOnly={isDeliveryAllowed}
              value={acimaDetails.state}
              onChange={(e) => {
                if (isDeliveryAllowed) return;
                const { value } = e.target;
                setAcimaDetails((prevData) => ({
                  ...prevData,
                  state: value,
                }));
                setAcimaErrors((prev) => ({ ...prev, state: "" }));
              }}
            />
          </div>

        </div>


        {/* Country and Email */}
        <div className="acima-method-input-dual-fields">

          {/* Phone */}
          <div
            onClick={() => {
              isDeliveryAllowed ? undefined : nameRef.current?.focus();
            }}
            className={`delivery-input-container ${
              focusedField === "phone" ||
              acimaDetails.phone
                ? "focused"
                : ""
            } ${acimaErrors.phone ? "error-border" : ""}`}
          >
            {isDeliveryAllowed && <div className="input-overlay"></div>}
            <label className="floating-label">
              {acimaErrors.phone ? (
                <span className="error-message">{acimaErrors.phone}</span>
              ) : (
                "Phone"
              )}
            </label>
            <input
              type="text"
              className="input-field-email"
              onFocus={() => setFocusedField("phone")}
              onBlur={() => setFocusedField("")}
              name="phone"
              readOnly={isDeliveryAllowed}
              value={acimaDetails.phone}
              onChange={(e) => {
                if (isDeliveryAllowed) return;
                const { value } = e.target;
                setAcimaDetails((prevData) => ({
                  ...prevData,
                  phone: formatPhoneNumber(value),
                }));
                setAcimaErrors((prev) => ({ ...prev, phone: "" }));
              }}
            />
          </div>

          {/* Email */}
          <div
            onClick={() => {
              isDeliveryAllowed ? undefined : nameRef.current?.focus();
            }}
            className={`delivery-input-container ${
              focusedField === "email" ||
              acimaDetails.email
                ? "focused"
                : ""
            } ${acimaErrors.email ? "error-border" : ""}`}
          >
            {isDeliveryAllowed && <div className="input-overlay"></div>}
            <label className="floating-label">
              {acimaErrors.email ? (
                <span className="error-message">{acimaErrors.email}</span>
              ) : (
                "Email"
              )}
            </label>
            <input
              type="text"
              className="input-field-email"
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField("")}
              name="Email"
              readOnly={isDeliveryAllowed}
              value={acimaDetails.email}
              onChange={(e) => {
                if (isDeliveryAllowed) return;
                const { value } = e.target;
                setAcimaDetails((prevData) => ({
                  ...prevData,
                  email: value,
                }));
                setAcimaErrors((prev) => ({ ...prev, email: "" }));
              }}
            />
          </div>

        </div>

        {/* Phone and monthly net */}
        <div className="acima-method-input-dual-fields">

          <div
            onClick={() => {
              isDeliveryAllowed ? undefined : nameRef.current?.focus();
            }}
            className={`delivery-input-container ${
              focusedField === "alt_phone" ||
              acimaDetails.alt_phone
                ? "focused"
                : ""
            } ${acimaErrors.alt_phone ? "error-border" : ""}`}
          >
            {isDeliveryAllowed && <div className="input-overlay"></div>}
            <label className="floating-label">
              {acimaErrors.alt_phone ? (
                <span className="error-message">{acimaErrors.alt_phone}</span>
              ) : (
                "Alternative Phone"
              )}
            </label>
            <input
              type="text"
              className="input-field-email"
              onFocus={() => setFocusedField("alt_phone")}
              onBlur={() => setFocusedField("")}
              name="alt_phone"
              readOnly={isDeliveryAllowed}
              value={acimaDetails.alt_phone}
              onChange={(e) => {
                if (isDeliveryAllowed) return;
                const { value } = e.target;
                setAcimaDetails((prevData) => ({
                  ...prevData,
                  alt_phone: formatPhoneNumber(value),
                }));
                setAcimaErrors((prev) => ({ ...prev, alt_phone: "" }));
              }}
            />
          </div>


          {/* Monthly Net */}
          <div
            onClick={() => {
              isDeliveryAllowed ? undefined : nameRef.current?.focus();
            }}
            className={`delivery-input-container ${
              focusedField === "monthly_net" ||
              acimaDetails.monthly_net
                ? "focused"
                : ""
            } ${acimaErrors.monthly_net ? "error-border" : ""}`}
          >
            {isDeliveryAllowed && <div className="input-overlay"></div>}
            <label className="floating-label">
              {acimaErrors.monthly_net ? (
                <span className="error-message">{acimaErrors.monthly_net}</span>
              ) : (
                "Monthly Net"
              )}
            </label>
            <input
              type="text"
              className="input-field-email"
              onFocus={() => setFocusedField("monthly_net")}
              onBlur={() => setFocusedField("")}
              name="monthly_net"
              readOnly={isDeliveryAllowed}
              value={acimaDetails.monthly_net}
              onChange={(e) => {
                if (isDeliveryAllowed) return;
                const { value } = e.target;
                setAcimaDetails((prevData) => ({
                  ...prevData,
                  monthly_net: value,
                }));
                setAcimaErrors((prev) => ({ ...prev, monthly_net: "" }));
              }}
            />
          </div>

        </div>


         {/* Address 2*/}
        <div className="acima-method-input-dual-fields">
          {/* Address*/}
          <div
            onClick={() => {
              isDeliveryAllowed ? undefined : nameRef.current?.focus();
            }}
            className={`delivery-input-container ${
              focusedField === "address2" ||
              acimaDetails.address2
                ? "focused"
                : ""
            } ${acimaErrors.address2 ? "error-border" : ""}`}
          >
            {isDeliveryAllowed && <div className="input-overlay"></div>}
            <label className="floating-label">
              {acimaErrors.address2 ? (
                <span className="error-message">{acimaErrors.address2}</span>
              ) : (
                "Address 2"
              )}
            </label>
            <input
              type="text"
              className="input-field-email"
              onFocus={() => setFocusedField("address2")}
              onBlur={() => setFocusedField("")}
              name="address2"
              readOnly={isDeliveryAllowed}
              value={acimaDetails.address2}
              onChange={(e) => {
                if (isDeliveryAllowed) return;
                const { value } = e.target;
                setAcimaDetails((prevData) => ({
                  ...prevData,
                  address2: value,
                }));
                setAcimaErrors((prev) => ({ ...prev, address2: "" }));
              }}
            />
          </div>

        </div>

          {/* Alternative Phone */}
        <div className="acima-method-input-dual-fields">

          <div className="acima-method-single-input">

            
          </div>

        </div>






      </div>

      <span className="payment-type-financing-apply">
        {askQuestion} <p>{applyText}</p>
      </span>
    </div>
  );
};

export default FinancingAccount;
