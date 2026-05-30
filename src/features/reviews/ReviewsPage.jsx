import { useEffect, useState, useCallback } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { reviewsApi } from './reviewsApi';
import styles from './ReviewsPage.module.css';

const renderStars = (rating) => '★'.repeat(rating) + '☆'.repeat(5 - rating);

const formatDate = (iso) => {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  } catch {
    return '';
  }
};

export default function ReviewsPage() {
  const { businessId } = useParams();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState(null);

  const loadReviews = useCallback(async () => {
    if (!businessId) return;
    try {
      setError(null);
      const data = await reviewsApi.getByBusiness(businessId);
      setReviews(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load reviews');
    }
  }, [businessId]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      await loadReviews();
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [loadReviews]);

  const handleSync = async () => {
    setSyncing(true);
    setSyncMessage(null);
    try {
      await reviewsApi.syncFromTrustpilot(businessId);
      setSyncMessage('Sync complete');
      await loadReviews();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to sync from Trustpilot');
    } finally {
      setSyncing(false);
    }
  };

  const handleConnect = async () => {
    try {
      const url = await reviewsApi.connectTrustpilot(businessId);
      window.location.href = url;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to start Trustpilot connect');
    }
  };

  if (!businessId) return <Navigate to="/businesses" replace />;
  if (loading) return <div className={styles.loading}>Loading reviews…</div>;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Reviews</h1>
        <div className={styles.headerActions}>
          <span className={styles.count}>
            {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
          </span>
          <button
            type="button"
            onClick={handleConnect}
            className={styles.connectButton}
          >
            Connect Trustpilot
          </button>
          <button
            type="button"
            onClick={handleSync}
            disabled={syncing}
            className={styles.syncButton}
          >
            {syncing ? 'Syncing…' : 'Sync from Trustpilot'}
          </button>
        </div>
      </div>

      {syncMessage && <div className={styles.success}>{syncMessage}</div>}
      {error && <div className={styles.error}>Error: {error}</div>}

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