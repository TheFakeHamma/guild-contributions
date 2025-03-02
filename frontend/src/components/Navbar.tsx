import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="flex justify-between p-4 bg-gray-800 text-white">
      <h1 className="text-xl font-bold">Powerhouse Club</h1>
      <div className="space-x-4">
        <Link to="/">Home</Link>
        <Link to="/register">Register User</Link>
        <Link to="/leaderboard">Leaderboard</Link>
        <Link to="/recruitment">Recruit</Link>
        <Link to="/contribution">Contribute</Link>
        <Link to="/users">Users</Link>
      </div>
    </nav>
  );
}

export default Navbar;
