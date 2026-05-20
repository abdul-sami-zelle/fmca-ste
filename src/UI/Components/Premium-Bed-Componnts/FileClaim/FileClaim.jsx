import React from "react";
import './FileClaim.css';
import Image from "next/image";
import { MdKeyboardArrowRight, MdArrowRightAlt } from "react-icons/md";

const FileClaim = () => {
    const claimWays = [
        'Report within 30 days of noticing the issue',
        'Visit furnitureclaim.com or email claims@montagefs.com',
        'Electrical component failures (motors, wiring, remote controls)',
        'Include your sales receipt and protection plan number'
    ]
    return (
        <div className="file-claim-main-contianer">
            <div className="file-claim-image-section">
                <Image src={'/Assets/protection/File-A-Claim.jpg'} width={600} height={400} alt="img" />
            </div>
            <div className="file-claim-content-section">
                <h3>How to File a Claim:</h3>
                {claimWays.map((item, index) => (
                    <span key={index} className="file-claim-span">
                        <MdKeyboardArrowRight size={20} color="var(--text-gray)" />
                        <p>{item}</p>
                    </span>
                ))}
                <button>Claim Now <MdArrowRightAlt size={20} color="var(--text-oposite)" /> </button>
                <p>Note: Protection administered by Montage, LLC and provided by National Product Care Company.</p>
            </div>
        </div>
    )
}

export default FileClaim
