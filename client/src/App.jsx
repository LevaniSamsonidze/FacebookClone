import { Routes, Route } from "react-router-dom";
import SignupPage from "./Pages/SignUp/SignupPage";
import LoginPage from "./Pages/Login/LoginPage";
import MainPage from "./Pages/MainPage/MainPage";
import Posts from "./Pages/Posts/Posts";
import FrinedsPage from "./Pages/FriendsPage/Frand";
import Messanger from "./Pages/Messanger/Messanger";
import Profile from "./components/profile";



function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/mainpage" element={<MainPage />} />
      <Route path="/posts" element={<Posts />} />
      <Route path="/friends" element={<FrinedsPage />} />
      <Route path="/messanger" element={<Messanger />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}


export default App
