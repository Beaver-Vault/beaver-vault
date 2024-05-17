import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import NavBar from "./components/NavBar";
import LandingPage from "./pages/LandingPage";
import HomePage_new from "./pages/HomePage_new";
import PasswordGenPage from "./pages/PasswordGenPage";
import EncryptionTestPage from "./pages/EncryptionTestPage";
import DataExport from "./pages/DataExportPage";
import DataImport from "./pages/DataImportPage";
import TrashBin from "./pages/TrashBinPage";
import EditAccountPage from "./pages/EditAccountPage";
import SnackbarManager from "./components/SnackbarManager";
import PrivateRoute from "./components/PrivateRoute";

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
          <Route path="/passwordgen" element={<PrivateRoute />}>
            <Route path="" element={<PasswordGenPage />} />
          </Route>
          <Route path="/encryptiontest" element={<PrivateRoute />}>
            <Route path="" element={<EncryptionTestPage />} />
          </Route>
          <Route path="/dataexport" element={<PrivateRoute />}>
            <Route path="" element={<DataExport />} />
          </Route>
          <Route path="/dataimport" element={<PrivateRoute />}>
            <Route path="" element={<DataImport />} />
          </Route>
          <Route path="/trashbin" element={<PrivateRoute />}>
            <Route path="" element={<TrashBin />} />
          </Route>
          <Route path="/editaccount" element={<PrivateRoute />}>
            <Route path="" element={<EditAccountPage />} />
          </Route>
        </Routes>
      </Router>
      <SnackbarManager />
    </div>
  );
}

export default App;
