import { useState, useEffect } from "react";
import axios from "axios";
import html2pdf from "html2pdf.js";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://liqvdkokbdzpuujiqwgu.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpcXZka29rYmR6cHV1amlxd2d1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzNDI2ODMsImV4cCI6MjA4NzkxODY4M30.-n7NYS9dn1hu52owTQqtitLQk7dwfkEnOcfYuFu9YWk";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const API = "http://127.0.0.1:8000";

const fontLink = document.createElement("link");
fontLink.href = "https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

const BRANCH_ROLES = {
  CSE: ["AI/ML Engineer", "Frontend Developer", "Backend Developer", "Data Analyst", "Full Stack Developer"],
  ECE: ["Embedded Systems Engineer", "VLSI Design Engineer", "IoT Developer", "Signal Processing Engineer"],
  Mechanical: ["CAD/CAM Engineer", "Manufacturing Engineer", "Robotics Engineer"],
  Civil: ["Structural Engineer", "Environmental Engineer", "Construction Manager"],
};

const ROLE_ICONS = {
  "AI/ML Engineer": "🤖", "Frontend Developer": "🎨", "Backend Developer": "⚙️",
  "Data Analyst": "📊", "Full Stack Developer": "🔥", "Embedded Systems Engineer": "🔌",
  "VLSI Design Engineer": "🧬", "IoT Developer": "📡", "Signal Processing Engineer": "📶",
  "CAD/CAM Engineer": "🖥️", "Manufacturing Engineer": "🏭", "Robotics Engineer": "🦾",
  "Structural Engineer": "🏗️", "Environmental Engineer": "🌿", "Construction Manager": "🏢",
};

const COMPANY_LINKS = {
  TCS: "https://www.placementpreparation.io/tcs-nqt/",
  Infosys: "https://www.placementpreparation.io/infosys/",
  Wipro: "https://www.placementpreparation.io/wipro-wilp/",
  Accenture: "https://www.placementpreparation.io/accenture/",
  Cognizant: "https://www.placementpreparation.io/cognizant-genc/",
  Deloitte: "https://www.placementpreparation.io/deloitte/",
  Zoho: "https://www.placementpreparation.io/zoho/",
};

const APTITUDE_LINKS = [
  { title: "Quantitative Aptitude", url: "https://www.placementpreparation.io/quantitative-aptitude/", icon: "🔢" },
  { title: "Logical Reasoning", url: "https://www.placementpreparation.io/logical-reasoning/", icon: "🧩" },
  { title: "Verbal Ability", url: "https://www.placementpreparation.io/verbal-ability/", icon: "📖" },
  { title: "Data Interpretation", url: "https://www.placementpreparation.io/data-interpretation/", icon: "📊" },
];

const WHAT_NEXT = {
  "AI/ML Engineer": ["Deep Learning Specialization (Coursera)", "Build end-to-end ML projects", "Contribute to open source AI repos", "Learn MLOps and model deployment"],
  "Frontend Developer": ["Learn React Native for mobile", "Master TypeScript", "Study Web Performance & Core Web Vitals", "Build a full SaaS product"],
  "Backend Developer": ["Learn Docker & Kubernetes", "Study distributed systems", "Build microservices architecture", "Learn cloud (AWS/GCP/Azure)"],
  "Data Analyst": ["Learn Power BI or Tableau", "Study advanced SQL", "Learn Python for automation", "Get Google Data Analytics Certificate"],
  "Full Stack Developer": ["Learn DevOps basics", "Study system design", "Build and deploy a full product", "Learn TypeScript"],
  "Embedded Systems Engineer": ["Learn RTOS", "Study ARM architecture", "Work on IoT projects", "Learn PCB design basics"],
  "VLSI Design Engineer": ["Learn Verilog/VHDL advanced", "Study FPGA programming", "Get familiar with EDA tools", "Study semiconductor physics"],
  "IoT Developer": ["Learn cloud IoT platforms (AWS IoT)", "Study MQTT protocol", "Build smart home projects", "Learn edge computing"],
  "Signal Processing Engineer": ["Learn MATLAB advanced", "Study digital communications", "Learn Python DSP libraries", "Study radar/sonar systems"],
  "CAD/CAM Engineer": ["Learn ANSYS for simulation", "Study GD&T", "Learn CNC programming", "Get AutoCAD certification"],
  "Manufacturing Engineer": ["Learn Six Sigma", "Study lean manufacturing", "Learn ERP systems (SAP)", "Study quality management"],
  "Robotics Engineer": ["Learn ROS (Robot Operating System)", "Study computer vision", "Build autonomous robots", "Learn motion planning algorithms"],
  "Structural Engineer": ["Learn STAAD Pro advanced", "Study earthquake engineering", "Learn BIM (Building Information Modeling)", "Get ETABS certification"],
  "Environmental Engineer": ["Learn GIS software", "Study environmental impact assessment", "Learn water treatment systems", "Study sustainability frameworks"],
  "Construction Manager": ["Learn MS Project", "Study BIM workflows", "Get PMP certification", "Learn contract management"],
};

const exportPDF = (roadmap, form) => {
  const content = document.createElement("div");
  content.style.fontFamily = "Arial, sans-serif";
  content.style.padding = "32px";
  content.style.color = "#1e1b4b";
  content.innerHTML = `
    <div style="text-align:center;padding:24px;background:linear-gradient(135deg,#4F46E5,#7c3aed);border-radius:12px;color:white;margin-bottom:32px;">
      <div style="font-size:24px;font-weight:900;margin-bottom:4px;">⚡ PathForge</div>
      <div style="font-size:18px;font-weight:700;margin-bottom:4px;">${form.name}'s 8-Week Roadmap</div>
      <div style="font-size:13px;opacity:0.9;">${form.role} · ${form.branch} · Level: ${roadmap.level}${form.company ? " · " + form.company : ""}</div>
      <div style="font-size:11px;opacity:0.75;margin-top:4px;">Generated on ${new Date().toLocaleDateString()}</div>
    </div>
    ${roadmap.weeks.map(w => `
      <div style="margin-bottom:20px;border:1.5px solid #e0e7ff;border-radius:10px;overflow:hidden;">
        <div style="background:#4F46E5;color:white;padding:10px 16px;">
          <span style="font-size:11px;background:rgba(255,255,255,0.2);padding:2px 8px;border-radius:8px;margin-right:8px;">Week ${w.week}</span>
          <span style="font-size:14px;font-weight:700;">${w.theme}</span>
        </div>
        <div style="padding:14px 16px;background:white;">
          <div style="font-weight:700;font-size:12px;color:#4F46E5;margin-bottom:6px;">TASKS</div>
          ${w.tasks.map(t => `<div style="padding:4px 0;font-size:13px;border-bottom:1px solid #f1f5f9;">☐ ${t}</div>`).join("")}
          <div style="font-weight:700;font-size:12px;color:#4F46E5;margin:10px 0 6px;">RESOURCES</div>
          ${w.resources.map(r => `<div style="font-size:12px;color:#4338ca;padding:2px 0;">🔗 ${r.title}</div>`).join("")}
          <div style="margin-top:10px;padding:8px 12px;background:#fefce8;border-radius:6px;font-size:12px;color:#78350f;">🎯 <strong>Milestone:</strong> ${w.milestone}</div>
        </div>
      </div>
    `).join("")}
    <div style="text-align:center;margin-top:24px;font-size:11px;color:#94a3b8;">Generated by PathForge · Your Personal Placement Coach</div>
  `;
  html2pdf().set({ margin: 0.5, filename: `${form.name}_PathForge_Roadmap.pdf`, image: { type: "jpeg", quality: 0.98 }, html2canvas: { scale: 2 }, jsPDF: { unit: "in", format: "a4", orientation: "portrait" } }).from(content).save();
};

export default function App() {
  const [user, setUser] = useState(null);
  const [authPage, setAuthPage] = useState("login");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authReady, setAuthReady] = useState(false);
  const [page, setPage] = useState("landing");
  const [dark, setDark] = useState(false);
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", branch: "CSE", role: "", goal: "product", current_skills: [], hours_per_week: 8, company: "" });
  const [quiz, setQuiz] = useState([]);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizLoading, setQuizLoading] = useState(false);
  const [checked, setChecked] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [notes, setNotes] = useState({});
  const [lform, setLform] = useState({ name: "", branch: "", year: "1st", skills: [], projects: [], clubs: [] });
  const [bio, setBio] = useState("");
  const [lloading, setLloading] = useState(false);
  const [resume, setResume] = useState(null);
  const [resumeLoading, setResumeLoading] = useState(false);
  const [rform, setRform] = useState({ skills: [], projects: [] });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthReady(true);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user || !roadmap) return;
    const load = async () => {
      const { data } = await supabase.from("progress").select("*").eq("user_id", user.id);
      if (data) {
        const n = {};
        data.forEach(row => { localStorage.setItem(`week_${row.week_index}`, JSON.stringify(row.checked_tasks || [])); n[row.week_index] = row.notes || ""; });
        setNotes(n);
      }
    };
    load();
  }, [user, roadmap]);

  const signUp = async () => {
    setAuthLoading(true); setAuthError("");
    const { error } = await supabase.auth.signUp({ email: authEmail, password: authPassword });
    if (error) setAuthError(error.message);
    else setAuthError("✅ Check your email to confirm, then log in.");
    setAuthLoading(false);
  };

  const signIn = async () => {
    setAuthLoading(true); setAuthError("");
    const { error } = await supabase.auth.signInWithPassword({ email: authEmail, password: authPassword });
    if (error) setAuthError(error.message);
    else setPage("profile");
    setAuthLoading(false);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setRoadmap(null); setPage("landing");
    for (let i = 0; i < 8; i++) localStorage.removeItem(`week_${i}`);
    setNotes({});
  };

  const saveProgress = async (weekIdx, tasks, noteText) => {
    if (!user) return;
    await supabase.from("progress").upsert({ user_id: user.id, week_index: weekIdx, checked_tasks: tasks, notes: noteText ?? notes[weekIdx] ?? "", updated_at: new Date().toISOString() }, { onConflict: "user_id,week_index" });
  };

  const d = dark;
  const skills = ["Python", "C", "Java", "Git", "DSA", "HTML/CSS", "No experience"];
  const bg = d ? "#0f172a" : "#f8f7ff";
  const cardBg = d ? "#1e293b" : "white";
  const textPrimary = d ? "#f1f5f9" : "#0f172a";
  const textSub = d ? "#94a3b8" : "#64748b";
  const border = d ? "#334155" : "#e0e7ff";
  const inputBg = d ? "#0f172a" : "white";
  const chipBg = d ? "#1e293b" : "#f3f4f6";
  const rowBg = d ? "#1e293b" : "#fafafa";
  const roleActiveBg = d ? "#2d2f6b" : "#eef2ff";

  const toggleSkill = (skill) => setForm(f => ({ ...f, current_skills: f.current_skills.includes(skill) ? f.current_skills.filter(s => s !== skill) : [...f.current_skills, skill] }));

  const fetchQuiz = async () => {
    if (!form.role) return alert("Please select a role first.");
    setQuizLoading(true); setQuizAnswers({});
    try { const res = await axios.post(`${API}/get-quiz`, { branch: form.branch, role: form.role }); setQuiz(res.data.questions || []); setPage("quiz"); }
    catch (e) { alert("Error loading quiz."); }
    setQuizLoading(false);
  };

  const generateRoadmap = async () => {
    setLoading(true);
    try {
      const ap = {};
      quiz.forEach((q, i) => { const sel = quizAnswers[i]; ap[i] = { selected: sel, correct: sel === q.correct }; });
      const res = await axios.post(`${API}/generate-roadmap`, { ...form, quiz_answers: ap });
      for (let i = 0; i < 8; i++) localStorage.removeItem(`week_${i}`);
      setNotes({}); setRoadmap(res.data); setChecked([]);
      setLform(f => ({ ...f, name: form.name, branch: form.branch }));
      setPage("roadmap");
    } catch (e) { alert("Error generating roadmap."); }
    setLoading(false);
  };

  const handleWeekSelect = (i) => { setSelectedWeek(i); setChecked(JSON.parse(localStorage.getItem(`week_${i}`) || "[]")); setPage("week"); };

  const toggleTask = async (i) => {
    const next = checked.includes(i) ? checked.filter(x => x !== i) : [...checked, i];
    setChecked(next); localStorage.setItem(`week_${selectedWeek}`, JSON.stringify(next));
    await saveProgress(selectedWeek, next, null);
  };

  const saveNote = async (wi, text) => {
    const updated = { ...notes, [wi]: text }; setNotes(updated);
    await saveProgress(wi, JSON.parse(localStorage.getItem(`week_${wi}`) || "[]"), text);
  };

  const generateBio = async () => { setLloading(true); try { const res = await axios.post(`${API}/generate-linkedin`, lform); setBio(res.data.bio); } catch { alert("Error."); } setLloading(false); };
  const generateResume = async () => { setResumeLoading(true); try { const res = await axios.post(`${API}/generate-resume`, { name: form.name, branch: form.branch, role: form.role, skills: rform.skills, projects: rform.projects }); setResume(res.data); } catch { alert("Error."); } setResumeLoading(false); };

  const week = roadmap?.weeks?.[selectedWeek];
  const pct = week ? Math.round((checked.length / week.tasks.length) * 100) : 0;
  const allPct = roadmap?.weeks?.map((w, i) => { const sv = JSON.parse(localStorage.getItem(`week_${i}`) || "[]"); return Math.round((sv.length / w.tasks.length) * 100); }) || [];
  const overallPct = allPct.length ? Math.round(allPct.reduce((a, b) => a + b, 0) / allPct.length) : 0;
  const uniqueSkills = [...new Set(roadmap?.weeks?.flatMap(w => w.theme.split(/[+&,]/).map(t => t.trim())) || [])];

  const DarkBtn = () => (
    <button onClick={() => setDark(!d)} style={{ ...s.darkBtn, background: d ? "#334155" : "#eef2ff", color: d ? "#f1f5f9" : "#4F46E5" }}>
      {d ? "☀️ Light" : "🌙 Dark"}
    </button>
  );

  if (!authReady) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8f7ff", fontFamily: "'DM Sans', sans-serif", fontSize: 18, color: "#4F46E5" }}>
      ⚡ Loading PathForge...
    </div>
  );

  // ── LANDING — always public
  if (page === "landing") return (
    <div style={{ ...s.page, background: bg }}>
      <style>{css}</style>
      <nav style={{ ...s.nav, background: cardBg, borderColor: border }}>
        <span style={{ ...s.logo, color: textPrimary }}>⚡ PathForge</span>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {user && <span style={{ fontSize: 13, color: textSub }}>👤 {user.email}</span>}
          {user && <button style={{ ...s.navBtn, background: "#ef4444" }} onClick={signOut}>Log Out</button>}
          <DarkBtn />
          <button style={s.navBtn} onClick={() => user ? setPage("profile") : setPage("auth")}>Get Started →</button>
        </div>
      </nav>
      <div style={s.hero}>
        <div style={s.heroInner}>
          <div style={s.badge}>🎓 Built for 1st Year Engineering Students</div>
          <h1 style={{ ...s.heroTitle, color: textPrimary }}>Your Personal<br /><span style={s.accent}>Placement Coach</span></h1>
          <p style={{ ...s.heroSub, color: textSub }}>Get a personalized 8-week roadmap based on your branch, target role, and skill level. Real resources, real tasks, real results.</p>
          <div style={s.featureRow}>
            {[["🗺️","Custom Roadmap","8 weeks tailored to your role"],["🧠","Skill Quiz","Assess your level before starting"],["📚","Real Resources","YouTube, LeetCode, Kaggle & more"],["💼","LinkedIn Bio","AI-generated profile in seconds"]].map(([icon,title,desc]) => (
              <div key={title} style={{ ...s.featureCard, background: cardBg, borderColor: border }}>
                <div style={s.featureIcon}>{icon}</div>
                <div style={{ ...s.featureTitle, color: textPrimary }}>{title}</div>
                <div style={{ ...s.featureDesc, color: textSub }}>{desc}</div>
              </div>
            ))}
          </div>
          <button style={s.heroBtn} onClick={() => user ? setPage("profile") : setPage("auth")} className="pulse-btn">Start My Journey →</button>
        </div>
      </div>
    </div>
  );

  // ── AUTH — login/signup
  if (page === "auth") return (
    <div style={{ ...s.page, background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <style>{css}</style>
      <div style={{ ...s.card, background: cardBg, borderColor: border, maxWidth: 440 }}>
        <button onClick={() => setPage("landing")} style={{ ...s.back, color: "#4F46E5", marginBottom: 20, display: "block" }}>← Back</button>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, color: "#4F46E5", marginBottom: 4 }}>⚡ PathForge</div>
          <div style={{ color: textSub, fontSize: 14 }}>Your Personal Placement Coach</div>
        </div>
        <div style={{ display: "flex", background: d ? "#0f172a" : "#f1f5f9", borderRadius: 10, padding: 4, marginBottom: 24 }}>
          {["login", "signup"].map(tab => (
            <button key={tab} onClick={() => { setAuthPage(tab); setAuthError(""); }}
              style={{ flex: 1, padding: "10px", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 14, fontFamily: "'Syne', sans-serif", background: authPage === tab ? "#4F46E5" : "transparent", color: authPage === tab ? "white" : textSub, transition: "all 0.2s" }}>
              {tab === "login" ? "Log In" : "Sign Up"}
            </button>
          ))}
        </div>
        <label style={{ ...s.label, color: textSub }}>Email</label>
        <input style={{ ...s.input, background: inputBg, borderColor: border, color: textPrimary }} type="email" placeholder="you@example.com" value={authEmail} onChange={e => setAuthEmail(e.target.value)} />
        <label style={{ ...s.label, color: textSub }}>Password</label>
        <input style={{ ...s.input, background: inputBg, borderColor: border, color: textPrimary }} type="password" placeholder="••••••••" value={authPassword} onChange={e => setAuthPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && (authPage === "login" ? signIn() : signUp())} />
        {authError && (
          <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 8, background: authError.startsWith("✅") ? "#f0fdf4" : "#fef2f2", color: authError.startsWith("✅") ? "#16a34a" : "#dc2626", fontSize: 13 }}>
            {authError}
          </div>
        )}
        <button style={{ ...s.btn, opacity: authLoading ? 0.6 : 1 }} onClick={authPage === "login" ? signIn : signUp} disabled={authLoading}>
          {authLoading ? "⏳ Please wait..." : authPage === "login" ? "Log In →" : "Create Account →"}
        </button>
        <div style={{ textAlign: "center", marginTop: 16, fontSize: 13, color: textSub }}>
          {authPage === "login" ? "Don't have an account? " : "Already have an account? "}
          <span style={{ color: "#4F46E5", cursor: "pointer", fontWeight: 600 }} onClick={() => { setAuthPage(authPage === "login" ? "signup" : "login"); setAuthError(""); }}>
            {authPage === "login" ? "Sign Up" : "Log In"}
          </span>
        </div>
      </div>
    </div>
  );

  // ── Guard — all pages below need login
  if (!user) { setPage("auth"); return null; }

  // ── PROFILE
  if (page === "profile") return (
    <div style={{ ...s.page, background: bg }}>
      <style>{css}</style>
      <div style={s.centered}>
        <div style={{ ...s.card, background: cardBg, borderColor: border }}>
          <div style={s.topRow}><button onClick={() => setPage("landing")} style={{ ...s.back, color: "#4F46E5" }}>← Back</button><DarkBtn /></div>
          <h2 style={{ ...s.cardTitle, color: textPrimary }}>Tell us about yourself</h2>
          <p style={{ ...s.cardSub, color: textSub }}>We'll use this to build your personalized roadmap</p>
          <label style={{ ...s.label, color: textSub }}>Your Name</label>
          <input style={{ ...s.input, background: inputBg, borderColor: border, color: textPrimary }} placeholder="e.g. Revant" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <label style={{ ...s.label, color: textSub }}>Branch</label>
          <select style={{ ...s.input, background: inputBg, borderColor: border, color: textPrimary }} value={form.branch} onChange={e => setForm({ ...form, branch: e.target.value, role: "" })}>
            {Object.keys(BRANCH_ROLES).map(b => <option key={b} value={b}>{b}</option>)}
          </select>
          <label style={{ ...s.label, color: textSub }}>Target Role</label>
          <div style={s.roleGrid}>
            {BRANCH_ROLES[form.branch]?.map(role => {
              const isActive = form.role === role;
              return (
                <div key={role} onClick={() => setForm({ ...form, role })} style={{ ...s.roleCard, borderColor: isActive ? "#4F46E5" : border, background: isActive ? roleActiveBg : rowBg }}>
                  <span style={s.roleIcon}>{ROLE_ICONS[role]}</span>
                  <span style={{ ...s.roleName, color: textPrimary }}>{role}</span>
                </div>
              );
            })}
          </div>
          <label style={{ ...s.label, color: textSub }}>Goal</label>
          <select style={{ ...s.input, background: inputBg, borderColor: border, color: textPrimary }} value={form.goal} onChange={e => setForm({ ...form, goal: e.target.value })}>
            <option value="product">Product Company (Google, Microsoft)</option>
            <option value="service">Service Company (TCS, Infosys)</option>
            <option value="startup">Startup</option>
            <option value="higher_studies">Higher Studies (MS/MBA)</option>
          </select>
          <label style={{ ...s.label, color: textSub }}>Target Company</label>
          <select style={{ ...s.input, background: inputBg, borderColor: border, color: textPrimary }} value={form.company} onChange={e => setForm({ ...form, company: e.target.value })}>
            <option value="">No specific company</option>
            <optgroup label="Service Companies">
              <option value="TCS">TCS</option><option value="Infosys">Infosys</option>
              <option value="Wipro">Wipro</option><option value="Accenture">Accenture</option>
              <option value="Cognizant">Cognizant</option><option value="Deloitte">Deloitte</option>
            </optgroup>
            <optgroup label="Product Companies">
              <option value="Google">Google</option><option value="Microsoft">Microsoft</option>
              <option value="Amazon">Amazon</option><option value="Flipkart">Flipkart</option>
              <option value="Zoho">Zoho</option>
            </optgroup>
          </select>
          <label style={{ ...s.label, color: textSub }}>Hours per week</label>
          <select style={{ ...s.input, background: inputBg, borderColor: border, color: textPrimary }} value={form.hours_per_week} onChange={e => setForm({ ...form, hours_per_week: parseInt(e.target.value) })}>
            <option value={4}>4 hours — Casual</option><option value={8}>8 hours — Consistent</option>
            <option value={12}>12 hours — Serious</option><option value={20}>20+ hours — Intense</option>
          </select>
          <label style={{ ...s.label, color: textSub }}>Current Skills</label>
          <div style={s.skillGrid}>
            {skills.map(skill => {
              const isActive = form.current_skills.includes(skill);
              return <div key={skill} onClick={() => toggleSkill(skill)} style={{ ...s.chip, background: isActive ? roleActiveBg : chipBg, color: isActive ? "#4F46E5" : textPrimary, border: isActive ? "1.5px solid #4F46E5" : "1.5px solid transparent" }}>{skill}</div>;
            })}
          </div>
          <button style={{ ...s.btn, opacity: (!form.name || !form.role) ? 0.5 : 1 }} onClick={fetchQuiz} disabled={!form.name || !form.role || quizLoading}>
            {quizLoading ? "⏳ Loading Quiz..." : "Take Skill Quiz →"}
          </button>
        </div>
      </div>
    </div>
  );

  // ── QUIZ
  if (page === "quiz") return (
    <div style={{ ...s.page, background: bg }}>
      <style>{css}</style>
      <div style={s.centered}>
        <div style={{ ...s.card, maxWidth: 680, background: cardBg, borderColor: border }}>
          <div style={s.topRow}><button onClick={() => setPage("profile")} style={{ ...s.back, color: "#4F46E5" }}>← Back</button><DarkBtn /></div>
          <h2 style={{ ...s.cardTitle, color: textPrimary }}>Skill Assessment</h2>
          <p style={{ ...s.cardSub, color: textSub }}>5 quick questions to personalize your roadmap for <strong>{form.role}</strong></p>
          {quiz.map((q, qi) => (
            <div key={qi} style={{ ...s.questionBlock, borderColor: border }}>
              <p style={{ ...s.question, color: textPrimary }}><span style={s.qNum}>Q{qi + 1}</span> {q.question}</p>
              <div style={s.optionsGrid}>
                {q.options.map((opt, oi) => {
                  const letter = ["A","B","C","D"][oi]; const selected = quizAnswers[qi] === letter;
                  return (
                    <div key={oi} onClick={() => setQuizAnswers({ ...quizAnswers, [qi]: letter })} style={{ ...s.option, borderColor: selected ? "#4F46E5" : border, background: selected ? roleActiveBg : rowBg }}>
                      <span style={{ ...s.optLetter, background: selected ? "#4F46E5" : (d ? "#334155" : "#e0e7ff"), color: selected ? "white" : "#4F46E5" }}>{letter}</span>
                      <span style={{ ...s.optText, color: textPrimary }}>{opt.substring(3)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          <div style={{ ...s.quizProgress, color: textSub }}>{Object.keys(quizAnswers).length} / {quiz.length} answered</div>
          <button style={{ ...s.btn, opacity: Object.keys(quizAnswers).length < quiz.length ? 0.5 : 1 }} onClick={generateRoadmap} disabled={Object.keys(quizAnswers).length < quiz.length || loading}>
            {loading ? "⏳ Building your roadmap..." : "Generate My Roadmap 🚀"}
          </button>
        </div>
      </div>
    </div>
  );

  // ── ROADMAP
  if (page === "roadmap" && roadmap) return (
    <div style={{ ...s.page, background: bg }}>
      <style>{css}</style>
      <div style={s.centered}>
        <div style={{ ...s.card, maxWidth: 820, background: cardBg, borderColor: border }}>
          <div style={s.topRow}><button onClick={() => setPage("profile")} style={{ ...s.back, color: "#4F46E5" }}>← Start Over</button><DarkBtn /></div>
          <div style={s.roadmapHeader}>
            <div>
              <h2 style={{ ...s.cardTitle, color: textPrimary }}>📅 {form.name}'s 8-Week Plan</h2>
              <p style={{ ...s.cardSub, color: textSub }}>{form.role} · {form.branch} · Level: <strong style={{ color: "#6366f1", textTransform: "capitalize" }}>{roadmap.level}</strong>{form.company && <span> · 🎯 {form.company}</span>}</p>
            </div>
            <div style={s.overallWrap}>
              <svg viewBox="0 0 36 36" style={{ width: 64, height: 64 }}>
                <circle cx="18" cy="18" r="15.9" fill="none" stroke={border} strokeWidth="3" />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#6366f1" strokeWidth="3" strokeDasharray={`${overallPct} 100`} strokeLinecap="round" transform="rotate(-90 18 18)" />
              </svg>
              <span style={s.overallText}>{overallPct}%</span>
            </div>
          </div>
          {form.company && COMPANY_LINKS[form.company] && (
            <div style={{ background: d ? "#1e3a5f" : "#eef2ff", border: `1px solid ${d ? "#3b82f6" : "#c7d2fe"}`, borderRadius: 12, padding: "14px 18px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
              <span style={{ fontSize: 13, color: d ? "#93c5fd" : "#4338ca", fontWeight: 500 }}>🎯 Prep specifically for <strong>{form.company}</strong> placement</span>
              <a href={COMPANY_LINKS[form.company]} target="_blank" rel="noreferrer" style={{ background: "#4F46E5", color: "white", padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: "none" }}>Practice {form.company} Mock Test →</a>
            </div>
          )}
          <div style={{ background: d ? "#1e293b" : "#f8f7ff", border: `1px solid ${border}`, borderRadius: 12, padding: "16px 20px", marginBottom: 16 }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: textPrimary, marginBottom: 10, fontSize: 15 }}>🌳 Skills You'll Cover</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {uniqueSkills.map((skill, i) => <span key={i} style={{ background: d ? "#334155" : "#eef2ff", color: d ? "#a5b4fc" : "#4F46E5", padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{skill}</span>)}
            </div>
          </div>
          <div style={{ background: d ? "#1c1917" : "#fefce8", border: `1px solid ${d ? "#44403c" : "#fde68a"}`, borderRadius: 12, padding: "16px 20px", marginBottom: 16 }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: textPrimary, marginBottom: 10, fontSize: 15 }}>📐 Aptitude Practice</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {APTITUDE_LINKS.map((link, i) => (
                <a key={i} href={link.url} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: d ? "#292524" : "white", borderRadius: 8, textDecoration: "none", border: `1px solid ${border}`, fontSize: 13, color: textPrimary, fontWeight: 500 }}>
                  <span>{link.icon}</span><span>{link.title}</span>
                </a>
              ))}
            </div>
          </div>
          {roadmap.weeks?.map((w, i) => {
            const saved = JSON.parse(localStorage.getItem(`week_${i}`) || "[]");
            const p = Math.round((saved.length / w.tasks.length) * 100);
            return (
              <div key={i} onClick={() => handleWeekSelect(i)} style={{ ...s.weekRow, background: rowBg, borderColor: border }} className="week-hover">
                <div style={s.weekLeft}>
                  <span style={s.weekBadge}>Week {w.week}</span>
                  <div>
                    <div style={{ ...s.weekTheme, color: textPrimary }}>{w.theme}</div>
                    <div style={{ ...s.miniBar, background: border }}><div style={{ ...s.miniBarFill, width: `${p}%` }} /></div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontWeight: 700, fontSize: 14, color: p === 100 ? "#16a34a" : "#6366f1" }}>{p === 100 ? "✅" : `${p}%`}</span>
                  <span style={{ color: "#94a3b8", fontSize: 20 }}>›</span>
                </div>
              </div>
            );
          })}
          {overallPct === 100 && (
            <div style={{ background: "linear-gradient(135deg,#4F46E5,#7c3aed)", borderRadius: 16, padding: "28px 24px", marginTop: 16, marginBottom: 16, textAlign: "center", color: "white" }}>
              <div style={{ fontSize: 48, marginBottom: 8 }}>🎓</div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 800, marginBottom: 6 }}>Roadmap Complete!</div>
              <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 16 }}>{form.name} has completed the {form.role} 8-Week Plan</div>
              <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 10, padding: "12px 20px", fontSize: 13, marginBottom: 16 }}>🏆 {form.branch} · {form.role} · {new Date().toLocaleDateString()}</div>
              <button style={{ background: "white", color: "#4F46E5", border: "none", borderRadius: 10, padding: "10px 24px", fontWeight: 700, cursor: "pointer", fontSize: 14 }} onClick={() => window.print()}>🖨️ Save Certificate</button>
            </div>
          )}
          {overallPct === 100 && WHAT_NEXT[form.role] && (
            <div style={{ background: d ? "#1e293b" : "#f0fdf4", border: `1.5px solid ${d ? "#334155" : "#86efac"}`, borderRadius: 12, padding: "20px", marginBottom: 16 }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: textPrimary, marginBottom: 12, fontSize: 16 }}>🚀 What's Next After 8 Weeks?</div>
              {WHAT_NEXT[form.role].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, fontSize: 14, color: textPrimary }}>
                  <span style={{ color: "#16a34a", fontWeight: 700 }}>{i + 1}.</span><span>{item}</span>
                </div>
              ))}
            </div>
          )}
          <button style={{ ...s.btn, marginTop: 16, background: "#7c3aed" }} onClick={() => exportPDF(roadmap, form)}>📥 Download Roadmap as PDF</button>
          <button style={{ ...s.btn, marginTop: 12, background: "#0f172a" }} onClick={() => setPage("linkedin")}>✍️ Generate LinkedIn Bio →</button>
          <button style={{ ...s.btn, marginTop: 12, background: "#059669" }} onClick={() => setPage("resume")}>📄 Generate Resume Tips →</button>
        </div>
      </div>
    </div>
  );

  // ── WEEK
  if (page === "week" && week) return (
    <div style={{ ...s.page, background: bg }}>
      <style>{css}</style>
      <div style={s.centered}>
        <div style={{ ...s.card, maxWidth: 720, background: cardBg, borderColor: border }}>
          <div style={s.topRow}><button onClick={() => setPage("roadmap")} style={{ ...s.back, color: "#4F46E5" }}>← Back to Roadmap</button><DarkBtn /></div>
          <span style={s.weekBadge}>Week {week.week}</span>
          <h2 style={{ ...s.cardTitle, marginTop: 10, color: textPrimary }}>{week.theme}</h2>
          <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "16px 0 24px" }}>
            <div style={{ flex: 1, height: 10, background: border, borderRadius: 10 }}>
              <div style={{ height: 10, background: "#4F46E5", borderRadius: 10, width: `${pct}%`, transition: "width 0.4s" }} />
            </div>
            <span style={{ fontWeight: 800, color: "#4F46E5", fontFamily: "'Syne',sans-serif" }}>{pct}%</span>
          </div>
          <h3 style={{ ...s.sectionHead, color: textPrimary }}>✅ Tasks</h3>
          {week.tasks.map((task, i) => (
            <div key={i} onClick={() => toggleTask(i)} style={{ ...s.taskRow, background: checked.includes(i) ? (d ? "#14532d" : "#f0fdf4") : rowBg, borderColor: checked.includes(i) ? "#86efac" : border }}>
              <span style={{ fontSize: 22 }}>{checked.includes(i) ? "✅" : "⬜"}</span>
              <span style={{ marginLeft: 14, textDecoration: checked.includes(i) ? "line-through" : "none", color: checked.includes(i) ? "#16a34a" : textPrimary }}>{task}</span>
            </div>
          ))}
          <h3 style={{ ...s.sectionHead, color: textPrimary }}>📚 Resources</h3>
          {week.resources.map((r, i) => (
            <a key={i} href={r.url} target="_blank" rel="noreferrer" style={{ ...s.resLink, background: d ? "#0f172a" : "#f8f7ff", borderColor: border }}>
              <span>🔗</span><span style={{ flex: 1, fontWeight: 500, fontSize: 14, color: textPrimary }}>{r.title}</span>
              <span style={s.resBadge}>{r.type}</span>
            </a>
          ))}
          <div style={{ ...s.milestone, background: d ? "#1c1917" : "#fefce8", borderColor: d ? "#78350f" : "#fde68a", color: d ? "#fde68a" : "#78350f" }}>
            🎯 <strong>Milestone:</strong> {week.milestone}
          </div>
          <h3 style={{ ...s.sectionHead, color: textPrimary, marginTop: 24 }}>📝 My Notes</h3>
          <textarea placeholder="Add your notes for this week..." value={notes[selectedWeek] || ""} onChange={e => saveNote(selectedWeek, e.target.value)}
            style={{ width: "100%", minHeight: 100, padding: "12px 14px", borderRadius: 10, border: `1.5px solid ${border}`, fontSize: 14, fontFamily: "'DM Sans',sans-serif", background: inputBg, color: textPrimary, outline: "none", resize: "vertical", boxSizing: "border-box" }} />
          <div style={{ fontSize: 12, color: textSub, marginTop: 6 }}>✅ Progress and notes auto-saved to your account</div>
        </div>
      </div>
    </div>
  );

  // ── LINKEDIN
  if (page === "linkedin") return (
    <div style={{ ...s.page, background: bg }}>
      <style>{css}</style>
      <div style={s.centered}>
        <div style={{ ...s.card, background: cardBg, borderColor: border }}>
          <div style={s.topRow}><button onClick={() => setPage("roadmap")} style={{ ...s.back, color: "#4F46E5" }}>← Back</button><DarkBtn /></div>
          <h2 style={{ ...s.cardTitle, color: textPrimary }}>💼 LinkedIn Bio Generator</h2>
          <p style={{ ...s.cardSub, color: textSub }}>Fill in your details and get a human-sounding LinkedIn About section</p>
          {[{ field: "skills", placeholder: "Python, Git, HTML/CSS" }, { field: "projects", placeholder: "Portfolio website, Calculator app" }, { field: "clubs", placeholder: "Coding club, IEEE, Drama" }].map(({ field, placeholder }) => (
            <div key={field}>
              <label style={{ ...s.label, color: textSub }}>{field.charAt(0).toUpperCase() + field.slice(1)} <span style={{ color: "#9ca3af", fontWeight: 400 }}>(comma separated)</span></label>
              <input style={{ ...s.input, background: inputBg, borderColor: border, color: textPrimary }} placeholder={placeholder} onChange={e => setLform({ ...lform, [field]: e.target.value.split(",").map(x => x.trim()) })} />
            </div>
          ))}
          <label style={{ ...s.label, color: textSub }}>Year</label>
          <select style={{ ...s.input, background: inputBg, borderColor: border, color: textPrimary }} value={lform.year} onChange={e => setLform({ ...lform, year: e.target.value })}>
            <option value="1st">1st Year</option><option value="2nd">2nd Year</option><option value="3rd">3rd Year</option><option value="4th">4th Year</option>
          </select>
          <button style={s.btn} onClick={generateBio} disabled={lloading}>{lloading ? "⏳ Writing your bio..." : "Generate Bio →"}</button>
          {bio && (
            <div style={{ ...s.bioBox, background: d ? "#0f172a" : "#f8f7ff", borderColor: border }}>
              <p style={{ whiteSpace: "pre-wrap", color: textPrimary, lineHeight: 1.7 }}>{bio}</p>
              <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
                <button style={{ ...s.btn, flex: 1, marginTop: 0, background: "#0f172a" }} onClick={() => { navigator.clipboard.writeText(bio); alert("Copied!"); }}>📋 Copy</button>
                <button style={{ ...s.btn, flex: 1, marginTop: 0, background: "#0077b5" }} onClick={() => window.open("https://www.linkedin.com/in/", "_blank")}>Open LinkedIn →</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // ── RESUME
  if (page === "resume") return (
    <div style={{ ...s.page, background: bg }}>
      <style>{css}</style>
      <div style={s.centered}>
        <div style={{ ...s.card, background: cardBg, borderColor: border }}>
          <div style={s.topRow}><button onClick={() => setPage("roadmap")} style={{ ...s.back, color: "#4F46E5" }}>← Back</button><DarkBtn /></div>
          <h2 style={{ ...s.cardTitle, color: textPrimary }}>📄 Resume Tips</h2>
          <p style={{ ...s.cardSub, color: textSub }}>Tailored resume bullets and tips for <strong>{form.role}</strong></p>
          <label style={{ ...s.label, color: textSub }}>Your Skills <span style={{ color: "#9ca3af", fontWeight: 400 }}>(comma separated)</span></label>
          <input style={{ ...s.input, background: inputBg, borderColor: border, color: textPrimary }} placeholder="Python, Git, SQL" onChange={e => setRform({ ...rform, skills: e.target.value.split(",").map(x => x.trim()) })} />
          <label style={{ ...s.label, color: textSub }}>Your Projects <span style={{ color: "#9ca3af", fontWeight: 400 }}>(comma separated)</span></label>
          <input style={{ ...s.input, background: inputBg, borderColor: border, color: textPrimary }} placeholder="Portfolio website, ML classifier" onChange={e => setRform({ ...rform, projects: e.target.value.split(",").map(x => x.trim()) })} />
          <button style={s.btn} onClick={generateResume} disabled={resumeLoading}>{resumeLoading ? "⏳ Generating..." : "Generate Resume Tips →"}</button>
          {resume && !resume.error && (
            <div style={{ marginTop: 28 }}>
              <div style={{ background: d ? "#14532d" : "#f0fdf4", border: "1.5px solid #86efac", borderRadius: 12, padding: "16px 20px", marginBottom: 16 }}>
                <div style={{ ...s.sectionHead, color: textPrimary }}>📝 Professional Summary</div>
                <p style={{ color: textPrimary, lineHeight: 1.7, fontSize: 14 }}>{resume.summary}</p>
              </div>
              <div style={{ background: d ? "#1e293b" : "#f8f7ff", border: `1px solid ${border}`, borderRadius: 12, padding: "16px 20px", marginBottom: 16 }}>
                <div style={{ ...s.sectionHead, color: textPrimary }}>🛠️ Skills to Highlight</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {resume.skills_section?.map((skill, i) => <span key={i} style={{ background: d ? "#334155" : "#eef2ff", color: d ? "#a5b4fc" : "#4F46E5", padding: "4px 14px", borderRadius: 20, fontSize: 13, fontWeight: 600 }}>{skill}</span>)}
                </div>
              </div>
              <div style={{ background: d ? "#1e293b" : "#f8f7ff", border: `1px solid ${border}`, borderRadius: 12, padding: "16px 20px", marginBottom: 16 }}>
                <div style={{ ...s.sectionHead, color: textPrimary }}>🚀 Project Bullet Points</div>
                {resume.project_bullets?.map((b, i) => <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, fontSize: 14, color: textPrimary, lineHeight: 1.6 }}><span style={{ color: "#4F46E5", fontWeight: 700, flexShrink: 0 }}>•</span><span>{b}</span></div>)}
              </div>
              <div style={{ background: d ? "#1c1917" : "#fefce8", border: `1.5px solid ${d ? "#78350f" : "#fde68a"}`, borderRadius: 12, padding: "16px 20px" }}>
                <div style={{ ...s.sectionHead, color: textPrimary }}>💡 Resume Tips</div>
                {resume.tips?.map((t, i) => <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, fontSize: 14, color: d ? "#fde68a" : "#78350f", lineHeight: 1.6 }}><span style={{ fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span><span>{t}</span></div>)}
              </div>
              <button style={{ ...s.btn, background: "#0f172a", marginTop: 16 }} onClick={() => { navigator.clipboard.writeText(`SUMMARY\n${resume.summary}\n\nSKILLS\n${resume.skills_section?.join(", ")}\n\nPROJECT BULLETS\n${resume.project_bullets?.join("\n")}\n\nTIPS\n${resume.tips?.join("\n")}`); alert("Copied!"); }}>📋 Copy All to Clipboard</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" },
  nav: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 40px", borderBottom: "1px solid" },
  logo: { fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22 },
  navBtn: { background: "#4F46E5", color: "white", border: "none", borderRadius: 8, padding: "10px 20px", cursor: "pointer", fontWeight: 600, fontSize: 14 },
  darkBtn: { border: "none", borderRadius: 8, padding: "8px 14px", cursor: "pointer", fontWeight: 600, fontSize: 13 },
  hero: { display: "flex", justifyContent: "center", padding: "80px 24px" },
  heroInner: { maxWidth: 900, width: "100%", textAlign: "center" },
  badge: { display: "inline-block", background: "#eef2ff", color: "#4F46E5", padding: "6px 16px", borderRadius: 20, fontSize: 13, fontWeight: 600, marginBottom: 24 },
  heroTitle: { fontFamily: "'Syne', sans-serif", fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 800, lineHeight: 1.1, marginBottom: 20 },
  accent: { color: "#4F46E5" },
  heroSub: { fontSize: 18, maxWidth: 560, margin: "0 auto 48px", lineHeight: 1.7 },
  featureRow: { display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 48 },
  featureCard: { borderRadius: 16, padding: "24px 20px", width: 180, textAlign: "center", boxShadow: "0 2px 12px rgba(79,70,229,0.08)", border: "1px solid" },
  featureIcon: { fontSize: 32, marginBottom: 10 },
  featureTitle: { fontFamily: "'Syne', sans-serif", fontWeight: 700, marginBottom: 6, fontSize: 15 },
  featureDesc: { fontSize: 13, lineHeight: 1.5 },
  heroBtn: { background: "#4F46E5", color: "white", border: "none", borderRadius: 12, padding: "16px 40px", fontSize: 17, fontWeight: 700, cursor: "pointer", fontFamily: "'Syne', sans-serif" },
  centered: { display: "flex", justifyContent: "center", padding: "40px 16px" },
  card: { borderRadius: 20, padding: "40px 36px", width: "100%", maxWidth: 580, boxShadow: "0 4px 32px rgba(79,70,229,0.10)", border: "1px solid" },
  cardTitle: { fontFamily: "'Syne', sans-serif", fontSize: 26, fontWeight: 800, marginBottom: 6 },
  cardSub: { marginBottom: 28, fontSize: 15 },
  topRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  back: { background: "none", border: "none", cursor: "pointer", fontWeight: 600, padding: 0, fontSize: 14 },
  label: { display: "block", fontWeight: 600, marginBottom: 8, marginTop: 20, fontSize: 14 },
  input: { width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid", fontSize: 15, outline: "none", boxSizing: "border-box", fontFamily: "'DM Sans', sans-serif" },
  btn: { width: "100%", padding: "14px", background: "#4F46E5", color: "white", border: "none", borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: "pointer", marginTop: 28, fontFamily: "'Syne', sans-serif" },
  roleGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 8 },
  roleCard: { display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderRadius: 12, border: "1.5px solid", cursor: "pointer", outline: "none" },
  roleIcon: { fontSize: 22 },
  roleName: { fontWeight: 600, fontSize: 13 },
  skillGrid: { display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 },
  chip: { padding: "7px 16px", borderRadius: 20, cursor: "pointer", fontSize: 13, fontWeight: 500, userSelect: "none" },
  questionBlock: { marginBottom: 28, paddingBottom: 24, borderBottom: "1px solid" },
  question: { fontWeight: 600, marginBottom: 14, fontSize: 15, lineHeight: 1.5 },
  qNum: { display: "inline-block", background: "#4F46E5", color: "white", borderRadius: 6, padding: "2px 8px", fontSize: 12, fontWeight: 700, marginRight: 8 },
  optionsGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 },
  option: { display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 10, border: "1.5px solid", cursor: "pointer" },
  optLetter: { width: 24, height: 24, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 },
  optText: { fontSize: 13 },
  quizProgress: { textAlign: "center", fontSize: 14, marginTop: 8, marginBottom: 4 },
  roadmapHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 16 },
  overallWrap: { position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center" },
  overallText: { position: "absolute", fontSize: 13, fontWeight: 800, color: "#4F46E5", fontFamily: "'Syne', sans-serif" },
  weekRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", border: "1.5px solid", borderRadius: 14, marginBottom: 10, cursor: "pointer", transition: "all 0.15s" },
  weekLeft: { display: "flex", alignItems: "center", gap: 14 },
  weekBadge: { background: "#eef2ff", color: "#4F46E5", padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" },
  weekTheme: { fontWeight: 700, fontSize: 15, marginBottom: 6, fontFamily: "'Syne', sans-serif" },
  miniBar: { height: 4, width: 200, borderRadius: 4 },
  miniBarFill: { height: 4, background: "#4F46E5", borderRadius: 4, transition: "width 0.3s" },
  sectionHead: { fontFamily: "'Syne', sans-serif", fontWeight: 700, marginTop: 0, marginBottom: 12, fontSize: 16 },
  taskRow: { display: "flex", alignItems: "center", padding: "14px 16px", borderRadius: 12, marginBottom: 8, cursor: "pointer", border: "1.5px solid", transition: "all 0.15s" },
  resLink: { display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderRadius: 12, marginBottom: 8, textDecoration: "none", border: "1px solid" },
  resBadge: { background: "#4F46E5", color: "white", padding: "2px 10px", borderRadius: 10, fontSize: 11, fontWeight: 600 },
  milestone: { borderRadius: 12, padding: "16px 20px", marginTop: 20, fontSize: 14, lineHeight: 1.6, border: "1.5px solid" },
  bioBox: { borderRadius: 14, padding: 24, marginTop: 24, border: "1px solid" },
};

const css = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  .pulse-btn { animation: pulse 2s infinite; }
  @keyframes pulse { 0%,100% { box-shadow: 0 0 0 0 rgba(79,70,229,0.4); } 50% { box-shadow: 0 0 0 12px rgba(79,70,229,0); } }
  .week-hover:hover { opacity: 0.85; transform: translateX(4px); }
  select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236366f1' d='M6 8L1 3h10z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 14px center; padding-right: 36px !important; }
`;