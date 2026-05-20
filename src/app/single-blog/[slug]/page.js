'use client'

import React, { useEffect } from 'react'
import './SingleBlog.css'
import BlogHead from '@/UI/Components/Blogs-Components/BlogsHead/BlogHead'
import Link from 'next/link'
import TrandingBlogs from '@/UI/Components/Blogs-Components/TrandingBlogs/TrandingBlogs';
import FirstToKnow from '@/UI/Components/Blogs-Components/FirstToKnow/FirstToKnow';
import SearchTag from '@/UI/Components/Blogs-Components/SearchTags/SearchTag';
import NextUp from '@/UI/Components/Blogs-Components/NextUp/NextUp';
import { url, formatDate } from '@/utils/api'
import { useBlog } from '@/context/BlogsContext/blogsContext'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import axios from 'axios'

import { FaFacebook, FaYoutube, FaInstagramSquare , FaTiktok, FaEnvelope, } from "react-icons/fa";

const SingleBlog = () => {
    const router = useRouter();
    const path = usePathname();
    const splitedPath = path.split('/');
    const slug = splitedPath[splitedPath.length - 1]


    const {
        blogs,
        blogCategories,
        fetchBlogs,
    } = useBlog();




    let singleBlog = {}
    if (!singleBlog.slug) {
        singleBlog = blogs.find((blog) => blog.slug === slug) || {};
    }



    useEffect(() => {
        fetchBlogs(singleBlog?.category?._id)
    }, [])

    const socialLinks = [
        { icon: FaFacebook, link: '#' },
        { icon: FaYoutube, link: '#' },
        { icon: FaInstagramSquare, link: '#' },
        { icon: FaTiktok, link: '#' },
        { icon: FaEnvelope, link: '#' },
    ]

    const filteredBlogs = blogs.filter((item) => item.slug !== singleBlog?.[0]?.slug);

    const getSurroundingBlogs = (slug) => {
        const currentIndex = blogs.findIndex((item) => item.slug === slug); // Find the index of the current blog

        if (currentIndex === -1) {
            return { beforeId: null, afterId: null }; // If the blog is not found
        }

        const beforeSlug = currentIndex === 0 ? null : blogs[currentIndex - 1].slug;
        const beforeIndex = beforeSlug !== null ? blogs.findIndex((item) => item.slug === beforeSlug) : null
        const afterSlug = currentIndex + 1 < blogs.length ? blogs[currentIndex + 1].slug : null;
        const afterIndex = afterSlug !== null ? blogs.findIndex((item) => item.slug === afterSlug) : null;

        return { beforeIndex, afterIndex };

    };

    const { beforeIndex, afterIndex } = getSurroundingBlogs(singleBlog.slug);

    const updateBlogView = async () => {
        const api = `${url}/api/v1/blogs/${singleBlog._id}/view`

        try {
            const response = await axios.put(api);
        } catch (error) {
            console.error("UnExpected Server Error", error);
        }
    }

    useEffect(() => {
        updateBlogView()
    }, [singleBlog?._id])


    const navigateToSingleBlog = (item) => {
        router.push(`/single-blog/${item.slug}`, { state: item });
    }

    return (
        <div className='single-blog-main-container'>
            <div className='single-blog-main-heading-div'>
                <h3 className='single-blog-main-heading'>Exciting Blogs Created by <span> Furniture Mecca </span></h3>
                <h3 className='mobile-view-single-blog-main-heading'>Exciting Blogs</h3>
            </div>
            {/* <BlogHead blogCategories={blogCategories} /> */}

            <div className='single-blog-content-section'>

                <div className='single-blog-left-content'>
                    <div className='single-blog-title-and-publish-date'>
                        <h3 className='single-blog-name'>{singleBlog.title}</h3>
                        <p className='single-blog-post-date'>{formatDate(singleBlog.publishedDate)}</p>
                    </div>
                    <div className='single-blog-main-image-div'>
                        <img src={`${url}${singleBlog?.image?.image_url}`} alt='single-blog-image' className='single-blog-main-image' />
                    </div>
                    <div className='single-blog-columns' dangerouslySetInnerHTML={{ __html: singleBlog.content }}>
                    </div>
                    <div className='single-blog-social-links-div'>
                        <p>Share this: </p>
                        <div className='single-blog-social-icons'>
                            {socialLinks.map((items, index) => (
                                <Link href={'#'} key={index} className='social-single-icon'>
                                    {<items.icon size={30} color='#595959'/>} 

                                    {/* <Image src={items.icon}
                                        width={25}
                                        height={25}
                                        alt='social-icon'
                                        className='social-icon-img'
                                        style={{ width: 'auto', height: '20px' }}
                                    /> */}
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className='prev-and-next-blog-section' >
                        <div className='prev-single-blog' onClick={() => navigateToSingleBlog(blogs?.[beforeIndex])}>
                            <p>Previous Blog</p>
                            {beforeIndex !== null ? (
                                <h3>{blogs?.[beforeIndex]?.title}</h3> // Show the title of the "before" blog
                            ) : (
                                <h3>No Prev Blog</h3>
                            )}
                        </div>
                        <div className='next-single-blog' onClick={() => navigateToSingleBlog(blogs?.[afterIndex])}>
                            <p>Next Blog</p>
                            {afterIndex !== null ? (
                                <h3>{blogs?.[afterIndex]?.title}</h3> // Show the title of the "before" blog
                            ) : (
                                <h3>No Next Blog</h3>
                            )}
                        </div>
                    </div>
                </div>

                <div className='single-blog-right-content'>
                    <TrandingBlogs blogs={filteredBlogs} />
                    <FirstToKnow />
                    <SearchTag />
                </div>
            </div>
        </div>
    )
}

export default SingleBlog