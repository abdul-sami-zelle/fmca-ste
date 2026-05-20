// 'use client'

// import React, { useState, useEffect } from 'react'
// import './Shopvia.css'
// import { IoClose } from "react-icons/io5";
// import { FaFacebook, FaTiktok, FaYoutube, FaInstagram } from "react-icons/fa";
// import Link from 'next/link';
// import { FaPhone } from "react-icons/fa6";

// const Shopvia = () => {
//   const [closeBanner, setCloseBanner] = useState(false);
//   const handleCloseBanner = () => {
//     setCloseBanner(!closeBanner);
//   }

//   const socialData = [
//     { icon: FaFacebook, link: 'https://www.facebook.com/myfurnituremecca' },
//     { icon: FaTiktok, link: 'https://www.tiktok.com/@myfurnituremecca?_t=8gcQvVGSaGI&_r=1' },
//     { icon: FaYoutube, link: 'https://www.youtube.com/@FurnitureMecca1' },
//     { icon: FaInstagram, link: 'https://www.instagram.com/myfurnituremecca/?igshid=MzRlODBiNWFlZA%3D%3D' },
//   ]

//   const [swipeContent, setSwipeContent] = useState(true);
//   useEffect(() => {
//     const intervelId = setInterval(() => {
//       setSwipeContent(!swipeContent)
//       // setCurrentIndex((prevIndex) => (prevIndex + 1) % dynamicHeading.length)
//     }, 5000)
//     return () => clearInterval(intervelId);
//   }, [swipeContent])

//   return (
//     <div className={`shop-via-banner ${closeBanner ? 'close' : ''}`}>
//       {/* {swipeContent ? (
//           <div className='maintanence-content-container'>
//           <p>Website is being upgraded, Sorry for the inconvenience you might face while exploring it!</p>
//         </div>
//         ) : ( */}
//       <div className='text-div'>
//         <div className={`social-icons-container ${swipeContent ? 'width-decrease' : ''}`}>
//           {socialData.map((item, index) => (
//             <Link href={item.link} target='_blank' key={index}>
//               <item.icon size={20} color='var(--text-oposite)' style={{ cursor: 'pointer' }} />
//             </Link>
//           ))}
//         </div>
//         {swipeContent ? (
//           <span className='webiste-update-main-contianer'>
//             <p className='rotate-message-maintanance'>Website is being upgraded, Sorry for the inconvenience you might face while exploring it!</p>
//             <i className='mobile-message'>
//               <p>Website is being upgraded,</p>
//               <p>Sorry for the inconvenience you might face while exploring it!</p>
//             </i>
//           </span>
//         ) : (
//           <span> <FaPhone size={20} color='var(--text-oposite)' style={{ marginRight: '5px' }} /> Get Help Call <a href='tel:2153521600'>215 352 1600</a> or <a href="mailto:meccacustomercare@gmail.com">Email</a> </span>
//         )}
//       </div>
//       {/* )} */}


//       <IoClose size={15} color='#FFFFFF' onClick={handleCloseBanner} />
//     </div>
//   )
// }

// export default Shopvia


'use client'

import React, { useState, useEffect } from 'react'
import './Shopvia.css'
import { IoClose } from "react-icons/io5";
import { FaFacebook, FaTiktok, FaYoutube, FaInstagram } from "react-icons/fa";
import Link from 'next/link';
import { FaPhone } from "react-icons/fa6";

const Shopvia = () => {
  const [closeBanner, setCloseBanner] = useState(false);
  const handleCloseBanner = () => {
    setCloseBanner(!closeBanner);
  }

  const socialData = [
    { icon: FaFacebook, link: 'https://www.facebook.com/myfurnituremecca' },
    { icon: FaTiktok, link: 'https://www.tiktok.com/@myfurnituremecca?_t=8gcQvVGSaGI&_r=1' },
    { icon: FaYoutube, link: 'https://www.youtube.com/@FurnitureMecca1' },
    { icon: FaInstagram, link: 'https://www.instagram.com/myfurnituremecca/?igshid=MzRlODBiNWFlZA%3D%3D' },
  ]

  const [swipeContent, setSwipeContent] = useState(true);
  useEffect(() => {
    const intervelId = setInterval(() => {
      setSwipeContent(!swipeContent)
    }, 5000)
    return () => clearInterval(intervelId);
  }, [swipeContent])

  return (
    <div className={`shop-via-banner ${closeBanner ? 'close' : ''}`}>
      {/* {swipeContent ? (
          <div className='maintanence-content-container'>
          <p>Website is being upgraded, Sorry for the inconvenience you might face while exploring it!</p>
        </div>
        ) : ( */}
      <div className='text-div'>
        <div className={`social-icons-container ${swipeContent ? 'width-decrease' : ''}`}>
          {socialData.map((item, index) => (
            <Link href={item.link} target='_blank' key={index}>
              <item.icon size={20} color='var(--text-oposite)' style={{ cursor: 'pointer' }} />
            </Link>
          ))}
        </div>
        {swipeContent ? (
          <span className='webiste-update-main-contianer'>
            <p className='rotate-message-maintanance'>FREE DELIVERY ON ORDERS ABOVE $899. MILEAGE RESTRICTIONS MAY APPLY</p>
            <i className='mobile-message'>
              <p>FREE DELIVERY ON ORDERS ABOVE $899.</p>
              <p>MILEAGE RESTRICTIONS MAY APPLY</p>
            </i>
          </span>
        ) : (
          <span> <FaPhone size={20} color='var(--text-oposite)' style={{ marginRight: '5px' }} /> Get Help Call <a href='tel:2153521600'>215 352 1600</a> or <a href="mailto:meccacustomercare@gmail.com">Email</a> </span>
        )}
      </div>
      {/* )} */}


      <IoClose size={15} color='#FFFFFF' onClick={handleCloseBanner} />
    </div>
  )
}

export default Shopvia