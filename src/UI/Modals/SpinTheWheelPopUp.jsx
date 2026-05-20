import React from "react";
import "./modalStyle.css";
import LuckySpinCustom from "../Components/SpinTheWheel/spinTheWheel";

export default function SpinTheWheelPopUp() {
    return(
        <div className="spinthewheel-overlay">
<LuckySpinCustom/>
        </div>
    )
}