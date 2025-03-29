import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import mapboxgl from 'mapbox-gl'

interface PopupProps {
    map: mapboxgl.Map
    activeFeature: Train | undefined
}

interface Train {
    trainNumber: number
    location: number[]
  }

const Popup: React.FC<PopupProps> = ({ map, activeFeature }) => {

  // a ref to hold the popup instance
  const popupRef = useRef<mapboxgl.Popup | null>(null)
  // a ref for an element to hold the popup's content
  const contentRef = useRef(document.createElement("div"))

  // instantiate the popup on mount, remove it on unmount
  useEffect(() => {
    if (!map) return

    // create a new popup instance, but do not set its location or content yet
    popupRef.current = new mapboxgl.Popup({
      closeOnClick: false,
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

    popupRef.current
      .setLngLat([activeFeature.location[0], activeFeature.location[1]]) // set its position using activeFeature's geometry
      .setHTML(contentRef.current.outerHTML) // use contentRef's `outerHTML` to set the content of the popup
      .addTo(map) // add the popup to the map
  }, [map, activeFeature])

  // use a react portal to render the content to show in the popup, assigning it to contentRef
  return (
    <>{
      createPortal(
        <div className="portal-content">
          <table>
            <tbody>
              <tr>
                <td><strong>Train No.</strong></td>
                <td>{activeFeature?.trainNumber}</td>
              </tr>
              <tr>
                <td><strong>AAA</strong></td>
                <td>aaa</td>
              </tr>
              <tr>
                <td><strong>BBB</strong></td>
                <td>bbb</td>
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