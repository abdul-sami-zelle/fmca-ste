'use client';

import '../../Styles/index.css';
import '../../Styles/App.css'


import Header from '@/Global-Components/Header/Header';
import Footer from '@/Global-Components/Footer/Footer';
import Shopvia from '@/UI/Components/ShopViaBanner/Shopvia';
import { ProductProvider } from '@/context/productsContext/productContext';
import { CartProvider } from '@/context/cartContext/cartContext';
import { NavigationProvider } from '@/context/BreadCrumbContext/NavigationContext';
import { OrderProvivder } from '@/context/orderContext/orderContext';
import { SingleProductProvider } from '@/context/singleProductContext/singleProductContext';
import { AddCartProvider } from '@/context/AddToCart/addToCart';
import { MyOrdersProvider } from '@/context/orderContext/ordersContext';
import { VariationProvider } from '@/context/BreadCrumbContext/variationsContext';
import { LPContentProvider } from '@/context/LPContentContext/LPContentContext';
import { WishListProvider } from '@/context/wishListContext/wishListContext';
import { ProductPageProvider } from '@/context/ProductPageContext/productPageContext';
import { SEOctxProvider } from '@/context/SEOcontext/SEOcontext';
import { GlobalContextProvider } from '@/context/GlobalContext/globalContext';
import { ActiveSalePageProvider } from '@/context/ActiveSalePageContext/ActiveSalePageContext';
import { BlogsProvider } from '@/context/BlogsContext/blogsContext';
import { UserDashboardCtxProvider } from '@/context/userDashboardContext/userDashboard';
import { ProductArchiveProvider } from '@/context/ActiveSalePageContext/productArchiveContext';
import { AppointmentProvider } from '@/context/AppointmentContext/AppointmentContext';
import Home from '@/chatbot-components/Home/Home';


import { ToastContainer, Zoom } from 'react-toastify';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { usePathname } from 'next/navigation';
import { ChatOpenProvider } from '@/context/ChatbotContext/ChatbotContext';
import { LastCallProvider } from '@/context/LastCallContext/LastCallContext';

export default function ClientLayout({ children }) {

  const pathname = usePathname();
  const hideHeaderFooter = pathname.startsWith('/order-confirmation');
  const hideOnlyFooter = pathname.startsWith('/order-confirmation') || pathname.startsWith('/check-out');
  const hideChatOption = pathname.startsWith('/cart') || pathname.startsWith('/check-out');

  return (

        <UserDashboardCtxProvider>
          <SEOctxProvider>
            <CartProvider>
              <GlobalContextProvider>
                <BlogsProvider>
                  <ActiveSalePageProvider>
                    {/* <LastCallProvider> */}
                      <WishListProvider>
                        <LPContentProvider>
                          <OrderProvivder>
                            <NavigationProvider>
                              <AddCartProvider>
                                <ProductProvider>
                                  <AppointmentProvider>
                                    <SingleProductProvider>
                                      <MyOrdersProvider>
                                        <ProductPageProvider>
                                          <VariationProvider>
                                            <ProductArchiveProvider>
                                              <ChatOpenProvider>


                                                <ToastContainer
                                                  style={{ zIndex: 99999 }}
                                                  position="top-center"
                                                  transition={Zoom}
                                                  autoClose={1000}
                                                />
                                                {!hideHeaderFooter && <Header />}
                                                {!hideHeaderFooter && <Shopvia />}
                                                <main>{children}</main>
                                                {!hideOnlyFooter && <Footer />}

                                                {!hideChatOption && <Home />}
                                              </ChatOpenProvider>
                                            </ProductArchiveProvider>
                                          </VariationProvider>
                                        </ProductPageProvider>
                                      </MyOrdersProvider>
                                    </SingleProductProvider>
                                  </AppointmentProvider>
                                </ProductProvider>
                              </AddCartProvider>
                            </NavigationProvider>
                          </OrderProvivder>
                        </LPContentProvider>
                      </WishListProvider>
                    {/* </LastCallProvider> */}
                  </ActiveSalePageProvider>
                </BlogsProvider>
              </GlobalContextProvider>
            </CartProvider>
          </SEOctxProvider>
        </UserDashboardCtxProvider>
  );
}
