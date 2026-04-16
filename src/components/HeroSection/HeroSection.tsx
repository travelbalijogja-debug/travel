'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './HeroSection.module.css';

interface HeroContent {
  slogan?: string;
  subslogan?: string;
  hero_images?: { desktop: string; mobile: string | null }[];
}

const DEFAULT_IMAGES = [
  { desktop: '/images/hero-1.jpg', mobile: null },
  { desktop: '/images/hero-2.jpg', mobile: null },
];

export default function HeroSection({ content }: { content?: HeroContent }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const images = content?.hero_images?.length ? content.hero_images : DEFAULT_IMAGES;

  // Auto-slide effect
  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % images.length);
    }, 5000); // Ganti gambar tiap 5 detik
    return () => clearInterval(interval);
  }, [images]);

  const nextSlide = () => setCurrentIdx((prev) => (prev + 1) % images.length);
  const prevSlide = () => setCurrentIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  return (
    <section className={styles.hero} id="hero">
      {/* Full Page Slider */}
      <div className={styles.sliderContainer}>
        {images.map((item, i) => (
          <div 
            key={i} 
            className={`${styles.slide} ${i === currentIdx ? styles.active : ''}`}
          >
            <div className={styles.imgWrap}>
              <picture>
                <source media="(max-width: 768px)" srcSet={item.mobile || item.desktop} />
                <img
                  src={item.desktop}
                  alt={`Slide ${i + 1}`}
                  className={styles.img}
                />
              </picture>
            </div>
          </div>
        ))}
      </div>

      {/* Subtle Overlay to make it feel premium */}
      <div className={styles.heroOverlay} />

      {/* Slide Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button className={`${styles.navBtn} ${styles.prevBtn}`} onClick={prevSlide} aria-label="Previous Slide">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <button className={`${styles.navBtn} ${styles.nextBtn}`} onClick={nextSlide} aria-label="Next Slide">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </>
      )}

      {/* Hero Content Overlay */}
      <div className={styles.contentOverlay}>
        <div className={styles.contentInner}>
          <p className={styles.preTitle}>
            {content?.preTitle || 'Your Premium Travel Partner'}
          </p>
          <h1 className={styles.mainSlogan}>
            {content?.slogan || 'BUS TO THE SEA — FAST, ECONOMICAL, COMFORTABLE'}
          </h1>
          <p className={styles.tagline}>
            {content?.tagline || 'Nikmati perjalanan eksklusif dan tak terlupakan di destinasi terbaik Bali & Jogja.'}
          </p>
          <div className={styles.ctaGroup}>
            <Link href="#packages" className={styles.primaryBtn}>
              Cek Paket Tour
            </Link>
            <Link href="#story" className={styles.secondaryBtn}>
              Lihat Portfolio
            </Link>
          </div>
        </div>
      </div>

      {/* Slider Indicators (Dots) */}
      <div className={styles.indicators}>
        {images.map((_, i) => (
          <div 
            key={i} 
            className={`${styles.dot} ${i === currentIdx ? styles.dotActive : ''}`} 
            onClick={() => setCurrentIdx(i)}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <div className={styles.scrollIndicator} aria-hidden="true">
        <span className={styles.scrollLine} />
        <span className={styles.scrollText}>Scroll</span>
      </div>
    </section>
  );
}
