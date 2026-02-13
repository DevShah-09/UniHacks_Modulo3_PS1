import { useNavigate } from "react-router-dom";

export default function PostCard({ post }) {
  const navigate = useNavigate();
  
  // Extract author name
  const authorName = post.author?.fullName || "Anonymous";
  const authorInitial = authorName[0]?.toUpperCase() || "A";
  
  // Create preview from content
  const preview = post.content?.substring(0, 150) + (post.content?.length > 150 ? "..." : "") || "";
  
  // Get first tag or use default
  const tag = post.tags?.[0] || "Post";
  
  // Get summary from feedback or create one
  const summary = post.summary || "Check this reflection";
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Just now";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div
      onClick={() => navigate(`/posts/${post._id}`)}
      className="bg-white/60 backdrop-blur-xl border border-white/40 
      rounded-3xl p-7 shadow-md hover:shadow-xl hover:-translate-y-1 
      transition-all duration-300 cursor-pointer"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        
        {/* Left Side: Avatar + Author Info */}
        <div className="flex items-center gap-3">
          
          {/* Avatar Circle */}
          <div className="w-11 h-11 rounded-full bg-[#D9D6FF] flex items-center justify-center font-bold text-black">
            {authorInitial}
          </div>

          {/* Name + Dept */}
          <div>
            <h3 className="font-semibold text-black text-sm">
              {authorName}
            </h3>
            <p className="text-xs text-gray-500">
              {post.author?.department || "Team"} • {formatDate(post.createdAt)}
            </p>
          </div>
        </div>

        {/* Tag */}
        <span className="text-xs px-3 py-1 rounded-full bg-[#F1EDE6] text-gray-600">
          {tag}
        </span>
      </div>

      {/* Title */}
      <h2 className="text-2xl font-extrabold text-black mb-3 cursor-pointer hover:underline">
        {post.title}
      </h2>

      {/* Preview */}
      <p className="text-base text-gray-600 mb-4 leading-relaxed">
        {preview}
      </p>

      {/* AI Summary */}
      <p className="text-sm italic text-gray-700 bg-white/60 px-4 py-3 rounded-xl mb-5 border border-white/40">
        ⚡ {summary}
      </p>

      {/* Reactions - Placeholder */}
      <div className="flex gap-6 text-sm text-gray-600">
        <button className="hover:text-black transition" onClick={(e) => e.stopPropagation()}>
          ❤️ View
        </button>
        <button className="hover:text-black transition" onClick={(e) => e.stopPropagation()}>
          💡 Feedback
        </button>
        <button className="hover:text-black transition" onClick={(e) => e.stopPropagation()}>
          💬 Discuss
        </button>
      </div>
    </div>
  );
}
