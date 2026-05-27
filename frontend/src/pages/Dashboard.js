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

function AiChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi! I'm your SkillXchange AI assistant" }
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
      setMessages(p => [...p, { role: "bot", text: "Backend not reachable" }]);
    }
    setLoading(false);
  };

  return (
    <>
      {open && (
        <div className="ai-panel">
          <div className="ai-head">
            <div className="ai-head-icon">🤖</div>
            <div className="ai-head-title">SkillXchange AI</div>
          </div>
          <div className="ai-messages">
            {messages.map((m,i)=>(
              <div key={i} className={m.role==="user"?"ai-msg-user":"ai-msg-bot"}>{m.text}</div>
            ))}
            {loading && <div className="ai-msg-typing">thinking...</div>}
            <div ref={bottomRef}/>
          </div>
          <div className="ai-input-row">
            <input className="ai-input" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}/>
            <button className="ai-send" onClick={send}>Send</button>
          </div>
        </div>
      )}
      <button className="ai-fab" onClick={()=>setOpen(o=>!o)}>{open?"✕":"🤖"}</button>
    </>
  );
}

export default function Dashboard() {
  const [skillsOffered,setSkillsOffered]=useState("");
  const [skillsWanted,setSkillsWanted]=useState("");
  const [matches,setMatches]=useState([]);
  const [requests,setRequests]=useState([]);
  const [unreadCount,setUnreadCount]=useState(0);
  const [search,setSearch]=useState("");
  const [activeCat,setActiveCat]=useState("All");

  const userId = localStorage.getItem("userId");

  useEffect(()=>{
    if(!userId) return;
    socket.emit("join",userId);
  },[userId]);

  const fetchMatches = useCallback(async()=>{
    try{const r=await axios.get(`${API}/api/users/match/${userId}`);setMatches(r.data);}catch{}
  },[userId]);

  const fetchRequests = useCallback(async()=>{
    try{const r=await axios.get(`${API}/api/requests/received/${userId}`);setRequests(r.data);}catch{}
  },[userId]);

  useEffect(()=>{
    if(!userId) return;
    fetchMatches();
    fetchRequests();
  },[userId,fetchMatches,fetchRequests]);

  const filtered = matches.filter(u=>{
    const q = search.toLowerCase();
    const ms = !q ||
      u.name.toLowerCase().includes(q) ||
      u.skillsOffered.some(s=>s.toLowerCase().includes(q)) ||
      u.skillsWanted.some(s=>s.toLowerCase().includes(q));

    const mc = activeCat==="All" ||
      (catMap[activeCat]||[]).some(k =>
        [...u.skillsOffered,...u.skillsWanted]
          .some(s=>s.toLowerCase().includes(k))
      );

    return ms && mc;
  });

  const stClass = s => s==="accepted"?"st-a":s==="rejected"?"st-r":"st-p";

  const updateReq = async(id,status)=>{
    try{await axios.put(`${API}/api/requests/update/${id}`,{status});fetchRequests();}catch{}
  };

  return (
    <div className="d-root">
      <nav className="nav">
        <div className="nav-logo">
          <div className="nav-logo-icon">S</div>
          SkillXchange
        </div>

        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={e=>setSearch(e.target.value)}
          className="nav-search"
        />

        <div className="nav-right">
          <button onClick={()=>window.location.href="/chat"} className="nav-btn">Chat</button>
          <button onClick={()=>{localStorage.clear();window.location.href="/";}} className="nav-btn">Logout</button>
        </div>
      </nav>

      <div className="section">
        <h2>Skill Matches ({filtered.length})</h2>

        {filtered.map(u=>(
          <div key={u._id} className="m-card">
            <div>{u.name}</div>
            <button onClick={()=>alert("Send request")}>Connect</button>
          </div>
        ))}
      </div>

      <div className="section">
        <h2>Inbox</h2>

        {requests
          .filter(r=>r.sender?.name?.toLowerCase().includes(search.toLowerCase()))
          .map(req=>(
          <div key={req._id} className="i-card">
            <div>{req.sender.name}</div>
            <div>{req.skill}</div>
            <button onClick={()=>updateReq(req._id,"accepted")}>Accept</button>
            <button onClick={()=>updateReq(req._id,"rejected")}>Reject</button>
          </div>
        ))}
      </div>

      <AiChat/>
    </div>
  );
}
