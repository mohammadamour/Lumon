import { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { useCartStore } from '../store/useCartStore';
import { CheckCircle2, ChevronRight, Lock, MapPin, Truck, AlertCircle } from 'lucide-react';
import Layout from '../Components/layout/Layout';

// Mock types
type Step = 1 | 2 | 3;

export default function Checkout() {
  const { items, getSubtotal, getTax, getTotal, clearCart } = useCartStore();
  const [step, setStep] = useState<Step>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Guard empty cart (if they load page manually)
  useEffect(() => {
    if (items.length === 0 && step !== 3) {
      router.visit('/products');
    }
  }, [items.length, step]);

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitShipping = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const placeOrder = () => {
    setIsProcessing(true);
    // Simulate API call to POST /api/checkout
    setTimeout(() => {
      setIsProcessing(false);
      setStep(3);
      clearCart();
    }, 2000);
  };

  if (items.length === 0 && step !== 3) {
    return null; // Will redirect via useEffect
  }

  return (
    <Layout>
      <Head title="Checkout — Lumon" />

      <div className="bg-light min-h-screen py-10">
        <div className="container-main max-w-5xl">
          
          {/* ── Stepper ── */}
          <div className="mb-10 flex items-center justify-center">
            <div className="flex items-center gap-2">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${step >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
                1
              </div>
              <span className={`text-sm font-semibold ${step >= 1 ? 'text-gray-900' : 'text-gray-500'}`}>Shipping</span>
            </div>
            <div className={`mx-4 h-0.5 w-16 ${step >= 2 ? 'bg-primary' : 'bg-gray-200'}`} />
            
            <div className="flex items-center gap-2">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${step >= 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
                2
              </div>
              <span className={`text-sm font-semibold ${step >= 2 ? 'text-gray-900' : 'text-gray-500'}`}>Review</span>
            </div>
            <div className={`mx-4 h-0.5 w-16 ${step >= 3 ? 'bg-primary' : 'bg-gray-200'}`} />
            
            <div className="flex items-center gap-2">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${step >= 3 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
                3
              </div>
              <span className={`text-sm font-semibold ${step >= 3 ? 'text-gray-900' : 'text-gray-500'}`}>Confirmation</span>
            </div>
          </div>

          {step === 3 ? (
            // ── Step 3: Confirmation ──
            <div className="mx-auto max-w-lg rounded-2xl bg-white p-10 text-center shadow-card">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
                <CheckCircle2 size={40} />
              </div>
              <h2 className="mt-6 text-2xl font-extrabold text-gray-900">Order Confirmed!</h2>
              <p className="mt-2 text-gray-600">
                Thank you for your purchase. Your order number is <strong>LMN-{Math.floor(Math.random() * 1000000)}</strong>.
                We'll email you a confirmation with tracking info shortly.
              </p>
              
              <Link
                href="/products"
                className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-gray-900 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-gray-800"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
              
              {/* ── Main Form Area ── */}
              <div className="lg:col-span-7 xl:col-span-8">
                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-card lg:p-8">
                  {step === 1 && (
                    <form onSubmit={submitShipping}>
                      <h2 className="mb-6 flex items-center gap-2 text-xl font-extrabold text-gray-900">
                        <Truck className="text-primary" />
                        Shipping Address
                      </h2>
                      
                      <div className="grid gap-5 sm:grid-cols-2">
                        <div className="space-y-1.5">
                          <label className="text-sm font-bold text-gray-700">First Name</label>
                          <input required name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full rounded-xl border-gray-300 bg-gray-50 px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-sm font-bold text-gray-700">Last Name</label>
                          <input required name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full rounded-xl border-gray-300 bg-gray-50 px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                        </div>
                        <div className="space-y-1.5 sm:col-span-2">
                          <label className="text-sm font-bold text-gray-700">Address</label>
                          <input required name="address" value={formData.address} onChange={handleInputChange} className="w-full rounded-xl border-gray-300 bg-gray-50 px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-sm font-bold text-gray-700">City</label>
                          <input required name="city" value={formData.city} onChange={handleInputChange} className="w-full rounded-xl border-gray-300 bg-gray-50 px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                        </div>
                        <div className="space-y-1.5 sm:col-span-2 md:col-span-1">
                          <label className="text-sm font-bold text-gray-700">State / Province</label>
                          <input required name="state" value={formData.state} onChange={handleInputChange} className="w-full rounded-xl border-gray-300 bg-gray-50 px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                        </div>
                        <div className="space-y-1.5 sm:col-span-2 md:col-span-1">
                          <label className="text-sm font-bold text-gray-700">ZIP Code</label>
                          <input required name="zip" value={formData.zip} onChange={handleInputChange} className="w-full rounded-xl border-gray-300 bg-gray-50 px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                        </div>
                      </div>

                      <button type="submit" className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-6 py-4 text-sm font-bold text-white shadow-sm transition-all hover:bg-gray-800">
                        Continue to Review <ChevronRight size={18} />
                      </button>
                    </form>
                  )}

                  {step === 2 && (
                    <div>
                      <h2 className="mb-6 flex items-center gap-2 text-xl font-extrabold text-gray-900">
                        <CheckCircle2 className="text-primary" />
                        Review Your Order
                      </h2>
                      
                      <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-5">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-gray-900 flex items-center gap-2">
                            <MapPin size={16} className="text-gray-400" />
                            Shipping To
                          </h3>
                          <button onClick={() => setStep(1)} className="text-sm font-semibold text-primary hover:underline">Edit</button>
                        </div>
                        <p className="mt-3 text-sm text-gray-600">
                          {formData.firstName} {formData.lastName}<br />
                          {formData.address}<br />
                          {formData.city}, {formData.state} {formData.zip}
                        </p>
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-2">Items</h3>
                        {items.map((item) => (
                          <div key={item.product.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="h-12 w-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-200">
                                {item.product.image_url && <img src={item.product.image_url} alt="" className="h-full w-full object-cover" />}
                              </div>
                              <div>
                                <p className="text-sm font-bold text-gray-900 line-clamp-1">{item.product.name}</p>
                                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                              </div>
                            </div>
                            <p className="text-sm font-bold text-gray-900">
                              ${(Number(item.product.price) * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="mt-8 flex items-start gap-3 rounded-lg bg-yellow-50 p-4 text-yellow-800">
                        <AlertCircle size={20} className="shrink-0 mt-0.5 text-yellow-600" />
                        <p className="text-sm leading-relaxed">
                          This is a demo environment. No real payment will be processed. Clicking "Place Order" will clear your cart.
                        </p>
                      </div>

                      <button 
                        onClick={placeOrder} 
                        disabled={isProcessing}
                        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-sm font-bold text-white shadow-md transition-all hover:bg-primary-500 disabled:opacity-50"
                      >
                        <Lock size={16} />
                        {isProcessing ? 'Processing...' : `Pay $${getTotal().toFixed(2)}`}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* ── Order Summary Sidebar ── */}
              <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24">
                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-card">
                  <h3 className="text-lg font-extrabold text-gray-900 mb-5">Order Summary</h3>
                  
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal ({items.length} items)</span>
                      <span className="font-semibold text-gray-900">${getSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Shipping</span>
                      <span className="font-semibold text-emerald-600">Free</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Estimated Tax (8%)</span>
                      <span className="font-semibold text-gray-900">${getTax().toFixed(2)}</span>
                    </div>
                    
                    <hr className="border-gray-100 my-4" />
                    
                    <div className="flex justify-between text-xl font-extrabold text-gray-900">
                      <span>Total</span>
                      <span>${getTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
