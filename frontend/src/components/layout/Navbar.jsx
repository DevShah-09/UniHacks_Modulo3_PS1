import { Link, NavLink, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  // ✅ Logged-in user info
  const userInfo =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("userInfo") || "null")
      : null;

  // ✅ Profile Initial
  const initial =
    userInfo?.fullName
      ? userInfo.fullName.trim()[0].toUpperCase()
      : "U";

  const profilePath = userInfo ? `/profile/${userInfo._id}` : "/";

  // ✅ Active Write Page
  const isWritePage = location.pathname === "/write";

  return (
    <div className="w-full flex justify-center pt-9 bg-[#1C1D25]">
      <div
        className="
          w-[90%]
          px-10 py-3
          flex items-center justify-between
          rounded-full
          bg-[#2B2D38]
          border border-white/10
          shadow-lg
        "
      >
        {/* 🌟 Logo */}
        <Link
          to="/feed"
          className="text-2xl font-bold text-white tracking-wide"
        >
          Talent<span className="text-[#4BA9FF]">Bridge</span>
        </Link>

        {/* 🔗 Nav Links */}
        <div className="flex gap-12 text-sm font-medium">
          {[
            { path: "/feed", label: "Home" },
            { path: "/podcasts", label: "Podcasts" },
            { path: "/knowledge", label: "Knowledge Hub" },
            { path: "/activity", label: "Activity" },
          ].map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                isActive
                  ? "text-[#7FE6C5] font-semibold"
                  : "text-gray-400 hover:text-white transition"
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* ⚡ Right Side */}
        <div className="flex items-center gap-4">
          
          {/* Write Button */}
          <Link
            to="/write"
            className={`
              px-6 py-2 rounded-full font-semibold
              text-black transition
              ${
                isWritePage
                  ? "bg-[#F5C76A]" // Active Yellow
                  : "bg-[#4BA9FF] hover:opacity-90" // Default Blue
              }
            `}
          >
            Write
          </Link>

          {/* Profile Circle */}
          <Link
            to={profilePath}
            className="
              w-10 h-10 flex items-center justify-center
              rounded-full
              bg-[#B9A6FF]
              text-black font-bold
              hover:opacity-90
              transition
            "
          >
            {initial}
          </Link>
        </div>
      </div>
    </div>
  );
}
