import React from "react";
import ReactDOM from "react-dom/client";
import {
  Navigate,
  Outlet,
  RouterProvider,
  createHashRouter,
} from "react-router-dom";
import { Account, CreateAccount } from "./account";

const router = createHashRouter([
  {
    // You can give a path here if needed, e.g. path: "/"
    element: <Outlet />,
    children: [
      {
        // Make the default path (index) redirect to "test":
        index: true,
        element: <Navigate to="account" replace />,
      },
      {
        path: "account",
        element: <Account />,
      },
      {
        path: "create-account",
        element: <CreateAccount />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
