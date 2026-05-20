import React from "react";
import './ProtectYourInvestment.css';
import Image from "next/image";

const ProtectYourInvestment = () => {
    const investmentProtect = [
        {
            title: 'Mechanical And Structural Breakdowns To Fabric, Leather, Vinyl Upholstery Or Solid Surface Furniture As A Result Of',
            options: [
                { name: 'Breakage of frames, panels, or springs', fabric: true, leather: true, woodAndOther: true },
                { name: 'Breakage of frames, panels, or springs', fabric: true, leather: true, woodAndOther: true },
                { name: 'Breakage of frames, panels, or springs', fabric: true, leather: true, woodAndOther: true },
                { name: 'Breakage of frames, panels, or springs', fabric: false, leather: false, woodAndOther: true },
                { name: 'Breakage of frames, panels, or springs', fabric: false, leather: false, woodAndOther: true },
                { name: 'Breakage of frames, panels, or springs', fabric: false, leather: false, woodAndOther: true },
            ]
        },
        {
            title: 'A Specific Post-Delivery Incident Which Occurs During Normal Residential Use Resulting In Accidental Damage',
            options: [
                { name: 'All stain types, including dye bleed and dye transfer onto or into upholstery fabric or vinyl', fabric: true, leather: true, woodAndOther: true },
                { name: 'Punctures, rips or burns', fabric: true, leather: true, woodAndOther: true },
                { name: 'Liquid marks or rings', fabric: true, leather: true, woodAndOther: true },
                { name: 'Household heat marks', fabric: false, leather: false, woodAndOther: true },
                { name: 'Gouges, dents, scratches or chips that penetrate the finish exposing the substrate', fabric: false, leather: false, woodAndOther: true },
                { name: 'Damage caused by nail polish remover', fabric: false, leather: false, woodAndOther: true },
                { name: 'Checking, cracking, bubbling or peeling of finish caused by a specific incident', fabric: false, leather: false, woodAndOther: true },
                { name: 'Glass or mirror chipping, breakage or scratches', fabric: false, leather: false, woodAndOther: true },
            ]
        },
    ]
    return (
        <>
            <div className="protect-investment-main-contianer">

                <div className="protect-investment-heading-contianer">
                    <div className="protect-investment-head">
                        <h3>Protect Your Investment</h3>
                    </div>
                    <div className="protect-investment-head-options">
                        <p>Fabric</p>
                        <p>Leather & Vinyl</p>
                        <p>Wood & Other Solid Surfaces</p>
                    </div>
                </div>



                {investmentProtect.map((item, index) => (
                    <div key={index} className="protect-investment-options-container">
                        <div className="protect-investment-full-container">
                            <p>Mechanical And Structural Breakdowns To Fabric, Leather, Vinyl Upholstery Or Solid Surface Furniture As A Result Of</p>
                        </div>
                        {item.options.map((innerItem, innerIndex) => (
                            <div className="protect-invest-single-option" key={innerIndex}>
                                <div className="protect-invest-single-option-name">
                                    <h3>{innerItem.name}</h3>
                                </div>
                                <div key={innerIndex} className="protect-investment-single-option-check">
                                    <p>{innerItem.fabric === true ? <span></span> : <></>}</p>
                                    <p>{innerItem.leather === true ? <span></span> : <></>}</p>
                                    <p>{innerItem.woodAndOther === true ? <span></span> : <></>}</p>


                                </div>

                            </div>
                        ))}

                    </div>
                ))}

            </div>

            <div className="mobile-protect-investment-main-contianer">
                <Image src={'/Assets/protection/protection-table.png'} width={320} height={240} alt="img" />
            </div>
        </>

    )
}

export default ProtectYourInvestment;