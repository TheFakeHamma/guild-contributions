/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import { User } from "../types";

const API_URL = import.meta.env.VITE_API_URL;

function Recruitment() {
  const [recruitName, setRecruitName] = useState("");
  const [users, setUsers] = useState<{ value: number; label: string }[]>([]);
  const [selectedUser, setSelectedUser] = useState<{
    value: number;
    label: string;
  } | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get<User[]>(`${API_URL}/users/all`).then((response) => {
      setUsers(
        response.data.map((user) => ({ value: user.id, label: user.username }))
      );
    });
  }, []);

  const handleRecruit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) {
      setMessage("❌ Please select a recruiter.");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/recruitments/recruit`, {
        recruiter_id: selectedUser.value,
        recruit_name: recruitName,
      });
      setMessage(`✅ Recruit ${response.data.recruit_name} added!`);
    } catch (error) {
      setMessage("❌ Error adding recruit");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold">Recruit a Player</h1>
      <form onSubmit={handleRecruit} className="flex flex-col gap-4 mt-6 w-96">
        <Select
          options={users}
          value={selectedUser}
          onChange={setSelectedUser}
          placeholder="Select Recruiter..."
          isSearchable
          className="text-black"
        />
        <input
          type="text"
          placeholder="Recruit Name"
          value={recruitName}
          onChange={(e) => setRecruitName(e.target.value)}
          required
          className="p-2 bg-gray-800 border border-gray-700 rounded"
        />
        <button
          type="submit"
          className="p-2 bg-blue-600 rounded hover:bg-blue-700"
        >
          Add Recruit
        </button>
      </form>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}

export default Recruitment;
