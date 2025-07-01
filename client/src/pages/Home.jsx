import Banner from "../components/Banner";
import Header from "../components/Header";
import Speciality from "../components/Speciality";
import TopDoctors from "../components/TopDoctors";

export default function Home() {
  return (
    <div>
      <Header/>
      <Speciality/>
      <TopDoctors/>
      <Banner/>
    </div>
  )
}
