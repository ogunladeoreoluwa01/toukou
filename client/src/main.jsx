import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Error404 from "./pages/NotFound";
import AboutMePage from "./pages/aboutme";
import ContactUs from "./pages/contact";
import App from "./App";

import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error404 />,
  },
  {
    path: "/about",
    element: <AboutMePage />,
  },
  {
    path: "/contact",
    element: <ContactUs/>,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);