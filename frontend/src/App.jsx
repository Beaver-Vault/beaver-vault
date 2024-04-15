import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import NavBar from "./components/NavBar";
import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";
import PasswordGenPage from "./pages/PasswordGenPage";
import EncryptionTestPage from "./pages/EncryptionTestPage";
import NewPasswordPage from "./pages/NewPasswordPage";
import NewCreditCardPage from "./pages/NewCreditCardPage";
import NewNotePage from "./pages/NewNotePage";
import CacheTestPage from "./pages/cacheTestPage";
import DataExport from "./pages/DataExportPage";
import DataImport from "./pages/DataImportPage";
import EditPasswordPage from "./pages/EditPasswordPage";
import EditNotePage from "./pages/EditNotePage";
import EditCreditCardPage from "./pages/EditCreditCardPage";
import TrashBin from "./pages/TrashBinPage";

function App() {
  const loggedInUser = useSelector((state) => state.auth.user);

  return (
    <div>
      <Router>
        {loggedInUser ? <NavBar /> : null}
        <Routes>
          <Route
            path="/"
            element={loggedInUser ? <HomePage /> : <LandingPage />}
          />
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
