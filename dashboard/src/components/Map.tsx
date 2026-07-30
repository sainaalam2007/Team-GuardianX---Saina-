"use client";

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with Next.js
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom icons
const hazardIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const riderIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface Hazard {
  hazard_id: string;
  type: string;
  location: { lat: number; lng: number };
  reported_by: string;
}

interface MapProps {
  riderLocation: { lat: number; lng: number };
  hazards: Hazard[];
}

// Component to recenter map when rider moves
function RecenterAutomatically({ lat, lng }: { lat: number, lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng]);
  }, [lat, lng, map]);
  return null;
}

export default function Map({ riderLocation, hazards }: MapProps) {
  // Return null on SSR
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <div className="h-full w-full bg-slate-900 animate-pulse rounded-xl"></div>;

  return (
    <div className="h-full w-full relative z-0 rounded-xl overflow-hidden shadow-2xl border border-slate-700/50">
      <MapContainer 
        center={[riderLocation.lat, riderLocation.lng]} 
        zoom={16} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        <RecenterAutomatically lat={riderLocation.lat} lng={riderLocation.lng} />
        
        <Marker position={[riderLocation.lat, riderLocation.lng]} icon={riderIcon}>
          <Popup className="bg-slate-900 text-white border-slate-700">
            <div className="font-bold text-blue-400">Rider Location</div>
            <div>Lat: {riderLocation.lat.toFixed(4)}</div>
            <div>Lng: {riderLocation.lng.toFixed(4)}</div>
          </Popup>
        </Marker>

        {hazards.map(hazard => (
          <Marker key={hazard.hazard_id} position={[hazard.location.lat, hazard.location.lng]} icon={hazardIcon}>
            <Popup>
              <div className="font-bold text-red-500">Hazard: {hazard.type}</div>
              <div className="text-sm">Reported by: {hazard.reported_by}</div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
