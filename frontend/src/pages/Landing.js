import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight:"100vh", fontFamily:"'Inter','Segoe UI',system-ui,sans-serif", background:"#f0f4ff" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .hov { transition: all 0.2s ease; }
        .hov:hover { opacity: 0.88; transform: translateY(-2px); }
        .card-hov { transition: all 0.25s ease; }
        .card-hov:hover { transform: translateY(-6px); box-shadow: 0 20px 48px rgba(37,99,235,0.15) !important; }
        .pulse { animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100%{box-shadow:0 0 0 0 rgba(74,222,128,0.5)} 50%{box-shadow:0 0 0 8px rgba(74,222,128,0)} }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav style={{ background:"rgba(255,255,255,0.95)", backdropFilter:"blur(12px)", borderBottom:"1px solid #e2e8f0", padding:"0 48px", display:"flex", justifyContent:"space-between", alignItems:"center", height:66, position:"sticky", top:0, zIndex:100, boxShadow:"0 2px 16px rgba(37,99,235,0.08)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:40, height:40, borderRadius:12, background:"linear-gradient(135deg,#2563eb,#7c3aed)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:900, fontSize:22, boxShadow:"0 4px 12px rgba(37,99,235,0.4)" }}>S</div>
          <span style={{ fontWeight:900, fontSize:22, color:"#1e293b", letterSpacing:-0.5 }}>Skill<span style={{ color:"#2563eb" }}>Xchange</span></span>
        </div>
        <div style={{ display:"flex", gap:12, alignItems:"center" }}>
          {["Features","How it works","About"].map(t => (
            <span key={t} style={{ fontSize:14, fontWeight:500, color:"#64748b", cursor:"pointer", padding:"6px 4px" }} className="hov">{t}</span>
          ))}
          <button className="hov" onClick={() => navigate("/")} style={{ padding:"9px 22px", borderRadius:9, border:"1.5px solid #e2e8f0", background:"#fff", color:"#374151", fontWeight:600, fontSize:14, cursor:"pointer" }}>Login</button>
          <button className="hov" onClick={() => navigate("/register")} style={{ padding:"9px 22px", borderRadius:9, border:"none", background:"linear-gradient(135deg,#2563eb,#7c3aed)", color:"#fff", fontWeight:600, fontSize:14, cursor:"pointer", boxShadow:"0 4px 12px rgba(37,99,235,0.4)" }}>Get Started Free →</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <div style={{ background:"linear-gradient(135deg,#0f172a 0%,#1e3a8a 40%,#2563eb 70%,#7c3aed 100%)", padding:"80px 48px 90px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-120, right:-100, width:500, height:500, borderRadius:"50%", background:"rgba(124,58,237,0.15)", filter:"blur(80px)" }}></div>
        <div style={{ position:"absolute", bottom:-80, left:100, width:400, height:400, borderRadius:"50%", background:"rgba(37,99,235,0.2)", filter:"blur(60px)" }}></div>

        <div style={{ maxWidth:1100, margin:"0 auto", display:"flex", alignItems:"center", gap:60, position:"relative", zIndex:1 }}>
          <div style={{ flex:1 }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(255,255,255,0.12)", border:"1px solid rgba(255,255,255,0.25)", borderRadius:99, padding:"7px 18px", marginBottom:28, backdropFilter:"blur(8px)" }}>
              <span className="pulse" style={{ width:8, height:8, borderRadius:99, background:"#4ade80", display:"inline-block" }}></span>
              <span style={{ fontSize:13, color:"#fff", fontWeight:600 }}>Free to use · 2,400+ learners · Real-time matching</span>
            </div>
            <h1 style={{ fontSize:58, fontWeight:900, color:"#fff", margin:"0 0 20px", letterSpacing:-2, lineHeight:1.05 }}>
              Learn anything.<br />
              <span style={{ background:"linear-gradient(90deg,#93c5fd,#c4b5fd)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Teach everything.</span>
            </h1>
            <p style={{ fontSize:18, color:"rgba(255,255,255,0.72)", lineHeight:1.7, margin:"0 0 40px", maxWidth:520 }}>
              SkillXchange is a peer-to-peer skill exchange platform. You teach what you know, learn what you want — no money, just knowledge.
            </p>
            <div style={{ display:"flex", gap:14, flexWrap:"wrap" }}>
              <button className="hov" onClick={() => navigate("/register")} style={{ padding:"16px 36px", borderRadius:14, background:"#fff", color:"#1e293b", fontWeight:800, fontSize:16, border:"none", cursor:"pointer", boxShadow:"0 6px 24px rgba(0,0,0,0.2)" }}>
                Start Exchanging Free →
              </button>
              <button className="hov" onClick={() => navigate("/")} style={{ padding:"16px 32px", borderRadius:14, background:"transparent", color:"#fff", fontWeight:600, fontSize:16, border:"2px solid rgba(255,255,255,0.3)", cursor:"pointer", backdropFilter:"blur(8px)" }}>
                Sign In
              </button>
            </div>
            <div style={{ display:"flex", gap:32, marginTop:40 }}>
              {[["🎓","500+","Skills Available"],["🤝","2.4k+","Active Users"],["⚡","94%","Match Rate"]].map(([icon,num,label]) => (
                <div key={label}>
                  <div style={{ fontSize:24, fontWeight:900, color:"#fff" }}>{icon} {num}</div>
                  <div style={{ fontSize:12, color:"rgba(255,255,255,0.55)", fontWeight:500 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Illustration */}
          <div style={{ width:420, flexShrink:0 }}>
            <svg viewBox="0 0 420 360" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width:"100%", filter:"drop-shadow(0 24px 48px rgba(0,0,0,0.4))" }}>
              {/* Central hub */}
              <circle cx="210" cy="180" r="68" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5"/>
              <circle cx="210" cy="180" r="48" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.25)" strokeWidth="1"/>
              <circle cx="210" cy="180" r="30" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5"/>
              <text x="210" y="190" textAnchor="middle" fontSize="26">🔄</text>
              {/* Person cards */}
              <rect x="8" y="20" width="116" height="78" rx="14" fill="rgba(255,255,255,0.13)" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5"/>
              <circle cx="34" cy="48" r="18" fill="rgba(37,99,235,0.7)" stroke="rgba(147,197,253,0.7)" strokeWidth="1.5"/><text x="34" y="55" textAnchor="middle" fontSize="17">👩‍💻</text>
              <rect x="58" y="38" width="58" height="7" rx="3.5" fill="rgba(255,255,255,0.55)"/>
              <rect x="58" y="50" width="42" height="5" rx="2.5" fill="rgba(255,255,255,0.3)"/>
              <rect x="10" y="78" width="112" height="16" rx="8" fill="rgba(37,99,235,0.6)"/>
              <text x="66" y="90" textAnchor="middle" fontSize="9" fill="white" fontWeight="700">Python · React</text>
              <rect x="296" y="20" width="116" height="78" rx="14" fill="rgba(255,255,255,0.13)" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5"/>
              <circle cx="322" cy="48" r="18" fill="rgba(124,58,237,0.7)" stroke="rgba(196,181,253,0.7)" strokeWidth="1.5"/><text x="322" y="55" textAnchor="middle" fontSize="17">👨‍🎨</text>
              <rect x="346" y="38" width="58" height="7" rx="3.5" fill="rgba(255,255,255,0.55)"/>
              <rect x="346" y="50" width="42" height="5" rx="2.5" fill="rgba(255,255,255,0.3)"/>
              <rect x="298" y="78" width="112" height="16" rx="8" fill="rgba(124,58,237,0.6)"/>
              <text x="354" y="90" textAnchor="middle" fontSize="9" fill="white" fontWeight="700">UI/UX · Figma</text>
              <rect x="8" y="262" width="116" height="78" rx="14" fill="rgba(255,255,255,0.13)" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5"/>
              <circle cx="34" cy="290" r="18" fill="rgba(5,150,105,0.7)" stroke="rgba(52,211,153,0.7)" strokeWidth="1.5"/><text x="34" y="297" textAnchor="middle" fontSize="17">👨‍🏫</text>
              <rect x="58" y="280" width="58" height="7" rx="3.5" fill="rgba(255,255,255,0.55)"/>
              <rect x="58" y="292" width="42" height="5" rx="2.5" fill="rgba(255,255,255,0.3)"/>
              <rect x="10" y="320" width="112" height="16" rx="8" fill="rgba(5,150,105,0.6)"/>
              <text x="66" y="332" textAnchor="middle" fontSize="9" fill="white" fontWeight="700">Guitar · Music</text>
              <rect x="296" y="262" width="116" height="78" rx="14" fill="rgba(255,255,255,0.13)" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5"/>
              <circle cx="322" cy="290" r="18" fill="rgba(217,119,6,0.7)" stroke="rgba(251,191,36,0.7)" strokeWidth="1.5"/><text x="322" y="297" textAnchor="middle" fontSize="17">👩‍🔬</text>
              <rect x="346" y="280" width="58" height="7" rx="3.5" fill="rgba(255,255,255,0.55)"/>
              <rect x="346" y="292" width="42" height="5" rx="2.5" fill="rgba(255,255,255,0.3)"/>
              <rect x="298" y="320" width="112" height="16" rx="8" fill="rgba(217,119,6,0.6)"/>
              <text x="354" y="332" textAnchor="middle" fontSize="9" fill="white" fontWeight="700">ML · Data · AI</text>
              {/* Connecting lines */}
              <line x1="124" y1="58" x2="158" y2="138" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeDasharray="5 4"/>
              <line x1="296" y1="58" x2="262" y2="138" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeDasharray="5 4"/>
              <line x1="124" y1="302" x2="158" y2="222" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeDasharray="5 4"/>
              <line x1="296" y1="302" x2="262" y2="222" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeDasharray="5 4"/>
              <circle cx="200" cy="60" r="3" fill="rgba(255,255,255,0.5)"/>
              <circle cx="240" cy="55" r="2" fill="rgba(255,255,255,0.4)"/>
              <circle cx="395" cy="180" r="3" fill="rgba(255,255,255,0.4)"/>
              <circle cx="25" cy="180" r="2.5" fill="rgba(255,255,255,0.5)"/>
              <text x="400" y="110" fontSize="14" opacity="0.5">✨</text>
              <text x="5" y="230" fontSize="12" opacity="0.4">⭐</text>
              <text x="395" y="265" fontSize="12" opacity="0.4">💫</text>
            </svg>
          </div>
        </div>
      </div>

      {/* ── FEATURES STRIP ── */}
      <div style={{ background:"#fff", borderBottom:"1px solid #e2e8f0", padding:"20px 48px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-around" }}>
          {[["🔍","Smart Matching"],["💬","Real-time Chat"],["🤝","Skill Exchange"],["🚀","Free Forever"],["🔒","Secure & Private"]].map(([icon,label]) => (
            <div key={label} style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ fontSize:20 }}>{icon}</span>
              <span style={{ fontSize:14, fontWeight:600, color:"#475569" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <div style={{ padding:"72px 48px", background:"#f8faff" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:52 }}>
            <div style={{ display:"inline-block", background:"#eff6ff", color:"#2563eb", fontSize:12, fontWeight:700, padding:"6px 16px", borderRadius:99, marginBottom:16, textTransform:"uppercase", letterSpacing:1 }}>How It Works</div>
            <h2 style={{ fontSize:40, fontWeight:900, color:"#1e293b", letterSpacing:-1, margin:"0 0 14px" }}>Exchange skills in 4 simple steps</h2>
            <p style={{ fontSize:17, color:"#64748b", maxWidth:520, margin:"0 auto", lineHeight:1.6 }}>No money needed. Just share your knowledge and gain new skills from real people.</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:24 }}>
            {[
              {step:"01",icon:"👤",title:"Create Profile",desc:"Sign up free and tell us what skills you have and what you want to learn.",color:"#2563eb",bg:"#eff6ff"},
              {step:"02",icon:"🎯",title:"Get Matched",desc:"Our smart system finds people whose skills match your learning goals perfectly.",color:"#7c3aed",bg:"#f5f3ff"},
              {step:"03",icon:"💬",title:"Connect & Chat",desc:"Send a skill exchange request and chat in real-time with your skill partner.",color:"#059669",bg:"#f0fdf4"},
              {step:"04",icon:"🚀",title:"Learn & Grow",desc:"Start exchanging — teach what you know, learn what you want. Track your growth.",color:"#d97706",bg:"#fffbeb"},
            ].map((item) => (
              <div key={item.step} className="card-hov" style={{ background:"#fff", borderRadius:20, border:"1px solid #e2e8f0", padding:"28px 24px", boxShadow:"0 4px 16px rgba(37,99,235,0.06)", textAlign:"center" }}>
                <div style={{ width:56, height:56, borderRadius:16, background:item.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, margin:"0 auto 16px", border:`2px solid ${item.color}22` }}>{item.icon}</div>
                <div style={{ fontSize:12, fontWeight:700, color:item.color, textTransform:"uppercase", letterSpacing:1, marginBottom:8 }}>Step {item.step}</div>
                <h3 style={{ fontSize:18, fontWeight:800, color:"#1e293b", margin:"0 0 10px" }}>{item.title}</h3>
                <p style={{ fontSize:14, color:"#64748b", lineHeight:1.6, margin:0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SKILL CATEGORIES ── */}
      <div style={{ padding:"72px 48px", background:"#fff" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:48 }}>
            <div style={{ display:"inline-block", background:"#f5f3ff", color:"#7c3aed", fontSize:12, fontWeight:700, padding:"6px 16px", borderRadius:99, marginBottom:16, textTransform:"uppercase", letterSpacing:1 }}>Skill Categories</div>
            <h2 style={{ fontSize:40, fontWeight:900, color:"#1e293b", letterSpacing:-1, margin:"0 0 14px" }}>What can you exchange?</h2>
            <p style={{ fontSize:17, color:"#64748b", maxWidth:480, margin:"0 auto" }}>Hundreds of skills across every domain — from coding to cooking.</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16 }}>
            {[
              {icon:"💻",label:"Programming",count:"120+ skills",color:"#2563eb",bg:"#eff6ff"},
              {icon:"🎨",label:"Design & Art",count:"80+ skills",color:"#7c3aed",bg:"#f5f3ff"},
              {icon:"🎵",label:"Music",count:"60+ skills",color:"#059669",bg:"#f0fdf4"},
              {icon:"🌍",label:"Languages",count:"50+ skills",color:"#d97706",bg:"#fffbeb"},
              {icon:"🤖",label:"AI & Machine Learning",count:"45+ skills",color:"#0891b2",bg:"#f0f9ff"},
              {icon:"📊",label:"Data Science",count:"40+ skills",color:"#be185d",bg:"#fdf2f8"},
              {icon:"💰",label:"Finance",count:"35+ skills",color:"#65a30d",bg:"#f7fee7"},
              {icon:"📱",label:"Mobile Dev",count:"30+ skills",color:"#dc2626",bg:"#fef2f2"},
            ].map((cat) => (
              <div key={cat.label} className="card-hov" style={{ background:cat.bg, borderRadius:16, border:`1.5px solid ${cat.color}22`, padding:"20px", cursor:"pointer", boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
                <div style={{ fontSize:32, marginBottom:10 }}>{cat.icon}</div>
                <div style={{ fontSize:15, fontWeight:700, color:"#1e293b", marginBottom:4 }}>{cat.label}</div>
                <div style={{ fontSize:12, color:cat.color, fontWeight:600 }}>{cat.count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TESTIMONIALS ── */}
      <div style={{ padding:"72px 48px", background:"#f8faff" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:48 }}>
            <div style={{ display:"inline-block", background:"#f0fdf4", color:"#059669", fontSize:12, fontWeight:700, padding:"6px 16px", borderRadius:99, marginBottom:16, textTransform:"uppercase", letterSpacing:1 }}>Reviews</div>
            <h2 style={{ fontSize:40, fontWeight:900, color:"#1e293b", letterSpacing:-1, margin:0 }}>Loved by learners</h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:24 }}>
            {[
              {name:"Priya Sharma",role:"Software Engineer",avatar:"👩‍💻",review:"I taught Python and learned Guitar in exchange. Best decision ever! The matching is incredibly accurate.",stars:5,color:"#2563eb"},
              {name:"Rahul Verma",role:"Graphic Designer",avatar:"👨‍🎨",review:"SkillXchange helped me learn React while I taught UI/UX design. The chat feature makes it so easy to collaborate.",stars:5,color:"#7c3aed"},
              {name:"Ananya Patel",role:"Data Scientist",avatar:"👩‍🔬",review:"Found my perfect skill partner in 10 minutes! I'm now learning Spanish while teaching ML concepts. Incredible platform.",stars:5,color:"#059669"},
            ].map((t) => (
              <div key={t.name} className="card-hov" style={{ background:"#fff", borderRadius:20, border:"1px solid #e2e8f0", padding:"28px", boxShadow:"0 4px 16px rgba(37,99,235,0.06)" }}>
                <div style={{ display:"flex", gap:4, marginBottom:16 }}>{"⭐".repeat(t.stars)}</div>
                <p style={{ fontSize:15, color:"#374151", lineHeight:1.7, margin:"0 0 20px", fontStyle:"italic" }}>"{t.review}"</p>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <div style={{ width:44, height:44, borderRadius:12, background:`linear-gradient(135deg,${t.color},${t.color}bb)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontWeight:700, color:"#1e293b", fontSize:15 }}>{t.name}</div>
                    <div style={{ fontSize:12, color:"#94a3b8" }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div style={{ background:"linear-gradient(135deg,#1e3a8a,#2563eb,#7c3aed)", padding:"80px 48px", textAlign:"center", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-80, right:-80, width:300, height:300, borderRadius:"50%", background:"rgba(255,255,255,0.05)", filter:"blur(40px)" }}></div>
        <div style={{ position:"relative", zIndex:1 }}>
          <h2 style={{ fontSize:48, fontWeight:900, color:"#fff", margin:"0 0 16px", letterSpacing:-1.5 }}>Ready to exchange skills?</h2>
          <p style={{ fontSize:18, color:"rgba(255,255,255,0.75)", margin:"0 0 36px", maxWidth:480, marginLeft:"auto", marginRight:"auto", lineHeight:1.6 }}>Join thousands of learners who are growing together. It's completely free — forever.</p>
          <button className="hov" onClick={() => navigate("/register")} style={{ padding:"18px 48px", borderRadius:14, background:"#fff", color:"#1e293b", fontWeight:900, fontSize:18, border:"none", cursor:"pointer", boxShadow:"0 8px 32px rgba(0,0,0,0.25)" }}>
            Start Exchanging Free Today →
          </button>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div style={{ background:"#0f172a", padding:"32px 48px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:34, height:34, borderRadius:9, background:"linear-gradient(135deg,#2563eb,#7c3aed)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:900, fontSize:18 }}>S</div>
          <span style={{ fontWeight:700, fontSize:16, color:"#fff" }}>Skill<span style={{color:"#60a5fa"}}>Xchange</span></span>
        </div>
        <span style={{ fontSize:13, color:"#475569" }}>© 2025 SkillXchange · Built with ❤️ for lifelong learners</span>
        <div style={{ display:"flex", gap:20 }}>
          {["Learn","Teach","Connect","About"].map(t => <span key={t} style={{fontSize:13,color:"#475569",cursor:"pointer"}} className="hov">{t}</span>)}
        </div>
      </div>
    </div>
  );
}

export default Landing;
