import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../../API/API";
import { useState } from "react";
import Navbar from "../../components/MainPage.navbar";
import { toast } from "react-toastify";
import { stringify } from "uuid";

const Posts = () =>{
    const [admin, setAdmin] = useState(false)
    const [posts, setPosts] = useState([]);
    const [postLike, setPostLike] = useState(false)
    const [showComment, setShowComment] = useState(null)
    const [sendComment, setSendComment] = useState('')
    const [comments, setComments] = useState([]);
    const [user, setUser] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() =>{
        if(!token){
            return navigate('/login')
        }
    },[])

    useEffect(() =>{
        getPosts()
    }, [])

    const getPosts = async () =>{
        const response = await fetch(`${API}/posts`, {
            method: "GET",
            headers: {"authorization": `Bearer ${token}`}
        })

        const data = await response.json();
        setPosts(data.posts.reverse())
        setUser(data.user)

        if(data.user.role === "admin"){
            setAdmin(true)
        }
    }


    const deltePost = async (id) =>{
        const response = await fetch(`${API}/delete/${id}`, {
            method: "DELETE",
            headers: {'content-type': 'application/json'},
            body: JSON.stringify({
                id
            })
        })

        const data = await response.json();

        if(!data.ok){
            return toast.error(data.message)
        }

        toast.success(data.message)
    }

    const editPost = async (id) =>{
        const title = prompt("enter title")
        const description = prompt("enter description")

        const response = await fetch(`${API}/edit/${id}`, {
            method: "PATCH",
            headers: {'content-type': 'application/json'},
            body: JSON.stringify({
                title,
                description
            })
        })

        const data = await response.json();

        if(!data.ok){
            return toast.error(data.message)
        }

        toast.success(data.message)
    }

    const likePost = async (e, id) =>{
        const token = localStorage.getItem("token");

        const response = await fetch(`${API}/likepost/${id}`, {
            method: "POST",
            headers: {"authorization": `Bearer ${token}`}
        }) 

        const data = await response.json();

        getPosts()

        
    }

    const commentSend = async (e, id) =>{
        const token = localStorage.getItem("token");
        const response = await fetch(`${API}/createcomment/${id}`, {
            method: "POST",
            headers: {"authorization": `Bearer ${token}`, "content-type": "application/json"},
            body: JSON.stringify({
                comment: sendComment
            })
        })

        const data = await response.json();

        if(data.ok){
            toast.success("comment create")
        }
    }


    return (
        <div className="min-h-screen bg-slate-100">
            <Navbar />

            <div className="flex justify-center p-6">
                <div className="w-full max-w-2xl space-y-4">
                    {posts.map((value, index) => (
                        
                        <div
                            key={index}
                            className="bg-white rounded-2xl shadow-md p-4 space-y-3"
                        >
                            <div className="flex items-center gap-3">
                                <img
                                    src={value.user.photo}
                                    className="w-10 h-10 rounded-full object-cover border"
                                />

                                <div>
                                    <p className="font-semibold text-sm">
                                        {value.userName}
                                    </p>
                                </div>

                                {
                                    admin ? (
                                        <div className="ml-auto flex gap-2">
                                            <button onClick={() => deltePost(value.postId)} className="rounded-xl px-3 py-1 text-sm font-medium text-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200">
                                                Delete
                                            </button>

                                            <button onClick={() => editPost(value.postId)} className="rounded-xl px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-black transition-all duration-200">
                                                Edit
                                            </button>
                                        </div>
                                    ):null
                                }
                            </div>

                            <h1 className="text-lg font-bold text-slate-800">
                                {value.title}
                            </h1>

                            <p className="text-sm text-slate-600">
                                {value.description}
                            </p>

                            {value.img && (
                                <div className="rounded-xl overflow-hidden border">
                                    <img
                                        src={`http://localhost:3000${value.img}`}
                                        className="w-full max-h-[350px] object-cover"
                                    />
                                </div>
                            )}

                            <div className="flex justify-between text-sm text-slate-500 pt-2 border-t">
                                <button
                                    className={value.like.some(v => v === user.id)? "text-blue-500" : "text-black"}
                                    onClick={(e) => likePost(e, value.postId)}
                                >
                                    Like {value.like.length}
                                </button>

                                {
                                    showComment === value.postId ? (
                                        <div className="mt-3 w-full bg-slate-50 border rounded-xl p-3 shadow-sm">
                                            <div className="flex justify-between items-center mb-3">
                                                <p className="text-sm font-semibold text-slate-700">
                                                    Comments {value.comments.length}
                                                </p>
                                                <button
                                                    onClick={() => setShowComment(null)}
                                                    className="text-sm px-2 py-1 rounded-lg hover:bg-slate-200 transition"
                                                >
                                                    ✕
                                                </button>
                                            </div>

                                            <div className="h-32 border rounded-lg bg-white p-2 mb-3 overflow-y-auto">
                                                {
                                                    value.comments.length > 0 ? (
                                                    <div className="space-y-3">
                                                        {value.comments.map((v, index) => {
                                                            return (
                                                                <div
                                                                    key={index}
                                                                    className="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm hover:shadow-md transition-all duration-200"
                                                                >
                                                                    <div className="flex items-start gap-3">
                                                                        <img
                                                                            src={value.user.photo}
                                                                            alt={v.user.fullName}
                                                                            className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-md ring-1 ring-slate-200 shrink-0 hover:scale-105 transition-all duration-200"
                                                                        />

                                                                        <div className="flex-1">
                                                                            <h1 className="font-semibold text-sm text-slate-800">
                                                                                {v.user.fullName}
                                                                            </h1>

                                                                            <div className="mt-1 bg-slate-50 rounded-xl px-3 py-2">
                                                                                <p className="text-sm text-slate-600 break-words">
                                                                                    {v.comment}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                    ):(
                                                        <p className="text-sm text-slate-500">
                                                            No comments yet...
                                                        </p>
                                                    )
                                                    
                                                }
                                            
                                            </div>

                                            <div className="flex gap-2">
                                                <form>
                                                    <input
                                                        type="text"
                                                        placeholder="Write a comment..."
                                                        className="flex-1 px-3 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
                                                        required
                                                        value={sendComment}
                                                        onChange={(e) => setSendComment(e.target.value)}
                                                    />
                                                    <button onClick={(e) => commentSend(e, value.postId)} className="bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-600 transition-all duration-200">
                                                        Send
                                                    </button>
                                                </form>
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setShowComment(value.postId)}
                                            className="hover:text-indigo-500"
                                        >
                                            Comment {value.comments.length}
                                        </button>
                                    )
                                }

                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Posts;