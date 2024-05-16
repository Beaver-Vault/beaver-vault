import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import NavBar from "./components/NavBar";
import LandingPage from "./pages/LandingPage";
import HomePage_new from "./pages/HomePage_new";
import PasswordGenPage from "./pages/PasswordGenPage";
import EncryptionTestPage from "./pages/EncryptionTestPage";
import DataExport from "./pages/DataExportPage";
import DataImport from "./pages/DataImportPage";
import EditPasswordPage from "./pages/EditPasswordPage";
import EditNotePage from "./pages/EditNotePage";
import EditCreditCardPage from "./pages/EditCreditCardPage";
import TrashBin from "./pages/TrashBinPage";
import EditAccountPage from "./pages/EditAccountPage";

function App() {
  const loggedInUser = useSelector((state) => state.auth.accessToken);

  return (
    <div>
      <Router>
        {loggedInUser ? <NavBar /> : null}
        <Routes>
          <Route
            path="/"
            element={loggedInUser ? <HomePage_new /> : <LandingPage />}
          />
          <Route path="/passwordgen" element={<PasswordGenPage />} />
          <Route path="/encryptiontest" element={<EncryptionTestPage />} />
          <Route path="/dataexport" element={<DataExport />} />
          <Route path="/dataimport" element={<DataImport />} />
          <Route path="/editaccount" element={<EditAccountPage />} />
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
