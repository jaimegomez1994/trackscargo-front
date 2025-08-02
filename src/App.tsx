import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import "./App.css";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";
import { useAppDispatch } from "./store/hooks";
import { initializeAuth } from "./store/slices/authSlice";

function App() {
  const dispatch = useAppDispatch();

  // Initialize auth state on app start
  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  return (
    <Router>
      <div className="min-h-screen">
        <Navbar />

        {/* Routes */}
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          
          {/* Guest Only Routes (redirect to dashboard if logged in) */}
          <Route 
            path="/login" 
            element={
              <GuestRoute>
                <Login />
              </GuestRoute>
            } 
          />
          <Route 
            path="/signup" 
            element={
              <GuestRoute>
                <Signup />
              </GuestRoute>
            } 
          />
          
          {/* Protected Routes (require authentication) */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
