import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { AppContextProvider } from "./context/AppContext";

export default function App() {
  return (
    <AppContextProvider>
      <RouterProvider router={router} />
    </AppContextProvider>
  );
}
