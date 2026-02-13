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
    <div className="bg-[#F8F6F2] min-h-screen">
      
      {/* Navbar */}
      <Navbar />

      {/* Feed Content */}
      <div className="max-w-3xl mx-auto pt-28 px-4 space-y-6">
        
        <h1 className="text-3xl font-bold text-[#111]">
          Home Feed ✨
        </h1>

        <p className="text-gray-600 mb-6">
          Internal reflections, team updates, and AI-highlighted discussions.
        </p>

        {/* Posts */}
        {posts.map((post, index) => (
          <PostCard key={index} post={post} />
        ))}
      </div>
    </div>
  );
}
