import React from "react";
import './FurnitureProtectionPlan.css'
import Image from "next/image";

const FurnitureProtectionPlan = () => {
    return (
        <div className="furniture-protection-gallery-main-container">
            
            <div className="furniture-protection-gallery-content">
                <h3>Furniture Protection Plans</h3>
                <p>Premium Care for the Furniture You Love – Because Accidents Happen</p>
                <h3>Why Choose a Furniture Protection Plan?</h3>

                <p>
                    Your furniture is more than a purchase — it’s part of your home. Life is unpredictable. From accidental spills to pet damage 
                    or unexpected breaks, your furniture faces daily risks. With FurnitureMecca’s Protection Plans, you’re covered.
                </p>
                <p>
                    We offer affordable, worry-free <span> 5-Year Protection Plans </span> to keep your furniture safe from life’s little mishaps — so 
                    you can enjoy comfort without concern.
                </p>
            </div>

            <div className="furniture-protection-gallery-image-container">
                <Image src={'/Assets/protection/living-room-coffee-table-04.avif'} width={600} height={400} alt="gallery image" />
            </div>
        </div>
    )
}

export default FurnitureProtectionPlan