'use client'

import React, { Suspense, useEffect, useState } from "react";
import "./FurnitureAtEveryBudget.css";
import { url } from "../../../utils/api";
import heart from '../../../Assets/icons/heart-vector.png'
import QuickView from "../../Components/QuickView/QuickView";
import ProductCardShimmer from "../../Components/Loaders/productCardShimmer/productCardShimmer";
import { useList } from "../../../context/wishListContext/wishListContext";
import 'react-toastify/dist/ReactToastify.css';
import ProductCardTwo from "../../Components/ProductCardTwo/ProductCardTwo";
import ProductInfoModal from "../../../Global-Components/ProductInfoModal/ProductInfoModal";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import Image from "next/image";
import SectionLoader from "../Loader/SectionLoader";
import ElipticalPagenation from "../Products/ElepticalPagination";
import SnakBar from "@/Global-Components/SnakeBar/SnakBar";

export default function FurnitureAtEveryBudgetClient({ params }) {



    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const router = useRouter();

    const searchParams = useSearchParams();

    const categorySlug = params?.category;          // "living-room"
    const priceSlug = params?.price;                 // "under-800"
    const max_price = priceSlug?.replace(/^under-/i, ''); // "800"

    const pageFromUrl = parseInt(searchParams.get('page')) || 1;


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${url}/api/v1/products/by-category?categorySlug=${categorySlug}&max_price=${max_price}&per_page=24`);
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                const result = await response.json();
                setData(result);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);



    const [productCache, setProductCache] = useState({});
    const [currentPage, setCurrentPage] = useState(pageFromUrl);
    const [products, setProducts] = useState(null);
    const [pagination, setPagination] = useState(null);
    const [bannerImages, setBannerImages] = useState(null);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    // FIX #2: keep currentPage in sync with the URL.
    // Without this, using the browser's Back/Forward button changes the URL
    // (searchParams) but currentPage state never updates, so nothing re-renders.
    useEffect(() => {
        const urlPage = parseInt(searchParams.get('page')) || 1;
        if (urlPage !== currentPage) {
            setCurrentPage(urlPage);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    // Reset cache & page when category/price changes (kept commented logic
    // from original file, but now also clears cache so stale pages from a
    // different category/price never leak in)
    useEffect(() => {
        setProductCache({});
    }, [categorySlug, max_price]);


    useEffect(() => {
        const fetchBanner = async () => {
            try {
                const response = await fetch(`${url}/api/v1/content1/get-foeb?uid=1&slug=${categorySlug}&page=1`);
                if (!response.ok) throw new Error("Failed to fetch banner data");
                const result = await response.json();
                setBannerImages(result.furnitureBudget);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchBanner();
    }, [categorySlug]);

    useEffect(() => {
        const fetchProducts = async () => {
            if (typeof window !== 'undefined') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }

            // FIX #1: cache now stores { products, pagination } together.
            // Previously only products were cached, so navigating back to a
            // cached page left `pagination` stuck on whatever the last
            // network-fetched page was (breaking the pager UI / totalPages).
            const cached = productCache[currentPage];
            if (cached) {
                setProducts(cached.products);
                setPagination(cached.pagination);
                setIsInitialLoad(false);
                return;
            }

            try {
                setLoading(true);
                setIsInitialLoad(true);
                const response = await fetch(`${url}/api/v1/products/by-category?categorySlug=${categorySlug}&max_price=${max_price}&page=${currentPage}&per_page=24`);
                if (!response.ok) throw new Error("Failed to fetch products");

                const result = await response.json();

                setProducts(result.products);
                setPagination(result.pagination);
                setProductCache(prev => ({
                    ...prev,
                    [currentPage]: { products: result.products, pagination: result.pagination }
                }));
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
                setIsInitialLoad(false);
            }
        };

        fetchProducts();
    }, [currentPage, categorySlug, max_price]);


    const [quickViewProduct, setQuickViewProduct] = useState({})
    const [quickViewClicked, setQuickView] = useState(false);
    const handleQuickViewOpen = (item) => {
        setQuickView(true);
        setQuickViewProduct(item)

    }
    const handleQuickViewClose = () => { setQuickView(false) }

    const handleProductClick = (item) => {
        router.push(`/product/${item.slug}`)
    };


    // wish list
    const { addToList, removeFromList, isInWishList } = useList()
    const [openSnakeBar, setOpenSnakeBar] = useState(false);
    const [wishlistMessage, setWishlistMessage] = useState('')

    const handleWishList = async (item) => {


        setOpenSnakeBar(true)
        if (isInWishList(item._id)) {
            removeFromList(item._id);
            setWishlistMessage('Removed from wishlist')

        } else {
            addToList(item._id)
            setWishlistMessage('added to wishlist')
        }

        if (userId && userToken) {
            const api = `${url}/api/v1/web-users/wishlist/${userId}`;

            try {
                const response = await axios.put(api, { productId: item._id }, {
                    headers: {
                        Authorization: userToken,
                        'Content-Type': 'application/json',
                    }
                });
            } catch (error) {
                console.error("UnExpected Server Error", error);
            }
        }
    }

    const handleCloseSnakeBar = () => {
        setOpenSnakeBar(false)
    }


    const [isInfoOpen, setIsInfoOpen] = useState(false);
    const [salePrice, setSalePrice] = useState("");
    const [regPrice, setRegPrice] = useState("");

    const handleOpennfoModal = (salePrice, regPrice) => {
        setIsInfoOpen(true);
        setSalePrice(salePrice)
        setRegPrice(regPrice)

    }

    const handleCloseInfoModal = () => {
        setIsInfoOpen(false);
        setSalePrice('')
        setRegPrice('')
    }





    // variation price

    const [variationPayload, setVariationPayload] = useState();
    const getVariationMatch = () => {
        if (!data?.variations) return;
        const selectedAttr = data?.variations?.find(variation =>
            variation.attributes.some(attribute =>
                attribute.type === 'select' &&
                attribute.options.some(option => option.value === selectVariation)
            ) &&
            variation.attributes.some(attribute =>
                attribute.type === 'color' &&
                attribute.options.some(option => option.value === selectedColor)
            )
        );

        setVariationPayload(selectedAttr)

    }

    const [selectVariation, setSelectVariation] = useState(0);


    const [selectedColor, setSelectedColor] = useState();


    const getInitialDefaultValues = () => {
        const defAttImage = data?.variations?.find(attr =>
            attr.uid === data.default_variation
        )
        if (!defAttImage) return;
        const defAttrColor = defAttImage?.attributes?.find(attribute =>
            attribute?.type === 'color' &&
            attribute?.options?.some(option => option?.value)
        )

        const defAttrSelect = defAttImage?.attributes?.find(attribute =>
            attribute?.type === 'select' &&
            attribute?.options?.some(option => option?.value)
        )

        const defoultColor = defAttrColor?.options?.[0]?.value;
        const defoultValue = defAttrSelect?.options?.[0]?.value;
        setSelectVariation(defoultValue);
        setSelectedColor(defoultColor)
        getVariationMatch()
    };

    useEffect(() => {
        if (data && data.variations && data.default_variation) {
            getInitialDefaultValues();
        }
    }, [data]);

    const [activeGrid, setActiveGrid] = useState('single-col')
    const [selectedGrid, setSelectedGrid] = useState('single-col');

    const handleActiveGrid = (grid) => {
        setActiveGrid(grid);
        setSelectedGrid(grid)
    }


    const [imagePreloader, setImagePreloader] = useState(false);
    const updatePageInUrl = (pageNumber) => {
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set('page', pageNumber);
        router.push(`${currentUrl.pathname}?${currentUrl.searchParams.toString()}`, { scroll: false });
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        updatePageInUrl(pageNumber);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            const newPage = currentPage - 1;
            setCurrentPage(newPage);
            updatePageInUrl(newPage);
        }
    };

    const handleNextPage = () => {
        if (currentPage < pagination?.totalPages) {
            const newPage = currentPage + 1;
            setCurrentPage(newPage);
            updatePageInUrl(newPage);
        }
    };

    // useEffect(() => {
    //     setCurrentPage(1);
    //     setProductCache({});
    //     const currentUrl = new URL(window.location.href);
    //     currentUrl.searchParams.delete('page');
    //     router.replace(`${currentUrl.pathname}`, { scroll: false });
    // }, [categorySlug, max_price]);

    return (
        <>

            <div className="cover_photo">
                {bannerImages?.deskImg && (
                    <Image
                        className="foeb_cover_desk"
                        src={`${url}${bannerImages.deskImg}`}
                        alt="slide cover"
                        width={1599}
                        height={360}
                        onLoad={() => setImagePreloader(true)}
                        priority={true}
                        placeholder="blur"
                        blurDataURL="/blur.jpg"
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />
                )}
                {bannerImages?.deskImg && (
                    <Image
                        src={`${url}${bannerImages.mobImg}`}
                        className="foeb_cover_mob"
                        alt="slide mob cover"
                        width={320}
                        height={320}
                        onLoad={() => setImagePreloader(true)}
                        priority={true}
                        placeholder="blur"
                        blurDataURL="/blur.jpg"
                    />
                )}
            </div>
            <div className="furniture_at_every_budget">

                <div className="mobile-furniture-heading-and-column-contianer">
                    <h3 className="furniture-for-every-budget-main-heading">Furniture Under ${max_price}</h3>

                    <div className='mobile-view-product-card-grid-select foeb'>
                        <div className={`mobile-view-toggler-single-box ${activeGrid === 'single-col' ? 'active-toggler-single-box' : ''}`}>
                            <div className={`mobile-view-card-grid-single-col ${activeGrid === 'single-col' ? 'grid-active' : ''}`} onClick={() => handleActiveGrid('single-col')}></div>
                        </div>

                        <div className={`mobile-view-toggler-double-box ${activeGrid === 'dual-col' ? 'active-toggler-dual-col' : ''}`}>
                            <div className='mobile-view-card-grid-dual-col' onClick={() => handleActiveGrid('dual-col')}>
                                <div className={`mobile-view-card-grid-dual-col-inner ${activeGrid !== 'single-col' ? 'active-dual-col' : ''}`}></div>
                                <div className={`mobile-view-card-grid-dual-col-inner ${activeGrid !== 'single-col' ? 'active-dual-col' : ''}`}></div>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="product-grid-foeb">
                    {!isInitialLoad ? (
                        products.map((item, index) => (
                            <ProductCardTwo
                                key={index}
                                slug={item.slug}
                                singleProductData={item}
                                maxWidthAccordingToComp={"100%"}
                                justWidth={'100%'}
                                showOnPage={true}
                                showExtraLines={true}
                                percent={'12%'}
                                colTwo={selectedGrid === 'single-col' ? false : true}
                                tagIcon={item.productTag ? item.productTag : heart}
                                tagClass={item.productTag ? 'tag-img' : 'heart-icon'}
                                mainImage={`${item.image.image_url}`}
                                productCardContainerClass="product-card"
                                ProductSku={item.sku}
                                tags={item.sale_tag}
                                allow_back_order={item?.allow_back_order}
                                ProductTitle={item.name}

                                reviewCount={item.reviewCount}
                                lowPriceAddvertisement={item.lowPriceAddvertisement}
                                priceTag={item.regular_price}
                                sale_price={item.sale_price}
                                financingAdd={item.financingAdd}
                                learnMore={item.learnMore}
                                mainIndex={index}
                                deliveryTime={item.deliveryTime}
                                stock={item.manage_stock}
                                attributes={item.attributes}
                                handleCardClick={() => handleProductClick(item)}
                                handleQuickView={() => handleQuickViewOpen(item)}
                                handleWishListclick={() => handleWishList(item)}
                                handleInfoModal={() => handleOpennfoModal(item.sale_price, item.regular_price)}
                                productTag={item.product_tag}
                            />
                        ))
                    ) : (
                        Array.from({ length: 4 }).map((_, index) => (
                            <ProductCardShimmer key={index} />
                        ))
                    )}
                </div>

                <div className={`mobile-view-furniture-for-every-budget ${selectedGrid === 'single-col' ? 'single-col' : 'two-col'} `}>
                    {!isInitialLoad ? (
                        products.map((item, index) => (
                            <ProductCardTwo
                                key={index}
                                slug={item.slug}
                                singleProductData={item}
                                maxWidthAccordingToComp={"100%"}
                                justWidth={'100%'}
                                showOnPage={true}
                                showExtraLines={true}
                                percent={'12%'}
                                colTwo={selectedGrid === 'single-col' ? false : true}
                                tagIcon={item.productTag ? item.productTag : heart}
                                tagClass={item.productTag ? 'tag-img' : 'heart-icon'}
                                mainImage={`${item.image.image_url}`}
                                productCardContainerClass="product-card"
                                ProductSku={item.sku}
                                tags={item.sale_tag}
                                allow_back_order={item?.allow_back_order}
                                ProductTitle={item.name}

                                reviewCount={item.reviewCount}
                                lowPriceAddvertisement={item.lowPriceAddvertisement}
                                priceTag={item.regular_price}
                                sale_price={item.sale_price}
                                financingAdd={item.financingAdd}
                                learnMore={item.learnMore}
                                mainIndex={index}
                                deliveryTime={item.deliveryTime}
                                stock={item.manage_stock}
                                attributes={item.attributes}
                                handleCardClick={() => handleProductClick(item)}
                                handleQuickView={() => handleQuickViewOpen(item)}
                                handleWishListclick={() => handleWishList(item)}
                                handleInfoModal={() => handleOpennfoModal(item.sale_price, item.regular_price)}
                                productTag={item.product_tag}
                            />
                        ))
                    ) : (
                        Array.from({ length: 4 }).map((_, index) => (
                            <ProductCardShimmer key={index} />
                        ))
                    )}
                </div>

                {/* {!noProducts && ( */}
                <ElipticalPagenation
                    activePageIndex={currentPage}
                    totalPages={pagination?.totalPages}
                    onPrevPage={handlePrevPage}
                    onNextPage={handleNextPage}
                    onPageChange={handlePageChange}
                    marginTop={'0px'}
                    innerTop="0px"
                    innerBottom="0px"
                />

                {/* )} */}

                {/* <Pagination activePageIndex={currentPage} totalPages={pagination?.totalPages} onNextPage={handleNextPage} onPrevPage={handlePrevPage} onPageChange={handlePageChange} /> */}

                <QuickView
                    setQuickViewProduct={quickViewProduct}
                    quickViewShow={quickViewClicked}
                    quickViewClose={handleQuickViewClose}
                />
                <ProductInfoModal
                    openModal={isInfoOpen}
                    closeModal={handleCloseInfoModal}
                    salePrice={salePrice}
                    regPrice={regPrice}
                />

                <SnakBar
                    message={wishlistMessage}
                    openSnakeBarProp={openSnakeBar}
                    setOpenSnakeBar={setOpenSnakeBar}
                    onClick={handleCloseSnakeBar}
                />

                {loading && <SectionLoader />}
            </div>

        </>
    );
}