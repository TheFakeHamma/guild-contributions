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
  recruit_name: string;
}

function UserProfile() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [recruitedPlayers, setRecruitedPlayers] = useState<RecruitedPlayer[]>(
    []
  );
  const [totalPoints, setTotalPoints] = useState<number>(0);

  useEffect(() => {
    // Fetch user details
    axios
      .get<User>(`${API_URL}/users/${id}`)
      .then((response) => setUser(response.data));

    // Fetch user contributions
    axios
      .get<Contribution[]>(`${API_URL}/contributions/user/${id}`)
      .then((response) => setContributions(response.data));

    // Fetch recruited players
    axios
      .get<RecruitedPlayer[]>(`${API_URL}/recruitments/user/${id}`)
      .then((response) => setRecruitedPlayers(response.data));

    // Fetch total points
    axios
      .get<{ points: number }>(`${API_URL}/campaign/progress/${id}`)
      .then((response) => setTotalPoints(response.data.points));
  }, [id]);

  if (!user) return <div className="text-white">Loading...</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-4">{user.username}'s Profile</h1>
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
        {recruitedPlayers.map((r, index) => (
          <li key={index} className="p-2 bg-gray-800 border-b border-gray-700">
            {r.recruit_name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserProfile;
