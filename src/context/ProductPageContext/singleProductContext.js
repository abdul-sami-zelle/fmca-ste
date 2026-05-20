'use client'

import { createContext, useState } from "react"

const SingleProductContext = createContext();

export const SingleProductProvider = ({children}) => {

    const [singleProduct, setSingleProduct] = useState(null);

    <SingleProductContext.Provider value={{
        singleProduct,
        setSingleProduct
    }}>
        {children}
    </SingleProductContext.Provider>
}