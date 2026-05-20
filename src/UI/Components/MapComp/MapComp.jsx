// components/StoreLocationMap.js
import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import './MapComp.css'

// Fix for marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// ✅ Define your custom destination icon
// const destinationIcon = L.divIcon({
//   className: "loader-icon",
//   html: '<div class="loader-dest"></div>',
//   iconSize: [20, 20],
//   iconAnchor: [10, 10],
// });

const containerStyle = {
  width: "100%",
  height: "100%",
};


function FitBounds({ storesData, selectedLocation, defaultCenter }) {
  const map = useMap();

  useEffect(() => {
    if (selectedLocation?.lat && selectedLocation?.lng) {
      // Single location → zoom in
      map.setView(
        [parseFloat(selectedLocation.lat), parseFloat(selectedLocation.lng)],
        20
      );
    } else if (storesData?.length > 0) {
      // Multiple locations → fit all in view
      const bounds = L.latLngBounds(
        storesData.map(store => [
          parseFloat(store.latitude),
          parseFloat(store.longitude),
        ])
      );
      map.fitBounds(bounds, { padding: [50, 50] }); 
    } else {
      // No data → center on default
      map.setView(defaultCenter, 12);
    }
  }, [storesData, selectedLocation, defaultCenter, map]);

  return null;
}

export default function StoreLocationMap({ storesData, selectedLocation }) {
  const defaultCenter = [39.9526, -75.1652]; // Philadelphia

//   const sourceIcon = L.divIcon({
//     className: "loader-icon",
//     html: '<div class="loader"></div>',
//     iconSize: [20, 20],
//     iconAnchor: [10, 10],
//   });

  const destinationIcon = L.divIcon({
    className: "loader-icon",
    html: '<div class="loader-dest"></div>',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });

  const isValidLocation =
    selectedLocation?.lat !== null &&
    selectedLocation?.lng !== null &&
    !isNaN(selectedLocation.lat) &&
    !isNaN(selectedLocation.lng);

  const mapCenter = isValidLocation
    ? [parseFloat(selectedLocation.lat), parseFloat(selectedLocation.lng)]
    : defaultCenter;

  const zoomLevel = isValidLocation ? 20 : 12;

  return (
    <div style={containerStyle}>
      <MapContainer 
        center={mapCenter} 
        zoom={zoomLevel} 
        style={containerStyle} 
        scrollWheelZoom
    >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {storesData?.map((store, index) => (
          <Marker
            key={index}
            position={[parseFloat(store.latitude), parseFloat(store.longitude)]}
            icon={destinationIcon}
          >
            <Popup>
              <strong>{store.name}</strong><br />
              {store.address_1 || ""}<br />
              {store.phone}
            </Popup>
          </Marker>
        ))}

        <FitBounds
          storesData={storesData}
          selectedLocation={selectedLocation}
          defaultCenter={defaultCenter}
        />


      </MapContainer>
    </div>
  );
}
