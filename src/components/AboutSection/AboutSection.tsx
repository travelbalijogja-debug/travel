import styles from './AboutSection.module.css';

interface AboutProps {
  title?: string;
  description?: string;
  highlights?: string[];
}

export default function AboutSection({ title, description, highlights = [] }: AboutProps) {
  if (!description) return null;

  const validHighlights = highlights.filter(Boolean);

  return (
    <section className={styles.section} id="about">
      <div className={styles.inner}>
        <div className={styles.badge}>Tentang Kami</div>
        <h2 className={styles.title}>{title || 'Apa itu Noe Travel Jepara?'}</h2>
        <p className={styles.description}>{description}</p>

        {validHighlights.length > 0 && (
          <div className={styles.highlights}>
            {validHighlights.map((h, i) => (
              <div key={i} className={styles.highlightItem}>
                <div className={styles.highlightIcon}>✓</div>
                <span>{h}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
