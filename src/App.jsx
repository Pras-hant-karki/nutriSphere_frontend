import React, { useContext } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import { UserContext } from "./context/UserContext";
import SigninPage from "./pages/SigninPage";
import SignupPage from "./pages/SignupPage";
import MainPage from "./pages/MainPage";

function App() {
  const { user, isLoading } = useContext(UserContext);

  if (isLoading) {
    return (
      <div className="min-h-[100vh] w-full bg-light-bg dark:bg-dark-bg flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <MainPage /> : <LandingPage />} />
        <Route
          path="/signin"
          element={user ? <Navigate to="/" /> : <SigninPage />}
        />
        <Route
          path="/signup"
          element={user ? <Navigate to="/" /> : <SignupPage />}
        />
      </Routes>
    </Router>
  );
}

export default App;
