import React, { useEffect } from "react";
import "./modalStyle.css";
import { IoCloseCircle } from "react-icons/io5";
import { useGlobalContext } from "../../context/GlobalContext/globalContext";


export default function WarrantyModal(params) {
    const {setWarrantyModalState} = useGlobalContext();

    // useEffect(() => {
    //     if (setWarrantyModalState) {
    //         document.body.style.overflow = 'hidden';
    //     } else {
    //         document.body.style.overflow = 'auto'
    //     }
    // }, [setWarrantyModalState])

    return (
        <div className="loader-overlay" onClick={()=>{setWarrantyModalState(false)}}>
            <div className="global_modal" onClick={(e) => e.stopPropagation()}>
                <div className="header_popup">
                    <div className="title">
                        Warranty Modal
                    </div>
                    <div className="close-btn-modal" onClick={(e)=>{e.stopPropagation(); setWarrantyModalState(false)}}>
                        <IoCloseCircle />
                    </div>
                </div>

                <div className="warranty_modal_content">
                    <p>5 years coverage for all stains and most accidental damage</p>
                    <p>5 years coverage for all stains and most accidental damage</p>
                </div>
                <div className="footer_popup">
                    <button className="close_button_footer" onClick={(e) => {e.stopPropagation(); setWarrantyModalState(false)}}>
                        Close
                    </button>
                    <button className="accept_button_footer">
                        Apply
                    </button>
                </div>
            </div>
        </div>

    )
}