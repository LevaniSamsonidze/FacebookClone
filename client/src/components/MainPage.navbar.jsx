import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../API/API";

const token = localStorage.getItem("token")

const Navbar = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [find, setFind] = useState(false)
    const [users, setUsers] = useState([]);

    const logout = () => {
        const confirmLogout = confirm("Logout?");
        if (confirmLogout) {
            localStorage.removeItem("token");
            navigate("/login");
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setSearch(e.target.value)

        
        const response = await fetch(`${API}/sherch/?username=${search}`, {
            method: "GET", 
            headers: {"authorization": `Bearer ${token}`}
        })

        const data = await response.json();

        if(data.ok){
            setUsers(data.users)
            setFind(true)
        }
    };

    const selectProfile = async (id) => {
        const response = await fetch(`${API}/profileuser/${id}`, {
            method: "GET",
            headers: {"authorization": `Bearer ${token}`}
        });

        const data = await response.json();

        console.log(data)

        if(data.ok){
            navigate('/profile', { state: { profile: data } });
        }

    }

    return (
        <div className="w-full bg-[#111827] border-b border-white/10 text-slate-200">

            <div className="w-full flex items-center justify-between px-3 sm:px-6 h-16">

                <h1
                    className="font-bold text-indigo-400 cursor-pointer text-lg"
                    onClick={() => navigate("/mainpage")}
                >
                    connectly
                </h1>

                <div>
                    <form
                        onSubmit={handleSearch}
                        className="hidden md:flex items-center bg-white/5 px-3 py-1 rounded-lg border border-white/10"
                    >
                        <input
                            type="text"
                            placeholder="Search profiles..."
                            value={search}
                            onChange={handleSearch}
                            className="bg-transparent outline-none text-sm text-slate-200 placeholder:text-slate-400"
                        />
                    </form>

                    <div className="hidden md:block absolute mt-2 w-[300px] max-h-[300px] overflow-y-auto bg-[#1f2937] border border-white/10 rounded-xl shadow-lg z-50">
                        {find && users.map(value => (
                            <div
                                key={value.id}
                                className="flex items-center gap-3 px-3 py-2 hover:bg-white/5 transition cursor-pointer border-b border-white/5 last:border-none"
                            >
                                <img
                                    src={value.photo}
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                                <div
                                    className="flex-1"
                                    onClick={() => selectProfile(value.id)}
                                >
                                    <h1 className="text-sm text-slate-200">
                                        {value.name} {value.lastname}
                                    </h1>
                                </div>
                                <button
                                    onClick={() => setFind(false)}
                                    className="text-slate-400 hover:text-red-400 text-sm"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="hidden md:flex gap-6 text-sm text-slate-300">
                    <button className="hover:text-indigo-400" onClick={() => navigate('/mainpage')}>Profile</button>
                    <button className="hover:text-indigo-400" onClick={() => navigate("/friends")}>Friends</button>
                    <button className="hover:text-indigo-400" onClick={() => navigate("/messanger")}>Messages</button>
                    <button className="hover:text-indigo-400" onClick={() => navigate("/posts")}>Posts</button>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={logout}
                        className="px-3 py-1 text-sm rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30"
                    >
                        Logout
                    </button>

                    <button
                        className="md:hidden text-xl"
                        onClick={() => setOpen(!open)}
                    >
                        ☰
                    </button>
                </div>

            </div>

            {open && (
                <div className="md:hidden px-3 pb-4 flex flex-col gap-3 text-sm bg-[#111827] border-t border-white/10">

                    <form
                        onSubmit={handleSearch}
                        className="flex items-center bg-white/5 px-3 py-1 rounded-lg border border-white/10"
                    >
                        <input
                            type="text"
                            placeholder="Search profiles..."
                            value={search}
                            onChange={handleSearch}
                            className="bg-transparent outline-none text-sm text-slate-200 placeholder:text-slate-400 w-full"
                        />
                    </form>

                    {find && users.map(value => (
                        <div
                            key={value.id}
                            className="flex items-center gap-3 px-3 py-2 bg-[#1f2937] hover:bg-white/5 transition cursor-pointer border-b border-white/5 last:border-none rounded-lg"
                        >
                            <img
                                src={value.photo}
                                className="w-8 h-8 rounded-full object-cover"
                            />
                            <div
                                className="flex-1"
                                onClick={() => { selectProfile(value.id); setOpen(false); }}
                            >
                                <h1 className="text-sm text-slate-200">
                                    {value.name} {value.lastname}
                                </h1>
                            </div>
                            <button
                                onClick={() => setFind(false)}
                                className="text-slate-400 hover:text-red-400 text-sm"
                            >
                                ✕
                            </button>
                        </div>
                    ))}

                    <button className="text-left hover:text-indigo-400" onClick={() => navigate('/mainpage')}>Profile</button>
                    <button className="text-left hover:text-indigo-400" onClick={() => navigate('/frineds')}>Friends</button>
                    <button className="text-left hover:text-indigo-400" onClick={() => navigate('/messanger')}>Messages</button>
                    <button className="text-left hover:text-indigo-400" onClick={() => navigate('/posts')}>Posts</button>

                </div>
            )}

        </div>
    );
};

export default Navbar;