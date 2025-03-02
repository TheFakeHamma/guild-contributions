/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import contributionData from "../data/contributions.json";
import { User, ContributionItem } from "../types";

const API_URL = import.meta.env.VITE_API_URL;

function Contribution() {
  const [users, setUsers] = useState<{ value: number; label: string }[]>([]);
  const [selectedUser, setSelectedUser] = useState<{
    value: number;
    label: string;
  } | null>(null);
  const [selectedItem, setSelectedItem] = useState<ContributionItem | null>(
    null
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get<User[]>(`${API_URL}/users/all`).then((response) => {
      setUsers(
        response.data.map((user) => ({ value: user.id, label: user.username }))
      );
    });
  }, []);

  const items: ContributionItem[] = contributionData.map((item) => ({
    value: item.name,
    label: `x${item.amount} ${item.name} - (+${item.points} points)`, // ✅ Display amount in dropdown
    amount: item.amount,
    points: item.points,
  }));

  const handleContribution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !selectedItem) {
      setMessage("❌ Please select a user and an item.");
      return;
    }

    const totalPoints = quantity * selectedItem.points; // ✅ Correctly calculates total points

    try {
      const response = await axios.post(`${API_URL}/contributions/contribute`, {
        user_id: selectedUser.value,
        item_name: selectedItem.value,
        quantity,
        points_awarded: totalPoints,
      });
      setMessage(
        `✅ ${quantity}x ${response.data.item_name} contributed! Total Points: ${totalPoints}`
      );
    } catch (error) {
      setMessage("❌ Error adding contribution");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold">Submit Contribution</h1>
      <form
        onSubmit={handleContribution}
        className="flex flex-col gap-4 mt-6 w-96"
      >
        <Select
          options={users}
          value={selectedUser}
          onChange={setSelectedUser}
          placeholder="Select User..."
          isSearchable
          className="text-black"
        />
        <Select
          options={items}
          value={selectedItem}
          onChange={(selected) => setSelectedItem(selected as ContributionItem)}
          placeholder="Select Item..."
          isSearchable
          className="text-black"
        />
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
          required
          className="p-2 bg-gray-800 border border-gray-700 rounded"
          placeholder="Enter quantity"
        />
        <p>Total Points: {selectedItem ? quantity * selectedItem.points : 0}</p>
        <button
          type="submit"
          className="p-2 bg-green-600 rounded hover:bg-green-700"
        >
          Submit Contribution
        </button>
      </form>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}

export default Contribution;
