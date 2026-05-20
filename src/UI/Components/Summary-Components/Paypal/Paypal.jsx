import React, { useEffect, useRef, useState } from 'react';
// import paypalIcon from '/Assets/icons/paypal-1.png';
import './Paypal.css';
import { url } from '../../../../utils/api';
import Image from 'next/image';

const Paypal = () => {
  const paypalRef = useRef(null);
  const [sdkReady, setSdkReady] = useState(false);

  useEffect(() => {
    const existingScript = document.getElementById('paypal-sdk');

    if (existingScript) {
      setSdkReady(true);
      return;
    }

    const script = document.createElement('script');
    script.src = "https://www.paypal.com/sdk/js?client-id=AWrBzvI6Un2l--w2Eysg8tYWpipIgsU7-LcEgpKf0gjbTeEbE_M5-yaeJzKRsRTuYc7AHeqGRbht_YTV&currency=USD&disable-funding=card";
    script.id = 'paypal-sdk';
    script.async = true;
    script.onload = () => setSdkReady(true);
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (sdkReady && window.paypal && paypalRef.current) {
      window.paypal.Buttons({
        createOrder: async () => {
          const res = await fetch(`${url}/create-paypal-payment`, { method: "POST" });
          const orderData = await res.json();
          return orderData.id;
        },
        onApprove: async (data) => {
          const captureRes = await fetch("/api/paypal/capture-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId: data.orderID })
          });
          const captureData = await captureRes.json();
          alert("Payment Successful!");
        },
        onCancel: () => alert("Payment cancelled"),
        onError: (err) => console.error("Error during payment process", err),
      }).render(paypalRef.current);
    }
  }, [sdkReady]);

  return (
    <div className='payment-type-paypal-main-container'>
      <div className='payment-type-paypal-heading'>
        <h3>Paypal</h3>
        <Image src={'/Assets/icons/paypal-1.png'} width={35} height={35} alt='paypal' />
      </div>
      <div ref={paypalRef} id="paypal-button-container"></div>
    </div>
  );
};

export default Paypal;
