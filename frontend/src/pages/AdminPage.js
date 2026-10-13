import React, { useEffect, useState } from 'react';
import { adminAPI } from '../api/api';

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getUsers().then(res => setUsers(res.data)).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    await adminAPI.deleteUser(id);
    setUsers(users.filter(u => u.id !== id));
  };

  const filtered = filter === 'ALL' ? users : users.filter(u => u.role === filter);

  const roleBg = { STUDENT:'#d4edda', INSTRUCTOR:'#cce5ff', ADMIN:'#f8d7da' };
  const roleColor = { STUDENT:'#155724', INSTRUCTOR:'#004085', ADMIN:'#721c24' };

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>Admin Panel</h2>

      {/* Summary cards */}
      <div style={styles.statsRow}>
        {[['Total Users', users.length, '#e94560'],
          ['Students', users.filter(u=>u.role==='STUDENT').length, '#16c79a'],
          ['Instructors', users.filter(u=>u.role==='INSTRUCTOR').length, '#f5a623'],
          ['Admins', users.filter(u=>u.role==='ADMIN').length, '#a29bfe']].map(([l,v,c],i) => (
          <div key={i} style={{ ...styles.stat, borderTop:`4px solid ${c}` }}>
            <div style={{ ...styles.statVal, color:c }}>{v}</div>
            <div style={styles.statLbl}>{l}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div style={styles.filterRow}>
        {['ALL','STUDENT','INSTRUCTOR','ADMIN'].map(r => (
          <button key={r} style={{ ...styles.filterBtn, background: filter===r ? '#1a1a2e':'#fff', color: filter===r ?'#fff':'#555' }}
            onClick={() => setFilter(r)}>{r}</button>
        ))}
      </div>

      {/* Users table */}
      {loading ? <div style={styles.loading}>Loading...</div> : (
        <div style={styles.table}>
          <div style={styles.tableHeader}>
            <span>#</span><span>Name</span><span>Email</span><span>Role</span><span>Actions</span>
          </div>
          {filtered.map((u, i) => (
            <div key={u.id} style={styles.tableRow}>
              <span style={styles.num}>{i+1}</span>
              <span style={styles.name}>{u.fullName}</span>
              <span style={styles.email}>{u.email}</span>
              <span style={{ ...styles.badge, background: roleBg[u.role], color: roleColor[u.role] }}>{u.role}</span>
              <button style={styles.delBtn} onClick={() => handleDelete(u.id)}>Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { maxWidth:1100, margin:'0 auto', padding:'32px 24px' },
  heading: { color:'#1a1a2e', fontSize:26, marginBottom:24 },
  loading: { textAlign:'center', padding:60, color:'#888' },
  statsRow: { display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:16, marginBottom:28 },
  stat: { background:'#fff', borderRadius:12, padding:'20px 24px', boxShadow:'0 2px 10px rgba(0,0,0,0.07)' },
  statVal: { fontSize:32, fontWeight:700 },
  statLbl: { color:'#888', fontSize:13, marginTop:4 },
  filterRow: { display:'flex', gap:8, marginBottom:20 },
  filterBtn: { padding:'8px 18px', border:'1px solid #ddd', borderRadius:8, cursor:'pointer', fontSize:13 },
  table: { background:'#fff', borderRadius:14, overflow:'hidden', boxShadow:'0 2px 16px rgba(0,0,0,0.07)' },
  tableHeader: { display:'grid', gridTemplateColumns:'40px 1fr 1fr 110px 80px', gap:16, padding:'12px 20px', background:'#f8f9fa', fontWeight:600, color:'#555', fontSize:13 },
  tableRow: { display:'grid', gridTemplateColumns:'40px 1fr 1fr 110px 80px', gap:16, padding:'13px 20px', borderTop:'1px solid #f0f0f0', alignItems:'center', fontSize:14 },
  num: { color:'#aaa', fontSize:13 },
  name: { fontWeight:600, color:'#1a1a2e' },
  email: { color:'#777' },
  badge: { display:'inline-block', padding:'3px 10px', borderRadius:20, fontSize:11, fontWeight:600, textAlign:'center' },
  delBtn: { padding:'5px 12px', background:'#fff', color:'#e94560', border:'1px solid #e94560', borderRadius:6, cursor:'pointer', fontSize:12 },
};
