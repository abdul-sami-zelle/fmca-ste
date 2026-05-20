'use client'

import { createContext, useContext, useEffect, useState } from "react";
import { url } from "../../utils/api";
import { useCart } from "../cartContext/cartContext";

const GlobalContext = createContext();

export const GlobalContextProvider = ({ children }) => {


  const [stores, setStores] = useState([]);
  const [shippingMethods, setShippingMethods] = useState(null);
  const [totalTax, setTotalTax] = useState(null);
  const [shippingHandlingApplied, setShippingHandlingApplied] = useState(false);
  const [shippingLoader, setShippingLoader] = useState(false);
  const [taxLoader, setTaxLoader] = useState(false);
  const { subTotal, cartProducts, isProfessionalAssembly, furnitureAssemblyValue, handleCartAssemblyFalse } = useCart();
  const [mainLoader, setMainLoader] = useState(false);
  const [searchLocation, setSearchLocation] = useState(false);

  const [isDeliveryAllowed, setIsDeliveryAllowed] = useState(false);
  const [showDeliveryMessage, setShowDeliveryMessage] = useState(false);

  const [isWarrantyModalOpen, setWarrantyModalState] = useState(false);

  const defaultInfo = {
    locationData: {
      zipCode: '19134',
      stateCode: 'PA',
      city: 'E Venango St',
      state: 'Philadelphia',
      country: 'us',
      longitude: '-75.1276754',
      latitude: '40.0045027',
    }
  };

  // ✅ Safely initialize `info` from localStorage or use default
  const [info, setInfo] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("other_info");
      try {
        return saved ? JSON.parse(saved) : defaultInfo;
      } catch {
        return defaultInfo;
      }
    }
    return defaultInfo;
  });


  // ✅ Call `setAllShippingMethods()` only when info is loaded and has a valid zipCode
  useEffect(() => {
    if (info?.locationData?.zipCode) {
      setAllShippingMethods();
    }
  }, [info]);


  // const [info, setInfo] = useState(() => {
  //   if (typeof window !== "undefined") {
  //     const savedInfo = localStorage.getItem('other_info');
  //     return savedInfo ? JSON.parse(savedInfo) : defaultInfo;
  //   }
  //   return defaultInfo; // fallback for SSR
  // });



  // const [info, setInfo] = useState();

  // // Only override from localStorage in browser
  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     const savedInfo = localStorage.getItem('other_info');
  //     if (savedInfo) {
  //       setInfo(savedInfo);
  //       setAllShippingMethods()
  //     } 
  //   }
  // }, []);

  const updateLocationData = (newLocationData) => {
    if (newLocationData) {
      setInfo((prevState) => ({
        ...prevState,
        locationData: {
          ...prevState.locationData,
          ...newLocationData
        }
      }));
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('other_info', JSON.stringify(info));
      fetchAllstores("code", info?.locationData?.zipCode);
    }
  }, [info])

  // const [zipCode, setZipCode] = useState(`${info.locationData.zipCode} ${info.locationData.stateCode}`);
  const [zipCode, setZipCode] = useState(() => {
    if (info && info.locationData) {
      return `${info.locationData.zipCode}`;
    }
    return ""; // Default empty if info not available
  });

  // const handleInputChange = (e) => {

  //   setZipCode(e.target.value);
  // };
  const handleInputChange = async (e) => {

    const input = e.target.value;

    // Only allow up to 5 digits (0-9 only)
    if (/^\d{0,5}$/.test(input)) {
      setZipCode(input);
    }
  };

  async function getStateByPostalCode(postalCode) {

    const apiUrl = `https://api.zippopotam.us/us/${postalCode}`;

    try {
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      // return data.places[0]; // You can return the data for further processing
      return data; // You can return the data for further processing
    } catch (error) {
      console.error("Error fetching data:", error);
      // alert("zip does not found")
      return []; // Return null or handle the error accordingly
    }
  }

  async function getStoresByDistance1(using, zip, lat, lng) {
    var apiUrl = ``;
    using === "code" ?
      apiUrl = `${url}/api/v1/stores/get-distant?zipcode=${zip}` :
      using === "latlng" ?
        apiUrl = `${url}/api/v1/stores/get-distant?latitude=${lat}&longitude=${lng}` :
        apiUrl = `${url}/api/v1/stores/get-distant`;

    try {
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      return data.data; // You can return the data for further processing
    } catch (error) {
      console.error("Error fetching data:", error);
      return null; // Return null or handle the error accordingly
    }
  }

  // shipping methods
  async function getShippingMethodss() {
    const apiUrl = `${url}/api/v1/shipping/get?stateCode=${info.locationData.stateCode}&zipCode=${info.locationData.zipCode}`;

    try {
      setShippingLoader(true)
      const response = await fetch(apiUrl);


      if (response.status === 404) {
        setIsDeliveryAllowed(true)
        setShowDeliveryMessage(true)
      } else {
        setIsDeliveryAllowed(false);
        setShowDeliveryMessage(false);
      }

      if (!response.ok) {
        setShippingLoader(false)
        throw new Error(`Error: ${response.status} - ${response.statusText}`);

      }

      const data = await response.json();

      if (data.status === 404) {
        setIsDeliveryAllowed(true)
        setShowDeliveryMessage(true)
      } else {
        setIsDeliveryAllowed(false);
        setShowDeliveryMessage(false);
      }


      setShippingLoader(false)
      return data; // You can return the data for further processing
    } catch (error) {
      console.error("Error fetching data:", error);
      setShippingLoader(false)
      return null; // Return null or handle the error accordingly
    }
  }

  


  async function getTotalTax() {
    const apiUrl = `${url}/api/v1/tax/get?stateCode=${info.locationData.stateCode}&zipCode=${info.locationData.zipCode}`;

    try {
      setTaxLoader(true)
      const response = await fetch(apiUrl);

      if (!response.ok) {
        setTaxLoader(false)
        throw new Error(`Error: ${response.status} - ${response.statusText}`);

      }

      const data = await response.json();
      setTaxLoader(false)
      return data; // You can return the data for further processing
    } catch (error) {
      console.error("Error fetching data:", error);
      setTaxLoader(false)
      return null; // Return null or handle the error accordingly
    }
  }

  const fetchAllstores = async (using, zip, lat, lng) => {

    var data = using === "code" ? await getStoresByDistance1("code", zip) : using === "latlng" ? await getStoresByDistance1("latlng", "", lat, lng) : await getStoresByDistance1();

    if (data) {
      // Sort the data based on the 'distance' attribute
      const sortedData = data.sort((a, b) => {
        // Extract numeric part from distance string (e.g., '10 km' -> 10)
        const distanceA = parseFloat(a.distance);
        const distanceB = parseFloat(b.distance);

        return distanceA - distanceB; // Sort in ascending order (shortest distance first)
      });


      setStores(sortedData); // Set the sorted data to the state
    }
  };

  const setAllShippingMethods = async () => {
    const data = await getShippingMethodss();
    setShippingMethods(data?.shippingZones[0]);
  };

  const setTaxValues = async () => {
    const data = await getTotalTax();
    setTotalTax(data?.tax[0]);
  };


  function calculateTotalTax(subtotal, taxRate) {
    if (isNaN(subtotal) || isNaN(taxRate) || subtotal < 0 || taxRate < 0) {
      throw new Error("Invalid input: subtotal and taxRate must be non-negative numbers.");
    }
    const taxAmount = (subtotal * taxRate) / 100;
    return taxAmount;
  }

  // const [selectedOption, setSelectedOption] = useState(null);

  const [selectedOption, setSelectedOption] = useState(() => {
    if (typeof window !== "undefined") {
      const savedOption = localStorage.getItem("selected_shipping_option");
      try {
        return savedOption ? JSON.parse(savedOption) : null;
      } catch {
        return null;
      }
    }
    return null;
  });


  // const handleChange = (e, option) => {
  //   setSelectedOption(option);
  // };

  useEffect(() => {
    localStorage.setItem("selected_shipping_option", JSON.stringify(selectedOption));
    if (selectedOption?.id === 'METHOD-3') {
      handleCartAssemblyFalse()
    }
  }, [selectedOption])

  const handleChange = (e, option) => {
    setSelectedOption(option);
    localStorage.setItem("selected_shipping_option", JSON.stringify(option));
  };





  const [selectedShippingMethods, setSelectedShippingMethods] = useState(null);

  function getShippingMethods(subtotal, shippingMethods) {
    const savedOption = typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("selected_shipping_option"))
      : null;

    let selectedMethods = [];

    const method1 = shippingMethods.find((method) => method.id === "METHOD-1");
    if (method1 && subtotal >= method1.min_cost) {
      selectedMethods.push(method1);
      const method3 = shippingMethods.find((method) => method.id === "METHOD-3");
      if (method3 && method3.cost === 0) {
        selectedMethods.push(method3);
      }

      // Reapply stored option if it's in selectedMethods
      const stored = selectedMethods.find(opt => opt.id === savedOption?.id);
      setSelectedOption(stored || method1);
      setSelectedShippingMethods(selectedMethods);
      return;
    }

    const method2 = shippingMethods.find((method) => method.id === "METHOD-2");
    if (method2) {
      selectedMethods.push({ ...method2, cost: subtotal >= method2.min_cost ? method2.cost : 0 });
    }

    const method3 = shippingMethods.find((method) => method.id === "METHOD-3");
    if (method3 && method3.cost === 0) {
      selectedMethods.push({ ...method3, cost: 0 });
    }

    // Apply stored option if found
    const stored = selectedMethods.find(opt => opt.id === savedOption?.id);
    setSelectedOption(stored || selectedMethods[0]);
    setSelectedShippingMethods(selectedMethods);
  }


  // function getShippingMethods(subtotal, shippingMethods) {
  //   setSelectedOption({});

  //   const savedOption = typeof window !== "undefined"
  //   ? JSON.parse(localStorage.getItem("selected_shipping_option"))
  //   : null;


  //   let selectedMethods = [];

  //   // Case 1: METHOD-1 (Free Shipping)
  //   const method1 = shippingMethods.find((method) => method.id === "METHOD-1");
  //   if (method1 && subtotal >= method1.min_cost) {
  //     selectedMethods.push(method1);

  //     const method3 = shippingMethods.find((method) => method.id === "METHOD-3");
  //     if (method3 && method3.cost === 0) {
  //       selectedMethods.push(method3);
  //     }
  //     setSelectedOption(method1);
  //     setSelectedShippingMethods(selectedMethods)
  //     return;

  //   }

  //   // Case 2: METHOD-2 (Flat Rate Shipping)
  //   const method2 = shippingMethods.find((method) => method.id === "METHOD-2");
  //   if (method2) {
  //     selectedMethods.push({ ...method2, cost: subtotal >= method2.min_cost ? method2.cost : 0 });
  //   }

  //   // Case 3: METHOD-3 (Local Pickup)
  //   const method3 = shippingMethods.find((method) => method.id === "METHOD-3");
  //   if (method3 && method3.cost === 0) {
  //     selectedMethods.push({ ...method3, cost: 0 });
  //   }

  //   // Handle default selection logic
  //   if (selectedMethods?.length === 2) {
  //     const defaultMethod = selectedMethods.find((method) => method.id === "METHOD-1") || method3;
  //     setSelectedOption(defaultMethod); // Set METHOD-2 by default, or METHOD-3 if METHOD-2 is unavailable
  //   } else if (selectedMethods?.length > 0) {
  //     setSelectedOption(selectedMethods[0]); // Default to the first available method
  //   }
  //   setSelectedShippingMethods(selectedMethods);
  // }

  useEffect(() => {
    setAllShippingMethods();
    setTaxValues();
    setSelectedOption(null)
  }, [info])


  useEffect(() => { setAllShippingMethods() }, [])

  function extractZipCode(input) {
    return input.replace(/\D/g, '');
  }

  const [wrongZip, setWrongZip] = useState(false);
  const [wrongZipMessage, setWrongZipMessage] = useState({ title: '', message: '' })
  const [zipLoading, setZipLoading] = useState(false);

  const [showWhiteGlove, setShowWhiteGlove] = useState(false);
  const [whiteGloveValue, setWhiteGloveValue] = useState({
    title: "White Glove",
    message: "Full-service delivery to your room of choice, unpacking, assembly and trash removal. Our most popular option!"
  })

  const [showFAssembly, setShowFAssembly] = useState(false);
  const [fAssemblyValue, setFAssemblyValue] = useState({
    title: "Furniture Assembly",
    message: "In Furniture Assembly, Please note we do not set-up bunkbeds, TV stands, and fireplaces."
  })

  const handleButtonClick = async () => {
    let data;
    setZipLoading(true)
    if (extractZipCode(zipCode).length === 5) {
      data = await getStateByPostalCode(extractZipCode(zipCode));
    } else {
      setWrongZip(true);
      setWrongZipMessage({
        title: 'Invalid Zip Code',
        message: 'We couldn’t find that ZIP code. Please check and try again.'
      })
      setZipLoading(false)
    }
    if (Object.keys(data).length > 1) {
      setZipLoading(false);
      // if (data) {
      updateLocationData({
        zipCode: extractZipCode(zipCode),
        // zipCode: data?.["post code"],
        stateCode: data?.places[0]?.['state abbreviation'],
        city: data?.places[0]?.['place name'],
        state: data?.places[0]?.['state'],
        country: 'US',
        longitude: data?.places[0]?.['longitude'],
        latitude: data?.places[0]?.['latitude'],
      })
      // }
    } else {
      const prevZip = JSON.parse(localStorage.getItem('other_info'))

      setZipCode(prevZip?.locationData?.zipCode)
      setWrongZip(true);
      // setZipCode()
      setWrongZipMessage({
        title: 'Invalid Zip Code',
        message: 'We couldn’t find that ZIP code. Please check and try again.'
      })

      setZipLoading(false)
    }
  };

  const handleZipWarningClose = () => {
    setWrongZip(false)
  }

  function getShippingInfo(option) {
    let result = "";
    let taxIncluded = "";
    let cost = option?.cost || 0; // Default to 0 if cost is not defined

    if (option?.id === "METHOD-2") {
      result = option.cost ? `${option.cost} (Standard Shipping)` : "Standard Shipping";
      taxIncluded = option.tax !== 0 ? "Tax Included" : "No Tax";
    } else if (option?.id === "METHOD-1") {
      result = "Free Shipping";
      taxIncluded = "No Tax";
      cost = 0;
    } else if (option?.id === "METHOD-3") {
      result = "Local Pickup";
      taxIncluded = "No Tax";
      cost = option?.cost || 0; // Local pickup might still have a cost
    } else {
      result = "Identifying";
      taxIncluded = "";
    }

    return { result, taxIncluded, cost };
  }

  const [grandTotal, setGrandTotal] = useState(0);

  // function CalculateGrandTotal() {
  //   const subTotal1 = parseFloat(subTotal || 0); // Ensure subTotal is parsed as a number
  //   const taxValue = parseFloat(totalTax?.tax_value || 0); // Ensure tax_value is parsed as a number
  //   const deliveySetup = (selectedOption?.id !== "METHOD-3" && !isProfessionalAssembly ) ? furnitureAssemblyValue : 0;
  //   return subTotal + calculateTotalTax((subTotal1+deliveySetup), taxValue) + getShippingInfo(selectedOption)?.cost  + deliveySetup;
  // }

  function CalculateGrandTotal() {
    const subTotal1 = parseFloat(subTotal) || 0; // safe number
    const taxValue = parseFloat(totalTax?.tax_value) || 0; // safe number
    const deliverySetup =
      (selectedOption?.id !== "METHOD-3" && !isProfessionalAssembly)
        ? parseFloat(furnitureAssemblyValue) || 0
        : 0;

     const shippingCost = parseFloat(getShippingInfo(selectedOption)?.cost) || 0;
    console.log(shippingCost)
    return (
      subTotal1 +
      calculateTotalTax(subTotal1 + deliverySetup + shippingCost, taxValue) +
      shippingCost +
      deliverySetup
    );
  }



  return (
    <GlobalContext.Provider value={{
      info,
      setInfo,
      updateLocationData,
      zipCode,
      setZipCode,
      handleInputChange,
      handleButtonClick,
      fetchAllstores,
      stores,
      setStores,
      setAllShippingMethods,
      shippingMethods,
      setShippingMethods,
      shippingLoader,
      setShippingLoader,
      totalTax,
      calculateTotalTax,
      getShippingInfo,
      setTaxValues,
      selectedOption,
      setSelectedOption,
      handleChange,
      getShippingMethods,
      selectedShippingMethods,
      setSelectedShippingMethods,
      grandTotal,
      CalculateGrandTotal,
      mainLoader, setMainLoader,
      isWarrantyModalOpen,
      setWarrantyModalState,
      wrongZip,
      setWrongZip,
      wrongZipMessage,
      handleZipWarningClose,
      zipLoading,
      showWhiteGlove,
      setShowWhiteGlove,
      whiteGloveValue,
      setWhiteGloveValue,
      showFAssembly,
      setShowFAssembly,
      fAssemblyValue,
      setFAssemblyValue,
      isDeliveryAllowed,
      setIsDeliveryAllowed,
      showDeliveryMessage,
      setShowDeliveryMessage,
      searchLocation,
      setSearchLocation,
    }}>
      {children}
    </GlobalContext.Provider>
  );
}

export const useGlobalContext = () => useContext(GlobalContext);