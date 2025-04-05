import { useEffect, useRef } from "react"
import mapboxgl from "mapbox-gl"
import { createPortal } from "react-dom";
import { TrainLocation, Train } from "./Mapbox";

interface MarkerProps {
    map: mapboxgl.Map
    train: TrainLocation
    isActive: boolean
    fetchTrainData: (searchTrainNumber: number) => Promise<Train[]>;
    setActiveFeature: (train: Train | undefined) => void;
}

const Marker: React.FC<MarkerProps> = ({ map, train, isActive, fetchTrainData, setActiveFeature }) => {

    const markerRef = useRef<mapboxgl.Marker | null>(null)
    const contentRef = useRef(document.createElement("div"));

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
        markerRef.current = new mapboxgl.Marker(contentRef.current)
            .setLngLat([train.location[0], train.location[1]])
            .addTo(map)

        return () => {
            if(markerRef.current) {
                markerRef.current.remove()
                markerRef.current = null
            }
        }
    }, [map, train.location])

    return (
        <>
            {createPortal(
                <div
                    onClick={() => handleMarkerClick(train)}
                    style={{
                        display: "inline-block",
                        padding: "10px 10px",
                        borderRadius: "50px",
                        backgroundColor: isActive ? "#00A149" : "#5CE65C",
                        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.5)",
                    }}
                />,
                contentRef.current
            )}
        </>
    )
}

export default Marker