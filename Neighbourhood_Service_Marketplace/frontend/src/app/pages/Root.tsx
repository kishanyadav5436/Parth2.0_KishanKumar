import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AIServiceAssistant from "../components/AIServiceAssistant";
import ScrollToTop from "../components/ScrollToTop";

export default function Root() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 flex flex-col">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <AIServiceAssistant />
    </div>
  );
}

