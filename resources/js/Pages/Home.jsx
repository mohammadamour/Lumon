import Layout from '../Components/layout/Layout';
import HeroSlider from '../Components/home/HeroSlider';
import EditorsPick from '../Components/home/EditorsPick';
import FeaturedProducts from '../Components/home/FeaturedProducts';
import FeaturesSection from '../Components/home/FeaturesSection';
import TestimonialSection from '../Components/home/TestimonialSection';
import NewsletterSection from '../Components/home/NewsletterSection';

export default function Home() {
  return (
    <Layout>
      <HeroSlider />
      <EditorsPick />
      <FeaturedProducts />
      <FeaturesSection />
      <TestimonialSection />
      <NewsletterSection />
    </Layout>
  );
}
