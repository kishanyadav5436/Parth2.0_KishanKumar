import { Link } from "react-router-dom";
import { Home, Search } from "lucide-react";
import { Button } from "../components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-black text-blue-600 dark:text-blue-400">404</h1>
        <h2 className="text-3xl font-bold mb-4 mt-4 text-slate-900 dark:text-white tracking-tight">Page Not Found</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md font-medium">
          The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 py-5 font-bold shadow-lg shadow-blue-600/20">
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Button>
          </Link>
          <Link to="/services">
            <Button variant="outline" className="rounded-xl px-6 py-5 font-bold dark:border-slate-700 dark:text-white dark:hover:bg-slate-800">
              <Search className="h-4 w-4 mr-2" />
              Browse Services
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
