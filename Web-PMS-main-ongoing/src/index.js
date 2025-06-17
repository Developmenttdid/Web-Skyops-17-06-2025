import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes, Outlet } from 'react-router-dom';
import './index.css';
import App from './pages/App';
import Homepage from './pages/Homepage';
import Project from './pages/Project';
import Company from './pages/Company';
import Header from './components/Header';
import Checklistdb from './pages/Flightdatabase/Flightdb';
import Map from './pages/Map';
import Profile from './pages/Profile';
import ProjectStatus from './pages/Project Config/projectstatus';
import reportWebVitals from './reportWebVitals';
import ProfileNav from './components/profilenav';
import ChangePassword from './pages/ChangePassword';
import ProjectLogbook from './pages/Flightdatabase/Projectlog';
import UAVLogbook from './pages/Flightdatabase/Uavlog';
import FlightRecord from './pages/Flightdatabase/Flightrec';
import ConfigNav from './components/confignav';
import ProjectTimeline from './pages/Project Config/projecttimeline';
import Personnel from './pages/Project Config/personnel';
import Equipment from './pages/Project Config/equipment';
import LegalDocument from './pages/Project Config/legaldoc';
import ForgotPassword from './pages/forgotpassword';
import EquipmentCompany from './pages/Company/Equipment';
import PersonnelCompany from './pages/Company/Personnel';
import ProjectStatusCompany from './pages/Company/ProjectStatus';
import OperationManualCompany from './pages/Company/OperationManual';
import SOP from './pages/Company/SOP';
import PrivateRoutes from "./utils/PrivateRoutes";
import { AuthProvider } from "./utils/AuthProvider";
import Equipment_db from './pages/Project_Config_Db/equipment_db';
import LegalDocument_db from './pages/Project_Config_Db/legaldoc_db';
import Personnel_db from './pages/Project_Config_Db/personnel_db';
import ProjectStatus_db from './pages/Project_Config_Db/projectstatus_db';
import ProjectTimeline_db from './pages/Project_Config_Db/projecttimeline_db';
import  ConfigNav_db from './components/confignav_db';

const root = ReactDOM.createRoot(document.getElementById('root'));


root.render(
  <React.StrictMode>
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<App />} />
          <Route path="/ForgotPassword" element={<ForgotPassword />} />

          {/* 🔥 Wrap ALL protected routes inside PrivateRoutes */}
          <Route element={<PrivateRoutes />}>
            <Route element={<HeaderLayout />}>
              <Route path="/Homepage" element={<Homepage />} />
              <Route path="/Project" element={<Project />} />
              <Route element={<NavconfigLayout />}>
                <Route path="/Project/ProjectStatus" element={<ProjectStatus />} />
                <Route path="/Project/ProjectTimeline" element={<ProjectTimeline />} />
                <Route path="/Project/Personnel" element={<Personnel />} />
                <Route path="/Project/Equipment" element={<Equipment />} />
                <Route path="/Project/LegalDocument" element={<LegalDocument />} />
              </Route>

              <Route element={<NavconfigLayout_db />}>
                <Route path="/Project/ProjectStatus_db" element={<ProjectStatus_db />} />
                <Route path="/Project/ProjectTimeline_db" element={<ProjectTimeline_db />} />
                <Route path="/Project/Personnel_db" element={<Personnel_db />} />
                <Route path="/Project/Equipment_db" element={<Equipment_db />} />
                <Route path="/Project/LegalDocument_db" element={<LegalDocument_db />} />
              </Route>

              <Route path="/Company" element={<Company />} />
              <Route path="/FlightDatabase" element={<Checklistdb />} />
              <Route path="/FlightDatabase/ProjectLogbook" element={<ProjectLogbook />} />
              <Route path="/FlightDatabase/UAVLogbook" element={<UAVLogbook />} />
              <Route path="/FlightDatabase/FlightRecord" element={<FlightRecord />} />
              <Route path="/Map" element={<Map />} />

              {/* ✅ Now NavprofileLayout is inside PrivateRoutes */}
              <Route element={<NavprofileLayout />}>
                <Route path="/Profile/AccountDetails" element={<Profile />} />
                <Route path="/Profile/ChangePassword" element={<ChangePassword />} />
              </Route>

              <Route path="/Company/Equipment" element={<EquipmentCompany />} />
              <Route path="/Company/Personnel" element={<PersonnelCompany />} />
              <Route path="/Company/ProjectStatus" element={<ProjectStatusCompany />} />
              <Route path="/Company/OperationManual" element={<OperationManualCompany />} />
              <Route path="/Company/SOP" element={<SOP />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>

  </React.StrictMode>
);

reportWebVitals();

function HeaderLayout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

function NavprofileLayout() {
  return (
    <div style={{ display: "flex" }}>
      <ProfileNav />
      <div style={{ flex: 1, padding: "20px" }}>
        <Outlet />
      </div>
    </div>
  );
}

function NavconfigLayout() {
  return (
    <div style={{ display: "flex" }}>
      <ConfigNav />
      <div style={{ flex: 1, padding: "20px" }}>
        <Outlet />
      </div>
    </div>
  );
}

function NavconfigLayout_db() {
  return (
    <div style={{ display: "flex" }}>
      <ConfigNav_db />
      <div style={{ flex: 1, padding: "20px" }}>
        <Outlet />
      </div>
    </div>
  );
}