import { useEffect } from "react";
import { socket } from "../../API/Socket.API";
import { useState } from "react";
import { API } from "../../API/API";
import Navbar from "../../components/MainPage.navbar";

const token = localStorage.getItem("token");

const Messanger = () =>{
    const [message, setMessage] = useState('');
    const [friends, setFriends] = useState([]);
    const [ioMessages, setIoMessages] = useState([]);
    const [user, setUser] = useState('');
    const [showInput, setShowInput] = useState(null);
    const [messages, setMessages] = useState([]);
    useEffect(() => {
        socket.on("connect", () => {
            console.log(socket.id);
        });
        
        socket.on("message", (msg) => {
            setIoMessages(prev => [...prev, msg])
        })


        return () => {
            socket.disconnect();
        };
    }, []);
    useEffect(() =>{
        getFriends()
    }, [])


    const getFriends = async () =>{
        const response = await fetch(`${API}/messageuser`, {
            method: "GET",
            headers: {"authorization": `Bearer ${token}`}
        })

        const data = await response.json();

        setFriends(data.filterUsers)
        setUser(data.user.id)
    }

    const getMessage = async (e, id) => {
        setShowInput(id)
        socket.emit("join", { user, id });
        const response = await fetch(`${API}/message/${id}`, {
            method: "GET", 
            headers: {"authorization": `Bearer ${token}`}
        })

        const data = await response.json();
        setMessages(data.messages)
        
    }

    const sendMessage = async (e, id) =>{
        e.preventDefault();
        socket.emit('message', {message, id, user})
        setMessage('')
        
    }


    

    return (
        <>
            <Navbar />
            <div className="flex h-screen bg-[#0f0f13] text-white overflow-hidden">
 
                <aside className={`${showInput ? 'hidden md:flex' : 'flex'} w-full md:w-64 shrink-0 bg-[#16161d] border-r border-white/5 flex-col`}>
                    <div className="px-5 pt-7 pb-4">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Conversations</p>
                    </div>
                    <div className="flex-1 overflow-y-auto px-2 space-y-0.5">
                        {
                            friends.map(value =>{
                                return(
                                    <div key={value.id} className={`group rounded-xl px-3 py-2.5 cursor-pointer transition-all duration-150 ${showInput === value.id ? 'bg-indigo-600/20 ring-1 ring-indigo-500/30' : 'hover:bg-white/5'}`}>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold shrink-0">
                                                {value.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <h1 onClick={(e) => getMessage(e, value.id) } className={`text-sm font-medium truncate cursor-pointer transition-colors ${showInput === value.id ? 'text-indigo-300' : 'text-white/70 group-hover:text-white'}`}>{value.name}</h1>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </aside>
 
                <main className={`${showInput ? 'flex' : 'hidden md:flex'} flex-1 flex-col overflow-hidden relative`}>
 
                    <div className="h-14 shrink-0 border-b border-white/5 bg-[#0f0f13] flex items-center gap-3 px-4 md:px-6">
                        <button onClick={() => setShowInput(null)} className="md:hidden p-1.5 rounded-lg hover:bg-white/5 transition-colors text-white/40 hover:text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <span className="text-xs text-white/30 font-medium uppercase tracking-widest">Messages</span>
                    </div>
 
                    <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 pb-24 space-y-3">
                        {
                            messages.length !== 0? (
                                <div>
                                    <div className="space-y-2">
                                        {
                                            messages.map(value => {
                                                if(user === value.senderId){
                                                    return (
                                                        <div className="flex justify-end">
                                                            <h1 className="bg-indigo-600 text-white text-sm px-4 py-2.5 rounded-2xl rounded-br-md max-w-[75vw] md:max-w-sm shadow-md shadow-indigo-900/30">{value.text}</h1>
                                                        </div>
                                                    )
                                                }else if (user === value.eceiverId){
                                                    return (
                                                        <div className="flex justify-start">
                                                            <h1 className="bg-white/8 text-white/80 text-sm px-4 py-2.5 rounded-2xl rounded-bl-md max-w-[75vw] md:max-w-sm border border-white/5">{value.text}</h1>
                                                        </div>
                                                    )
                                                }
                                            })
                                        }
                                    </div>
                                    <div className="space-y-2 mt-2">
                                        {
                                            ioMessages.map(value => {
                                                if(user === value.senderId){
                                                    return (
                                                        <div className="flex justify-end">
                                                            <h1 className="bg-indigo-600 text-white text-sm px-4 py-2.5 rounded-2xl rounded-br-md max-w-[75vw] md:max-w-sm shadow-md shadow-indigo-900/30">{value.text}</h1>
                                                        </div>
                                                    )
                                                }else if (user === value.eceiverId){
                                                    return (
                                                        <div className="flex justify-start">
                                                            <h1 className="bg-white/8 text-white/80 text-sm px-4 py-2.5 rounded-2xl rounded-bl-md max-w-[75vw] md:max-w-sm border border-white/5">{value.text}</h1>
                                                        </div>
                                                    )
                                                }
                                            })
                                        }
                                    </div>
                                </div>
                                
                            ): (
                                <div className="flex flex-col items-center justify-center h-full gap-4 select-none">
                                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl">
                                        💬
                                    </div>
                                    <h2 className="text-white/25 text-sm font-medium">not select user</h2>
                                </div>
                            )
                        }
                    </div>
 
                    {
                        friends.map(value =>{
                            return(
                                <div key={value.id}>
                                    {
                                        showInput === value.id ? (
                                            <div className="fixed bottom-0 left-0 md:left-64 right-0 flex items-center gap-2 p-3 bg-white border-t">
                                                <form onSubmit={(e) => sendMessage(e, value.id)}>
                                                    <div className="fixed bottom-0 left-0 md:left-64 right-0 flex items-center gap-3 px-5 py-4 bg-[#16161d] border-t border-white/5 z-50">
                                                        <input
                                                            type="text"
                                                            className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-indigo-500/60 focus:bg-indigo-500/5 transition-all"
                                                            onChange={(e) => setMessage(e.target.value)}
                                                            value={message}
                                                            required
                                                        />
 
                                                        <button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all rounded-2xl text-sm font-semibold text-white shadow-lg shadow-indigo-600/20">
                                                            Send
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                        ): null
                                    }
                                </div>
                            )
                        })
                    }
 
                </main>
 
            </div>
        </>
    )
}

export default Messanger;