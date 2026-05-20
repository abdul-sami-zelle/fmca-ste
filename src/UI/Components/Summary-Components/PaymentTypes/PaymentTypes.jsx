import React, { useEffect, useState } from "react";
import "./PaymentTypes.css";
import { RiSecurePaymentLine, RiInformationLine } from "react-icons/ri";
import paypal2 from "../../../../Assets/icons/paypal-2.png";
import acima2 from "../../../../Assets/icons/acima-2.png";
import card2 from "../../../../Assets/icons/card-2.png";
import { useMyOrders } from "@/context/orderContext/ordersContext";

const PaymentTypes = ({
  selectedPaymentType,
  setSelectedPaymentType,
  onSelectLabel,
}) => {
  const paymentTypeCheckData = [
    {
      type: "cybersource_credit_card",
      sign: "Credit/Debit Card",
      logo: "/Assets/icons/card-2.png",
      paymentMethodId: "9879079j7mummjh",
      enable: true
    },
    {
      type: "acima-leasing",
      sign: "Acima Leasing",
      logo: "/Assets/icons/acima-2.png",
      paymentMethodId: "19783168sagsk879",
      enable: false
    },
    // {type: 'paypal',sign: 'Paypal', logo: '/Assets/icons/paypal-2.png'},
    // {type: 'finance-account', sign: 'Finance Account', paymentMethodId: '961803160m79delmiw'},
  ];

  const {
    creditCardData,
    setCreditCardData,
    activePaymentMethods,
    getActivePaymentMethods,
    setOrderPayload,
  } = useMyOrders();

  const checkPaymentMethodById = (id) => {
    const paymentMethod = activePaymentMethods?.find((pm) => pm.id === id);
    if (paymentMethod) {
      return paymentMethod;
    } else {
      return paymentMethod;
    }
  };

  useEffect(() => {
    setSelectedPaymentType(paymentTypeCheckData[0].type);
  }, []);
  useEffect(() => {
    setOrderPayload((prevData) => ({
      ...prevData,
      setOrderPayload: paymentTypeCheckData[0].type,
    }));
  }, []);

  const handleSelectPaymentType = (type) => {
    if (type.enable) {
      setSelectedPaymentType(type.type);
      onSelectLabel(type.type);
      checkPaymentMethodById(type.paymentMethodId);
    }
  };

  const handlePaymentMethod = (type) => {
    onSelectLabel(type);
  };

  return (
    <div className="payment-types-main-container">
      <div className="payment-types-select-boxes-container">
        {paymentTypeCheckData.map((item, index) => (
          <label
            key={index}
            onClick={() => handleSelectPaymentType(item)}
            className={`payment-select-option ${selectedPaymentType === item.type ? "select-payment" : ""
              } ${item.enable === false ? "disabled" : ""}`}
          >
            <input
              type="radio"
              checked={selectedPaymentType === item.type}
              name="selectedPaymentType"
              onChange={() => handleSelectPaymentType(item)}
            />

            <div className="payment-types-select-label">
              {item.sign}
              <img
                src={item.logo}
                alt="logo"
                className="payment-type-paypal-logo"
              />
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

export default PaymentTypes;
