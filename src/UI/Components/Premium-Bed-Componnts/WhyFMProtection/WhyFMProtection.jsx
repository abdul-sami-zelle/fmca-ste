'use client'

import React, { useState } from "react";
import './WhyFMProtection.css'
import { AiFillTrophy } from "react-icons/ai";
import { FaMedal, FaExclamationCircle, FaHome, FaDollarSign, FaHands } from "react-icons/fa";
import TopTierCoverage from "./TopTieCoverage/TopTierCoverage";

const WhyFMProtection = () => {
    const protectionPLans = [
        'Top-Tier-Coverage',
        'Quick Claims Process',
        'Trained Profionals',
        'Long-Term-Value',
        'Full-Transparancy'
    ]
    const [currentIndex, setCurrentIndex] = useState(0)
    return (
        <div className="why-fm-protection-main-container">
            <span className="why-fm-protection-heading">
                <AiFillTrophy size={40} className="why-protection-heading-icon" color="var(--tertiary-color)" />
                <h3>Why Furniture Mecca’s Protection Plan?</h3>
            </span>

            <div className="why-fm-protection-options-main-container">
                {protectionPLans.map((item, index) => (
                    <div key={index} className={`why-fm-protection-single-option ${currentIndex === index ? 'highlight-protection-single-option' : ''}`} onClick={() => setCurrentIndex(index)}>
                        <p>{item}</p>
                        <span className={`protection-hover-dot ${ currentIndex === index ? 'show-protection-plan-dot' : ''}`}></span>
                    </div>
                ))}
            </div>

            {
                currentIndex === 0 ? 
                    <TopTierCoverage 
                        icon={<FaMedal size={40} color="var(--tertairy-color)" />}
                        heading={'Better Than Manufacturer Warranties.'}
                        para={'Our plan protects against a wide range of accidental damages that standard warranties usually exclude, giving you more complete and reliable coverage.'}
                    />
                : currentIndex === 1 ? 
                    <TopTierCoverage 
                        icon={<FaExclamationCircle size={40} color="var(--tertairy-color)" />}
                        heading={'No long waits or complicated steps.'}
                        para={'Submitting a claim is simple and fast. Just send us your info and photos, and we’ll quickly approve and arrange repairs or replacements.'}
                    />
                : currentIndex === 2 ? 
                    <TopTierCoverage 
                        icon={<FaHome size={40} color="var(--tertairy-color)" />}
                        heading={'Trusted Technicians For In-Home Repairs.'}
                        para={'Experienced, certified technicians come to your home to fix your furniture, saving you time and hassle.'}
                    />
                : currentIndex === 3 ? 
                    <TopTierCoverage 
                        icon={<FaDollarSign size={40} color="var(--tertairy-color)" />}
                        heading={'Avoid The Cost Of Unexpected Replacements'}
                        para={'Protect your investment by covering repair and replacement costs, helping you avoid expensive out-of-pocket expenses over time.'}
                    /> : <TopTierCoverage 
                        icon={<FaHands size={40} color="var(--tertairy-color)" />}
                        heading={'No Hidden Fees, Fine Print, Or Gimmicks.'}
                        para={'We provide clear, straightforward coverage details with no surprises, so you always know what to expect.'}
                    />
            }

            


        </div>
    )
}

export default WhyFMProtection;