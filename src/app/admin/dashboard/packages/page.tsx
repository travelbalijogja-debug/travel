'use client';
import { useState, useEffect } from 'react';
import { fetchSupabase, deleteSupabase, insertSupabase, uploadFile } from '@/lib/supabaseFetch';

export default function PackagesAdmin() {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  // Form State
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    title: '', description: '', location: '', duration: '', price_adult: 0, main_image: ''
  });

  const loadPackages = async () => {
    setLoading(true);
    const data = await fetchSupabase('packages', 'select=*');
    setPackages(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadPackages();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const uploadedUrl = await uploadFile(file);
    if (uploadedUrl) {
      setFormData({ ...formData, main_image: uploadedUrl });
    } else {
      alert('Gagal mengunggah gambar paket.');
    }
    setIsUploading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus paket ini?')) return;
    await deleteSupabase('packages', 'id', id);
    loadPackages();
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.main_image) return alert('Silakan unggah foto utama paket!');
    await insertSupabase('packages', formData);
    setIsAdding(false);
    setFormData({ title: '', description: '', location: '', duration: '', price_adult: 0, main_image: '' });
    loadPackages();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Manage Packages (Pricelist)</h1>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          style={{ padding: '0.6rem 1.2rem', background: 'var(--text-even)', color: 'var(--bg-even)', borderRadius: '6px', fontWeight: 600, border: 'none', cursor: 'pointer' }}
        >
          {isAdding ? 'Cancel' : '+ Add New Package'}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} style={{ background: 'var(--card-bg-even)', padding: '1.5rem', borderRadius: '16px', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', border: '1px solid var(--line-even)' }}>
          <h3 style={{ fontSize: '1.1rem' }}>Tambah Paket Baru</h3>
          
          <div 
            onClick={() => document.getElementById('package-file-upload')?.click()}
            style={{ 
              height: '200px', border: '2px dashed var(--line-even)', borderRadius: '12px', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              backgroundColor: 'rgba(255,255,255,0.02)', position: 'relative', overflow: 'hidden'
            }}
          >
            {formData.main_image ? (
              <img src={formData.main_image} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            ) : (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📷</div>
                <p style={{ fontSize: '0.9rem', color: 'var(--gray-500)' }}>{isUploading ? 'Uploading...' : 'Klik/Jatuhkan Cover Paket Disini'}</p>
              </div>
            )}
            <input type="file" id="package-file-upload" hidden accept="image/*" onChange={handleFileUpload} />
          </div>

          <input required type="text" placeholder="Package Title (cth: Bali Luxury 3D2N)" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} style={inputStyle} />
          <textarea required placeholder="Deskripsi Singkat" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{...inputStyle, minHeight: '80px'}} />
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <input required type="text" placeholder="Location (cth: Ubud, Bali)" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} style={inputStyle} />
            <input required type="text" placeholder="Duration (cth: 3 Days)" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} style={inputStyle} />
            <input required type="number" placeholder="Price Adult (Rp)" value={formData.price_adult || ''} onChange={e => setFormData({...formData, price_adult: Number(e.target.value)})} style={inputStyle} />
          </div>
          
          <button type="submit" disabled={isUploading} style={{ padding: '1rem', background: '#2ecc71', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 800, cursor: 'pointer', filter: isUploading ? 'grayscale(1)' : 'none' }}>
            {isUploading ? 'Tunggu Sebentar...' : 'Simpan Paket Wisata'}
          </button>
        </form>
      )}

      {loading ? (
        <p>Loading data from Supabase...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {packages.length === 0 && <p>Belum ada paket wisata.</p>}
          {packages.map(pkg => (
            <div key={pkg.id} style={{ display: 'flex', flexDirection: 'column', background: 'var(--card-bg-even)', borderRadius: '16px', border: '1px solid var(--line-even)', overflow: 'hidden' }}>
              <img src={pkg.main_image || "https://picsum.photos/400/300"} alt="Thumbnail" style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
              <div style={{ padding: '1.2rem', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{pkg.title}</h3>
                  <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>{pkg.duration}</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)', marginBottom: '1rem' }}>📍 {pkg.location}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ fontWeight: 800, color: '#2ecc71', fontSize: '1.1rem' }}>Rp {pkg.price_adult.toLocaleString('id-ID')}</p>
                  <button onClick={() => handleDelete(pkg.id)} style={{ padding: '0.5rem 0.8rem', background: '#ff4757', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem' }}>
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--line-even)', background: 'transparent', color: '#ffffff'
};
