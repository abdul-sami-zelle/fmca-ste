'use client'

import { createContext, useContext, useState } from "react";

const userDashboardContext = createContext();

export const UserDashboardCtxProvider = ({ children }) => {
    const [userToken, setUserToken] = useState(null);
    const [userUid, setUserUid] = useState(null);
    const [signinClicked, setSigninClicked] = useState(false)
    const [mobileSignupClicked, setMobileSignupClicked] = useState(false)
    const [isTokenValid, setIsTokenValid] = useState(false); // State to track token validity


    const setToken = (token, id) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('userToken', token);
            localStorage.setItem('uuid', id);
            setUserToken(token);
            setUserUid(id)
            setIsTokenValid(true);
        }
    };

    const removeToken = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('userToken');
            localStorage.removeItem('uuid');
            setUserToken(null);
            setUserUid(null)
            setIsTokenValid(false);
        }
    };

    



    return (
        <userDashboardContext.Provider value={{
            userToken,
            setToken,
            removeToken,
            setUserToken,
            isTokenValid, userUid,
            setUserUid,
            signinClicked,
            setSigninClicked,
            mobileSignupClicked, 
            setMobileSignupClicked,
        }}>
            {children}
        </userDashboardContext.Provider>
    );
};

export const useUserDashboardContext = () => useContext(userDashboardContext);
