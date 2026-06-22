'use client'

import dynamic from 'next/dynamic';
import { ProductPageProvider } from '@/context/ProductPageContext/productPageContext';

const ProductDisplay = dynamic(() => import('./productDisplay'));

export default function ProductDisplayWrapper({ params, productAPIData }) {

  // Derive the initial variation synchronously from server data
  // so context is pre-populated before first client render — no NaN flash
  const getInitialVariation = () => {
    if (!productAPIData || productAPIData.type !== 'variable') return null;
    const defaultUid = productAPIData.default_variation;
    return (
      productAPIData.variations?.find(v => v.uid === defaultUid) ||
      productAPIData.variations?.[0] ||
      null
    );
  };

  const initialVariation = getInitialVariation();

  return (
    <ProductPageProvider
      initialProduct={productAPIData}
      initialVariation={initialVariation}
    >
      <ProductDisplay params={params} productAPIData={productAPIData} />
    </ProductPageProvider>
  );
}