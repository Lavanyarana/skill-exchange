import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";



const socket = io("https://skillchat.duckdns.org", { transports: ["websocket", "polling"] });

function Chat() {
  const [users, setUsers] = useState([]);
const [search, setSearch] = useState("");
  const [receiver, setReceiver] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => { socket.emit("join", userId); }, [userId]);

  useEffect(() => {
    const handleMessage = (data) => {
      setMessages((prev) => [...prev, { ...data, sender: { _id: data.sender, name: "User" }, createdAt: new Date() }]);
    };
    socket.on("receiveMessage", handleMessage);
    return () => socket.off("receiveMessage", handleMessage);
  }, [search]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  useEffect(() => {
  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        `https://skillchat.duckdns.org/api/users?search=${search}`
      );

      setUsers(res.data.filter((u) => u._id !== userId));
    } catch {
      alert("Error fetching users");
    }
  };

  fetchUsers();
}, [search, userId]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!receiver) return;
      try {
        const res = await axios.get(`https://skillchat.duckdns.org/api/messages/${userId}/${receiver._id}`);
        setMessages(res.data);
        await axios.put(`https://skillchat.duckdns.org/api/messages/seen/${receiver._id}/${userId}`);
      } catch { alert("Error fetching messages"); }
    };
    fetchMessages();
  }, [receiver, userId]);

  const sendMessage = async () => {
    if (!text.trim() || !receiver) return;
    try {
      socket.emit("sendMessage", { sender: userId, receiver: receiver._id, text });
      await axios.post("https://skillchat.duckdns.org/api/messages/send", { sender: userId, receiver: receiver._id, text });
      setText("");
      const res = await axios.get(`https://skillchat.duckdns.org/api/messages/${userId}/${receiver._id}`);
      setMessages(res.data);
    } catch { alert("Error sending message"); }
  };

  const formatTime = (date) => new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Segoe UI', Arial, sans-serif", background: "#f4f6f9" }}>

      {/* SIDEBAR */}
      <div style={{ width: 300, background: "#fff", borderRight: "2px solid #e8edf2", display: "flex", flexDirection: "column", boxShadow: "2px 0 8px rgba(0,0,0,0.04)" }}>
        {/* Sidebar Header */}
        <div style={{ padding: "18px 20px", borderBottom: "1.5px solid #e8edf2", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #1a73e8, #0d47a1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 16 }}>S</div>
          <span style={{ fontWeight: 800, fontSize: 18, color: "#1a1a2e" }}>Skill<span style={{ color: "#1a73e8" }}>Xchange</span></span>
        </div>
        <div style={{ padding: "14px 20px 8px", borderBottom: "1px solid #f3f4f6" }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 1.2, margin: 0 }}>Direct Messages</p>
        </div>

        {/* User List */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {users.length === 0 && <p style={{ padding: "20px", color: "#9ca3af", fontSize: 14, textAlign: "center" }}>No users found</p>}
         <input
  type="text"
  placeholder="Search users..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  className="w-full p-3 rounded-xl border mb-4"
/>
 {users.map((user) => (
            <div key={user._id} onClick={() => setReceiver(user)}
              style={{ padding: "14px 20px", display: "flex", alignItems: "center", gap: 14, cursor: "pointer", background: receiver?._id === user._id ? "#e8f0fe" : "transparent", borderLeft: receiver?._id === user._id ? "3px solid #1a73e8" : "3px solid transparent", transition: "all 0.15s" }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: "linear-gradient(135deg, #1a73e8, #0d47a1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 18, flexShrink: 0 }}>{user.name[0]}</div>
              <div>
                <p style={{ fontWeight: 600, color: "#1a1a2e", fontSize: 14, margin: 0 }}>{user.name}</p>
                <p style={{ fontSize: 12, color: "#9ca3af", margin: "2px 0 0" }}>Click to chat</p>
              </div>
            </div>
          ))}
        </div>

        {/* Back button */}
        <div style={{ padding: 14, borderTop: "1.5px solid #e8edf2" }}>
          <button onClick={() => navigate("/dashboard")}
            style={{ width: "100%", padding: "10px", borderRadius: 8, background: "#f4f6f9", border: "1.5px solid #e8edf2", color: "#374151", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
            ← Back to Dashboard
          </button>
        </div>
      </div>

      {/* MAIN CHAT AREA */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {receiver ? (
          <>
            {/* Chat Header */}
            <div style={{ background: "#fff", padding: "14px 28px", borderBottom: "2px solid #e8edf2", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg, #1a73e8, #0d47a1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 20 }}>{receiver.name[0]}</div>
                <div>
                  <p style={{ fontWeight: 700, color: "#1a1a2e", margin: 0, fontSize: 16 }}>{receiver.name}</p>
                  <p style={{ fontSize: 12, margin: "2px 0 0", display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ width: 7, height: 7, borderRadius: 99, background: "#10b981", display: "inline-block" }}></span>
                    <span style={{ color: "#10b981", fontWeight: 500 }}>Online</span>
                  </p>
                </div>
              </div>
              <button onClick={() => setReceiver(null)} style={{ background: "#f4f6f9", border: "1.5px solid #e8edf2", borderRadius: 8, padding: "8px 16px", color: "#6b7280", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Change User</button>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px", display: "flex", flexDirection: "column", gap: 14 }}>
              {messages.length === 0 && (
                <div style={{ textAlign: "center", color: "#9ca3af", marginTop: 60 }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>👋</div>
                  <p style={{ fontWeight: 600, color: "#374151", fontSize: 16, margin: "0 0 4px" }}>Start the conversation</p>
                  <p style={{ fontSize: 14 }}>Send a message to {receiver.name}</p>
                </div>
              )}
              {messages.map((msg) => (
                <div key={msg._id || Math.random()} style={{ display: "flex", justifyContent: msg.sender._id === userId ? "flex-end" : "flex-start", alignItems: "flex-end", gap: 10 }}>
                  {msg.sender._id !== userId && (
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: "#e8f0fe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#1a73e8", flexShrink: 0 }}>{msg.sender?.name?.[0] || "U"}</div>
                  )}
                  <div style={{ maxWidth: "60%" }}>
                    <div style={{
                      padding: "12px 16px",
                      borderRadius: msg.sender._id === userId ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                      background: msg.sender._id === userId ? "linear-gradient(135deg, #1a73e8, #0d47a1)" : "#fff",
                      color: msg.sender._id === userId ? "#fff" : "#1a1a2e",
                      fontSize: 14, lineHeight: 1.5,
                      border: msg.sender._id === userId ? "none" : "1.5px solid #e8edf2",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.06)"
                    }}>
                      {msg.text}
                    </div>
                    <p style={{ fontSize: 11, color: "#9ca3af", margin: "5px 0 0", textAlign: msg.sender._id === userId ? "right" : "left" }}>{formatTime(msg.createdAt)}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div style={{ background: "#fff", borderTop: "2px solid #e8edf2", padding: "16px 28px", display: "flex", gap: 12, alignItems: "center" }}>
              <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder={`Message ${receiver.name}...`}
                style={{ flex: 1, padding: "12px 18px", borderRadius: 99, border: "1.5px solid #d0d7e2", fontSize: 15, outline: "none", color: "#1a1a2e", background: "#fafbfc" }} />
              <button onClick={sendMessage}
                style={{ padding: "12px 24px", borderRadius: 99, background: "linear-gradient(135deg, #1a73e8, #0d47a1)", color: "#fff", fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer" }}>
                Send →
              </button>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ textAlign: "center", maxWidth: 320 }}>
              <div style={{ fontSize: 64, marginBottom: 20 }}>💬</div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1a1a2e", margin: "0 0 8px" }}>Your messages</h2>
              <p style={{ color: "#6b7280", fontSize: 15, lineHeight: 1.6 }}>Select a person from the left sidebar to start a real-time conversation.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;
