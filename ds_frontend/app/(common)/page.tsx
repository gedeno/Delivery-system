import Image from "next/image";
import Hero from "../../components/home/home";
import FoodBrowse from "../../components/home/Foodbrowse";
import HowItWorks from "../../components/home/Howitwork";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-between">
      <Hero/>
      <FoodBrowse/>
      <HowItWorks/>
      
    </div>
  );
}
