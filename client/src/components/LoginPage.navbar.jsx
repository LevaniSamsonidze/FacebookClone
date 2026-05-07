import { Link } from "react-router-dom";

function LoginPageNavbar() {
  return (
    <nav className="w-full px-6 py-4 flex items-center justify-between backdrop-blur-xl bg-white/5 border-b border-white/10 fixed top-0 left-0 z-50">

      <h1
        className="text-xl font-bold"
        style={{
          fontFamily: "'Playfair Display', serif",
          background: "linear-gradient(135deg,#6366f1,#8b5cf6,#ec4899)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}
      >
        connectly
      </h1>

      <div className="flex items-center gap-4">
        <Link
          to="/login"
          className="px-4 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/10 transition"
        >
          Login
        </Link>

        <Link
          to="/signup"
          className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90 transition"
        >
          Sign Up
        </Link>
      </div>

    </nav>
  );
}

export default LoginPageNavbar;