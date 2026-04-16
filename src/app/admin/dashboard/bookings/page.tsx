'use client';
import { useState, useEffect } from 'react';
import { fetchSupabase, deleteSupabase } from '@/lib/supabaseFetch';

export default function BookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBookings = async () => {
    setLoading(true);
    // Fetch bookings join with packages title
    const data = await fetchSupabase('bookings', 'select=*,packages(title)&order=created_at.desc');
    setBookings(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus data reservasi ini?')) return;
    await deleteSupabase('bookings', 'id', id);
    loadBookings();
  };

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '2rem' }}>Daftar Reservasi (Leads)</h1>

      {loading ? (
        <p>Loading bookings...</p>
      ) : (
        <div style={{ background: 'var(--card-bg-even)', borderRadius: '16px', border: '1px solid var(--line-even)', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--line-even)' }}>
                <th style={thStyle}>Tanggal Book</th>
                <th style={thStyle}>Paket</th>
                <th style={thStyle}>Nama Pelanggan</th>
                <th style={thStyle}>WhatsApp</th>
                <th style={thStyle}>Tgl Trip</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: 'var(--gray-500)' }}>Belum ada reservasi masuk.</td>
                </tr>
              )}
              {bookings.map((b) => (
                <tr key={b.id} style={{ borderBottom: '1px solid var(--line-even)', fontSize: '0.9rem' }}>
                  <td style={tdStyle}>{new Date(b.created_at).toLocaleDateString()}</td>
                  <td style={tdStyle}><strong>{b.packages?.title || 'Unknown'}</strong></td>
                  <td style={tdStyle}>{b.name}</td>
                  <td style={tdStyle}>
                    <a href={`https://wa.me/${b.phone.replace(/[^0-9]/g, '')}`} target="_blank" style={{ color: '#2ecc71', fontWeight: 600 }}>
                      {b.phone}
                    </a>
                  </td>
                  <td style={tdStyle}>{b.booking_date}</td>
                  <td style={tdStyle}>
                    <span style={{ 
                      padding: '0.2rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.75rem', 
                      fontWeight: 700,
                      background: b.status === 'PENDING' ? 'rgba(241, 196, 15, 0.1)' : 'rgba(46, 204, 113, 0.1)',
                      color: b.status === 'PENDING' ? '#f1c40f' : '#2ecc71'
                    }}>
                      {b.status}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <button onClick={() => handleDelete(b.id)} style={{ padding: '0.4rem 0.8rem', background: '#ff4757', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const thStyle = { padding: '1.2rem 1rem', fontSize: '0.85rem', color: 'var(--gray-500)', fontWeight: 600 };
const tdStyle = { padding: '1.2rem 1rem', color: '#fff' };
