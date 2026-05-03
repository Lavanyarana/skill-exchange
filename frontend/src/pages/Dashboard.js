import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const API = "https://skillchat.duckdns.org";
const socket = io(API);

function Dashboard() {
  const [skillsOffered, setSkillsOffered] = useState("");
  const [skillsWanted, setSkillsWanted] = useState("");
  const [matches, setMatches] = useState([]);
  const [requests, setRequests] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) return;
    socket.emit("join", userId);
    const handleNotification = () => {
      setUnreadCount((prev) => prev + 1);
    };
    socket.on("newNotification", handleNotification);
    return () => socket.off("newNotification", handleNotification);
  }, [userId]);

  const handleUpdateSkills = async () => {
    try {
      await axios.put(`${API}/api/users/update-skills/${userId}`, {
        skillsOffered: skillsOffered.split(","),
        skillsWanted: skillsWanted.split(","),
      });
      setSuccessMsg("Skills updated successfully!");
      setErrorMsg("");
      fetchMatches();
    } catch {
      setErrorMsg("Error updating skills");
      setSuccessMsg("");
    }
  };

  const fetchMatches = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/api/users/match/${userId}`);
      setMatches(res.data);
    } catch {
      alert("Error fetching matches");
    }
  }, [userId]);

  const fetchRequests = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/api/requests/received/${userId}`);
      setRequests(res.data);
    } catch {
      alert("Error fetching requests");
    }
  }, [userId]);

  const fetchUnread = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/api/messages/unread/${userId}`);
      setUnreadCount(res.data.count);
    } catch {
      console.log("Error fetching unread messages");
    }
  }, [userId]);

  const sendRequest = async (receiverId, skill) => {
    try {
      await axios.post(`${API}/api/requests/send`, {
        sender: userId,
        receiver: receiverId,
        skill,
      });
      alert("Request sent!");
    } catch {
      alert("Error sending request");
    }
  };

  const updateRequest = async (requestId, status) => {
    try {
      await axios.put(`${API}/api/requests/update/${requestId}`, { status });
      fetchRequests();
    } catch {
      alert("Error updating request");
    }
  };

  useEffect(() => {
    if (!userId) return;
    fetchMatches();
    fetchRequests();
    fetchUnread();
  }, [userId, fetchMatches, fetchRequests, fetchUnread]);

  useEffect(() => {
    const interval = setInterval(() => fetchUnread(), 5000);
    return () => clearInterval(interval);
  }, [fetchUnread]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow">
        <h1 className="text-2xl font-bold text-gray-800">Skill Exchange</h1>
        <div className="flex gap-3 items-center">
          <button className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600" onClick={() => (window.location.href = "/profile")}>Profile</button>
          <button title="New messages" className="relative bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600" onClick={() => (window.location.href = "/chat")}>
            Chat
            {unreadCount > 0 && (<span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full shadow">{unreadCount}</span>)}
          </button>
          <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600" onClick={() => { localStorage.clear(); window.location.href = "/"; }}>Logout</button>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Welcome 👋</h2>
        <p className="text-gray-500">Connect with people and exchange skills</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition border mb-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Update Skills</h2>
        {successMsg && <p className="text-green-500 mb-2">{successMsg}</p>}
        {errorMsg && <p className="text-red-500 mb-2">{errorMsg}</p>}
        <div className="grid md:grid-cols-2 gap-4">
          <input className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-400" placeholder="Skills Offered (Java, HTML)" value={skillsOffered} onChange={(e) => setSkillsOffered(e.target.value)} />
          <input className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-400" placeholder="Skills Wanted (Python, Design)" value={skillsWanted} onChange={(e) => setSkillsWanted(e.target.value)} />
        </div>
        <button className="mt-4 bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600" onClick={handleUpdateSkills}>Save Skills</button>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Matches</h2>
        {matches.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-4xl mb-2">🔍</p>
            <p className="text-gray-500 font-medium">No matches yet</p>
            <p className="text-gray-400 text-sm">Try adding more skills to find people</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {matches.map((user) => (
              <div key={user._id} className="bg-white p-5 rounded-2xl shadow-md hover:shadow-lg transition border">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold">{user.name[0]}</div>
                  <div>
                    <p className="font-bold text-gray-800">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                <div className="mt-3 text-sm">
                  <p><b>Offers:</b> {user.skillsOffered.join(", ")}</p>
                  <p><b>Wants:</b> {user.skillsWanted.join(", ")}</p>
                </div>
                <button className="mt-4 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600" onClick={() => sendRequest(user._id, user.skillsOffered[0])}>Send Request</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Inbox</h2>
        {requests.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-4xl mb-2">📩</p>
            <p className="text-gray-500 font-medium">No requests yet</p>
            <p className="text-gray-400 text-sm">Requests will appear here</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {requests.map((req) => (
              <div key={req._id} className="bg-white p-5 rounded-2xl shadow-md border">
                <p className="font-medium"><b>{req.sender.name}</b> wants <b>{req.skill}</b></p>
                <p className="text-sm text-gray-500">{req.sender.email}</p>
                <p className="mt-2 text-sm">Status: <span className={`font-semibold ${req.status === "accepted" ? "text-green-500" : req.status === "rejected" ? "text-red-500" : "text-yellow-500"}`}>{req.status}</span></p>
                {req.status === "pending" && (
                  <div className="mt-3 flex gap-2">
                    <button className="bg-green-500 text-white px-3 py-1 rounded-lg" onClick={() => updateRequest(req._id, "accepted")}>Accept</button>
                    <button className="bg-red-500 text-white px-3 py-1 rounded-lg" onClick={() => updateRequest(req._id, "rejected")}>Reject</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
export default Dashboard;
