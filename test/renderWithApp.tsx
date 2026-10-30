import type { ReactElement } from "react";
import { render } from "@testing-library/react";
import { createMemoryRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { AppProviders } from "@/app/AppProviders";

/** Renders one component inside the real providers and a router (for useNavigate etc.). */
export const renderWithApp = (ui: ReactElement, { path = "/" }: { path?: string } = {}) => {
  const router = createMemoryRouter([{ path: "*", element: ui }], { initialEntries: [path] });
  return render(
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>,
  );
};
