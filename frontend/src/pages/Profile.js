import { useEffect, useState } from "react";
import axios from "axios";

function Profile() {
  const [showPasswordBox, setShowPasswordBox] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [user, setUser] = useState(null);
  const userId = localStorage.getItem("userId");

  const handleChangePassword = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/users/change-password/${userId}`,
        {
          password: newPassword,
        },
      );

      setMsg("Password updated!");
      setNewPassword("");
    } catch {
      setMsg("Error updating password");
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/users/${userId}`,
        );
        setUser(res.data);
      } catch {
        alert("Error fetching profile");
      }
    };

    fetchUser();
  }, [userId]);

  if (!user)
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-indigo-200 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96 text-center">
        <div className="w-20 h-20 bg-indigo-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
          {user.name[0]}
        </div>

        <h2 className="text-2xl font-bold mb-2">{user.name}</h2>
        <p className="text-gray-500 mb-4">{user.email}</p>

        <div className="text-left mt-4">
          <p className="font-semibold text-gray-700">Skills Offered</p>
          <p className="text-gray-600">
            {user.skillsOffered.join(", ") || "None"}
          </p>
        </div>

        <div className="text-left mt-4">
          <p className="font-semibold text-gray-700">Skills Wanted</p>
          <p className="text-gray-600">
            {user.skillsWanted.join(", ") || "None"}
          </p>
        </div>
        <button
          className="mt-4 bg-yellow-400 text-white px-4 py-2 rounded-lg w-full"
          onClick={() => setShowPasswordBox(!showPasswordBox)}
        >
          Change Password
        </button>

        {showPasswordBox && (
          <div className="mt-4">
            <input
              type="password"
              placeholder="New Password"
              className="w-full p-2 border rounded mb-2"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button
              onClick={handleChangePassword}
              className="bg-blue-500 text-white px-3 py-1 rounded w-full"
            >
              Update Password
            </button>
          </div>
        )}

        {msg && <p className="mt-2 text-sm text-green-500">{msg}</p>}

        <button
          className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-600"
          onClick={() => (window.location.href = "/dashboard")}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default Profile;
