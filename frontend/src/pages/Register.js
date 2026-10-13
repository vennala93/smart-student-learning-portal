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
        ctx.fillStyle = `rgba(22,199,154,${p.opacity})`;
        ctx.fill();
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      particles.forEach((a, i) => {
        particles.slice(i + 1).forEach(b => {
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(22,199,154,${0.12 * (1 - dist / 100)})`;
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

export default function Register() {
  const [form, setForm] = useState({ fullName: '', email: '', password: '', role: 'STUDENT' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await authAPI.register(form);
      login(res.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes slideUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes orb1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(20px,-15px)} }
        @keyframes orb2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-15px,20px)} }
        .input-field:focus { outline:none; border-color:#16c79a !important; box-shadow:0 0 0 3px rgba(22,199,154,0.15) !important; }
        .reg-btn:hover { transform:translateY(-2px); box-shadow:0 8px 25px rgba(22,199,154,0.4) !important; }
        .role-card { cursor:pointer; transition:all 0.2s ease; }
        .role-card:hover { border-color:rgba(22,199,154,0.5) !important; }
        .card-wrap { animation: slideUp 0.6s ease forwards; }
      `}</style>

      <FloatingParticles />
      <div style={{...styles.orb, width:350, height:350, top:-80, right:-80, animation:'orb1 9s ease-in-out infinite'}} />
      <div style={{...styles.orb, width:250, height:250, bottom:-60, left:-60, background:'radial-gradient(circle, rgba(233,69,96,0.12) 0%, transparent 70%)', animation:'orb2 7s ease-in-out infinite'}} />

      <div className="card-wrap" style={styles.card}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}>📚</div>
          <span style={styles.logoText}>SmartLearn</span>
        </div>

        <h2 style={styles.title}>Create Account</h2>
        <p style={styles.subtitle}>Join thousands of learners today</p>

        {error && <div style={styles.error}><span>⚠️</span> {error}</div>}

        <form onSubmit={handleSubmit}>
          {[
            { key:'fullName', label:'Full Name', type:'text', placeholder:'Your full name' },
            { key:'email', label:'Email Address', type:'email', placeholder:'you@example.com' },
            { key:'password', label:'Password', type:'password', placeholder:'Min 6 characters' },
          ].map(({ key, label, type, placeholder }) => (
            <div key={key} style={styles.inputWrap}>
              <label style={styles.label}>{label}</label>
              <input
                className="input-field"
                style={{...styles.input, borderColor: focused===key ? '#16c79a' : 'rgba(255,255,255,0.1)'}}
                type={type} placeholder={placeholder} value={form[key]}
                onChange={e => setForm({ ...form, [key]: e.target.value })}
                onFocus={() => setFocused(key)} onBlur={() => setFocused('')}
                required minLength={key==='password' ? 6 : undefined} />
            </div>
          ))}

          {/* Role selector */}
          <div style={styles.inputWrap}>
            <label style={styles.label}>I am a</label>
            <div style={styles.roleRow}>
              {[
                { value:'STUDENT', icon:'🎓', label:'Student' },
                { value:'INSTRUCTOR', icon:'👨‍🏫', label:'Instructor' },
              ].map(r => (
                <div key={r.value} className="role-card"
                  style={{...styles.roleCard, borderColor: form.role===r.value ? '#16c79a' : 'rgba(255,255,255,0.1)', background: form.role===r.value ? 'rgba(22,199,154,0.1)' : 'rgba(255,255,255,0.03)'}}
                  onClick={() => setForm({ ...form, role: r.value })}>
                  <div style={styles.roleIcon}>{r.icon}</div>
                  <div style={{...styles.roleLabel, color: form.role===r.value ? '#16c79a' : 'rgba(255,255,255,0.6)'}}>{r.label}</div>
                </div>
              ))}
            </div>
          </div>

          <button className="reg-btn" style={styles.btn} type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Get Started →'}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account?{' '}
          <Link to="/login" style={styles.link}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'linear-gradient(135deg, #0a0f0a 0%, #0d1a14 50%, #0a0f0a 100%)',
    fontFamily: "'DM Sans', sans-serif", position: 'relative', overflow: 'hidden',
  },
  orb: { position:'fixed', borderRadius:'50%', background:'radial-gradient(circle, rgba(22,199,154,0.12) 0%, transparent 70%)', pointerEvents:'none', zIndex:0 },
  card: {
    position:'relative', zIndex:10,
    background:'rgba(255,255,255,0.04)', backdropFilter:'blur(24px)',
    border:'1px solid rgba(255,255,255,0.08)', borderRadius:24,
    padding:'40px 40px', width:420,
    boxShadow:'0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
  },
  logo: { display:'flex', alignItems:'center', gap:10, marginBottom:24 },
  logoIcon: { fontSize:26 },
  logoText: { fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:20, color:'#16c79a' },
  title: { fontFamily:"'Syne', sans-serif", fontWeight:700, fontSize:26, color:'#fff', margin:'0 0 6px' },
  subtitle: { color:'rgba(255,255,255,0.4)', fontSize:14, marginBottom:24, marginTop:0 },
  error: { background:'rgba(233,69,96,0.1)', border:'1px solid rgba(233,69,96,0.3)', color:'#ff6b8a', padding:'11px 16px', borderRadius:12, marginBottom:18, fontSize:14, display:'flex', alignItems:'center', gap:8 },
  inputWrap: { marginBottom:16 },
  label: { display:'block', color:'rgba(255,255,255,0.5)', fontSize:11, fontWeight:500, marginBottom:7, letterSpacing:'0.06em', textTransform:'uppercase' },
  input: { width:'100%', padding:'12px 16px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:12, color:'#fff', fontSize:14, boxSizing:'border-box', transition:'all 0.2s ease' },
  roleRow: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 },
  roleCard: { padding:'14px 16px', borderRadius:12, border:'1px solid rgba(255,255,255,0.1)', textAlign:'center', userSelect:'none' },
  roleIcon: { fontSize:22, marginBottom:4 },
  roleLabel: { fontSize:13, fontWeight:500 },
  btn: { width:'100%', padding:'13px', background:'linear-gradient(135deg, #16c79a 0%, #0ea87f 100%)', color:'#fff', border:'none', borderRadius:12, fontSize:15, fontWeight:600, cursor:'pointer', marginTop:6, transition:'all 0.2s ease', fontFamily:"'DM Sans', sans-serif" },
  footer: { textAlign:'center', color:'rgba(255,255,255,0.4)', fontSize:14, marginTop:20, marginBottom:0 },
  link: { color:'#16c79a', textDecoration:'none', fontWeight:600 },
};
