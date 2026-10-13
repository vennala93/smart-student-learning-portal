import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { courseAPI, quizAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 12 ? '🌅 Good Morning' : h < 17 ? '☀️ Good Afternoon' : '🌙 Good Evening');
    Promise.all([courseAPI.myEnrollments(), quizAPI.myResults()])
      .then(([e, q]) => { setEnrollments(e.data); setResults(q.data); })
      .finally(() => setLoading(false));
  }, []);

  const completed = enrollments.filter(e => e.status === 'COMPLETED').length;
  const inProgress = enrollments.filter(e => e.status === 'IN_PROGRESS').length;
  const avgScore = results.length ? Math.round(results.reduce((s, r) => s + r.percentage, 0) / results.length) : 0;

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div style={{ width: 40, height: 40, border: '3px solid rgba(233,69,96,0.2)', borderTop: '3px solid #e94560', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <p style={{ color: '#aaa', marginTop: 16 }}>Loading...</p>
    </div>
  );

  const stats = [
    { label: 'Enrolled', value: enrollments.length, icon: '📚', color: '#e94560', bg: 'rgba(233,69,96,0.15)' },
    { label: 'In Progress', value: inProgress, icon: '⚡', color: '#f5a623', bg: 'rgba(245,166,35,0.15)' },
    { label: 'Completed', value: completed, icon: '🏆', color: '#16c79a', bg: 'rgba(22,199,154,0.15)' },
    { label: 'Avg Score', value: `${avgScore}%`, icon: '🎯', color: '#a29bfe', bg: 'rgba(162,155,254,0.15)' },
  ];

  return (
    <div style={s.page}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .sc:hover { transform:translateY(-4px)!important; box-shadow:0 8px 28px rgba(0,0,0,0.3)!important; }
        .cc:hover { transform:translateY(-3px)!important; box-shadow:0 8px 28px rgba(0,0,0,0.3)!important; }
        .cb:hover { background:#e94560!important; color:#fff!important; border-color:#e94560!important; }
        .explore:hover { box-shadow:0 8px 28px rgba(233,69,96,0.5)!important; transform:translateY(-1px); }
      `}</style>

      {/* Header */}
      <div style={s.header}>
        <div>
          <p style={s.greeting}>{greeting}</p>
          <h1 style={s.name}>{user?.fullName} 👋</h1>
          <p style={s.sub}>Ready to learn something amazing today?</p>
        </div>
        <Link to="/courses" className="explore" style={s.exploreBtn}>Explore Courses →</Link>
      </div>

      {/* Stats */}
      <div style={s.statsGrid}>
        {stats.map((st, i) => (
          <div key={i} className="sc" style={{ ...s.statCard, animationDelay: `${i * 0.08}s` }}>
            <div style={{ ...s.statIcon, background: st.bg, color: st.color }}>{st.icon}</div>
            <div style={{ fontSize: 34, fontWeight: 800, color: st.color, lineHeight: 1 }}>{st.value}</div>
            <div style={s.statLabel}>{st.label}</div>
          </div>
        ))}
      </div>

      {/* My Courses */}
      <div style={s.section}>
        <div style={s.secHeader}>
          <h2 style={s.secTitle}>📖 My Courses</h2>
          <Link to="/courses" style={s.seeAll}>Browse more →</Link>
        </div>
        {enrollments.length === 0 ? (
          <div style={s.empty}>
            <div style={{ fontSize: 52, marginBottom: 14 }}>📖</div>
            <p style={{ color: '#bbb', marginBottom: 20, fontSize: 15 }}>No courses enrolled yet</p>
            <Link to="/courses" style={s.browseBtn}>Browse Courses</Link>
          </div>
        ) : (
          <div style={s.grid}>
            {enrollments.map((e, i) => (
              <div key={e.id} className="cc" style={{ ...s.card, animationDelay: `${i * 0.08}s` }}>
                <div style={{ height: 5, background: e.status === 'COMPLETED' ? 'linear-gradient(90deg,#16c79a,#0ea87f)' : 'linear-gradient(90deg,#e94560,#f5a623)' }} />
                <div style={{ padding: 20 }}>
                  {e.status === 'COMPLETED'
                    ? <span style={{ ...s.badge, background: 'rgba(22,199,154,0.15)', color: '#16c79a' }}>✅ Completed</span>
                    : <span style={{ ...s.badge, background: 'rgba(245,166,35,0.15)', color: '#f5a623' }}>⚡ In Progress</span>}
                  <div style={s.courseTitle}>{e.courseTitle}</div>
                  <div style={s.enrollDate}>Enrolled: {e.enrolledAt}</div>
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ color: '#aaa', fontSize: 12 }}>Progress</span>
                      <span style={{ color: '#fff', fontSize: 12, fontWeight: 700 }}>{e.progressPercent}%</span>
                    </div>
                    <div style={{ height: 7, background: 'rgba(255,255,255,0.08)', borderRadius: 20, overflow: 'hidden' }}>
                      <div style={{ height: '100%', borderRadius: 20, width: `${e.progressPercent}%`, background: e.status === 'COMPLETED' ? 'linear-gradient(90deg,#16c79a,#0ea87f)' : 'linear-gradient(90deg,#e94560,#f5a623)', transition: 'width 0.5s ease' }} />
                    </div>
                  </div>
                  <Link to={`/courses/${e.courseId}`} className="cb" style={s.continueBtn}>
                    {e.status === 'COMPLETED' ? 'Review Course' : 'Continue Learning'} →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quiz Results */}
      {results.length > 0 && (
        <div style={s.section}>
          <div style={s.secHeader}>
            <h2 style={s.secTitle}>🎯 Quiz Results</h2>
            <span style={{ color: '#888', fontSize: 13 }}>{results.length} attempts</span>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 160px 100px', gap: 16, padding: '12px 20px', background: 'rgba(255,255,255,0.06)', color: '#ccc', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <span>Quiz Name</span><span>Score</span><span>Percentage</span><span>Status</span>
            </div>
            {results.map((r) => (
              <div key={r.resultId} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 160px 100px', gap: 16, padding: '14px 20px', borderTop: '1px solid rgba(255,255,255,0.05)', alignItems: 'center' }}>
                <span style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>{r.quizTitle}</span>
                <span style={{ color: '#bbb', fontSize: 14 }}>{r.score}/{r.total}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ height: 6, borderRadius: 20, width: `${r.percentage}%`, maxWidth: 80, background: r.percentage >= 60 ? '#16c79a' : '#e94560' }} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: r.percentage >= 60 ? '#16c79a' : '#e94560' }}>{r.percentage.toFixed(1)}%</span>
                </div>
                <span style={{ padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, textAlign: 'center', background: r.percentage >= 60 ? 'rgba(22,199,154,0.15)' : 'rgba(233,69,96,0.15)', color: r.percentage >= 60 ? '#16c79a' : '#e94560' }}>
                  {r.percentage >= 60 ? '🎉 Passed' : '❌ Failed'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const s = {
  page: { maxWidth: 1100, margin: '0 auto', padding: '36px 28px' },
  header: { display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 },
  greeting: { color: '#aaa', fontSize: 13, marginBottom: 4, fontWeight: 500 },
  name: { fontSize: 32, fontWeight: 800, color: '#ffffff', marginBottom: 6, textShadow: '0 2px 12px rgba(233,69,96,0.3)' },
  sub: { color: '#bbb', fontSize: 14 },
  exploreBtn: { padding: '12px 26px', background: 'linear-gradient(135deg,#e94560,#c62a47)', color: '#fff', borderRadius: 12, textDecoration: 'none', fontWeight: 700, fontSize: 15, boxShadow: '0 4px 20px rgba(233,69,96,0.4)', transition: 'all 0.2s' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16, marginBottom: 36 },
  statCard: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '24px 20px', backdropFilter: 'blur(10px)', transition: 'all 0.2s ease', animation: 'fadeUp 0.5s ease both' },
  statIcon: { width: 46, height: 46, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 14 },
  statLabel: { color: '#bbb', fontSize: 13, marginTop: 6, fontWeight: 600 },
  section: { marginBottom: 36 },
  secHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 },
  secTitle: { color: '#ffffff', fontSize: 22, fontWeight: 800, textShadow: '0 1px 8px rgba(0,0,0,0.3)' },
  seeAll: { color: '#e94560', textDecoration: 'none', fontSize: 13, fontWeight: 700 },
  empty: { background: 'rgba(255,255,255,0.03)', border: '2px dashed rgba(255,255,255,0.1)', borderRadius: 16, padding: '48px 24px', textAlign: 'center' },
  browseBtn: { display: 'inline-block', padding: '10px 24px', background: '#e94560', color: '#fff', borderRadius: 10, textDecoration: 'none', fontSize: 14, fontWeight: 600 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 16 },
  card: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden', transition: 'all 0.2s ease', animation: 'fadeUp 0.5s ease both', backdropFilter: 'blur(10px)' },
  badge: { display: 'inline-block', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, marginBottom: 10 },
  courseTitle: { color: '#ffffff', fontWeight: 700, fontSize: 16, marginBottom: 6, lineHeight: 1.4 },
  enrollDate: { color: '#888', fontSize: 12, marginBottom: 14 },
  continueBtn: { display: 'block', textAlign: 'center', padding: '10px', background: 'transparent', border: '2px solid #e94560', color: '#e94560', borderRadius: 10, textDecoration: 'none', fontSize: 13, fontWeight: 600, transition: 'all 0.2s' },
};
