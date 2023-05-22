import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import "./App.css";
import { Home } from "./pages/Home/Home";
import { Profile } from "./pages/Profile/Profile";
import { Explore } from "./pages/Explore/Explore";
import { Signin } from "./pages/Signin/Signin";
import { Signup } from "./pages/Signup/Signup";
import { Navbar } from "./components/Navbar/Navbar";
import { Error } from "./pages/Error/Error";
import { Toaster } from "react-hot-toast";

const Layout = () => {
  return (
    <div className="md:w-8/12 mx-auto">
      <Navbar />
      <Outlet></Outlet>
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/profile/:id",
        element: <Profile />,
      },
      {
        path: "/explore",
        element: <Explore />,
      },
      {
        path: "/signin",
        element: <Signin />,
      },
      {
        path: "/signout",
        element: <Signin />,
      },
    ],
  },
]);

function App() {
  return (
    <div>
      <Toaster />
      <RouterProvider router={router}></RouterProvider>
    </div>
  );
}

export default App;
