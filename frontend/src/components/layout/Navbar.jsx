import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="w-full flex justify-center mt-6">
      <div className="w-[80%] bg-white shadow-lg rounded-full px-10 py-4 flex items-center justify-between">

        {/* Left Logo */}
        <Link to="/feed" className="text-xl font-bold">
          TalentBridge
        </Link>

        {/* Middle Links */}
        <div className="flex gap-8 text-gray-600 font-medium">

          <NavLink
            to="/feed"
            className={({ isActive }) =>
              isActive ? "text-black font-semibold underline" : ""
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/podcasts"
            className={({ isActive }) =>
              isActive ? "text-black font-semibold underline" : ""
            }
          >
            Podcasts
          </NavLink>

          <NavLink
            to="/knowledge"
            className={({ isActive }) =>
              isActive ? "text-black font-semibold underline" : ""
            }
          >
            Knowledge Hub
          </NavLink>

          <NavLink
            to="/activity"
            className={({ isActive }) =>
              isActive ? "text-black font-semibold underline" : ""
            }
          >
            Activity
          </NavLink>
        </div>

        {/* Right Buttons */}
        <div className="flex items-center gap-4">

          {/* Write Button */}
          <Link
            to="/write"
            className="bg-black text-white px-6 py-2 rounded-full font-semibold"
          >
            Write
          </Link>

          {/* Profile Circle */}
          <Link
            to="/profile/1"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 font-bold"
          >
            Q
          </Link>
        </div>
      </div>
    </div>
  );
}
