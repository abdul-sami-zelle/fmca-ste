import React from "react";
import './FinanceBannerSlider.css';
import { url } from "../../../utils/api";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";


function FinanceBanner2({image,mobileImage}) {
  const router = useRouter;
  const handleNavigate = () => {
    router.push(`/financing`);
  }
  return (
    <div className="finance_banner_2">
        <Link href={'https://flyer.myfurnituremecca.com/'} target="_blank" className="finance_banner_2_desktop" >
            <Image src={url+image?.image_url} width={1800} height={350} alt="" srcSet="" onClick={handleNavigate}/>
        </Link>
        <Link href={'https://flyer.myfurnituremecca.com/'} target="_blank" className="finance_banner_2_mobile">
            <Image src={url+mobileImage?.image_url} width={480} height={320} alt="" srcSet="" />
        </Link>
    </div>
  );
}

export default FinanceBanner2;
