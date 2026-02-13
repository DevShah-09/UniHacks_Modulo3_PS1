import { Link } from "react-router-dom";

export default function Signup() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-white">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-center mb-2">
          Create Account
        </h1>

        <form className="space-y-4 mt-6">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-3 border rounded-xl"
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded-xl"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded-xl"
          />

          <button className="w-full bg-black text-white py-3 rounded-xl font-semibold">
            Sign Up
          </button>
        </form>

        <p className="text-center text-sm mt-5 text-gray-600">
          Already have an account?{" "}
          <Link to="/" className="font-semibold underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
