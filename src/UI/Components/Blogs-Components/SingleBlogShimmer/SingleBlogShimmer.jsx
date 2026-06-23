import React from "react";
import "./SingleBlogShimmer.css";

export default function SingleBlogShimmer() {
    return (
        <div className="single_blog_shimmer">
            <div className="single-blog-left-content-shimmer">
                <div className="single-blog-title-and-publish-date-shimmer">
                    <div className="heading-published-date-heading-shimmer shimmer-effect"></div>

                    <div className="paragraph-pub-date-shimmer shimmer-effect"></div>
                </div>

                <div className="single-blog-main-image-div-shimmer shimmer-effect"></div>
            </div>

            <div className="single-blog-right-content-shimmer">
                <h3>Trending</h3>
                <div className="sidebar-card-shimmer shimmer-effect"></div>
                <div className="sidebar-card-shimmer shimmer-effect"></div>
                <div className="sidebar-card-shimmer shimmer-effect"></div>
                <div className="sidebar-card-shimmer shimmer-effect"></div>
            </div>
        </div>
    );
}