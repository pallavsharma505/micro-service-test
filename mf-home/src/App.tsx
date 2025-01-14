import { useNavigate } from "react-router-dom"

function App() {
  const navigate = useNavigate();
  return (
    <div className="w-full h-svh flex justify-center items-center bg-slate-950 text-white">
      <div className="w-3/4 bg-slate-900 p-4 rounded-md shadow-sm shadow-blue-900">
        <h1 className="text-3xl font-extrabold">All Posts:</h1>
        <div className="grid grid-cols-2 gap-4">
          {
            [1,2,3,4,5].map((post) => (
              <div className="transition-all ease-in-out duration-500 bg-slate-800 p-4 rounded-md cursor-pointer hover:bg-slate-600" key={post}>
                <div className="text-xl font-bold">Title</div>
                <div className="text-sm font-extralight">Description</div>
                <hr className="my-4" />
                <div>0 Comments</div>
              </div>
            ))
          }
          <div onClick={() => navigate("/new-post")} className="flex justify-center items-center transition-all ease-in-out duration-500 bg-slate-800 p-4 rounded-md cursor-pointer hover:bg-slate-600">
            <div className="text-3xl">Create New Post</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
