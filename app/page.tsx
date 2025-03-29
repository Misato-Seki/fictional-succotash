import Mapbox from "@/components/Mapbox";
import Logo from "@/components/Logo";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-auto">
      <div className="hidden sm:block sm:absolute sm:top-0 sm:left-0 sm:z-10">
        <Logo />
      </div>
      <div className="absolute top-0 left-0 w-full h-full">
        <Mapbox />
      </div>
    </div>

  );
}
