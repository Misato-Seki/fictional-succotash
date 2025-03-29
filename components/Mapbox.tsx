'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import Marker from './Marker';
import Popup from './Popup';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';


interface TrainLocation {
  trainNumber: number
  location: number[]
  speed: number
}

interface Train {
  trainNumber?: number
  speed?: number
  trainType?: string; // ex: IC
  trainCategory?: string; // ex: Long-distance
  location: number[]
}

const Mapbox = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [trainLocation, setTrainLocation] = useState<TrainLocation[]>([])
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

  const fetchTrainData = async(trainNumber: number) => {
    try {
      const data = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/train?train_number=${trainNumber}`)
        .then(d => d.json())
      return data
    } catch (error) {
      console.error(error)
      return null
    }
  }

  const handleMarkerClick = async(train: TrainLocation) => {
    await fetchTrainData(train.trainNumber).then((data) => {
      setActiveFeature({
        trainNumber: train.trainNumber,
        speed: train.speed,
        location: train.location,
        trainType: data[0]?.trainType, // ex: IC
        trainCategory: data[0]?.trainCategory // ex: Long-distance
      })
    })
}

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? '';
    
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: [24.945, 60.192], // starting position [lng, lat]
      zoom: 9 // starting zoom
    });

    const map = mapRef.current

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      marker: false
    })

    map.addControl(geocoder, 'top-right')

    geocoder.on('result', (e) => {
      if (e.result && e.result.center) {
        map.flyTo({center: e.result.center, zoom: 9})
      }

    })

    mapRef.current.on('load', () => {
      getBboxAndFetch()

      const intervalID = setInterval(() => {
        getBboxAndFetch()
      }, 1000*60*10)

      return ()=> clearInterval(intervalID)
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
      {mapRef.current && trainLocation && trainLocation?.map((item) => {
        return (
          <Marker
              key={item.trainNumber}
              map={mapRef.current!}
              train={item}
              isActive={activeFeature?.trainNumber === item.trainNumber}
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