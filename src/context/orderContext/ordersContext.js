'use client'

import { createContext, useContext, useEffect, useState } from "react";
import { formatPhoneNumber, siteUrl, url } from "../../utils/api";
import axios from "axios";
import { useCart } from "../cartContext/cartContext";
import { useGlobalContext } from "../GlobalContext/globalContext";
import { openLink } from "../../utils/api";

const MyOrderContext = createContext();

export const MyOrdersProvider = ({ children }) => {

    const [activePaymentMethods, setActivePaymentMethods] = useState([]);
    const [loader, setLoader] = useState(false);
    const { cartProducts, subTotal } = useCart();
    const { info, totalTax, calculateTotalTax, getShippingInfo, selectedOption, setZipCode, handleButtonClick } = useGlobalContext();
    const [showThankyou, setThankyouState] = useState(false);
    const [emptyField, setEmptyField] = useState({});
    const [loading, setLoading] = useState(true); // Loading state
    const [selectedTab, setSelectedTab] = useState(0)
    const [isLoader, setIsLoader] = useState(false)
    const [showWarning, setShowWarning] = useState(false);
    const [warningMessage, setWarningMessage] = useState('');

    const [orderPlacedInfo, setOrderPlacedInfo] = useState({
        orderNumber: 0,
        billing: {
            first_name: "",
            last_name: "",
            address_1: "",
            address_2: "",
            city: "",
            state: "",
            postal_code: "",
            country: "USA",
            email: "",
            phone: "",
        },
    })

    const [creditCardData, setCreditCardData] = useState({
        card_holder_name: '',
        card_number: '',
        expiry_date: '',
        sec_code: '',
        card_type: ''
    })

    const [orderPayload, setOrderPayload] = useState({
        status: 'pending',
        currency: "USD",
        billing: {
            first_name: "",
            last_name: "",
            address_1: "",
            address_2: "",
            city: "",
            state: "",
            postal_code: "",
            country: "USA",
            email: "",
            phone: "",
            alt_phone: ""
        },
        shipToDiffAdd: false,
        shipping: {
            first_name: "",
            last_name: "",
            address_1: "",
            address_2: "",
            city: "",
            state: "",
            postal_code: "",
            country: "USA",
            email: "",
            phone: "",
            alt_phone: ""
        },
        card_info: {
            card_holder_name: '',
            card_number: '',
            expiry_month: '',
            expiry_year: '',
            sec_number: ''
        },
        tax_lines: {
            id: "",
            name: "",
            tax_rate: ""
        },
        shipping_lines: {
            id: "",
            method_id: "",
            tax: "",
            cost: "",
        },
        items: [],
        discount: 0,
        tax: 5,
        payment_method: '',
        cart_protected: cartProducts?.is_all_protected,
        is_shipping: 1,
        shipping_cost: 10,
        email_blast: true,
        professional_assembled: cartProducts?.is_professional_assembly
    })

    const [errorDetails, setErrorDetails] = useState({
        title: '',
        message: '',
        status: ''
    })


    const [acimaDetails, setAcimaDetails] = useState({
        first_name: '',
        last_name: '',
        address_1: '',
        address_2: "",
        city: '',
        state: '',
        postal_code: '',
        country: 'US',
        email: '',
        phone: '',
        alt_phone: '',
        address2: '',
        monthly_net: ''
    })

    const [acimaErrors, setAcimaErrors] = useState({
        first_name: '',
        last_name: '',
        address_1: '',
        address_2: "",
        city: '',
        state: '',
        postal_code: '',
        country: '',
        email: '',
        phone: '',
        alt_phone: '',
        address2: '',
        monthly_net: ''
    })

    const getBillingData = async (userId, authToken) => {
        try {
            if (!authToken) {
                throw new Error("Authorization token missing");
            }

            const response = await axios.get(
                `${url}/api/v1/web-users/get/${userId}`,
                {
                    headers: {
                        authorization: `${authToken}`,
                    }
                }
            );
            if (response.status === 200) {

                setOrderPayload((prev) => ({
                    ...prev,
                    billing: {
                        ...prev.billing,
                        first_name: response.data.data.billing_address.first_name,
                        last_name: response.data.data.billing_address.last_name,
                        address_1: response.data.data.billing_address.address_1,
                        address_2: response?.data?.data?.billing_address?.address_2,
                        email: response.data.data.email,
                        phone: response.data.data.billing_address.phone,
                        alt_phone: response.data.data.billing_address.alt_phone
                    }
                }))
                // setTrigerApi(false)
            } else {
                console.error("Error fetching billing address data");
            }


        } catch (error) {
            console.error("Error fetching billing address:", error.message);
            throw error;
        }
    }

    async function fetchActivePaymentMethods() {
        const apiUrl = `${url}/api/v1/payment-methods/get`;

        try {
            setLoader(true)
            const response = await fetch(apiUrl);

            if (!response.ok) {
                setLoader(false)
                throw new Error(`Error: ${response.status} - ${response.statusText}`);

            }

            const data = await response.json();
            setLoader(false)
            return data; // You can return the data for further processing
        } catch (error) {
            console.error("Error fetching data:", error);
            setLoader(false)
            return null; // Return null or handle the error accordingly
        }
    }

    const getActivePaymentMethods = async () => {
        const data = await fetchActivePaymentMethods();
        setActivePaymentMethods(data?.activePaymentMethods);
    };

    const handleNestedValueChange = (e) => {
        const { name, value } = e.target;

        setOrderPayload((prevOrders) => ({
            ...prevOrders,
            billing: {
                ...prevOrders.billing,
                [name]: name === 'phone' ? formatPhoneNumber(value) : name === 'alt_phone' ? formatPhoneNumber(value) : value,
            },
        }));
        setEmptyField((prev) => ({ ...prev, [name]: "" }));

    };



    const handleZipCode = async (zipCode) => {

        try {
            setLoading(true);
            const response = await fetch(`https://zip.getziptastic.com/v2/US/${zipCode}`);
            if (response.ok) {
                const result = await response.json();
                setOrderPayload(prevData => ({
                    ...prevData,
                    shipping: {
                        ...prevData.shipping,
                        city: result.city,
                        state: result.state
                    }

                }));
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error('Error fetching ZIP code data:', error);
        }
    };

    const updateZipCode = (zipCode) => {
        // Update order payload

        setOrderPayload(prevData => ({
            ...prevData,
            shipping: {
                ...prevData.shipping,
                postal_code: zipCode
            }
        }));

        // Call API if it's exactly 5 digits
        if (zipCode?.length === 5 && /^\d{5}$/.test(zipCode)) {
            handleZipCode(zipCode);
        }
    };

    const handleZipCodeChange = (e) => {
        const zipCode = e.target.value;

        updateZipCode(zipCode);
        if (zipCode.length === 5) {
            setZipCode(zipCode)
            handleButtonClick()
        }
    };

    const handleNestedValueChangeShipping = (e) => {
        const { name, value } = e.target;

        const formattedValue =
            name === "phone" || name === "alt_phone"
                ? formatPhoneNumber(value)
                : value;

        setOrderPayload((prev) => ({
            ...prev,
            shipping: {
                ...prev.shipping,
                [name]: formattedValue,
            },

            // ✅ ALWAYS sync ONLY these fields
            billing: ["first_name", "last_name", "email", "phone", "alt_phone"].includes(name)
                ? {
                    ...prev.billing,
                    [name]: formattedValue,
                }
                : prev.billing,
        }));

        setEmptyField((prev) => ({ ...prev, [name]: "" }));
    };

    const handleNestedShippingBool = () => {
        setOrderPayload((prevOrders) => ({
            ...prevOrders,
            shipToDiffAdd: !prevOrders.shipToDiffAdd,
        }));
    };

    const addProducts = (products) => {
        setOrderPayload((prevOrder) => ({
            ...prevOrder,
            items: [
                ...(Array.isArray(products) ? products : [products]) // Ensure single product is handled like an array
                    .map((product) => ({
                        name: product.name,
                        product_id: product.product_uid,
                        variation_uid: product.variation_uid,
                        quantity: product.quantity,
                        sku: product.sku,
                        is_protected: product.is_protected,
                        image: product?.image?.image_url
                    }))
            ]
        }));
    }

    const handleValueChange = (e) => {
        const { name, value } = e.target;
        setOrderPayload((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleClickTop = () => {
        if (typeof window !== 'undefined') {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            })
        }
    }

    const handleTabOpen = (tabId, scrollTop) => {
        setSelectedTab(tabId);

        if (scrollTop) {
            scrollTop();
        }
    }

    const [error, setError] = useState({
        card_holder_name: '',
        card_number: '',
        expiry_date: '',
        sec_code: '',
    })


    const sendProducts = async () => {

        // Basic validation for credit card fields
        const missingFields = {};
        if (!creditCardData.card_holder_name.trim()) missingFields.card_holder_name = 'Card holder name is required';
        if (!creditCardData.card_number.trim()) missingFields.card_number = 'Card number is required';
        if (!creditCardData.expiry_date.trim()) missingFields.expiry_date = 'Expiry date is required';
        if (!creditCardData.sec_code.trim()) missingFields.sec_code = 'CVV is required';

        // If there are any errors, set them and stop execution
        if (Object.keys(missingFields).length > 0) {
            setError(missingFields);
            // setShowWarning(true);
            return;
        }

        try {
            setIsLoader(true);
            const updatedPayload = {
                ...orderPayload,
                items: cartProducts.products.map((product) => ({
                    name: product.name,
                    product_id: product.product_uid,
                    variation_uid: product.variation_uid,
                    quantity: product.quantity,
                    sku: product.sku,
                    is_protected: product.is_protected,
                    image: product?.image?.image_url,
                    attributes: product?.attributes
                })),
                professional_assembled: cartProducts?.is_professional_assembly,
                shipping_handling: 1,
                cart_protected: cartProducts?.is_all_protected,
                tax: calculateTotalTax(subTotal, parseFloat(totalTax?.tax_value)),
                shipping_cost: getShippingInfo(selectedOption)?.cost,
                tax_lines: {
                    id: totalTax?._id || "",
                    name: totalTax?.tax_name || "",
                    tax_rate: totalTax?.tax_value || "0",
                    description: totalTax?.tax_description || "",
                    updatedAt: totalTax?.updatedAt || "",
                },
                shipping_lines: {
                    id: selectedOption?._id || "",
                    method_id: selectedOption?.id || "",
                    tax: selectedOption?.tax || "0",
                    cost: selectedOption?.cost || "0"
                },
                customer_id: localStorage?.getItem('uuid')
            };

            const api = `/api/v1/orders/add`;
            const response = await axios.post(`${url}${api}`, updatedPayload);

            if (response.status === 201) {
                localStorage.removeItem('cart2')

                setOrderPlacedInfo((prev) => ({
                    ...prev,
                    orderNumber: response.data.order.uid || "",
                    billing: {
                        ...prev.billing,
                        ...response.data.order.billing,
                    },
                }));

                openLink(`${siteUrl}/order-confirmation/${response.data.order._id}`)
            }

        } catch (error) {
            let errorMessage
            errorMessage = error.response.data.message.split('.')
            setErrorDetails({
                title: error.response.data.title,
                message: errorMessage,
                status: error.response.data.status
            })
            setWarningMessage(errorMessage[0])
            setShowWarning(true);
        } finally {
            setIsLoader(false);
        }
    };

    const handlePaymentInfo = () => {
        // Split the expiry_date to get month and year
        const [expiry_month, expiry_year] = creditCardData.expiry_date.split("/");

        // Update the orderPayload with the values from creditCardData
        setOrderPayload((prevPayload) => ({
            ...prevPayload,
            card_info: {
                ...prevPayload.payment_info,
                card_holder_name: creditCardData.card_holder_name,
                card_number: creditCardData.card_number,
                expiry_month: expiry_month || '',  // Set month, default to empty string if not present
                expiry_year: expiry_year || '',    // Set year, default to empty string if not present
                sec_number: creditCardData.sec_code,
            }
        }));
    }

    useEffect(() => {
        const initialZip = info?.locationData?.zipCode;
        if (initialZip) {
            updateZipCode(initialZip);
        }
    }, [info]);

    useEffect(() => {
        addProducts(cartProducts.products)
    }, [cartProducts])

    useEffect(() => {
        handlePaymentInfo();
    }, [creditCardData])

    useEffect(() => {
        const userId = localStorage.getItem('uuid')
        const authToken = localStorage.getItem('userToken')
        if (authToken) {
            getBillingData(userId, authToken)
        }
    }, [])

    useEffect(() => {
        if (selectedOption) {
            setOrderPayload((prev) => ({
                ...prev,
                shipping_lines: {
                    id: "",
                    method_id: selectedOption?.id,
                    tax: selectedOption?.tax,
                    cost: selectedOption?.cost,
                }
            }))
        }
    }, [selectedOption])

    useEffect(() => {
        const storeOrders = localStorage.getItem('myOrders');
        if (storeOrders) {
            try {
                setOrderPayload(JSON.parse(storeOrders));
            } catch (error) {
                console.error("Failed to parse myOrders from localStorage:", error);
            }
        }
        setLoading(false); // Set loading to false after processing
        getActivePaymentMethods();
    }, []);

    useEffect(() => {
        if (orderPayload) {
            localStorage.setItem('myOrders', JSON.stringify(orderPayload)); // Save as a JSON string
        }
    }, [orderPayload]);


    const handleShippingZipChange = async (e) => {
        const zipCode = e.target.value;

        // Update ZIP immediately
        setOrderPayload((prev) => ({
            ...prev,
            shipping: {
                ...prev.shipping,
                postal_code: zipCode,
            },
        }));

        // Call API only when 5 digits
        if (zipCode.length === 5 && /^\d{5}$/.test(zipCode)) {
            try {
                const response = await fetch(`https://zip.getziptastic.com/v2/US/${zipCode}`);

                if (response.ok) {
                    const result = await response.json();

                    setOrderPayload((prev) => ({
                        ...prev,
                        shipping: {
                            ...prev.shipping,
                            city: result.city || "",
                            state: result.state || "",
                        },
                    }));
                }
            } catch (error) {
                console.error("ZIP API Error:", error);
            }
        }
    };


    const handleBillingZipChange = async (e) => {
        const zipCode = e.target.value;

        // Update ZIP immediately
        setOrderPayload((prev) => ({
            ...prev,
            billing: {
                ...prev.billing,
                postal_code: zipCode,
            },
        }));

        // Call API only when 5 digits
        if (zipCode.length === 5 && /^\d{5}$/.test(zipCode)) {
            try {
                const response = await fetch(`https://zip.getziptastic.com/v2/US/${zipCode}`);

                if (response.ok) {
                    const result = await response.json();

                    setOrderPayload((prev) => ({
                        ...prev,
                        billing: {
                            ...prev.billing,
                            city: result.city || "",
                            state: result.state || "",
                        },
                    }));
                }
            } catch (error) {
                console.error("ZIP API Error:", error);
            }
        }
    };


    return (
        <MyOrderContext.Provider value={{
            orderPayload,
            setOrderPayload,
            handleNestedValueChange,
            handleNestedShippingBool,
            handleNestedValueChangeShipping,
            handleValueChange,
            loading,
            selectedTab,
            handleTabOpen,
            addProducts,
            sendProducts,
            isLoader,
            setIsLoader,
            handleClickTop,
            emptyField,
            setEmptyField,
            creditCardData,
            setCreditCardData,
            handlePaymentInfo,
            activePaymentMethods,
            showThankyou,
            setThankyouState,
            orderPlacedInfo,
            handleZipCode,
            handleZipCodeChange,
            getActivePaymentMethods,
            warningMessage,
            showWarning,
            setShowWarning,
            errorDetails,
            error,
            setError,
            acimaDetails,
            setAcimaDetails,
            acimaErrors,
            setAcimaErrors,
            handleBillingZipChange,
            handleShippingZipChange
        }}>
            {children}
        </MyOrderContext.Provider>
    )
}

export const useMyOrders = () => useContext(MyOrderContext)