import { useState, useEffect, useRef } from 'react';
import { businessesApi } from './businessesApi';
import styles from './CreateBusinessModal.module.css';

export default function CreateBusinessModal({ isOpen, onClose, onCreated }) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const firstFieldRef = useRef(null);

  // Reset form whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setName('');
      setAddress('');
      setError('');
      setIsSubmitting(false);
      // Focus the first field on open
      setTimeout(() => firstFieldRef.current?.focus(), 0);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    function handleEscape(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const created = await businessesApi.create({
        name: name.trim(),
        address: address.trim(),
      });
      onCreated(created);
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        'Failed to create business'
      );
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className={styles.backdrop}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-business-title"
    >
      <div className={styles.modal}>
        <header className={styles.header}>
          <h2 id="create-business-title" className={styles.title}>
            Add a business
          </h2>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </header>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className={styles.field}>
            <label htmlFor="business-name" className={styles.label}>
              Name
            </label>
            <input
              id="business-name"
              ref={firstFieldRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={200}
              disabled={isSubmitting}
              className={styles.input}
              placeholder="e.g. Acme Coffee"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="business-address" className={styles.label}>
              Address
            </label>
            <input
              id="business-address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              maxLength={500}
              disabled={isSubmitting}
              className={styles.input}
              placeholder="e.g. 123 Main St, Stockholm"
            />
          </div>

          {error && (
            <div className={styles.error} role="alert">
              {error}
            </div>
          )}

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting || !name.trim() || !address.trim()}
            >
              {isSubmitting ? 'Creating…' : 'Create business'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}