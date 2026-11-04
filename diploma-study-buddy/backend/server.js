const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', async (req, res) => {
  try { await pool.query('SELECT 1'); res.json({ ok: true, database: 'connected' }); }
  catch (e) { res.status(500).json({ ok: false, message: 'Database connection failed' }); }
});

app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password, role = 'student' } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'Name, email and password are required.' });
  try {
    const [existing] = await pool.query('SELECT id FROM users WHERE email=?', [email]);
    if (existing.length) return res.status(409).json({ message: 'Email already registered.' });
    const [result] = await pool.query('INSERT INTO users(name,email,password,role) VALUES(?,?,?,?)', [name,email,password,role]);
    res.status(201).json({ id: result.insertId, name, email, role });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password are required.' });
  try {
    const [rows] = await pool.query('SELECT id,name,email,role,branch_id,semester FROM users WHERE email=? AND password=?', [email,password]);
    if (!rows.length) return res.status(401).json({ message: 'Invalid email or password.' });
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

app.get('/api/branches', async (req,res)=>{
  try { const [rows]=await pool.query('SELECT * FROM branches ORDER BY name'); res.json(rows); }
  catch(e){res.status(500).json({message:e.message});}
});
app.get('/api/subjects', async (req,res)=>{
  try {
    const {branch='computer',sem=1}=req.query;
    const [rows]=await pool.query(`SELECT s.id,s.code,s.name,s.icon,s.color,s.semester AS sem,b.id AS branch_id,
      (SELECT COUNT(*) FROM chapters c WHERE c.subject_id=s.id) AS chapter_count
      FROM subjects s JOIN branches b ON b.id=s.branch_id WHERE b.id=? AND s.semester=? ORDER BY s.id`, [branch,sem]);
    for (const s of rows) { const [ch]=await pool.query('SELECT id,title FROM chapters WHERE subject_id=? ORDER BY chapter_no',[s.id]); s.chapters=ch.map(x=>x.title); }
    res.json(rows);
  } catch(e){res.status(500).json({message:e.message});}
});
app.get('/api/subjects/:id/chapters', async(req,res)=>{ try { const [rows]=await pool.query('SELECT * FROM chapters WHERE subject_id=? ORDER BY chapter_no',[req.params.id]); res.json(rows); } catch(e){res.status(500).json({message:e.message});} });
app.get('/api/notes', async(req,res)=>{ try { const [rows]=await pool.query('SELECT * FROM notes ORDER BY uploaded_at DESC'); res.json(rows); } catch(e){res.status(500).json({message:e.message});} });

app.get('/api/doubts/:userId', async(req,res)=>{ try { const [rows]=await pool.query('SELECT * FROM doubts WHERE user_id=? ORDER BY created_at DESC',[req.params.userId]); res.json(rows); } catch(e){res.status(500).json({message:e.message});} });
app.post('/api/doubts', async(req,res)=>{ const {user_id,subject_id,question}=req.body; if(!user_id||!question)return res.status(400).json({message:'User and question are required.'}); try { const [r]=await pool.query('INSERT INTO doubts(user_id,subject_id,question,answer,status) VALUES(?,?,?,?,?)',[user_id,subject_id||null,question,'Answer pending. Review the related chapter and try step-by-step.','Pending']); const [rows]=await pool.query('SELECT * FROM doubts WHERE id=?',[r.insertId]); res.status(201).json(rows[0]); } catch(e){res.status(500).json({message:e.message});} });

app.get('/api/quizzes/:subjectId', async(req,res)=>{ try { const [rows]=await pool.query('SELECT * FROM quizzes WHERE subject_id=? ORDER BY id',[req.params.subjectId]); for(const q of rows){const [qs]=await pool.query('SELECT id,question,option_a,option_b,option_c,option_d,correct_option,marks FROM questions WHERE quiz_id=? ORDER BY id',[q.id]); q.questions=qs;} res.json(rows); }catch(e){res.status(500).json({message:e.message});} });
app.post('/api/progress', async(req,res)=>{ const {user_id,subject_id,chapter_id,completed=false,quiz_score=null}=req.body; try { await pool.query(`INSERT INTO progress(user_id,subject_id,chapter_id,completed,quiz_score) VALUES(?,?,?,?,?) ON DUPLICATE KEY UPDATE completed=VALUES(completed),quiz_score=VALUES(quiz_score),last_accessed=CURRENT_TIMESTAMP`,[user_id,subject_id,chapter_id,completed,quiz_score]); res.json({message:'Progress saved'}); }catch(e){res.status(500).json({message:e.message});} });
app.get('/api/progress/:userId', async(req,res)=>{ try { const [rows]=await pool.query(`SELECT p.*,s.name subject_name,c.title chapter_title FROM progress p JOIN subjects s ON s.id=p.subject_id JOIN chapters c ON c.id=p.chapter_id WHERE p.user_id=? ORDER BY p.last_accessed DESC`,[req.params.userId]); res.json(rows); }catch(e){res.status(500).json({message:e.message});} });
app.post('/api/feedback', async(req,res)=>{ const {user_id,rating,comment}=req.body; try { const [r]=await pool.query('INSERT INTO feedback(user_id,rating,comment) VALUES(?,?,?)',[user_id,rating,comment]); res.status(201).json({id:r.insertId,message:'Feedback saved'}); }catch(e){res.status(500).json({message:e.message});} });
app.post('/api/admin/subjects', async(req,res)=>{ const {branch_id='computer',semester=3,code,name,icon='📘',color='blue'}=req.body; if(!code||!name)return res.status(400).json({message:'Code and name are required.'}); try { const [r]=await pool.query('INSERT INTO subjects(branch_id,semester,code,name,icon,color) VALUES(?,?,?,?,?,?)',[branch_id,semester,code,name,icon,color]); res.status(201).json({id:r.insertId,message:'Subject added'}); }catch(e){res.status(500).json({message:e.message});} });

const PORT=process.env.PORT||5000;
app.listen(PORT,()=>console.log(`Diploma Study Buddy API running on http://localhost:${PORT}`));
