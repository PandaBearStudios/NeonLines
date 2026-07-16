import { StrictMode } from 'react'
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { insertCoin } from "playroomkit"
import './index.css'
import App from './App.jsx'
import ChoiceOfPlay from './Modules/ChoiceOfPlay.jsx';
import GameEnv from './Modules/GameEnv.jsx'
import HowToPlay from './Modules/HowToPlay.jsx';
import Settings from './Modules/Settings.jsx';
import ErrorHandler from './Components/ErrorHandler.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorHandler />,
  },
  {
    path: "/game",
    element: <GameEnv />,
    errorElement: <ErrorHandler />,
  },
  {
    path:'/how-to-play',
    element: <HowToPlay/>,
    errorElement: <ErrorHandler />,
  },
  {
    path:'/settings',
    element: <Settings/>,
    errorElement: <ErrorHandler />,
  },
  {
    path: '/choice-of-play',
    element: <ChoiceOfPlay/>
  }
]);

insertCoin({
  maxPlayersPerRoom: 2,
  skipLobby: true,
}).then(() => {
  createRoot(document.getElementById('root')).render(
        <RouterProvider router={router} />
  )
}).catch((error) => {
  console.error('Failed to initialize Playroom:', error);
})


