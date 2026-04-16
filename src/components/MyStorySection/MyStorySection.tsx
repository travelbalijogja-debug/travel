'use client';
import { useState, useEffect } from 'react';
import styles from './MyStorySection.module.css';

interface Story {
  id: string;
  image: string;
  caption: string;
}

const DEFAULT_STORIES: Story[] = [
  { id: '1', image: 'https://picsum.photos/seed/bali1/400/600', caption: 'pesona melasti beach, bali' },
  { id: '2', image: 'https://picsum.photos/seed/jogja1/400/600', caption: 'sunrise di borobudur, jogja' },
  { id: '3', image: 'https://picsum.photos/seed/bali2/400/600', caption: 'momen pura uluwatu' },
  { id: '4', image: 'https://picsum.photos/seed/jogja2/400/600', caption: 'jejak sejarah prambanan' },
];

export default function MyStorySection({ stories, bgImage }: { stories?: Story[], bgImage?: string }) {
  const data = stories?.length ? stories : DEFAULT_STORIES;
  const background = bgImage || 'https://picsum.photos/seed/bali_bg/1920/1080';
  
  const [currentIdx, setCurrentIdx] = useState(0);

  // Auto-slide effect every 6 seconds
  useEffect(() => {
    if (data.length <= 4) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(interval);
  }, [data.length]);

  const itemsPerPage = 4; // Will be handled via CSS for responsive, but logic mostly handles track translating
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const nextSlide = () => {
    setCurrentIdx((prev) => (prev + 1 >= totalPages ? 0 : prev + 1));
  };
  
  const prevSlide = () => {
    setCurrentIdx((prev) => (prev <= 0 ? totalPages - 1 : prev - 1));
  };

  const currentData = data.slice(currentIdx * itemsPerPage, (currentIdx + 1) * itemsPerPage);

  return (
    <section className={styles.section} id="story">
      {/* Background with parallax effect */}
      <div 
        className={styles.bgImage} 
        style={{ backgroundImage: `url(${background})` }}
      />
      <div className={styles.bgOverlay} />

      <div className={styles.inner}>
        {/* Header containing title and navigation */}
        <div className={styles.headerRow}>
          <div className={styles.header}>
            <h2 className={styles.title}>our portfolio</h2>
            <p className={styles.subtitle}>Kumpulan momen eksklusif perjalanan klien kami</p>
          </div>
          
          {data.length > 4 && (
            <div className={styles.navButtons}>
              <button className={styles.navBtn} onClick={prevSlide} aria-label="Previous">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
              </button>
              <button className={styles.navBtn} onClick={nextSlide} aria-label="Next">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
              </button>
            </div>
          )}
        </div>

        {/* Gallery Grid (Chunked) */}
        <div className={styles.galleryWrapper}>
          <div className={styles.gallery} key={currentIdx}>
            {currentData.map((story, i) => (
              <div key={story.id} className={styles.item} style={{ '--i': i } as React.CSSProperties}>
                <div className={styles.imgWrap}>
                  <img
                    src={story.image}
                    alt={story.caption}
                    className={styles.img}
                    onError={e => {
                      (e.target as HTMLImageElement).src = `https://picsum.photos/seed/mystory${i}/400/600`;
                    }}
                  />
                  <div className={styles.imgOverlay} />
                </div>
                <p className={styles.caption}>{story.caption}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Progress Dots */}
        {data.length > 4 && (
          <div className={styles.dots}>
            {Array.from({ length: totalPages }).map((_, i) => (
              <div 
                key={i} 
                className={`${styles.dot} ${i === currentIdx ? styles.dotActive : ''}`} 
                onClick={() => setCurrentIdx(i)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
