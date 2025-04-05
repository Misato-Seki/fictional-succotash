import Mapbox from "@/components/Mapbox";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-auto">
      <div className="absolute top-0 left-0 w-full h-full">
        <Mapbox />
      </div>
    </div>

  );
}
