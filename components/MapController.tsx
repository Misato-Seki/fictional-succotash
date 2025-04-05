import { TrainFront } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Train, TrainLocation } from './Mapbox';
import DialogDisplay from './DialogDisplay';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
 
interface MapControllerProps {
    mapRef: React.RefObject<mapboxgl.Map | null>;
    fetchTrainData: (searchTrainNumber: number) => Promise<Train[]>;
    setActiveFeature: (train: Train) => void;
}

const MapController: React.FC<MapControllerProps> = ({mapRef, fetchTrainData, setActiveFeature}) => {
    const [searchTrainNumber, setSearchTrainNumber] = useState<string>('')
    const [showDialog, setShowDialog] = useState<boolean>(false)
    const [isMobile, setIsMobile] = useState<boolean>(false)

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

    useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth < 768)
      }
      handleResize()
      window.addEventListener('resize', handleResize)

      return () => window.removeEventListener('resize', handleResize)
    },[])

    return (
      <>
        {isMobile ? (
          // Mobile Menu
            <div className='absolute bottom-4 right-4'>
              <Drawer>
                <DrawerTrigger asChild>
                  <Button variant="outline">Search</Button>
                </DrawerTrigger>
                <DrawerContent>
                  <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader>
                      <DrawerTitle
                        className="flex flex-row text-[#00A149] text-2xl cursor-pointer" 
                        onClick={handleReload}
                      >
                        <TrainFront size={32}/>
                        <p>Train Tracker</p>
                      </DrawerTitle>
                    </DrawerHeader>
                    <div className='p-4'>
                      {/* Train No. Search Box */}
                      <div className='flex flex-col gap-3 mb-3'>
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
                            className='grow p-2 rounded-md font-sans shadow'
                        />
                      </div>
                      {/* City Search Box */}
                      <div className='flex flex-col gap-3'>
                        <p className='grow'>City</p>
                        <div id='geocoder-search-box' className='grow'></div>
                      </div>
                    </div>
                    <DrawerFooter>
                      <DrawerClose asChild>
                        <Button variant="outline">Close</Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </div>
                </DrawerContent>
              </Drawer>
            </div>
        ) : (
          // Desktop Menu
          <div className="absolute top-4 left-4 z-10 p-4 bg-white bg-opacity-80 rounded-lg shadow-lg">
            {/* Logo */}
            <div 
              className="flex flex-row m-3 text-[#00A149] text-xl md:text-3xl cursor-pointer" 
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
                  className='grow p-2 rounded-md font-sans shadow text-sm'
              />
            </div>
            {/* City Search Box */}
            <div className='flex flex-row gap-3'>
              <p className='grow'>City</p>
              <div id='geocoder-search-box' className='grow'></div>
            </div>
          </div>
        )}
        <DialogDisplay
          isopen={showDialog}
          setIsOpen={setShowDialog}
          description='There is no train data.'
        />
      </>
    )
}
export default MapController