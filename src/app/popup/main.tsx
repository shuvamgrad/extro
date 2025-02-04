import React from "react";
import ReactDOM from "react-dom/client";
import {
  Navigate,
  Outlet,
  RouterProvider,
  createHashRouter,
} from "react-router-dom";
import { Layout } from "~/components/layout/layout";
import {
  Account,
  AccountOptions,
  CreateAccount,
  ReceiveSol,
  SendSol,
} from "./account";

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
        path: "add-options",
        element: <AccountOptions />,
      },
      {
        path: "create-account",
        element: <CreateAccount />,
      },
      {
        path: "send-sol",
        element: <SendSol />,
      },
      {
        path: "receive-sol",
        element: <ReceiveSol />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Layout>
      <RouterProvider router={router} />
    </Layout>
  </React.StrictMode>
);
