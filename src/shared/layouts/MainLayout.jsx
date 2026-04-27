import { useState, useRef, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';
import styles from './MainLayout.module.css';

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/reviews', label: 'Reviews' },
  { to: '/businesses', label: 'Businesses' },
  { to: '/analytics', label: 'Analytics' },
];

export default function MainLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside or pressing Escape
  useEffect(() => {
    if (!menuOpen) return;

    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    function handleEscape(e) {
      if (e.key === 'Escape') setMenuOpen(false);
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [menuOpen]);

  function handleLogout() {
    setMenuOpen(false);
    logout();
    navigate('/login');
  }

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <h2 className={styles.brand}>⭐ StarBoard</h2>
        <nav className={styles.nav}>
          {navItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className={styles.content}>
        {/* Top bar */}
        <header className={styles.header}>
          <div className={styles.userMenu} ref={menuRef}>
            <button
              type="button"
              className={styles.userButton}
              onClick={() => setMenuOpen((open) => !open)}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
            >
              <span className={styles.userEmail}>{user?.email}</span>
              <span className={styles.chevron} aria-hidden="true">
                ▾
              </span>
            </button>

            {menuOpen && (
              <div className={styles.dropdown} role="menu">
                <div className={styles.dropdownHeader}>
                  <div className={styles.dropdownLabel}>Signed in as</div>
                  <div className={styles.dropdownEmail}>{user?.email}</div>
                </div>
                <div className={styles.divider} />
                <button
                  type="button"
                  className={styles.dropdownItem}
                  onClick={handleLogout}
                  role="menuitem"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}