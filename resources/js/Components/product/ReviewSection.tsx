import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { usePage } from '@inertiajs/react';
import { Star, Edit2, Trash2 } from 'lucide-react';
import StarRating from '../common/StarRating';
import type { Review, Product, PageProps } from '@/types';

interface ReviewSectionProps {
  product: Product;
}

interface ReviewResponse {
  data: Review[];
  meta: {
    current_page: number;
    last_page: number;
    total: number;
  };
}

export default function ReviewSection({ product }: ReviewSectionProps) {
  const { auth } = usePage<PageProps>().props;
  const user = auth.user;

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalReviews, setTotalReviews] = useState(0);

  // Form State
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Edit State
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);

  const fetchReviews = async (pageNumber = 1) => {
    try {
      setLoading(true);
      const res = await axios.get<ReviewResponse>(`/api/products/${product.slug}/reviews?page=${pageNumber}`);
      
      if (pageNumber === 1) {
        setReviews(res.data.data);
      } else {
        setReviews((prev) => [...prev, ...res.data.data]);
      }
      
      setLastPage(res.data.meta.last_page);
      setTotalReviews(res.data.meta.total);
    } catch (err) {
      console.error('Failed to fetch reviews', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [product.slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (editingReviewId) {
        // Update review
        const res = await axios.put(`/api/reviews/${editingReviewId}`, { rating, comment });
        setReviews(reviews.map(r => r.id === editingReviewId ? res.data.data : r));
        setEditingReviewId(null);
      } else {
        // Create review
        const res = await axios.post(`/api/products/${product.slug}/reviews`, { rating, comment });
        setReviews([res.data.data, ...reviews]);
        setTotalReviews(prev => prev + 1);
      }
      
      setRating(5);
      setComment('');
      // Ideally, trigger a refresh of the product data to update the average rating
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete your review?')) return;
    
    try {
      await axios.delete(`/api/reviews/${id}`);
      setReviews(reviews.filter(r => r.id !== id));
      setTotalReviews(prev => prev - 1);
    } catch (err) {
      console.error('Failed to delete review', err);
    }
  };

  const handleEditClick = (review: Review) => {
    setEditingReviewId(review.id);
    setRating(review.rating);
    setComment(review.comment || '');
  };

  const cancelEdit = () => {
    setEditingReviewId(null);
    setRating(5);
    setComment('');
  };

  const hasReviewed = reviews.some(r => r.user.id === user?.id) && !editingReviewId;
  const isSellerOfProduct = product.seller?.id === user?.id;

  // Distribution chart calculation (mocked if backend doesn't provide it directly, we'll approximate based on what we have, 
  // or just show placeholders for the chart if we don't fetch all ratings)
  // For now, we'll just show the average rating prominently.
  
  return (
    <div className="flex flex-col gap-8">
      {/* ── Summary ── */}
      <div className="flex flex-col items-center justify-center py-6 bg-gray-50 rounded-2xl md:flex-row md:justify-around md:py-8">
        <div className="text-center mb-6 md:mb-0">
          <h3 className="text-5xl font-black text-gray-900">{product.average_rating.toFixed(1)}</h3>
          <div className="flex justify-center my-2">
            <StarRating rating={product.average_rating} />
          </div>
          <p className="text-sm text-gray-500">Based on {product.review_count} {product.review_count === 1 ? 'review' : 'reviews'}</p>
        </div>

        {/* Placeholder for distribution bars */}
        <div className="w-full max-w-xs space-y-2">
           {[5, 4, 3, 2, 1].map(star => (
             <div key={star} className="flex items-center text-sm">
               <span className="w-8 font-medium text-gray-600">{star} <Star size={12} className="inline text-gray-400 -mt-0.5" /></span>
               <div className="flex-1 h-2 mx-3 bg-gray-200 rounded-full overflow-hidden">
                 <div className="h-full bg-yellow-400 rounded-full" style={{ width: star >= 4 ? '60%' : star === 3 ? '20%' : '5%' }}></div>
               </div>
             </div>
           ))}
        </div>
      </div>

      {/* ── Form ── */}
      {user ? (
        !isSellerOfProduct ? (
          !hasReviewed ? (
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h4 className="text-lg font-bold text-gray-900 mb-4">{editingReviewId ? 'Edit Your Review' : 'Write a Review'}</h4>
              
              {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl">{error}</div>}
              
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className={`p-1 transition-transform hover:scale-110 focus:outline-none`}
                      >
                        <Star size={28} className={star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">Review Comment (Optional)</label>
                  <textarea
                    id="comment"
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="What did you like or dislike?"
                    className="w-full rounded-xl border-gray-200 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-3"
                  />
                </div>

                <div className="flex items-center gap-3 mt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-xl bg-gray-900 px-6 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-gray-800 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Submitting...' : (editingReviewId ? 'Update Review' : 'Submit Review')}
                  </button>
                  {editingReviewId && (
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="rounded-xl bg-gray-100 px-6 py-3 text-sm font-bold text-gray-700 transition-all hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-2xl p-6 text-center text-gray-600">
              You have already reviewed this product.
            </div>
          )
        ) : (
           <div className="bg-gray-50 rounded-2xl p-6 text-center text-gray-600">
             You cannot review your own product.
           </div>
        )
      ) : (
        <div className="bg-gray-50 rounded-2xl p-6 text-center">
          <p className="text-gray-600 mb-3">Please log in to leave a review.</p>
          <a href="/login" className="inline-block rounded-xl bg-gray-900 px-6 py-2.5 text-sm font-bold text-white hover:bg-gray-800">
            Log In
          </a>
        </div>
      )}

      {/* ── Reviews List ── */}
      <div className="mt-4">
        <h4 className="text-xl font-bold text-gray-900 mb-6">Recent Reviews</h4>
        
        {reviews.length === 0 && !loading ? (
          <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to share your thoughts!</p>
        ) : (
          <div className="flex flex-col gap-6">
            {reviews.map(review => (
              <div key={review.id} className="pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                      {review.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{review.user.name}</p>
                      <p className="text-xs text-gray-500">{review.created_at}</p>
                    </div>
                  </div>
                  
                  {review.is_owner && (
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleEditClick(review)} className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors" title="Edit">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(review.id)} className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="mt-1 mb-3">
                  <StarRating rating={review.rating} />
                </div>
                
                {review.comment && (
                  <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {loading && (
          <div className="py-6 text-center">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          </div>
        )}

        {page < lastPage && !loading && (
          <div className="mt-8 text-center">
            <button
              onClick={() => setPage(p => p + 1)}
              className="rounded-xl border border-gray-200 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Load More Reviews
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
