import Layout from '../Components/layout/Layout';
import HeroSlider from '../Components/home/HeroSlider';
import EditorsPick from '../Components/home/EditorsPick';
import FeaturedProducts from '../Components/home/FeaturedProducts';
import FeaturesSection from '../Components/home/FeaturesSection';

export default function Home() {
  return (
    <Layout>
      <HeroSlider />
      <EditorsPick />
      <FeaturedProducts />
      <FeaturesSection />
    </Layout>
  );
}
