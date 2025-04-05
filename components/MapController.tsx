import { TrainFront } from 'lucide-react';
import { useState } from 'react';
import { Train, TrainLocation } from './Mapbox';
import DialogDisplay from './DialogDisplay';
 
interface MapControllerProps {
    mapRef: React.RefObject<mapboxgl.Map | null>;
    fetchTrainData: (searchTrainNumber: number) => Promise<Train[]>;
    setActiveFeature: (train: Train) => void;
}

const MapController: React.FC<MapControllerProps> = ({mapRef, fetchTrainData, setActiveFeature}) => {
    const [searchTrainNumber, setSearchTrainNumber] = useState<string>('')
    const [showDialog, setShowDialog] = useState<boolean>(false)
    // const [isMobile, setIsMobile] = useState<boolean>(false)

    const fetchTrainLocationData = async(trainNumber: number): Promise<TrainLocation[] | undefined> => {
      try {
        const data = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/train_location?train_number=${trainNumber}`)
          .then(d => d.json())
        return data
      } catch (error) {
        console.error(error)
      }
    }

    const handleTrainLocation = async(searchTrainNumber: number) => {
      const trainLocationData = await fetchTrainLocationData(searchTrainNumber)
      if (trainLocationData && trainLocationData.length > 0) {
        mapRef.current?.flyTo({
          center: [trainLocationData[0].location[0], trainLocationData[0].location[1]],
          zoom: 9
        });
        const trainData = await fetchTrainData(searchTrainNumber)
        if(trainData && trainData.length > 0) {
          setActiveFeature({
            trainNumber: trainLocationData[0].trainNumber,
            speed: trainLocationData[0].speed,
            trainType: trainData[0].trainType,
            trainCategory: trainData[0].trainCategory,
            location: trainLocationData[0].location
          })
        }
      }
      else {
        setShowDialog(true)
      }
    }

    const handleReload = () => {
      window.location.reload()
    }

    // useEffect(() => {
    //   const handleResize = () => {
    //     setIsMobile(window.innerWidth < 768)
    //   }
    //   handleResize()
    //   window.addEventListener('resize', handleResize)

    //   return () => window.removeEventListener('resize', handleResize)
    // },[])

    return (
      <>
        <div className='absolute top-0 w-full flex justify-center sm:justify-start z-10'>
          <div className="mt-4 p-4 bg-white bg-opacity-80 rounded-lg shadow-lg w-[90%] sm:ml-4 sm:w-auto">
            {/* Logo */}
            <div 
              className="flex flex-row mb-3 text-[#00A149] text-2xl sm:text-3xl cursor-pointer" 
              onClick={handleReload}>
              <TrainFront size={32}/>
              <p>Train Tracker</p>
            </div>
            {/* Train No. Search Box */}
            <div className='flex flex-row gap-3 mb-3'>
              <p className='grow'>Train no.</p>
              <input
                  type='string'
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
            <div className='flex flex-row gap-3'>
              <p className='grow'>City</p>
              <div id='geocoder-search-box' className='grow justify-end'></div>
            </div>
          </div>
        </div>
        <DialogDisplay
          isopen={showDialog}
          setIsOpen={setShowDialog}
          description='There is no train data.'
        />
      </>
    )
}
export default MapController