import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { User } from "../types";

const API_URL = import.meta.env.VITE_API_URL;

interface Contribution {
  item_name: string;
  quantity: number;
  points_awarded: number;
}

interface RecruitedPlayer {
  id: number;
  recruit_name: string;
  recruit_type: string;
  participated_in_raid: boolean;
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
    axios
      .get<User>(`${API_URL}/users/${id}`)
      .then((response) => setUser(response.data));
    axios
      .get<Contribution[]>(`${API_URL}/contributions/user/${id}`)
      .then((response) => setContributions(response.data));
    axios
      .get<RecruitedPlayer[]>(`${API_URL}/recruitments/user/${id}`)
      .then((response) => setRecruitedPlayers(response.data));
    axios
      .get<HistoryLog[]>(`${API_URL}/history/user/${id}`)
      .then((response) => setHistory(response.data));
    axios
      .get<{ points: number }>(`${API_URL}/campaign/progress/${id}`)
      .then((response) => {
        setTotalPoints(response.data.points || 0);
      });
  }, [id]);

  const updatePoints = (newPoints: number) => {
    setTotalPoints(newPoints);
  };

  const markRaidParticipation = async (recruitId: number) => {
    try {
      const response = await axios.post(
        `${API_URL}/recruitments/recruit/raid`,
        {
          recruit_id: recruitId,
          recruiter_id: id,
        }
      );

      setRecruitedPlayers((prev) =>
        prev.map((r) =>
          r.id === recruitId ? { ...r, participated_in_raid: true } : r
        )
      );

      updatePoints(response.data.updatedPoints);
    } catch (error) {
      console.error("Error marking recruit as raid participant", error);
    }
  };

  const removeRecruit = async (
    recruitId: number,
    recruitName: string,
    recruitType: string,
    participated: boolean
  ) => {
    try {
      const pointsLost =
        recruitType === "main" ? (participated ? 7 : 2) : participated ? 6 : 1; // ✅ Deduct correct points

      const response = await axios.delete(
        `${API_URL}/recruitments/recruit/remove`,
        {
          data: {
            recruit_id: recruitId,
            recruiter_id: id,
            recruit_name: recruitName,
            points_lost: pointsLost,
          },
        }
      );

      setRecruitedPlayers((prev) => prev.filter((r) => r.id !== recruitId));
      updatePoints(response.data.updatedPoints);
    } catch (error) {
      console.error("Error removing recruit", error);
    }
  };

  if (!user) return <div className="text-white">Loading...</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-4">{user?.username}'s Profile</h1>
      <p className="text-lg">Total Points: {totalPoints}</p>

      <h2 className="text-xl font-bold mt-6">Contributions</h2>
      <ul className="w-96">
        {contributions.map((c, index) => (
          <li key={index} className="p-2 bg-gray-800 border-b border-gray-700">
            {c.quantity}x {c.item_name} (+{c.points_awarded} points)
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
              {r.recruit_name} ({r.recruit_type}){" "}
              {r.participated_in_raid && "✅"}
            </span>
            {!r.participated_in_raid && (
              <button
                onClick={() => markRaidParticipation(r.id)}
                className="text-green-500 hover:underline"
              >
                ✅ Mark Raid Participation
              </button>
            )}
            <button
              onClick={() =>
                removeRecruit(
                  r.id,
                  r.recruit_name,
                  r.recruit_type,
                  r.participated_in_raid
                )
              }
              className="text-red-500 hover:underline"
            >
              ❌ Remove Recruit
            </button>
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
