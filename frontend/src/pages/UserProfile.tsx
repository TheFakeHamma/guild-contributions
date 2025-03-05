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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      console.log("🔍 Fetching Data for User ID:", id);
      setLoading(true);

      try {
        const userRes = await axios.get<User>(`${API_URL}/users/${id}`);
        setUser(userRes.data);
        console.log("📥 User Data:", userRes.data);
      } catch (error) {
        console.error("❌ Error fetching user", error);
      }

      try {
        const contributionsRes = await axios.get<Contribution[]>(
          `${API_URL}/contributions/user/${id}`
        );
        setContributions(contributionsRes.data);
        console.log("📥 Contributions Data:", contributionsRes.data);
      } catch (error) {
        console.error("❌ Error fetching contributions", error);
      }

      try {
        const recruitsRes = await axios.get<RecruitedPlayer[]>(
          `${API_URL}/recruitments/user/${id}`
        );
        setRecruitedPlayers(recruitsRes.data);
        console.log("📥 Recruited Players Data:", recruitsRes.data);
      } catch (error) {
        console.error("❌ Error fetching recruits", error);
      }

      try {
        const historyRes = await axios.get<HistoryLog[]>(
          `${API_URL}/history/user/${id}`
        );
        setHistory(historyRes.data);
        console.log("📥 History Log Data:", historyRes.data);
      } catch (error) {
        console.error("❌ Error fetching history log", error);
      }

      try {
        const pointsRes = await axios.get<{ points: number }>(
          `${API_URL}/campaign/progress/${id}`
        );
        console.log("📥 Points Response:", pointsRes.data);
        setTotalPoints(pointsRes.data.points ?? 0);
      } catch (error) {
        console.error("❌ Error fetching campaign progress", error);
        setTotalPoints(0);
      }

      setLoading(false);
    };

    fetchData();
  }, [id]);

  // ✅ Mark Recruit as Raid Participant
  const markRaidParticipation = async (recruitId: number) => {
    try {
      await axios.post(`${API_URL}/recruitments/recruit/raid`, {
        recruit_id: recruitId,
        recruiter_id: id,
      });

      setRecruitedPlayers((prev) =>
        prev.map((r) =>
          r.id === recruitId ? { ...r, participated_in_raid: true } : r
        )
      );

      setTotalPoints((prev) => (prev !== null ? prev + 5 : 5)); // Adjust points correctly
    } catch (error) {
      console.error("❌ Error marking recruit as raid participant", error);
    }
  };

  // ✅ Remove Recruit
  const removeRecruit = async (
    recruitId: number,
    recruitName: string,
    recruitType: string,
    participated: boolean
  ) => {
    try {
      const pointsLost =
        recruitType === "main" ? (participated ? 7 : 2) : participated ? 6 : 1;

      await axios.delete(`${API_URL}/recruitments/recruit/remove`, {
        data: {
          recruit_id: recruitId,
          recruiter_id: id,
          recruit_name: recruitName,
          points_lost: pointsLost,
        },
      });

      setRecruitedPlayers((prev) => prev.filter((r) => r.id !== recruitId));
      setTotalPoints((prev) => (prev !== null ? prev - pointsLost : 0));
    } catch (error) {
      console.error("❌ Error removing recruit", error);
    }
  };

  // ✅ Remove Contribution
  const removeContribution = async (
    contributionId: number,
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
      await axios.delete(`${API_URL}/contributions/remove`, {
        params: {
          contribution_id: contributionId,
          user_id: id,
        },
      });

      setContributions((prev) => prev.filter((c) => c.id !== contributionId));
      setTotalPoints((prev) => (prev !== null ? prev - pointsAwarded : 0));
    } catch (error) {
      console.error("❌ Error removing contribution", error);
    }
  };

  if (loading) return <div className="text-white">Loading...</div>;

  if (!user) return <div className="text-white">❌ User Not Found</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-4">{user.username}'s Profile</h1>
      <p className="text-lg">Total Points: {totalPoints}</p>

      {/* Contributions List */}
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

      {/* Recruited Players List */}
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

      {/* History Log */}
      {history.length > 0 && (
        <>
          <h2 className="text-xl font-bold mt-6">History</h2>
          <ul className="w-96">
            {history.map((h, index) => (
              <li
                key={index}
                className="p-2 bg-gray-800 border-b border-gray-700"
              >
                {h.action} - {new Date(h.created_at).toLocaleString()}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default UserProfile;
