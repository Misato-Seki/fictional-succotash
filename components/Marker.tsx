import { useEffect, useRef } from "react"
import mapboxgl from "mapbox-gl"
import { createPortal } from "react-dom";

interface MarkerProps {
    map: mapboxgl.Map
    train: Train
    isActive: boolean
    onClick: (train: Train) => void
}

interface Train {
    trainNumber: number
    location: number[]
  }

const Marker: React.FC<MarkerProps> = ({ map, train, isActive, onClick }) => {

    const markerRef = useRef()
    const contentRef = useRef(document.createElement("div"));

    useEffect(() => {
        markerRef.current = new mapboxgl.Marker(contentRef.current)
            .setLngLat([train.location[0], train.location[1]])
            .addTo(map)

        return () => {
             markerRef.current.remove()
        }
    }, [])

    return (
        <>
            {createPortal(
                <div
                    onClick={() => onClick(train)}
                    style={{
                        display: "inline-block",
                        padding: "10px 10px",
                        borderRadius: "50px",
                        backgroundColor: isActive ? "#008000" : "#5CE65C",
                        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.5)",
                    }}
                />,
                contentRef.current
            )}
        </>
    )
}

export default Marker