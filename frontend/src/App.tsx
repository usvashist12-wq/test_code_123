import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import LoginPage from "@/pages/LoginPage";
import FeedPage from "@/pages/FeedPage";

// One <Route> per page in src/pages; BrowserRouter already wraps this in main.tsx.
export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/feed" element={<FeedPage />} />
      </Routes>
      <Toaster />
    </>
  );
}
