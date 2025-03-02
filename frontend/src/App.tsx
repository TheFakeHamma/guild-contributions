import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Leaderboard from "./pages/Leaderboard";
import Recruitment from "./pages/Recruitment";
import Contribution from "./pages/Contribution";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/recruitment" element={<Recruitment />} />
        <Route path="/contribution" element={<Contribution />} />
      </Routes>
    </Router>
  );
}

export default App;
