import { StrictMode } from 'react'
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './index.css'
import App from './App.jsx'
import TestEnv from './Modules/PlayerBall.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/test",
    element: <TestEnv />,
  }
]);

createRoot(document.getElementById('root')).render(
    <RouterProvider router={router} />
)
