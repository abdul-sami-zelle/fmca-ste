import React, {useState} from 'react'
import './InstaTwoImageGallery.css';
// import instaIcon from '../../../Assets/Furniture Mecca/Landing Page/instagram images/insta-icon.png'
import Link from 'next/link';
import Image from 'next/image';

const InstaTwoImageGallery = () => {
    const [animateMouse, setAnimateMouse] = useState(false);
    const handleMouseMove = () => {
        setAnimateMouse(true)

        setTimeout(() => {
            setAnimateMouse(false);
        }, 1500)
    }

     const instaGalleryImages = [
        'https://fmapi.myfurnituremecca.com/uploads/media/Image%201%20Instagram.jpg', 
        'https://fmapi.myfurnituremecca.com/uploads/media/Image%202%20Instagram.jpg', 
        'https://fmapi.myfurnituremecca.com/uploads/media/Image%203%20Instagram.jpg', 
        'https://fmapi.myfurnituremecca.com/uploads/media/Image%204%20Instagram.jpg'
    ]
  return (
    <div className={`insta-two-image-gallery ${animateMouse ? 'animate' : ''}`} onMouseMove={handleMouseMove}>
        <Link className='smallIcon' target='_blank' href={'https://www.instagram.com/myfurnituremecca/?igshid=MzRlODBiNWFlZA%3D%3D'}>
            <img src={'/Assets/Furniture Mecca/Landing Page/instagram images/insta-icon.png'} alt='icon' className={` ${animateMouse ? 'animate' : ''}`}/>
        </Link>
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
  )
}

export default InstaTwoImageGallery
