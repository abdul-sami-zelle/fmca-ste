import React from 'react'
import Link from 'next/link'

const FooterNav = ({link, linkName}) => {
  return (
        <p className='footer-nav-items'>
            <Link href={link}>{linkName}</Link>
        </p>
  )
}

export default FooterNav
