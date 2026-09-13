import HeroSlider from '../components/home/HeroSlider';

export default function Home() {
  return (
    <>
      <HeroSlider />


      {/* Featured Products — anchor target */}
      <section id="featured" className="bg-white py-16">
        <div className="container-main text-center">
          <h2 className="text-h2 text-dark">Featured Products</h2>
          <p className="mt-2 text-body-lg text-muted">
            Handpicked bestsellers from our marketplace
          </p>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Product cards will render here in Phase 2 */}
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-72 animate-pulse rounded-2xl bg-light-100"
              />
            ))}
          </div>
        </div>
      </section>

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
