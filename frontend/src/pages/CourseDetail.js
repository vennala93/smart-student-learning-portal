import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { courseAPI, quizAPI } from '../api/api';

export default function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [enrollment, setEnrollment] = useState(null);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const load = async () => {
      const [cRes, qRes, eRes] = await Promise.all([
        courseAPI.getById(id),
        quizAPI.getByCourse(id),
        courseAPI.myEnrollments(),
      ]);
      setCourse(cRes.data);
      setQuizzes(qRes.data);
      const found = eRes.data.find(e => String(e.courseId) === String(id));
      setEnrollment(found || null);
      setLoading(false);
    };
    load().catch(() => setLoading(false));
  }, [id]);

  const handleEnroll = async () => {
    setEnrolling(true);
    try {
      const res = await courseAPI.enroll(id);
      setEnrollment(res.data);
      setMsg('✅ Enrolled successfully!');
    } catch (e) {
      setMsg(e.response?.data?.message || 'Already enrolled');
    } finally { setEnrolling(false); }
  };

  const handleProgress = async (p) => {
    const res = await courseAPI.updateProgress(id, p);
    setEnrollment(res.data);
  };

  const startQuiz = (quiz) => { setActiveQuiz(quiz); setAnswers({}); setResult(null); };

  const submitQuiz = async () => {
    const res = await quizAPI.submit(activeQuiz.id, answers);
    setResult(res.data);
  };

  if (loading) return <div style={styles.loading}>Loading...</div>;
  if (!course) return <div style={styles.loading}>Course not found.</div>;

  return (
    <div style={styles.page}>
      {/* Course header */}
      <div style={styles.header}>
        <div>
          <div style={styles.category}>{course.category || 'General'}</div>
          <h1 style={styles.title}>{course.title}</h1>
          <p style={styles.desc}>{course.description}</p>
          <div style={styles.meta}>
            <span>👨‍🏫 {course.instructorName}</span>
            <span>👥 {course.enrollmentCount} students</span>
            {course.durationMinutes && <span>⏱ {course.durationMinutes} min</span>}
          </div>
        </div>
        <div style={styles.enrollBox}>
          {enrollment ? (
            <>
              <div style={styles.enrolled}>✅ Enrolled</div>
              <div style={styles.progressRow}>
                <div style={styles.progressBar}>
                  <div style={{ ...styles.progressFill, width: `${enrollment.progressPercent}%` }} />
                </div>
                <span style={styles.progressLabel}>{enrollment.progressPercent}%</span>
              </div>
              <div style={styles.progressBtns}>
                {[25, 50, 75, 100].map(p => (
                  <button key={p} style={styles.pBtn} onClick={() => handleProgress(p)}>+{p}%</button>
                ))}
              </div>
            </>
          ) : (
            <button style={styles.enrollBtn} onClick={handleEnroll} disabled={enrolling}>
              {enrolling ? 'Enrolling...' : '🚀 Enroll Now'}
            </button>
          )}
          {msg && <div style={styles.msg}>{msg}</div>}
        </div>
      </div>

      {/* Video */}
      {course.videoUrl && (
        <div style={styles.videoWrap}>
          <iframe title="course-video" src={course.videoUrl} style={styles.video}
            allowFullScreen frameBorder="0" />
        </div>
      )}

      {/* Quizzes */}
      {quizzes.length > 0 && !activeQuiz && (
        <div style={styles.quizSection}>
          <h3 style={styles.sectionTitle}>📝 Quizzes</h3>
          {quizzes.map(q => (
            <div key={q.id} style={styles.quizCard}>
              <span>{q.title}</span>
              <span style={styles.qCount}>{q.questions?.length || 0} questions</span>
              <button style={styles.startBtn} onClick={() => startQuiz(q)}>Start Quiz</button>
            </div>
          ))}
        </div>
      )}

      {/* Active quiz */}
      {activeQuiz && (
        <div style={styles.quizSection}>
          <h3 style={styles.sectionTitle}>{activeQuiz.title}</h3>
          {result ? (
            <div style={styles.resultBox}>
              <div style={styles.score}>{result.score}/{result.total}</div>
              <div style={styles.pct}>{result.percentage.toFixed(1)}%</div>
              <div style={{ color: result.percentage >= 60 ? '#16c79a' : '#e94560', fontWeight:600 }}>
                {result.percentage >= 60 ? '🎉 Passed!' : '❌ Try again'}
              </div>
              <button style={styles.startBtn} onClick={() => setActiveQuiz(null)}>Back to Quizzes</button>
            </div>
          ) : (
            <>
              {activeQuiz.questions.map((q, i) => (
                <div key={q.id} style={styles.question}>
                  <div style={styles.qText}>{i + 1}. {q.questionText}</div>
                  {['A','B','C','D'].map(opt => {
                    const val = q[`option${opt}`];
                    if (!val) return null;
                    return (
                      <label key={opt} style={{ ...styles.option, background: answers[q.id] === opt ? '#e94560' : '#f8f9fa', color: answers[q.id] === opt ? '#fff' : '#333' }}>
                        <input type="radio" name={`q_${q.id}`} value={opt}
                          checked={answers[q.id] === opt}
                          onChange={() => setAnswers({ ...answers, [q.id]: opt })}
                          style={{ marginRight:8 }} />
                        {opt}. {val}
                      </label>
                    );
                  })}
                </div>
              ))}
              <button style={styles.enrollBtn} onClick={submitQuiz}>Submit Quiz</button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { maxWidth:960, margin:'0 auto', padding:'32px 24px' },
  loading: { textAlign:'center', padding:60, color:'#888' },
  header: { display:'flex', gap:32, justifyContent:'space-between', flexWrap:'wrap', marginBottom:28 },
  category: { color:'#e94560', fontWeight:600, fontSize:12, textTransform:'uppercase', letterSpacing:1, marginBottom:8 },
  title: { fontSize:30, color:'#1a1a2e', margin:'0 0 12px' },
  desc: { color:'#555', lineHeight:1.7, maxWidth:600 },
  meta: { display:'flex', gap:20, color:'#999', fontSize:13, marginTop:12 },
  enrollBox: { minWidth:240, background:'#fff', borderRadius:14, padding:24, boxShadow:'0 4px 20px rgba(0,0,0,0.1)', alignSelf:'flex-start' },
  enrolled: { color:'#16c79a', fontWeight:600, marginBottom:12 },
  progressRow: { display:'flex', alignItems:'center', gap:10, marginBottom:12 },
  progressBar: { flex:1, height:8, background:'#eee', borderRadius:20 },
  progressFill: { height:8, background:'#e94560', borderRadius:20 },
  progressLabel: { fontSize:13, color:'#555', minWidth:30 },
  progressBtns: { display:'flex', gap:6, flexWrap:'wrap' },
  pBtn: { padding:'4px 10px', border:'1px solid #e94560', color:'#e94560', background:'#fff', borderRadius:6, cursor:'pointer', fontSize:12 },
  enrollBtn: { width:'100%', padding:14, background:'#e94560', color:'#fff', border:'none', borderRadius:10, cursor:'pointer', fontWeight:700, fontSize:15 },
  msg: { marginTop:12, color:'#16c79a', fontSize:13, textAlign:'center' },
  videoWrap: { marginBottom:28, borderRadius:12, overflow:'hidden' },
  video: { width:'100%', height:400, border:'none' },
  quizSection: { background:'#fff', borderRadius:14, padding:24, boxShadow:'0 2px 12px rgba(0,0,0,0.07)', marginTop:24 },
  sectionTitle: { color:'#1a1a2e', fontSize:20, marginBottom:16 },
  quizCard: { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 0', borderBottom:'1px solid #f0f0f0' },
  qCount: { color:'#aaa', fontSize:13 },
  startBtn: { padding:'8px 18px', background:'#1a1a2e', color:'#fff', border:'none', borderRadius:8, cursor:'pointer' },
  question: { marginBottom:24 },
  qText: { fontWeight:600, color:'#1a1a2e', marginBottom:10, fontSize:15 },
  option: { display:'flex', alignItems:'center', padding:'10px 16px', borderRadius:8, marginBottom:8, cursor:'pointer', border:'1px solid #eee', transition:'all 0.15s' },
  resultBox: { textAlign:'center', padding:32 },
  score: { fontSize:48, fontWeight:700, color:'#1a1a2e' },
  pct: { fontSize:24, color:'#e94560', marginBottom:12 },
};
