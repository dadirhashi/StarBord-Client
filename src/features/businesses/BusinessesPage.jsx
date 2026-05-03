import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { businessesApi } from './businessesApi';
import CreateBusinessModal from './CreateBusinessModal';
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
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleCreated = (newBusiness) => {
    setBusinesses((prev) => [newBusiness, ...prev]);
  };

  if (loading) return <div className={styles.loading}>Loading businesses…</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Businesses</h1>
        <div className={styles.headerRight}>
          <span className={styles.count}>
            {businesses.length} {businesses.length === 1 ? 'business' : 'businesses'}
          </span>
          {businesses.length > 0 && (
            <button
              type="button"
              className={styles.addButton}
              onClick={() => setIsModalOpen(true)}
            >
              + Add a business
            </button>
          )}
        </div>
      </div>

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
            onClick={() => setIsModalOpen(true)}
          >
            + Add a business
          </button>
        </div>
      ) : (
        <div className={styles.list}>
          {businesses.map((b) => (
            <Link
              key={b.id}
              to={`/reviews/${b.id}`}
              className={styles.card}
            >
              <div className={styles.cardHeader}>
                <h2 className={styles.name}>{b.name}</h2>
                <span className={styles.chevron} aria-hidden="true">›</span>
              </div>
              <p className={styles.address}>{b.address}</p>
              <div className={styles.date}>
                Added {formatDate(b.createdAt)}
              </div>
            </Link>
          ))}
        </div>
      )}

      <CreateBusinessModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={handleCreated}
      />
    </div>
  );
}