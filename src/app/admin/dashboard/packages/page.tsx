'use client';
import { useState, useEffect, useCallback, memo } from 'react';
import { fetchSupabase, deleteSupabase, insertSupabase, updateSupabase, uploadFile } from '@/lib/supabaseFetch';

// ─────────────────────────────────────────
// ISOLATED FORM COMPONENT (prevents re-render of list on every keystroke)
// ─────────────────────────────────────────
const PackageForm = memo(function PackageForm({
  initial,
  mode,
  onCancel,
  onSaved,
}: {
  initial: any;
  mode: 'add' | 'edit';
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({ ...initial });
  const [priceDisplay, setPriceDisplay] = useState(
    initial.price_adult ? Number(initial.price_adult).toLocaleString('id-ID') : ''
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f: any) => ({ ...f, [key]: e.target.value }));

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const url = await uploadFile(file);
    if (url) setForm((f: any) => ({ ...f, main_image: url }));
    else alert('Gagal upload foto.');
    setIsUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.main_image) return alert('Silakan upload foto cover paket!');
    setIsSaving(true);
    const payload = {
      title: form.title,
      short_description: form.short_description,
      description: form.description,
      location: form.location,
      duration: form.duration,
      price_adult: Number(form.price_adult) || null,
      main_image: form.main_image,
    };
    if (mode === 'edit' && initial.id) {
      await updateSupabase('packages', 'id', initial.id, payload);
    } else {
      await insertSupabase('packages', payload);
    }
    setIsSaving(false);
    onSaved();
  };

  return (
    <form onSubmit={handleSubmit} style={formWrapStyle}>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
        {mode === 'edit' ? '✏️ Edit Paket' : '➕ Tambah Paket Baru'}
      </h3>

      {/* Cover Photo */}
      <div
        onClick={() => document.getElementById('pkg-img-upload')?.click()}
        style={{ height: '200px', border: '2px dashed var(--line-even)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden', position: 'relative', background: 'rgba(255,255,255,0.02)' }}
      >
        {form.main_image
          ? <img src={form.main_image} alt="cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem' }}>📷</div>
              <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem', marginTop: '0.4rem' }}>
                {isUploading ? 'Uploading...' : 'Klik untuk upload foto cover'}
              </p>
            </div>
        }
        <input id="pkg-img-upload" type="file" hidden accept="image/*" onChange={handleFileUpload} />
      </div>
      {form.main_image && (
        <span style={clearLinkStyle} onClick={() => setForm((f: any) => ({ ...f, main_image: '' }))}>
          Hapus / Ganti Foto
        </span>
      )}

      <input required type="text" placeholder="Judul Paket (cth: Bali Instagramable 3D2N)" value={form.title} onChange={set('title')} style={inputStyle} />

      <div style={fieldGroup}>
        <label style={labelStyle}>📌 Deskripsi Singkat — tampil di kartu website (awali tiap baris dengan ✓)</label>
        <textarea
          required
          placeholder={"✓ Hotel Bintang 4 + Breakfast\n✓ Transport Private + Driver\n✓ Tiket Wisata & Tour Guide"}
          value={form.short_description}
          onChange={set('short_description')}
          style={{ ...inputStyle, minHeight: '110px' }}
        />
      </div>

      <div style={fieldGroup}>
        <label style={labelStyle}>📋 Full Itinerary & Fasilitas — tampil di popup Booking</label>
        <textarea
          required
          placeholder={"DAY 1 – ARRIVAL\n• 10.00 Penjemputan di Bandara\n• Check-in Hotel\n\nDAY 2 – TOUR\n...\n\nFASILITAS:\n✔ Hotel + Breakfast\n❌ Tidak termasuk: Tiket pesawat"}
          value={form.description}
          onChange={set('description')}
          style={{ ...inputStyle, minHeight: '220px' }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
        <div style={fieldGroup}>
          <label style={labelStyle}>📍 Lokasi</label>
          <input required type="text" placeholder="cth: Jepara - Karimunjawa" value={form.location} onChange={set('location')} style={inputStyle} />
        </div>
        <div style={fieldGroup}>
          <label style={labelStyle}>⏱ Durasi</label>
          <input required type="text" placeholder="cth: 3 Days 2 Nights" value={form.duration} onChange={set('duration')} style={inputStyle} />
        </div>
        <div style={fieldGroup}>
          <label style={labelStyle}>💰 Harga (Rp) — kosongkan = "Price by Request"</label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', pointerEvents: 'none' }}>Rp</span>
            <input
              type="text"
              inputMode="numeric"
              placeholder="cth: 1.999.000"
              value={priceDisplay}
              onChange={e => {
                const raw = e.target.value.replace(/\D/g, '');
                const num = Number(raw);
                setPriceDisplay(raw ? num.toLocaleString('id-ID') : '');
                setForm((f: any) => ({ ...f, price_adult: raw ? num : null }));
              }}
              style={{ ...inputStyle, paddingLeft: '2.5rem' }}
            />
          </div>
          {priceDisplay && (
            <p style={{ fontSize: '0.75rem', color: '#2ecc71', marginTop: '0.3rem' }}>
              = Rp {priceDisplay}
            </p>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
        <button type="submit" disabled={isUploading || isSaving} style={btnPrimary}>
          {isSaving ? 'Menyimpan...' : isUploading ? 'Uploading Foto...' : mode === 'edit' ? '💾 Simpan Perubahan' : '✅ Tambahkan Paket'}
        </button>
        <button type="button" onClick={onCancel} style={btnSecondary}>Batal</button>
      </div>
    </form>
  );
});

// ─────────────────────────────────────────
// MAIN PAGE (only manages the list & mode state)
// ─────────────────────────────────────────
export default function PackagesAdmin() {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<null | 'add' | 'edit'>(null);
  const [editTarget, setEditTarget] = useState<any>(null);

  const loadPackages = useCallback(async () => {
    setLoading(true);
    const data = await fetchSupabase('packages', 'select=*&order=created_at.desc');
    setPackages(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { loadPackages(); }, [loadPackages]);

  const handleSaved = useCallback(() => {
    setMode(null);
    setEditTarget(null);
    loadPackages();
  }, [loadPackages]);

  const handleCancel = useCallback(() => {
    setMode(null);
    setEditTarget(null);
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus paket ini?')) return;
    await deleteSupabase('packages', 'id', id);
    loadPackages();
  };

  const openEdit = (pkg: any) => {
    setEditTarget(pkg);
    setMode('edit');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Manage Packages (Pricelist)</h1>
        {mode === null && (
          <button onClick={() => setMode('add')} style={{ padding: '0.6rem 1.2rem', background: 'var(--text-even)', color: 'var(--bg-even)', borderRadius: '6px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
            + Add New Package
          </button>
        )}
      </div>

      {/* Form (only mounts when needed, isolated state) */}
      {mode === 'add' && (
        <PackageForm
          key="add"
          initial={{ title: '', short_description: '', description: '', location: '', duration: '', price_adult: '', main_image: '' }}
          mode="add"
          onCancel={handleCancel}
          onSaved={handleSaved}
        />
      )}
      {mode === 'edit' && editTarget && (
        <PackageForm
          key={editTarget.id}
          initial={editTarget}
          mode="edit"
          onCancel={handleCancel}
          onSaved={handleSaved}
        />
      )}

      {/* Package List */}
      {loading ? (
        <p style={{ color: 'var(--gray-500)' }}>Loading data...</p>
      ) : packages.length === 0 ? (
        <p style={{ color: 'var(--gray-500)' }}>Belum ada paket. Klik "+ Add New Package" untuk menambahkan.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {packages.map(pkg => (
            <div key={pkg.id} style={{ display: 'flex', flexDirection: 'column', background: 'var(--card-bg-even)', borderRadius: '16px', border: '1px solid var(--line-even)', overflow: 'hidden' }}>
              <img src={pkg.main_image || 'https://picsum.photos/400/300'} alt={pkg.title} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
              <div style={{ padding: '1.2rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, flex: 1, marginRight: '0.5rem' }}>{pkg.title}</h3>
                  <span style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.6rem', borderRadius: '4px', whiteSpace: 'nowrap' }}>{pkg.duration}</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>📍 {pkg.location}</p>
                {pkg.short_description && (
                  <p style={{ fontSize: '0.75rem', color: 'var(--gray-400)', whiteSpace: 'pre-line', lineHeight: '1.6' }}>
                    {pkg.short_description}
                  </p>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '0.8rem', borderTop: '1px solid var(--line-even)' }}>
                  <p style={{ fontWeight: 800, color: '#2ecc71', fontSize: '1rem' }}>
                    {pkg.price_adult > 0 ? `Rp ${Number(pkg.price_adult).toLocaleString('id-ID')}` : 'Price by Request'}
                  </p>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => openEdit(pkg)} style={{ padding: '0.4rem 0.8rem', background: '#3498db', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem' }}>
                      ✏️ Edit
                    </button>
                    <button onClick={() => handleDelete(pkg.id)} style={{ padding: '0.4rem 0.8rem', background: '#ff4757', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem' }}>
                      🗑 Hapus
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────
const formWrapStyle: React.CSSProperties = { background: 'var(--card-bg-even)', padding: '2rem', borderRadius: '16px', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1.2rem', border: '1px solid var(--line-even)' };
const fieldGroup: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '0.4rem' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--line-even)', background: 'rgba(255,255,255,0.03)', color: '#ffffff', fontSize: '0.95rem', lineHeight: 1.6 };
const labelStyle: React.CSSProperties = { fontSize: '0.8rem', fontWeight: 700, color: 'var(--gray-500)' };
const clearLinkStyle: React.CSSProperties = { fontSize: '0.75rem', color: 'var(--gray-500)', cursor: 'pointer', textDecoration: 'underline', marginTop: '-0.5rem' };
const btnPrimary: React.CSSProperties = { flex: 1, padding: '0.9rem', background: '#2ecc71', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 800, cursor: 'pointer', fontSize: '0.95rem' };
const btnSecondary: React.CSSProperties = { padding: '0.9rem 1.5rem', background: 'transparent', color: 'var(--gray-400)', border: '1px solid var(--line-even)', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' };
