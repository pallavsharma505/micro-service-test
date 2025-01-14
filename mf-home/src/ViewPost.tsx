import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

type TPost = {
    title: string;
    description: string;
    content: string;
    comments: number;
}

const ViewPost = () => {
    const [post, setPost] = useState<TPost | null>(null);
    const params = useParams();
    useEffect(() => {
        fetch(`http://localhost:14003/${params.postId}`)
        .then((res) => res.json())
        .then((data) => {
            setPost(data);
        });
    }, [params.postId]);
    return (
        <div className="w-full h-svh flex justify-center items-center bg-slate-950 text-white">
            <div className="w-3/4 bg-slate-900 p-4 rounded-md shadow-sm shadow-blue-900">
                {
                    post &&
                    <>
                        <h1 className="text-3xl font-extrabold border-b mb-4 pb-4">{post.title}</h1>
                        <div className="text-xl font-bold border-b mb-4 pb-4">{post.description}</div>
                        <div className="text-sm font-extralight">{post.content}</div>
                        <hr className="my-4" />
                        <div>{post.comments} Comments</div>
                    </>
                }
            </div>
        </div>
    )
}

export default ViewPost