import { useState, useEffect, useRef } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { Upload, X, Image as ImageIcon, ArrowLeft } from 'lucide-react';
import Layout from '../Components/layout/Layout';
import { useToastStore } from '../store/useToastStore';
import axios from '../lib/axios';
import type { Product, Category, PageProps } from '@/types';

interface ProductFormPageProps extends PageProps {
  product?: { data: Product };
}

export default function ProductForm() {
  const { product: productWrapper } = usePage<ProductFormPageProps>().props;
  const editProduct = productWrapper?.data;
  const isEditing = !!editProduct;

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  // Form fields
  const [name, setName] = useState(editProduct?.name || '');
  const [categoryId, setCategoryId] = useState<number | ''>(editProduct?.category?.id || '');
  const [description, setDescription] = useState(editProduct?.description || '');
  const [price, setPrice] = useState(editProduct ? String(editProduct.price) : '');
  const [stock, setStock] = useState(editProduct ? String(editProduct.stock) : '');
  const [isActive, setIsActive] = useState(editProduct?.is_active ?? true);

  // Image state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(editProduct?.image_url || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch categories on mount
  useEffect(() => {
    axios.get('/api/categories').then(res => {
      setCategories(res.data.data);
    });
  }, []);

  const handleImageChange = (file: File | null) => {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, image: ['Image must be less than 2MB.'] }));
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setErrors(prev => {
      const { image, ...rest } = prev;
      return rest;
    });
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith('image/')) {
      handleImageChange(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // Use FormData for multipart upload (image)
    const formData = new FormData();
    formData.append('name', name);
    if (categoryId) formData.append('category_id', String(categoryId));
    formData.append('description', description);
    formData.append('price', price);
    formData.append('stock', stock);
    formData.append('is_active', isActive ? '1' : '0');
    if (imageFile) formData.append('image', imageFile);

    try {
      if (isEditing && editProduct) {
        // Laravel doesn't support PUT with FormData natively, use POST + _method
        formData.append('_method', 'PUT');
        await axios.post(`/api/seller/products/${editProduct.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await axios.post('/api/seller/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      useToastStore.getState().addToast(
        isEditing ? 'Product updated successfully' : 'Product listed successfully',
        'success'
      );
      router.visit('/my-products');
    } catch (err: any) {
      if (err.response?.status === 422) {
        const validationErrors = err.response.data.errors || {};
        
        // Dump the entire raw response data so we can see what's actually coming back
        const rawResponse = JSON.stringify(err.response?.data, null, 2);
        
        setErrors({ 
            ...validationErrors, 
            general: ['RAW RESPONSE: ' + rawResponse] 
        });
        useToastStore.getState().addToast('Please check the form for errors.', 'error');
      } else {
        setErrors({ general: [err.response?.data?.message || err.message || 'Something went wrong.'] });
        useToastStore.getState().addToast('An error occurred. Please try again.', 'error');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = (field: string) =>
    `w-full rounded-xl border bg-white px-4 py-3 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 ${
      errors[field]
        ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
        : 'border-gray-200 focus:border-primary focus:ring-primary/20'
    }`;

  return (
    <Layout>
      <Head title={`${isEditing ? 'Edit' : 'Add'} Product — Lumon`} />

      <section className="bg-light min-h-screen">
        <div className="container-main max-w-3xl py-8">
          {/* Back link */}
          <button
            onClick={() => router.visit('/my-products')}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft size={16} />
            Back to My Products
          </button>

          {/* Title */}
          <h1 className="text-2xl font-extrabold text-gray-900 mb-8 lg:text-3xl">
            {isEditing ? 'Edit Product' : 'Add New Product'}
          </h1>

          {/* General errors */}
          {errors.general && errors.general.length > 0 && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 flex flex-col gap-1">
              {errors.general.map((msg, i) => (
                <div key={i}>• {msg}</div>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Product Image
              </label>
              {imagePreview ? (
                <div className="relative w-48 h-48 rounded-2xl overflow-hidden border border-gray-200 group">
                  <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 py-12 transition-colors hover:border-primary/40 hover:bg-primary/5"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm border border-gray-100">
                    <Upload size={20} className="text-gray-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-700">
                      Click to upload or drag & drop
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      JPG, PNG, or WebP — max 2MB
                    </p>
                  </div>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
                className="hidden"
              />
              {errors.image && <p className="mt-1.5 text-xs text-red-500">{errors.image[0]}</p>}
            </div>

            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Product Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Premium Cotton T-Shirt"
                className={inputClasses('name')}
              />
              {errors.name && <p className="mt-1.5 text-xs text-red-500">{errors.name[0]}</p>}
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
                Category
              </label>
              <select
                id="category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : '')}
                className={inputClasses('category_id')}
              >
                <option value="">Select a category...</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              {errors.category_id && <p className="mt-1.5 text-xs text-red-500">{errors.category_id[0]}</p>}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your product..."
                className={inputClasses('description')}
              />
              {errors.description && <p className="mt-1.5 text-xs text-red-500">{errors.description[0]}</p>}
            </div>

            {/* Price & Stock — 2 columns */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-2">
                  Price ($)
                </label>
                <input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="29.99"
                  className={inputClasses('price')}
                />
                {errors.price && <p className="mt-1.5 text-xs text-red-500">{errors.price[0]}</p>}
              </div>
              <div>
                <label htmlFor="stock" className="block text-sm font-semibold text-gray-700 mb-2">
                  Stock
                </label>
                <input
                  id="stock"
                  type="number"
                  min="0"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="100"
                  className={inputClasses('stock')}
                />
                {errors.stock && <p className="mt-1.5 text-xs text-red-500">{errors.stock[0]}</p>}
              </div>
            </div>

            {/* Active Toggle */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                role="switch"
                aria-checked={isActive}
                onClick={() => setIsActive(!isActive)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isActive ? 'bg-primary' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                    isActive ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <label className="text-sm font-medium text-gray-700">
                {isActive ? 'Active — visible in shop' : 'Inactive — hidden from shop'}
              </label>
            </div>

            {/* Submit */}
            <div className="flex items-center gap-3 pt-4 border-t border-gray-100 mt-2">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-gray-800 hover:shadow-md active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? 'Saving...' : (isEditing ? 'Update Product' : 'Create Product')}
              </button>
              <button
                type="button"
                onClick={() => router.visit('/my-products')}
                className="rounded-xl px-6 py-3.5 text-sm font-bold text-gray-600 transition-colors hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </section>
    </Layout>
  );
}
