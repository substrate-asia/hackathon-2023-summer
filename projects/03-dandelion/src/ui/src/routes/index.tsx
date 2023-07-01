import App from "App";
import AirDropDetail from "pages/airDropDetail/AirDropDetail";
import AirDropList from "pages/airDropList/AirDropList";
import ListAndAssets from "pages/airDropList/ListAndAssets";
import Home from "pages/home/Home";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/list",
        element: <AirDropList />,
        children: [
          {
            path: "",
            element: <ListAndAssets />,
          },
          {
            path: "airdrop/:id",
            element: <AirDropDetail />,
          },
        ],
      },
    ],
  },
]);
export default function Router() {
  return <RouterProvider router={router} />;
}
