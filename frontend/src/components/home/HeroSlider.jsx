/**
 * HeroSlider — landing page hero section (Phase 2)
 * Will contain a full-width hero with call-to-action.
 */
export default function HeroSlider() {
  return (
    <section className="bg-gradient-to-br from-primary-50 via-white to-light py-20">
      <div className="container-main text-center">
        <h1 className="text-display text-dark">
          Discover Quality Products
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-body-lg text-muted">
          Browse curated items from independent sellers. Shop smart, support local.
        </p>
      </div>
    </section>
  );
}
