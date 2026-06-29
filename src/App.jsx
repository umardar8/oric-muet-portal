import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// 1. IMPORT THE AUTH PROVIDER HERE
import { AuthProvider } from "./context/AuthContext"; 

import NewNavbar from "./components/NewNavbar";
import Stats from "./pages/Stats.jsx";
import ResearchThemes from "./pages/ResearchThemes.jsx";
import DirectorMsg from "./pages/DirectorMsg.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import SignUp from "./pages/SignUp.jsx";
import Hero1 from "./pages/Hero1.jsx";
import AboutUsPage from "./pages/AboutUsPage.jsx";
import OurTeamPage from "./pages/OurTeamPage.jsx";
import WhatIsIpo from "./pages/WhatIsIpo.jsx";
import IpTechPolicy from "./pages/IpTechPolicy.jsx";
import IndustrialCollaboration from "./pages/IndustrialCollobration.jsx";
import InstitutionalCollaboration from "./pages/InstitutionalCollaboration.jsx";
import OtherCollaboration from "./pages/OtherCollobration.jsx";
import Login from "./pages/Login.jsx";
import FundOpportunity from "./pages/FundOpportunity.jsx";
import FundProjects from "./pages/FundProjects.jsx";
import ResearchJournals from "./pages/ResearchJournals.jsx";
import WhatWeDo from "./pages/WhatWeDo.jsx";
import NewsAndEvents from "./pages/NewsAndEvents.jsx";
import ContactUsPage from "./pages/ContactUsPage.jsx";
import Sidebar from "./components/Sidebar.jsx";

import DashboardLayout from './components/DashboardLayout';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    // 2. WRAP THE ENTIRE APP IN AuthProvider
    <AuthProvider>
      <Router>
        <div className="bg-black">
          <Routes>
            {/* Home Page */}
            <Route
              path="/"
              element={
                <>
                  <NewNavbar>
                    <Hero1 />
                    <DirectorMsg />
                    <Stats />
                    <AboutUs />
                    <ResearchThemes />
                  </NewNavbar>
                </>
              }
            />

            <Route
              path="/dashboard"
              element={<DashboardLayout />}
            >
              <Route index element={<Dashboard />} />
              <Route path=":featureKey" element={<Dashboard />} />
            </Route>

            {/* Contact Us */}
            <Route
              path="/contact"
              element={
                <NewNavbar>
                  <ContactUsPage />
                </NewNavbar>
              }
            />

            {/* /news-events */}
            <Route
              path="/news-events"
              element={
                <NewNavbar>
                  {" "}
                  <NewsAndEvents />
                </NewNavbar>
              }
            />

            {/* /bic/what-we-do */}
            <Route
              path="/bic/what-we-do"
              element={
                <NewNavbar>
                  <WhatWeDo />
                </NewNavbar>
              }
            />

            {/* Research Journals */}
            <Route
              path="/research-innovation/research-journals"
              element={
                <NewNavbar>
                  <ResearchJournals />
                </NewNavbar>
              }
            />

            {/* FundProjects */}
            <Route
              path="/research-innovation/funded-projects"
              element={
                <NewNavbar>
                  <FundProjects />
                </NewNavbar>
              }
            />

            {/* FundOpportunity */}
            <Route
              path="/research-innovation/funded-opportunity"
              element={
                <NewNavbar>
                  <FundOpportunity />
                </NewNavbar>
              }
            />

            {/* OtherCollaboration */}
            <Route
              path="/collaboration/other-collaboration"
              element={
                <NewNavbar>
                  <OtherCollaboration />
                </NewNavbar>
              }
            />

            {/* institutional-collaboration */}
            <Route
              path="/collaboration/institutional-collobration"
              element={
                <NewNavbar>
                  <InstitutionalCollaboration />
                </NewNavbar>
              }
            />

            {/* industrial-collaboration */}
            <Route
              path="/collaboration/industrial-collobration"
              element={
                <NewNavbar>
                  <IndustrialCollaboration />
                </NewNavbar>
              }
            />

            {/* IPo Policy */}
            <Route
              path="/about/ip-tech-policy"
              element={
                <NewNavbar>
                  <IpTechPolicy />
                </NewNavbar>
              }
            />

            {/* what-is-ipo */}
            <Route
              path="/about/what-is-ipo"
              element={
                <NewNavbar>
                  <WhatIsIpo />
                </NewNavbar>
              }
            />

            {/* OurTeam Page */}
            <Route
              path="/about/team"
              element={
                <NewNavbar>
                  <OurTeamPage />
                </NewNavbar>
              }
            />

            {/* AboutUs Page */}
            <Route
              path="/aboutus"
              element={
                <NewNavbar>
                  <AboutUsPage />
                </NewNavbar>
              }
            />

            {/* Signup Page */}
            <Route
              path="/signup"
              element={
                <NewNavbar>
                  <SignUp />
                </NewNavbar>
              }
            />
            <Route
              path="/login"
              element={
                <NewNavbar>
                  <Login />
                </NewNavbar>
              }
            />
            <Route path="/sidebar" element={<Sidebar />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
