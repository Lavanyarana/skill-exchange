import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const API = "https://skillchat.duckdns.org";
const socket = io(API);

const CATEGORIES = ["All","Programming","Design","Language","Music","Math","Science","Business"];

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
  "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80",
];

const SKILL_IMAGES = {
  Programming: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&q=80",
  Design: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&q=80",
  Language: "https://images.unsplash.com/photo-1543165796-5426273eaab3?w=400&q=80",
  Music: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&q=80",
  Math: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&q=80",
  Science: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=400&q=80",
  Business: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
  default: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&q=80",
};

const catMap = {
  Programming:["python","java","javascript","react","node","html","css","c++","typescript","sql"],
  Design:["design","figma","ui","ux","photoshop","illustrator","canva","branding","graphic"],
  Language:["english","hindi","french","spanish","german","chinese","japanese","language"],
  Music:["guitar","piano","violin","drums","singing","music","bass","flute"],
  Math:["math","calculus","algebra","statistics","geometry"],
  Science:["physics","chemistry","biology","ml","ai","machine learning","science"],
  Business:["marketing","finance","accounting","excel","management","sales","business"],
};

const COLORS = ["c-p","c-b","c-t","c-r","c-a"];
const getColor = s => COLORS[(s?.charCodeAt(0)||0) % COLORS.length];
const getCatImage = skills => {
  for(const [cat, keys] of Object.entries(catMap)){
    if(skills.some(s => keys.some(k => s.toLowerCase().includes(k)))) return SKILL_IMAGES[cat];
  }
  return SKILL_IMAGES.default;
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  *,*::before,*::after{
    box-sizing:border-box;
    margin:0;
    padding:0;
  }

  body{
    background:#F5F7FB;
  }

  .d-root{
    min-height:100vh;
    background:#F5F7FB;
    font-family:'DM Sans',sans-serif;
    color:#111827;
    overflow-x:hidden;
  }

  .nav{
    position:sticky;
    top:0;
    z-index:200;
    background:rgba(255,255,255,0.95);
    backdrop-filter:blur(20px);
    border-bottom:1px solid #E5E7EB;
    height:66px;
    padding:0 32px;
    display:flex;
    align-items:center;
    gap:16px;
  }

  .nav-logo-text{
    font-family:'Syne',sans-serif;
    font-weight:700;
    font-size:18px;
    color:#111827;
  }

  .nav-search{
    width:100%;
    padding:9px 14px 9px 40px;
    background:#ffffff;
    border:1px solid #D1D5DB;
    border-radius:10px;
    color:#111827;
    font-size:14px;
    outline:none;
  }

  .nav-search::placeholder{
    color:#9CA3AF;
  }

  .nav-btn{
    padding:7px 16px;
    border-radius:8px;
    font-size:13px;
    font-weight:500;
    cursor:pointer;
    border:1px solid #D1D5DB;
    background:#fff;
    color:#374151;
    font-family:'DM Sans',sans-serif;
  }

  .nav-btn:hover{
    background:#F3F4F6;
  }

  .hero-banner{
    position:relative;
    overflow:hidden;
    background:#EEF2FF;
    border-bottom:1px solid #E5E7EB;
  }

  .hero-overlay{
    position:absolute;
    inset:0;
    background:linear-gradient(
      135deg,
      rgba(255,255,255,0.75),
      rgba(255,255,255,0.5)
    );
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    text-align:center;
    padding:24px;
  }

  .hero-title{
    font-family:'Syne',sans-serif;
    font-size:42px;
    font-weight:800;
    color:#111827;
    letter-spacing:-2px;
    line-height:1.1;
    margin-bottom:12px;
  }

  .hero-sub{
    color:#4B5563;
    font-size:15px;
    line-height:1.7;
    max-width:480px;
  }

  .stats{
    display:grid;
    grid-template-columns:repeat(3,1fr);
    gap:16px;
    max-width:1280px;
    margin:32px auto 0;
    padding:0 40px;
  }

  .stat{
    background:#ffffff;
    border:1px solid #E5E7EB;
    border-radius:16px;
    padding:22px 24px;
  }

  .stat-label{
    font-size:11px;
    font-weight:600;
    color:#6B7280;
    text-transform:uppercase;
    letter-spacing:1px;
    margin-bottom:10px;
  }

  .stat-val{
    font-family:'Syne',sans-serif;
    font-size:36px;
    font-weight:800;
    color:#111827;
  }

  .section{
    max-width:1280px;
    margin:40px auto 0;
    padding:0 40px;
  }

  .section-title{
    font-family:'Syne',sans-serif;
    font-size:22px;
    font-weight:700;
    color:#111827;
  }

  .section-sub{
    font-size:13px;
    color:#6B7280;
    margin-top:3px;
  }

  .skills-box,
  .m-card,
  .i-card,
  .empty,
  .d-box{
    background:#ffffff;
    border:1px solid #E5E7EB;
    border-radius:18px;
  }

  .skills-box{
    padding:28px;
  }

  .inputs-row{
    display:grid;
    grid-template-columns:1fr 1fr;
    gap:14px;
    margin-bottom:20px;
  }

  .f-label{
    font-size:10px;
    font-weight:700;
    color:#6B7280;
    text-transform:uppercase;
    letter-spacing:1px;
    display:block;
    margin-bottom:7px;
  }

  .s-inp{
    width:100%;
    padding:12px 16px;
    background:#fff;
    border:1px solid #D1D5DB;
    border-radius:10px;
    color:#111827;
    font-size:14px;
    outline:none;
  }

  .s-inp::placeholder{
    color:#9CA3AF;
  }

  .save-btn{
    padding:11px 26px;
    background:linear-gradient(135deg,#6C63FF,#8B5CF6);
    border:none;
    border-radius:10px;
    color:#fff;
    font-weight:600;
    cursor:pointer;
  }

  .filter-row{
    display:flex;
    gap:8px;
    flex-wrap:wrap;
    margin-bottom:22px;
  }

  .f-tab{
    padding:6px 16px;
    border-radius:99px;
    font-size:13px;
    cursor:pointer;
    border:1px solid #D1D5DB;
    background:#fff;
    color:#374151;
  }

  .f-tab.on{
    background:#6C63FF;
    color:#fff;
    border-color:#6C63FF;
  }

  .cards-grid,
  .inbox-grid{
    display:grid;
    grid-template-columns:repeat(auto-fill,minmax(290px,1fr));
    gap:16px;
  }

  .m-card-img{
    width:100%;
    height:120px;
    object-fit:cover;
  }

  .m-card-top{
    padding:16px 20px 0;
  }

  .m-av-row{
    display:flex;
    align-items:center;
    gap:12px;
    margin-bottom:14px;
  }

  .m-av{
    width:50px;
    height:50px;
    border-radius:14px;
    display:flex;
    align-items:center;
    justify-content:center;
    color:#fff;
    font-family:'Syne',sans-serif;
    font-weight:800;
    font-size:20px;
  }

  .m-name,
  .i-name,
  .e-title{
    color:#111827;
  }

  .m-email,
  .i-email,
  .e-sub{
    color:#6B7280;
  }

  .m-div{
    height:1px;
    background:#E5E7EB;
    margin:14px 20px;
  }

  .m-skills{
    padding:0 20px;
  }

  .m-sk-label{
    font-size:10px;
    font-weight:700;
    color:#6B7280;
    text-transform:uppercase;
    letter-spacing:0.9px;
    margin-bottom:7px;
  }

  .tags{
    display:flex;
    flex-wrap:wrap;
    gap:6px;
    margin-bottom:12px;
  }

  .tag{
    font-size:12px;
    font-weight:500;
    padding:4px 11px;
    border-radius:99px;
  }

  .tg-teach{
    background:#EEF2FF;
    color:#6C63FF;
  }

  .tg-learn{
    background:#DBEAFE;
    color:#2563EB;
  }

  .m-btn{
    display:block;
    width:100%;
    padding:12px;
    background:linear-gradient(135deg,#6C63FF,#8B5CF6);
    border:none;
    color:#fff;
    font-weight:600;
    cursor:pointer;
  }

  .i-card{
    padding:20px;
  }

  .modal{
    background:#ffffff;
    border-radius:20px;
    padding:36px 32px;
    width:100%;
    max-width:420px;
  }

  .modal-title{
    color:#111827;
  }

  .modal-sub{
    color:#6B7280;
  }
`;

function AiChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi! I'm your SkillXchange AI assistant powered by Llama 3. Ask me anything about finding skill partners, learning tips, or how to use the platform! 🚀" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(p => [...p, { role: "user", text: userMsg }]);
    setLoading(true);
    try {
      const history = messages.slice(-6).map(m => ({ role: m.role === "user" ? "user" : "assistant", content: m.text }));
      const res = await axios.post(`${API}/api/ai/chat`, { message: userMsg, history });
      setMessages(p => [...p, { role: "bot", text: res.data.reply }]);
    } catch {
      setMessages(p => [...p, { role: "bot", text: "Sorry, I couldn't connect right now. Make sure your backend is running!" }]);
    }
    setLoading(false);
  };

  return (
    <>
      {open && (
        <div className="ai-panel">
          <div className="ai-head">
            <div className="ai-head-icon">🤖</div>
            <div>
              <div className="ai-head-title">SkillXchange AI</div>
              <div className="ai-head-sub">● Powered by Llama 3 (Meta)</div>
            </div>
          </div>
          <div className="ai-messages">
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "ai-msg-user" : "ai-msg-bot"}>{m.text}</div>
            ))}
            {loading && <div className="ai-msg-typing">⋯ thinking</div>}
            <div ref={bottomRef}/>
          </div>
          <div className="ai-input-row">
            <input className="ai-input" placeholder="Ask about skills, partners..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}/>
            <button className="ai-send" onClick={send} disabled={loading}>Send</button>
          </div>
        </div>
      )}
      <button className="ai-fab" onClick={() => setOpen(o => !o)}>{open ? "✕" : "🤖"}</button>
    </>
  );
}

function Dashboard() {
  const [skillsOffered, setSkillsOffered] = useState("");
  const [skillsWanted, setSkillsWanted] = useState("");
  const [matches, setMatches] = useState([]);
  const [requests, setRequests] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCat, setActiveCat] = useState("All");
  const [showDel, setShowDel] = useState(false);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) return;
    socket.emit("join", userId);
    const h = () => setUnreadCount(p => p + 1);
    socket.on("newNotification", h);
    return () => socket.off("newNotification", h);
  }, [userId]);

  const fetchMatches = useCallback(async () => {
    try { const r = await axios.get(`${API}/api/users/match/${userId}`); setMatches(r.data); } catch {}
  }, [userId]);
  const fetchRequests = useCallback(async () => {
    try { const r = await axios.get(`${API}/api/requests/received/${userId}`); setRequests(r.data); } catch {}
  }, [userId]);
  const fetchUnread = useCallback(async () => {
    try { const r = await axios.get(`${API}/api/messages/unread/${userId}`); setUnreadCount(r.data.count); } catch {}
  }, [userId]);

  useEffect(() => { if (!userId) return; fetchMatches(); fetchRequests(); fetchUnread(); }, [userId, fetchMatches, fetchRequests, fetchUnread]);
  useEffect(() => { const iv = setInterval(fetchUnread, 5000); return () => clearInterval(iv); }, [fetchUnread]);

  const handleSave = async () => {
    try {
      const o = skillsOffered.split(",").map(s => s.trim()).filter(Boolean);
      const w = skillsWanted.split(",").map(s => s.trim()).filter(Boolean);
      await axios.put(`${API}/api/users/update-skills/${userId}`, { skillsOffered: o, skillsWanted: w });
      setSuccessMsg("Skills updated!"); setErrorMsg(""); fetchMatches();
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch { setErrorMsg("Error updating skills"); }
  };

  const sendReq = async (rid, skill) => {
    try { await axios.post(`${API}/api/requests/send`, { sender: userId, receiver: rid, skill }); alert("Request sent!"); }
    catch { alert("Error sending request"); }
  };

  const updateReq = async (id, status) => {
    try { await axios.put(`${API}/api/requests/update/${id}`, { status }); fetchRequests(); }
    catch { alert("Error updating request"); }
  };

  const deleteAccount = async () => {
    try { await axios.delete(`${API}/api/users/${userId}`); localStorage.clear(); window.location.href = "/"; }
    catch { alert("Error deleting account."); }
    setShowDel(false);
  };

  const stClass = s => s === "accepted" ? "st-a" : s === "rejected" ? "st-r" : "st-p";

  const filtered = matches.filter(u => {
    const q = searchQuery.toLowerCase();
    const ms = !q || u.name.toLowerCase().includes(q) || u.skillsOffered.some(s => s.toLowerCase().includes(q)) || u.skillsWanted.some(s => s.toLowerCase().includes(q));
    const mc = activeCat === "All" || (catMap[activeCat] || []).some(k => [...u.skillsOffered, ...u.skillsWanted].some(s => s.toLowerCase().includes(k)));
    return ms && mc;
  });

  return (
    <div className="d-root">
      <style>{styles}</style>

      <nav className="nav">
        <div className="nav-logo"><div className="nav-logo-icon">S</div><span className="nav-logo-text">SkillXchange</span></div>
        <div className="nav-search-wrap">
          <span className="nav-search-ico">🔍</span>
          <input className="nav-search" placeholder="Search people or skills..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}/>
        </div>
        <div className="nav-right">
          <button className="nav-btn" onClick={() => window.location.href = "/profile"}>Profile</button>
          <button className="nav-btn nav-btn-chat" onClick={() => window.location.href = "/chat"}>
            Chat {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
          </button>
          <button className="nav-btn nav-btn-out" onClick={() => { localStorage.clear(); window.location.href = "/"; }}>Logout</button>
        </div>
      </nav>

      <div className="hero-banner">
        <div className="hero-img-strip">
          <div className="hero-img-side"><img src={HERO_IMAGES[0]} alt=""/></div>
          <div className="hero-img-center">
            <img src={HERO_IMAGES[2]} alt=""/>
            <div className="hero-overlay">
              <div className="hero-tag"><span className="hero-dot"/>Live Platform</div>
              <h1 className="hero-title">Learn anything.<br/><span>Teach everything.</span></h1>
              <p className="hero-sub">Connect with people who have the skills you want — share the skills you have.</p>
            </div>
          </div>
          <div className="hero-img-side"><img src={HERO_IMAGES[1]} alt=""/></div>
        </div>
      </div>

      <div className="stats">
        <div className="stat"><div className="stat-label">Skill Matches</div><div className="stat-val">{matches.length}</div><div className="hint-g">↑ People to connect with</div></div>
        <div className="stat"><div className="stat-label">Pending Requests</div><div className="stat-val">{requests.filter(r => r.status === "pending").length}</div><div className="hint-y">Awaiting your response</div></div>
        <div className="stat"><div className="stat-label">Unread Messages</div><div className="stat-val">{unreadCount}</div><div className="hint-b">New conversations</div></div>
      </div>

      <div className="section">
        <div className="section-head"><div><div className="section-title">Your Skills</div><div className="section-sub">Add what you teach and what you want to learn</div></div></div>
        <div className="skills-box">
          {successMsg && <div className="alert-ok">{successMsg}</div>}
          {errorMsg && <div className="alert-err">{errorMsg}</div>}
          <div className="inputs-row">
            <div><label className="f-label">I can teach</label><input className="s-inp" placeholder="e.g. Python, React, Design" value={skillsOffered} onChange={e => setSkillsOffered(e.target.value)}/></div>
            <div><label className="f-label">I want to learn</label><input className="s-inp" placeholder="e.g. Guitar, French, ML" value={skillsWanted} onChange={e => setSkillsWanted(e.target.value)}/></div>
          </div>
          <button className="save-btn" onClick={handleSave}>Save Skills →</button>
        </div>
      </div>

      <div className="section" style={{marginTop:40}}>
        <div className="section-head">
          <div><div className="section-title">Skill Matches</div><div className="section-sub">{searchQuery ? `Results for "${searchQuery}"` : "People who match your learning goals"}</div></div>
          <div className="found-count">{filtered.length} found</div>
        </div>
        <div className="filter-row">
          {CATEGORIES.map(c => <button key={c} className={`f-tab ${activeCat === c ? "on" : ""}`} onClick={() => setActiveCat(c)}>{c}</button>)}
        </div>
        {filtered.length === 0 ? (
          <div className="empty"><div className="e-icon">🔍</div><div className="e-title">{searchQuery ? "No results found" : "No matches yet"}</div><div className="e-sub">{searchQuery ? "Try different keywords" : "Add your skills and save — matches appear instantly"}</div></div>
        ) : (
          <div className="cards-grid">
            {filtered.map(u => (
              <div key={u._id} className="m-card">
                <img className="m-card-img" src={getCatImage(u.skillsOffered)} alt="skill"/>
                <div className="m-card-top">
                  <div className="m-av-row">
                    <div className={`m-av ${getColor(u.name)}`}>{u.name[0]}</div>
                    <div><div className="m-name">{u.name}</div><div className="m-email">{u.email}</div></div>
                  </div>
                </div>
                <div className="m-div"/>
                <div className="m-skills">
                  <div className="m-sk-label">Teaches</div>
                  <div className="tags">{u.skillsOffered.map(s => <span key={s} className="tag tg-teach">{s}</span>)}</div>
                  <div className="m-sk-label">Wants to learn</div>
                  <div className="tags">{u.skillsWanted.map(s => <span key={s} className="tag tg-learn">{s}</span>)}</div>
                </div>
                <button className="m-btn" onClick={() => sendReq(u._id, u.skillsOffered[0])}>Send Exchange Request →</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="section" style={{marginTop:48,paddingBottom:40}}>
        <div className="section-head"><div><div className="section-title">Inbox</div><div className="section-sub">Skill exchange requests from others</div></div></div>
        {requests.length === 0 ? (
          <div className="empty"><div className="e-icon">📩</div><div className="e-title">No requests yet</div><div className="e-sub">When someone sends you a request it appears here</div></div>
        ) : (
          <div className="inbox-grid">
            {requests.map(req => (
              <div key={req._id} className="i-card">
                <div className="i-name">{req.sender.name}</div>
                <div className="i-email">{req.sender.email}</div>
                <div className="i-skill">Wants to learn: <b>{req.skill}</b></div>
                <span className={`st-badge ${stClass(req.status)}`}>{req.status}</span>
                {req.status === "pending" && (
                  <div className="act-row">
                    <button className="btn-a" onClick={() => updateReq(req._id, "accepted")}>Accept</button>
                    <button className="btn-r" onClick={() => updateReq(req._id, "rejected")}>Decline</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="danger-zone">
        <div className="d-box">
          <div><div className="d-title">Delete Account</div><div className="d-sub">Permanently delete your account and all data. This cannot be undone.</div></div>
          <button className="d-btn" onClick={() => setShowDel(true)}>Delete Account</button>
        </div>
      </div>

      {showDel && (
        <div className="overlay" onClick={() => setShowDel(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-icon">⚠️</div>
            <div className="modal-title">Delete your account?</div>
            <div className="modal-sub">This will permanently delete your account, skills, messages, and all data. There is no way to recover it.</div>
            <div className="modal-btns">
              <button className="m-cancel" onClick={() => setShowDel(false)}>Cancel</button>
              <button className="m-del" onClick={deleteAccount}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      <AiChat/>
    </div>
  );
}

export default Dashboard;
