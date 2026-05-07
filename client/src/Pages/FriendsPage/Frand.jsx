import { API } from "../../API/API";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/MainPage.navbar";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";


const token = localStorage.getItem("token")

const FriendsPage = () => {
    const [users, setUsers] = useState([]);
    const [user, setUser] = useState('')
    const [myRequests, setMyRequests] = useState([])
    const [isRequests, setIsRequests] = useState([])
    const [myFriends, setMyFriends] = useState([])
    const [showDelete, setShowDelete] = useState(null)

    const navigate = useNavigate()
    
    useEffect(() => {
        if(!token){
            navigate('/login')
            return 
        }
    })

    useEffect(() =>{
        getUsers()
    }, [])

    const getUsers = async () =>{
        const response = await fetch(`${API}/users`, {
            method: "GET",
            headers: {"authorization": `Bearer ${token}`}
        })

        const data = await response.json();

        setUser(data.user)
        setUsers(data.users)
        setMyRequests(data.myUsers)
        setIsRequests(data.isUsers)
        setMyFriends(data.Friends)
    }


    const sendRequest = async(to) =>{
        const response = await fetch(`${API}/sentrequest/${to}`, {
            method: "POST",
            headers: {"authorization": `Bearer ${token}`}
        })

        const data = await response.json();

        getUsers()

    }

    const confrimRequests = async (id) => {
        const response = await fetch(`${API}/confrim/${id}`, {
            method: "POST",
            headers: {"authorization": `Bearer ${token}`, "content-type": "application/json"},
            body: JSON.stringify({
                userId: user.id
            })
        })

        const data = await response.json();


        if(!data.ok){
            return toast.error("Request not confirmed.")
        }

        toast.success('Friend Confrimed')
        
        getUsers()
    }

    const deleteFriend = async(id) =>{
        const response = await fetch(`${API}/friendremove/${id}`, {
            method: "DELETE",
            headers: {"authorization": `Bearer ${token}`},
        })

        const data = await response.json()

        toast.done(data.message)

        getUsers()

    }
    

    return(
        <>
            <Navbar />

            <div className="bg-[#0d0f14] min-h-screen p-6 font-sans text-[#e8eaf0]">

                <div className="mb-8">
                    <p className="text-[11px] font-semibold tracking-widest uppercase text-[#4a5068] mb-3 ml-1">
                        People you may know
                    </p>
                    {
                        users.map((value) => {
                            return(
                                <div key={value.id} className="flex items-center gap-3 p-3 bg-[#161820] border border-[#1f2235] rounded-xl mb-2 hover:bg-[#1a1d2a] transition-colors">
                                    <img src={value.photo} width={40} height={40} className="rounded-full object-cover flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-[#dde0f0] truncate">
                                            {value.name + ' ' + value.lastname}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => sendRequest(value.id)}
                                        className={
                                            myRequests.some(v => v.id === value.id)
                                                ? "px-4 py-1.5 rounded-lg text-xs font-semibold bg-[#1f2235] text-[#6b74a0] border border-[#2a2d42] cursor-pointer"
                                                : "px-4 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white cursor-pointer hover:bg-blue-700 transition-colors"
                                        }
                                    >
                                        {myRequests.some(v => v.id === value.id) ? "Cancel" : "Add Friend"}
                                    </button>
                                </div>
                            )
                        })
                    }
                </div>

                <div className="h-px bg-[#1a1d2a] mb-8" />

                <div className="mb-8">
                    <p className="text-[11px] font-semibold tracking-widest uppercase text-[#4a5068] mb-3 ml-1">
                        Friend Requests
                    </p>
                    {
                        isRequests.length !== 0 ? (
                            isRequests.map((value, index) => (
                                <div key={index} className="flex items-center gap-3 p-3 bg-[#161820] border border-[#1f2235] border-l-2 border-l-violet-600 rounded-xl mb-2 hover:bg-[#1a1826] transition-colors">
                                    <img src={value.photo} width={40} height={40} className="rounded-full object-cover flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-[#dde0f0] truncate">{value.name}</p>
                                        <p className="text-[11px] text-[#4a5068] mt-0.5">Wants to connect</p>
                                    </div>
                                    <button
                                        onClick={() => confrimRequests(value.id)}
                                        className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-[#0f5c3a] text-green-400 border border-[#1a7a50] cursor-pointer hover:bg-[#155e40] transition-colors"
                                    >
                                        Confirm
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-[#2e3248] italic px-1 py-4">No requests yet</p>
                        )
                    }
                </div>

                <div className="h-px bg-[#1a1d2a] mb-8" />

                <div className="mb-8">
                    <p className="text-[11px] font-semibold tracking-widest uppercase text-[#4a5068] mb-3 ml-1">
                        My Friends
                    </p>
                    {
                        myFriends.length > 0 ? (
                            myFriends.map((value, index) => (
                                <div key={index} className="flex items-center gap-3 p-3 bg-[#161820] border border-[#1f2235] rounded-xl mb-2">
                                    <img src={value.photo} width={40} height={40} className="rounded-full object-cover flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-[#dde0f0] truncate">
                                            {value.name + ' ' + value.lastname}
                                        </p>
                                    </div>
                                    <button onClick={() => setShowDelete(value.id)} className={showDelete ? "invisible" : null}>...</button>
                                    {
                                        showDelete === value.id && (
                                            <div>
                                                <button onClick={() => deleteFriend(value.id)}>delete</button>
                                                <button onClick={() => setShowDelete(null)} className="boreder 1">X</button>
                                            </div>
                                        )
                                    }
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-[#2e3248] italic px-1 py-4">No friends yet</p>
                        )
                    }
                </div>

            </div>
        </>
    )
};

export default FriendsPage;