import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

interface Recruit {
  id: number;
  recruit_name: string;
  recruit_type: string;
  participated_in_raid: boolean;
  recruiter_id: number;
  recruiter_name: string;
}

function Recruits() {
  const [recruits, setRecruits] = useState<Recruit[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get<Recruit[]>(`${API_URL}/recruitments/all`).then((response) => {
      setRecruits(response.data);
    });
  }, []);

  const filteredRecruits = recruits.filter((r) =>
    r.recruit_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">All Recruits</h1>

      <input
        type="text"
        placeholder="Search recruits..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="p-2 w-96 bg-gray-800 border border-gray-700 rounded text-white mb-4"
      />

      <ul className="w-96">
        {filteredRecruits.map((r) => (
          <li
            key={r.id}
            className="p-2 bg-gray-800 border-b border-gray-700 flex justify-between"
          >
            <span>
              {r.recruit_name} ({r.recruit_type}){" "}
              {r.participated_in_raid && "✅"}
            </span>
            <Link
              to={`/users/${r.recruiter_id}`}
              className="text-blue-400 hover:underline"
            >
              🔗 {r.recruiter_name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Recruits;
