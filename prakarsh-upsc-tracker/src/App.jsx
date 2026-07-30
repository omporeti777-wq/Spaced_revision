import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DataProvider } from "./context/DataContext";
import PageWrapper from "./components/layout/PageWrapper";
import Dashboard from "./pages/Dashboard";
import TodayTasks from "./pages/TodayTasks";
import CalendarPage from "./pages/CalendarPage";
import AddLecture from "./pages/AddLecture";
import Subjects from "./pages/Subjects";
import SubjectDetail from "./pages/SubjectDetail";
import Statistics from "./pages/Statistics";
import Settings from "./pages/Settings";
import HabitTracker from "./pages/HabitTracker";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./auth/ProtectedRoute";
export default function App() {
  return (
    <DataProvider>
      <BrowserRouter>
        <Routes>
  <Route path="/login" element={<Login />} />
  <Route path="/signup" element={<Signup />} />

  <Route
    element={
      <ProtectedRoute>
        <PageWrapper />
      </ProtectedRoute>
    }
  >
    <Route path="/" element={<Dashboard />} />
    <Route path="/today" element={<TodayTasks />} />
    <Route path="/calendar" element={<CalendarPage />} />
    <Route path="/add-lecture" element={<AddLecture />} />
    <Route path="/subjects" element={<Subjects />} />
    <Route path="/subjects/:subjectId" element={<SubjectDetail />} />
    <Route path="/habits" element={<HabitTracker />} />
    <Route path="/statistics" element={<Statistics />} />
    <Route path="/settings" element={<Settings />} />
  </Route>
</Routes>
      </BrowserRouter>
    </DataProvider>
  );
}
