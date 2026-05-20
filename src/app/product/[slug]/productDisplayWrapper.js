import dynamic from 'next/dynamic';

const ProductDisplay = dynamic(() => import('./productDisplay'));

export default function ProductDisplayWrapper({ params }) {
  return <ProductDisplay params={params} />;
}
