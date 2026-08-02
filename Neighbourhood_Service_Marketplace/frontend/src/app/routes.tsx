import { createBrowserRouter } from "react-router-dom";
import Auth from "./pages/Auth";
import Booking from "./pages/Booking";
import Home from "./pages/Home";
import MyBookings from "./pages/MyBookings";
import NotFound from "./pages/NotFound";
import ProviderProfile from "./pages/ProviderProfile";
import Root from "./pages/Root";
import ServiceListings from "./pages/ServiceListings";
import Settings from "./pages/Settings";
import Support from "./pages/Support";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "services", Component: ServiceListings },
      { path: "services/:category", Component: ServiceListings },
      { path: "provider/:id", Component: ProviderProfile },
      { path: "booking/:serviceId", Component: Booking },
      { path: "bookings", Component: MyBookings },
      { path: "auth", Component: Auth },
      { path: "settings", Component: Settings },
      { path: "support", Component: Support },
      { path: "*", Component: NotFound },
    ],
  },
]);

