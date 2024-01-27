import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import NavBar from "./NavBar";
import LandingPage from "./LandingPage";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";
import HomePage from "./HomePage";
import PasswordGenPage from "./PasswordGenPage";
import EncryptionTestPage from "./EncryptionTestPage";

function App() {
  const { user, isAuthenticated } = useAuth0();
  // const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div>
      <Router>
        <NavBar />
        <Routes>
          <Route
            path="/"
            element={isAuthenticated ? <HomePage /> : <LandingPage />}
          />
          {/* <Route
            path="/login"
            element={<LoginPage setIsLoggedIn={setIsLoggedIn} />}
          /> */}
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/passwordgen" element={<PasswordGenPage />} />
          <Route path="/encryptiontest" element={<EncryptionTestPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
