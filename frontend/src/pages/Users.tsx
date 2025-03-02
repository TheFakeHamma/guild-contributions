import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { User } from "../types";

const API_URL = import.meta.env.VITE_API_URL;

function Users() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    axios
      .get<User[]>(`${API_URL}/users/all`)
      .then((response) => setUsers(response.data));
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">Users List</h1>
      <ul className="w-96">
        {users.map((user) => (
          <li
            key={user.id}
            className="p-2 bg-gray-800 border-b border-gray-700"
          >
            <Link to={`/users/${user.id}`} className="hover:underline">
              {user.username}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Users;
