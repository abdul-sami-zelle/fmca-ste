// app/not-found.js

export const metadata = {
  title: "404 - Not Found",
  description:
    "The page you are looking for could not be found. Browse Furniture Mecca's collection of furniture, mattresses, and home decor.",
};

import "./globals.css";

export default function NotFound() {
  return (
    <div className="not-found-containerNOTFoundNEWoneP">
      <div className="not-found-icon-wrapperNOTFoundNEWoneP">
        <img
          className="image-furnitureNOTFoundNEWoneP"
          src="/icons/furnitureallPageNOTFoundNEWoneP.svg"
          alt="Not Found Icon"
        />
      </div>

      <h1 className="not-found-titleNOTFoundNEWoneP">
        404 - Page Not Found
      </h1>

      <p className="not-found-descriptionNOTFoundNEWoneP">
        Sorry, the page you are looking for does not exist or has been removed.
      </p>

      <a href="/" className="not-found-btnNOTFoundNEWoneP">
        Continue Shopping
      </a>
    </div>
  );
}