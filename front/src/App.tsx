import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppLayout from "./components/Layout.tsx";
import Auth from "./pages/auth/login.tsx";
import Overview from "./pages/dashboard/overview.tsx";
import WatchList from "./pages/dashboard/watchList.tsx";
import Index from "./pages/dashboard/index.tsx";
import Alert from "./pages/dashboard/alert.tsx";
import RegisterForm from "./pages/register/register.tsx";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Overview />} />
          <Route path="watch-list" element={<WatchList />} />
          <Route path="technical-index" element={<Index />} />
          <Route path="system-alert" element={<Alert />} />
        </Route>
      </Routes>
    </Router>
  );
}
