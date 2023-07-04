import App from '../views/App';
import {
  createBrowserRouter,
} from "react-router-dom";

const router = createBrowserRouter([ 
  {
    path: "/",
    element: <App/>
  }
]);

export default router;