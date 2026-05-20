import React, { useState } from "react";
import "./DesignYourRoomIndv.css";
import { url, useDisableBodyScroll } from "@/utils/api";
import Image from "next/image";

export default function DesignYourRoomIndv({ image, openFN, designRef, productUid }) {

  const [showIframe, setShowIframe] = useState(false);

  useDisableBodyScroll(showIframe)
  return (
    <div className="design_room_indv" id={'DesignYourRoom'} ref={designRef}>

      {image && (
        <div
          className="design_room_main_indv"
          style={{ backgroundImage: `url(${url+image})`, overflow: 'hidden' }}
        >
          {productUid === 3588 && (
             <Image src={url + image} width={1500} height={400} alt="img" className="temp-design-room-image" />
          )}
          
          <div className="overlay"></div>
          <div className="overlay-content-dri">
            <h2>Design Your Dream Home And Step Inside.</h2>
            <p>Use our free Room Design Tool To Find Your Style,Set Your Budget And Design Your Space.</p>
            <button onClick={() => { openFN() }}>Get Started</button>
          </div>
        </div>

  )
}

{
  showIframe && (
    <div className="iframe-container">
      <iframe
        src="https://room.myfurnituremecca.com/design/living-room"
        title="Design Your Room"
        allowfullscreen={true}
        style={{
          transform: "scale(0.8)",
          transformOrigin: "50% 50%",
          width: "125%",
          height: "600px",
          border: "none",
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      />
    </div>
  )
}

    </div >
  );
}
