'use client';
import { useState, useEffect } from 'react';
import { fetchSupabase, uploadFile, deleteSupabase, insertSupabase, updateSupabase } from '@/lib/supabaseFetch';

export default function CMSAdmin() {
  const [activeTab, setActiveTab] = useState('hero_banners');
  const [data, setData] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [slogan, setSlogan] = useState('');
  const [heroPreTitle, setHeroPreTitle] = useState('');
  const [heroTagline, setHeroTagline] = useState('');
  const [isUpdatingSlogan, setIsUpdatingSlogan] = useState(false);

  // Form URL
  // Form Upload State
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageMobileUrl, setImageMobileUrl] = useState('');
  const [extraText1, setExtraText1] = useState('');
  const [extraText2, setExtraText2] = useState('');

  const loadData = async (table: string) => {
    setLoading(true);
    const res = await fetchSupabase(table, 'order=created_at.desc');
    setData(res || []);
    
    // Fetch settings only if Banners tab
    if (table === 'hero_banners') {
      const s = await fetchSupabase('settings', 'limit=1');
      if (s?.[0]) {
        setSettings(s[0]);
        setSlogan(s[0].slogan || '');
        setHeroPreTitle(s[0].hero_pre_title || '');
        setHeroTagline(s[0].hero_tagline || '');
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData(activeTab);
  }, [activeTab]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isMobile: boolean = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const uploadedUrl = await uploadFile(file);
    if (uploadedUrl) {
      if (isMobile) setImageMobileUrl(uploadedUrl);
      else setImageUrl(uploadedUrl);
    } else {
      alert('Gagal mengunggah gambar. Pastikan Bucket "images" sudah dibuat sebagai Public di Supabase.');
    }
    setIsUploading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus item ini?')) return;
    await deleteSupabase(activeTab, 'id', id);
    loadData(activeTab);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) return alert('Silakan unggah gambar utama (Desktop) terlebih dahulu!');
    
    let payload: any = { image_url: imageUrl };

    if (activeTab === 'hero_banners') {
      if (imageMobileUrl) payload.image_mobile_url = imageMobileUrl;
    } else if (activeTab === 'destinations') {
      payload.place = extraText1;
      payload.name = extraText2;
    } else if (activeTab === 'portfolios') {
      payload.caption = extraText1;
    } else if (activeTab === 'included_features') {
      payload.category = extraText1;
      payload.subtitle = extraText2;
    }

    await insertSupabase(activeTab, payload);
    setImageUrl(''); setImageMobileUrl(''); setExtraText1(''); setExtraText2('');
    loadData(activeTab);
  };

  const handleUpdateSlogan = async () => {
    if (!settings) return;
    setIsUpdatingSlogan(true);
    const res = await updateSupabase('settings', 'id', settings.id, { 
      slogan,
      hero_pre_title: heroPreTitle,
      hero_tagline: heroTagline
    });
    if (res) alert('Semua Teks Header Berhasil Diperbarui!');
    setIsUpdatingSlogan(false);
  };

  const tabs = [
    { id: 'hero_banners', label: 'Banners / Header' },
    { id: 'destinations', label: 'Bali & Jogja Dest.' },
    { id: 'portfolios', label: 'Our Portfolio' },
    { id: 'included_features', label: "What's Included" }
  ];

  return (
    <div style={{ width: '100%', color: '#fff', paddingBottom: '3rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Content Manager</h1>
        <p style={{ fontSize: '0.75rem', color: '#888' }}>Customise visual and messaging.</p>
      </div>

      {/* Flexible Tabs Container */}
      <div style={{ 
        display: 'flex', gap: '0.4rem', 
        overflowX: 'auto', marginBottom: '1.5rem', 
        paddingBottom: '0.5rem', scrollbarWidth: 'none',
        WebkitOverflowScrolling: 'touch' 
      }}>
        {tabs.map(t => (
          <button 
            key={t.id} 
            onClick={() => setActiveTab(t.id)}
            style={{ 
              padding: '0.6rem 0.9rem', fontSize: '0.75rem', fontWeight: 700, borderRadius: '8px', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
              backgroundColor: activeTab === t.id ? '#fff' : 'rgba(255,255,255,0.05)',
              color: activeTab === t.id ? '#000' : '#888'
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {/* Step 1: Messaging */}
        {activeTab === 'hero_banners' && (
          <div style={cleanCard}>
            <div style={{ marginBottom: '1.2rem' }}>
              <span style={badgeStyle}>HEADER TEXTS</span>
            </div>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {[
                { label: 'Sub Title', val: heroPreTitle, set: setHeroPreTitle, ph: 'Premium Partner' },
                { label: 'Main Slogan', val: slogan, set: setSlogan, ph: 'Tour Title' },
                { label: 'Description', val: heroTagline, set: setHeroTagline, ph: 'Short info...', isArea: true }
              ].map((f, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={labelStyle}>{f.label}</label>
                  {f.isArea ? (
                    <textarea value={f.val} onChange={e => f.set(e.target.value)} style={minimalInputStyle} rows={3} />
                  ) : (
                    <input type="text" value={f.val} onChange={e => f.set(e.target.value)} style={minimalInputStyle} />
                  )}
                </div>
              ))}
              <button onClick={handleUpdateSlogan} style={primaryBtnStyle}>Save Changes</button>
            </div>
          </div>
        )}

        {/* Step 2: Add New */}
        <div style={cleanCard}>
          <div style={{ marginBottom: '1.2rem' }}>
            <span style={{ ...badgeStyle, color: '#3498db', background: 'rgba(52,152,219,0.1)' }}>ADD NEW ITEM</span>
          </div>
          <form onSubmit={handleAdd} style={{ display: 'grid', gap: '1.2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.8rem' }}>
               <div onClick={() => document.getElementById('f-d')?.click()} style={compactUploadStyle}>
                 {imageUrl ? <img src={imageUrl} style={fillImg} /> : <div style={textIcons}>🖥️<br/><span style={{fontSize:'0.6rem'}}>DESKTOP</span></div>}
                 <input type="file" id="f-d" hidden onChange={e => handleFileUpload(e, false)} />
               </div>
               {activeTab === 'hero_banners' && (
                 <div onClick={() => document.getElementById('f-m')?.click()} style={compactUploadStyle}>
                   {imageMobileUrl ? <img src={imageMobileUrl} style={fillImg} /> : <div style={textIcons}>📱<br/><span style={{fontSize:'0.6rem'}}>MOBILE</span></div>}
                   <input type="file" id="f-m" hidden onChange={e => handleFileUpload(e, true)} />
                 </div>
               )}
            </div>

            <div style={{ display: 'grid', gap: '0.8rem' }}>
               {activeTab === 'destinations' && (
                 <>
                   <input required type="text" placeholder="Location" value={extraText1} onChange={e => setExtraText1(e.target.value)} style={minimalInputStyle} />
                   <input required type="text" placeholder="Tour Name" value={extraText2} onChange={e => setExtraText2(e.target.value)} style={minimalInputStyle} />
                 </>
               )}
               {activeTab === 'portfolios' && <input required type="text" placeholder="Caption" value={extraText1} onChange={e => setExtraText1(e.target.value)} style={minimalInputStyle} />}
               {activeTab === 'included_features' && (
                 <>
                   <input required type="text" placeholder="Category" value={extraText1} onChange={e => setExtraText1(e.target.value)} style={minimalInputStyle} />
                   <input required type="text" placeholder="Desc" value={extraText2} onChange={e => setExtraText2(e.target.value)} style={minimalInputStyle} />
                 </>
               )}
            </div>

            <button type="submit" style={secondaryBtnStyle}>
              {isUploading ? 'Uploading...' : 'Create Entry'}
            </button>
          </form>
        </div>

        {/* Step 3: Grid */}
        <div>
           <p style={{ fontSize: '0.65rem', fontWeight: 800, color: '#444', marginBottom: '1rem' }}>ACTIVE ITEMS</p>
           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: '0.6rem' }}>
             {data.map(item => (
               <div key={item.id} style={{ position: 'relative' }}>
                 <div style={{ aspectRatio: '1/1', borderRadius: '10px', overflow: 'hidden', background: '#111' }}>
                    <img src={item.image_url} style={fillImg} />
                 </div>
                 <button 
                  onClick={() => handleDelete(item.id)}
                  style={{ position: 'absolute', top: '-4px', right: '-4px', width:'20px', height:'20px', borderRadius:'50%', background:'#ff4757', color:'#fff', border:'none', fontSize:'9px', cursor:'pointer' }}
                 >✕</button>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
}

const cleanCard = { backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '16px', padding: '1rem', border: '1px solid rgba(255,255,255,0.05)' };
const badgeStyle = { fontSize: '0.6rem', fontWeight: 800, color: '#2ecc71', backgroundColor: 'rgba(46,204,113,0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px', letterSpacing: '0.05em' };
const labelStyle = { fontSize: '0.7rem', fontWeight: 600, color: '#555' };
const minimalInputStyle = { width: '100%', padding: '0.7rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', background: '#000', color: '#fff', fontSize: '0.8rem', outline: 'none' };
const primaryBtnStyle = { backgroundColor: '#2ecc71', color: '#fff', border: 'none', padding: '0.9rem', borderRadius: '10px', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' };
const secondaryBtnStyle = { backgroundColor: '#fff', color: '#000', border: 'none', padding: '0.9rem', borderRadius: '10px', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' };
const compactUploadStyle: React.CSSProperties = { height: '90px', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden', backgroundColor: '#000' };
const fillImg: React.CSSProperties = { width: '100%', height: '100%', objectFit: 'cover' };
const textIcons: React.CSSProperties = { textAlign: 'center', fontSize: '1rem', color: '#444', lineHeight: 1.3 };
