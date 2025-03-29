'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import Marker from './Marker';
import Popup from './Popup';

import 'mapbox-gl/dist/mapbox-gl.css';

interface Train {
  trainNumber: number
  location: number[]
}

const Mapbox = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [trainLocation, setTrainLocation] = useState<Train[]>([])
  const [activeFeature, setActiveFeature] = useState<Train>()

  const getBboxAndFetch = useCallback(async() => {
    const bounds = mapRef.current ? mapRef.current.getBounds() : null
    const bbox = `${bounds?._sw.lng},${bounds?._sw.lat},${bounds?._ne.lng},${bounds?._ne.lat}`;
    try {
        const data = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/traffic?bbox=${bbox}`)
            .then(d => d.json())

        setTrainLocation(data)
    } catch (error) {
        console.error(error)
    }
  }, [])

  const handleMarkerClick = (train: Train) => {
    setActiveFeature(train)
}


  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? '';
    
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: [24.945, 60.192], // starting position [lng, lat]
      zoom: 9 // starting zoom
    });

    mapRef.current.on('load', () => {
      getBboxAndFetch()
    })

    mapRef.current.on('moveend', () => {
        getBboxAndFetch()
    })

    return () => {
      mapRef.current?.remove();
    };
  }, [getBboxAndFetch]);

  return (
    <>
      <div
        style={{
          width: "100%",
          height: "100%",
        }}
        ref={mapContainerRef}
        className="map-container rounded-2xl"
      />
      {mapRef.current && trainLocation && trainLocation?.map((train) => {
        return (
          <Marker
              key={train.trainNumber}
              map={mapRef.current!}
              train={train}
              isActive={activeFeature?.trainNumber === train.trainNumber}
              onClick={handleMarkerClick}
          />)
      })}
      {mapRef.current && (
        <Popup
            map={mapRef.current!}
            activeFeature={activeFeature}
        />
      )}
    </>
  );
};

export default Mapbox;