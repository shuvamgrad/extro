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
  EditAccount,
  ImportAccount,
  ManageAccounts,
  ReceiveSol,
  SendSol,
  SettingView,
} from "./account";

const router = createHashRouter([
  {
    element: <Outlet />,
    children: [
      {
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
        path: "import-account",
        element: <ImportAccount />,
      },
      {
        path: "receive-sol",
        element: <ReceiveSol />,
      },
      {
        path: "settings",
        element: <SettingView />,
      },
      {
        path: "manage_account",
        element: <ManageAccounts />,
      },
      {
        path: "edit_account",
        element: <EditAccount />,
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
