import React, { useEffect, useState } from 'react'
import './DesignYourRoom.css'
import RecomProductCard from '../RecommendedProductCards/recomProdCard'
import QuickView from '../QuickView/QuickView'

const DesignYourRoom = ({ data, firstChild }) => {
    const [displayedProducts, setDisplayedProducts] = useState([]);
    const [remainingProducts, setRemainingProducts] = useState([]);

    const [quickViewProduct, setQuickViewProduct] = useState({});
    const [quickViewClicked, setQuickView] = useState(false);

    useEffect(() => {
        if (data && data.length > 0) {
            const initial = data.slice(0, 7);
            const remaining = data.slice(7);
            setDisplayedProducts([firstChild, ...initial]);
            setRemainingProducts(remaining);
        }
    }, [data]);

    const handleQuickViewOpen = (item) => {
        setQuickView(true);
        setQuickViewProduct(item);
    };

    const handleQuickViewClose = () => setQuickView(false);

    const handleShuffle = () => {
        const shuffled = [...data].sort(() => 0.5 - Math.random()).slice(0, 7);
        const newRemaining = data.filter(item => !shuffled.includes(item));
        setDisplayedProducts([firstChild, ...shuffled]);
        setRemainingProducts(newRemaining);
    };

    const handleRemoveProduct = (uid) => {
        setDisplayedProducts((prevDisplayed) => {
            const filtered = prevDisplayed.filter(item => item.uid !== uid);

            if (remainingProducts.length > 0) {
                const [nextProduct, ...rest] = remainingProducts;
                setRemainingProducts(rest);
                return [...filtered, nextProduct]; // replace the removed one
            }

            return filtered;
        });
    };

    const handleSingleShuffle = (uid) => {
        setDisplayedProducts((prevDisplayed) => {
            const index = prevDisplayed.findIndex((item) => item.uid === uid);
            if (index === -1 || remainingProducts.length === 0) return prevDisplayed;

            const [newProduct, ...rest] = remainingProducts;
            const updated = [...prevDisplayed];
            updated[index] = newProduct;
            setRemainingProducts(rest);
            return updated;
        });
    };

    


    return (
        <div className='design-your-room-main-container'>
            <h3>Build Your Room</h3>
            <div className='design-your-room-cards-container'>
                {displayedProducts.map((item, index) => (
                    <RecomProductCard
                        key={item.uid || index}
                        parentProduct={index === 0}
                        handleQuickView={() => handleQuickViewOpen(item)}
                        handleRemoveProduct={() => handleRemoveProduct(item.uid)}
                        handleSingleShuffle={() => handleSingleShuffle(item.uid)}
                        slug={item.slug}
                        singleProductData={item}
                        mainImage={`${item.image.image_url}`}
                        mainProduct={displayedProducts[0]}
                        stockCheck
                    />
                ))}
            </div>

            <div className='design-your-room-shuffle-button-container'>
                <button onClick={handleShuffle}>Shuffle</button>
            </div>

            <QuickView
                setQuickViewProduct={quickViewProduct}
                quickViewShow={quickViewClicked}
                quickViewClose={handleQuickViewClose}
            />
        </div>
    );
};

export default DesignYourRoom;