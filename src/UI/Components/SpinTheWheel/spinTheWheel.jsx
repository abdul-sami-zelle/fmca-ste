import React, { useState, useRef, useEffect } from "react";
import "./spinTheWheel.css";
import DottedCircle from "./dotted";
import CouponCard from "./coupon";
import arrow2 from "../../../Assets/spinTheWheel/arrow2.png";
import prize1 from "../../../Assets/spinTheWheel/01.png";
import prize2 from "../../../Assets/spinTheWheel/02.png";
import prize3 from "../../../Assets/spinTheWheel/03.png";
import prize4 from "../../../Assets/spinTheWheel/04.png";
import prize5 from "../../../Assets/spinTheWheel/05.png";
import prize6 from "../../../Assets/spinTheWheel/06.png";
import up1 from "../../../Assets/spinTheWheel/up1.png";
import up2 from "../../../Assets/spinTheWheel/up2.png";
import backsnow from "../../../Assets/spinTheWheel/backsnow.png";
import frontsnow from "../../../Assets/spinTheWheel/frontsnow.png"


const LuckySpinCustom = () => {
    // const {showConfetti,setShowConfetti} = useLuckySpinContext();
    const [isWin, setWin] = useState(false);
    const [isSpinning, setIsSpinning] = useState(false);
    const [uid, setUid] = useState("");
    const [loading, isLoading] = useState(false);
    const [winner, setWinner] = useState("");
    const [currentStep, setCurrentStep] = useState(0);
    // const [showConfetti, setShowConfetti] = useState(false);
    const [showCongrat, setShowCongrats] = useState(false);
    const canvasRef = useRef(null);
    const [makeChange,setMakeChange] = useState(false);
  
    const buttonRef = useRef(null); // Ref for the button
  
    useEffect(() => {
      if (makeChange) {
        const button = buttonRef.current;
  
        // Add the shake class
        button.classList.add("shake");
  
        // Remove the shake class after animation ends
        const timeout = setTimeout(() => {
          button.classList.remove("shake");
          setMakeChange(false); // Reset the state if needed
        }, 500); // Match the shake animation duration
  
        return () => clearTimeout(timeout); // Cleanup timeout
      }
    }, [makeChange]);
  
  
    const setCurrentStepState = (to) => {
      setCurrentStep(to);
    }
  
    const prizes = [
      { name: "Prize 2", image: prize2,  prize: "Free delivery with your purchase of $999 or more", uid: "676a465e9e2bb1f3f1af60a5"  },
      { name: "Prize 3", image: prize3,  prize: "Free mattress with purchase of bedroom set worth $1199 or more", uid: "676a46de9e2bb1f3f1af610c"  },
      { name: "Prize 4", image: prize4,  prize: "$200 off your order of $2000 or more", uid: "676a47529e2bb1f3f1af6173"   },
      { name: "Prize 5", image: prize5,  prize: "Free 75 inch TV with purchase of $5000 or more", uid: "676a47d39e2bb1f3f1af61da" },
      { name: "Prize 6", image: prize6,  prize: "Free Rug with purchase of $599.99 or more", uid: "676a4bce9e2bb1f3f1af6241" },
      { name: "Prize 1", image: prize1,  prize: "$100 off your order of $1000 or more", uid: "676a44999e2bb1f3f1af5f70"  },
    ];
  
    const bgcolors = ["#1A3D5B", "#FBF2F7", "#1A3D5B", "#FBF2F7", "#1A3D5B", "#FBF2F7"];
    const segments = prizes.length;
    const segmentAngle = 360 / segments;
    const images = useRef([]);
  
  
    
  
    // Preload images
    useEffect(() => {
      prizes.forEach((prize, index) => {
        const img = new Image();
        img.src = prize.image;
        img.onload = () => {
          images.current[index] = img;
          if (images.current.length === prizes.length) drawWheel();
        };
      });
    }, [prizes]);
  
    const drawWheel = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = canvas.width / 2;
  
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  
      for (let i = 0; i < segments; i++) {
        // Adjust the angles to start at the top (-90 degrees)
        const startAngle = ((i * segmentAngle - 90) * Math.PI) / 180;
        const endAngle = (((i + 1) * segmentAngle - 90) * Math.PI) / 180;
  
        // Draw segment background
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = bgcolors[i];
        ctx.fill();
        ctx.strokeStyle = "rgba(0,0,0,0)";
        ctx.stroke();
  
        // Clip the drawing area to the current segment
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.clip();
  
        // Draw prize image
        if (images.current[i]) {
          const imgSize = radius * 1.95; // Adjust the size of the image as needed
          const textAngle = startAngle + (endAngle - startAngle) / 2;
          const imgX = centerX + radius * 0.15 * Math.cos(textAngle) - imgSize / 2;
          const imgY = centerY + radius * 0.15 * Math.sin(textAngle) - imgSize / 2;
  
          ctx.drawImage(images.current[i], imgX, imgY, imgSize, imgSize);
        }
  
        ctx.restore();
      }
    };
  
  
    const sentMail = async (uid,mail) => {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
  
      const raw = JSON.stringify({
        "email": mail,
        "option_uid": uid
      });
  
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };
  
      fetch("https://fmspinapi.zellehost.com/api/v1/winners/add", requestOptions)
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
    }
  
    
    const [value, setValue] = useState('');
  
    const handleChange = (e) => {
      setValue(e.target.value);
    };
  
    const spinWheel = () => {
      if (isSpinning) return;
    
      // Email validation regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
      if (!value || !emailRegex.test(value)) {
        setMakeChange(!makeChange);
        return;
      }
    
      setIsSpinning(true);
      setCurrentStep(2);
    
      const spinAngle = Math.floor(15000 + Math.random() * 5000); // Total spin angle (5–10 seconds)
      const rotation = spinAngle % 360;
      const selectedIndex = Math.floor(
        (segments - rotation / (360 / segments)) % segments
      );
    
      const canvas = canvasRef.current;
    
      // Reduce the duration for a faster spin
      canvas.style.transition = "transform 15s cubic-bezier(0.25, 1, 0.5, 1)";
      canvas.style.transform = `rotate(${spinAngle}deg)`;
    
      setTimeout(() => {
        setIsSpinning(false);
        setWinner(prizes[selectedIndex].prize);
        setUid(prizes[selectedIndex].uid);
    
        // Reset the wheel to the final position (rotation)
        canvas.style.transition = "none";
        canvas.style.transform = `rotate(${rotation}deg)`;
    
        // Send email
        sentMail(prizes[selectedIndex].uid, value);
    
        // Show confetti and move to the next step
        setTimeout(() => {
          setCurrentStep(3);
        //   setShowConfetti(true);
        }, 1000);
    
        // Hide confetti after 10 seconds
        // setTimeout(() => setShowConfetti(false), 10000);
      }, 15000); // Transition duration (2s)
    };
    
  
  
    return (
      <div className="main">
        
        <div
          style={{
            height: "500px",
            width: "500px",
  
          }}
          className="spinner"
        >
           <img className="up1" src={up1} alt="" />
           <img className="up2" src={up2} alt="" />
         
       
        <div className="main-dotted">
        <DottedCircle
            radius={264} // Radius of the circle
            dotCount={24} // Number of dots
            dotRadius={7.5} // Size of each dot
            size={566} // SVG canvas size
            left={-3}
            top={-2}
            isBlink={currentStep === 3}
            startColor={"#fff"}
            stopColor={"#fff"}
            
          />
        </div>
          <canvas
            className={showCongrat ? "wheel-canvas display_none" : "wheel-canvas"}
            ref={canvasRef}
            width="500"
            height="500"
            style={{
              transformOrigin: "center",
  
            }}
          />
          <img src={arrow2}
            className={currentStep === 3 ? "arrow display_none" : "arrow"}
          />
  
          <div 
          onClick={() => { setCurrentStepState(1) }}
          // onClick={spinWheel}
           className={currentStep === 0 ? "central_circle_0 " : "central_circle_0 display_none"}>
            {/* <h2>LET SEE <br /> <span>WHAT YOU WILL</span> <br />WIN</h2> */}
  
            <div className="central_circle_0_1">
              <h2>Spin</h2>
            </div>
  
          </div>
          <div className={currentStep === 1 ? "central_circle" : "central_circle display_none"}>
  
            <h2>SPIN <br /> <span>TO WIN</span></h2>
            <input
              type="text"
              value={value}
              onChange={handleChange}
              className="underlined-input"
              placeholder="Enter Your Email"
            />
            <button
               ref={buttonRef}
              onClick={spinWheel}
              disabled={isSpinning}
            >
              START
            </button>
  
          </div>
          <div className={currentStep === 2 ? "central_circle_progress " : "central_circle_progress display_none"}>
            <h2>LET SEE <br /> <span className="">WHAT YOU</span> <br /> <span className="span2" >WIN</span> </h2>
            <DottedCircle
              radius={100} // Radius of the circle
              dotCount={12} // Number of dots
              dotRadius={7.5} // Size of each dot
              size={240}
              left={0}
              top={0}
              startColor={"#FFD700"}
              stopColor={"#ffb300"}
            />
  
          </div>
          <div className={currentStep === 3 ? "central_circle_2 display_none" : "central_circle_2 "}>
            <h2>CONGRATULATIONS!</h2>
            <CouponCard prize={winner} />
  
          </div>
  
         
  
  
        </div>
        <img className="backbottomsnow1" src={backsnow} alt="" />
        <img className="frontbottomsnow1" src={frontsnow} alt="" />
       
      </div>
    );
  };
  
  export default LuckySpinCustom;
  