export const GA_TRACKING_ID = 'G-GQL4WY726N'

// Log page views
export const pageview = (url) => {
  if (typeof window.gtag !== 'function') {
    console.warn('Google Analytics not ready: pageview skipped')
    return
  }
  window.gtag('config', GA_TRACKING_ID, { page_path: url })
}

// Log specific events
export const event = ({ action, params }) => {
  if (typeof window.gtag !== 'function') {
    console.warn('Google Analytics not ready: event skipped')
    return
  }
  window.gtag('event', action, params)
}
