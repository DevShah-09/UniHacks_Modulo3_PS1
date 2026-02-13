export default function Write() {
  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <h1 className="text-3xl font-bold mb-6">✍️ Write Reflection</h1>

      {/* Content Type */}
      <select className="w-full p-3 border rounded-xl mb-5">
        <option>Reflection</option>
        <option>Team Update</option>
        <option>Decision Log</option>
        <option>Experiment Outcome</option>
        <option>Blog Post</option>
      </select>

      {/* Safety Slider */}
      <div className="mb-6">
        <p className="font-semibold mb-2">Psychological Safety Level</p>
        <input type="range" min="1" max="3" className="w-full" />
        <p className="text-gray-500 text-sm mt-2">
          1 = Full Name • 2 = Department • 3 = Anonymous Thought
        </p>
      </div>

      {/* Editor */}
      <textarea
        placeholder="Write your thoughts..."
        className="w-full h-52 p-4 border rounded-xl mb-4"
      />

      {/* AI Rewrite */}
      <button className="px-5 py-2 bg-purple-100 rounded-xl font-semibold mr-3">
        ✨ Make this constructive
      </button>

      {/* Publish */}
      <button className="px-6 py-2 bg-black text-white rounded-xl font-semibold">
        Publish →
      </button>
    </div>
  );
}
