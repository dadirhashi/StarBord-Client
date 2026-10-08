import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { businessesApi } from '../businesses/businessesApi';
import { reviewsApi } from '../reviews/reviewsApi';
import styles from './DashboardPage.module.css';

const renderStars = (rating) => '★'.repeat(rating) + '☆'.repeat(5 - rating);

export default function DashboardPage() {
  const [businesses, setBusinesses] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        // 1. Hämta användarens företag (backend filtrerar på inloggad användare)
        const myBusinesses = await businessesApi.getAll();

        // 2. Hämta reviews för alla företag samtidigt (parallellt, inte ett i taget)
        const reviewLists = await Promise.all(
          myBusinesses.map((b) => reviewsApi.getByBusiness(b.id))
        );

        if (!cancelled) {
          setBusinesses(myBusinesses);
          setReviews(reviewLists.flat());
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || err.message || 'Failed to load dashboard');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, []);

  if (loading) return <div className={styles.message}>Loading dashboard…</div>;
  if (error) return <div className={`${styles.message} ${styles.error}`}>Error: {error}</div>;

  // Nyckeltal räknas ut i frontend från datan vi hämtat
  const totalReviews = reviews.length;
  const averageRating = totalReviews
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
    : '–';
  const lowRatings = reviews.filter((r) => r.rating <= 2).length;

  const businessName = (id) => businesses.find((b) => b.id === id)?.name ?? 'Unknown';

  const latest = [...reviews]
    .sort((a, b) => new Date(b.reviewDate) - new Date(a.reviewDate))
    .slice(0, 5);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Dashboard</h1>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Businesses</span>
          <span className={styles.statValue}>{businesses.length}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Reviews</span>
          <span className={styles.statValue}>{totalReviews}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Average rating</span>
          <span className={styles.statValue}>{averageRating}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Low ratings (1–2★)</span>
          <span className={styles.statValue}>{lowRatings}</span>
        </div>
      </div>

      <h2 className={styles.subtitle}>Latest reviews</h2>

      {businesses.length === 0 ? (
        <div className={styles.empty}>
          You have no businesses yet. <Link to="/businesses">Add your first business</Link>
        </div>
      ) : latest.length === 0 ? (
        <div className={styles.empty}>No reviews yet.</div>
      ) : (
        <div className={styles.list}>
          {latest.map((r) => (
            <Link key={r.id} to={`/reviews/${r.businessId}`} className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.rating}>{renderStars(r.rating)}</span>
                <span className={styles.business}>{businessName(r.businessId)}</span>
              </div>
              <p className={styles.text}>{r.reviewText}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}