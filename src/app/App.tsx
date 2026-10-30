import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { AppProviders } from "./AppProviders";
import { PwaUpdatePrompt } from "./PwaUpdatePrompt";
import { routes } from "./routes";

const router = createBrowserRouter(routes);

export const App = () => (
  <AppProviders>
    <PwaUpdatePrompt />
    <RouterProvider router={router} />
  </AppProviders>
);
