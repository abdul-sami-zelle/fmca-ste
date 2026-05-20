import React, { useEffect, useRef, useState } from "react";
import './MagnifyImage.css';
import Image from "next/image";

const MagnifyImage = ({ src, zoom = 0.8, width = 400, height = 300 }) => {
    const [showMagnifier, setShowMagnifier] = useState(false);
    const [magnifierPos, setMagnifierPos] = useState({ x: 0, y: 0 });
    const imgRef = useRef(null);

    const handleMouseMove = (e) => {
        // const { top, left, width: imgWidth, height: imgHeight } = imgRef.current.getBoundingClientRect();
        // const x = e.clientX - left;
        // const y = e.clientY - top;
        // const bgX = (x / imgWidth) * 100;
        // const bgY = (y / imgHeight) * 100;

        const imgRect = imgRef.current.getBoundingClientRect();
        const x = e.clientX - imgRect.left;
        const y = e.clientY - imgRect.top;

        const bgX = (x / imgRect.width) * 100;
        const bgY = (y / imgRect.height) * 100;

        // Flip direction logic
        const offset = 30;
        const flipX = x + 200 + offset > imgRect.width;
        const posX = flipX ? x - 200 - offset : x + offset;

        const flipY = y + 200 + offset > imgRect.height;
        const posY = flipY ? y - 200 - offset : y + offset;

        // setMagnifierPos({
        //     x,
        //     y,
        //     bgX,
        //     bgY,
        // });
        setMagnifierPos({
            x: posX,
            y: posY,
            bgX,
            bgY,
        });


    }

    // const handleMouseMove = (e) => {
    //     const imgRect = imgRef.current.getBoundingClientRect();
    //     const x = e.clientX - imgRect.left;
    //     const y = e.clientY - imgRect.top;

    //     const bgX = (x / imgRect.width) * 100;
    //     const bgY = (y / imgRect.height) * 100;

    //     const magnifierSize = 250;
    //     const halfSize = magnifierSize / 2;
    //     const offset = 15;

    //     let posX = x + offset;
    //     let posY = y + offset;

    //     if (x + halfSize + offset > imgRect.width) {
    //         posX = x - halfSize - offset;
    //     }

    //     if (y + halfSize + offset > imgRect.height) {
    //         posY = y - halfSize - offset;
    //     }

    //     setMagnifierPos({
    //         x: posX,
    //         y: posY,
    //         bgX,
    //         bgY,
    //     });
    // };

    useEffect(() => {
        setMagnifierPos({ x: 0, y: 0, bgX: 0, bgY: 0 });
    }, [src]);

    return (
        <div
            className="magnifier-contianer"
            style={{ width: width, height: height }}
            onMouseEnter={() => setShowMagnifier(true)}
            onMouseLeave={() => setShowMagnifier(false)}
            onMouseMove={handleMouseMove}
        >
            <Image src={src} ref={imgRef} alt="magnifier image" width={500} height={300} className="magnifier-image" />
            {showMagnifier && (

                <div
                    className="magnifier-glass"
                    style={{
                        top: `${magnifierPos.y}px`,
                        left: `${magnifierPos.x}px`,
                        backgroundImage: `url(${src})`,
                        backgroundPosition: `${magnifierPos.bgX}% ${magnifierPos.bgY}%`,
                        backgroundSize: `${zoom * 100}%`,
                    }}
                />
            )}
        </div>
    )
}

export default MagnifyImage