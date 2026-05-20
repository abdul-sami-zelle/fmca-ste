import React from 'react'
import './WhatIsCovered.css';
import { IoIosClose } from "react-icons/io";
import FurnitureProtectionPlan from '@/UI/Components/Premium-Bed-Componnts/FurnitureProtectionPlan/FurnitureProtectionPlan';
import CoverUnderProtection from '@/UI/Components/Premium-Bed-Componnts/CoverUnderProtection/CoverUnderProtection';
import ProtectYourInvestment from '@/UI/Components/Premium-Bed-Componnts/ProtectYourInvestment/ProtectYourInvestment';
import BedCarePlan from '@/UI/Components/Premium-Bed-Componnts/BedCarePlan/BedCarePlan';
import PlanDuration from '@/UI/Components/Premium-Bed-Componnts/PlanDuration/PlanDuration';
import FileClaim from '@/UI/Components/Premium-Bed-Componnts/FileClaim/FileClaim';
import WhyFMProtection from '@/UI/Components/Premium-Bed-Componnts/WhyFMProtection/WhyFMProtection';
import BedCareFAQ from '@/UI/Components/Premium-Bed-Componnts/BedCareFAQ/BedCareFAQ';

const WhatIsCovered = ({ showCoveredModal, handleCloseCoveredModal }) => {
    return (
        <div className={`what-is-covered-main-container ${showCoveredModal ? 'show-covered-modal-main' : ''}`} onClick={handleCloseCoveredModal}>
            <div className={`what-is-covered-container-contianer ${showCoveredModal ? 'drag-content-container' : ''}`} onClick={(e) => e.stopPropagation()} >
            <div className='what-is-covered-head-contianer'>
                <h3>Premium Protection Plan</h3>
                {/* <button className='what-is-covered-modal-close' onClick={handleCloseCoveredModal}> */}
                    <IoIosClose size={30} color='#595959' className='what-is-covered-modal-close' onClick={handleCloseCoveredModal}/>
                {/* </button> */}
            </div>
                <div className='what-is-covered-components-contianer'>
                    <FurnitureProtectionPlan />
                    <CoverUnderProtection />
                    <ProtectYourInvestment />
                    <BedCarePlan />
                    <PlanDuration />
                    <FileClaim />
                    <WhyFMProtection />
                    <BedCareFAQ />
                </div>
            </div>
        </div>
    )
}

export default WhatIsCovered