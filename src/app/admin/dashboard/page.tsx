'use client';
import { useState, useEffect } from 'react';
import { fetchSupabase } from '@/lib/supabaseFetch';

export default function DashboardOverview() {
  const [metrics, setMetrics] = useState({
    packages: 0,
    bookings: 0,
    destinations: 0,
    portfolios: 0
  });
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOverview = async () => {
      setLoading(true);
      const [pkgs, bks, dests, ports] = await Promise.all([
        fetchSupabase('packages', 'select=id'),
        fetchSupabase('bookings', 'select=id,name,booking_date,status,package_id'),
        fetchSupabase('destinations', 'select=id'),
        fetchSupabase('portfolios', 'select=id')
      ]);

      setMetrics({
        packages: pkgs?.length || 0,
        bookings: bks?.length || 0,
        destinations: dests?.length || 0,
        portfolios: ports?.length || 0
      });

      // Show top 5 recent bookings
      setRecentBookings(bks?.slice(0, 5) || []);
      setLoading(false);
    };
    loadOverview();
  }, []);

  if (loading) return <p>Loading Overview Data...</p>;

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '2rem' }}>Overview Real-Time</h1>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.5rem',
        marginBottom: '3rem'
      }}>
        {/* Metric Cards */}
        {[
          { label: 'Total Paket', value: metrics.packages },
          { label: 'Total Reservasi', value: metrics.bookings },
          { label: 'Destinasi Hits', value: metrics.destinations },
          { label: 'Koleksi Portofolio', value: metrics.portfolios },
        ].map((metric, i) => (
          <div key={i} style={{
            padding: '1.5rem',
            backgroundColor: 'var(--card-bg-even)',
            borderRadius: '16px',
            border: '1px solid var(--line-even)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--gray-500)', fontWeight: 600 }}>{metric.label}</span>
            <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-even)' }}>
              {metric.value}
            </span>
          </div>
        ))}
      </div>

      <div style={{
        backgroundColor: 'var(--card-bg-even)',
        borderRadius: '16px',
        border: '1px solid var(--line-even)',
        padding: '2rem'
      }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem' }}>Pesanan Terbaru (Live)</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--line-even)', color: 'var(--gray-500)' }}>
                <th style={{ padding: '1rem 0' }}>Pelanggan</th>
                <th>Tanggal</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.length === 0 && (
                <tr>
                  <td colSpan={3} style={{ padding: '2rem 0', textAlign: 'center', color: 'var(--gray-500)' }}>
                    Belum ada reservasi masuk.
                  </td>
                </tr>
              )}
              {recentBookings.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--line-even)' }}>
                  <td style={{ padding: '1rem 0', fontWeight: 600 }}>{item.name}</td>
                  <td>{new Date(item.booking_date).toLocaleDateString()}</td>
                  <td>
                    <span style={{ 
                      background: item.status === 'CONFIRMED' ? '#2ecc71' : '#ffa502', 
                      color: '#fff', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 
                    }}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
