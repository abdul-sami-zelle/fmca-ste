import React from 'react'
import 'leaflet/dist/leaflet.css';

const App = ({ Component, pageProps }) => {

  const getLayout = Component.getLayout || ((page) => page)
  return getLayout(<Component {...pageProps} />)
  
}

export default App