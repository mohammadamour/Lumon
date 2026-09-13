import { Link } from '@inertiajs/react';

// TODO: Replace placeholder hrefs with real category filter routes once
// the Shop page supports category query params (e.g. /products?category=men)
const CATEGORIES = [
  {
    id: 'men',
    label: 'MEN',
    image: '/category-men.png',
    href: '/products?category=men',
    span: 'large', // tall card
  },
  {
    id: 'women',
    label: 'WOMEN',
    image: '/category-women.png',
    href: '/products?category=women',
    span: 'large',
  },
  {
    id: 'accessories',
    label: 'ACCESSORIES',
    image: '/category-accessory.png',
    href: '/products?category=accessories',
    span: 'small',
  },
  {
    id: 'kids',
    label: 'KIDS',
    image: '/category-kid.webp',
    href: '/products?category=kids',
    span: 'small',
  },
];

function CategoryCard({ category }) {
  return (
    // h-full is critical — lets the Link fill its grid cell so the img is constrained
    <Link
      href={category.href}
      className="group relative block h-full w-full overflow-hidden bg-gray-100"
    >
      {/* Image */}
      <img
        src={category.image}
        alt={category.label}
        className="h-full w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
      />

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-dark/0 transition-colors duration-300 group-hover:bg-dark/20" />

      {/* Label — always visible, bottom-left white pill */}
      <div className="absolute bottom-4 left-4 bg-white px-4 py-2 shadow-sm">
        <span className="text-caption font-bold tracking-widest text-dark">
          {category.label}
        </span>
      </div>
    </Link>
  );
}

export default function EditorsPick() {
  const [men, women, accessories, kids] = CATEGORIES;

  return (
    <section className="bg-light py-16">
      <div className="container-main">
        {/* Heading */}
        <div className="mb-10 text-center">
          <h2 className="text-h2 font-bold text-dark">EDITOR'S PICK</h2>
          <p className="mt-3 text-body text-muted">
            Explore curated items across our core collections.
          </p>
        </div>

        {/* Desktop Grid: [Men | Women | Accessories / Kids]
            Explicit grid-rows so each row is exactly 300px — prevents image natural
            height from blowing out the grid. Men & Women span both rows (600px total).
            Accessories & Kids each occupy one 300px row in the third column. */}
        <div className="hidden md:grid md:grid-cols-[1fr_0.85fr_0.65fr] md:grid-rows-[300px_300px] md:gap-3">
          {/* Men — spans 2 rows, full 600px height */}
          <div className="row-span-2 h-full">
            <CategoryCard category={men} />
          </div>
          {/* Women — spans 2 rows, full 600px height, slightly narrower col */}
          <div className="row-span-2 h-full">
            <CategoryCard category={women} />
          </div>
          {/* Accessories — row 1 of col 3, 300px */}
          <div className="h-full">
            <CategoryCard category={accessories} />
          </div>
          {/* Kids — row 2 of col 3, 300px */}
          <div className="h-full">
            <CategoryCard category={kids} />
          </div>
        </div>

        {/* Mobile Stack: Men & Women full width, Accessories & Kids slightly smaller */}
        <div className="flex flex-col gap-3 md:hidden">
          <div className="h-72">
            <CategoryCard category={men} />
          </div>
          <div className="h-72">
            <CategoryCard category={women} />
          </div>
          <div className="h-52">
            <CategoryCard category={accessories} />
          </div>
          <div className="h-52">
            <CategoryCard category={kids} />
          </div>
        </div>
      </div>
    </section>
  );
}
