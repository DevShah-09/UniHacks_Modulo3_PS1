import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toggleLike } from "../../api/axios";

export default function PostCard({ post }) {
  const navigate = useNavigate();

  // ✅ Pastel Accent Palette
  const pastelPalette = [
    "#7FE6C5", // Mint Green
    "#4BA9FF", // Sky Blue
    "#F5C76A", // Warm Yellow
    "#F28B82", // Coral Pink
    "#B9A6FF", // Lavender
  ];

  // ✅ Stable Accent Color per Post
  const accentColor =
    pastelPalette[post._id.charCodeAt(0) % pastelPalette.length];

  // Tag
  const tag = post.tags?.[0] || "Reflection";

  // Author Info
  const authorName = post.author?.fullName || "Anonymous";
  const authorInitial = authorName[0]?.toUpperCase() || "A";

  // Likes State
  const [liked, setLiked] = useState(Boolean(post.likedByCurrentUser));
  const [likeCount, setLikeCount] = useState(post.likesCount || 0);

  // Like Handler
  const handleLike = async (e) => {
    e.stopPropagation();

    try {
      setLiked(!liked);
      setLikeCount((prev) => prev + (liked ? -1 : 1));

      const res = await toggleLike(post._id);
      setLiked(res.liked);
      setLikeCount(res.likesCount);
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  return (
    <div
      onClick={() => navigate(`/posts/${post._id}`)}
      className="
        relative bg-[#242631]
        border border-white/5
        rounded-2xl p-7
        shadow-md hover:shadow-lg
        transition cursor-pointer
        overflow-hidden
      "
    >
      {/* ✅ Pastel Accent Strip */}
      <div
        style={{ backgroundColor: accentColor }}
        className="absolute left-0 top-0 h-full w-[7px] rounded-l-2xl"
      />

      {/* Header */}
      <div className="flex justify-between items-center mb-6 pl-5">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-14 h-14 rounded-full bg-[#303241] flex items-center justify-center font-bold text-lg text-white">
            {authorInitial}
          </div>

          {/* Author */}
          <div>
            <h3 className="text-white font-semibold">{authorName}</h3>
            <p className="text-xs text-gray-400 italic">
              Posted {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Tag */}
        <span className="text-xs px-4 py-1 rounded-full bg-[#1C1D25] border border-white/10 text-gray-200">
          {tag}
        </span>
      </div>

      {/* Content */}
      <div
        className="
          bg-[#1C1D25]
          border border-white/10
          rounded-xl
          px-6 py-5
          ml-5
          text-gray-200
          text-sm
          leading-relaxed
        "
      >
        {post.mediaUrl && (
          <div className="mb-4">
            {post.mediaType === "video" ? (
              <video
                src={`http://localhost:5000${post.mediaUrl}`}
                controls
                className="w-full rounded-lg border border-white/10 max-h-60 object-cover"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <img
                src={`http://localhost:5000${post.mediaUrl}`}
                alt="Post Media"
                className="w-full rounded-lg border border-white/10 max-h-60 object-cover"
              />
            )}
          </div>
        )}
        {post.content.length > 200
          ? post.content.substring(0, 200) + "..."
          : post.content}
      </div>

      {/* ✅ Instagram Style Actions */}
      <div className="flex items-center gap-10 pl-5 mt-5 text-gray-400">

        {/* Like */}
        <button
          onClick={handleLike}
          className="
            flex items-center gap-2
            text-sm font-medium
            hover:text-white transition
          "
        >
          <span className="text-xl">{liked ? "❤️" : "🤍"}</span>
          {likeCount}
        </button>

        {/* Discuss */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/posts/${post._id}`);
          }}
          className="
            flex items-center gap-2
            text-sm font-medium
            hover:text-white transition
          "
        >
          <span className="text-xl">💬</span>
          Discuss
        </button>
      </div>
    </div>
  );
}
