/**
 * AboutSection — homepage about section (Phase 2)
 * This section has id="about" for anchor scrolling from the navbar.
 */
export default function AboutSection() {
  return (
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
  );
}
