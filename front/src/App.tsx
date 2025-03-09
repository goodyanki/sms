import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppLayout from "./components/Layout.tsx";

import Overview from "./pages/overview.tsx";
import WatchList from "./pages/watchList.tsx";
import Index from "./pages/index.tsx";
import Alert from "./pages/alert.tsx";

export default function App() {
  return (
      <Router>
        <Routes>
=          <Route path="/" element={<AppLayout />}>
            <Route index element={<Overview />} />
            <Route path="watch-list" element={<WatchList />} />
            <Route path="technical-index" element={<Index />} />
            <Route path="system-alert" element={<Alert />} />
          </Route>
        </Routes>
      </Router>
  );
}