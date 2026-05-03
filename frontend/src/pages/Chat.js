import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
const socket = io("https://skillchat.duckdns.org", {
  transports: ["websocket", "polling"],
});


function Chat() {
  const [users, setUsers] = useState([]);
  const [receiver, setReceiver] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  useEffect(() => {
    socket.emit("join", userId);
  }, [userId]);

  useEffect(() => {
    const handleMessage = (data) => {
      setMessages((prev) => [
        ...prev,
        {
          ...data,
          sender: {
            _id: data.sender,
            name: "User", // fallback (or fetch later)
          },
          createdAt: new Date(),
        },
      ]);
    };

    socket.on("receiveMessage", handleMessage);

    return () => {
      socket.off("receiveMessage", handleMessage);
    };
  }, []);
  // 🔹 Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🔹 Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("https://skillchat.duckdns.org/api/users");
        setUsers(res.data.filter((u) => u._id !== userId));
      } catch (error) {
        console.log(error);
        alert("Error fetching users");
      }
    };

    fetchUsers();
  }, [userId]);

  useEffect(() => {
    if (receiver) {
      // reset unread count when entering chat
      // (optional API call if needed)
    }
  }, [receiver]);
  // 🔹 Fetch messages + mark seen
  useEffect(() => {
    const fetchMessages = async () => {
      if (!receiver) return;

      try {
        const res = await axios.get(
          `https://skillchat.duckdns.org/api/messages/${userId}/${receiver._id}`,
        );

        setMessages(res.data);

        // mark messages as seen
        await axios.put(
          `https://skillchat.duckdns.org/api/messages/seen/${receiver._id}/${userId}`,
        );
      } catch {
        alert("Error fetching messages");
      }
    };

    fetchMessages();
  }, [receiver, userId]);

  // 🔹 Send message
  const sendMessage = async () => {
    if (!text.trim() || !receiver) return;

    try {
      socket.emit("sendMessage", {
        sender: userId,
        receiver: receiver._id,
        text,
      });

      // still save in DB
      await axios.post("https://skillchat.duckdns.org/api/messages/send", {

        sender: userId,
        receiver: receiver._id,
        text,
      });

      setText("");

      const res = await axios.get(
        `https://skillchat.duckdns.org/api/messages/${userId}/${receiver._id}`,
      );

      setMessages(res.data);
    } catch {
      alert("Error sending message");
    }
  };

  // 🔹 Time format
  const formatTime = (date) => {
    const d = new Date(date);
    return d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex h-screen">
      {/* LEFT SIDEBAR (USERS) */}
      <div className="w-1/4 bg-white border-r p-4">
        <h2 className="text-xl font-bold mb-4">Users</h2>

        {users.map((user) => (
          <div
            key={user._id}
            className={`p-3 rounded-lg cursor-pointer flex items-center gap-3 transition ${
              receiver?._id === user._id ? "bg-indigo-100" : "hover:bg-gray-100"
            }`}
            onClick={() => setReceiver(user)}
          >
            <div className="w-10 h-10 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold">
              {user.name[0]}
            </div>

            <div>
              <p className="text-gray-800 font-medium">{user.name}</p>
              <p className="text-xs text-gray-500">Tap to chat</p>
            </div>
          </div>
        ))}
      </div>

      {/* RIGHT SIDE (CHAT AREA) */}
      <div className="flex-1 flex flex-col">
        {receiver ? (
          <>
            {/* HEADER */}
            <div className="bg-white p-4 shadow flex justify-between items-center border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-500 text-white rounded-full flex items-center justify-center">
                  {receiver.name[0]}
                </div>

                <div>
                  <p className="font-semibold">{receiver.name}</p>
                  <p className="text-xs text-gray-500">Online</p>
                </div>
              </div>

              <button
                onClick={() => navigate("/dashboard")}
                className="bg-blue-500 text-white px-3 py-1 rounded-lg"
              >
                Dashboard
              </button>

              <button
                onClick={() => setReceiver(null)}
                className="text-sm text-gray-500 hover:text-black"
              >
                Change User
              </button>
            </div>

            {/* MESSAGES */}
            <div className="flex-1 p-4 overflow-y-scroll bg-gray-100">
              {messages.map((msg) => (
                <div
                  key={msg._id || Math.random()}
                  className={`mb-3 flex ${
                    msg.sender._id === userId ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.sender._id !== userId && (
                    <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white mr-2">
                      {msg.sender?.name?.[0] || "U"}
                    </div>
                  )}

                  <div>
                    <div
                      className={`px-4 py-2 rounded-2xl shadow ${
                        msg.sender._id === userId
                          ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
                          : "bg-white border"
                      }`}
                    >
                      {msg.text}
                    </div>

                    <div className="text-xs text-gray-400 mt-1">
                      {formatTime(msg.createdAt)}
                    </div>
                  </div>
                </div>
              ))}

              <div ref={messagesEndRef}></div>
            </div>

            {/* INPUT */}
            <div className="p-4 bg-white flex items-center gap-2 border-t">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="flex-1 px-4 py-2 rounded-full border focus:ring-2 focus:ring-blue-400 outline-none"
                placeholder="Type a message..."
              />

              <button
                onClick={sendMessage}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-5 py-2 rounded-full shadow hover:scale-105 transition"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <p className="text-5xl mb-2">💬</p>
              <p className="text-lg font-medium">Start a conversation</p>
              <p className="text-sm">Select a user from the left</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;
