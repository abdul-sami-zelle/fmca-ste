import { Route } from "react-router-dom";
import Home from "../../UI/Pages/Home/Home";
import Categories from "../../UI/Pages/Categories/Categories";
import ProductArchive from "../../UI/Pages/ProductArchive/ProductArchive";
import SingleProduct from "../../UI/Pages/SingleProduct/SingleProduct";
import Cart from "../../UI/Pages/Cart/Cart";
import Summary from "../../UI/Pages/Summery/Summary";
import PageNotFound from "../../UI/Pages/404Page/404Page";

import Financing from "../../UI/Pages/Financing/Financing";
import LoginRegister from "../../UI/Pages/LoginRegisteration/LoginRegister";
import UserDashboard from "../../UI/Pages/UserDashboard/UserDashboard";
import Careers from "../../UI/Pages/Careers/Careers";
import FurnitureAtEveryBudget from "../../UI/Pages/FurnitureAtEveryBudget/FurnitureAtEveryBudget";
import StoreLocator from "../../UI/Pages/StoreLocator/StoreLocator";
import BlogPage from "../../UI/Pages/Blogs/BlogPage";
import SingleBlog from "../../UI/Pages/SingleBlog/SingleBlog";
import WishList from "../../UI/Pages/WishList/WishList";
import ActiveCategoryPage from "../../UI/Pages/ActiveCategoryPage/ActiveCategoryPage";
import BookAppointment from "../../UI/Pages/BookAppointment/BookAppointment";
import ShippingAndDelivery from "../../UI/Pages/ShippingAndDelivery/ShippingAndDelivery";
import TermsAndConditions from "../../UI/Pages/TermsAndCondition/TermsAndConditions";
import PrivacyPolicy from "../../UI/Pages/PrivacyPolicy/PrivacyPolicy";
import Contact from "../../UI/Pages/Contact/Contact";
// import OrderConfirmationPage from "";
import ReturnPolicy from "../../UI/Pages/returnPolicy/ReturnPolicy";
import AboutUs from "../../UI/Pages/AboutUs/AboutUs";
import ProductDisplay from "../../UI/Pages/ProductDisplay/ProductDisplay";
import FreeDesignConsultation from "@/app/free-design-consultation/page";
import OrderConfirmationPage from "@/app/order-confirmation/[id]/page";


const routes = (

    <>
        <Route exact path="/" element={<Home />} />

        {/* Sale Day */}
        <Route
            path="/sale/:slug"
            element={
                <ActiveCategoryPage
                />
            }
        />

        <Route
            path="/holiday-sale"
            element={
                <ActiveCategoryPage
                />
            }
        />

        {/* Product Archive Page Routes */}
        <Route
            path='/holiday-sale'
            element={
                <ProductArchive
                    productArchiveHading={`Labor Day Sale`}
                />
            }
        />

        <Route
            path="/searched-products"
            element={
                <ProductArchive
                    productArchiveHading={`Search Result for:`}
                />
            }
        />

        {/* Single Product Page Routes */}
        <Route
            // path='/single-product/:slug'
            path="/product/:slug"
            element={
                // <SingleProduct />
                <ProductDisplay />
            }
        />

        {/* Cart And Summery */}
        <Route
            path='/cart'
            element={
                <Cart
                />
            }
        />

        <Route
            path='/check-out'
            element={
                <Summary
                />
            }
        />

        <Route
            path="/financing"
            element={<Financing />}
        />

        <Route
            path="/my-account"
            element={<LoginRegister />}
        />

        <Route
            path="/careers"
            element={<Careers />}
        />
        <Route
            path="/blogs"
            element={<BlogPage />}
        />
        <Route
            path="/single-blog/:slug"
            element={<SingleBlog />}
        />
        <Route
            path="/furniture-for-every-budget"
            element={<FurnitureAtEveryBudget />}
        />

        <Route
            path="/:categorySlug"
            element={<Categories />}
        />

        <Route
            path="/:categorySlug/:subCategorySlug"
            element={<ProductArchive />}
        />

        <Route
            path="/store-locator"
            element={<StoreLocator />}
        />
        <Route
            path="/wishlist"
            element={<WishList />}
        />

        <Route
            path="/contact-us"
            element={<Contact />}
        />
        <Route
            path="/privacy-policy"
            element={<PrivacyPolicy />}
        />
        <Route
            path="/terms-and-conditions"
            element={<TermsAndConditions />}
        />
        <Route
            path="/shipping-and-delivery"
            element={<ShippingAndDelivery />}
        />
        <Route
            path="/return-policy"
            element={<ReturnPolicy />}
        />
        <Route
            path="/book-an-appointment"
            element={<BookAppointment />}
        />
        <Route
            path="/user-dashboard"
            element={<UserDashboard />}
        />
        <Route
            path="/user-dashboard/:id"
            element={<UserDashboard />}
        />
        <Route
            path="/about-us"
            element={<AboutUs />}
        />
        <Route 
            path="/free-design-consultation"
            element={<FreeDesignConsultation />}
        />

        <Route exact path="/order-confirmation/:_id" element={<OrderConfirmationPage />} />

        {/* not found routes */}
        <Route path='*' element={<PageNotFound />} />
    </>
);
export default routes;