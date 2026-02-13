import { Link } from "react-router-dom";

export default function Podcasts() {
  return (
    <div className="max-w-5xl mx-auto mt-10 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">🎙 Podcasts Lounge</h1>

        <Link
          to="/podcasts/upload"
          className="bg-black text-white px-5 py-2 rounded-xl"
        >
          Upload Audio +
        </Link>
      </div>

      {/* Podcast Cards */}
      <div className="space-y-4">
        <div className="p-5 bg-white shadow rounded-2xl">
          <h2 className="font-bold text-xl">Episode: Sprint Retrospective</h2>
          <p className="text-gray-500">AI Summary: Key blockers + decisions...</p>
          <button className="mt-3 px-4 py-2 bg-gray-100 rounded-xl">
            ▶ Play
          </button>
        </div>
      </div>
    </div>
  );
}
