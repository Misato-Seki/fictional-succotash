'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import Marker from './Marker';
import Popup from './Popup';
import MapController from './MapController';
import DialogDisplay from './DialogDisplay';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'

export interface TrainLocation {
  trainNumber: number
  location: number[]
  speed: number
}

export interface Train {
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
  const [showDialog, setShowDialog] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')

  const getBboxAndFetch = useCallback(async() => {
    const bounds = mapRef.current ? mapRef.current.getBounds() : null
    const bbox = `${bounds?._sw.lng},${bounds?._sw.lat},${bounds?._ne.lng},${bounds?._ne.lat}`;
    try {
        const data = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/trains_location?bbox=${bbox}`)
            .then(d => d.json())
        if(data && data.length > 0) {
          setTrainLocation(data)
        } else {
          setErrorMessage('There is no trains data.')
          setShowDialog(true)
        }
    } catch (error) {
        console.error(error)
        setErrorMessage('Failed to fetch trains data.')
        setShowDialog(true)
    }
  }, [])

  const fetchTrainData = async(trainNumber: number) => {
    try {
      const data = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/train?train_number=${trainNumber}`)
        .then(d => d.json())
      if(data && data.length > 0) {
        return data
      } else {
        setErrorMessage('There is no train data.')
        setShowDialog(true)
      }
    } catch (error) {
      console.error(error)
      setErrorMessage('Failed to fetch train data.')
      setShowDialog(true)
    }
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
      marker: false,
    })

    const geocoderContainer = document.getElementById('geocoder-search-box')
    if(geocoderContainer && geocoder) {
      geocoderContainer.appendChild(geocoder.onAdd(map))
    }

    geocoder.on('result', (e) => {
      if (e.result && e.result.center) {
        map.flyTo({center: e.result.center, zoom: 9})
      }
    })

    mapRef.current.on('load', () => {
      getBboxAndFetch()

      const intervalID = setInterval(() => {
        getBboxAndFetch()
      }, 1000*10)

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
        className="map-container"
      />
      {/* Map Controller */}
      <MapController 
        mapRef={mapRef}
        fetchTrainData={fetchTrainData}
        setActiveFeature={setActiveFeature}       
      />
      {/* Marker */}
      {mapRef.current && trainLocation && trainLocation?.map((item) => {
        return (
          <Marker
              key={item.trainNumber}
              map={mapRef.current!}
              train={item}
              isActive={activeFeature?.trainNumber === item.trainNumber}
              fetchTrainData={fetchTrainData}
              setActiveFeature={setActiveFeature}
          />)
      })}
      {/* Popup */}
      {mapRef.current && (
        <Popup
            map={mapRef.current!}
            activeFeature={activeFeature}
            setActiveFeature={setActiveFeature}
        />
      )}
      {/* Dialog (Error message) */}
      <DialogDisplay
        isopen={showDialog}
        setIsOpen={setShowDialog}
        description={errorMessage}
      />
    </>
  );
};

export default Mapbox;