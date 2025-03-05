import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { User } from "../types";

const API_URL = import.meta.env.VITE_API_URL;

function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [pointsMap, setPointsMap] = useState<Record<number, number>>({}); // Store points per user

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersRes = await axios.get<User[]>(`${API_URL}/users/all`);
        setUsers(usersRes.data);

        // Fetch points for all users in parallel
        const pointsPromises = usersRes.data.map(async (user) => {
          try {
            const pointsRes = await axios.get<{ points: number }>(
              `${API_URL}/campaign/progress/${user.id}`
            );
            return { userId: user.id, points: pointsRes.data.points ?? 0 };
          } catch (error) {
            console.error(
              `❌ Error fetching points for ${user.username}`,
              error
            );
            return { userId: user.id, points: 0 }; // Default to 0 if error
          }
        });

        // Map results to a dictionary
        const pointsData = await Promise.all(pointsPromises);
        const pointsDict: Record<number, number> = {};
        pointsData.forEach(({ userId, points }) => {
          pointsDict[userId] = points;
        });

        setPointsMap(pointsDict);
      } catch (error) {
        console.error("❌ Error fetching users", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">Users List</h1>
      <ul className="w-96">
        {users.map((user) => (
          <li
            key={user.id}
            className="p-2 bg-gray-800 border-b border-gray-700 flex justify-between"
          >
            <Link to={`/users/${user.id}`} className="hover:underline">
              {user.username}
            </Link>
            <span className="text-green-400">⭐ {pointsMap[user.id] ?? 0}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Users;
