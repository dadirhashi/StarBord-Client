import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { businessesApi } from './businessesApi';
import styles from './BusinessesPage.module.css';

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

export default function BusinessesPage() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await businessesApi.getAll();
        if (!cancelled) setBusinesses(data);
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message ||
            err.message ||
            'Failed to load businesses'
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, []);

  if (loading) return <div className={styles.loading}>Loading businesses…</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Businesses</h1>
        <span className={styles.count}>
          {businesses.length} {businesses.length === 1 ? 'business' : 'businesses'}
        </span>
      </div>

```
      {businesses.length === 0 ? (
  <div className={styles.empty}>
    <div className={styles.emptyIcon} aria-hidden="true">🏢</div>
    <h2 className={styles.emptyTitle}>No businesses yet</h2>
    <p className={styles.emptyText}>
      Add your first business to start collecting and managing reviews.
    </p>
    <button
      type="button"
      className={styles.emptyButton}
      onClick={() => {
        // TODO: wire to a Create Business modal/page
        alert('Create business flow not built yet');
      }}
    >
      + Add a business
    </button>
  </div>
) : (
  <></>
)}
    </div>
  );
}