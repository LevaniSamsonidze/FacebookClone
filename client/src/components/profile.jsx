import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"
import { API } from "../API/API";
import Navbar from "./MainPage.navbar";

const token = localStorage.getItem("token")

const Profile = () =>{
    const location = useLocation();
    const [post, setPost] = useState([]);
    const [user, setUser] = useState(null);
    const [request, setRequest] = useState([])

    useEffect(() => {
        setPost(location.state.profile.post)
        setUser(location.state.profile.user)
    }, [location.state])

    useEffect(() => {
        getUsers()
    }, [])

    const sendRequest = async (to) =>{
        const response = await fetch(`${API}/sentrequest/${to}`, {
            method: "POST",
            headers: {"authorization": `Bearer ${token}`}
        })

        const data = await response.json();
        getUsers()

    }

    const getUsers = async () =>{
        const response = await fetch(`${API}/users`, {
            method: "GET",
            headers: {"authorization": `Bearer ${token}`}
        })

        const data = await response.json();
        setRequest(data.myUsers)

    }

    return (
        <div className="min-h-screen bg-slate-100 text-slate-800 pb-12">
            <Navbar />

            <div className="bg-white border-b border-slate-200 px-6 py-3 mb-8">
                <div className="max-w-2xl mx-auto text-xs text-slate-400 tracking-widest uppercase">
                    User Profile
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-4 mb-6">
                {user ? (
                    <div className="bg-white rounded-2xl shadow p-5 flex items-center gap-4 border border-slate-100">
                        <img
                            src={user.photo}
                            width={72}
                            height={72}
                            className="rounded-full object-cover w-16 h-16 shrink-0 border-2 border-indigo-100"
                        />
                        <div className="flex-1 min-w-0">
                            <h1 className="text-base font-semibold text-slate-800 truncate">
                                {user.name} {user.lastname}
                            </h1>
                            <p className="text-xs text-slate-400 mt-0.5">{user.role}</p>
                        </div>
                        <button
                            onClick={() => sendRequest(user.id)}
                            className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer
                                ${request.some(v => v.id === user.id)
                                    ? "bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-500 border border-slate-200"
                                    : "bg-indigo-500 hover:bg-indigo-600 text-white"
                                }`}
                        >
                            {request.some(v => v.id === user.id) ? "Cancel" : "Add Friend"}
                        </button>
                    </div>
                ) : null}
            </div>

            <div className="max-w-2xl mx-auto px-4">

                <p className="text-xs text-slate-400 uppercase tracking-widest mb-4 ml-1">Posts</p>

                {post ? (
                    <div className="flex flex-col gap-4">
                        {post.map((value, i) => (
                            <div
                                key={i}
                                className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md hover:border-indigo-100 transition-all duration-200"
                            >
                                {value.img && (
                                    <img
                                        src={value.img}
                                        className="w-full max-h-60 object-cover"
                                    />
                                )}
                                <div className="p-5">
                                    <h1 className="text-sm font-bold text-slate-800 mb-1">
                                        {value.titile}
                                    </h1>
                                    <p className="text-xs text-slate-500 leading-relaxed">
                                        {value.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-10 text-center text-slate-400 text-xs tracking-wide">
                        No posts yet
                    </div>
                )}
            </div>

        </div>
    )
}

export default Profile;