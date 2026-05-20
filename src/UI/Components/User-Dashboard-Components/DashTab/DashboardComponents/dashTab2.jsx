import React from "react";
import "./dashoardComponents.css";
import { FaArrowRight } from "react-icons/fa";


export default function DashboardTab2({name,value,unit,slug}) {
    return (
        <div className="dashboard_tab_2">
        <svg className="dashboard_tab_svg_2" viewBox="0 0 920 1620" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_d_9578_60792)">
<mask id="path-1-inside-1_9578_60792" fill="white">
<path fill-rule="evenodd" clip-rule="evenodd" d="M909 242.044C909 216.53 879.048 199.886 853.8 203.569C847.337 204.512 840.725 205 834 205C758.889 205 698 144.111 698 69C698 65.3992 698.14 61.831 698.415 58.3007C700.254 34.6691 684.194 9 660.491 9H41C23.3269 9 9 23.3269 9 41V977C9 994.673 23.3269 1009 41 1009H877C894.673 1009 909 994.673 909 977V242.044Z"/>
</mask>
<path fill-rule="evenodd" clip-rule="evenodd" d="M909 242.044C909 216.53 879.048 199.886 853.8 203.569C847.337 204.512 840.725 205 834 205C758.889 205 698 144.111 698 69C698 65.3992 698.14 61.831 698.415 58.3007C700.254 34.6691 684.194 9 660.491 9H41C23.3269 9 9 23.3269 9 41V977C9 994.673 23.3269 1009 41 1009H877C894.673 1009 909 994.673 909 977V242.044Z" fill="white"/>
<path d="M698.415 58.3007L697.418 58.2231L698.415 58.3007ZM853.8 203.569L853.656 202.58L853.8 203.569ZM853.656 202.58C847.24 203.515 840.677 204 834 204V206C840.774 206 847.433 205.508 853.945 204.559L853.656 202.58ZM834 204C759.442 204 699 143.558 699 69H697C697 144.663 758.337 206 834 206V204ZM699 69C699 65.4251 699.139 61.8828 699.412 58.3783L697.418 58.2231C697.141 61.7792 697 65.3733 697 69H699ZM41 10H660.491V8H41V10ZM10 977V41H8V977H10ZM877 1008H41V1010H877V1008ZM908 242.044V977H910V242.044H908ZM877 1010C895.225 1010 910 995.225 910 977H908C908 994.121 894.121 1008 877 1008V1010ZM41 8C22.7746 8 8 22.7746 8 41H10C10 23.8792 23.8792 10 41 10V8ZM699.412 58.3783C700.35 46.3242 696.727 33.765 689.843 24.2042C682.953 14.6357 672.735 8 660.491 8V10C671.95 10 681.614 16.1989 688.22 25.3729C694.831 34.5545 698.319 46.6457 697.418 58.2231L699.412 58.3783ZM8 977C8 995.225 22.7746 1010 41 1010V1008C23.8792 1008 10 994.121 10 977H8ZM853.945 204.559C866.317 202.754 879.874 205.933 890.324 212.697C900.769 219.458 908 229.717 908 242.044H910C910 228.857 902.255 218.037 891.411 211.018C880.573 204.003 866.531 200.702 853.656 202.58L853.945 204.559Z" fill="#F0F0F0" mask="url(#path-1-inside-1_9578_60792)"/>
</g>
<defs>
<filter id="filter0_d_9578_60792" x="0" y="0" width="920" height="1020" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dx="1" dy="1"/>
<feGaussianBlur stdDeviation="5"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_9578_60792"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_9578_60792" result="shape"/>
</filter>
</defs>
</svg>
            <h3 className="heading">
                {name}
            </h3>
            <div className="count">
                {value} <span>{unit}</span>
            </div>
            <div className="circular_button">
                <FaArrowRight/>
            </div>
        </div>
    )
}