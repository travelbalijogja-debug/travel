'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { fetchSupabase } from '@/lib/supabaseFetch';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMSG, setErrorMSG] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMSG('');
    
    // Auth Check API natively via Supabase REST
    try {
      const admins = await fetchSupabase('admins', `username=eq.${username}&password=eq.${password}`);
      
      if (admins && admins.length > 0) {
        localStorage.setItem('admin_auth', 'true');
        router.push('/admin/dashboard');
      } else {
        setErrorMSG('Username atau password salah.');
        setLoading(false);
      }
    } catch(err) {
      setErrorMSG('Terjadi kesalahan koneksi.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
      {errorMSG && <div style={{ padding: '0.8rem', background: 'rgba(255, 77, 77, 0.1)', color: '#ff4d4d', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600 }}>{errorMSG}</div>}
      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem' }}>Username</label>
        <input 
          type="text" 
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            width: '100%', padding: '0.8rem', borderRadius: '8px', 
            border: '1px solid var(--line-even)', background: 'transparent', color: 'var(--text-odd)'
          }}
          placeholder="admin"
        />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem' }}>Password</label>
        <input 
          type="password" 
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: '100%', padding: '0.8rem', borderRadius: '8px', 
            border: '1px solid var(--line-even)', background: 'transparent', color: 'var(--text-odd)'
          }}
          placeholder="••••••••"
        />
      </div>
      <button 
        type="submit" 
        disabled={loading}
        style={{
          marginTop: '1rem', width: '100%', padding: '0.9rem', borderRadius: '8px',
          background: 'var(--text-odd)', color: 'var(--bg-odd)',
          border: 'none', fontWeight: 600, cursor: 'pointer',
          opacity: loading ? 0.7 : 1
        }}
      >
        {loading ? 'Authenticating...' : 'Sign In'}
      </button>
    </form>
  );
}
