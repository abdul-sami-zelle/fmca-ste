import React, { useState, useEffect } from 'react';
import './SizeVariant.css';
import { url } from '../../../utils/api';
import { useProductPage } from '../../../context/ProductPageContext/productPageContext';

const SizeVariant = ({
    productType,
    attributes,
    productData,
    product,
    handleSelectColor,
    handleSelectVariation,
    handleSelectedVariationData,
}) => {

    const { selectedVariationData, setSelectedVariationData } = useProductPage();
    // const [colorVariation, setColorVariation] = useState();
    const [imageVariation, setImageVariation] = useState(0);
    const [selectedImageName, setSelectedImageName] = useState();
    const [selectedColorName, setSelectedColorName] = useState();
    const [selectedSelectAttrs, setSelectedSelectAttrs] = useState({}); // For multiple select attributes




    // Handle Image Selection


    useEffect(() => {
        // if (!productData || attributes.length === 0) return;

        let defaultSelections = {};

        if (productType === 'simple') {
            attributes.forEach(attr => {
                defaultSelections[attr.name] = attr.options?.[0]?.value;
            });

            setSelectedSelectAttrs(defaultSelections);
            const defaultVariation = productData[0];

            // if (defaultVariation?.uid !== selectedVariationData?.uid) {
            //     setSelectedVariationData(defaultVariation);
            //     handleSelectedVariationData(defaultVariation.uid);
            // }
            if (defaultVariation) {
                setSelectedVariationData(defaultVariation);
                handleSelectedVariationData(defaultVariation.uid);
            }
        } else {
            // const initialVariation = selectedVariationData || productData[0];
            const initialVariation = selectedVariationData || (Array.isArray(productData) && productData.length > 0 ? productData[0] : null);
            if (initialVariation) {
                initialVariation.attributes.forEach(attr => {
                    defaultSelections[attr.name] = attr.options?.[0]?.value;
                });

                setSelectedSelectAttrs(defaultSelections);

                if (initialVariation) {
                    setSelectedVariationData(initialVariation);
                    handleSelectedVariationData(initialVariation.uid);
                }
            }
        }

    }, [attributes, productData, productType]); 


    // useEffect(() => {
    //     if (!attributes || !productData || attributes.length === 0) return;

    //     let defaultSelections = {};
    //     let initialVariation;

    //     if (productType === 'simple') {
    //         // productData is an array
    //         attributes.forEach(attr => {
    //             defaultSelections[attr.name] = attr.options?.[0]?.value;
    //         });
    //         initialVariation = productData[0];
    //     } else {
    //         // productData.variations is an array
    //         initialVariation = selectedVariationData || productData?.variations?.[0] || productData[0];
    //         if (initialVariation?.attributes) {
    //             initialVariation.attributes.forEach(attr => {
    //                 defaultSelections[attr.name] = attr.options?.[0]?.value;
    //             });
    //         }
    //     }

    //     if (initialVariation) {
    //         setSelectedSelectAttrs(defaultSelections);
    //         setSelectedVariationData(initialVariation);
    //         handleSelectedVariationData(initialVariation.uid);
    //     }
    // }, [attributes, productData, productType]);



    // let defaultSelections = {};
    // useEffect(() => {
    //     if (attributes && attributes.length > 0 && productData?.length > 0) {
    //         let defaultSelections = {};
    //         if (productType === 'simple') {
    //             // Automatically select all variations for simple products
    //             attributes.forEach(attr => {
    //                 defaultSelections[attr.name] = attr.options?.[0]?.value;
    //             });
    //             setSelectedSelectAttrs(defaultSelections); // Set all attributes selected
    //             const defaultVariation = productData[0]; // Default to the first variation
    //             if (defaultVariation) {
    //                 handleSelectedVariationData(defaultVariation.uid); // Notify parent
    //                 setSelectedVariationData(defaultVariation); // Set the first variation
    //             }
    //         }
    //         else {
    //             let initialVariation = selectedVariationData;

    //             if (!initialVariation && productData?.length > 0) {
    //                 initialVariation = productData[0]; // Default to the first variation
    //             }

    //             if (initialVariation) {
    //                 // Initialize attributes from the default variation
    //                 initialVariation.attributes.forEach(attr => {
    //                     defaultSelections[attr.name] = attr.options?.[0]?.value;
    //                 });

    //                 setSelectedVariationData(initialVariation); // Set context
    //                 handleSelectedVariationData(initialVariation.uid); // Notify parent
    //             }
    //         }
    //         setSelectedSelectAttrs(defaultSelections); // Initialize selected attributes
    //     } else {
    //         if (productType === 'simple') {
    //             // Automatically select all variations for simple products
    //             attributes.forEach(attr => {
    //                 defaultSelections[attr.name] = attr.options?.[0]?.value;
    //             });
    //             setSelectedSelectAttrs(defaultSelections); // Set all attributes selected
    //             const defaultVariation = productData[0]; // Default to the first variation
    //             if (defaultVariation) {
    //                 handleSelectedVariationData(defaultVariation.uid); // Notify parent
    //                 setSelectedVariationData(defaultVariation); // Set the first variation
    //             }
    //         }
    //     }
    // }, [attributes, productData, productType]);


    const handleImageVariation = (attributeName, index, name, value) => {
        setImageVariation(index); // Update image variation
        setSelectedImageName(name); // Optionally store image name

        // Update selected attributes to include the selected image
        setSelectedSelectAttrs((prevState) => {
            const updatedAttrs = {
                ...prevState,
                [attributeName]: value, // Update selected value for the attribute
            };

            // Now try to find the matching variation with all selected attributes
            const matchedVariation = productData.find((variation) => {
                return variation.attributes.every((attr) => {
                    const selectedValue = updatedAttrs[attr.name];
                    // Ensure you're comparing the value correctly based on the attribute type
                    return selectedValue === attr.options?.[0]?.value;
                });
            });

            if (matchedVariation && matchedVariation.uid !== selectedVariationData?.uid) {
                setSelectedVariationData(matchedVariation);
                handleSelectedVariationData(matchedVariation.uid);
            }

            return updatedAttrs; // Update the selected attributes
        });
    };


    // Handle Color Selection
    const handleClickColor = (attributeName, value, name) => {
        setSelectedSelectAttrs((prevState) => {
            const updatedAttrs = {
                ...prevState,
                [attributeName]: value, // Update selected value for the attribute
            };

            // Now try to find the matching variation with all selected attributes
            const matchedVariation = productData.find((variation) => {
                return variation.attributes.every((attr) => {
                    const selectedValue = updatedAttrs[attr.name];
                    // Ensure you're comparing the value correctly based on the attribute type
                    return selectedValue === attr.options?.[0]?.value;
                });
            });

            if (matchedVariation && matchedVariation.uid !== selectedVariationData?.uid) {
                setSelectedVariationData(matchedVariation);
                handleSelectedVariationData(matchedVariation.uid);
            }

            return updatedAttrs; // Update the selected attributes
        });
        handleSelectColor(value); // Call the parent handler for color
        setSelectedColorName(name); // Update selected color name
    };

    // Handle Select Attribute Selection
    const handleSelectClick = (attributeName, value, name) => {
        
        setSelectedSelectAttrs((prevState) => {
            const updatedAttrs = {
                ...prevState,
                [attributeName]: value, // Update selected value for the attribute
            };


            // Now try to find the matching variation with all selected attributes
            const matchedVariation = productData.find((variation) => {
                return variation.attributes.every((attr) => {
                    const selectedValue = updatedAttrs[attr.name];
                    // Ensure you're comparing the value correctly based on the attribute type
                    return selectedValue === attr.options?.[0]?.value;
                });
            });

            if (matchedVariation && matchedVariation.uid !== selectedVariationData?.uid) {
                setSelectedVariationData(matchedVariation);
                handleSelectedVariationData(matchedVariation.uid);
            }

            return updatedAttrs; // Update the selected attributes
        });

        handleSelectVariation(value); // Pass the selected value to the parent if needed
    };






    return (
        <>
            {attributes?.map((attribute) => (
                <div className="attributes-types" key={attribute.name}>
                    {attribute.type === 'color' ? (

                        <div className="attribute-type">
                            <h3 className="attribute-heading">
                                {/* {selectedColorName ? selectedColorName : attribute.name} */}
                                {attribute.name}
                            </h3>
                            <div className="attribute-variations">
                                {attribute.options.map((option, index) => (
                                    <div className="attribute-single-color" key={index}>
                                        <div title={option.name}
                                            className={`attribute-color-variation-box ${selectedSelectAttrs[attribute.name] === option.value
                                                ? 'show-tick-mark selected'
                                                : ''
                                                }`}
                                            onClick={() => handleClickColor(attribute.name, option.value, option.name)}

                                            style={{
                                                backgroundColor: option.value,
                                                border: selectedSelectAttrs[attribute.name] === option.value ? `1px solid ${option.value}` : 'none',

                                                boxShadow: selectedSelectAttrs[attribute.name] === option.value ? `inset 0 0 0 2px #FFFF` : '',
                                                "--tick-color": option.value

                                            }}
                                        ></div>
                                    </div>
                                ))}

                            </div>
                        </div>

                    ) : attribute.type === 'image' ? (

                        <div className="attribute-type">
                            <h3 className="attribute-heading">{attribute.name}</h3>
                            <div className="attribute-variations">
                                {attribute.options.map((option, index) => (
                                    <div
                                        className={`attribute-image-type`}
                                        key={index}
                                        onClick={() => handleImageVariation(attribute.name, index, option.name, option.value)}
                                    >
                                        <div
                                            className={`variation-image-div ${imageVariation === index
                                                ? 'active-selected-image-variation'
                                                : ''
                                                }`}
                                        >
                                            <img src={product.outSource === true ? option.value : `${url}${option.value}`} alt={option.name} />
                                        </div>
                                        <p>{option.name}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                    ) : attribute.type === 'select' ? (

                        <div className="attribute-type">
                            <h3 className="attribute-heading">
                                {attribute.name}
                            </h3>
                            <div className="attribute-variations">
                                {attribute.options.map((option, index) => (
                                    <div
                                        key={index}
                                        className={`select-type-attribute ${selectedSelectAttrs[attribute.name] === option.value
                                            ? 'select-select-variation'
                                            : ''
                                            }`}
                                        onClick={() =>
                                            handleSelectClick(
                                                attribute.name,
                                                option.value,
                                                option.name
                                            )
                                        }
                                    >
                                        <p>{option.name}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                    ) : null}
                </div>
            ))}
        </>
    );
};

export default SizeVariant;
