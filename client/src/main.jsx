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
import GetUsersProfile from "./pages/usersPage";
import UserProfilePage from "./pages/userDashboard";
import Admindashboard from "./pages/adminDashboard";
import BanUser from "./pages/adminDashboardPages/banUser";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import UnBanUser from "./pages/adminDashboardPages/unbanUser";
import MakeAdmin from "./pages/adminDashboardPages/promoteAdmin";
import DemoteAdmin from "./pages/adminDashboardPages/demoteAdmin";
import DeleteUserBySupAdmin from "./pages/adminDashboardPages/deleteUser";
import CreatePost from "./pages/createPostPage";
import AddPostImage from "./pages/addPostImage";
import Demos from "./pages/demos";


const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error404 />,
  },
  {
    path: "/demos",
    element: <Demos />,
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
    path: "/user/:userId",
    element: <GetUsersProfile />,
  },
  {
    path: "/yourprofile/:username",
    element: <UserProfilePage />,
  },
  {
    path: "/admindashboard",
    element: <Admindashboard />,
    children:[
      {
        path: "/admindashboard/ban-user",
    element:<BanUser /> ,
      },
      {
        path: "/admindashboard/unban-user",
    element:<UnBanUser />,
      },
      {
        path: "/admindashboard/promote-admin",
    element:<MakeAdmin />,
      },
      {
        path: "/admindashboard/demote-admin",
    element:<DemoteAdmin/>,
      },
      {
        path: "/admindashboard/delete-user",
    element:<DeleteUserBySupAdmin/>,
      },
    ],
   
  },
  {
    path: "/createpost",
element:<CreatePost/>,
  },
  {
    path: "/addpostImage/:postId",
element:<AddPostImage/>,
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
