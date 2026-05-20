'use client'

import React, { useState } from "react";
import './BedCareFAQ.css';
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { IoIosArrowUp } from "react-icons/io";

const BedCareFAQ = () => {
    const bedcarefaq = [
        {
            que: 'Q : When should I purchase the protection plan?',
            ans: 'You should purchase the plan at checkout or within 14 days of delivery. This ensures coverage starts right away and protects against unexpected damage from day one. After 14 days, the plan can no longer be added.'
        },
        {
            que: `Q : What if my furniture can't be repaired?`,
            ans: 'If our service team determines the damage is beyond repair, we’ll replace the item or issue store credit equal to its value. Either way, you won’t have to pay out of pocket for accidental damage.'
        },
        {
            que: 'Q : Is accidental pet damage covered?',
            ans: `Yes, the plan covers stains from pet accidents like urine or vomit. However, any damage caused by chewing, clawing, or scratching is excluded, as it's considered avoidable behavior.`
        },
        {
            que: 'Q : Can I use the plan multiple times?',
            ans: 'Yes, you can file multiple claims for different accidents during the 5-year term. Coverage continues until the total cost of repairs or replacements reaches the value of the protected item.'
        },
    ]
    const [currentIndex, setCurrentIndex] = useState(0)
    return (
        <div className="bad-care-faq-main-conitainer">
            <span className="bad-care-faq-heading">
                <IoChatbubbleEllipsesSharp className="bed-care-faq-msg-icon" color="var(--tertiary-color)" />
                <h3>Frequently Asked Questions</h3>
            </span>

            <div className="bed-care-faqs">
                {bedcarefaq.map((item, index) => (
                    <div key={index} className={`bed-care-faq-single-item ${currentIndex === index ? 'remove-ans-bg' : ''}`}>
                        <div className="bef-care-faq-que" onClick={() => setCurrentIndex((prevIndex => prevIndex === index ? null : index))}>
                            <h3>{item.que}</h3>
                            <IoIosArrowUp  color="var(--tertiary-color)" className={`bed-care-faq-arrow ${currentIndex === index ? 'rotate-bed-care-faq-arrow' : ''}`} />
                        </div>
                        <div className={`bed-care-faq-ans ${currentIndex === index ? 'show-ans' : ''}`}>
                            <p>{item.ans}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default BedCareFAQ;