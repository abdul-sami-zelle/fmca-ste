import React, { useState, useEffect } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";


const containerStyle = {
  width: "100%",
  height: "100%",
};

const mapOptions = {
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: false,
  zoomControl: true,
  draggable: true,
  disableDefaultUI: true,
};

function StoreLocationMap({ storesData,selectedLocation }) {




  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyBhUqdMX-GUuJUlMuEj7oggAkLuDkVdjbU",
  });


  if (!isLoaded) return <div>Loading...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={(selectedLocation.lat ===null || selectedLocation.lng ===null) ? { lat: 39.9526, lng: -75.1652 } : selectedLocation} // Default center
      zoom={(selectedLocation.lat ===null || selectedLocation.lng ===null) ? 8.6 : 18} // Adjust zoom on selection
      options={mapOptions}
    >
      {storesData?.map((location, index) => (
        <Marker
          key={index}
          position={{ lat: parseFloat(location.latitude), lng: parseFloat(location.longitude) }}
        />
      ))}
    </GoogleMap>
  );
}

export default StoreLocationMap;
