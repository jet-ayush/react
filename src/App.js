import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import X from "./adminDashboard";
import Y from "./studentDashboard";
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<X />} />
        <Route path="/studentDashboard" element={<Y />} />
      </Routes>
    </Router>
  );
}
