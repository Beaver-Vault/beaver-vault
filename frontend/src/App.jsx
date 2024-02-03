import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import NavBar from "./NavBar";
import LandingPage from "./LandingPage";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";
import HomePage from "./HomePage";
import PasswordGenPage from "./PasswordGenPage";
import EncryptionTestPage from "./EncryptionTestPage";
import NewPasswordPage from "./NewPasswordPage";

function App() {
  const loggedInUser = useSelector((state) => state.auth.user);

  return (
    <div>
      <Router>
        <NavBar />
        <Routes>
          <Route
            path="/"
            element={loggedInUser ? <HomePage /> : <LandingPage />}
          />
          <Route path="/login" element={<LoginPage />} />
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
