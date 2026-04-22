'use client';
import { useState } from 'react';
import { insertSupabase } from '@/lib/supabaseFetch';
import styles from './BookingSection.module.css';

interface BookingCard {
  id: string;
  image: string;
  title: string;
  short_description: string;
  description: string;
  price: number;
  tags: string[];
}

export default function BookingSection({ bookings, phoneNumber }: { bookings?: BookingCard[], phoneNumber?: string }) {
  const [selectedPkg, setSelectedPkg] = useState<BookingCard | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    people: '1',
    notes: ''
  });

  const data = bookings?.length ? bookings : [];

  const handleOpenModal = (pkg: BookingCard) => {
    setSelectedPkg(pkg);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPkg) return;

    setIsSubmitting(true);
    
    // Save to Supabase
    const payload = {
      package_id: selectedPkg.id,
      name: formData.name,
      email: '-', 
      phone: formData.phone,
      booking_date: formData.date,
      notes: `${formData.notes} (Jumlah Orang: ${formData.people})`, // Embedding people info into notes for now or we could add a column
      status: 'PENDING'
    };

    const result = await insertSupabase('bookings', payload);
    
    if (result) {
      // Redirect to WhatsApp with info
      const cleanPhone = (phoneNumber || '6289678657991').replace(/\D/g, '');
      const waMessage = `Halo Admin Noe Travel Jepara!%0A%0ASaya ingin memesan paket: *${selectedPkg.title}*%0A%0A*Data Pemesan:*%0ANama: ${formData.name}%0ANo HP: ${formData.phone}%0ATanggal: ${formData.date}%0AJumlah Orang: ${formData.people}%0ACatatan: ${formData.notes || '-'}`;
      window.open(`https://wa.me/${cleanPhone}?text=${waMessage}`, '_blank');
      
      // Close modal and reset
      setShowModal(false);
      setFormData({ name: '', phone: '', date: '', people: '1', notes: '' });
    } else {
      alert('Gagal mengirim pesanan. Silakan coba lagi.');
    }
    
    setIsSubmitting(false);
  };

  return (
    <section className={styles.section} id="packages">
      <div className={styles.inner}>
        <div className={styles.headerTitle}>
          <p className={styles.eyebrow}>Start your journey</p>
          <h2 className={styles.mainTitle}>Pricelist Paket Wisata</h2>
          <p className={styles.subtitle}>Pilih paket sesuai dengan destinasi impian Anda.</p>
        </div>
        
        <div className={styles.grid}>
          {data.map((item) => (
            <div key={item.id} className={styles.card}>
              {/* Image */}
              <div className={styles.imgWrap}>
                <img
                  src={item.image}
                  alt={item.title}
                  className={styles.img}
                  onError={e => {
                    (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${item.id}book/600/400`;
                  }}
                />
              </div>

              {/* Content */}
              <div className={styles.content}>
                <h3 className={styles.title}>{item.title}</h3>

                <ul className={styles.inclusionList}>
                  {item.short_description && item.short_description.trim()
                    ? item.short_description.split('\n').map(l => l.trim()).filter(Boolean).map((feat, idx) => (
                        <li key={idx}>{feat}</li>
                      ))
                    : (() => {
                        const loc = (item.tags[0] || '').toLowerCase();
                        const title = item.title.toLowerCase();
                        if (loc.includes('karimunjawa') || title.includes('karimunjawa')) return (<><li>✓ Kapal Siginjai PP</li><li>✓ Makan 5x + BBQ Seafood</li><li>✓ Snorkeling & Island Hopping</li></>);
                        if (loc.includes('bali') || title.includes('bali')) return (<><li>✓ Hotel Bintang 4 + Breakfast</li><li>✓ Transport Private + Driver</li><li>✓ Tiket Wisata & Tour Guide</li></>);
                        if (loc.includes('jogja') || title.includes('jogja')) return (<><li>✓ Hotel + Breakfast</li><li>✓ Transport & Tiket Masuk</li><li>✓ Guide Profesional</li></>);
                        if (loc.includes('singapore') || title.includes('singapore')) return (<><li>✓ Tiket Cruise / Pesawat</li><li>✓ Akomodasi & Transport</li><li>✓ Tour Guide Berpengalaman</li></>);
                        return (<><li>✓ Akomodasi Terbaik</li><li>✓ Transport & Driver</li><li>✓ Guide Profesional</li></>);
                      })()
                  }
                </ul>

                <div className={styles.tagsRow}>
                  {item.tags.map(tag => (
                    <span key={tag} className={styles.tag}>{tag}</span>
                  ))}
                </div>

                {/* Price + CTA — pushed to bottom */}
                <div className={styles.priceActionContainer}>
                  <div className={styles.priceBlock}>
                    <span className={styles.priceLabel}>Start from</span>
                    <span className={styles.priceAmount}>
                      {item.price > 0
                        ? `Rp ${item.price.toLocaleString('id-ID')}`
                        : 'Price by Request'}
                    </span>
                  </div>
                  <button onClick={() => handleOpenModal(item)} className={styles.reserveBtn}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                    Booking Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      {showModal && selectedPkg && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button className={styles.closeBtn} onClick={() => setShowModal(false)}>&times;</button>
            <h3 className={styles.modalTitle}>Detail Reservasi</h3>
            <p className={styles.modalSubtitle}>Paket: <strong>{selectedPkg.title}</strong></p>

            <div style={{ margin: '1.5rem 0', padding: '1.2rem', background: 'rgba(0,0,0,0.04)', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.08)' }}>
              <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.8rem', color: '#27ae60', fontWeight: 800 }}>Itinerary & Fasilitas</h4>
              <p style={{ fontSize: '0.85rem', whiteSpace: 'pre-line', lineHeight: '1.6', color: '#2c3e50', fontWeight: 500 }}>
                {selectedPkg.description}
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label>Nama Lengkap</label>
                <input required type="text" placeholder="Masukkan nama Anda" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className={styles.inputGroup}>
                <label>Nomor WhatsApp</label>
                <input required type="tel" placeholder="Contoh: 08123456789" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className={styles.inputGroup}>
                  <label>Rencana Tanggal</label>
                  <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                </div>
                <div className={styles.inputGroup}>
                  <label>Jumlah Orang</label>
                  <input required type="number" min="1" value={formData.people} onChange={e => setFormData({...formData, people: e.target.value})} />
                </div>
              </div>
              <div className={styles.inputGroup}>
                <label>Catatan Tambahan (Opsional)</label>
                <textarea placeholder="Contoh: Jumlah orang, permintaan khusus, dll." value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
              </div>
              
              <button type="submit" disabled={isSubmitting} className={styles.submitBtn}>
                {isSubmitting ? 'Memproses...' : 'Kirim & Lanjutkan ke WA'}
              </button>
              <p className={styles.formNote}>*Data Anda akan tersimpan di sistem kami sebelum diarahkan ke WhatsApp admin.</p>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
