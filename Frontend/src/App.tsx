import { Navigate, Route, Routes } from "react-router-dom";
import Homepage from "./Pages/HomePage";
import LoginPage from "./Pages/LoginPage";
import Navbar from "./Components/Navbar";
import { useUserStore } from "./Stores/useUserStore";

function App() {
  const { user } = useUserStore();
  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden ">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-slate-800 from-green-900" />
        </div>
      </div>
      <div className="relative z-50 pt-20">
        <Navbar/>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
