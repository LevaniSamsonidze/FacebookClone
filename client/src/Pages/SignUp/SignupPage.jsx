import { useState } from "react";
import { API } from "../../API/API";
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import { useEffect } from "react";
import LoginPageNavbar from "../../components/LoginPage.navbar";
import { useNavigate } from "react-router-dom";

function SignupPage() {
  const [gmail, setGmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [code, setCode] = useState("");
  const [clientCode, setClientCode] = useState("");
  const [time, setTime] = useState(60);
  const [loading, setLoading] = useState(false);
  const [showPage, setShowPage] = useState(false);

  const navigate = useNavigate();

  useEffect(() =>{
    const token = localStorage.getItem("token");
    if(token){
        navigate("/mainpage");
    }
    
  }, [])

  useEffect(() =>{
    if(!showPage) return;
    const interval = setInterval(() =>{
      setTime(time => {
        if(time <= 0){
        setShowPage(false);
        setTime(60);
        clearInterval(interval);
        toast.error("Verification code expired. Please try again.");
        return
        }
        return time - 1;
      })
    }, 1000);
    return () => clearInterval(interval);
  }, [showPage])

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const response = await fetch(`${API}/signup/verifyGmail`, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        gmail: gmail
      })
    })
    const data = await response.json();

    if(data.ok){
      setCode(data.code);
      setLoading(false);
      setShowPage(true);
    }else if(!data.ok){
      toast.error(data.message);
      setLoading(false);
    }else{
      setLoading(false);
      toast.error("An error occurred. Please try again. 500");
    }

  };

  const onSubmitCode = async (e) =>{
    e.preventDefault();
    if(clientCode.toString() === code.toString()){
      toast.success("code is correct");
      setTime(60);
      setShowPage(false);
      const response = await fetch(`${API}/signup`, {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          gmail: gmail,
          password: password,
          name: firstName,
          lastname: lastName,
          id: uuidv4()
        })
      })
      const data = await response.json();
      if(data.ok){
        toast.success(data.message);
      }
    }else{
      toast.error("code is incorrect");
    }
  }


  return (
    <>
      {
        showPage ? (
          <div className="flex flex-col items-center gap-4 mt-70">
            <p>{time}</p>
            <input
              type="text"
              value={clientCode}
              onChange={(e) => setClientCode(e.target.value)}
              placeholder="Enter verification code"
              className="w-full max-w-xs px-4 py-3 rounded-xl bg-slate-800/70 border border-white/10 text-slate-200 text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button className="w-full max-w-xs py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90 transition" onClick={onSubmitCode}>sned</button>
          </div>
        ):(
          <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-[#0a0f1e] relative overflow-hidden">

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Playfair+Display:wght@700&display=swap');
      `}</style>
      <LoginPageNavbar />
      <div className="absolute -top-24 -left-28 w-96 h-96 rounded-full blur-3xl bg-indigo-500/20" />
      <div className="absolute -bottom-16 -right-16 w-80 h-80 rounded-full blur-3xl bg-emerald-400/10" />
      <div className="absolute top-1/3 left-1/2 w-64 h-64 rounded-full blur-3xl bg-pink-500/10" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 max-w-5xl w-full gap-10">

        <div className="flex flex-col justify-center text-center lg:text-left">
          <h1 className="text-5xl font-bold mb-5"
            style={{
              fontFamily: "'Playfair Display', serif",
              background: "linear-gradient(135deg,#6366f1,#8b5cf6,#ec4899)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}
          >
            connectly
          </h1>
          <p className="text-2xl font-semibold text-slate-100 mb-3">
            Connect with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400">
              everyone
            </span>
          </p>

          <p className="text-sm text-slate-400 max-w-sm mx-auto lg:mx-0">
            Join millions of people sharing moments, ideas, and conversations every day.
          </p>
        </div>

        <div className="rounded-2xl p-6 sm:p-8 border border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-2xl">

          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-slate-100">Create account</h2>
            <p className="text-xs text-slate-500">It’s free and always will be.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            <div className="grid grid-cols-2 gap-3">
              <input
                className="bg-slate-800/70 border border-white/10 rounded-xl px-4 py-3 text-[15px] text-slate-200"
                placeholder="First name"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />

              <input
                className="bg-slate-800/70 border border-white/10 rounded-xl px-4 py-3 text-[15px] text-slate-200"
                placeholder="Last name"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            <input
              className="bg-slate-800/70 border border-white/10 rounded-xl px-4 py-3 text-[15px] text-slate-200"
              type="email"
              placeholder="Gmail"
              required
              value={gmail}
              onChange={(e) => setGmail(e.target.value)}
            />

            <input
              className="bg-slate-800/70 border border-white/10 rounded-xl px-4 py-3 text-[15px] text-slate-200"
              placeholder="Password"
              type="password"
              required
              value={password}
              minLength={8}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-500"
              disabled={loading}
            >
              {loading ? "Loading..." : "Sign Up"}
            </button>

          </form>

        </div>
      </div>
    </div>
        )
      }
    </>
  );
}

export default SignupPage;