import { TrainFront } from 'lucide-react';
const Logo = () => {
    return (
      <div className="flex flex-row m-3 text-[#00A149] text-xl md:text-3xl bg-white/40 p-3 rounded-2xl items-center">
        <TrainFront size={32}/>
        <p>Train Tracker</p>
      </div>
    )
}
export default Logo