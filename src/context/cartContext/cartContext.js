'use client'

import { createContext, useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { url } from "../../utils/api";
import { useGlobalContext } from "../GlobalContext/globalContext";

export const CartContext = createContext()

export const CartProvider = ({ children }) => {

    // const { selectedOption } = useGlobalContext()

    const [eachProtectionValue, setEachProtectionValue] = useState(149); // 99 was old single protection price
    const [eachProtectionValue2, setEachProtectionValue2] = useState(199); // 99 was old single protection price
    const [totalProtectionValue, setTotalProtectionValue] = useState(199);
    const [professionalAssemblyValue, setProfessionalAssemblyValue] = useState(199); // 199 was old all protection price
    const [furnitureAssemblyValue, setFurnitureAssemblyValue] = useState(50);
    const [shippingHandlingValue, setShippingHandlingValue] = useState(25);

    const [cartUid, setCartUid] = useState(() => {
        if (typeof window !== "undefined") {
            const cart_uid = localStorage.getItem('cartUid');
            return cart_uid ? cart_uid : null;
        }
        return null; // If on server, just return null
    });

    const [cartProducts, setCartProducts] = useState(() => {
        if (typeof window !== "undefined") {
            const savedCart = localStorage.getItem('cart2');
            return savedCart ? JSON.parse(savedCart) : { products: [], is_all_protected: 0, is_professional_assembly: 0 };
        }
        return []
    });

    const [isCartProtected, setIsCartProtected] = useState(() => {
        if (typeof window !== "undefined") {
            const savedCart = localStorage.getItem('cart2');
            const savedIsAllProtected = savedCart ? JSON.parse(savedCart).is_all_protected : 0;
            return savedIsAllProtected === 1;
        }
        return null
    });

    const [isProfessionalAssembly, setIsProfessionalAssembly] = useState(() => {
        if (typeof window !== "undefined") {
            const savedCart = localStorage.getItem('cart2');
            const savedIsProfessionalAssembly = savedCart ? JSON.parse(savedCart).is_professional_assembly : 0;
            return savedIsProfessionalAssembly === 1; // If saved value is 1, set true; otherwise, false
        }
        return null
    });

    useEffect(() => {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            setCart(JSON.parse(storedCart));
        }
        const storedCart2 = localStorage.getItem('cart2');
        if (storedCart2) {
            setCartProducts(JSON.parse(storedCart2));
        }
        const cart_uid = localStorage.getItem('cartUid');
        if (cart_uid) {
            setCartUid(cart_uid);
        }
    }, []);

    const [isCartLoading, setIsCartLoading] = useState(false);
    const [isCardAddLoading, setISCardAddLoading] = useState(false);
    const [cartSection, setCartSection] = useState(false);

    // initialize cart from local storage
    const [subTotal0, setSubTotal0] = useState(0);
    const [subTotal, setSubTotal] = useState(0);
    const [savings, setSavings] = useState(0);

    const [deliveryCharges, setDeliveryCharges] = useState(50)
    const [taxValue, setTaxValue] = useState(0);
    const [grandValue, setGrandValue] = useState(0);

    const [cart, setCart] = useState(() => {
        if (typeof window !== "undefined") {
            const savedCart = localStorage.getItem('cart');
            return savedCart ? JSON.parse(savedCart) : [];
        }
    })

    // save cart to local storage when eer it changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart])
    // save cart to local storage when eer it changes
    useEffect(() => {
        localStorage.setItem('cart2', JSON.stringify(cartProducts));
    }, [cartProducts])

    useEffect(() => {
        localStorage.setItem('cartUid', cartUid);
    }, [cartUid])

    const resetCart = () => {
        setCartProducts({ products: [], is_all_protected: 0, is_professional_assembly: 0 }); // Clear the cart state
        localStorage.removeItem("cart2"); // Remove cart from localStorage
    };

    // const resetCart0 = () => {
    //     setCartProducts([]); // Clear the cart state
    //     localStorage.removeItem("cart2"); // Remove cart from localStorage
    // };

    const [singleProduct, setSingleProduct] = useState(() => {
        if (typeof window !== "undefined") {
            const savedSingleProduct = localStorage.getItem('singleProduct');
            return savedSingleProduct ? JSON.parse(savedSingleProduct) : []
        }
        return null
    });

    useEffect(() => {
        const storedSingleProduct = localStorage.getItem('singleProduct');
        if (storedSingleProduct) {
            setSingleProduct(JSON.parse(storedSingleProduct));
        }
    }, [])

    useEffect(() => {
        localStorage.setItem('singleProduct', JSON.stringify(singleProduct));
    }, [singleProduct])

    const updateCartDB = async (updatedCart) => {
        try {

            const cartUid = localStorage.getItem('cartUid');

            // Check if cartUid is truly undefined or null
            const isCartUidInvalid = !cartUid || cartUid === "undefined" || cartUid === "null";

            const method = isCartUidInvalid ? "post" : "put";

            // Ensure state update reflects before API call
            const isUserAnonymous = (localStorage.getItem('uuid') && localStorage.getItem('userToken')) ? false : true;
            const uuid = localStorage.getItem('uuid');
            const custToken = localStorage.getItem('userToken');
            await new Promise((resolve) => setTimeout(resolve, 0));

            // Send updated cart to API
            let response;

            if (method === "post") {
                response = isUserAnonymous ? await axios.post(
                    `${url}/api/v1/unused-cart/add`,
                    { cart: updatedCart }
                ) : await axios.post(
                    `${url}/api/v1/customer/unused-cart/add`,
                    { cart: updatedCart, userId: uuid },
                    { headers: { authorization: `${custToken}`, "Content-Type": "application/json" } }
                );
                method === "post" && setCartUid(response?.data?.data?._id);
            } else if (method === "put") {
                response = isUserAnonymous ? await axios.put(
                    `${url}/api/v1/unused-cart/edit/${cartUid}`,
                    { cart: updatedCart }
                ) : await axios.put(
                    `${url}/api/v1/customer/unused-cart/edit/${cartUid}`,
                    { cart: updatedCart, userId: uuid },
                    { headers: { authorization: `${custToken}`, "Content-Type": "application/json" } }
                );
            } else {

            }

            setIsCartLoading(false);
            return response.data;
        } catch (error) {
            console.error("Error updating cart:", error);
            setIsCartLoading(false);
            throw error;
        }
    };

    const addSingleProduct = (product) => {
        setSingleProduct((prevState) => ({
            ...product,
            quantity: prevState.quantity || 1,
            is_protected: 0
        }))
    }

    const handleCartProtected = async () => {
        setIsCartLoading(true);
        try {
            // Toggle `isCartProtected`
            setIsCartProtected((prev) => !prev);

            // Compute updated cart state
            let newCart;
            setCartProducts((prevCart) => {
                newCart = {
                    ...prevCart,
                    is_all_protected: prevCart.is_all_protected === 0 ? 1 : 0, // Toggle between 0 and 1
                };
                return newCart;
            });

            // Ensure state is updated
            await new Promise((resolve) => setTimeout(resolve, 0));

            // Pass the computed object to updateCartDB
            return await updateCartDB(newCart);
        } catch (error) {
            console.error("Error updating cart:", error);
            setIsCartLoading(false);
            throw error;
        }
    };

    useEffect(() => {
        if (cartProducts?.products?.length === 1 && isCartProtected) {
            setIsCartProtected(false);
            setCartProducts((prevCart) => ({
                ...prevCart,
                is_all_protected: 0, // reset protection in cart state too
            }));
        }
    }, [cartProducts?.products?.length, isCartProtected]);



    const handleCartAssembly = async () => {
        setIsCartLoading(true);
        try {
            // Toggle assembly state
            setIsProfessionalAssembly((prev) => !prev);

            // Compute updated cart state
            let newCart;
            setCartProducts((prevCart) => {
                newCart = {
                    ...prevCart,
                    is_professional_assembly: prevCart.is_professional_assembly === 0 ? 1 : 0 // Toggle between 0 and 1
                };
                return newCart;
            });

            // Ensure state is updated
            await new Promise((resolve) => setTimeout(resolve, 0));

            // Pass the computed object to updateCartDB
            return await updateCartDB(newCart);
        } catch (error) {
            console.error("Error updating cart:", error);
            setIsCartLoading(false);
            throw error;
        }
    };

    const handleCartAssemblyFalse = async () => {
        setIsCartLoading(true);
        try {
            // Toggle assembly state
            setIsProfessionalAssembly(false);

            // Compute updated cart state
            let newCart;
            setCartProducts((prevCart) => {
                newCart = {
                    ...prevCart,
                    is_professional_assembly: 0 // Toggle between 0 and 1
                };
                return newCart;
            });

            // Ensure state is updated
            await new Promise((resolve) => setTimeout(resolve, 0));

            // Pass the computed object to updateCartDB
            return await updateCartDB(newCart);
        } catch (error) {
            console.error("Error updating cart:", error);
            setIsCartLoading(false);
            throw error;
        }
    };

    // Add Items To Cart
    const addToCart = (product, LocalQuantity, isProtected) => {
        setCart((prevCart) => {
            const existingProduct = prevCart.find((item) => item.product.uid === product.uid);
            if (existingProduct) {
                return prevCart.map(item =>
                    item.product.uid === product.uid ? {
                        ...item.product,
                        product: {
                            ...item.product,
                            quantity: LocalQuantity,
                        }
                    } : item
                );

            } else {
                const newProduct = {
                    product: {
                        ...product,
                        quantity: LocalQuantity,
                        sub_total: parseFloat(product.regular_price) * (product.quantity || 1),
                        total_price: parseFloat(product.regular_price) * (product.quantity || 1)
                    }
                };
                return [...prevCart, newProduct]
            }
        })

    };

    const updateCartAPI = async (url, newCart, method) => {
        try {
            const response = method === "post" ? await axios.post(url, { cart: newCart }) : await axios.put(url, { cart: newCart });
            // setTimeout(() => {setCartSection(true)}, 500)
            setCartSection(true)

            setIsCartLoading(false);
            method === "post" && setCartUid(response?.data?.data?._id);
            // setTimeout(() => {setCartSection(true)}, 500)
            setCartSection(true);
            return response.data;
        } catch (error) {
            console.error("Error updating cart:", error);
            setIsCartLoading(false);
            throw error;
        }
    };

    const updateCartAPI2 = async (url0, newCart, method, custToken, userId) => {
        try {
            const response = method === "post" ?
                await axios.post(url0, { cart: newCart, userId: userId }, { headers: { authorization: `${custToken}`, "Content-Type": "application/json" } }) :
                await axios.put(url0, { cart: newCart, userId: userId }, { headers: { authorization: `${custToken}`, "Content-Type": "application/json" } });
            method === "post" && setCartUid(response?.data?.data?._id);
            // setTimeout(() => {setCartSection(true)}, 500)
            setCartSection(true);
            setIsCartLoading(false);
            return response.data;
        } catch (error) {
            console.error("Error updating cart:", error);
            setIsCartLoading(false);
            // setTimeout(() => {setCartSection(true)}, 500)
            setCartSection(true)
            throw error;
        }
    };

    const addToCart0 = async (product, variationData, isProtected, quantity) => {

        setIsCartLoading(true);

        const isSimple = product.type === "simple";
        const productUid = isSimple ? product.uid : variationData?.uid;

        const newCart = await new Promise((resolve) => {

            setCartProducts((prev) => {
                const updatedProducts = prev.products || [];
                const existingProduct = updatedProducts.find((item) =>
                    isSimple ? item.product_uid === productUid : item.variation_uid === productUid
                );

                const updatedCart = {
                    ...prev,
                    products: existingProduct
                        ? updatedProducts.map((item) =>
                            (isSimple ? item.product_uid : item.variation_uid) === productUid
                                ? { ...item, quantity: item.quantity + parseInt(quantity) }
                                : item
                        )
                        : [
                            ...updatedProducts,
                            {
                                product_uid: product?.uid,
                                _id: product?._id,
                                name: product?.name,
                                isVariable: isSimple ? 0 : 1,
                                variation_uid: isSimple ? 0 : variationData?.uid,
                                image: isSimple ? product?.image : variationData?.images?.[0],
                                attributes: isSimple ? product.attributes : variationData?.attributes,
                                sale_price: isSimple ? product.sale_price : variationData?.sale_price,
                                regular_price: isSimple ? product.regular_price : variationData?.regular_price,
                                quantity: parseInt(quantity),
                                sku: isSimple ? product.sku : variationData?.sku,
                                slug: product?.slug,
                                outSource: product?.outSource ? product.outSource : false,
                                is_protected: isProtected,
                            },
                        ],
                };

                resolve(updatedCart);
                return updatedCart;
            });
        });

        const cartUid = localStorage.getItem('cartUid');

        // Check if cartUid is truly undefined or null
        const isCartUidInvalid = !cartUid || cartUid === "undefined" || cartUid === "null";

        const apiUrl0 = isCartUidInvalid
            ? `${url}/api/v1/unused-cart/add`
            : `${url}/api/v1/unused-cart/edit/${cartUid}`;

        const apiUrl1 = isCartUidInvalid
            ? `${url}/api/v1/customer/unused-cart/add`
            : `${url}/api/v1/customer/unused-cart/edit/${cartUid}`;

        const method = isCartUidInvalid ? "post" : "put";

        const isUserAnonymous = !localStorage.getItem('uuid') || !localStorage.getItem('userToken');
        setTimeout(() => {
            setCartSection(true)
        }, 500)
        return isUserAnonymous ? updateCartAPI(apiUrl0, newCart, method) : updateCartAPI2(apiUrl1, newCart, method, localStorage.getItem('userToken'), localStorage.getItem('uuid'));
    };





    const addToCartListSimple = async (transformedList) => {
        setIsCartLoading(true);


        setCartProducts((prevCart) => {
            let updatedProducts = [...prevCart.products];

            transformedList.forEach((newProduct) => {
                const index = updatedProducts.findIndex(
                    (item) => item.product_uid === newProduct.product_uid
                );

                if (index !== -1) {
                    // Product exists, increase quantity
                    updatedProducts[index] = {
                        ...updatedProducts[index],
                        quantity: (updatedProducts[index].quantity || 1) + 1,
                    };
                } else {
                    // Product doesn't exist, add it
                    updatedProducts.push({ ...newProduct, quantity: 1 });
                }
            });

            return { ...prevCart, products: updatedProducts };
        });

        setIsCartLoading(false);
        // setTimeout(() => {setCartSection(true)}, 500)
        setCartSection(true);
        return { products: transformedList }; // Optionally return what was added
    };

    const addSingleProtection = async (uid, isVariable = false) => {
        setIsCartLoading(true);
        try {
            let updatedCart;
            setCartProducts((prevCart) => {
                updatedCart = {
                    ...prevCart,
                    products: prevCart.products.map((item) => {
                        if (isVariable) {
                            if (item.variation_uid === uid) {
                                return { ...item, is_protected: 1 }; // Set is_protected to 0 for variable product
                            }
                        } else {
                            if (item.product_uid === uid) {
                                return { ...item, is_protected: 1 }; // Set is_protected to 0 for simple product
                            }
                        }
                        return item; // Return the item unchanged if no match
                    }),
                }
                return updatedCart;
            });
            await new Promise((resolve) => setTimeout(resolve, 0));
            return await updateCartDB(updatedCart);
        } catch (error) {
            console.error("Error updating cart:", error);
            setIsCartLoading(false);
            throw error;
        }
    };

    const removeProtection = async (uid, isVariable = false) => {
        setIsCartLoading(true);
        try {
            let updatedCart;
            setCartProducts((prevCart) => {
                updatedCart = {
                    ...prevCart,
                    products: prevCart.products.map((item) => {
                        if (isVariable) {
                            if (item.variation_uid === uid) {
                                return { ...item, is_protected: 0 }; // Set is_protected to 0 for variable product
                            }
                        } else {
                            if (item.product_uid === uid) {
                                return { ...item, is_protected: 0 }; // Set is_protected to 0 for simple product
                            }
                        }
                        return item; // Return the item unchanged if no match
                    }),
                }
                return updatedCart;
            });
            await new Promise((resolve) => setTimeout(resolve, 0));
            return await updateCartDB(updatedCart);
        } catch (error) {
            console.error("Error updating cart:", error);
            setIsCartLoading(false);
            throw error;
        }
    };

    const removeFromCart = async (uid, isVariable = false) => {
        setIsCartLoading(true);
        try {
            let updatedCart;
            setCartProducts((prevCart) => {
                updatedCart = {
                    ...prevCart,
                    products: prevCart.products.filter((item) =>
                        isVariable
                            ? item.variation_uid !== uid // Remove by variation_uid for variable products
                            : item.product_uid !== uid   // Remove by product_uid for simple products
                    ),
                }
                return updatedCart;
            });
            await new Promise((resolve) => setTimeout(resolve, 0));
            return await updateCartDB(updatedCart);
        } catch (error) {
            console.error("Error updating cart:", error);
            setIsCartLoading(false);
            throw error;
        }
    };

    const increamentQuantity = async (uid, isVariable = false) => {
        setIsCartLoading(true);
        try {
            // Compute updated cart before setting state
            let updatedCart;
            setCartProducts((prevCart) => {
                updatedCart = {
                    ...prevCart,
                    products: prevCart.products.map((item) => {

                        // Check if it's a variable product and increment based on variation_uid
                        if (isVariable && item.variation_uid === uid) {
                            return {
                                ...item,
                                quantity: item.quantity + 1,
                                sub_total: (item.quantity + 1) * parseFloat(item.sale_price || item.regular_price || 0),
                                total_price: (item.quantity + 1) * parseFloat(item.sale_price || item.regular_price || 0),
                            };
                        }

                        // For simple products, increment based on product_uid
                        if (!isVariable && item.product_uid === uid) {
                            return {
                                ...item,
                                quantity: item.quantity + 1,
                                sub_total: (item.quantity + 1) * parseFloat(item.sale_price || item.regular_price || 0),
                                total_price: (item.quantity + 1) * parseFloat(item.sale_price || item.regular_price || 0),
                            };
                        }

                        // Return item unchanged if no match
                        return item;
                    })
                }
                return updatedCart;
            });
            await new Promise((resolve) => setTimeout(resolve, 0));
            return await updateCartDB(updatedCart);
        } catch (error) {
            console.error("Error updating cart:", error);
            setIsCartLoading(false);
            throw error;
        }
    };

    const decreamentQuantity = async (uid, isVariable = false) => {
        setIsCartLoading(true);
        try {
            // Compute updated cart before setting state
            let updatedCart;

            setCartProducts((prevCart) => {
                updatedCart = {
                    ...prevCart,
                    products: prevCart.products.map((item) => {
                        if (
                            (isVariable && item.variation_uid === uid && item.quantity <= 1) ||
                            (!isVariable && item.product_uid === uid && item.quantity <= 1)
                        ) {
                            return item;
                        }

                        if (isVariable && item.variation_uid === uid) {
                            return { ...item, quantity: item.quantity - 1 };
                        }
                        if (!isVariable && item.product_uid === uid) {
                            return { ...item, quantity: item.quantity - 1 };
                        }
                        return item;
                    }),
                };

                return updatedCart;
            });

            await new Promise((resolve) => setTimeout(resolve, 0));
            return await updateCartDB(updatedCart);
        } catch (error) {
            console.error("Error updating cart:", error);
            setIsCartLoading(false);
            throw error;
        }
    };

    // const calculateTotalPrice = () => {
    //     if (!Array.isArray(cartProducts.products)) {
    //         console.error("Invalid Array", cartProducts);
    //         return { total: 0, savings: 0 };
    //     }

    //     let total = 0;
    //     let savings = 0;

    //     cartProducts.products.forEach(item => {
    //         const regularPrice = parseFloat(item.regular_price) || 0;
    //         const salePrice = item.sale_price !== "" ? parseFloat(item.sale_price) : regularPrice;
    //         const quantity = item.quantity || 1;
    //         const isProtectedValue = isCartProtected ? 0 : (item.is_protected === 0 ? 0 : item.quantity > 1 ? eachProtectionValue2 : eachProtectionValue);

    //         // Calculate total price
    //         total += (salePrice * quantity) + isProtectedValue;

    //         // Calculate savings
    //         savings += (regularPrice - salePrice) * quantity;
    //     });
    //     setSubTotal0(total);
    //     setSubTotal(total + (isCartProtected ? totalProtectionValue : 0) + (isProfessionalAssembly ? professionalAssemblyValue : 0));

    //     // Assuming you have a state or method to update the savings
    //     setSavings(savings);
    // };

    const calculateTotalPrice = () => {
        if (!Array.isArray(cartProducts.products)) {
            console.error("Invalid Array", cartProducts);
            return { total: 0, savings: 0 };
        }

        let total = 0;
        let savings = 0;

        cartProducts.products.forEach(item => {
            const regularPrice = parseFloat(item?.regular_price) || 0;
            const salePrice = (item?.sale_price && item.sale_price !== "")
                ? parseFloat(item.sale_price) || regularPrice
                : regularPrice;
            const quantity = parseInt(item?.quantity) || 1;

            // Clearer protection logic
            let isProtectedValue = 0;
            if (!isCartProtected && item?.is_protected !== 0) {
                isProtectedValue = quantity > 1 ? (eachProtectionValue2 || 0) : (eachProtectionValue || 0);
            }

            // Calculate total price
            total += (salePrice * quantity) + isProtectedValue;

            // Calculate savings (safe fallback)
            savings += ((regularPrice - salePrice) || 0) * quantity;
        });

        const extraProtection = isCartProtected ? (totalProtectionValue || 0) : 0;
        const extraAssembly = isProfessionalAssembly ? (professionalAssemblyValue || 0) : 0;

        setSubTotal0(total);
        setSubTotal(total + extraProtection + extraAssembly);

        setSavings(savings);
    };


    useEffect(() => {
        calculateTotalPrice();
    }, [cartProducts]);

    useEffect(() => {
        setIsCartProtected(false);
        setIsProfessionalAssembly(false);

        // also reset in cart state if needed
        setCartProducts((prev) => ({
            ...prev,
            is_all_protected: 0,
            is_professional_assembly: 0, // only if you're storing it
        }));
    }, []);

    return (
        <CartContext.Provider value={
            {
                cart,
                addToCart,
                removeFromCart,
                increamentQuantity,
                decreamentQuantity,
                calculateTotalPrice,
                addSingleProduct,
                subTotal,
                subTotal0,
                taxValue,
                deliveryCharges,
                grandValue,
                resetCart,
                addSingleProtection,
                removeProtection,
                isCartProtected,
                setIsCartProtected,
                isProfessionalAssembly,
                handleCartProtected,
                handleCartAssembly,
                handleCartAssemblyFalse,
                addToCart0,
                cartUid,
                setCartUid,
                cartProducts,
                eachProtectionValue,
                eachProtectionValue2,
                setEachProtectionValue,
                savings,
                setSavings,
                totalProtectionValue,
                setTotalProtectionValue,
                professionalAssemblyValue,
                setProfessionalAssemblyValue,
                furnitureAssemblyValue,
                setFurnitureAssemblyValue,
                shippingHandlingValue,
                setShippingHandlingValue,
                cartSection,
                setCartSection,
                isCartLoading, setIsCartLoading,
                isCardAddLoading, setISCardAddLoading,
                addToCartListSimple,
            }
        }>
            {children}
        </CartContext.Provider>
    )

}

export const useCart = () => useContext(CartContext);