'use client';
import { useRef } from 'react';
import styles from './GuidebookSection.module.css';

interface IncludedFeature {
  id: string;
  image: string;
  category: string;
  category_kr?: string;
  subtitle?: string;
}

export default function GuidebookSection({ cards }: { cards?: IncludedFeature[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const data = cards?.length ? cards : [];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Enable dragging or localized wheel scroll could be added, 
  // but button and standard scroll is safer for now.

  return (
    <section className={styles.section} id="guidebook">
      <div className={styles.headerRow}>
        <div className={styles.header}>
          <h2 className={styles.title}>All-Inclusive Experience</h2>
          <p className={styles.subtitle}>Fasilitas premium yang melengkapi perjalanan Anda bersama kami.</p>
        </div>
        
        <div className={styles.navButtons}>
          <button className={styles.navBtn} onClick={() => scroll('left')} aria-label="Scroll Left">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <button className={styles.navBtn} onClick={() => scroll('right')} aria-label="Scroll Right">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>
      </div>

      <div className={styles.scrollCarousel} ref={scrollRef}>
        {data.map((item, idx) => (
          <div key={item.id} className={styles.card}>
            <div className={styles.imgWrap}>
              <img src={item.image} alt={item.category} className={styles.img} />
              <div className={styles.overlay} />
            </div>
            <div className={styles.content}>
              <div className={styles.idx}>0{idx + 1}</div>
              <h3 className={styles.category}>{item.category}</h3>
              <p className={styles.itemSubtitle}>{item.subtitle}</p>
            </div>
          </div>
        ))}
        {/* Placeholder spacer for ending */}
        <div style={{ minWidth: '5vw', height: '10px' }} />
      </div>
    </section>
  );
}
