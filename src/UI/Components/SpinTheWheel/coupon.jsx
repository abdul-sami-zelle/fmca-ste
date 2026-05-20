import React from "react";

export default function CouponCard({prize}) {
    const redirectToUrl = (url) => {
        window.open(url, '_blank');
      };
    return(
       <div className="coupon_card_pre">
         <div className="couponCard">
                <div className="left_cut"></div>
                <div className="right_cut"></div>
            <button onClick={()=>{redirectToUrl("https://myfurnituremecca.com/")}}> 
                SHOP NOW
            </button>
            <h4>YOU WON</h4>
            <h3>"{prize}"</h3>
            <p>Coupon Code is Sent to Your Email.</p>
        </div>
       </div>
    )
}