import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { useState } from "react";
import NavBar from "./NavBar";
import LandingPage from "./LandingPage";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";
import HomePage from "./HomePage";
import PasswordGenPage from "./PasswordGenPage";
import EncryptionTestPage from "./EncryptionTestPage";
import NewPasswordPage from "./NewPasswordPage";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState({});

  return (
    <div>
      <Router>
        <NavBar
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          loggedInUser={loggedInUser}
        />
        <Routes>
          <Route
            path="/"
            element={
              isLoggedIn ? (
                <HomePage loggedInUser={loggedInUser} />
              ) : (
                <LandingPage />
              )
            }
          />
          <Route
            path="/login"
            element={
              <LoginPage
                setIsLoggedIn={setIsLoggedIn}
                setLoggedInUser={setLoggedInUser}
              />
            }
          />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/passwordgen" element={<PasswordGenPage />} />
          <Route path="/encryptiontest" element={<EncryptionTestPage />} />
          <Route path="/newpassword" element={<NewPasswordPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
