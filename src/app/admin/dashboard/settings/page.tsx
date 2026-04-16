'use client';
import { useState, useEffect, CSSProperties } from 'react';
import { fetchSupabase, updateSupabase, uploadFile } from '@/lib/supabaseFetch';

export default function SettingsPage() {
  const [adminData, setAdminData] = useState<any>(null);
  const [siteSettings, setSiteSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // Form states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [logoText, setLogoText] = useState('');
  const [phone, setPhone] = useState('');
  const [slogan, setSlogan] = useState('');
  const [portfolioBg, setPortfolioBg] = useState('');
  const [uploadingBg, setUploadingBg] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const admins = await fetchSupabase('admins', 'limit=1');
      const settings = await fetchSupabase('settings', 'limit=1');
      
      if (admins?.[0]) {
        setAdminData(admins[0]);
        setUsername(admins[0].username);
        setPassword(admins[0].password);
      }

      if (settings?.[0]) {
        setSiteSettings(settings[0]);
        setLogoText(settings[0].logo_text || '');
        setPhone(settings[0].phone_number || '');
        setSlogan(settings[0].slogan || '');
        setPortfolioBg(settings[0].portfolio_background_image || '');
      }
      setLoading(false);
    };
    loadData();
  }, []);

  const handleBgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingBg(true);
    const uploadedUrl = await uploadFile(file);
    if (uploadedUrl) {
      setPortfolioBg(uploadedUrl);
    } else {
      alert('Gagal mengunggah gambar background.');
    }
    setUploadingBg(false);
  };

  const handleUpdateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminData) return;
    const res = await updateSupabase('admins', 'id', adminData.id, { username, password });
    if (res) setMessage('Username & Password berhasil diperbarui!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleUpdateSite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteSettings) return;
    const res = await updateSupabase('settings', 'id', siteSettings.id, {
      logo_text: logoText,
      phone_number: phone,
      slogan: slogan,
      portfolio_background_image: portfolioBg
    });
    if (res) setMessage('Pengaturan website berhasil diperbarui!');
    setTimeout(() => setMessage(''), 3000);
  };

  if (loading) return <p>Loading settings...</p>;

  return (
    <div style={{ maxWidth: '800px' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '2rem' }}>General Settings</h1>

      {message && (
        <div style={{ padding: '1rem', background: '#2ecc71', color: '#fff', borderRadius: '8px', marginBottom: '2rem', fontWeight: 600 }}>
          {message}
        </div>
      )}

      {/* Admin Credentials */}
      <section style={sectionStyle}>
        <h2 style={titleStyle}>Admin Account</h2>
        <form onSubmit={handleUpdateAdmin} style={formStyle}>
          <div style={inputGroup}>
            <label style={labelStyle}>Admin Username</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} style={inputStyle} />
          </div>
          <div style={inputGroup}>
            <label style={labelStyle}>Admin Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} />
          </div>
          <button type="submit" style={btnStyle}>Update Credentials</button>
        </form>
      </section>

      {/* Site Content Settings */}
      <section style={sectionStyle}>
        <h2 style={titleStyle}>Site Identity & Global Content</h2>
        <form onSubmit={handleUpdateSite} style={formStyle}>
          <div style={inputGroup}>
            <label style={labelStyle}>Logo Text</label>
            <input type="text" value={logoText} onChange={e => setLogoText(e.target.value)} style={inputStyle} />
          </div>
          <div style={inputGroup}>
            <label style={labelStyle}>WhatsApp / Phone Number</label>
            <input type="text" value={phone} onChange={e => setPhone(e.target.value)} style={inputStyle} />
          </div>
          <div style={inputGroup}>
            <label style={labelStyle}>Main Slogan (Hero Header)</label>
            <textarea value={slogan} onChange={e => setSlogan(e.target.value)} style={{...inputStyle, height: '80px'}} />
          </div>
          <div style={inputGroup}>
            <label style={labelStyle}>Portfolio Section Background</label>
            <div 
              onClick={() => document.getElementById('portfolio-bg-upload')?.click()}
              style={{ 
                height: '180px', border: '2px dashed var(--line-even)', borderRadius: '12px', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                backgroundColor: 'rgba(255,255,255,0.02)', position: 'relative', overflow: 'hidden',
                marginTop: '0.5rem'
              }}
            >
              {portfolioBg ? (
                <img src={portfolioBg} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🌌</div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--gray-500)' }}>{uploadingBg ? 'Mengunggah...' : 'Klik/Drop Foto Background'}</p>
                </div>
              )}
              <input 
                type="file" 
                id="portfolio-bg-upload" 
                hidden 
                accept="image/*" 
                onChange={handleBgUpload} 
              />
            </div>
            {portfolioBg && (
              <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: '0.4rem', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setPortfolioBg('')}>
                Hapus Gambar
              </p>
            )}
          </div>
          <button type="submit" disabled={uploadingBg} style={{...btnStyle, filter: uploadingBg ? 'grayscale(1)' : 'none'}}>Save Site Settings</button>
        </form>
      </section>
    </div>
  );
}

const sectionStyle: CSSProperties = {
  background: 'var(--card-bg-even)',
  padding: '2rem',
  borderRadius: '12px',
  border: '1px solid var(--line-even)',
  marginBottom: '2rem'
};
const titleStyle: CSSProperties = { fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem' };
const formStyle: CSSProperties = { display: 'flex', flexDirection: 'column', gap: '1.2rem' };
const inputGroup: CSSProperties = { display: 'flex', flexDirection: 'column', gap: '0.5rem' };
const labelStyle: CSSProperties = { fontSize: '0.85rem', fontWeight: 600, color: 'var(--gray-500)' };
const inputStyle: CSSProperties = { padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--line-even)', background: 'transparent', color: '#ffffff', width: '100%' };
const btnStyle: CSSProperties = { padding: '0.8rem', background: 'var(--text-even)', color: 'var(--bg-even)', border: 'none', borderRadius: '6px', fontWeight: 700, cursor: 'pointer', alignSelf: 'flex-start' };
