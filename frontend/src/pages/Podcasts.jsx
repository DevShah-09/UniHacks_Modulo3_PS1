import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/layout/Navbar";

export default function Podcasts() {
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const response = await api.get("/podcasts");
        setPodcasts(response.data);
      } catch (err) {
        console.error("Failed to fetch podcasts:", err);
        setError("Failed to load podcasts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPodcasts();
  }, []);

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto mt-10 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">🎙 Podcasts Lounge</h1>

          <Link
            to="/podcasts/upload"
            className="bg-black text-white px-5 py-2 rounded-xl hover:bg-gray-800 transition-colors"
          >
            Upload Audio +
          </Link>
        </div>

        {/* Podcast Cards */}
        {loading ? (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-black mb-2"></div>
            <p>Loading podcasts...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-4 rounded-xl">{error}</div>
        ) : podcasts.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-2xl">
            <p className="text-gray-500 mb-4">No podcasts found. Be the first to upload one!</p>
            <Link to="/podcasts/upload" className="text-blue-600 hover:underline">Upload a Podcast</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {podcasts.map((podcast) => (
              <div key={podcast._id} className="p-5 bg-white shadow rounded-2xl hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="font-bold text-xl mb-1">{podcast.title}</h2>
                    <p className="text-sm text-gray-500 mb-2">
                      By {podcast.author?.fullName || "Unknown"} • {new Date(podcast.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-gray-600 line-clamp-2">{podcast.description}</p>
                  </div>
                  <Link
                    to={`/podcasts/${podcast._id}`}
                    className="ml-4 px-4 py-2 bg-gray-100 rounded-xl hover:bg-gray-200 text-nowrap"
                  >
                    ▶ Play
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
