import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<
    { username: string; points: number }[]
  >([]);

  useEffect(() => {
    axios
      .get(`${API_URL}/campaign/progress/1`) // Change user_id dynamically later
      .then((response) => setLeaderboard([response.data])) // Single user for now
      .catch((error) => console.error("Error fetching leaderboard:", error));
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold">Leaderboard</h1>
      <ul className="mt-4">
        {leaderboard.map((player, index) => (
          <li key={index} className="text-lg">
            {index + 1}. {player.username} - {player.points} points
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Leaderboard;
