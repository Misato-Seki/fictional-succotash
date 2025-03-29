import Mapbox from "@/components/Mapbox";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-auto">
      <div className="absolute top-0 left-0 p-4 rounded-2xl bg-green-200 z-100">
        <p>Train Tracker</p>
      </div>
      <div className="absolute top-0 right-0 p-4 rounded-2xl bg-green-200 z-100">
        <p>Search Bar</p>
      </div>
      <div className="absolute top-0 left-0 w-full h-full">
        <Mapbox />
      </div>
    </div>

  );
}
