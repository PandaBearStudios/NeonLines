import { StrictMode } from 'react'
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { insertCoin } from "playroomkit"
import './index.css'
import App from './App.jsx'
import TestEnv from './Modules/TestEnv.jsx'

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

insertCoin({
  skipLobby: true,
}).then(() => {
  createRoot(document.getElementById('root')).render(
    <RouterProvider router={router} />
)
})


