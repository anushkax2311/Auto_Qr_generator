import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Subscribe from "./pages/Subscribe";
import PublicQR from "./pages/PublicQR";
import "./index.css";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public QR page — no navbar */}
          <Route path="/qr/:uid" element={<PublicQR />} />

          {/* All other pages with navbar */}
          <Route path="/*" element={
            <>
              <Navbar />
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={
                  <PrivateRoute><Dashboard /></PrivateRoute>
                } />
                <Route path="/subscribe" element={
                  <PrivateRoute><Subscribe /></PrivateRoute>
                } />
              </Routes>
            </>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
