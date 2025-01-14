import { useState } from "react";
import { useNavigate } from "react-router-dom"

function NewPost() {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [content, setContent] = useState("");

    const onSubmit = async () => {
        const response = await fetch("http://localhost:14003/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title,
                description,
                content,
                comments: 0
            })
        });

        if (response.ok) {
            alert("Post created successfully!");
            navigate("/");
        }
    };

    return (
        <div className="w-full h-svh flex justify-center items-center bg-slate-950 text-white">
            <div className="w-3/4 bg-slate-900 p-4 rounded-md shadow-sm shadow-blue-900">
                <h1 className="text-3xl font-extrabold">Create New Post:</h1>
                <div className="flex flex-col gap-4">
                    <input onChange={e => setTitle(e.currentTarget.value)} type="text" placeholder="Title" className="p-2 rounded-md bg-slate-800 text-white" />
                    <input onChange={e => setDescription(e.currentTarget.value)} type="text" placeholder="Description" className="p-2 rounded-md bg-slate-800 text-white" />
                    <textarea onChange={e => setContent(e.currentTarget.value)} placeholder="Content" className="p-2 rounded-md bg-slate-800 text-white" />
                    <button onClick={onSubmit} className="p-2 bg-blue-900 text-white rounded-md">Create Post</button>
                </div>
            </div>
        </div>
    )
}

export default NewPost
