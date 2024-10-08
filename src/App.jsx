import React from 'react';
import './App.css'
import Navbar from './components/Navbar'
// import Login from './Components/LoginCard'
import Signup from './Components/SignupForm'
import Landing from './components/Landing'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ResetPassword from './Components/ResetPassword';
import AddAdminData from './Components/AddAdminData';

import Loginsss from './Components/loginsss';

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <> <Navbar /> <Landing /></>
    },

    {
      path: "/login",
      element: <> <Navbar /> <Loginsss/></>
    },
    {
      path: "/register",
      element: <> <Navbar /> <Signup/></>
    },
    {
      path: "/reset-password",
      element: <><Navbar/> <ResetPassword/></>
    },
    // {
    //   path: "/add-admin-data",
    //   element: <><Navbar/> <AddAdminData /></>
    // },

  ])


  return (
    <div className=' h-full w-full '>
      <RouterProvider router={router} />
   
    </div>

  )
}

export default App
