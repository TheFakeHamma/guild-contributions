import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

interface LeaderboardEntry {
  id: number;
  username: string;
  points: number;
}

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        // Fetch all users
        const usersRes = await axios.get<{ id: number; username: string }[]>(
          `${API_URL}/users/all`
        );

        // Fetch points for all users in parallel
        const pointsPromises = usersRes.data.map(async (user) => {
          try {
            const pointsRes = await axios.get<{ points: number }>(
              `${API_URL}/campaign/progress/${user.id}`
            );
            return {
              id: user.id,
              username: user.username,
              points: pointsRes.data.points ?? 0,
            };
          } catch (error) {
            console.error(
              `❌ Error fetching points for ${user.username}`,
              error
            );
            return { id: user.id, username: user.username, points: 0 }; // Default to 0 if error
          }
        });

        const leaderboardData = await Promise.all(pointsPromises);

        // Sort by points (highest first)
        leaderboardData.sort((a, b) => b.points - a.points);

        setLeaderboard(leaderboardData);
      } catch (error) {
        console.error("❌ Error fetching leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) return <div className="text-white">Loading leaderboard...</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold">Leaderboard</h1>
      <ul className="mt-4 w-96">
        {leaderboard.length === 0 ? (
          <li className="text-lg text-gray-400">No players yet</li>
        ) : (
          leaderboard.map((player, index) => (
            <li
              key={player.id}
              className="p-2 bg-gray-800 border-b border-gray-700 flex justify-between"
            >
              <span>
                {index + 1}. {player.username}
              </span>
              <span className="text-green-400">⭐ {player.points}</span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default Leaderboard;
