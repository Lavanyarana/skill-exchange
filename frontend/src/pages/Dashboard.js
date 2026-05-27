import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const API = "https://skillchat.duckdns.org";
const socket = io(API);
const CATS = ["All","Programming","Design","Music","Language","AI / ML","Data Science","Finance","Marketing","Other"];
const PAL = ["#2563eb","#7c3aed","#059669","#dc2626","#d97706","#0891b2","#be185d","#65a30d"];
const gc = (n) => PAL[n.charCodeAt(0) % PAL.length];

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
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) return;
    socket.emit("join", userId);
    const h = () => setUnreadCount(p => p + 1);
    socket.on("newNotification", h);
    return () => socket.off("newNotification", h);
  }, [userId]);

  const handleUpdateSkills = async () => {
    try {
      const o = skillsOffered.split(",").map(s => s.trim()).filter(Boolean);
      const w = skillsWanted.split(",").map(s => s.trim()).filter(Boolean);
      await axios.put(`${API}/api/users/update-skills/${userId}`, { skillsOffered: o, skillsWanted: w });
      setSuccessMsg("Skills updated!"); setErrorMsg(""); fetchMatches();
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch { setErrorMsg("Error updating skills"); setSuccessMsg(""); }
  };

  const fetchMatches = useCallback(async () => {
    try { const r = await axios.get(`${API}/api/users/match/${userId}`); setMatches(r.data); } catch {}
  }, [userId]);
  const fetchRequests = useCallback(async () => {
    try { const r = await axios.get(`${API}/api/requests/received/${userId}`); setRequests(r.data); } catch {}
  }, [userId]);
  const fetchUnread = useCallback(async () => {
    try { const r = await axios.get(`${API}/api/messages/unread/${userId}`); setUnreadCount(r.data.count); } catch {}
  }, [userId]);

  const sendRequest = async (rid, skill) => {
    try { await axios.post(`${API}/api/requests/send`, { sender: userId, receiver: rid, skill }); alert("Request sent!"); }
    catch { alert("Error"); }
  };
  const updateRequest = async (id, status) => {
    try { await axios.put(`${API}/api/requests/update/${id}`, { status }); fetchRequests(); } catch {}
  };

  useEffect(() => {
    if (!userId) return;
    fetchMatches(); fetchRequests(); fetchUnread();
  }, [userId, fetchMatches, fetchRequests, fetchUnread]);

  useEffect(() => { const i = setInterval(fetchUnread, 5000); return () => clearInterval(i); }, [fetchUnread]);

  const pending = requests.filter(r => r.status === "pending").length;
  const filtered = matches.filter(u => {
    const skills = [...u.skillsOffered, ...u.skillsWanted].map(s => s.toLowerCase());
    const q = searchQuery.toLowerCase();
    const catOk = activeCat === "All" || skills.some(s => s.includes(activeCat.toLowerCase().replace(" / ", " ")));
    return (q === "" || u.name.toLowerCase().includes(q) || skills.some(s => s.includes(q))) && catOk;
  });

  const S = {
    page: { minHeight: "100vh", background: "#f0f4ff", fontFamily: "'Segoe UI', system-ui, sans-serif" },
    nav: { background: "#fff", borderBottom: "2px solid #e2e8f0", padding: "0 40px", display: "flex", justifyContent: "space-between", alignItems: "center", height: 66, position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 16px rgba(37,99,235,0.1)", gap: 20 },
  };

  return (
    <div style={S.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        body { font-family: 'Inter', 'Segoe UI', sans-serif; }
        .hov-card { transition: all 0.25s ease; }
        .hov-card:hover { transform: translateY(-6px); box-shadow: 0 20px 48px rgba(37,99,235,0.18) !important; border-color: #93c5fd !important; }
        .hov-btn:hover { opacity: 0.88; transform: translateY(-1px); }
        .inp:focus { border-color: #2563eb !important; background: #fff !important; box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }
        .cat-btn { padding: 7px 16px; border-radius: 99px; font-size: 13px; font-weight: 600; cursor: pointer; border: 1.5px solid #e2e8f0; background: #fff; color: #475569; transition: all 0.15s; }
        .cat-btn:hover { border-color: #2563eb; color: #2563eb; }
        .cat-btn.active { background: linear-gradient(135deg,#2563eb,#7c3aed); color: #fff; border-color: transparent; box-shadow: 0 3px 10px rgba(37,99,235,0.35); }
        .pulse { animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100% { box-shadow: 0 0 0 0 rgba(74,222,128,0.4); } 50% { box-shadow: 0 0 0 6px rgba(74,222,128,0); } }
      `}</style>

      {/* ═══════════════ NAVBAR ═══════════════ */}
      <nav style={S.nav}>
        <div style={{ display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
          <div style={{ width:40, height:40, borderRadius:12, background:"linear-gradient(135deg,#2563eb,#7c3aed)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:900, fontSize:22, boxShadow:"0 4px 12px rgba(37,99,235,0.4)" }}>S</div>
          <span style={{ fontWeight:900, fontSize:22, color:"#1e293b", letterSpacing:-0.5 }}>Skill<span style={{ color:"#2563eb" }}>Xchange</span></span>
        </div>
        <div style={{ flex:1, maxWidth:480, position:"relative" }}>
          <span style={{ position:"absolute", left:16, top:"50%", transform:"translateY(-50%)", fontSize:16, color:"#94a3b8" }}>🔍</span>
          <input className="inp" placeholder="Search people or skills..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            style={{ width:"100%", padding:"11px 16px 11px 44px", borderRadius:99, border:"1.5px solid #e2e8f0", fontSize:14, outline:"none", background:"#f8faff", color:"#1e293b", transition:"all 0.2s" }} />
        </div>
        <div style={{ display:"flex", gap:10, alignItems:"center", flexShrink:0 }}>
          <button className="hov-btn" onClick={() => window.location.href="/profile"} style={{ padding:"9px 20px", borderRadius:9, border:"1.5px solid #e2e8f0", background:"#fff", color:"#374151", fontWeight:600, fontSize:14, cursor:"pointer", transition:"all 0.15s" }}>Profile</button>
          <button className="hov-btn" onClick={() => window.location.href="/chat"} style={{ padding:"9px 20px", borderRadius:9, border:"none", background:"linear-gradient(135deg,#2563eb,#7c3aed)", color:"#fff", fontWeight:600, fontSize:14, cursor:"pointer", position:"relative", boxShadow:"0 4px 12px rgba(37,99,235,0.4)", transition:"all 0.15s" }}>
            💬 Chat {unreadCount > 0 && <span style={{ position:"absolute", top:-7, right:-7, background:"#ef4444", color:"#fff", fontSize:10, fontWeight:700, borderRadius:99, padding:"2px 7px", minWidth:18, textAlign:"center" }}>{unreadCount}</span>}
          </button>
          <button className="hov-btn" onClick={() => { localStorage.clear(); window.location.href="/"; }} style={{ padding:"9px 20px", borderRadius:9, border:"1.5px solid #fca5a5", background:"#fff", color:"#ef4444", fontWeight:600, fontSize:14, cursor:"pointer", transition:"all 0.15s" }}>Logout</button>
        </div>
      </nav>

      {/* ═══════════════ HERO ═══════════════ */}
      <div style={{ background:"linear-gradient(135deg,#0f172a 0%,#1e3a8a 40%,#2563eb 70%,#7c3aed 100%)", padding:"56px 48px 60px", position:"relative", overflow:"hidden" }}>
        {/* Decorative blobs */}
        <div style={{ position:"absolute", top:-100, right:-80, width:400, height:400, borderRadius:"50%", background:"rgba(124,58,237,0.15)", filter:"blur(60px)" }}></div>
        <div style={{ position:"absolute", bottom:-60, left:200, width:300, height:300, borderRadius:"50%", background:"rgba(37,99,235,0.2)", filter:"blur(40px)" }}></div>
        <div style={{ position:"absolute", top:40, left:-60, width:200, height:200, borderRadius:"50%", background:"rgba(255,255,255,0.04)", filter:"blur(20px)" }}></div>

        <div style={{ maxWidth:1100, margin:"0 auto", display:"flex", alignItems:"center", gap:60, position:"relative", zIndex:1 }}>
          {/* LEFT TEXT */}
          <div style={{ flex:1 }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(255,255,255,0.12)", border:"1px solid rgba(255,255,255,0.25)", borderRadius:99, padding:"6px 16px", marginBottom:24, backdropFilter:"blur(8px)" }}>
              <span className="pulse" style={{ width:8, height:8, borderRadius:99, background:"#4ade80", display:"inline-block" }}></span>
              <span style={{ fontSize:13, color:"#fff", fontWeight:600, letterSpacing:0.3 }}>Live Platform · Real-time Matching</span>
            </div>
            <h1 style={{ fontSize:48, fontWeight:900, color:"#fff", margin:"0 0 16px", letterSpacing:-1.5, lineHeight:1.08 }}>
              Welcome back 👋<br />
              <span style={{ background:"linear-gradient(90deg,#93c5fd,#c4b5fd)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Exchange Skills,</span>
              <span style={{ color:"#fff" }}> Grow</span>
            </h1>
            <p style={{ fontSize:17, color:"rgba(255,255,255,0.72)", lineHeight:1.7, margin:"0 0 36px", maxWidth:500 }}>
              Connect with people who want to learn what you know — and teach what you want to learn. Real skills, real people, real growth.
            </p>
            {/* Stat pills */}
            <div style={{ display:"flex", gap:16, flexWrap:"wrap" }}>
              {[["🤝", matches.length, "Skill Matches"],["📩", pending, "Pending Requests"],["💬", unreadCount, "Unread Chats"]].map(([icon,num,label]) => (
                <div key={label} style={{ background:"rgba(255,255,255,0.12)", border:"1px solid rgba(255,255,255,0.2)", borderRadius:14, padding:"14px 22px", backdropFilter:"blur(8px)", textAlign:"center" }}>
                  <div style={{ fontSize:26, fontWeight:900, color:"#fff" }}>{icon} {num}</div>
                  <div style={{ fontSize:12, color:"rgba(255,255,255,0.6)", fontWeight:500, marginTop:2 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SVG ILLUSTRATION */}
          <div style={{ width:420, flexShrink:0 }}>
            <svg viewBox="0 0 420 340" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width:"100%", filter:"drop-shadow(0 20px 40px rgba(0,0,0,0.3))" }}>
              {/* Central hub */}
              <circle cx="210" cy="170" r="62" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5"/>
              <circle cx="210" cy="170" r="44" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
              <circle cx="210" cy="170" r="28" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
              <text x="210" y="178" textAnchor="middle" fontSize="24">🔄</text>

              {/* Person cards - 4 corners */}
              {/* Top Left - Developer */}
              <rect x="10" y="20" width="110" height="72" rx="14" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5"/>
              <circle cx="35" cy="48" r="16" fill="rgba(37,99,235,0.6)" stroke="rgba(147,197,253,0.6)" strokeWidth="1.5"/>
              <text x="35" y="54" textAnchor="middle" fontSize="16">👩‍💻</text>
              <rect x="58" y="38" width="54" height="7" rx="3.5" fill="rgba(255,255,255,0.5)"/>
              <rect x="58" y="50" width="40" height="6" rx="3" fill="rgba(255,255,255,0.25)"/>
              <rect x="12" y="72" width="106" height="16" rx="8" fill="rgba(37,99,235,0.5)"/>
              <text x="65" y="84" textAnchor="middle" fontSize="9" fill="white" fontWeight="700">Python · React · Node</text>

              {/* Top Right - Designer */}
              <rect x="300" y="20" width="110" height="72" rx="14" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5"/>
              <circle cx="325" cy="48" r="16" fill="rgba(124,58,237,0.6)" stroke="rgba(196,181,253,0.6)" strokeWidth="1.5"/>
              <text x="325" y="54" textAnchor="middle" fontSize="16">👨‍🎨</text>
              <rect x="348" y="38" width="54" height="7" rx="3.5" fill="rgba(255,255,255,0.5)"/>
              <rect x="348" y="50" width="40" height="6" rx="3" fill="rgba(255,255,255,0.25)"/>
              <rect x="302" y="72" width="106" height="16" rx="8" fill="rgba(124,58,237,0.5)"/>
              <text x="355" y="84" textAnchor="middle" fontSize="9" fill="white" fontWeight="700">UI/UX · Figma · Design</text>

              {/* Bottom Left - Teacher */}
              <rect x="10" y="248" width="110" height="72" rx="14" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5"/>
              <circle cx="35" cy="276" r="16" fill="rgba(5,150,105,0.6)" stroke="rgba(52,211,153,0.6)" strokeWidth="1.5"/>
              <text x="35" y="282" textAnchor="middle" fontSize="16">👨‍🏫</text>
              <rect x="58" y="266" width="54" height="7" rx="3.5" fill="rgba(255,255,255,0.5)"/>
              <rect x="58" y="278" width="40" height="6" rx="3" fill="rgba(255,255,255,0.25)"/>
              <rect x="12" y="300" width="106" height="16" rx="8" fill="rgba(5,150,105,0.5)"/>
              <text x="65" y="312" textAnchor="middle" fontSize="9" fill="white" fontWeight="700">Guitar · Music · Piano</text>

              {/* Bottom Right - Data Scientist */}
              <rect x="300" y="248" width="110" height="72" rx="14" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5"/>
              <circle cx="325" cy="276" r="16" fill="rgba(217,119,6,0.6)" stroke="rgba(251,191,36,0.6)" strokeWidth="1.5"/>
              <text x="325" y="282" textAnchor="middle" fontSize="16">👩‍🔬</text>
              <rect x="348" y="266" width="54" height="7" rx="3.5" fill="rgba(255,255,255,0.5)"/>
              <rect x="348" y="278" width="40" height="6" rx="3" fill="rgba(255,255,255,0.25)"/>
              <rect x="302" y="300" width="106" height="16" rx="8" fill="rgba(217,119,6,0.5)"/>
              <text x="355" y="312" textAnchor="middle" fontSize="9" fill="white" fontWeight="700">ML · Data · AI</text>

              {/* Connection lines */}
              <line x1="120" y1="56" x2="152" y2="130" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeDasharray="5 4"/>
              <line x1="300" y1="56" x2="268" y2="130" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeDasharray="5 4"/>
              <line x1="120" y1="284" x2="152" y2="210" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeDasharray="5 4"/>
              <line x1="300" y1="284" x2="268" y2="210" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeDasharray="5 4"/>

              {/* Floating sparkles */}
              <circle cx="190" cy="60" r="3" fill="rgba(255,255,255,0.5)"/>
              <circle cx="230" cy="55" r="2" fill="rgba(255,255,255,0.4)"/>
              <circle cx="380" cy="170" r="3" fill="rgba(255,255,255,0.4)"/>
              <circle cx="40" cy="170" r="2.5" fill="rgba(255,255,255,0.5)"/>
              <circle cx="210" cy="300" r="2" fill="rgba(255,255,255,0.4)"/>
              <text x="395" y="100" fontSize="14" opacity="0.5">✨</text>
              <text x="10" y="220" fontSize="12" opacity="0.4">⭐</text>
              <text x="390" y="250" fontSize="11" opacity="0.4">💫</text>
            </svg>
          </div>
        </div>
      </div>

      {/* ═══════════════ HOW IT WORKS ═══════════════ */}
      <div style={{ background:"#fff", borderBottom:"1px solid #e2e8f0", padding:"20px 48px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-around", gap:8 }}>
          {[{e:"👤",s:"1",l:"Build Profile",d:"Add your skills"},{a:true},{e:"🎯",s:"2",l:"Get Matched",d:"Smart pairing"},{a:true},{e:"💬",s:"3",l:"Chat & Plan",d:"Real-time messaging"},{a:true},{e:"🚀",s:"4",l:"Grow Together",d:"Learn & teach"}].map((item,i) => item.a ? (
            <div key={i} style={{ fontSize:20, color:"#c7d2fe", fontWeight:300 }}>›</div>
          ) : (
            <div key={i} style={{ textAlign:"center", display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:44, height:44, borderRadius:12, background:"#f0f4ff", border:"1.5px solid #e2e8f0", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, boxShadow:"0 2px 8px rgba(37,99,235,0.08)" }}>{item.e}</div>
              <div style={{ textAlign:"left" }}>
                <div style={{ fontSize:10, fontWeight:700, color:"#2563eb", textTransform:"uppercase", letterSpacing:0.8 }}>Step {item.s}</div>
                <div style={{ fontSize:14, fontWeight:700, color:"#1e293b" }}>{item.l}</div>
                <div style={{ fontSize:12, color:"#64748b" }}>{item.d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth:1100, margin:"0 auto", padding:"36px 24px" }}>

        {/* ═══════════════ YOUR SKILLS ═══════════════ */}
        <div style={{ display:"flex", gap:24, marginBottom:32 }}>
          {/* Main form */}
          <div style={{ flex:1, background:"#fff", borderRadius:20, border:"1px solid #e2e8f0", padding:"28px 32px", boxShadow:"0 4px 20px rgba(37,99,235,0.06)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
              <div style={{ width:36, height:36, borderRadius:10, background:"linear-gradient(135deg,#2563eb,#7c3aed)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>🎯</div>
              <h2 style={{ fontSize:20, fontWeight:800, color:"#1e293b", margin:0 }}>Your Skills</h2>
            </div>
            <p style={{ fontSize:14, color:"#64748b", margin:"0 0 22px 46px" }}>Tell the world what you teach and what you want to learn</p>
            {successMsg && <div style={{ background:"#f0fdf4", border:"1.5px solid #86efac", borderRadius:10, padding:"11px 16px", color:"#15803d", fontSize:14, fontWeight:600, marginBottom:16 }}>✓ {successMsg}</div>}
            {errorMsg && <div style={{ background:"#fef2f2", border:"1.5px solid #fca5a5", borderRadius:10, padding:"11px 16px", color:"#dc2626", fontSize:14, fontWeight:600, marginBottom:16 }}>✕ {errorMsg}</div>}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18, marginBottom:22 }}>
              {[["🎓 Skills I Can Teach","e.g. Python, React, Guitar",skillsOffered,setSkillsOffered,"#eff6ff","#2563eb"],["📚 Skills I Want to Learn","e.g. Spanish, ML, Design",skillsWanted,setSkillsWanted,"#f5f3ff","#7c3aed"]].map(([label,ph,val,setter,bg,ac]) => (
                <div key={label}>
                  <label style={{ fontSize:12, fontWeight:700, color:"#475569", display:"block", marginBottom:8, letterSpacing:0.5, textTransform:"uppercase" }}>{label}</label>
                  <input className="inp" placeholder={ph} value={val} onChange={e => setter(e.target.value)}
                    style={{ width:"100%", padding:"13px 16px", borderRadius:12, border:"1.5px solid #e2e8f0", fontSize:15, outline:"none", color:"#1e293b", background:bg, transition:"all 0.2s", accentColor:ac }} />
                </div>
              ))}
            </div>
            <button className="hov-btn" onClick={handleUpdateSkills} style={{ padding:"13px 36px", borderRadius:12, background:"linear-gradient(135deg,#2563eb,#7c3aed)", color:"#fff", fontWeight:700, fontSize:15, border:"none", cursor:"pointer", boxShadow:"0 4px 18px rgba(37,99,235,0.4)", transition:"all 0.2s" }}>
              Save Skills →
            </button>
          </div>

          {/* Right aside with laptop SVG */}
          <div style={{ width:200, display:"flex", flexDirection:"column", gap:14 }}>
            <div style={{ background:"#fff", borderRadius:16, border:"1px solid #e2e8f0", padding:"16px", boxShadow:"0 2px 12px rgba(37,99,235,0.06)", textAlign:"center" }}>
              <svg viewBox="0 0 180 150" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",maxWidth:160,margin:"0 auto",display:"block"}}>
                {/* Monitor */}
                <rect x="25" y="15" width="130" height="90" rx="8" fill="#1e293b"/>
                <rect x="30" y="20" width="120" height="78" rx="5" fill="#0f172a"/>
                {/* Screen content */}
                <rect x="38" y="28" width="60" height="5" rx="2.5" fill="#3b82f6"/>
                <rect x="38" y="37" width="40" height="4" rx="2" fill="#7c3aed" opacity="0.8"/>
                <rect x="38" y="45" width="75" height="4" rx="2" fill="#2563eb" opacity="0.6"/>
                <rect x="38" y="53" width="50" height="4" rx="2" fill="#10b981" opacity="0.7"/>
                <rect x="38" y="61" width="65" height="4" rx="2" fill="#f59e0b" opacity="0.6"/>
                <rect x="38" y="69" width="45" height="4" rx="2" fill="#ef4444" opacity="0.5"/>
                <rect x="38" y="77" width="70" height="4" rx="2" fill="#3b82f6" opacity="0.5"/>
                {/* Stand */}
                <rect x="80" y="105" width="20" height="16" rx="2" fill="#475569"/>
                <rect x="60" y="119" width="60" height="7" rx="3.5" fill="#334155"/>
                {/* Keyboard */}
                <rect x="20" y="128" width="140" height="14" rx="5" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1"/>
                <rect x="25" y="131" width="130" height="8" rx="3" fill="#f1f5f9"/>
                {/* Badge floating */}
                <rect x="120" y="8" width="52" height="20" rx="10" fill="#2563eb"/>
                <text x="146" y="22" textAnchor="middle" fontSize="9" fill="white" fontWeight="700">Python 🐍</text>
                <rect x="2" y="30" width="48" height="20" rx="10" fill="#7c3aed"/>
                <text x="26" y="44" textAnchor="middle" fontSize="9" fill="white" fontWeight="700">React ⚛️</text>
                <text x="165" y="75" fontSize="13" opacity="0.7">✨</text>
                <text x="5" y="115" fontSize="12" opacity="0.6">⭐</text>
              </svg>
            </div>
            <div style={{ background:"linear-gradient(135deg,#eff6ff,#f5f3ff)", borderRadius:14, border:"1px solid #bfdbfe", padding:"14px 16px", textAlign:"center" }}>
              <div style={{fontSize:22,marginBottom:6}}>💡</div>
              <div style={{fontSize:12,fontWeight:700,color:"#1e293b",marginBottom:4}}>Pro Tip</div>
              <div style={{fontSize:11,color:"#64748b",lineHeight:1.5}}>Separate with commas. E.g. "Python, React, SQL"</div>
            </div>
            <div style={{ background:"linear-gradient(135deg,#f0fdf4,#dcfce7)", borderRadius:14, border:"1px solid #86efac", padding:"14px 16px", textAlign:"center" }}>
              <div style={{fontSize:22,marginBottom:6}}>🎯</div>
              <div style={{fontSize:12,fontWeight:700,color:"#1e293b",marginBottom:4}}>Be Specific</div>
              <div style={{fontSize:11,color:"#64748b",lineHeight:1.5}}>"React.js" matches better than just "coding"</div>
            </div>
          </div>
        </div>

        {/* ═══════════════ MATCHES + RIGHT ASIDE ═══════════════ */}
        <div style={{ display:"flex", gap:24, marginBottom:36 }}>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <div>
                <h2 style={{ fontSize:24, fontWeight:900, color:"#1e293b", margin:"0 0 4px", letterSpacing:-0.5 }}>🤝 Skill Matches</h2>
                <p style={{ fontSize:14, color:"#64748b", margin:0 }}>People who match your goals · <strong style={{color:"#2563eb"}}>{filtered.length} found</strong></p>
              </div>
            </div>

            {/* Category tabs */}
            <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:22, padding:"14px 18px", background:"#fff", borderRadius:14, border:"1px solid #e2e8f0", boxShadow:"0 2px 8px rgba(37,99,235,0.04)" }}>
              {CATS.map(cat => (
                <button key={cat} className={`cat-btn${activeCat===cat?" active":""}`} onClick={() => setActiveCat(cat)}>{cat}</button>
              ))}
            </div>

            {filtered.length === 0 ? (
              <div style={{ background:"#fff", borderRadius:20, border:"1px solid #e2e8f0", padding:"60px 24px", textAlign:"center", boxShadow:"0 4px 20px rgba(37,99,235,0.06)" }}>
                <svg viewBox="0 0 200 180" fill="none" style={{width:150,height:130,margin:"0 auto",display:"block",marginBottom:16}}>
                  <circle cx="100" cy="80" r="58" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="2"/>
                  <circle cx="100" cy="80" r="40" fill="#dbeafe" stroke="#93c5fd" strokeWidth="1.5"/>
                  <text x="100" y="92" textAnchor="middle" fontSize="40">🔍</text>
                  <rect x="35" y="152" width="130" height="9" rx="4.5" fill="#e2e8f0"/>
                  <rect x="55" y="167" width="90" height="7" rx="3.5" fill="#f1f5f9"/>
                </svg>
                <p style={{ fontWeight:800, color:"#1e293b", fontSize:20, margin:"0 0 8px" }}>{searchQuery ? "No results found" : "No matches yet"}</p>
                <p style={{ color:"#94a3b8", fontSize:15 }}>{searchQuery ? "Try different search terms or clear filters" : "Add your skills above — matches appear instantly!"}</p>
              </div>
            ) : (
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:20 }}>
                {filtered.map(user => {
                  const color = gc(user.name);
                  return (
                    <div key={user._id} className="hov-card" style={{ background:"#fff", borderRadius:20, border:"1px solid #e2e8f0", overflow:"hidden", boxShadow:"0 4px 16px rgba(0,0,0,0.06)" }}>
                      <div style={{ height:6, background:`linear-gradient(90deg,${color},${color}99)` }}></div>
                      <div style={{ padding:"20px 22px 22px" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:16 }}>
                          <div style={{ width:54, height:54, borderRadius:16, background:`linear-gradient(135deg,${color},${color}bb)`, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:900, fontSize:24, flexShrink:0, boxShadow:`0 6px 16px ${color}44` }}>{user.name[0].toUpperCase()}</div>
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{ fontWeight:700, color:"#1e293b", fontSize:16, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{user.name}</div>
                            <div style={{ fontSize:12, color:"#94a3b8", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{user.email}</div>
                          </div>
                          <span style={{ background:"#dcfce7", color:"#15803d", fontSize:11, fontWeight:700, padding:"4px 10px", borderRadius:99, flexShrink:0, border:"1px solid #86efac" }}>MATCH ✓</span>
                        </div>
                        <div style={{height:1,background:"#f1f5f9",margin:"0 0 14px"}}></div>
                        <div style={{fontSize:11,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>🎓 Can Teach</div>
                        <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:14}}>{user.skillsOffered.map(s => <span key={s} style={{background:"#eff6ff",color:"#1d4ed8",fontSize:12,fontWeight:600,padding:"4px 12px",borderRadius:99,border:"1px solid #bfdbfe"}}>{s}</span>)}</div>
                        <div style={{fontSize:11,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>📚 Wants to Learn</div>
                        <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:20}}>{user.skillsWanted.map(s => <span key={s} style={{background:"#fffbeb",color:"#92400e",fontSize:12,fontWeight:600,padding:"4px 12px",borderRadius:99,border:"1px solid #fde68a"}}>{s}</span>)}</div>
                        <button className="hov-btn" onClick={() => sendRequest(user._id,user.skillsOffered[0])} style={{ width:"100%", padding:"12px", borderRadius:12, background:`linear-gradient(135deg,${color},${color}cc)`, color:"#fff", fontWeight:700, fontSize:14, border:"none", cursor:"pointer", boxShadow:`0 4px 14px ${color}44`, transition:"all 0.2s" }}>
                          Send Exchange Request →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT ASIDE for matches */}
          <div style={{ width:200, flexShrink:0, display:"flex", flexDirection:"column", gap:14, paddingTop:60 }}>
            <div style={{ background:"#fff", borderRadius:16, border:"1px solid #e2e8f0", padding:"16px", boxShadow:"0 2px 12px rgba(37,99,235,0.06)", textAlign:"center" }}>
              <svg viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",maxWidth:160,margin:"0 auto",display:"block"}}>
                {/* Two people */}
                <circle cx="55" cy="52" r="30" fill="#dbeafe" stroke="#93c5fd" strokeWidth="1.5"/>
                <text x="55" y="62" textAnchor="middle" fontSize="26">👩‍💼</text>
                <circle cx="125" cy="52" r="30" fill="#ede9fe" stroke="#c4b5fd" strokeWidth="1.5"/>
                <text x="125" y="62" textAnchor="middle" fontSize="26">👨‍💻</text>
                {/* Bridge */}
                <path d="M70 52 Q90 30 110 52" stroke="#2563eb" strokeWidth="2" fill="none" strokeDasharray="4 3"/>
                {/* Handshake box */}
                <rect x="50" y="92" width="80" height="36" rx="14" fill="#fef3c7" stroke="#fde68a" strokeWidth="1.5"/>
                <text x="90" y="114" textAnchor="middle" fontSize="20">🤝</text>
                {/* Skill exchange */}
                <rect x="20" y="142" width="60" height="22" rx="11" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="1"/>
                <text x="50" y="157" textAnchor="middle" fontSize="9" fill="#1d4ed8" fontWeight="700">Skill Swap!</text>
                <rect x="100" y="142" width="60" height="22" rx="11" fill="#f5f3ff" stroke="#c4b5fd" strokeWidth="1"/>
                <text x="130" y="157" textAnchor="middle" fontSize="9" fill="#7c3aed" fontWeight="700">New Match!</text>
                <text x="10" y="95" fontSize="15" opacity="0.7">✨</text>
                <text x="155" y="95" fontSize="13" opacity="0.6">⭐</text>
                <text x="158" y="50" fontSize="12" opacity="0.5">💫</text>
              </svg>
            </div>
            {[["📊","Match Score","Based on overlapping skills and learning goals"],["⚡","Instant Connect","Send a request and start chatting right away"],["🌱","Keep Growing","Update skills for fresh matches daily"]].map(([e,t,d]) => (
              <div key={t} style={{ background:"#fff", borderRadius:14, border:"1px solid #e2e8f0", padding:"14px 16px", boxShadow:"0 2px 8px rgba(37,99,235,0.04)", textAlign:"center" }}>
                <div style={{fontSize:22,marginBottom:6}}>{e}</div>
                <div style={{fontSize:12,fontWeight:700,color:"#1e293b",marginBottom:4}}>{t}</div>
                <div style={{fontSize:11,color:"#64748b",lineHeight:1.5}}>{d}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════════ INBOX + RIGHT ASIDE ═══════════════ */}
        <div style={{ display:"flex", gap:24 }}>
          <div style={{ flex:1, minWidth:0 }}>
            <h2 style={{ fontSize:24, fontWeight:900, color:"#1e293b", margin:"0 0 4px", letterSpacing:-0.5 }}>📩 Inbox</h2>
            <p style={{ fontSize:14, color:"#64748b", margin:"0 0 20px" }}>Skill exchange requests from others</p>
            {requests.length === 0 ? (
              <div style={{ background:"#fff", borderRadius:20, border:"1px solid #e2e8f0", padding:"60px 24px", textAlign:"center", boxShadow:"0 4px 20px rgba(37,99,235,0.06)" }}>
                <svg viewBox="0 0 200 180" fill="none" style={{width:150,height:130,margin:"0 auto",display:"block",marginBottom:16}}>
                  <circle cx="100" cy="80" r="58" fill="#fef9ec" stroke="#fde68a" strokeWidth="2"/>
                  <circle cx="100" cy="80" r="40" fill="#fef3c7" stroke="#fcd34d" strokeWidth="1.5"/>
                  <text x="100" y="92" textAnchor="middle" fontSize="40">📬</text>
                  <rect x="35" y="152" width="130" height="9" rx="4.5" fill="#e2e8f0"/>
                  <rect x="55" y="167" width="90" height="7" rx="3.5" fill="#f1f5f9"/>
                </svg>
                <p style={{ fontWeight:800, color:"#1e293b", fontSize:20, margin:"0 0 8px" }}>Inbox is empty</p>
                <p style={{ color:"#94a3b8", fontSize:15 }}>Skill exchange requests from others will appear here</p>
              </div>
            ) : (
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:18 }}>
                {requests.map(req => {
                  const color = gc(req.sender.name);
                  return (
                    <div key={req._id} className="hov-card" style={{ background:"#fff", borderRadius:20, border:"1px solid #e2e8f0", overflow:"hidden", boxShadow:"0 4px 16px rgba(0,0,0,0.06)" }}>
                      <div style={{ height:5, background: req.status==="accepted"?"linear-gradient(90deg,#22c55e,#16a34a)":req.status==="rejected"?"linear-gradient(90deg,#ef4444,#dc2626)":"linear-gradient(90deg,#f59e0b,#d97706)" }}></div>
                      <div style={{padding:"20px 22px"}}>
                        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
                          <div style={{width:48,height:48,borderRadius:14,background:`linear-gradient(135deg,${color},${color}bb)`,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:20,boxShadow:`0 4px 12px ${color}33`}}>{req.sender.name[0]}</div>
                          <div style={{flex:1}}>
                            <div style={{fontWeight:700,color:"#1e293b",fontSize:15}}>{req.sender.name}</div>
                            <div style={{fontSize:12,color:"#94a3b8"}}>{req.sender.email}</div>
                          </div>
                          <span style={{fontSize:11,fontWeight:700,padding:"4px 12px",borderRadius:99,background:req.status==="accepted"?"#dcfce7":req.status==="rejected"?"#fee2e2":"#fef3c7",color:req.status==="accepted"?"#15803d":req.status==="rejected"?"#dc2626":"#d97706",border:`1px solid ${req.status==="accepted"?"#86efac":req.status==="rejected"?"#fca5a5":"#fde68a"}`}}>{req.status.toUpperCase()}</span>
                        </div>
                        <div style={{background:"#f8faff",borderRadius:10,padding:"10px 14px",marginBottom:14,border:"1px solid #e2e8f0",fontSize:13,color:"#374151"}}>
                          Wants to learn: <strong style={{color:"#2563eb"}}>{req.skill}</strong>
                        </div>
                        {req.status==="pending" && (
                          <div style={{display:"flex",gap:8}}>
                            <button className="hov-btn" onClick={() => updateRequest(req._id,"accepted")} style={{flex:1,padding:"10px",borderRadius:10,background:"linear-gradient(135deg,#22c55e,#16a34a)",color:"#fff",border:"none",cursor:"pointer",fontSize:13,fontWeight:700,transition:"all 0.15s"}}>✓ Accept</button>
                            <button className="hov-btn" onClick={() => updateRequest(req._id,"rejected")} style={{flex:1,padding:"10px",borderRadius:10,background:"#fff",color:"#ef4444",border:"1.5px solid #fca5a5",cursor:"pointer",fontSize:13,fontWeight:700,transition:"all 0.15s"}}>✕ Reject</button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT ASIDE for inbox */}
          <div style={{ width:200, flexShrink:0, display:"flex", flexDirection:"column", gap:14, paddingTop:60 }}>
            <div style={{ background:"#fff", borderRadius:16, border:"1px solid #e2e8f0", padding:"16px", boxShadow:"0 2px 12px rgba(37,99,235,0.06)", textAlign:"center" }}>
              <svg viewBox="0 0 180 170" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",maxWidth:160,margin:"0 auto",display:"block"}}>
                {/* Envelope */}
                <rect x="15" y="40" width="150" height="105" rx="12" fill="#fef3c7" stroke="#fde68a" strokeWidth="1.5"/>
                <path d="M15 60 L90 110 L165 60" stroke="#f59e0b" strokeWidth="2" fill="none" strokeLinecap="round"/>
                <rect x="15" y="40" width="150" height="40" rx="12" fill="#fef9ec"/>
                {/* Notification bubble */}
                <circle cx="145" cy="48" r="22" fill="#ef4444" stroke="white" strokeWidth="2.5"/>
                <text x="145" y="55" textAnchor="middle" fontSize="16" fill="white" fontWeight="900">3</text>
                {/* Lines suggesting content */}
                <rect x="30" y="120" width="100" height="6" rx="3" fill="rgba(245,158,11,0.3)"/>
                <rect x="50" y="130" width="60" height="5" rx="2.5" fill="rgba(245,158,11,0.2)"/>
                {/* Floating icons */}
                <text x="8" y="95" fontSize="16" opacity="0.5">📨</text>
                <text x="155" y="155" fontSize="14" opacity="0.4">✉️</text>
              </svg>
            </div>
            {[["🔔","Stay Notified","Accept requests to unlock real-time chat"],["⏱️","Respond Fast","Quick replies = better partnerships"],["🤝","Build Network","Every match grows your learning circle"]].map(([e,t,d]) => (
              <div key={t} style={{ background:"#fff", borderRadius:14, border:"1px solid #e2e8f0", padding:"14px 16px", boxShadow:"0 2px 8px rgba(37,99,235,0.04)", textAlign:"center" }}>
                <div style={{fontSize:22,marginBottom:6}}>{e}</div>
                <div style={{fontSize:12,fontWeight:700,color:"#1e293b",marginBottom:4}}>{t}</div>
                <div style={{fontSize:11,color:"#64748b",lineHeight:1.5}}>{d}</div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* FOOTER */}
      <div style={{ background:"#0f172a", padding:"24px 48px", marginTop:48, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:32, height:32, borderRadius:8, background:"linear-gradient(135deg,#2563eb,#7c3aed)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:900, fontSize:16 }}>S</div>
          <span style={{ fontWeight:700, fontSize:16, color:"#fff" }}>Skill<span style={{color:"#60a5fa"}}>Xchange</span></span>
        </div>
        <span style={{ fontSize:13, color:"#475569" }}>© 2025 SkillXchange · Built with ❤️ for learners</span>
        <div style={{ display:"flex", gap:16 }}>
          {["Learn","Teach","Connect"].map(t => <span key={t} style={{fontSize:13,color:"#475569",cursor:"pointer"}}>{t}</span>)}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
