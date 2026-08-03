import React from 'react'
import './LandingPageFinancing.css'
import Link from 'next/link';
import Image from 'next/image';
import { url } from '@/utils/api';
import { useRouter } from 'next/navigation';


const LandingPageFinancing = () => {
  const bannersData = [
    '/mix-images/mob-banner-1.jpg',
    '/mix-images/option-2.gif',
    '/mix-images/large-banner-2.jpeg',
  ]
  const financingButtons = [
    {
      img: '/Assets/Furniture Mecca/Landing Page/financing/american.png',
      title: 'american',
      link: `https://sv1.americanfirstfinance.com/v2/kwik/10609`
    },
    {
      img: '/Assets/Furniture Mecca/Landing Page/financing/progressive.png',
      title: 'progressive',
      link: `https://approve.me/s/furnituremecca/129301`
    },
    {
      img: '/Assets/Furniture Mecca/Landing Page/financing/snap.png',
      title: 'snap',
      link: `https://apply.snapfinance.com/snap-com?paramId=Hq1qQmOsEuVFOlP6bdRg2D3%2BxnW9U1eKtIkrDRYxxSNWnLK4%2F6jHOC57%2FaFXzbBqmSADc%2B25IrUh0fLOir2w4pCWfkdCvNKE7NiJor%2BcWcRld9e3IFdUTA%3D%3D&source=INTERNET&merchantGroupId=36354109`
    },
    {
      img: '/Assets/Furniture Mecca/Landing Page/financing/acima.png',
      title: 'acima',
      link: `https://ams.acimacredit.com/discover/new?utm_campaign=merchant&utm_source=web&merchant_guid=merc-3bd04932-d6a0-4848-8a30-af0a9d935f25#/select_location`
    },

  ]

  const router = useRouter();
  const navigateTofinancing = () => {
    router.push('/financing')
  }
  return (
    <>
      <div className='landing-page-financing-main-container'>
        <h3 className='landing-page-financing-main-heading'>Financing & Leasing Options</h3>
        <div className='landing-page-financing-banners-main-container'>
          <div className='landing-page-financing-left'>

            <div onClick={navigateTofinancing}>
              <Image src={'/mix-images/desktop-banner-1.jpg'} width={900} height={350} alt='banner one' />
            </div>

            <div onClick={navigateTofinancing}>
              <Image src={'/mix-images/option-2.gif'} width={900} height={350} alt='banner two' />
            </div>
          </div>
          <div onClick={navigateTofinancing} className='landing-page-financing-right'>
            <Image src={'/mix-images/large-banner-2.jpeg'} width={900} height={470} alt='banner-three' />
            <div className='financing-page-buttons-div'>
              {financingButtons.map((item, index) => (
                <div key={index} className='financing-page-buttons-div-column' onClick={(e) => e.stopPropagation()}>
                  <Link target='_blank' href={item.link} className='financing-buttons'>
                    <img src={item.img} alt={item.title} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className='mobile-view-banners-container'>
        {bannersData.map((item, index) => (
          <div key={index} className={index === 1 ? `hide-gif-banner-on-phone` : index === 2 ? 'combined-poster' :  `mobile-view-banner-container`}>
            <img src={item} alt='banner' className='mobile-view-banner' />
          </div>
        ))}
        <div className='mobile-view-banner-buttons-container'>
          {financingButtons.map((item, index) => (
            <div key={index} className={`hide-paypal-section`}>
              <Link target='_blank' href={item.link} className='mobile-view-financing-buttons'>
                <img src={item.img} alt={item.title} />
              </Link>
            </div>
          ))}
        </div>
        <div  className={`mobile-view-banner-container-hide-on-desktop`}>
          <Image src={`/mix-images/option-2.gif`} width={480} height={150} alt='banner gif' className='mobile-view-banner' />
        </div>

      </div>
    </>
  )
}

export default LandingPageFinancing
