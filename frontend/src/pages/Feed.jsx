import { useState, useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import PostCard from "../components/posts/PostCard";
import api from "../api/axios";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      console.log('=== FETCHING POSTS ===');
      
      const userInfo = localStorage.getItem('userInfo');
      const parsedUser = userInfo ? JSON.parse(userInfo) : null;
      console.log('📋 User info:', parsedUser);
      
      if (!parsedUser) {
        throw new Error('No user info in localStorage. Please login again.');
      }
      
      if (!parsedUser.token) {
        throw new Error('No token found. Please login again.');
      }
      
      if (!parsedUser._id) {
        throw new Error('No user ID found.');
      }
      
      // Try to fetch posts - using default api which has interceptor
      const response = await api.get("/posts");
      console.log('✅ Posts fetched successfully:', response.data);
      
      if (!Array.isArray(response.data)) {
        throw new Error('Response is not an array: ' + JSON.stringify(response.data));
      }
      
      setPosts(response.data);
      setError(null);
    } catch (err) {
      console.error('❌ ERROR:', err.message);
      console.error('Full error:', err);
      console.error('Error response:', err.response);
      
      const errorMsg = err.response?.data?.message || err.message || "Failed to fetch posts";
      console.error('📌 Final error message:', errorMsg);
      
      setError(errorMsg);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div
      className="relative min-h-screen overflow-hidden 
      bg-gradient-to-br from-[#F8F6F2] via-[#F3F1EC] to-[#EDE8FF]"
    >
      {/* 🌸 Decorative Glass Blur Background Shapes */}
      <div
        className="absolute top-[-120px] left-[-120px] 
        w-[420px] h-[420px] bg-purple-200 
        rounded-full blur-3xl opacity-30"
      ></div>

      <div
        className="absolute bottom-[-160px] right-[-160px] 
        w-[520px] h-[520px] bg-pink-200 
        rounded-full blur-3xl opacity-20"
      ></div>

      <div
        className="absolute top-[250px] right-[80px] 
        w-[320px] h-[320px] bg-blue-200 
        rounded-full blur-3xl opacity-20"
      ></div>

      {/* Navbar */}
      <Navbar />

      {/* Page Layout */}
      <div className="relative max-w-6xl mx-auto pt-44 px-6 grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* LEFT FEED */}
        <div className="lg:col-span-2 space-y-8">

          {/* Heading */}
          <div>
            <h1 className="text-5xl font-extrabold text-black tracking-tight">
              Home Feed ✨
            </h1>

            <p className="text-lg text-gray-600 mt-3 max-w-xl">
              Internal reflections, team updates, and AI-highlighted discussions
              that help your organization grow.
            </p>
          </div>

          {/* Posts */}
          <div className="space-y-7">
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
                  <p className="mt-4 text-gray-600">Loading posts...</p>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-8 text-center">
                <p className="text-red-700 font-bold text-lg mb-2">⚠️ Error loading posts</p>
                <p className="text-red-600 text-sm mb-4 break-words">{error}</p>
                <button 
                  onClick={fetchPosts}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Retry
                </button>
              </div>
            )}

            {!loading && !error && posts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600">No posts yet. Start the conversation!</p>
              </div>
            )}

            {!loading && !error && posts.map((post, index) => (
              <PostCard key={index} post={post} />
            ))}
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="hidden lg:block space-y-6">

          {/* Trending Box */}
          <div className="bg-white/50 backdrop-blur-xl border border-white/40 rounded-2xl p-6 shadow-md">
            <h2 className="text-lg font-bold text-black mb-4">
              🔥 Trending Discussions
            </h2>

            <div className="space-y-4 text-sm text-gray-700">
              <p className="hover:underline cursor-pointer">
                ⚡ “How do we prevent burnout in fast teams?”
              </p>
              <p className="hover:underline cursor-pointer">
                💡 “Should decisions be logged publicly or anonymously?”
              </p>
              <p className="hover:underline cursor-pointer">
                🎙 “Podcast insights: launch delays + team morale”
              </p>
            </div>
          </div>

          {/* AI Prompt Card */}
          <div className="bg-[#D9D6FF]/40 backdrop-blur-xl rounded-2xl p-6 shadow-md">
            <h2 className="text-lg font-bold text-black mb-2">
              🧠 AI Thought Starter
            </h2>

            <p className="text-sm text-gray-700">
              “What's one thing your team should stop doing immediately?”
            </p>

            <button className="mt-4 w-full bg-black text-white py-2 rounded-full text-sm hover:opacity-90 transition">
              Write Reflection →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
