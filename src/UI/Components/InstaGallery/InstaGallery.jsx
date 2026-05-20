import React, { useState } from 'react'
import './InstaGallery.css';
import Link from 'next/link';
import Image from 'next/image';


const InstaGallery = () => {
    const instaGalleryImages = [
        'https://fmapi.myfurnituremecca.com/uploads/media/Image%201%20Instagram.jpg', 
        'https://fmapi.myfurnituremecca.com/uploads/media/Image%202%20Instagram.jpg', 
        'https://fmapi.myfurnituremecca.com/uploads/media/Image%203%20Instagram.jpg', 
        'https://fmapi.myfurnituremecca.com/uploads/media/Image%204%20Instagram.jpg', 
        'https://fmapi.myfurnituremecca.com/uploads/media/Image%205%20Instagram.jpg', 
        'https://fmapi.myfurnituremecca.com/uploads/media/Image%206%20Instagram.jpg', 
        'https://fmapi.myfurnituremecca.com/uploads/media/Image%207%20Instagram.jpg', 
        'https://fmapi.myfurnituremecca.com/uploads/media/Image%208%20Instagram.jpg', 
        'https://fmapi.myfurnituremecca.com/uploads/media/Image%2010%20Instagram.jpg', 
        'https://fmapi.myfurnituremecca.com/uploads/media/Image%209%20Instagram.jpg', 
        'https://fmapi.myfurnituremecca.com/uploads/media/Image%206%20Instagram.jpg', 
        'https://fmapi.myfurnituremecca.com/uploads/media/Image%201%20Instagram.jpg', 
        'https://fmapi.myfurnituremecca.com/uploads/media/Image%208%20Instagram.jpg', 
        'https://fmapi.myfurnituremecca.com/uploads/media/Image%2010%20Instagram.jpg', 
        'https://fmapi.myfurnituremecca.com/uploads/media/Image%204%20Instagram.jpg', 
        'https://fmapi.myfurnituremecca.com/uploads/media/Image%203%20Instagram.jpg', 
    ]
    const [animateMouse, setAnimateMouse] = useState(false);
    let intervelId;


    const handleMouseMove = () => {
        setAnimateMouse(true);

        intervelId = setInterval(() => {
            setAnimateMouse(false);
            setTimeout(() => {
                setAnimateMouse(true);
            }, 1000);
        }, 1500)

    }

    const stopAnimation = () => {
        setAnimateMouse(false);
        clearInterval(intervelId);
    };

  return (
<div className="insta-container" onMouseEnter={handleMouseMove} onMouseLeave={stopAnimation}>
  <div className="images">
    {instaGalleryImages.map((image, index) => (
      <div key={index} className="image-wrapper">
        <Image
          src={image}
          width={380}
          height={345}
          alt={`image ${index + 1}`}
          className="gallery-img"
        />
        <div className="overlay_img"></div>
      </div>
    ))}
  </div>

  <div className={`icon ${animateMouse ? 'animate' : 'animate'}`}>
    <Link
      target="_blank"
      href="https://www.instagram.com/myfurnituremecca/?igshid=MzRlODBiNWFlZA%3D%3D"
    >
      <Image
        src="/Assets/Furniture Mecca/Landing Page/instagram images/insta-icon.png"
        width={130}
        height={130}
        alt="icon"
        className={`${animateMouse ? 'animate' : 'animate'}`}
      />
    </Link>
  </div>
</div>

  )
}

export default InstaGallery
