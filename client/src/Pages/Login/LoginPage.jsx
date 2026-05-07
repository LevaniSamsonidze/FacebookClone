import { useEffect, useState } from "react";
import { API } from "../../API/API";
import LoginPageNavbar from "../../components/LoginPage.navbar";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const LoginPage = () =>{
    const [gmail, setGmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() =>{
        const token = localStorage.getItem("token");
        if(token){
            navigate("/mainpage");
        }
    }, [])

    const onSubmitHandler = async (e) =>{
        e.preventDefault();
        setLoading(true);

        try{
            const response = await fetch(`${API}/login`, {
                method: "POST",
                headers: {"content-type": "application/json"},
                body: JSON.stringify({ gmail, password })
            })

            const data = await response.json();

            if(!data.ok){
                setLoading(false);
                return toast.error(data.message);
            }

            localStorage.setItem("token", data.token);
            toast.success("Login successful");
            navigate("/mainpage");

        }catch(err){
            toast.error("Something went wrong");
        }

        setLoading(false);
    }

    return(
        <div className="min-h-screen flex items-center justify-center px-4 bg-[#0a0f1e] relative overflow-hidden">

            <LoginPageNavbar />

            <div className="absolute -top-24 -left-28 w-96 h-96 rounded-full blur-3xl bg-indigo-500/20" />
            <div className="absolute -bottom-16 -right-16 w-80 h-80 rounded-full blur-3xl bg-pink-500/10" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 max-w-5xl w-full gap-10">

                <div className="flex flex-col justify-center text-center lg:text-left">
                    <h1 className="text-5xl font-bold mb-5"
                        style={{
                            background: "linear-gradient(135deg,#6366f1,#8b5cf6,#ec4899)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent"
                        }}
                    >
                        connectly
                    </h1>

                    <p className="text-2xl font-semibold text-slate-100 mb-3">
                        Welcome back 👋
                    </p>

                    <p className="text-sm text-slate-400 max-w-sm mx-auto lg:mx-0">
                        Log in to continue your journey and connect with others.
                    </p>
                </div>

                <div className="rounded-2xl p-6 sm:p-8 border border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-2xl">

                    <div className="text-center mb-6">
                        <h2 className="text-xl font-semibold text-slate-100">Login</h2>
                        <p className="text-xs text-slate-500">Access your account</p>
                    </div>

                    <form onSubmit={onSubmitHandler} className="flex flex-col gap-4">

                        <input
                            type="email"
                            placeholder="Gmail"
                            required
                            value={gmail}
                            onChange={(e) => setGmail(e.target.value)}
                            className="bg-slate-800/70 border border-white/10 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-slate-800/70 border border-white/10 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90 transition"
                        >
                            {loading ? "Loading..." : "Login"}
                        </button>

                    </form>

                </div>
            </div>
        </div>
    )
}

export default LoginPage;