import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import mapboxgl from 'mapbox-gl'
import { Train } from "./Mapbox"

interface PopupProps {
    map: mapboxgl.Map
    activeFeature: Train | undefined
    setActiveFeature: (train: Train | undefined) => void;
}

const Popup: React.FC<PopupProps> = ({ map, activeFeature, setActiveFeature }) => {

  // a ref to hold the popup instance
  const popupRef = useRef<mapboxgl.Popup | null>(null)
  // a ref for an element to hold the popup's content
  const contentRef = useRef(document.createElement("div"))

  // instantiate the popup on mount, remove it on unmount
  useEffect(() => {
    if (!map) return

    // create a new popup instance, but do not set its location or content yet
    popupRef.current = new mapboxgl.Popup({
      closeOnClick: true,
      offset: 20
    })

    return () => {
      if(popupRef.current) {
        popupRef.current.remove()
      }
    }
  }, [map])


  // when activeFeature changes, set the popup's location and content, and add it to the map
  useEffect(() => {
    if (!activeFeature || !popupRef.current) return

    const handlePopupClose = () => {
      setActiveFeature(undefined)
    }

    popupRef.current
      .setLngLat([activeFeature.location[0], activeFeature.location[1]]) // set its position using activeFeature's geometry
      .setHTML(contentRef.current.outerHTML) // use contentRef's `outerHTML` to set the content of the popup
      .addTo(map) // add the popup to the map

    popupRef.current.on('close', handlePopupClose)
  }, [map, activeFeature, setActiveFeature])
  
  return (
    <>{
      createPortal(
        <div className="portal-content text-base p-2">
          <table>
            <tbody>
              <tr>
                <td className="pr-3"><strong>Train No.</strong></td>
                <td>{activeFeature?.trainNumber}</td>
              </tr>
              <tr>
                <td className="pr-3"><strong>Speed</strong></td>
                <td>{activeFeature?.speed} km/h</td>
              </tr>
              <tr>
                <td className="pr-3"><strong>Train Type</strong></td>
                <td>{activeFeature?.trainType}</td>
              </tr>
              <tr>
                <td className="pr-3"><strong>Train Category </strong></td>
                <td> {activeFeature?.trainCategory}</td>
              </tr>
            </tbody>
          </table>
        </div>,
        contentRef.current
      )
    }</>
  )
}

export default Popup