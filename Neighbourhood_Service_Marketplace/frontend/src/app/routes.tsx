import { createBrowserRouter } from "react-router-dom";
import Root from "./pages/Root";
import Home from "./pages/Home";
import ServiceListings from "./pages/ServiceListings";
import ProviderProfile from "./pages/ProviderProfile";
import Booking from "./pages/Booking";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";
import MyBookings from "./pages/MyBookings";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "services", Component: ServiceListings },
      { path: "services/:category", Component: ServiceListings },
      { path: "provider/:id", Component: ProviderProfile },
      { path: "booking/:providerId", Component: Booking },
      { path: "bookings", Component: MyBookings },
      { path: "auth", Component: Auth },
      { path: "settings", Component: Settings },
      { path: "*", Component: NotFound },
    ],
  },
]);
