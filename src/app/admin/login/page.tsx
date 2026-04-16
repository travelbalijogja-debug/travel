import { Metadata } from 'next';
import LoginForm from './LoginForm';

export const metadata: Metadata = {
  title: 'Admin Login | NorthTour',
  description: 'Login to NorthTour Admin Dashboard',
};

export default function LoginPage() {
  return (
    <div style={{
      display: 'flex', 
      minHeight: '100vh', 
      backgroundColor: 'var(--bg-even)', 
      color: 'var(--text-even)',
      alignItems: 'center', 
      justifyContent: 'center'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        padding: '2rem',
        backgroundColor: 'var(--bg-odd)',
        color: 'var(--text-odd)',
        borderRadius: '16px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '0.1em' }}>NORTH TOUR</h1>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.8rem', marginTop: '0.5rem' }}>Admin Control Panel</p>
        </div>
        
        <LoginForm />
      </div>
    </div>
  );
}
