/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

function Register() {
  const [username, setUsername] = useState("");
  const [discordId, setDiscordId] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/users/register`, {
        username,
        discord_id: discordId,
      });
      setMessage(`✅ User ${response.data.username} registered successfully!`);
    } catch (error) {
      setMessage("❌ Error registering user");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold">Register New User</h1>
      <form onSubmit={handleRegister} className="flex flex-col gap-4 mt-6">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="p-2 bg-gray-800 border border-gray-700 rounded"
        />
        <input
          type="text"
          placeholder="Discord ID"
          value={discordId}
          onChange={(e) => setDiscordId(e.target.value)}
          required
          className="p-2 bg-gray-800 border border-gray-700 rounded"
        />
        <button
          type="submit"
          className="p-2 bg-blue-600 rounded hover:bg-blue-700"
        >
          Register
        </button>
      </form>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}

export default Register;
