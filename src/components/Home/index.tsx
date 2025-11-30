import Newsletter from "../Common/Newsletter";
import Categories from "./Categories";
import Hero from "./Hero";
import NewArrival from "./NewArrivals";
import PromoBanner from "./PromoBanner";
import Testimonials from "./Testimonials";

const Home = () => {
  return (
    <main>
      <Hero />
      <Categories />
      <NewArrival />
      <PromoBanner />
      <Testimonials />
      <Newsletter />
    </main>
  );
};

export default Home;
