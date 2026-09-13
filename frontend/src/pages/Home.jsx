import HeroSlider from '../components/home/HeroSlider';
import EditorsPick from '../components/home/EditorsPick';
import FeaturedProducts from '../components/home/FeaturedProducts';

export default function Home() {
  return (
    <>
      <HeroSlider />
      <EditorsPick />

      <FeaturedProducts />

      {/* About Us — anchor target */}
      <section id="about" className="bg-light py-16">
        <div className="container-main text-center">
          <h2 className="text-h2 text-dark">About Us</h2>
          <p className="mx-auto mt-4 max-w-2xl text-body-lg text-muted">
            Lumon connects buyers with passionate independent sellers.
            We believe great products should be accessible to everyone, and
            every seller deserves a fair marketplace.
          </p>
        </div>
      </section>
    </>
  );
}
