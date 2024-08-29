import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./Api/Auth";
import { ListingProvider } from "./Api/Listing";
import { CandidateProvider } from "./Api/Candidate";
import { Menu } from "./Components/Menu";
import { Homepage } from "./Components/Homepage";
import Login from "./Components/Login";
import ListingsPage from "./Components/Listings";
import CandidatesPage from "./Components/Candidates";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ListingProvider>
          <CandidateProvider>
            <div id="app">
              <Menu />
              <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/listings" element={<ListingsPage />} />
                <Route path="/candidates" element={<CandidatesPage />} />
                <Route path="/login" element={<Login />} />
              </Routes>
            </div>
          </CandidateProvider>
        </ListingProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
