import React from "react";
import './PlanDuration.css';
import Image from "next/image";
import { FaCartArrowDown, FaShieldAlt } from "react-icons/fa";
import { TbLocationUp } from "react-icons/tb";

const PlanDuration = () => {
    return (
        <div className="plan-duration-main-container">
            <div className="plan-duration-content-section">
                <h3>Plan Duration</h3>
                <p>
                    Our plan provides 5 years of coverage from the date of your furniture delivery. 
                    You’ll receive protection for accidents that occur during normal residential use.
                </p>
                <h3>How to Purchase a Protection Plan</h3>
                <p>Buying your protection plan is easy:</p>
                <span className="plan-duration-span">
                    <FaCartArrowDown  className="planDurationIcon" color="var(--tertiary-color)" />
                    <p>Add your favorite furniture items to your cart.</p>
                </span>
                <span className="plan-duration-span">
                    <FaShieldAlt className="planDurationIcon" color="var(--tertiary-color)" />
                    <p>Select “Add Protection Plan” before checkout.</p>
                </span>
                <span className="plan-duration-span">
                    <TbLocationUp className="planDurationIcon" color="var(--tertiary-color)" />
                    <p>Complete your purchase and receive a confirmation with your protection details.</p>
                </span>
            </div>
            <div className="plan-duration-image-section">
                <Image src={'/Assets/protection/plan-duration.jpg'} width={600} height={400} alt="img" />
            </div>
        </div>
    )
}

export default PlanDuration;