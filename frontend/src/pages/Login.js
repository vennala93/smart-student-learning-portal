import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';

function FloatingParticles() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2.5 + 0.5,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.6 + 0.1,
    }));

    let animId;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(233,69,96,${p.opacity})`;
        ctx.fill();
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });

      // Draw connecting lines
      particles.forEach((a, i) => {
        particles.slice(i + 1).forEach(b => {
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(233,69,96,${0.15 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position:'fixed', inset:0, zIndex:0, pointerEvents:'none' }} />;
}

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await authAPI.login(form);
      login(res.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally { setLoading(false); }
  };

  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes glow { 0%,100%{box-shadow:0 0 20px rgba(233,69,96,0.3)} 50%{box-shadow:0 0 40px rgba(233,69,96,0.6)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes orb1 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(30px,-20px) scale(1.1)} 66%{transform:translate(-20px,15px) scale(0.9)} }
        @keyframes orb2 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(-25px,20px) scale(1.05)} 66%{transform:translate(20px,-10px) scale(0.95)} }
        .input-field:focus { outline:none; border-color:#e94560 !important; box-shadow:0 0 0 3px rgba(233,69,96,0.15) !important; }
        .login-btn:hover { transform:translateY(-2px); box-shadow:0 8px 25px rgba(233,69,96,0.5) !important; }
        .login-btn:active { transform:translateY(0); }
        .card-wrap { animation: slideUp 0.6s ease forwards; }
      `}</style>

      <FloatingParticles />

      {/* Glowing orbs */}
      <div style={{...styles.orb, width:400, height:400, top:-100, left:-100, animation:'orb1 8s ease-in-out infinite'}} />
      <div style={{...styles.orb, width:300, height:300, bottom:-80, right:-80, background:'radial-gradient(circle, rgba(22,199,154,0.15) 0%, transparent 70%)', animation:'orb2 10s ease-in-out infinite'}} />
      <div style={{...styles.orb, width:200, height:200, top:'50%', right:'15%', background:'radial-gradient(circle, rgba(233,69,96,0.1) 0%, transparent 70%)', animation:'orb1 6s ease-in-out infinite reverse'}} />

      <div className="card-wrap" style={styles.card}>
        {/* Logo */}
        <div style={styles.logo}>
          <div style={styles.logoIcon}>📚</div>
          <span style={styles.logoText}>SmartLearn</span>
        </div>

        <h2 style={styles.title}>Welcome Back</h2>
        <p style={styles.subtitle}>Sign in to continue your learning journey</p>

        {error && (
          <div style={styles.error}>
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={styles.inputWrap}>
            <label style={styles.label}>Email Address</label>
            <input
              className="input-field"
              style={{...styles.input, borderColor: focused==='email' ? '#e94560' : 'rgba(255,255,255,0.1)'}}
              type="email" placeholder="you@example.com" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              onFocus={() => setFocused('email')}
              onBlur={() => setFocused('')}
              required />
          </div>

          <div style={styles.inputWrap}>
            <label style={styles.label}>Password</label>
            <input
              className="input-field"
              style={{...styles.input, borderColor: focused==='password' ? '#e94560' : 'rgba(255,255,255,0.1)'}}
              type="password" placeholder="••••••••" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              onFocus={() => setFocused('password')}
              onBlur={() => setFocused('')}
              required />
          </div>

          <button className="login-btn" style={styles.btn} type="submit" disabled={loading}>
            {loading ? (
              <span>Signing in...</span>
            ) : (
              <span>Sign In →</span>
            )}
          </button>
        </form>

        <div style={styles.divider}>
          <div style={styles.divLine} />
          <span style={styles.divText}>or</span>
          <div style={styles.divLine} />
        </div>

        <p style={styles.footer}>
          Don't have an account?{' '}
          <Link to="/register" style={styles.link}>Create one free</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0d1117 100%)',
    fontFamily: "'DM Sans', sans-serif",
    position: 'relative',
    overflow: 'hidden',
  },
  orb: {
    position: 'fixed',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(233,69,96,0.15) 0%, transparent 70%)',
    pointerEvents: 'none',
    zIndex: 0,
  },
  card: {
    position: 'relative',
    zIndex: 10,
    background: 'rgba(255,255,255,0.04)',
    backdropFilter: 'blur(24px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 24,
    padding: '44px 40px',
    width: 420,
    boxShadow: '0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
  },
  logo: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 },
  logoIcon: { fontSize: 28 },
  logoText: { fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20, color: '#e94560' },
  title: { fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 28, color: '#fff', margin: '0 0 8px' },
  subtitle: { color: 'rgba(255,255,255,0.45)', fontSize: 14, marginBottom: 28, marginTop: 0 },
  error: {
    background: 'rgba(233,69,96,0.1)',
    border: '1px solid rgba(233,69,96,0.3)',
    color: '#ff6b8a',
    padding: '12px 16px',
    borderRadius: 12,
    marginBottom: 20,
    fontSize: 14,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  inputWrap: { marginBottom: 18 },
  label: { display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: 500, marginBottom: 8, letterSpacing: '0.05em', textTransform: 'uppercase' },
  input: {
    width: '100%',
    padding: '13px 16px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 12,
    color: '#fff',
    fontSize: 14,
    boxSizing: 'border-box',
    transition: 'all 0.2s ease',
  },
  btn: {
    width: '100%',
    padding: '14px',
    background: 'linear-gradient(135deg, #e94560 0%, #c62a47 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: 12,
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: 8,
    transition: 'all 0.2s ease',
    fontFamily: "'DM Sans', sans-serif",
    letterSpacing: '0.02em',
  },
  divider: { display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0 20px' },
  divLine: { flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' },
  divText: { color: 'rgba(255,255,255,0.3)', fontSize: 12 },
  footer: { textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 14, margin: 0 },
  link: { color: '#e94560', textDecoration: 'none', fontWeight: 600 },
};
