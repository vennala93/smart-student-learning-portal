import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { courseAPI } from '../api/api';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchCourses(); }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await courseAPI.getAll();
      setCourses(res.data);
    } catch { } finally { setLoading(false); }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) return fetchCourses();
    const res = await courseAPI.search(search);
    setCourses(res.data);
  };

  const categories = ['All', ...new Set(courses.map(c => c.category).filter(Boolean))];
  const filtered = activeCategory === 'All' ? courses : courses.filter(c => c.category === activeCategory);

  const COLORS = [
    'linear-gradient(135deg,#e94560,#c62a47)',
    'linear-gradient(135deg,#16c79a,#0ea87f)',
    'linear-gradient(135deg,#f5a623,#e8920a)',
    'linear-gradient(135deg,#a29bfe,#6c5ce7)',
    'linear-gradient(135deg,#74b9ff,#0984e3)',
    'linear-gradient(135deg,#fd79a8,#e84393)',
    'linear-gradient(135deg,#55efc4,#00b894)',
    'linear-gradient(135deg,#fdcb6e,#e17055)',
  ];

  const ICONS = ['☕','🔧','📦','⚡','🌐','🎯','🏗️','📊','🔐','🚀','💡','🎓'];

  return (
    <div style={s.page}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .course-card:hover { transform:translateY(-6px)!important; box-shadow:0 16px 40px rgba(0,0,0,0.4)!important; }
        .cat-btn:hover { background:rgba(233,69,96,0.2)!important; color:#fff!important; }
        .search-btn:hover { opacity:0.85!important; }
        .view-btn:hover { background:#e94560!important; color:#fff!important; }
      `}</style>

      {/* Header */}
      <div style={s.header}>
        <div>
          <h1 style={s.pageTitle}>📚 Explore Courses</h1>
          <p style={s.pageSub}>Master Java & Full Stack Development — {courses.length} courses available</p>
        </div>
        <form onSubmit={handleSearch} style={s.searchRow}>
          <input style={s.searchInput} placeholder="Search courses..."
            value={search} onChange={e => setSearch(e.target.value)} />
          <button className="search-btn" style={s.searchBtn} type="submit">🔍</button>
        </form>
      </div>

      {/* Category tabs */}
      <div style={s.catRow}>
        {categories.map(cat => (
          <button key={cat} className="cat-btn"
            style={{ ...s.catBtn, background: activeCategory === cat ? '#e94560' : 'rgba(255,255,255,0.06)', color: activeCategory === cat ? '#fff' : '#ccc', border: activeCategory === cat ? 'none' : '1px solid rgba(255,255,255,0.1)' }}
            onClick={() => setActiveCategory(cat)}>{cat}</button>
        ))}
      </div>

      {loading ? (
        <div style={s.loading}>
          <div style={{ width:40, height:40, border:'3px solid rgba(233,69,96,0.2)', borderTop:'3px solid #e94560', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
          <p style={{ color:'#aaa', marginTop:16 }}>Loading courses...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div style={s.empty}>
          <div style={{ fontSize:52, marginBottom:12 }}>🔍</div>
          <p style={{ color:'#aaa' }}>No courses found.</p>
        </div>
      ) : (
        <div style={s.grid}>
          {filtered.map((c, i) => (
            <div key={c.id} className="course-card" style={{ ...s.card, animationDelay:`${i*0.06}s` }}>
              {/* Thumbnail */}
              <div style={{ ...s.thumb, background: COLORS[i % COLORS.length] }}>
                <span style={s.thumbIcon}>{ICONS[i % ICONS.length]}</span>
                <div style={s.thumbOverlay} />
                <div style={s.categoryTag}>{c.category || 'General'}</div>
              </div>

              <div style={s.cardBody}>
                <div style={s.courseTitle}>{c.title}</div>
                <div style={s.courseDesc}>{c.description?.slice(0, 90)}...</div>

                <div style={s.meta}>
                  <span style={s.metaItem}>👨‍🏫 {c.instructorName}</span>
                  <span style={s.metaItem}>👥 {c.enrollmentCount} students</span>
                </div>

                {c.durationMinutes && (
                  <div style={s.duration}>⏱ {c.durationMinutes} min</div>
                )}

                <Link to={`/courses/${c.id}`} className="view-btn" style={s.viewBtn}>
                  View Course →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const s = {
  page: { maxWidth:1100, margin:'0 auto', padding:'36px 28px' },
  header: { display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:28, flexWrap:'wrap', gap:16 },
  pageTitle: { color:'#ffffff', fontSize:30, fontWeight:800, margin:'0 0 6px', textShadow:'0 2px 12px rgba(233,69,96,0.3)' },
  pageSub: { color:'#aaa', fontSize:14, margin:0 },
  searchRow: { display:'flex', gap:8 },
  searchInput: { padding:'11px 16px', borderRadius:10, border:'1px solid rgba(255,255,255,0.1)', background:'rgba(255,255,255,0.06)', color:'#fff', fontSize:14, width:220, outline:'none' },
  searchBtn: { padding:'11px 16px', background:'#e94560', color:'#fff', border:'none', borderRadius:10, cursor:'pointer', fontSize:16, transition:'opacity 0.2s' },
  catRow: { display:'flex', gap:10, marginBottom:28, flexWrap:'wrap' },
  catBtn: { padding:'8px 18px', borderRadius:20, cursor:'pointer', fontSize:13, fontWeight:600, transition:'all 0.2s' },
  loading: { display:'flex', flexDirection:'column', alignItems:'center', padding:'80px 0' },
  empty: { textAlign:'center', padding:'80px 0' },
  grid: { display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:20 },
  card: { background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:18, overflow:'hidden', transition:'all 0.25s ease', animation:'fadeUp 0.5s ease both', backdropFilter:'blur(10px)' },
  thumb: { height:150, display:'flex', alignItems:'center', justifyContent:'center', position:'relative' },
  thumbIcon: { fontSize:52, zIndex:2, position:'relative' },
  thumbOverlay: { position:'absolute', inset:0, background:'rgba(0,0,0,0.15)' },
  categoryTag: { position:'absolute', top:12, right:12, background:'rgba(0,0,0,0.5)', color:'#fff', fontSize:11, fontWeight:700, padding:'4px 10px', borderRadius:20, backdropFilter:'blur(4px)', zIndex:3 },
  cardBody: { padding:20 },
  courseTitle: { color:'#ffffff', fontWeight:800, fontSize:16, marginBottom:8, lineHeight:1.4 },
  courseDesc: { color:'#aaa', fontSize:13, lineHeight:1.6, marginBottom:14 },
  meta: { display:'flex', gap:12, marginBottom:8, flexWrap:'wrap' },
  metaItem: { color:'#888', fontSize:12 },
  duration: { color:'#888', fontSize:12, marginBottom:14 },
  viewBtn: { display:'block', textAlign:'center', padding:'10px', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.15)', color:'#fff', borderRadius:10, textDecoration:'none', fontSize:13, fontWeight:600, transition:'all 0.2s' },
};
