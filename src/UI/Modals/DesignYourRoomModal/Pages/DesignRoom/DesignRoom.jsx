import React, { useState, useRef, useEffect } from "react";
import SubProductCard from "../../components/SubProductCard/SubProductCard";
import { AiFillCloseSquare } from "react-icons/ai";
import {
  sub_categories,
  sub_products,
  displayCombinations,
} from "../../Data/Data";
import "./style.css";

const DesignRoom = ({wasPrice,nowPrice,name,image,setAddToCart}) => {


  const subCategoryRef = useRef(null);

  const initialDisplayImage = Object.values(displayCombinations)[0];
  const staticRoomTitle = "Living Room";
  const staticProduct = {
    id: 1,
    name: name,
    nowPrice: nowPrice,
    wasPrice: wasPrice,
    image:
      image,
  };

    const [displayImage, setDisplayImage] = useState(initialDisplayImage);


  const [selectedSubCategory, setSelectedSubCategory] = useState(
    sub_categories[0] || null
  );
  const [selectedSubProductIds, setSelectedSubProductIds] = useState([]);
  const [cartItems, setCartItems] = useState([
    { ...staticProduct, displayImage: initialDisplayImage },
  ]);
  const [backgroundUrl, setBackgroundUrl] = useState("");
  const [isBgImageVisible, setIsBgImageVisible] = useState(false);
  const [isLoadingBg, setIsLoadingBg] = useState(true);

  const filteredSubProducts = sub_products.filter(
    (p) => p.category === selectedSubCategory?.id
  );

  const getDisplayImageSnapshot = (ids) => {
    const baseKey = ids.join("");
    const allKeys = Object.keys(displayCombinations);
    const matchingKey = allKeys.find((key) => {
      const keyIds = key.split("").map(Number);
      const keyMain = keyIds[0];
      const keySub = keyIds.slice(1).sort((a, b) => a - b);
      return (
        keyMain === ids[0] &&
        keyIds.length === ids.length &&
        keySub.every(
          (id, idx) => id === ids.slice(1).sort((a, b) => a - b)[idx]
        )
      );
    });
    return displayCombinations[matchingKey] || initialDisplayImage;
  };

  const toggleSubProduct = (product) => {
    setSelectedSubProductIds((prev) => {
      let updated;
      let newCart = [...cartItems];

      if (prev.includes(product.id)) {
        updated = prev.filter((id) => id !== product.id);
        newCart = newCart.filter((item) => item.id !== product.id);
      } else {
        updated = [...prev, product.id];
        const snapshotImage = getDisplayImageSnapshot([
          staticProduct.id,
          ...updated,
        ]);
        const subProductToAdd = {
          ...product,
          displayImage: snapshotImage,
        };
        newCart.push(subProductToAdd);
      }

      setCartItems(newCart);
      return updated;
    });
  };

  const removeSubProduct = (id) => {
    const updatedIds = selectedSubProductIds.filter((pid) => pid !== id);
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setSelectedSubProductIds(updatedIds);
    setCartItems(updatedCart);
  };

  const totalPrice = cartItems.reduce((sum, item) => {
    const price = item?.nowPrice
      ? parseFloat(item.nowPrice.replace(/[^0-9.-]+/g, ""))
      : 0;
    return sum + price;
  }, 0);

  useEffect(() => {
    const el = subCategoryRef.current;
    if (!el) return;

    const handleWheel = (e) => {
      if (e.deltaY === 0) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY * 3.5;
    };

    el.addEventListener("wheel", handleWheel, { passive: false });

    return () => el.removeEventListener("wheel", handleWheel);
  }, []);

  useEffect(() => {
    if (!initialDisplayImage) return;

    setIsBgImageVisible(false);
    setIsLoadingBg(true);

    const img = new Image();
    img.src = initialDisplayImage;

    img.onload = () => {
      setBackgroundUrl(initialDisplayImage);
      setIsBgImageVisible(true);
      setIsLoadingBg(false);
    };
  }, [initialDisplayImage]);

    useEffect(() => {
  const sortedIds = [...selectedSubProductIds].sort((a, b) => a - b);
  const allIds = [staticProduct.id, ...sortedIds];
  const snapshotImage = getDisplayImageSnapshot(allIds);

  setDisplayImage(snapshotImage);
  setIsBgImageVisible(false);
  setIsLoadingBg(true);

  const img = new Image();
  img.src = snapshotImage;

  img.onload = () => {
    setBackgroundUrl(snapshotImage);
    setIsBgImageVisible(true);
    setIsLoadingBg(false);
  };
}, [selectedSubProductIds]);

  return (
    <div className="designer-page">
      <div className="category-with-product-card">
        <div style={{ height: "100%" }}>
          <div className="selected-image-container">
            <h2 className="recomended-product-title">{staticRoomTitle}</h2>
            <div className="image-wrapper-container">
              {isLoadingBg && <div className="image-shimmer-loader" />}
              <div
                className={`image-wrapper ${
                  isBgImageVisible ? "fade-in" : "fade-out"
                }`}
                style={{ backgroundImage: `url(${backgroundUrl})` }}
              >
              </div>
            </div>
          </div>

          <div className="cart-summary">
            <div className="addtocartlist">
              {cartItems.map((item, index) => (
                <div key={index} className="product-info">
                  <div className="product-image-container">
                    <img
                      src={item.image}
                      alt="Product"
                      className="small-cart-image"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/assets/Images/fallback.png";
                      }}
                    />
                    {index !== 0 && (
                      <AiFillCloseSquare
                        className="remove-icon-inside"
                        onClick={() => removeSubProduct(item.id)}
                      />
                    )}
                  </div>
                  <div style={{ marginLeft: "15px" }}>
                    <p className="selected-product-namessssss">{item.name}</p>
                    <p className="price-main">
                      <span className="nowPrice">{item.nowPrice}</span>
                      <span className="wasPrice">{item.wasPrice}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="addtocart-section">
              <div>
                {cartItems.length > 1 && (
                  <p
                    className="remove-all"
                    onClick={() => {
                      setSelectedSubProductIds([]);
                      setCartItems([
                        {
                          ...selectedProduct,
                          displayImage: initialDisplayImage,
                        },
                      ]);
                    }}
                  >
                    Remove All
                  </p>
                )}
              </div>

              <div>
                <div className="total-price-main">
                  <p className="addtocarttotal">Total</p>
                  <p className="addtocartprice">
                    ${totalPrice.toLocaleString()}
                  </p>
                </div>
                <button onClick={()=>{setAddToCart()}} className="add-to-cart-btn">Add To Cart</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="select-add-product">
        <h2 className="select-to-add-title">Select to Add Products</h2>
        <div className="subcategory-bar no-scrollbar" ref={subCategoryRef}>
          {sub_categories.map((category) => (
            <div
              key={category.id}
              className={`subcategory-img-wrapper ${
                selectedSubCategory?.id === category.id ? "active" : ""
              }`}
              onClick={() => setSelectedSubCategory(category)}
            >
              <img
                src={category.image}
                alt={category.name}
                className="subcategory-img"
              />
            </div>
          ))}
        </div>

        <div className="subproduct-grid">
          {filteredSubProducts.map((product) => (
            <div
              key={product.id}
              className={`subproduct-select-wrapper ${
                selectedSubProductIds.includes(product.id) ? "selected" : ""
              }`}
              onClick={() => toggleSubProduct(product)}
            >
              <SubProductCard
                product={product}
                room={staticRoomTitle}
                isSelected={selectedSubProductIds.includes(product.id)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DesignRoom;
