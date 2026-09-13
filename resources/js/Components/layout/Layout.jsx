import { Outlet } from '@inertiajs/react';
import Navbar from './Navbar';

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      {/* Footer will go here in a later phase */}
    </div>
  );
}
