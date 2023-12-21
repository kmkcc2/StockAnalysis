import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./index.css";
import React from "react";

import RootLayout from "./pages/Root";
import TopTrendingsList from "./components/guest/topTrendings/TopTrendingsList";
import GuestAnalysis from "./components/guest/guestAnalisys/GuestAnalisys";
import UserDetails from "./components/admin/userDetails/UserDetails";
import Guest from "./pages/Guest";
import User from "./pages/User";
import Admin from "./pages/Admin";
import CompanyInfo from "./components/user/company/CompanyInfo";
import Backup from "./components/admin/backup/Backup";
import UserList from "./components/admin/userlist/UserList";
import Payments from "./components/admin/payments/Payments";
import Register from "./components/global/authentication/login/Register";
import Login from "./components/global/authentication/login/Login";
import ContactForm from "./components/user/contact/ContactForm";
import Compare from "./components/user/compare/Compare";
import SearchForCompanyMain from "./components/user/searchBar/SearchForCompanyMain";
import UserDashboard from "./components/user/userPage/UserDashboard";
import Payment from "./pages/Payment";
import Graph from "./components/global/graphs/Graph";
import PasswordReset from "./components/global/authentication/login/PasswordReset";


const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      //free
      {
        path: "/",
        element: <Guest />,
        //   loader: recipeLoader,
        children: [
          {
            path: "trendings",
            element: <TopTrendingsList />,
          },
          {
            path: "contact",
            element: <ContactForm />

          },
          {
            path: ':symbol',
            element: <GuestAnalysis />,
          },
          {
            path: 'graph',
            element: <Graph />
          },
          {
            path: 'login',
            element: <Login />
          },
          {
            path: 'register',
            element: <Register />
          },
          {
            path: 'password-reset',
            element: <PasswordReset />
          }
        ],
      },
      {
        path: "/user/",
        element: <User />,
        //   loader: getRecipeLoader,
        id: "userRoot",
        children: [
          {
            path: "search",
            element: <SearchForCompanyMain />,
            //   action: deleteRecipeAction,
            children: [
              {
                path: ":symbol",
                element: <CompanyInfo />,
              },
            ],

          },
          {
            path: ':id',
            element: <UserDashboard />
          },
          {
            path: 'graph',
            element: <Graph />
          },

          {
            path: "trendings",
            element: <TopTrendingsList />,
            children: [
              {
                path: ":symbol",
                element: <CompanyInfo />,
              },
            ],
          },
          {
            path: "compare",
              element: <Compare />,
            //   action: editRecipeAction,
          },
          {
            path: "pdf",
            //   element: <EditRecipe />,
            //   action: editRecipeAction,
          },
          {
            path: "contact",
              element: <ContactForm />,
            //   action: editRecipeAction,
          },
          {
            path: "logout",
            //   element: <EditRecipe />,
            //   action: editRecipeAction,
          },
        ],
      },
      {
        path: '/admin',
        element: <Admin />,
        children: [
            {
                path: 'backup',
                element: <Backup />
            },
            {
                path: 'users',
                element: <UserList />,
            },
            {
                path: 'users/:id',
                element: <UserDetails />
            },
            {
                path: 'payments',
                element: <Payments />,
            },
            {
                path: 'logout',
            }
        ]
      },
      {
        path: 'payment',
        element: <Payment />
      }
    ],
  },
]);
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
