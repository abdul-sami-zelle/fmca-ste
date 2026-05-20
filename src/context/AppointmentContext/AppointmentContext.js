'use client'

import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { url } from "../../utils/api";

const AppointmentContext = createContext();

export const AppointmentProvider = ({ children }) => {

  const [appointmentPayload, setAppointmentPayload] = useState({
    serviceType: 'in-store',
    selectedCategories: [],
    selectedStore: {},
    otherDetails: 'Customer has sensitive skin',
    selectedDate: '',
    selectedSlot: '',
    details: {
      firstName: '',
      lastName: '',
      email: '',
      contact: '',
      address: '',
      associate: ''
    }
  })

  const [error, setError] = useState({})

  const [parentCategories, setParentCategories] = useState([])
  const fetchCategories = async () => {
    const api = `/api/v1/productCategory/get?parent=0`;
    try {
      const response = await axios.get(`${url}${api}`);
      setParentCategories(response?.data?.categories);

    } catch (error) {
      console.error("UnExpected Server Error", error);
    }
  }

  useEffect(() => { fetchCategories() }, [])
  useEffect(() => { }, [parentCategories])

  return (
    <AppointmentContext.Provider value={{
      appointmentPayload,
      setAppointmentPayload,
      parentCategories,
      setParentCategories,
      error,
      setError
    }}>
      {children}
    </AppointmentContext.Provider>
  )
}

export const useAppointment = () => useContext(AppointmentContext)

