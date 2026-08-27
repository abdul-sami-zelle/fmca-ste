import React from "react";
import "./style.css";
import { url } from "@/utils/api";
import Link from "next/link";

export default function ShowRoomContainer({ data }) {
    return (
        <div className="show_room_container">
            <img
                src={url +data?.images[0]?.image_url}
                alt={data?.name || "Showroom"}
                className="show_room_image"
            />

            <div className="show_room_overlay">
                <p className="show_room_name">
                    {data?.name}
                </p>

                <Link href={data?.detail_link} className="show_room_button">
                    Explore Showroom
                    <span>→</span>
                
                </Link>
            </div>
        </div>
    );
}