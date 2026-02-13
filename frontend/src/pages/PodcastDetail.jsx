import { useParams } from "react-router-dom";

export default function PodcastDetail() {
  const { id } = useParams();

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6">
      {/* Audio Player */}
      <div className="bg-white shadow rounded-2xl p-6 mb-6">
        <h1 className="text-3xl font-bold mb-2">
          🎙 Podcast Episode {id}
        </h1>

        <audio controls className="w-full mt-4">
          <source src="" type="audio/mp3" />
        </audio>
      </div>

      {/* Echo Summary */}
      <div className="bg-purple-50 shadow rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-bold mb-2">✨ Echo Summary</h2>
        <p className="text-gray-600">
          Key points, decisions made, and action items will appear here...
        </p>
      </div>

      {/* Sentiment Heatmap Dummy */}
      <div className="bg-white shadow rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-bold mb-2">🔥 Sentiment Heatmap</h2>
        <p className="text-gray-500">
          Timeline showing tense / excited / neutral moments (Hackathon WOW).
        </p>

        <div className="h-6 bg-gray-200 rounded-full mt-3 overflow-hidden">
          <div className="h-full w-2/3 bg-black rounded-full"></div>
        </div>
      </div>

      {/* Comments */}
      <div className="bg-white shadow rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-2">💬 Comments</h2>
        <p className="text-gray-500">Engagement system coming soon...</p>
      </div>
    </div>
  );
}
