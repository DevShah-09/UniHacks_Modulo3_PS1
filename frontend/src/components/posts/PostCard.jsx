export default function PostCard({ post }) {
  return (
    <div
      className="bg-white/60 backdrop-blur-xl border border-white/40 
      rounded-3xl p-7 shadow-md hover:shadow-xl hover:-translate-y-1 
      transition-all duration-300"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        
        {/* Left Side: Avatar + Author Info */}
        <div className="flex items-center gap-3">
          
          {/* Avatar Circle */}
          <div className="w-11 h-11 rounded-full bg-[#D9D6FF] flex items-center justify-center font-bold text-black">
            {post.author[0]}
          </div>

          {/* Name + Dept */}
          <div>
            <h3 className="font-semibold text-black text-sm">
              {post.author}
            </h3>
            <p className="text-xs text-gray-500">
              {post.dept} • {post.time}
            </p>
          </div>
        </div>

        {/* Tag */}
        <span className="text-xs px-3 py-1 rounded-full bg-[#F1EDE6] text-gray-600">
          {post.tag}
        </span>
      </div>

      {/* Title */}
      <h2 className="text-2xl font-extrabold text-black mb-3 cursor-pointer hover:underline">
        {post.title}
      </h2>

      {/* Preview */}
      <p className="text-base text-gray-600 mb-4 leading-relaxed">
        {post.preview}
      </p>

      {/* AI Summary */}
      <p className="text-sm italic text-gray-700 bg-white/60 px-4 py-3 rounded-xl mb-5 border border-white/40">
        ⚡ {post.summary}
      </p>

      {/* Reactions */}
      <div className="flex gap-6 text-sm text-gray-600">
        <button className="hover:text-black transition">
          ❤️ {post.reactions.heart}
        </button>
        <button className="hover:text-black transition">
          💡 {post.reactions.idea}
        </button>
        <button className="hover:text-black transition">
          💬 {post.reactions.comments} Comments
        </button>
      </div>
    </div>
  );
}
