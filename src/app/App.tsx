import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { AdminLayout } from "../layouts/AdminLayout";
import { Dashboard } from "../pages/Dashboard";
import { CodingArena } from "../pages/CodingArena";
import { SubjectSubDashboard } from "../pages/SubjectSubDashboard";
import { AiInterview } from "../pages/AiInterview";
import { AiResume } from "../pages/AiResume";
import { LearningHub } from "../pages/LearningHub";
import { Analytics } from "../pages/Analytics";
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";
import { Landing } from "../pages/Landing";
import { AppProvider } from "../context/AppContext";
import { Assessments } from "../pages/Assessments";
import { CalendarView } from "../pages/CalendarView";
import { Achievements } from "../pages/Achievements";
import { Notifications } from "../pages/Notifications";
import { Leaderboard } from "../pages/Leaderboard";
import { AssessmentRunner } from "../pages/AssessmentRunner";
import { AdminDashboard } from "../pages/AdminDashboard";
import { AdminOverview } from "../pages/AdminOverview";
import { AdminUsers } from "../pages/AdminUsers";
import { AdminSettings } from "../pages/AdminSettings";

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<Landing />} />
            
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="learning-hub" element={<LearningHub />} />
              <Route path="/learning-hub/:subject" element={<SubjectSubDashboard />} />
              <Route path="coding/:problemId" element={<CodingArena />} />
              <Route path="coding" element={<CodingArena />} />
              <Route path="/interview" element={<AiInterview />} />
              <Route path="/resume" element={<AiResume />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/assessments" element={<Assessments />} />
              <Route path="/assessment/:assessmentId" element={<AssessmentRunner />} />
              <Route path="/calendar" element={<CalendarView />} />
              <Route path="/achievements" element={<Achievements />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
            </Route>

            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminOverview />} />
              <Route path="/admin/content" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AppProvider>
  );
}
