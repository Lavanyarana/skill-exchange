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
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  body{background:#F0F2FA}
  .d-root{min-height:100vh;background:#F0F2FA;font-family:'DM Sans',sans-serif;color:#111827;overflow-x:hidden}
  .nav{position:sticky;top:0;z-index:200;background:rgba(255,255,255,0.95);backdrop-filter:blur(28px);border-bottom:1px solid rgba(0,0,0,0.08);height:66px;padding:0 32px;display:flex;align-items:center;gap:16px;box-shadow:0 1px 12px rgba(0,0,0,0.06)}
  .nav-logo{display:flex;align-items:center;gap:10px;flex-shrink:0}
  .nav-logo-icon{width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,#6C63FF,#A78BFA);display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Syne',sans-serif;font-weight:800;font-size:17px}
  .nav-logo-text{font-family:'Syne',sans-serif;font-weight:700;font-size:18px;color:#111827}
  .nav-search-wrap{flex:1;max-width:460px;position:relative;margin:0 20px}
  .nav-search{width:100%;padding:9px 14px 9px 40px;background:#F3F4F6;border:1px solid #E5E7EB;border-radius:10px;color:#111827;font-size:14px;outline:none;transition:all 0.2s}
  .nav-search:focus{border-color:rgba(108,99,255,0.5);background:#fff}
  .nav-search::placeholder{color:#9CA3AF}
  .nav-search-ico{position:absolute;left:13px;top:50%;transform:translateY(-50%);font-size:15px;pointer-events:none}
  .nav-right{display:flex;align-items:center;gap:8px;margin-left:auto}
  .nav-btn{padding:7px 16px;border-radius:8px;font-size:13px;font-weight:500;cursor:pointer;transition:all 0.18s;border:1px solid #E5E7EB;background:#fff;color:#374151;font-family:'DM Sans',sans-serif}
  .nav-btn:hover{color:#111827;background:#F3F4F6;border-color:#D1D5DB}
  .nav-btn-chat{background:#6C63FF;border-color:#6C63FF;color:#fff;position:relative}
  .nav-btn-chat:hover{background:#5B53EE}
  .nav-btn-out{border-color:rgba(239,68,68,0.25);color:#EF4444;background:#fff}
  .nav-btn-out:hover{background:#FEF2F2}
  .badge{position:absolute;top:-5px;right:-5px;background:#EF4444;color:#fff;font-size:10px;font-weight:700;border-radius:99px;padding:1px 5px;min-width:17px;text-align:center}
  .hero-banner{position:relative;overflow:hidden;background:#E8EAF6;border-bottom:1px solid rgba(0,0,0,0.06);padding:0}
  .hero-img-strip{display:grid;grid-template-columns:1fr 2fr 1fr;height:280px;gap:2px}
  .hero-img-side{overflow:hidden;position:relative}
  .hero-img-side img{width:100%;height:100%;object-fit:cover;opacity:0.45;filter:saturate(0.7)}
  .hero-img-center{overflow:hidden;position:relative;display:flex;align-items:center;justify-content:center}
  .hero-img-center img{width:100%;height:100%;object-fit:cover;opacity:0.3;filter:saturate(0.6)}
  .hero-overlay{position:absolute;inset:0;background:linear-gradient(135deg,rgba(108,99,255,0.10),rgba(167,139,250,0.06));display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:24px}
  .hero-tag{display:inline-flex;align-items:center;gap:7px;background:rgba(108,99,255,0.10);border:1px solid rgba(108,99,255,0.22);border-radius:99px;padding:5px 14px;font-size:12px;color:#6C63FF;font-weight:600;margin-bottom:16px}
  .hero-dot{width:6px;height:6px;border-radius:99px;background:#6C63FF;animation:blink 2s infinite;display:inline-block}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}
  .hero-title{font-family:'Syne',sans-serif;font-size:42px;font-weight:800;color:#111827;letter-spacing:-2px;line-height:1.1;margin-bottom:12px;text-shadow:0 1px 8px rgba(255,255,255,0.6)}
  .hero-title span{background:linear-gradient(135deg,#6C63FF,#A78BFA);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
  .hero-sub{color:#4B5563;font-size:15px;line-height:1.7;max-width:480px}
  .stats{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;max-width:1280px;margin:32px auto 0;padding:0 40px}
  .stat{background:#fff;border:1px solid #E5E7EB;border-radius:16px;padding:22px 24px;position:relative;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.04)}
  .stat::after{content:'';position:absolute;inset:0 0 auto 0;height:3px;background:linear-gradient(90deg,#6C63FF,#A78BFA)}
  .stat-label{font-size:11px;font-weight:600;color:#9CA3AF;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px}
  .stat-val{font-family:'Syne',sans-serif;font-size:36px;font-weight:800;color:#111827;line-height:1;margin-bottom:6px}
  .hint-g{font-size:12px;color:#16A34A}
  .hint-y{font-size:12px;color:#D97706}
  .hint-b{font-size:12px;color:#2563EB}
  .section{max-width:1280px;margin:40px auto 0;padding:0 40px}
  .section-head{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:20px}
  .section-title{font-family:'Syne',sans-serif;font-size:22px;font-weight:700;color:#111827;letter-spacing:-0.4px}
  .section-sub{font-size:13px;color:#6B7280;margin-top:3px}
  .found-count{font-size:13px;color:#9CA3AF;align-self:center}
  .skills-box{background:#fff;border:1px solid #E5E7EB;border-radius:20px;padding:28px;box-shadow:0 2px 8px rgba(0,0,0,0.04)}
  .inputs-row{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:20px}
  .f-label{font-size:10px;font-weight:700;color:#9CA3AF;text-transform:uppercase;letter-spacing:1px;display:block;margin-bottom:7px}
  .s-inp{width:100%;padding:12px 16px;background:#F9FAFB;border:1px solid #E5E7EB;border-radius:10px;color:#111827;font-family:'DM Sans',sans-serif;font-size:14px;outline:none;transition:all 0.2s}
  .s-inp:focus{border-color:rgba(108,99,255,0.45);background:#fff}
  .s-inp::placeholder{color:#9CA3AF}
  .save-btn{padding:11px 26px;background:linear-gradient(135deg,#6C63FF,#A78BFA);border:none;border-radius:10px;color:#fff;font-family:'DM Sans',sans-serif;font-weight:600;font-size:14px;cursor:pointer;transition:opacity 0.2s}
  .save-btn:hover{opacity:0.85}
  .alert-ok{background:#F0FDF4;border:1px solid #BBF7D0;border-radius:8px;padding:9px 13px;color:#16A34A;font-size:13px;margin-bottom:14px}
  .alert-err{background:#FEF2F2;border:1px solid #FECACA;border-radius:8px;padding:9px 13px;color:#EF4444;font-size:13px;margin-bottom:14px}
  .filter-row{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:22px}
  .f-tab{padding:6px 16px;border-radius:99px;font-size:13px;font-weight:500;cursor:pointer;border:1px solid #E5E7EB;background:#fff;color:#6B7280;font-family:'DM Sans',sans-serif;transition:all 0.18s}
  .f-tab:hover{color:#374151;border-color:#D1D5DB;background:#F9FAFB}
  .f-tab.on{background:rgba(108,99,255,0.08);border-color:rgba(108,99,255,0.3);color:#6C63FF}
  .cards-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:16px}
  .m-card{background:#fff;border:1px solid #E5E7EB;border-radius:18px;overflow:hidden;transition:border-color 0.2s,transform 0.2s,box-shadow 0.2s;box-shadow:0 2px 8px rgba(0,0,0,0.04)}
  .m-card:hover{border-color:rgba(108,99,255,0.3);transform:translateY(-3px);box-shadow:0 8px 24px rgba(108,99,255,0.10)}
  .m-card-img{width:100%;height:120px;object-fit:cover;opacity:0.75;filter:saturate(0.8)}
  .m-card-top{padding:16px 20px 0}
  .m-av-row{display:flex;align-items:center;gap:12px;margin-bottom:14px}
  .m-av{width:50px;height:50px;border-radius:14px;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Syne',sans-serif;font-weight:800;font-size:20px;flex-shrink:0}
  .c-p{background:linear-gradient(135deg,#6C63FF,#A78BFA)}
  .c-b{background:linear-gradient(135deg,#3B82F6,#60A5FA)}
  .c-t{background:linear-gradient(135deg,#0D9488,#2DD4BF)}
  .c-r{background:linear-gradient(135deg,#E11D48,#FB7185)}
  .c-a{background:linear-gradient(135deg,#D97706,#FCD34D)}
  .m-name{font-weight:600;color:#111827;font-size:15px}
  .m-email{font-size:12px;color:#9CA3AF;margin-top:2px}
  .m-div{height:1px;background:#F3F4F6;margin:14px 20px}
  .m-skills{padding:0 20px}
  .m-sk-label{font-size:10px;font-weight:700;color:#9CA3AF;text-transform:uppercase;letter-spacing:0.9px;margin-bottom:7px}
  .tags{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px}
  .tag{font-size:12px;font-weight:500;padding:4px 11px;border-radius:99px}
  .tg-teach{background:#EDE9FE;color:#6C63FF;border:1px solid #DDD6FE}
  .tg-learn{background:#EFF6FF;color:#3B82F6;border:1px solid #BFDBFE}
  .m-btn{display:block;width:100%;padding:12px;background:linear-gradient(135deg,#6C63FF,#8B5CF6);border:none;color:#fff;font-family:'DM Sans',sans-serif;font-weight:600;font-size:13px;cursor:pointer;transition:opacity 0.2s}
  .m-btn:hover{opacity:0.85}
  .empty{background:#fff;border:1px solid #E5E7EB;border-radius:18px;padding:64px 24px;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,0.04)}
  .e-icon{font-size:44px;margin-bottom:14px}
  .e-title{font-family:'Syne',sans-serif;font-weight:700;color:#111827;font-size:16px;margin-bottom:5px}
  .e-sub{color:#9CA3AF;font-size:13px}
  .inbox-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:16px}
  .i-card{background:#fff;border:1px solid #E5E7EB;border-radius:18px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,0.04)}
  .i-name{font-weight:600;color:#111827;font-size:15px}
  .i-email{font-size:12px;color:#9CA3AF;margin-top:2px;margin-bottom:10px}
  .i-skill{font-size:13px;color:#6B7280;margin-bottom:12px}
  .i-skill b{color:#6C63FF}
  .st-badge{display:inline-block;font-size:11px;font-weight:600;padding:3px 11px;border-radius:99px}
  .st-p{background:#FEF9C3;color:#A16207;border:1px solid #FDE68A}
  .st-a{background:#F0FDF4;color:#16A34A;border:1px solid #BBF7D0}
  .st-r{background:#FEF2F2;color:#DC2626;border:1px solid #FECACA}
  .act-row{display:flex;gap:8px;margin-top:14px}
  .btn-a{flex:1;padding:8px;border-radius:8px;background:#F0FDF4;border:1px solid #BBF7D0;color:#16A34A;font-size:13px;font-weight:600;cursor:pointer;font-family:'DM Sans',sans-serif}
  .btn-a:hover{background:#DCFCE7}
  .btn-r{flex:1;padding:8px;border-radius:8px;background:#FEF2F2;border:1px solid #FECACA;color:#EF4444;font-size:13px;font-weight:600;cursor:pointer;font-family:'DM Sans',sans-serif}
  .btn-r:hover{background:#FEE2E2}
  .danger-zone{max-width:1280px;margin:48px auto 60px;padding:0 40px}
  .d-box{background:#FEF2F2;border:1px solid #FECACA;border-radius:16px;padding:24px 28px;display:flex;align-items:center;justify-content:space-between;gap:20px}
  .d-title{font-family:'Syne',sans-serif;font-weight:700;color:#DC2626;font-size:15px;margin-bottom:4px}
  .d-sub{font-size:13px;color:#6B7280}
  .d-btn{padding:10px 22px;border-radius:9px;background:#fff;border:1px solid #FECACA;color:#EF4444;font-family:'DM Sans',sans-serif;font-weight:600;font-size:14px;cursor:pointer;transition:all 0.2s;white-space:nowrap;flex-shrink:0}
  .d-btn:hover{background:#FEF2F2;border-color:#EF4444}
  .overlay{position:fixed;inset:0;background:rgba(0,0,0,0.4);backdrop-filter:blur(8px);z-index:999;display:flex;align-items:center;justify-content:center}
  .modal{background:#fff;border:1px solid #FECACA;border-radius:20px;padding:36px 32px;width:100%;max-width:420px;box-shadow:0 20px 60px rgba(0,0,0,0.15)}
  .modal-icon{font-size:36px;margin-bottom:16px}
  .modal-title{font-family:'Syne',sans-serif;font-size:22px;font-weight:800;color:#111827;margin-bottom:8px}
  .modal-sub{font-size:14px;color:#6B7280;line-height:1.65;margin-bottom:28px}
  .modal-btns{display:flex;gap:10px}
  .m-cancel{flex:1;padding:11px;border-radius:9px;background:#F3F4F6;border:1px solid #E5E7EB;color:#374151;font-family:'DM Sans',sans-serif;font-weight:600;font-size:14px;cursor:pointer}
  .m-cancel:hover{background:#E5E7EB}
  .m-del{flex:1;padding:11px;border-radius:9px;background:#EF4444;border:none;color:#fff;font-family:'DM Sans',sans-serif;font-weight:600;font-size:14px;cursor:pointer}
  .m-del:hover{opacity:0.85}
  .ai-fab{position:fixed;bottom:28px;right:28px;z-index:500;width:56px;height:56px;border-radius:99px;background:linear-gradient(135deg,#6C63FF,#A78BFA);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:24px;box-shadow:0 4px 24px rgba(108,99,255,0.35);transition:transform 0.2s}
  .ai-fab:hover{transform:scale(1.1)}
  .ai-panel{position:fixed;bottom:96px;right:28px;z-index:500;width:360px;background:#fff;border:1px solid #E5E7EB;border-radius:20px;box-shadow:0 8px 40px rgba(0,0,0,0.12);display:flex;flex-direction:column;overflow:hidden;max-height:500px}
  .ai-head{padding:16px 18px;border-bottom:1px solid #F3F4F6;display:flex;align-items:center;gap:10px}
  .ai-head-icon{width:32px;height:32px;border-radius:99px;background:linear-gradient(135deg,#6C63FF,#A78BFA);display:flex;align-items:center;justify-content:center;font-size:15px}
  .ai-head-title{font-family:'Syne',sans-serif;font-weight:700;color:#111827;font-size:14px}
  .ai-head-sub{font-size:11px;color:#16A34A;margin-top:1px}
  .ai-messages{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px;min-height:200px;background:#F9FAFB}
  .ai-msg-user{align-self:flex-end;background:#6C63FF;border-radius:14px 14px 4px 14px;padding:9px 13px;font-size:13px;color:#fff;max-width:85%}
  .ai-msg-bot{align-self:flex-start;background:#fff;border:1px solid #E5E7EB;border-radius:4px 14px 14px 14px;padding:9px 13px;font-size:13px;color:#374151;max-width:85%;line-height:1.5}
  .ai-msg-typing{align-self:flex-start;background:#fff;border:1px solid #E5E7EB;border-radius:4px 14px 14px 14px;padding:9px 13px;color:#9CA3AF;font-size:13px}
  .ai-input-row{padding:12px 14px;border-top:1px solid #F3F4F6;display:flex;gap:8px;background:#fff}
  .ai-input{flex:1;padding:9px 13px;background:#F3F4F6;border:1px solid #E5E7EB;border-radius:10px;color:#111827;font-size:13px;font-family:'DM Sans',sans-serif;outline:none}
  .ai-input:focus{border-color:rgba(108,99,255,0.4);background:#fff}
  .ai-input::placeholder{color:#9CA3AF}
  .ai-send{padding:9px 14px;background:linear-gradient(135deg,#6C63FF,#A78BFA);border:none;border-radius:10px;color:#fff;font-size:13px;cursor:pointer;font-weight:600;font-family:'DM Sans',sans-serif}
  .ai-send:disabled{opacity:0.5;cursor:not-allowed}
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
