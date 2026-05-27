import { useNavigate } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  body{background:#05080F}
  .lp{min-height:100vh;background:#05080F;font-family:'DM Sans',sans-serif;color:#E2E4EF;overflow-x:hidden}
  .nav{position:sticky;top:0;z-index:100;background:rgba(5,8,15,0.9);backdrop-filter:blur(20px);border-bottom:1px solid rgba(255,255,255,0.06);height:66px;padding:0 48px;display:flex;align-items:center;justify-content:space-between}
  .nav-logo{display:flex;align-items:center;gap:10px}
  .nav-logo-icon{width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,#6C63FF,#A78BFA);display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Syne',sans-serif;font-weight:800;font-size:17px}
  .nav-logo-text{font-family:'Syne',sans-serif;font-weight:700;font-size:18px;color:#fff}
  .nav-links{display:flex;gap:8px;align-items:center}
  .btn-ghost{padding:8px 20px;border-radius:8px;border:1px solid rgba(255,255,255,0.1);background:transparent;color:#9CA3AF;font-size:14px;font-weight:500;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all 0.2s}
  .btn-ghost:hover{color:#fff;background:rgba(255,255,255,0.06)}
  .btn-primary{padding:8px 20px;border-radius:8px;border:none;background:linear-gradient(135deg,#6C63FF,#A78BFA);color:#fff;font-size:14px;font-weight:600;cursor:pointer;font-family:'DM Sans',sans-serif;transition:opacity 0.2s}
  .btn-primary:hover{opacity:0.85}
  .hero{position:relative;overflow:hidden;padding:100px 48px 80px;text-align:center}
  .hero::before{content:'';position:absolute;top:-200px;left:50%;transform:translateX(-50%);width:800px;height:800px;background:radial-gradient(circle,rgba(108,99,255,0.12) 0%,transparent 65%);pointer-events:none}
  .hero-tag{display:inline-flex;align-items:center;gap:7px;background:rgba(108,99,255,0.1);border:1px solid rgba(108,99,255,0.25);border-radius:99px;padding:6px 16px;font-size:12px;color:#A78BFA;font-weight:600;margin-bottom:28px}
  .hero-dot{width:7px;height:7px;border-radius:99px;background:#6C63FF;animation:pulse 2s infinite;display:inline-block}
  @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.4;transform:scale(0.8)}}
  .hero-title{font-family:'Syne',sans-serif;font-size:64px;font-weight:800;color:#fff;letter-spacing:-3px;line-height:1.05;margin-bottom:20px;max-width:760px;margin-left:auto;margin-right:auto}
  .hero-title span{background:linear-gradient(135deg,#6C63FF,#A78BFA,#60A5FA);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
  .hero-sub{font-size:18px;color:#6B7280;line-height:1.7;max-width:520px;margin:0 auto 40px}
  .hero-btns{display:flex;gap:12px;justify-content:center;margin-bottom:64px}
  .btn-lg{padding:14px 32px;border-radius:12px;font-size:16px;font-weight:600;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all 0.2s}
  .btn-lg-primary{background:linear-gradient(135deg,#6C63FF,#A78BFA);border:none;color:#fff;box-shadow:0 4px 20px rgba(108,99,255,0.4)}
  .btn-lg-primary:hover{opacity:0.88;transform:translateY(-1px)}
  .btn-lg-ghost{background:transparent;border:1px solid rgba(255,255,255,0.12);color:#9CA3AF}
  .btn-lg-ghost:hover{color:#fff;border-color:rgba(255,255,255,0.25);background:rgba(255,255,255,0.04)}
  .hero-img-grid{display:grid;grid-template-columns:1fr 1.6fr 1fr;gap:12px;max-width:900px;margin:0 auto;height:220px}
  .hero-img-card{border-radius:16px;overflow:hidden;position:relative}
  .hero-img-card img{width:100%;height:100%;object-fit:cover;opacity:0.55;filter:saturate(0.7)}
  .hero-img-center{border-radius:20px;overflow:hidden;position:relative}
  .hero-img-center img{width:100%;height:100%;object-fit:cover;opacity:0.4;filter:saturate(0.6)}
  .img-overlay{position:absolute;inset:0;background:linear-gradient(180deg,transparent 30%,rgba(5,8,15,0.8))}
  .stats-strip{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;max-width:760px;margin:48px auto 0;padding:28px 32px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:20px}
  .stat-item{text-align:center}
  .stat-num{font-family:'Syne',sans-serif;font-size:36px;font-weight:800;color:#fff;line-height:1}
  .stat-lbl{font-size:13px;color:#4B5563;margin-top:5px}
  .section{max-width:1080px;margin:0 auto;padding:80px 48px}
  .section-center{text-align:center}
  .section-tag{display:inline-block;background:rgba(108,99,255,0.1);border:1px solid rgba(108,99,255,0.2);border-radius:99px;padding:5px 14px;font-size:12px;color:#A78BFA;font-weight:600;margin-bottom:14px;letter-spacing:0.3px}
  .section-title{font-family:'Syne',sans-serif;font-size:40px;font-weight:800;color:#fff;letter-spacing:-1.5px;line-height:1.1;margin-bottom:14px}
  .section-sub{font-size:16px;color:#6B7280;max-width:500px;margin:0 auto;line-height:1.7}
  .steps-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:48px}
  .step-card{background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:20px;padding:32px 28px;position:relative;overflow:hidden;transition:border-color 0.2s,transform 0.2s}
  .step-card:hover{border-color:rgba(108,99,255,0.3);transform:translateY(-4px)}
  .step-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,rgba(108,99,255,0.5),transparent)}
  .step-num{font-family:'Syne',sans-serif;font-size:48px;font-weight:800;color:rgba(108,99,255,0.15);line-height:1;margin-bottom:16px}
  .step-icon{font-size:36px;margin-bottom:16px}
  .step-title{font-family:'Syne',sans-serif;font-size:20px;font-weight:700;color:#fff;margin-bottom:10px}
  .step-desc{font-size:14px;color:#6B7280;line-height:1.65}
  .skills-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:48px}
  .skill-card{background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:16px;padding:24px;display:flex;align-items:center;gap:14px;transition:all 0.2s}
  .skill-card:hover{border-color:rgba(108,99,255,0.25);background:rgba(108,99,255,0.04);transform:translateY(-2px)}
  .skill-icon{width:48px;height:48px;border-radius:13px;display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0}
  .skill-name{font-weight:600;color:#fff;font-size:15px}
  .skill-count{font-size:12px;color:#4B5563;margin-top:3px}
  .features-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:48px}
  .feature-card{background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:20px;padding:32px 28px;transition:all 0.2s}
  .feature-card:hover{border-color:rgba(108,99,255,0.25);transform:translateY(-3px)}
  .feature-icon{font-size:36px;margin-bottom:16px}
  .feature-title{font-family:'Syne',sans-serif;font-size:18px;font-weight:700;color:#fff;margin-bottom:10px}
  .feature-desc{font-size:14px;color:#6B7280;line-height:1.65}
  .cta-section{background:linear-gradient(135deg,rgba(108,99,255,0.12),rgba(167,139,250,0.06));border:1px solid rgba(108,99,255,0.15);border-radius:24px;padding:64px 48px;text-align:center;margin:0 48px 80px;position:relative;overflow:hidden}
  .cta-section::before{content:'';position:absolute;top:-100px;left:50%;transform:translateX(-50%);width:500px;height:500px;background:radial-gradient(circle,rgba(108,99,255,0.08) 0%,transparent 65%);pointer-events:none}
  .cta-title{font-family:'Syne',sans-serif;font-size:40px;font-weight:800;color:#fff;letter-spacing:-1.5px;margin-bottom:14px}
  .cta-sub{font-size:16px;color:#6B7280;margin-bottom:32px;max-width:420px;margin-left:auto;margin-right:auto;line-height:1.65}
  .footer{border-top:1px solid rgba(255,255,255,0.06);padding:32px 48px;display:flex;align-items:center;justify-content:space-between}
  .footer-logo{display:flex;align-items:center;gap:8px}
  .footer-text{font-size:13px;color:#4B5563}
  .footer-links{display:flex;gap:20px}
  .footer-link{font-size:13px;color:#4B5563;cursor:pointer;transition:color 0.2s}
  .footer-link:hover{color:#A78BFA}
`;

const SKILLS = [
  {icon:"💻",bg:"rgba(108,99,255,0.15)",name:"Programming",count:"320+ users"},
  {icon:"🎨",bg:"rgba(167,139,250,0.15)",name:"Design & UI/UX",count:"180+ users"},
  {icon:"🎵",bg:"rgba(59,130,246,0.15)",name:"Music",count:"240+ users"},
  {icon:"🌍",bg:"rgba(13,148,136,0.15)",name:"Languages",count:"290+ users"},
  {icon:"🤖",bg:"rgba(217,119,6,0.15)",name:"AI & Machine Learning",count:"150+ users"},
  {icon:"📊",bg:"rgba(239,68,68,0.15)",name:"Business & Finance",count:"200+ users"},
];

const STEPS = [
  {icon:"👤",title:"Create Your Profile",desc:"Sign up and list the skills you can teach along with what you want to learn. It takes less than 2 minutes."},
  {icon:"🤝",title:"Get Matched Instantly",desc:"Our algorithm finds people who teach what you want to learn and want to learn what you teach. Perfect two-way matches."},
  {icon:"💬",title:"Chat & Exchange",desc:"Connect via real-time chat, set up sessions, and start exchanging skills. Learn from real people, teach what you love."},
];

const FEATURES = [
  {icon:"⚡",title:"Real-Time Matching",desc:"Smart algorithm instantly finds your ideal skill exchange partners based on what you offer and what you need."},
  {icon:"💬",title:"Live Chat",desc:"Built-in real-time messaging with Socket.IO so you can connect with your skill partners instantly."},
  {icon:"🔒",title:"Secure & Private",desc:"Your data is protected. Connections are only made with users who mutually match your skill goals."},
  {icon:"🌐",title:"Any Skill, Anywhere",desc:"From coding to cooking, guitar to graphic design — exchange any skill with people worldwide."},
  {icon:"📱",title:"Works Everywhere",desc:"Fully responsive platform that works perfectly on desktop, tablet, and mobile devices."},
  {icon:"🆓",title:"Completely Free",desc:"No subscriptions, no hidden fees. SkillXchange is free because learning should be accessible to everyone."},
];

function Home() {
  const navigate = useNavigate();
  return (
    <div className="lp">
      <style>{styles}</style>
      <nav className="nav">
        <div className="nav-logo">
          <div className="nav-logo-icon">S</div>
          <span className="nav-logo-text">SkillXchange</span>
        </div>
        <div className="nav-links">
          <button className="btn-ghost" onClick={() => navigate("/login")}>Login</button>
          <button className="btn-primary" onClick={() => navigate("/register")}>Get Started →</button>
        </div>
      </nav>

      <div className="hero">
        <div className="hero-tag"><span className="hero-dot"/>Peer-to-Peer Learning Platform</div>
        <h1 className="hero-title">Share What You Know.<br/><span>Learn What You Love.</span></h1>
        <p className="hero-sub">Connect with people who have the skills you want — and teach them what you know. Real skills, real people, zero cost.</p>
        <div className="hero-btns">
          <button className="btn-lg btn-lg-primary" onClick={() => navigate("/register")}>Start Exchanging Skills →</button>
          <button className="btn-lg btn-lg-ghost" onClick={() => navigate("/login")}>Sign In</button>
        </div>
        <div className="hero-img-grid">
          <div className="hero-img-card">
            <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80" alt=""/>
            <div className="img-overlay"/>
          </div>
          <div className="hero-img-center">
            <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80" alt=""/>
            <div className="img-overlay"/>
          </div>
          <div className="hero-img-card">
            <img src="https://images.unsplash.com/photo-1543269865-cbf427effbad?w=600&q=80" alt=""/>
            <div className="img-overlay"/>
          </div>
        </div>
        <div className="stats-strip">
          {[["2,400+","Active Users"],["180+","Skills Listed"],["94%","Match Rate"]].map(([n,l])=>(
            <div key={l} className="stat-item"><div className="stat-num">{n}</div><div className="stat-lbl">{l}</div></div>
          ))}
        </div>
      </div>

      <div className="section section-center">
        <span className="section-tag">How It Works</span>
        <h2 className="section-title">Three steps to start<br/>exchanging skills</h2>
        <p className="section-sub">No money, no subscriptions. Just people sharing knowledge with each other.</p>
        <div className="steps-grid">
          {STEPS.map((s,i)=>(
            <div key={i} className="step-card">
              <div className="step-num">0{i+1}</div>
              <div className="step-icon">{s.icon}</div>
              <div className="step-title">{s.title}</div>
              <div className="step-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="section section-center">
        <span className="section-tag">Popular Skills</span>
        <h2 className="section-title">Exchange any skill<br/>you can imagine</h2>
        <p className="section-sub">From technical to creative — find partners for any skill on the platform.</p>
        <div className="skills-grid">
          {SKILLS.map((s,i)=>(
            <div key={i} className="skill-card">
              <div className="skill-icon" style={{background:s.bg}}>{s.icon}</div>
              <div><div className="skill-name">{s.name}</div><div className="skill-count">{s.count}</div></div>
            </div>
          ))}
        </div>
      </div>

      <div className="section section-center">
        <span className="section-tag">Why SkillXchange</span>
        <h2 className="section-title">Everything you need to<br/>learn and teach</h2>
        <p className="section-sub">Built for real skill exchange — not just another learning platform.</p>
        <div className="features-grid">
          {FEATURES.map((f,i)=>(
            <div key={i} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="cta-section">
        <h2 className="cta-title">Ready to start exchanging?</h2>
        <p className="cta-sub">Join thousands of learners already exchanging skills. It's free, always.</p>
        <button className="btn-lg btn-lg-primary" onClick={() => navigate("/register")}>Create Free Account →</button>
      </div>

      <footer className="footer">
        <div className="footer-logo">
          <div className="nav-logo-icon">S</div>
          <span style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:16,color:"#fff"}}>SkillXchange</span>
        </div>
        <span className="footer-text">© 2026 SkillXchange. All rights reserved.</span>
        <div className="footer-links">
          <span className="footer-link" onClick={() => navigate("/login")}>Login</span>
          <span className="footer-link" onClick={() => navigate("/register")}>Register</span>
        </div>
      </footer>
    </div>
  );
}

export default Home;
