import React, { useEffect, useState } from 'react';
import { courseAPI, quizAPI } from '../api/api';

export default function InstructorPage() {
  const [courses, setCourses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showQuizForm, setShowQuizForm] = useState(null);
  const [form, setForm] = useState({ title:'', description:'', category:'', videoUrl:'', durationMinutes:'' });
  const [quizForm, setQuizForm] = useState({ title:'', questions:[{ questionText:'', optionA:'', optionB:'', optionC:'', optionD:'', correctAnswer:'A' }] });
  const [msg, setMsg] = useState('');

  useEffect(() => { loadMyCourses(); }, []);

  const loadMyCourses = async () => {
    const res = await courseAPI.getAll();
    setCourses(res.data);
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      await courseAPI.create({ ...form, durationMinutes: Number(form.durationMinutes) });
      setMsg('Course created!');
      setShowForm(false);
      setForm({ title:'', description:'', category:'', videoUrl:'', durationMinutes:'' });
      loadMyCourses();
    } catch (err) { setMsg('Error: ' + (err.response?.data?.message || 'Failed')); }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm('Delete this course?')) return;
    await courseAPI.delete(id);
    loadMyCourses();
  };

  const addQuestion = () => {
    setQuizForm({ ...quizForm, questions: [...quizForm.questions, { questionText:'', optionA:'', optionB:'', optionC:'', optionD:'', correctAnswer:'A' }] });
  };

  const handleQuizSubmit = async (e) => {
    e.preventDefault();
    try {
      await quizAPI.create(showQuizForm, quizForm);
      setMsg('Quiz created!');
      setShowQuizForm(null);
      setQuizForm({ title:'', questions:[{ questionText:'', optionA:'', optionB:'', optionC:'', optionD:'', correctAnswer:'A' }] });
    } catch { setMsg('Failed to create quiz'); }
  };

  return (
    <div style={styles.page}>
      <div style={styles.topRow}>
        <h2 style={styles.heading}>Instructor Panel</h2>
        <button style={styles.addBtn} onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '+ New Course'}
        </button>
      </div>
      {msg && <div style={styles.msg}>{msg}</div>}

      {/* Create Course Form */}
      {showForm && (
        <div style={styles.formCard}>
          <h3 style={styles.formTitle}>Create New Course</h3>
          <form onSubmit={handleCreateCourse}>
            {[['title','Course Title'],['description','Description'],['category','Category'],['videoUrl','Video URL (embed)'],['durationMinutes','Duration (minutes)']].map(([key,ph]) => (
              <input key={key} style={styles.input} placeholder={ph} value={form[key]}
                onChange={e => setForm({ ...form, [key]: e.target.value })}
                required={key === 'title'} />
            ))}
            <button style={styles.submitBtn} type="submit">Create Course</button>
          </form>
        </div>
      )}

      {/* Course list */}
      <div style={styles.courseList}>
        {courses.map(c => (
          <div key={c.id} style={styles.courseRow}>
            <div style={styles.courseInfo}>
              <div style={styles.courseTitle}>{c.title}</div>
              <div style={styles.courseMeta}>{c.category} · {c.enrollmentCount} students</div>
            </div>
            <div style={styles.actions}>
              <button style={styles.quizBtn} onClick={() => setShowQuizForm(c.id)}>+ Quiz</button>
              <button style={styles.delBtn} onClick={() => handleDeleteCourse(c.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Quiz Form Modal */}
      {showQuizForm && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3 style={styles.formTitle}>Create Quiz</h3>
            <form onSubmit={handleQuizSubmit}>
              <input style={styles.input} placeholder="Quiz Title" value={quizForm.title}
                onChange={e => setQuizForm({ ...quizForm, title: e.target.value })} required />
              {quizForm.questions.map((q, i) => (
                <div key={i} style={styles.questionBlock}>
                  <div style={styles.qLabel}>Question {i + 1}</div>
                  <input style={styles.input} placeholder="Question text" value={q.questionText}
                    onChange={e => { const qs = [...quizForm.questions]; qs[i].questionText = e.target.value; setQuizForm({ ...quizForm, questions: qs }); }} required />
                  {['A','B','C','D'].map(opt => (
                    <input key={opt} style={styles.input} placeholder={`Option ${opt}`} value={q[`option${opt}`]}
                      onChange={e => { const qs = [...quizForm.questions]; qs[i][`option${opt}`] = e.target.value; setQuizForm({ ...quizForm, questions: qs }); }} />
                  ))}
                  <select style={styles.input} value={q.correctAnswer}
                    onChange={e => { const qs = [...quizForm.questions]; qs[i].correctAnswer = e.target.value; setQuizForm({ ...quizForm, questions: qs }); }}>
                    {['A','B','C','D'].map(o => <option key={o} value={o}>Correct: {o}</option>)}
                  </select>
                </div>
              ))}
              <button type="button" style={styles.addQBtn} onClick={addQuestion}>+ Add Question</button>
              <div style={{ display:'flex', gap:10, marginTop:16 }}>
                <button type="submit" style={styles.submitBtn}>Save Quiz</button>
                <button type="button" style={styles.cancelBtn} onClick={() => setShowQuizForm(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { maxWidth:960, margin:'0 auto', padding:'32px 24px' },
  topRow: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 },
  heading: { color:'#1a1a2e', fontSize:26, margin:0 },
  addBtn: { padding:'10px 20px', background:'#e94560', color:'#fff', border:'none', borderRadius:8, cursor:'pointer', fontWeight:600 },
  msg: { background:'#d4edda', color:'#155724', padding:'10px 16px', borderRadius:8, marginBottom:16 },
  formCard: { background:'#fff', borderRadius:14, padding:24, boxShadow:'0 2px 16px rgba(0,0,0,0.08)', marginBottom:28 },
  formTitle: { color:'#1a1a2e', marginBottom:16 },
  input: { display:'block', width:'100%', padding:'11px 14px', borderRadius:8, border:'1px solid #ddd', marginBottom:12, fontSize:14, boxSizing:'border-box' },
  submitBtn: { padding:'11px 24px', background:'#e94560', color:'#fff', border:'none', borderRadius:8, cursor:'pointer', fontWeight:600 },
  cancelBtn: { padding:'11px 24px', background:'#eee', color:'#555', border:'none', borderRadius:8, cursor:'pointer' },
  courseList: { display:'flex', flexDirection:'column', gap:12 },
  courseRow: { display:'flex', alignItems:'center', justifyContent:'space-between', background:'#fff', borderRadius:12, padding:'16px 20px', boxShadow:'0 2px 10px rgba(0,0,0,0.06)' },
  courseInfo: {},
  courseTitle: { fontWeight:600, color:'#1a1a2e' },
  courseMeta: { color:'#aaa', fontSize:13, marginTop:4 },
  actions: { display:'flex', gap:10 },
  quizBtn: { padding:'7px 16px', background:'#1a1a2e', color:'#fff', border:'none', borderRadius:7, cursor:'pointer', fontSize:13 },
  delBtn: { padding:'7px 16px', background:'#fff', color:'#e94560', border:'1px solid #e94560', borderRadius:7, cursor:'pointer', fontSize:13 },
  overlay: { position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:200 },
  modal: { background:'#fff', borderRadius:16, padding:32, width:520, maxHeight:'85vh', overflowY:'auto' },
  questionBlock: { background:'#f8f9fa', borderRadius:10, padding:16, marginBottom:14 },
  qLabel: { fontWeight:600, color:'#555', marginBottom:10, fontSize:13 },
  addQBtn: { width:'100%', padding:11, background:'#f0f0f0', border:'1px dashed #ccc', borderRadius:8, cursor:'pointer', color:'#555' },
};
