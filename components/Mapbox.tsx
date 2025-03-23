'use client'
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

import 'mapbox-gl/dist/mapbox-gl.css';

const Mapbox = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? '';
    
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: [24.945, 60.192], // starting position [lng, lat]
      zoom: 9 // starting zoom
    });
    return () => {
      mapRef.current?.remove();
    };
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
      }}
      ref={mapContainerRef}
      className="map-container rounded-2xl"
    />
  );
};

export default Mapbox;