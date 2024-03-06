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
import NewCreditCardPage from "./NewCreditCardPage";
import NewNotePage from "./NewNotePage";
import CacheTestPage from "./cacheTestPage";
import DataExport from "./DataExport";
import DataImport from "./DataImport";
import EditPasswordPage from "./EditPasswordPage";
import EditNotePage from "./EditNotePage";
import EditCreditCardPage from "./EditCreditCardPage";
import TrashBin from "./TrashBin";

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
          <Route path="/newcreditcard" element={<NewCreditCardPage />} />
          <Route path="/newnote" element={<NewNotePage />} />
          <Route path="/cache-test" element={<CacheTestPage />} />
          <Route path="/dataexport" element={<DataExport />} />
          <Route path="/dataimport" element={<DataImport />} />
          <Route path="/editpassword/:id" element={<EditPasswordPage />} />
          <Route path="/editnote/:id" element={<EditNotePage />} />
          <Route path="/editcreditcard/:id" element={<EditCreditCardPage />} />
          <Route path="/trashbin" element={<TrashBin />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
