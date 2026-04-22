'use client';
import { useState } from 'react';
import styles from './DestinationSection.module.css';

interface Destination {
  id: string;
  image: string;
  place: string;
  name: string;
}

const DEFAULT_DESTINATIONS: Destination[] = [
  { id: '1', image: 'https://picsum.photos/seed/destbali1/600/800', place: 'Ubud, Bali', name: 'Monkey Forest & Rice Terrace' },
  { id: '2', image: 'https://picsum.photos/seed/destjogja1/600/800', place: 'Magelang, DIY', name: 'Candi Borobudur' },
  { id: '3', image: 'https://picsum.photos/seed/destbali2/600/800', place: 'Nusa Penida, Bali', name: 'Kelingking Beach' },
  { id: '4', image: 'https://picsum.photos/seed/destjogja2/600/800', place: 'Sleman, DIY', name: 'Candi Prambanan' },
];

export default function DestinationSection({ destinations }: { destinations?: Destination[] }) {
  const data = destinations?.length ? destinations : DEFAULT_DESTINATIONS;
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <section className={styles.section} id="destinations">
      <div className={styles.inner}>
        
        {/* Left Side: Dynamic Sticky Image */}
        <div className={styles.imageColumn}>
          {data.map((dest, idx) => (
            <img 
              key={dest.id}
              src={dest.image}
              alt={dest.place}
              className={`${styles.imageFade} ${idx === activeIdx ? styles.activeImage : ''}`}
            />
          ))}
          <div className={styles.imageOverlay} />
          
          <div className={styles.imageCaption}>
            explore the exotic
          </div>
        </div>

        {/* Right Side: Interactive List */}
        <div className={styles.listColumn}>
          <div className={styles.header}>
            <h2 className={styles.title}>Destinations</h2>
          </div>

          <ul className={styles.destinationList}>
            {data.map((dest, idx) => (
              <li 
                key={dest.id} 
                className={`${styles.listItem} ${idx === activeIdx ? styles.activeItem : ''}`}
                onMouseEnter={() => setActiveIdx(idx)}
                onClick={() => setActiveIdx(idx)}
              >
                {/* Gambar per-item khusus mobile */}
                <img
                  src={dest.image}
                  alt={dest.place}
                  className={styles.mobileImg}
                  onError={e => {
                    (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${dest.id}dest/600/400`;
                  }}
                />
                <div className={styles.itemHeader}>
                  <span className={styles.itemNumber}>0{idx + 1}</span>
                  <h3 className={styles.itemPlace}>{dest.place}</h3>
                </div>
                <div className={styles.itemDetail}>
                  <p>{dest.name}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </section>
  );
}
