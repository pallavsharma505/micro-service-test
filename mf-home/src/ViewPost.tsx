import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

type TPost = {
    title: string;
    description: string;
    content: string;
    comments: number;
}

type TComment = {
    data: string;
}

const ViewPost = () => {
    const navigate = useNavigate();
    const [post, setPost] = useState<TPost | null>(null);
    const [comments, setComments] = useState<TComment[] | null>(null);
    const [comment, setComment] = useState<string>("");
    const params = useParams();
    useEffect(() => {
        fetch(`http://localhost:14003/${params.postId}`)
            .then((res) => res.json())
            .then((data) => {
                setPost(data);
            });
        fetch(`http://localhost:14004/${params.postId}`)
            .then((res) => res.json())
            .then((data) => {
                setComments(data);
            });
    }, [params.postId]);

    const submitComment = async () => {
        await fetch(`http://localhost:14004/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                postId: params.postId,
                data: comment
            })
        });
        setComment("");
        fetch(`http://localhost:14004/${params.postId}`)
            .then((res) => res.json())
            .then((data) => {
                setComments(data);
            });
        setTimeout(() => {
            fetch(`http://localhost:14003/${params.postId}`)
                .then((res) => res.json())
                .then((data) => {
                    setPost(data);
                });
        }, 1000);
    };
    return (
        <div className="w-full h-svh flex justify-center items-center bg-slate-950 text-white">
            <div className="w-3/4 bg-slate-900 p-4 rounded-md shadow-sm shadow-blue-900 max-h-svh overflow-auto">
                {
                    post &&
                    <>
                        <h1 className="text-3xl font-extrabold border-b mb-4 pb-4">{post.title}</h1>
                        <div className="text-xl font-bold border-b mb-4 pb-4">{post.description}</div>
                        <div className="text-sm font-extralight">{post.content}</div>
                        <hr className="my-4" />
                        <div className="text-2xl border-b mb-4 pb-2">{post.comments} Comments</div>
                    </>
                }
                {
                    comments &&
                    <div className="grid grid-cols-2 gap-4">
                        {
                            comments.map((comment, index) => (
                                <div key={index} className="p-4 bg-slate-800 rounded-md">
                                    <div className="text-sm font-extralight">{comment.data}</div>
                                </div>
                            ))
                        }
                    </div>
                }
                {
                    comments &&
                    <div className="mt-4 border-t pt-4">
                        <textarea value={comment} onChange={e => setComment(e.currentTarget.value)} className="w-full h-24 p-4 rounded-md bg-slate-800" placeholder="Comment"></textarea>
                        <div className="flex gap-4 justify-between">
                            <button onClick={() => navigate("/")} className="bg-red-600 p-2 rounded-md shadow-sm shadow-blue-900 flex-grow">Back</button>
                            <button onClick={submitComment} className="bg-slate-600 p-2 rounded-md shadow-sm shadow-blue-900 flex-grow">Comment</button>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default ViewPost