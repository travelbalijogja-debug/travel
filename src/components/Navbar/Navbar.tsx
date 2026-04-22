'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';

interface SiteSettings {
  logo_text?: string;
  logo_url?: string;
  phone_number?: string;
}

// Inline SVGs for the icons
const PhoneIcon = ({ size = 14 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
);

const SearchIcon = ({ size = 18 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
);

const MenuIcon = ({ size = 22 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
);

const XIcon = ({ size = 22 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

const MoonIcon = ({ size = 18 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
);

const SunIcon = ({ size = 18 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
);

export default function Navbar({ settings }: { settings?: SiteSettings }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    
    // Check saved theme
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      setTheme('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    }
    
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        {/* Logo */}
        <Link href="/" className={styles.logo} id="nav-logo">
          {settings?.logo_url ? (
            <img src={settings.logo_url} alt="Logo" className={styles.logoImage} />
          ) : (
            <>
              <span className={styles.logoIcon}>✦</span>
              <span className={styles.logoText}>{settings?.logo_text || 'NORTH TOUR'}</span>
            </>
          )}
        </Link>

        {/* Primary Nav */}
        <ul className={`${styles.navLinks} ${menuOpen ? styles.open : ''}`}>
          <li><Link href="/#news" id="nav-news" onClick={() => setMenuOpen(false)}>News</Link></li>
          <li><Link href="/#documents" id="nav-docs" onClick={() => setMenuOpen(false)}>Documents</Link></li>
          <li><Link href="/#about" id="nav-about" onClick={() => setMenuOpen(false)}>About Us</Link></li>
          <li><Link href="/#contact" id="nav-contact" onClick={() => setMenuOpen(false)}>Contact</Link></li>
        </ul>

        {/* Right Actions */}
        <div className={styles.actions}>
          {/* Emergency Call */}
          <a
            href={`tel:${settings?.phone_number || '+6281234567890'}`}
            className={styles.callBtn}
            id="nav-call-btn"
          >
            <PhoneIcon size={14} />
            <span>{settings?.phone_number || '+62 812-3456-7890'}</span>
          </a>

          {/* Search */}
          <div className={`${styles.searchWrap} ${searchOpen ? styles.searchActive : ''}`}>
            {searchOpen && (
              <input
                type="text"
                placeholder="Search destinations..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className={styles.searchInput}
                id="nav-search-input"
                autoFocus
              />
            )}
            <button
              className={styles.iconBtn}
              onClick={() => setSearchOpen(!searchOpen)}
              id="nav-search-btn"
              aria-label="Toggle search"
            >
              {searchOpen ? <XIcon size={18} /> : <SearchIcon size={18} />}
            </button>
          </div>

          {/* Theme Toggle */}
          <button
            className={styles.iconBtn}
            onClick={toggleTheme}
            id="nav-theme-btn"
            aria-label="Toggle light/dark theme"
            style={{ marginLeft: '0.2rem' }}
          >
            {theme === 'light' ? <MoonIcon size={18} /> : <SunIcon size={18} />}
          </button>

          {/* Hamburger */}
          <button
            className={styles.hamburger}
            onClick={() => setMenuOpen(!menuOpen)}
            id="nav-menu-btn"
            aria-label="Toggle menu"
          >
            {menuOpen ? <XIcon size={22} /> : <MenuIcon size={22} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
