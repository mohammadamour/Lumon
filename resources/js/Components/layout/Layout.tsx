import React, { ReactNode, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import CartDrawer from '../cart/CartDrawer';
import ToastContainer from '../common/ToastContainer';
import { useWishlistStore } from '../../store/useWishlistStore';
import { usePage } from '@inertiajs/react';
import { PageProps } from '@/types';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { fetchIds } = useWishlistStore();
  const { props } = usePage<PageProps>();

  useEffect(() => {
    if (props.auth?.user) {
      fetchIds();
    }
  }, [props.auth?.user, fetchIds]);

  return (
    <div className="flex min-h-screen flex-col relative">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <CartDrawer />
      <ToastContainer />
    </div>
  );
}
