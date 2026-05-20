import React, { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

const ScrollToTop = ({children}) => {
    const location = useLocation();
    const prevPathname = useRef(location.pathname);
    // const pathname = useLocation();
    useEffect(() => {
      if(prevPathname.current !== location.pathname){
        window.scrollTo(0, 0);
        prevPathname.current = location.pathname;
      }
    }, [location.pathname]);
  return children || null
}

export default ScrollToTop