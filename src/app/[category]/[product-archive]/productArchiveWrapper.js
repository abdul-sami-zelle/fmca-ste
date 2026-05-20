import dynamic from 'next/dynamic';

// Import the actual client component dynamically (without ssr: false here)
const ProductArchive = dynamic(() => import('./productArchive'));

export default function ProductDisplayWrapper({ params }) {
  return <ProductArchive params={params} />;
}
