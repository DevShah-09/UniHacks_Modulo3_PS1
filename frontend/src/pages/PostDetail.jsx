export default function PostDetail() {
  const personas = [
    "🧠 Critical Thinker",
    "📈 Strategist",
    "🎯 Execution Manager",
    "⚖ Risk Evaluator",
    "💡 Innovator",
  ];

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-3 gap-6 mt-10 p-6">

      {/* Left Post */}
      <div className="col-span-2 bg-white shadow rounded-2xl p-6">
        <h1 className="text-3xl font-bold mb-3">
          Reflection on sprint delays
        </h1>
        <p className="text-gray-600 mb-5">
          Full content of the reflection goes here...
        </p>

        <button className="px-4 py-2 bg-gray-100 rounded-xl">
          ❤️ 12 💡 4 💬 6 Comments
        </button>
      </div>

      {/* Right AI Panel */}
      <div className="bg-purple-50 rounded-2xl p-5 shadow">
        <h2 className="font-bold text-xl mb-4">AI Feedback</h2>

        <div className="space-y-2">
          {personas.map((p) => (
            <button
              key={p}
              className="w-full text-left p-3 bg-white rounded-xl hover:bg-purple-100"
            >
              {p}
            </button>
          ))}
        </div>

        <button className="w-full mt-6 bg-black text-white py-3 rounded-xl">
          Perspective Pivot →
        </button>
      </div>
    </div>
  );
}
