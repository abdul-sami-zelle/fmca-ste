import React, { useEffect, useState } from 'react'
import './AlsoNeed.css';
import filledStar from '../../../Assets/icons/Star 19.png';
import axios from 'axios';
import { formatedPrice, url } from '../../../utils/api';
import RatingReview from '../starRating/starRating';
import { useRouter } from 'next/navigation';
import QuickView from '../QuickView/QuickView';
// import { useNavigate } from 'react-router-dom';

const AlsoNeed = ({ productsUid }) => {

    // States and variables
    const navigate = useRouter()
    const filledStars = [filledStar, filledStar, filledStar, filledStar]
    const relatedProduct = productsUid.map((item) => item)
    const [data, setData] = useState();

    // Functions
    const getFromApi = async () => {
        const api = `/api/v1/products/get/`
        try {
            const requests = relatedProduct.map(async (item) => {
                const response = await axios.get(`${url}${api}${item}`);
                return response.data.products; // You can modify this depending on what data you need from the response.
            });
            const alsoNeedProducts = await Promise.all(requests); // Wait for all requests to resolve
            const flattenedProducts = alsoNeedProducts.flat();
            return flattenedProducts;
        } catch (error) {
            console.error("error geting data", error)
        }
    }

    const fetchRelatedProducts = async () => {
        const products = await getFromApi();
        setData(products); // Update the state with the fetched products
    };

    useEffect(() => {
        fetchRelatedProducts();
    }, [])

    const maxLength = 20;
    const truncateTitle = (title, maxLength) => {
        if (!title) return '';
        return title.length > maxLength ? title.slice(0, maxLength) + '...' : title;
    };

    const [quickViewClicked, setQuickView] = useState(false);
    const [quickViewProduct, setQuickViewProduct] = useState({})

    const handleQuickViewOpen = (item) => {
        setQuickView(true);
        setQuickViewProduct(item)
    }

    const handleQuickViewClose = () => { setQuickView(false) }

    // const handleNavigate = (item) => {
    //     navigate.push(`/product/${item.slug}`, {state: {products: item}})
    // }

    return (
        <div className={`might-need-main-container`}>
            <h3>You Might Also Need</h3>
            <div className='might-need-cards-main-container'>
                {data && data.map((item) => (
                    <div key={item.uid} className='might-need-product-card' onClick={() => handleQuickViewOpen(item)}>
                        <img src={`${url}${item.image.image_url}`} alt='img' className='also-need-product-image' />
                        <div className='you-might-need-product-contant'>
                            <h3>{truncateTitle(item.name, maxLength)}</h3>
                            <p>White, Queen</p>
                            <div className='also-need-prices-div'>
                                <p className='might-need-product-price'>{item.sale_price ? formatedPrice(item.sale_price) : formatedPrice(item.regular_price)}</p>
                                {item.sale_price ? <del className='might-need-product-del-price'>{formatedPrice(item.regular_price)}</del> : <></>}
                            </div>
                            <span className='might-need-product-rating'>
                                <RatingReview size={"12px"} rating={item.rating} disabled={true} />

                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <QuickView
                setQuickViewProduct={quickViewProduct}
                quickViewShow={quickViewClicked}
                quickViewClose={handleQuickViewClose}
            />
        </div>
    )
}

export default AlsoNeed
