export default function PostCard({ post }) {
  return (
    <div className="bg-white border border-[#E5E2DC] rounded-2xl p-5 shadow-sm hover:shadow-md transition">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <div>
          <h3 className="font-semibold text-[#111]">
            {post.author}
          </h3>
          <p className="text-xs text-gray-500">
            {post.dept} • {post.time}
          </p>
        </div>

        <span className="text-xs px-3 py-1 rounded-full bg-[#F1EDE6] text-gray-600">
          {post.tag}
        </span>
      </div>

      {/* Title */}
      <h2 className="text-lg font-bold text-[#111] mb-2 cursor-pointer hover:underline">
        {post.title}
      </h2>

      {/* Preview */}
      <p className="text-sm text-gray-600 mb-3">
        {post.preview}
      </p>

      {/* AI Summary */}
      <p className="text-sm italic text-[#444] bg-[#F8F6F2] px-3 py-2 rounded-xl mb-4">
        ⚡ {post.summary}
      </p>

      {/* Reactions */}
      <div className="flex gap-6 text-sm text-gray-600">
        <span>❤️ {post.reactions.heart}</span>
        <span>💡 {post.reactions.idea}</span>
        <span>💬 {post.reactions.comments} Comments</span>
      </div>
    </div>
  );
}
