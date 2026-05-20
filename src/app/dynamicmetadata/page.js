// This is a Server Component by default (no "use client")
export async function generateMetadata({ params }) {
    return {
      title: `Product - ${params} `,
      description: `Details about `,
    };
  }
  
  export default function DynamicMetaData({ params }) {
    return <div>Dynamic page for {params.slug}</div>;
  }