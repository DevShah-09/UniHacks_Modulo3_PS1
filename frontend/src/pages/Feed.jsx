import Navbar from "../components/layout/Navbar";
import PostCard from "../components/posts/PostCard";

export default function Feed() {
  const posts = [
    {
      author: "Aditi Sharma",
      dept: "Product",
      time: "2h ago",
      tag: "Reflection",
      title: "Reflection on our sprint delays",
      preview:
        "This week made me realize our timelines are breaking because of unclear ownership...",
      summary: "AI TL;DR: Better sprint clarity needed to reduce delays.",
      reactions: { heart: 12, idea: 4, comments: 6 },
    },
    {
      author: "Anonymous",
      dept: "Engineering",
      time: "5h ago",
      tag: "Anonymous Thought",
      title: "A thought on burnout culture",
      preview:
        "We celebrate late-night work too much. Maybe sustainable pace is the real win...",
      summary: "AI TL;DR: Hustle culture may harm long-term productivity.",
      reactions: { heart: 20, idea: 7, comments: 10 },
    },
  ];

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
            {posts.map((post, index) => (
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
