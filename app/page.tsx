import Mapbox from "@/components/Mapbox";

export default function Home() {
  return (
    <div className="flex flex-row min-h-screen overflow-auto">
      <div className="w-1/5 p-4 rounded-2xl bg-green-200 my-3 ml-3">
        <p>Search Bar</p>
      </div>
      <div className="flex-auto rounded-4xl m-3">
        <Mapbox />
      </div>
    </div>

  );
}
