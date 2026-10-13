import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>📚 SmartLearn</Link>
      <div style={styles.links}>
        {user ? (
          <>
            <Link to="/dashboard" style={styles.link}>Dashboard</Link>
            <Link to="/courses" style={styles.link}>Courses</Link>
            {(user.role === 'INSTRUCTOR' || user.role === 'ADMIN') && (
              <Link to="/instructor" style={styles.link}>My Courses</Link>
            )}
            {user.role === 'ADMIN' && (
              <Link to="/admin" style={styles.link}>Admin</Link>
            )}
            <span style={styles.username}>👤 {user.fullName}</span>
            <button onClick={handleLogout} style={styles.btn}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.btnLink}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 32px', height:60, background:'#1a1a2e', position:'sticky', top:0, zIndex:100 },
  brand: { color:'#e94560', fontSize:22, fontWeight:700, textDecoration:'none' },
  links: { display:'flex', alignItems:'center', gap:20 },
  link: { color:'#ccc', textDecoration:'none', fontSize:14 },
  btnLink: { background:'#e94560', color:'#fff', padding:'6px 16px', borderRadius:6, textDecoration:'none', fontSize:14 },
  btn: { background:'transparent', border:'1px solid #e94560', color:'#e94560', padding:'5px 14px', borderRadius:6, cursor:'pointer', fontSize:13 },
  username: { color:'#aaa', fontSize:13 },
};
