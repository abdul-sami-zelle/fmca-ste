import React from "react";
import './BedCarePlan.css'
import Image from "next/image";

const BedCarePlan = () => {
    return (
        <div className="bed-care-main-container">
            <div className="bed-care-image-contianer">
                <Image src={'/Assets/protection/bed-protection.png'} width={600} height={400} alt="bed-img" />
            </div>
            <div className="bed-care-content-container">
                <h3>Bed Care Protection Plan</h3>
                <p>
                    Give your bed the protection it deserves with Furniture Mecca’s 
                    <span>Bed Care Protection Plan,</span> designed to keep your entire sleep setup in excellent condition. 
                    This plan covers structural breakdowns, accidental stains, rips, punctures, and burns—ensuring your 
                    bed stays supportive, clean, and comfortable for years to come. Whether it’s a frame issue or an unexpected spill, 
                    you’ll have peace of mind knowing your bed is protected from everyday wear and tear.
                </p>
                <p>
                    Note: Protection administered by Montage, LLC and provided by National Product Care Company. 
                    For full details on coverage, exclusions, conditions, and limitations, please refer to the terms and conditions 
                    provided at purchase. The protection plan is an optional purchase, cancelable, and not a warranty.
                </p>
            </div>
        </div>
    )
}

export default BedCarePlan;