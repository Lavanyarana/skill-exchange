import { useEffect, useState } from "react";
import axios from "axios";

function Profile() {
  const [showPasswordBox, setShowPasswordBox] = useState(false);
  const [showDeleteBox, setShowDeleteBox] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [msg, setMsg] = useState("");
  const [user, setUser] = useState(null);
  const userId = localStorage.getItem("userId");

  const handleChangePassword = async () => {
    try {
      await axios.put(`https://skillchat.duckdns.org/api/users/change-password/${userId}`, { password: newPassword });
      setMsg("Password updated successfully!"); setNewPassword("");
    } catch { setMsg("Error updating password"); }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== "DELETE") { alert('Please type DELETE to confirm'); return; }
    try {
      await axios.delete(`https://skillchat.duckdns.org/api/users/${userId}`);
      localStorage.clear();
      window.location.href = "/";
    } catch { alert("Error deleting account. Please try again."); }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try { const res = await axios.get(`https://skillchat.duckdns.org/api/users/${userId}`); setUser(res.data); }
      catch { alert("Error fetching profile"); }
    };
    fetchUser();
  }, [userId]);

  if (!user) return (
    <div style={{ minHeight: "100vh", background: "#f4f6f9", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI', Arial, sans-serif" }}>
      <p style={{ color: "#6b7280" }}>Loading profile...</p>
    </div>
  );

  // const avatarColors = ["#1a73e8", "#7c3aed", "#059669", "#dc2626", "#d97706", "#0891b2"];
  // const avatarColor = avatarColors[user.name.charCodeAt(0) % avatarColors.length];

  return (
    <div style={{ minHeight: "100vh", background: "#f4f6f9", fontFamily: "'Segoe UI', Arial, sans-serif" }}>
      <nav style={{ background: "#fff", borderBottom: "2px solid #e8edf2", padding: "0 40px", display: "flex", justifyContent: "space-between", alignItems: "center", height: 64, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: "linear-gradient(135deg, #1a73e8, #0d47a1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 18 }}>S</div>
          <span style={{ fontWeight: 800, fontSize: 20, color: "#1a1a2e" }}>Skill<span style={{ color: "#1a73e8" }}>Xchange</span></span>
        </div>
        <button onClick={() => window.location.href = "/dashboard"}
          style={{ padding: "8px 20px", borderRadius: 6, border: "1.5px solid #1a73e8", background: "#fff", color: "#1a73e8", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
          ← Dashboard
        </button>
      </nav>

      <div style={{ maxWidth: 680, margin: "36px auto", padding: "0 24px" }}>

        {/* PROFILE HEADER CARD */}
        <div style={{ background: "linear-gradient(135deg, #0d47a1, #1a73e8)", borderRadius: 16, padding: "32px", marginBottom: 20, color: "#fff", display: "flex", alignItems: "center", gap: 24, boxShadow: "0 4px 20px rgba(26,115,232,0.3)" }}>
          <div style={{ width: 80, height: 80, borderRadius: 20, background: "rgba(255,255,255,0.2)", border: "3px solid rgba(255,255,255,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 36, flexShrink: 0 }}>{user.name[0]}</div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 26, fontWeight: 800, margin: "0 0 4px" }}>{user.name}</h1>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.8)", margin: "0 0 12px" }}>{user.email}</p>
            <div style={{ display: "flex", gap: 16 }}>
              <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 8, padding: "8px 16px", textAlign: "center" }}>
                <p style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>{user.skillsOffered.length}</p>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.75)", margin: 0 }}>Teaching</p>
              </div>
              <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 8, padding: "8px 16px", textAlign: "center" }}>
                <p style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>{user.skillsWanted.length}</p>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.75)", margin: 0 }}>Learning</p>
              </div>
            </div>
          </div>
        </div>

        {/* SKILLS CARD */}
        <div style={{ background: "#fff", borderRadius: 14, border: "1.5px solid #e8edf2", padding: "26px 30px", marginBottom: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1a1a2e", margin: "0 0 22px" }}>Skills Overview</h2>
          <div style={{ marginBottom: 22 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 16 }}>🎓</span>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1, margin: 0 }}>I Can Teach</p>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {user.skillsOffered.length ? user.skillsOffered.map(s => (
                <span key={s} style={{ background: "#e8f0fe", color: "#1557b0", fontSize: 13, fontWeight: 600, padding: "6px 16px", borderRadius: 99, border: "1.5px solid #c7d9fb" }}>{s}</span>
              )) : <span style={{ color: "#9ca3af", fontSize: 14 }}>None yet — add from Dashboard</span>}
            </div>
          </div>
          <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: 22 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 16 }}>📚</span>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1, margin: 0 }}>I Want To Learn</p>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {user.skillsWanted.length ? user.skillsWanted.map(s => (
                <span key={s} style={{ background: "#fef3c7", color: "#92400e", fontSize: 13, fontWeight: 600, padding: "6px 16px", borderRadius: 99, border: "1.5px solid #fde68a" }}>{s}</span>
              )) : <span style={{ color: "#9ca3af", fontSize: 14 }}>None yet — add from Dashboard</span>}
            </div>
          </div>
        </div>

        {/* SECURITY CARD */}
        <div style={{ background: "#fff", borderRadius: 14, border: "1.5px solid #e8edf2", padding: "26px 30px", marginBottom: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1a1a2e", margin: "0 0 4px" }}>Security</h2>
          <p style={{ fontSize: 14, color: "#6b7280", margin: "0 0 18px" }}>Manage your password and account access</p>
          <button onClick={() => { setShowPasswordBox(!showPasswordBox); setShowDeleteBox(false); }}
            style={{ padding: "10px 20px", borderRadius: 8, background: showPasswordBox ? "#f4f6f9" : "#fff", border: "1.5px solid #d0d7e2", color: "#374151", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
            🔒 {showPasswordBox ? "Cancel" : "Change Password"}
          </button>
          {showPasswordBox && (
            <div style={{ marginTop: 18, padding: "20px", background: "#f8faff", borderRadius: 10, border: "1.5px solid #e8edf2" }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", display: "block", marginBottom: 8, letterSpacing: 0.5, textTransform: "uppercase" }}>New Password</label>
              <input type="password" placeholder="Min. 8 characters" value={newPassword}
                style={{ width: "100%", padding: "12px 16px", borderRadius: 8, border: "1.5px solid #d0d7e2", fontSize: 15, marginBottom: 14, boxSizing: "border-box", outline: "none", background: "#fff" }}
                onChange={(e) => setNewPassword(e.target.value)} />
              <button onClick={handleChangePassword}
                style={{ padding: "11px 24px", borderRadius: 8, background: "linear-gradient(135deg, #1a73e8, #0d47a1)", color: "#fff", fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer" }}>
                Update Password →
              </button>
            </div>
          )}
          {msg && <div style={{ marginTop: 14, padding: "10px 14px", borderRadius: 8, background: msg.includes("Error") ? "#fef2f2" : "#f0fdf4", border: `1.5px solid ${msg.includes("Error") ? "#fca5a5" : "#86efac"}`, color: msg.includes("Error") ? "#dc2626" : "#16a34a", fontSize: 14, fontWeight: 500 }}>
            {msg.includes("Error") ? "✕" : "✓"} {msg}
          </div>}
        </div>

        {/* DANGER ZONE */}
        <div style={{ background: "#fff", borderRadius: 14, border: "1.5px solid #fca5a5", padding: "26px 30px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 18 }}>⚠️</span>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#dc2626", margin: 0 }}>Danger Zone</h2>
          </div>
          <p style={{ fontSize: 14, color: "#6b7280", margin: "0 0 18px" }}>Permanently delete your account and all your data. This cannot be undone.</p>
          <button onClick={() => { setShowDeleteBox(!showDeleteBox); setShowPasswordBox(false); }}
            style={{ padding: "10px 20px", borderRadius: 8, background: showDeleteBox ? "#fef2f2" : "#fff", border: "1.5px solid #dc2626", color: "#dc2626", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
            🗑️ {showDeleteBox ? "Cancel" : "Delete My Account"}
          </button>
          {showDeleteBox && (
            <div style={{ marginTop: 18, padding: "20px", background: "#fef2f2", borderRadius: 10, border: "1.5px solid #fca5a5" }}>
              <p style={{ fontSize: 14, color: "#374151", margin: "0 0 12px", fontWeight: 500 }}>Type <strong style={{ color: "#dc2626" }}>DELETE</strong> to confirm permanent deletion:</p>
              <input placeholder="Type DELETE here" value={deleteConfirm}
                style={{ width: "100%", padding: "12px 16px", borderRadius: 8, border: "1.5px solid #fca5a5", fontSize: 15, marginBottom: 14, boxSizing: "border-box", outline: "none", background: "#fff" }}
                onChange={(e) => setDeleteConfirm(e.target.value)} />
              <button onClick={handleDeleteAccount}
                style={{ padding: "11px 24px", borderRadius: 8, background: deleteConfirm === "DELETE" ? "#dc2626" : "#f3f4f6", color: deleteConfirm === "DELETE" ? "#fff" : "#9ca3af", fontWeight: 700, fontSize: 15, border: "none", cursor: deleteConfirm === "DELETE" ? "pointer" : "not-allowed" }}>
                Permanently Delete Account
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
