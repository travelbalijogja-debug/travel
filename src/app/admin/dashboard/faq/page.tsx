'use client';
import { useState, useEffect, useCallback, memo } from 'react';
import { fetchSupabase, deleteSupabase, insertSupabase, updateSupabase } from '@/lib/supabaseFetch';

// ─────────────────────────────────────────
// ISOLATED FORM — prevents list re-render on every keystroke
// ─────────────────────────────────────────
const FaqForm = memo(function FaqForm({
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
  const [isSaving, setIsSaving] = useState(false);

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f: any) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const payload = {
      question: form.question,
      answer: form.answer,
      order_idx: Number(form.order_idx) || 0,
    };
    if (mode === 'edit' && initial.id) {
      await updateSupabase('faqs', 'id', initial.id, payload);
    } else {
      await insertSupabase('faqs', payload);
    }
    setIsSaving(false);
    onSaved();
  };

  return (
    <form onSubmit={handleSubmit} style={formWrap}>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
        {mode === 'edit' ? '✏️ Edit FAQ' : '➕ Tambah FAQ Baru'}
      </h3>

      <div style={fieldGroup}>
        <label style={labelStyle}>❓ Pertanyaan</label>
        <input
          required
          type="text"
          placeholder="cth: Apakah harga sudah termasuk tiket pesawat?"
          value={form.question}
          onChange={set('question')}
          style={inputStyle}
        />
      </div>

      <div style={fieldGroup}>
        <label style={labelStyle}>💬 Jawaban</label>
        <textarea
          required
          placeholder="Tulis jawaban lengkap di sini..."
          value={form.answer}
          onChange={set('answer')}
          style={{ ...inputStyle, minHeight: '120px' }}
        />
      </div>

      <div style={fieldGroup}>
        <label style={labelStyle}>🔢 Urutan Tampil (angka kecil = tampil lebih dulu)</label>
        <input
          type="number"
          min="0"
          placeholder="cth: 1"
          value={form.order_idx || ''}
          onChange={set('order_idx')}
          style={{ ...inputStyle, width: '120px' }}
        />
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <button type="submit" disabled={isSaving} style={btnPrimary}>
          {isSaving ? 'Menyimpan...' : mode === 'edit' ? '💾 Simpan Perubahan' : '✅ Tambahkan FAQ'}
        </button>
        <button type="button" onClick={onCancel} style={btnSecondary}>Batal</button>
      </div>
    </form>
  );
});

// ─────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────
export default function FaqAdmin() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<null | 'add' | 'edit'>(null);
  const [editTarget, setEditTarget] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadFaqs = useCallback(async () => {
    setLoading(true);
    const data = await fetchSupabase('faqs', 'select=*&order=order_idx.asc,created_at.asc');
    setFaqs(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { loadFaqs(); }, [loadFaqs]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
  };

  const confirmDelete = async (id: string) => {
    await deleteSupabase('faqs', 'id', id);
    setDeletingId(null);
    loadFaqs();
  };

  const cancelDelete = () => setDeletingId(null);

  const openEdit = (faq: any) => {
    setEditTarget(faq);
    setMode('edit');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaved = useCallback(() => {
    setMode(null);
    setEditTarget(null);
    loadFaqs();
  }, [loadFaqs]);

  const handleCancel = useCallback(() => {
    setMode(null);
    setEditTarget(null);
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Manage FAQ</h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)', marginTop: '0.3rem' }}>
            FAQ akan muncul di website secara otomatis jika ada isinya.
          </p>
        </div>
        {mode === null && (
          <button onClick={() => setMode('add')} style={{ padding: '0.6rem 1.2rem', background: 'var(--text-even)', color: 'var(--bg-even)', borderRadius: '6px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
            + Tambah FAQ
          </button>
        )}
      </div>

      {/* Form */}
      {mode === 'add' && (
        <FaqForm key="add" initial={{ question: '', answer: '', order_idx: faqs.length + 1 }} mode="add" onCancel={handleCancel} onSaved={handleSaved} />
      )}
      {mode === 'edit' && editTarget && (
        <FaqForm key={editTarget.id} initial={editTarget} mode="edit" onCancel={handleCancel} onSaved={handleSaved} />
      )}

      {/* FAQ List */}
      {loading ? (
        <p style={{ color: 'var(--gray-500)' }}>Loading...</p>
      ) : faqs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', border: '2px dashed var(--line-even)', borderRadius: '16px', color: 'var(--gray-500)' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>❓</div>
          <p>Belum ada FAQ. Klik "+ Tambah FAQ" untuk menambahkan pertanyaan pertama.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {faqs.map((faq, idx) => (
            <div key={faq.id} style={{ background: 'var(--card-bg-even)', borderRadius: '12px', border: '1px solid var(--line-even)', padding: '1.3rem 1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px', color: 'var(--gray-400)' }}>#{idx + 1}</span>
                    <p style={{ fontWeight: 700, fontSize: '0.95rem' }}>{faq.question}</p>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--gray-400)', lineHeight: '1.5', whiteSpace: 'pre-line' }}>{faq.answer}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                  {deletingId === faq.id ? (
                    // Inline confirmation
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,71,87,0.12)', border: '1px solid #ff4757', borderRadius: '8px', padding: '0.4rem 0.8rem' }}>
                      <span style={{ fontSize: '0.8rem', color: '#ff4757', fontWeight: 600 }}>Hapus?</span>
                      <button onClick={() => confirmDelete(faq.id)} style={{ padding: '0.3rem 0.7rem', background: '#ff4757', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem' }}>
                        Ya
                      </button>
                      <button onClick={cancelDelete} style={{ padding: '0.3rem 0.7rem', background: 'transparent', color: 'var(--gray-400)', border: '1px solid var(--line-even)', borderRadius: '5px', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem' }}>
                        Batal
                      </button>
                    </div>
                  ) : (
                    <>
                      <button onClick={() => openEdit(faq)} style={{ padding: '0.4rem 0.8rem', background: '#3498db', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem' }}>
                        ✏️ Edit
                      </button>
                      <button onClick={() => handleDelete(faq.id)} style={{ padding: '0.4rem 0.8rem', background: '#ff4757', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem' }}>
                        🗑 Hapus
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const formWrap: React.CSSProperties = { background: 'var(--card-bg-even)', padding: '2rem', borderRadius: '16px', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1.2rem', border: '1px solid var(--line-even)' };
const fieldGroup: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '0.4rem' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--line-even)', background: 'rgba(255,255,255,0.03)', color: '#ffffff', fontSize: '0.95rem', lineHeight: 1.6 };
const labelStyle: React.CSSProperties = { fontSize: '0.8rem', fontWeight: 700, color: 'var(--gray-500)' };
const btnPrimary: React.CSSProperties = { flex: 1, padding: '0.9rem', background: '#2ecc71', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 800, cursor: 'pointer' };
const btnSecondary: React.CSSProperties = { padding: '0.9rem 1.5rem', background: 'transparent', color: 'var(--gray-400)', border: '1px solid var(--line-even)', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' };
