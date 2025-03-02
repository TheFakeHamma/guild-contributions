import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Leaderboard from "./pages/Leaderboard";
import Recruitment from "./pages/Recruitment";
import Contribution from "./pages/Contribution";
import Navbar from "./components/Navbar";
import Register from "./pages/Register";
import Users from "./pages/Users";
import UserProfile from "./pages/UserProfile";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/recruitment" element={<Recruitment />} />
        <Route path="/contribution" element={<Contribution />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<UserProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
