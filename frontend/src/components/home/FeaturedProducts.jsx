/**
 * FeaturedProducts — homepage bestsellers grid (Phase 2)
 * This section has id="featured" for anchor scrolling from the navbar.
 */
export default function FeaturedProducts() {
  return (
    <section id="featured" className="bg-white py-16">
      <div className="container-main text-center">
        <h2 className="text-h2 text-dark">Featured Products</h2>
        <p className="mt-2 text-body-lg text-muted">
          Handpicked bestsellers from our marketplace
        </p>
        {/* Product grid will be populated in Phase 2 */}
      </div>
    </section>
  );
}
