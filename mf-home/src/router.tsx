import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import NewPost from "./NewPost";
import ViewPost from "./ViewPost";

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />
    },
    {
        path:"/new-post",
        element: <NewPost />
    },
    {
        path: "/post/:postId",
        element: <ViewPost />
    }
]);


export default router;