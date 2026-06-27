import { StrictMode } from 'react'
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { insertCoin } from "playroomkit"
import './index.css'
import App from './App.jsx'
import GameEnv from './Modules/GameEnv.jsx'
import HowToPlay from './Modules/HowToPlay.jsx';
import Settings from './Modules/Settings.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/game",
    element: <GameEnv />,
  },
  {
    path:'/how-to-play',
    element: <HowToPlay/>
  },
  {
    path:'/settings',
    element: <Settings/>
  }
]);

insertCoin({
  maxPlayersPerRoom: 2,
  skipLobby: true,
}).then(() => {
  createRoot(document.getElementById('root')).render(
    <RouterProvider router={router} />
)
})


