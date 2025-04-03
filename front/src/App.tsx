import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import AppLayout from "./components/Layout.tsx";
import Auth from "./pages/auth/Auth.tsx";
import Overview from "./pages/dashboard/overview";
import WatchList from "./pages/dashboard/watchList.tsx";
import Index from "./pages/dashboard/index.tsx";
import Alert from "./pages/dashboard/alert.tsx";
import RegisterForm from "./pages/register/register.tsx";
import Sim from "./pages/dashboard/sim.tsx";


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/auth" replace />} />

        <Route path="/auth" element={<Auth />} />
        <Route path="/register" element={<RegisterForm />} />

        <Route path="/dashboard" element={<AppLayout />}>
          <Route index element={<Overview />} />
          <Route path="watch-list" element={<WatchList />} />
          <Route path="technical-index" element={<Index />} />
          <Route path="system-alert" element={<Alert />} />
          <Route path="paper_trading" element={<Sim />} />
        </Route>
      </Routes>
    </Router>
  );
}