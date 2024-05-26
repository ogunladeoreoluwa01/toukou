import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Error404 from "./pages/NotFound";
import AboutMePage from "./pages/aboutme";
import ContactUs from "./pages/contact";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import App from "./App";
import store from "./stores";
import { Provider } from "react-redux";
import "./index.css";
import AllBlogs from "./pages/allBlogs";
import Blogs from "./pages/blogView";
import AuthorsProfilePage from "./pages/userPage";
import UserProfilePage from "./pages/userDashboard";
import Admindashboard from "./pages/adminDashboard";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';


const queryClient = new QueryClient();

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
    element: <ContactUs />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/allblogs",
    element: <AllBlogs />,
  },
  {
    path: "/blogview/:blogId",
    element: <Blogs />,
  },
  {
    path: "/authorsprofile/:authorId",
    element: <AuthorsProfilePage />,
  },
  {
    path: "/userprofile",
    element: <UserProfilePage />,
  },
  {
    path: "/admindashboard",
    element: <Admindashboard />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
);
