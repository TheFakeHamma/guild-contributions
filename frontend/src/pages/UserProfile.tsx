import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { User } from "../types";

const API_URL = import.meta.env.VITE_API_URL;

interface Contribution {
  id: number;
  item_name: string;
  quantity: number;
  amount: number;
  points_awarded: number;
}

interface RecruitedPlayer {
  id: number;
  recruit_name: string;
  recruit_type: string;
  participated_in_raid: boolean;
  points_awarded: number;
}

interface HistoryLog {
  action: string;
  created_at: string;
}

function UserProfile() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [recruitedPlayers, setRecruitedPlayers] = useState<RecruitedPlayer[]>(
    []
  );
  const [history, setHistory] = useState<HistoryLog[]>([]);
  const [totalPoints, setTotalPoints] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await axios.get<User>(`${API_URL}/users/${id}`);
        setUser(userRes.data);

        const contributionsRes = await axios.get<Contribution[]>(
          `${API_URL}/contributions/user/${id}`
        );
        console.log("📥 Contributions Data:", contributionsRes.data);
        setContributions(contributionsRes.data);

        const recruitsRes = await axios.get<RecruitedPlayer[]>(
          `${API_URL}/recruitments/user/${id}`
        );
        setRecruitedPlayers(recruitsRes.data);

        const historyRes = await axios.get<HistoryLog[]>(
          `${API_URL}/history/user/${id}`
        );
        setHistory(historyRes.data);

        const pointsRes = await axios.get<{ points: number }>(
          `${API_URL}/campaign/progress/${id}`
        );
        setTotalPoints(pointsRes.data.points);
      } catch (error) {
        console.error("❌ Error fetching user profile data", error);
      }
    };

    fetchData();
  }, [id]);

  const removeContribution = async (
    contributionId: number | null,
    pointsAwarded: number
  ) => {
    console.log("🛠 Trying to Remove Contribution:", {
      contributionId,
      pointsAwarded,
    });

    if (!contributionId) {
      console.error("❌ Contribution ID is null or undefined:", contributionId);
      return;
    }

    try {
      const response = await axios.delete(`${API_URL}/contributions/remove`, {
        params: {
          contribution_id: contributionId, // ✅ Ensure this is passed
          user_id: id,
        },
      });

      if (response.status === 200) {
        setContributions((prev) => prev.filter((c) => c.id !== contributionId));
        setTotalPoints((prev) => prev - pointsAwarded);
      }
    } catch (error) {
      console.error("❌ Error removing contribution", error);
    }
  };

  if (!user) return <div className="text-white">Loading...</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-4">{user.username}'s Profile</h1>
      <p className="text-lg">Total Points: {totalPoints}</p>

      <h2 className="text-xl font-bold mt-6">Contributions</h2>
      <ul className="w-96">
        {contributions.map((c) => (
          <li
            key={c.id}
            className="p-2 bg-gray-800 border-b border-gray-700 flex justify-between"
          >
            <span>
              {c.quantity}x ({c.amount} per contribution) {c.item_name}
              <span className="text-green-400">
                {" "}
                (+{c.points_awarded} points)
              </span>
            </span>
            <button
              onClick={() => removeContribution(c.id, c.points_awarded)}
              className="text-red-500 hover:underline"
            >
              ❌ Remove
            </button>
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-bold mt-6">Recruited Players</h2>
      <ul className="w-96">
        {recruitedPlayers.map((r) => (
          <li
            key={r.id}
            className="p-2 bg-gray-800 border-b border-gray-700 flex justify-between"
          >
            <span>
              {r.recruit_name} ({r.recruit_type})
            </span>
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-bold mt-6">History</h2>
      <ul className="w-96">
        {history.map((h, index) => (
          <li key={index} className="p-2 bg-gray-800 border-b border-gray-700">
            {h.action} - {new Date(h.created_at).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserProfile;
