import { useState, useEffect } from "react";
import PostCard from "../components/layout/PostCard";
import api from "../api/axios";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Fetch Posts
  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError("");

      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");

      if (!userInfo?.token) {
        throw new Error("Please login again.");
      }

      const response = await api.get("/posts");

      if (!Array.isArray(response.data)) {
        throw new Error("Invalid posts format from backend.");
      }

      setPosts(response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-[#1C1D25] text-white px-10 py-4">
      <div className="max-w-6xl mx-auto grid grid-cols-3 gap-8 mt-5">

        {/* ================= LEFT FEED ================= */}
        <div className="col-span-2 space-y-6">

          {/* Loading */}
          {loading && (
            <p className="text-gray-400 text-center">Loading posts...</p>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 p-4 rounded-xl">
              <p>⚠️ {error}</p>
              <button
                onClick={fetchPosts}
                className="mt-3 px-4 py-2 bg-red-600 rounded-lg"
              >
                Retry
              </button>
            </div>
          )}

          {/* No Posts */}
          {!loading && !error && posts.length === 0 && (
            <p className="text-gray-400 text-center">
              No posts yet. Start sharing reflections ✨
            </p>
          )}

          {/* Posts */}
          {!loading &&
            posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
        </div>

        {/* ================= RIGHT SIDEBAR ================= */}
        <div className="space-y-6">

          {/* ✅ Trending Discussions */}
          <div className="relative bg-[#242631] rounded-2xl p-6 border border-white/5 overflow-hidden">

            {/* Solid Pastel Strip */}
            <div className="absolute left-0 top-0 h-full w-[7px] bg-[#F28B82]" />

            <h2 className="font-semibold mb-3 pl-5">
              🔥 Trending Discussions
            </h2>

            <ul className="text-sm text-gray-400 space-y-3 pl-5">
              <li>How do we prevent burnout in fast teams?</li>
              <li>Should decisions be logged publicly?</li>
              <li>Podcast insights: launch delays + morale</li>
            </ul>
          </div>

          {/* ✅ AI Thought Starter */}
          <div className="relative bg-[#242631] rounded-2xl p-6 border border-white/5 overflow-hidden">

            {/* Solid Pastel Strip */}
            <div className="absolute left-0 top-0 h-full w-[7px] bg-[#B9A6FF]" />

            <h2 className="font-semibold mb-3 pl-5">
              🤖 AI Thought Starter
            </h2>

            <p className="text-sm text-gray-400 mb-4 pl-5">
              What's one thing your team should stop doing immediately?
            </p>

            <button className="w-full bg-[#4BA9FF] text-black font-semibold py-2 rounded-xl hover:opacity-90 transition">
              Write Reflection
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
