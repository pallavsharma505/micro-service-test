import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"

type TPost = {
  _id: string;
  postId: string;
  title: string;
  description: string;
  comments: number;
}

function App() {
  const [posts, setPosts] = useState<TPost[] | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    fetch("http://localhost:14002")
    .then((res) => res.json())
    .then((data) => {
      setPosts(data);
    });
  },[]);
  return (
    <div className="w-full h-svh flex justify-center items-center bg-slate-950 text-white">
      <div className="w-3/4 bg-slate-900 p-4 rounded-md shadow-sm shadow-blue-900">
        <h1 className="text-3xl font-extrabold border-b mb-4 pb-4">All Posts:</h1>
        <div className="grid grid-cols-2 gap-4">
          {
            posts && posts.map((post) => (
              <div onClick={() => navigate(`/post/${post.postId}`)} className="transition-all ease-in-out duration-500 bg-slate-800 p-4 rounded-md cursor-pointer hover:bg-slate-600" key={post}>
                <div className="text-xl font-bold">{post.title}</div>
                <div className="text-sm font-extralight">{post.description}</div>
                <hr className="my-4" />
                <div>{post.comments} Comments</div>
              </div>
            ))
          }
          {
            posts &&
            <div onClick={() => navigate("/new-post")} className="flex justify-center items-center transition-all ease-in-out duration-500 bg-slate-800 p-4 rounded-md cursor-pointer hover:bg-slate-600">
              <div className="text-3xl">Create New Post</div>
            </div>
          }
        </div>
      </div>
    </div>
  )
}

export default App
