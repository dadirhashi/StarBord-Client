import { useEffect, useState } from 'react';
import { reviewsApi } from './reviewsApi';
import styles from './ReviewsPage.module.css';

// TEMP: hardcode until we build the Businesses page.
// Paste the businessId you just used to seed the mock Google reviews.
const TEMP_BUSINESS_ID = 'bf88faf5-e4ca-4f8e-bf33-21555109f437';

const renderStars = (rating) => '★'.repeat(rating) + '☆'.repeat(5 - rating);

const formatDate = (iso) => {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '';
  }
};

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await reviewsApi.getByBusiness(TEMP_BUSINESS_ID);
        if (!cancelled) setReviews(data);
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message ||
            err.message ||
            'Failed to load reviews'
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, []);

  if (loading) return <div className={styles.loading}>Loading reviews…</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Reviews</h1>
        <span className={styles.count}>
          {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
        </span>
      </div>

      {reviews.length === 0 ? (
        <div className={styles.empty}>No reviews yet for this business.</div>
      ) : (
        <div className={styles.list}>
          {reviews.map((r) => (
            <article key={r.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.rating} aria-label={`${r.rating} out of 5 stars`}>
                  {renderStars(r.rating)}
                </span>
                <span className={styles.platform}>{r.platform}</span>
              </div>
              <p className={styles.text}>{r.reviewText}</p>
              <div className={styles.date}>{formatDate(r.reviewDate)}</div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}