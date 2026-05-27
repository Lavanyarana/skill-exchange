import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  return (
    <div style={{minHeight:"100vh",background:"#fff",fontFamily:"'Segoe UI',system-ui,sans-serif",color:"#1e293b"}}>

      {/* NAV */}
      <nav style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"0 48px",height:66,borderBottom:"1px solid #f1f5f9",background:"#fff",position:"sticky",top:0,zIndex:100,boxShadow:"0 1px 8px rgba(0,0,0,0.06)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:36,height:36,borderRadius:10,background:"linear-gradient(135deg,#6C63FF,#A78BFA)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:17}}>S</div>
          <span style={{fontWeight:800,fontSize:20,color:"#1e293b"}}>Skill<span style={{color:"#6C63FF"}}>Xchange</span></span>
        </div>
        <div style={{display:"flex",gap:10}}>
          <button onClick={()=>navigate("/login")} style={{padding:"9px 22px",borderRadius:8,border:"1.5px solid #e2e8f0",background:"#fff",color:"#374151",fontWeight:600,fontSize:14,cursor:"pointer"}}>Login</button>
          <button onClick={()=>navigate("/register")} style={{padding:"9px 22px",borderRadius:8,border:"none",background:"linear-gradient(135deg,#6C63FF,#A78BFA)",color:"#fff",fontWeight:600,fontSize:14,cursor:"pointer"}}>Get Started →</button>
        </div>
      </nav>

      {/* HERO */}
      <div style={{textAlign:"center",padding:"80px 48px 60px",background:"linear-gradient(180deg,#fafbff 0%,#fff 100%)"}}>
        <div style={{display:"inline-flex",alignItems:"center",gap:7,background:"rgba(108,99,255,0.08)",border:"1px solid rgba(108,99,255,0.2)",borderRadius:99,padding:"6px 16px",marginBottom:24}}>
          <span style={{width:7,height:7,borderRadius:99,background:"#6C63FF",display:"inline-block"}}></span>
          <span style={{fontSize:13,color:"#6C63FF",fontWeight:600}}>Peer-to-Peer Learning Platform</span>
        </div>
        <h1 style={{fontSize:58,fontWeight:900,color:"#0f172a",letterSpacing:-2,lineHeight:1.08,marginBottom:20,maxWidth:720,margin:"0 auto 20px"}}>
          Share What You Know.<br/>
          <span style={{background:"linear-gradient(135deg,#6C63FF,#A78BFA)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Learn What You Love.</span>
        </h1>
        <p style={{fontSize:18,color:"#64748b",maxWidth:500,margin:"0 auto 36px",lineHeight:1.7}}>
          Connect with people who have the skills you want — and teach them what you know. Real skills, real people, zero cost.
        </p>
        <div style={{display:"flex",gap:12,justifyContent:"center",marginBottom:60}}>
          <button onClick={()=>navigate("/register")} style={{padding:"14px 32px",borderRadius:12,border:"none",background:"linear-gradient(135deg,#6C63FF,#A78BFA)",color:"#fff",fontWeight:700,fontSize:16,cursor:"pointer",boxShadow:"0 4px 20px rgba(108,99,255,0.35)"}}>Start Exchanging Skills →</button>
          <button onClick={()=>navigate("/login")} style={{padding:"14px 32px",borderRadius:12,border:"1.5px solid #e2e8f0",background:"#fff",color:"#374151",fontWeight:600,fontSize:16,cursor:"pointer"}}>Sign In</button>
        </div>

        {/* PHOTOS */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1.5fr 1fr",gap:14,maxWidth:860,margin:"0 auto 48px",height:200}}>
          {["https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80",
            "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80",
            "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=600&q=80"].map((src,i)=>(
            <div key={i} style={{borderRadius:16,overflow:"hidden",boxShadow:"0 4px 20px rgba(0,0,0,0.1)"}}>
              <img src={src} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
            </div>
          ))}
        </div>

        {/* STATS */}
        <div style={{display:"inline-grid",gridTemplateColumns:"repeat(3,1fr)",gap:0,background:"#f8faff",border:"1px solid #e2e8f0",borderRadius:16,overflow:"hidden",maxWidth:600,width:"100%"}}>
          {[["🆓","Free","Always"],["🤝","2-Way","Matching"],["💬","Live","Chat"]].map(([icon,n,l],i)=>(
            <div key={i} style={{padding:"24px 32px",textAlign:"center",borderRight:i<2?"1px solid #e2e8f0":"none"}}>
              <div style={{fontSize:28,marginBottom:6}}>{icon}</div>
              <div style={{fontWeight:800,fontSize:22,color:"#0f172a"}}>{n}</div>
              <div style={{fontSize:13,color:"#94a3b8",marginTop:3}}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div style={{background:"#f8faff",padding:"80px 48px"}}>
        <div style={{maxWidth:1000,margin:"0 auto",textAlign:"center"}}>
          <span style={{display:"inline-block",background:"rgba(108,99,255,0.1)",border:"1px solid rgba(108,99,255,0.2)",borderRadius:99,padding:"5px 14px",fontSize:12,color:"#6C63FF",fontWeight:600,marginBottom:14}}>How It Works</span>
          <h2 style={{fontSize:40,fontWeight:900,color:"#0f172a",letterSpacing:-1.5,marginBottom:14}}>Three steps to start<br/>exchanging skills</h2>
          <p style={{fontSize:16,color:"#64748b",marginBottom:48}}>No money, no subscriptions. Just people sharing knowledge with each other.</p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:24}}>
            {[{icon:"👤",n:"01",title:"Create Your Profile",desc:"Sign up and list the skills you can teach along with what you want to learn. Takes less than 2 minutes."},
              {icon:"🤝",n:"02",title:"Get Matched Instantly",desc:"Our algorithm finds people who teach what you want to learn and want to learn what you teach."},
              {icon:"💬",n:"03",title:"Chat & Exchange",desc:"Connect via real-time chat and start exchanging skills. Learn from real people, teach what you love."}
            ].map((s,i)=>(
              <div key={i} style={{background:"#fff",borderRadius:20,padding:"36px 28px",border:"1px solid #e2e8f0",boxShadow:"0 2px 12px rgba(0,0,0,0.04)",textAlign:"left"}}>
                <div style={{fontFamily:"serif",fontSize:52,fontWeight:900,color:"rgba(108,99,255,0.15)",lineHeight:1,marginBottom:16}}>{s.n}</div>
                <div style={{fontSize:40,marginBottom:16}}>{s.icon}</div>
                <div style={{fontSize:19,fontWeight:700,color:"#0f172a",marginBottom:10}}>{s.title}</div>
                <div style={{fontSize:14,color:"#64748b",lineHeight:1.7}}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SKILLS */}
      <div style={{padding:"80px 48px"}}>
        <div style={{maxWidth:1000,margin:"0 auto",textAlign:"center"}}>
          <span style={{display:"inline-block",background:"rgba(108,99,255,0.1)",border:"1px solid rgba(108,99,255,0.2)",borderRadius:99,padding:"5px 14px",fontSize:12,color:"#6C63FF",fontWeight:600,marginBottom:14}}>Popular Skills</span>
          <h2 style={{fontSize:40,fontWeight:900,color:"#0f172a",letterSpacing:-1.5,marginBottom:14}}>Exchange any skill<br/>you can imagine</h2>
          <p style={{fontSize:16,color:"#64748b",marginBottom:48}}>From technical to creative — find partners for any skill.</p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}}>
            {[{icon:"💻",bg:"#eff6ff",c:"#1d4ed8",name:"Programming",count:"320+ users"},
              {icon:"🎨",bg:"#faf5ff",c:"#7c3aed",name:"Design & UI/UX",count:"180+ users"},
              {icon:"🎵",bg:"#eff6ff",c:"#0891b2",name:"Music",count:"240+ users"},
              {icon:"🌍",bg:"#f0fdf4",c:"#15803d",name:"Languages",count:"290+ users"},
              {icon:"🤖",bg:"#fffbeb",c:"#d97706",name:"AI & Machine Learning",count:"150+ users"},
              {icon:"📊",bg:"#fef2f2",c:"#dc2626",name:"Business & Finance",count:"200+ users"},
            ].map((s,i)=>(
              <div key={i} style={{background:"#fff",borderRadius:16,padding:"22px 20px",border:"1px solid #e2e8f0",display:"flex",alignItems:"center",gap:14,boxShadow:"0 2px 8px rgba(0,0,0,0.04)",transition:"transform 0.2s"}}
                onMouseEnter={e=>e.currentTarget.style.transform="translateY(-3px)"}
                onMouseLeave={e=>e.currentTarget.style.transform="none"}>
                <div style={{width:50,height:50,borderRadius:13,background:s.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0}}>{s.icon}</div>
                <div><div style={{fontWeight:700,color:"#0f172a",fontSize:15}}>{s.name}</div><div style={{fontSize:12,color:"#94a3b8",marginTop:3}}>{s.count}</div></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <div style={{background:"#f8faff",padding:"80px 48px"}}>
        <div style={{maxWidth:1000,margin:"0 auto",textAlign:"center"}}>
          <span style={{display:"inline-block",background:"rgba(108,99,255,0.1)",border:"1px solid rgba(108,99,255,0.2)",borderRadius:99,padding:"5px 14px",fontSize:12,color:"#6C63FF",fontWeight:600,marginBottom:14}}>Why SkillXchange</span>
          <h2 style={{fontSize:40,fontWeight:900,color:"#0f172a",letterSpacing:-1.5,marginBottom:14}}>Everything you need to<br/>learn and teach</h2>
          <p style={{fontSize:16,color:"#64748b",marginBottom:48}}>Built for real skill exchange — not just another learning platform.</p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20}}>
            {[{icon:"⚡",title:"Real-Time Matching",desc:"Smart algorithm instantly finds your ideal skill exchange partners."},
              {icon:"💬",title:"Live Chat",desc:"Built-in real-time messaging so you can connect with skill partners instantly."},
              {icon:"🔒",title:"Secure & Private",desc:"Your data is protected. Connections only made with mutual matches."},
              {icon:"🌐",title:"Any Skill, Anywhere",desc:"From coding to cooking, guitar to graphic design — exchange any skill."},
              {icon:"📱",title:"Works Everywhere",desc:"Fully responsive on desktop, tablet, and mobile devices."},
              {icon:"🆓",title:"Completely Free",desc:"No subscriptions, no hidden fees. Learning should be accessible to everyone."},
            ].map((f,i)=>(
              <div key={i} style={{background:"#fff",borderRadius:20,padding:"28px",border:"1px solid #e2e8f0",textAlign:"left",boxShadow:"0 2px 8px rgba(0,0,0,0.04)"}}>
                <div style={{fontSize:36,marginBottom:14}}>{f.icon}</div>
                <div style={{fontSize:17,fontWeight:700,color:"#0f172a",marginBottom:8}}>{f.title}</div>
                <div style={{fontSize:14,color:"#64748b",lineHeight:1.65}}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{padding:"80px 48px",textAlign:"center",background:"linear-gradient(135deg,#f5f3ff,#eff6ff)"}}>
        <h2 style={{fontSize:42,fontWeight:900,color:"#0f172a",letterSpacing:-1.5,marginBottom:14}}>Ready to start exchanging?</h2>
        <p style={{fontSize:17,color:"#64748b",marginBottom:32,maxWidth:420,margin:"0 auto 32px",lineHeight:1.65}}>Join learners already exchanging skills. It's free, always.</p>
        <button onClick={()=>navigate("/register")} style={{padding:"15px 36px",borderRadius:12,border:"none",background:"linear-gradient(135deg,#6C63FF,#A78BFA)",color:"#fff",fontWeight:700,fontSize:17,cursor:"pointer",boxShadow:"0 4px 20px rgba(108,99,255,0.35)"}}>Create Free Account →</button>
      </div>

      {/* FOOTER */}
      <footer style={{borderTop:"1px solid #f1f5f9",padding:"28px 48px",display:"flex",alignItems:"center",justifyContent:"space-between",background:"#fff"}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:30,height:30,borderRadius:8,background:"linear-gradient(135deg,#6C63FF,#A78BFA)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:14}}>S</div>
          <span style={{fontWeight:700,fontSize:15,color:"#1e293b"}}>SkillXchange</span>
        </div>
        <span style={{fontSize:13,color:"#94a3b8"}}>© 2026 SkillXchange. All rights reserved.</span>
        <div style={{display:"flex",gap:20}}>
          <span onClick={()=>navigate("/login")} style={{fontSize:13,color:"#94a3b8",cursor:"pointer"}}>Login</span>
          <span onClick={()=>navigate("/register")} style={{fontSize:13,color:"#94a3b8",cursor:"pointer"}}>Register</span>
        </div>
      </footer>
    </div>
  );
}

export default Home;
