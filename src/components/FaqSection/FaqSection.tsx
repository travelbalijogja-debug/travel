'use client';
import { useState } from 'react';
import styles from './FaqSection.module.css';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export default function FaqSection({ faqs }: { faqs: FaqItem[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => setOpenId(prev => prev === id ? null : id);

  return (
    <section className={styles.section} id="faq">
      <div className={styles.inner}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>Ada Pertanyaan?</p>
          <h2 className={styles.title}>Frequently Asked Questions</h2>
          <p className={styles.subtitle}>Jawaban atas pertanyaan yang sering ditanyakan seputar paket wisata kami.</p>
        </div>

        <div className={styles.list}>
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className={`${styles.item} ${isOpen ? styles.itemOpen : ''}`}
                onClick={() => toggle(faq.id)}
              >
                <div className={styles.question}>
                  <span>{faq.question}</span>
                  <div className={`${styles.icon} ${isOpen ? styles.iconOpen : ''}`}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </div>
                </div>
                <div className={`${styles.answerWrap} ${isOpen ? styles.answerOpen : ''}`}>
                  <p className={styles.answer}>{faq.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
