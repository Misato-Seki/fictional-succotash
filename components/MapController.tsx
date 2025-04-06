import { X, Menu, TrainFront } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Train, TrainLocation } from './Mapbox';
import DialogDisplay from './DialogDisplay';
import { Button } from './ui/button';
 
interface MapControllerProps {
    mapRef: React.RefObject<mapboxgl.Map | null>;
    fetchTrainData: (searchTrainNumber: number) => Promise<Train[]>;
    setActiveFeature: (train: Train) => void;
}

const MapController: React.FC<MapControllerProps> = ({mapRef, fetchTrainData, setActiveFeature}) => {
    const [searchTrainNumber, setSearchTrainNumber] = useState<string>('')
    const [showDialog, setShowDialog] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>('')
    const [isPanelOpen, setIsPanelOpen] = useState<boolean>(true)
    const [isMobile, setIsMobile] = useState<boolean>(false)

    //Fetch train location data based on train number
    const fetchTrainLocationData = async(trainNumber: number): Promise<TrainLocation[] | undefined> => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/train_location?train_number=${trainNumber}`)
        
        if(!response.ok) {
            setErrorMessage(`${response.status} - ${response.statusText}`)
            setShowDialog(true)
            return
        }

        const data = await response.json()

        if(data && data.length > 0) {
          return data
        } else {
          setErrorMessage('No data found for the given train number.')
          setShowDialog(true)
          return
        }
      } catch (error) {
        console.error(error)
        setErrorMessage('Failed to fetch train data.')
        setShowDialog(true)
      }
    }

    // Handles fetching train location and data
    const handleTrainLocation = async(searchTrainNumber: number) => {
      const trainLocationData = await fetchTrainLocationData(searchTrainNumber)

      if (!trainLocationData || trainLocationData.length === 0) {
        setShowDialog(true);
        return;
      }
      
      mapRef.current?.flyTo({
        center: [trainLocationData[0].location[0], trainLocationData[0].location[1]],
        zoom: 9
      });

      const trainData = await fetchTrainData(searchTrainNumber)

      if (!trainData || trainData.length === 0) {
        setErrorMessage('No train data found.');
        setShowDialog(true);
        return;
      }

      setActiveFeature({
        trainNumber: trainLocationData[0].trainNumber,
        speed: trainLocationData[0].speed,
        trainType: trainData[0].trainType,
        trainCategory: trainData[0].trainCategory,
        location: trainLocationData[0].location
      })
    }

    // Reloads the page
    const handleReload = () => {
      window.location.reload()
    }

    // Toggles the sidebar panel visibility
    const togglePanel = () => {
      setIsPanelOpen(prev => !prev)
    }

    // Detects screen size
    useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth < 640)
      }
      handleResize()
      window.addEventListener('resize', handleResize)

      return () => window.removeEventListener('resize', handleResize)
    },[])

    return (
      <>
        {/* Toggle Button */}
        <Button
          variant='outline'
          className={`fixed top-4 left-4 z-10 transition-transform duration-300 ${isPanelOpen ? 'translate-x-[75vw]' : 'translate-x-0'} sm:hidden`}
          onClick={togglePanel}
        >
          {isPanelOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>

        <div
          className={`
            ${isMobile
              ? 'fixed top-0 left-0 h-full z-10 bg-white bg-opacity-90 shadow-lg p-4 rounded-r-xl w-3/4 transition-transform duration-300 ' +
                (isPanelOpen ? 'translate-x-0' : '-translate-x-full')
              : 'absolute top-4 left-4 z-10 bg-white bg-opacity-90 shadow-lg p-4 rounded-2xl'
            }
          `}
        >
        
          {/* Logo */}
          <div 
              className="flex flex-row mb-3 text-[#00A149] text-2xl sm:text-3xl cursor-pointer" 
              onClick={handleReload}>
              <TrainFront size={32}/>
              <p>Train Tracker</p>
          </div>

          {/* Train No. Search Box */}
          <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-3 mb-3`}>
              <p className='grow'>Train no.</p>
              <input
                  type='text'
                  placeholder='Search'
                  value={searchTrainNumber}
                  onChange={(e) => setSearchTrainNumber(e.target.value)}
                  onKeyDown={(e) => {
                      if(e.key === 'Enter' && searchTrainNumber) {
                          handleTrainLocation(Number(searchTrainNumber))
                      }
                  }}
                  className='grow p-2 rounded-md font-sans shadow sm:text-sm text-lg justify-end'
              />
          </div>

          {/* City Search Box */}
          <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-3`}>
              <p className='grow'>City</p>
              <div id='geocoder-search-box' className='grow justify-end'></div>
          </div>
        </div>
        <DialogDisplay
          isopen={showDialog}
          setIsOpen={setShowDialog}
          description={errorMessage}
        />
      </>
    )
}
export default MapController