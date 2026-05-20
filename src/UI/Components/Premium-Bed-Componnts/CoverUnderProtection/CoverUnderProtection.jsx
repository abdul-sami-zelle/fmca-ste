import React from "react";
import './CoverUnderProtection.css'
import { LuArrowRight } from "react-icons/lu";
import Image from "next/image";
import { IoIosClose } from "react-icons/io";

const CoverUnderProtection = () => {
    const coverProtectionOptions = [
        {
            heading: 'Upholstered Furniture (Fabric, Leather, Vinyl)', options: [
                'Food and Beverage Stains',
                'Ink, Dye & Makeup Stains',
                'Burns and Heat Marks',
                'Rips, Tears, Punctures, and Cuts',
                'Ballpoint Pen Marks',
                'Oil-Based Stains (lotions, grease)',
                'Zipper or Button Breakage',
                'Frame and Mechanism Breakage (e.g., recliners)',
            ],
        },
        {
            heading: 'Wood & Solid Surface Furniture', options: [
                'Liquid Rings and Heat Marks',
                'Cracks, Gouges, and Dents',
                'Chipping or Lifting of Veneer',
                'Warping or Lifting of Laminate',
                'Scratches and Surface Damage',
            ],
        },
        {
            heading: 'Motion Furniture & Mechanisms', options: [
                'Recliner & Sleeper Mechanism Failure',
                'Motor Failure in Power Recliners',
                'Lift Mechanism Malfunctions',
                'Swivel Base Breakage',
            ],
        }
    ]

    const notCovered = [
        {heading: 'What’s Not Covered?', options: [
            'Intentional damage or misuse',
            'Damage from pets chewing or clawing',
            'General wear and tear or fading',
            'Mattress-related damage (not included)',
            'Furniture used for commercial purposes',
            'Acts of God (fire, flood, etc.)',
        ]}
    ]
    return (
        <div className="covered-or-not-protection-main-container">
            <div className="covered-or-not-protection-headings-container">
                <h3>What’s Covered Under Our Furniture Protection Plan?</h3>
                <p>
                    Our <span> Premium Furniture Protection Plan </span> offers industry-leading coverage for all major furniture types excluding mattresses.
                    Whether it’s your plush new sofa or a modern glass-top table, you’re protected.
                </p>
            </div>
            <div className="covered-or-not-protection-content-container">
                <div className="covered-or-not-protection-content-left">
                    {coverProtectionOptions.map((item, index) => (
                        <div key={index} className="left-section-option-container">
                            <h3>{item.heading}</h3>
                            {item.options.map((innerItem, innerIndex) => (
                                <span key={innerIndex} className="options-single-item">
                                    <LuArrowRight size={20} color="#595959" />
                                    <p>{innerItem}</p>
                                </span>
                            ))}
                        </div>
                    ))}
                </div>
                <div className="covered-or-not-protection-content-right">
                    <Image src={'/Assets/protection/covered-protection.jpg'} className="protection-covered-image" width={600} height={400} alt="img" />
                    {notCovered.map((item, index) => (
                        <div key={index} className="not-covered-option-container">
                            <h3>{item.heading}</h3>
                            <h3>To maintain transparency, here are some exclusions:</h3>
                            {item.options.map((innerItem, innerIndex) => (
                                <span key={innerIndex} className="options-single-item">
                                    <i className="not-covered-cross">
                                        <IoIosClose size={15}
                                        color="#FFFFFF" />
                                    </i>
                                    <p>{innerItem}</p>
                                </span>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default CoverUnderProtection