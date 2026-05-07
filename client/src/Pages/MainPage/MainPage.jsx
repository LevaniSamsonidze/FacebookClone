import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { API } from "../../API/API";
import Navbar from "../../components/MainPage.navbar";
import { v4 as uuidv4 } from 'uuid';
import { toast } from "react-toastify";

const MainPage = () => {
    const [fristName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [preview, setPreview] = useState(null);
    const [posts, setPosts] = useState([]);
    const [profilePhoto, setProfilePhoto] = useState('')
    const [file, setFile] = useState(null);
    const [id, setId] = useState('')

    const [postDescription, setPostDescription] = useState('');
    const [postTitle, setPostTitle] = useState('');
    const [postImg, setPostImg] = useState('')


    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        const verifyToken = async () => {
            const response = await fetch(`${API}/getuser`, {
                method: "GET",
                headers: {
                    "authorization": `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!data.ok) {
                localStorage.removeItem("token");
                navigate("/login");
                return;
            }

            setProfilePhoto(data.user.photo)
            setFirstName(data.user.name);
            setLastName(data.user.lastname);
            setPreview(data.user.photo);
            setId(data.user.id)
        };

        verifyToken();
    }, []);

    useEffect(() => {
        const getPost = async () => {
            const token = localStorage.getItem("token");

            const response = await fetch(`${API}/post`, {
                method: "GET",
                headers: {
                    "authorization": `Bearer ${token}`
                }
            });

            const postData = await response.json();
            setPosts(postData.post);
        };

        getPost();
    }, []);

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));

        const formData = new FormData();
        formData.append("profileImg", selectedFile);
        formData.append("id", id);

        await fetch(`${API}/upload`, {
            method: "PATCH",
            body: formData
        });
    };

    const postImgChange = (e) => {
        setPostImg(e.target.files[0]);
    };

    const createPost = async () => {
        const token = localStorage.getItem("token");
        const id = uuidv4();

        const formData = new FormData();
        formData.append("id", id);
        formData.append("title", postTitle);
        formData.append("description", postDescription);
        formData.append("postImg", postImg);
        formData.append("name", fristName + ' ' + lastName);

        const response = await fetch(`${API}/createpost`, {
            method: "POST",
            headers: {
                "authorization": `Bearer ${token}`
            },
            body: formData
        });

        const data = await response.json();

        if (data.ok) {
            setPosts(prev => [data.post, ...prev]);
        }
    };

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
    


    return (
        <div className="min-h-screen bg-slate-100 text-slate-800">

            <Navbar />

            <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-5">

                <div className="bg-white rounded-2xl shadow p-5 h-fit">

                    <h2 className="font-semibold mb-4">Profile</h2>

                    <div className="flex flex-col items-center gap-3">

                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border">
                            <img
                                src={profilePhoto}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <input
                            type="file"
                            className="text-xs md:text-sm w-full"
                            onChange={handleFileChange}
                        />

                        <p className="font-medium text-center text-sm md:text-base">
                            {fristName} {lastName}
                        </p>

                        <p className="text-xs text-slate-500 text-center">
                            Your profile
                        </p>

                    </div>

                </div>

                <div className="md:col-span-2 space-y-4">

                    <div className="bg-white rounded-2xl shadow p-4 space-y-3">

                        <input
                            type="text"
                            placeholder="Post title"
                            className="w-full border border-slate-200 p-2 rounded-lg text-sm outline-none focus:border-indigo-400"
                            value={postTitle}
                            onChange={(e) => setPostTitle(e.target.value)}
                        />

                        <input
                            type="text"
                            placeholder="Post description"
                            className="w-full border border-slate-200 p-2 rounded-lg text-sm outline-none focus:border-indigo-400"
                            value={postDescription}
                            onChange={(e) => setPostDescription(e.target.value)}
                        />

                        <input
                            type="file"
                            className="w-full text-sm"
                            onChange={postImgChange}
                        />

                        <button
                            className="w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition"
                            onClick={createPost}
                        >
                            Create Post
                        </button>

                    </div>

                    {posts.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow p-6 text-center text-slate-500">
                            No posts yet
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {posts.map((value, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-2xl shadow-md p-4 space-y-3"
                                >
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={profilePhoto}
                                            className="w-10 h-10 rounded-full object-cover border"
                                        />
                                        <div>
                                            <p className="font-semibold text-sm">
                                                {value.userName}
                                            </p>
                                        </div>
                                        

                                        <button onClick={() => deltePost(value.postId)} className="w-full rounded-xl px-4 py-2 text-left text-sm font-medium text-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200">
                                            Delete
                                        </button>

                                        <button onClick={() => editPost(value.postId)} className="w-full rounded-xl px-4 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-black transition-all duration-200">
                                            Edit
                                        </button>

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
                                                className="w-full max-h-[400px] object-cover"
                                            />
                                        </div>
                                    )}

                                    <div className="flex justify-between text-sm text-slate-500 pt-2 border-t">
                                        <button className="hover:text-indigo-500">Like {value.like}</button>
                                        <button className="hover:text-indigo-500">Comment</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                </div>

            </div>

        </div>
    );
};

export default MainPage;