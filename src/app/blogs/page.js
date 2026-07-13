// import BlogPage from './BlogPage';


// export async function generateMetadata() {
//   return {
//     title: "Furniture Mecca's Blogs | Furniture Sale – Save Up to 75% Furniture Mecca",
//     description:
//       "Explore Furniture Mecca's blog for furniture tips, home décor inspiration, design trends, seasonal ideas, and expert advice for every room.",

//     alternates: {
//       canonical: "https://myfurnituremecca.com/blogs",
//     },

//     openGraph: {
//       title: "Furniture Mecca's Blogs | Furniture Sale – Save Up to 75% Furniture Mecca",
//       description:
//         "Explore Furniture Mecca's blog for furniture tips, home décor inspiration, design trends, seasonal ideas, and expert advice for every room.",
//       url: "https://myfurnituremecca.com/blogs",
//       images: [
//         {
//           url: "https://myfurnituremecca.com/Assets/Logo/fm-new-logo.png",
//           width: 1200,
//           height: 630,
//         },
//       ],
//     },
//   };
// }

// const Blogs = () => {
//   return <BlogPage />;
// };

// export default Blogs;


import { Suspense } from 'react';
import BlogPage from './BlogPage';

export async function generateMetadata() {
  return {
    title: "Furniture Mecca's Blogs | Furniture Mecca",
    description:
      "Explore Furniture Mecca's blog for furniture tips, home décor inspiration, design trends, seasonal ideas, and expert advice for every room.",
    alternates: {
      canonical: "https://myfurnituremecca.com/blogs",
    },
    openGraph: {
      title: "Furniture Mecca's Blogs | Furniture Mecca",
      description:
        "Explore Furniture Mecca's blog for furniture tips, home décor inspiration, design trends, seasonal ideas, and expert advice for every room.",
      url: "https://myfurnituremecca.com/blogs",
      images: [
        {
          url: "https://myfurnituremecca.com/Assets/Logo/fm-new-logo.png",
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

const Blogs = () => {
  return (
    <Suspense fallback={null}>
      <BlogPage />
    </Suspense>
  );
};

export default Blogs;