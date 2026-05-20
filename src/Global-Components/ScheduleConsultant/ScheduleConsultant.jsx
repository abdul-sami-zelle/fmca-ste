import React, { useState } from "react";
import "./ScheduleConsultant.css";

const ScheduleConsultant = () => {

    const [openWizard, setOpenWizard] = useState(false);
    const handleWizardOpen = () => {
        setOpenWizard(true);
    }

    const handleWizardClose = () => {
        setOpenWizard(false)
    }

    const [step, setStep] = useState(1);

    const nextStep = () => {
        if (step < 4) setStep(step + 1);
    };

    const prevStep = () => {
        if (step > 1) setStep(step - 1);
    };

    return (
        <div className={`wizard-main-container ${openWizard ? 'open-wizard' : ''}`}>
            <div className="wizard-container">
                {/* Step Indicator */}
                <div className="steps">
                    {["Type", "Location", "Date/Time", "Review"].map((label, index) => (
                        <div key={index} className={`step ${step >= index + 1 ? "active" : ""}`}>
                            <span>{index + 1}</span>
                            <p>{label}</p>
                        </div>
                    ))}
                    <div className="progress-bar" style={{ width: `${(step - 1) * 33}%` }}></div>
                </div>

                {/* Step Content */}
                <div className="step-content">
                    {step === 1 && <StepOne />}
                    {step === 2 && <StepTwo />}
                    {step === 3 && <StepThree />}
                    {step === 4 && <StepFour />}
                </div>

                {/* Navigation Buttons */}
                <div className="button-group">
                    {step > 1 && <button onClick={prevStep}>Back</button>}
                    {step < 4 ? <button onClick={nextStep}>Next</button> : <button>Submit</button>}
                </div>
            </div>
        </div>
    );
};

// Individual Step Components
const StepOne = () => (
    <div className="step-panel">
        <h2>How would you like your consultation?</h2>
        <div className="options">
            <div className="option">In Store</div>
            <div className="option">Video</div>
        </div>
    </div>
);

const StepTwo = () => <div className="step-panel"><h2>Choose Location</h2></div>;
const StepThree = () => <div className="step-panel"><h2>Select Date & Time</h2></div>;
const StepFour = () => <div className="step-panel"><h2>Review Details</h2></div>;

export default ScheduleConsultant;
