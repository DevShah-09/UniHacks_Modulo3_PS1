import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/layout/Navbar";

export default function PodcastDetail() {
  const { id } = useParams();
  const [podcast, setPodcast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);

  useEffect(() => {
    const fetchPodcast = async () => {
      try {
        const response = await api.get(`/podcasts/${id}`);
        setPodcast(response.data);

        // Check for error state in transcription
        const transcriptionText = response.data.transcription?.text || "";
        const isTranscriptionError = transcriptionText.startsWith('[Transcription unavailable') || transcriptionText.startsWith('[Transcription error') || transcriptionText.startsWith('Transcription unavailable');

        // Trigger transcription if not exists or if it was an error
        if (response.data && (!response.data.summary || isTranscriptionError) && !response.data.transcription?.isTranscribed) {
          triggerTranscription(id);
        } else if (isTranscriptionError) {
          // Force trigger if it was an error but marked as transcribed
          triggerTranscription(id);
        }

      } catch (err) {
        console.error("Failed to fetch podcast:", err);
        setError("Failed to load podcast details.");
      } finally {
        setLoading(false);
      }
    };

    fetchPodcast();
  }, [id]);

  const triggerTranscription = async (podcastId, force = false) => {
    try {
      setSummaryLoading(true);
      const url = force ? `/podcasts/${podcastId}/transcribe?force=true` : `/podcasts/${podcastId}/transcribe`;
      const response = await api.post(url);
      // Update local state with the new podcast data containing summary
      setPodcast(response.data.podcast);
    } catch (err) {
      console.error("Transcription failed:", err);
      // Don't set main error, just maybe log it or show a small warning
    } finally {
      setSummaryLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>
      </>
    );
  }

  if (error || !podcast) {
    return (
      <>
        <Navbar />
        <div className="max-w-5xl mx-auto mt-10 p-6 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="mb-6">{error || "Podcast not found"}</p>
          <Link to="/podcasts" className="text-blue-600 hover:underline">← Back to Podcasts</Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto mt-10 p-6">
        <Link to="/podcasts" className="text-gray-500 hover:text-black mb-4 inline-block">← Back to Lounge</Link>

        {/* Audio Player */}
        <div className="bg-white shadow rounded-2xl p-6 mb-6">
          <div className="mb-4">
            <h1 className="text-3xl font-bold mb-2">🎙 {podcast.title}</h1>
            <p className="text-gray-500 text-sm">
              Posted by {podcast.author?.fullName} on {new Date(podcast.createdAt).toLocaleDateString()}
            </p>
          </div>

          {podcast.audioUrl && (
            <audio controls className="w-full mt-4">
              <source src={`http://localhost:5000${podcast.audioUrl}`} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          )}

          <div className="mt-6">
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{podcast.description}</p>
          </div>
        </div>

        {/* Echo Summary */}
        <div className="bg-purple-50 shadow rounded-2xl p-6 mb-6 border border-purple-100">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-purple-900">✨ Echo Summary</h2>
              {!summaryLoading && (
                <button
                  onClick={() => triggerTranscription(id, true)}
                  className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded hover:bg-purple-300 transition-colors"
                  title="Regenerate AI Insights"
                >
                  ↻ Regenerate
                </button>
              )}
            </div>
            {summaryLoading && (
              <span className="text-sm text-purple-600 flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating AI Insights...
              </span>
            )}
          </div>

          {podcast.summary ? (
            <div className="prose prose-purple max-w-none">
              <p className="text-gray-800 whitespace-pre-line">{podcast.summary}</p>
            </div>
          ) : summaryLoading ? (
            <p className="text-gray-500 italic">Listening to the episode and taking notes for you...</p>
          ) : (
            <p className="text-gray-500 italic">
              No summary available.
              <button
                onClick={() => triggerTranscription(id)}
                className="ml-2 text-purple-600 hover:underline font-semibold"
              >
                Generate Now
              </button>
            </p>
          )}
        </div>

        {/* Sentiment Heatmap */}
        <div className="bg-white shadow rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-2">🔥 Sentiment Heatmap</h2>
          <p className="text-gray-500 text-sm mb-3">
            Timeline showing the emotional arc of the conversation.
          </p>

          <div className="h-8 bg-gray-100 rounded-full mt-3 overflow-hidden flex w-full">
            {podcast.heatmap && podcast.heatmap.length > 0 ? (
              podcast.heatmap.map((block, index) => {
                let colorClass = "bg-gray-300";
                if (block.sentiment === "Excited" || block.sentiment === "Happy") colorClass = "bg-green-400";
                if (block.sentiment === "Tense" || block.sentiment === "Angry") colorClass = "bg-red-400";
                if (block.sentiment === "Sad") colorClass = "bg-blue-300";

                return (
                  <div
                    key={index}
                    className={`h-full ${colorClass} transition-all hover:opacity-80`}
                    style={{ width: `${100 / podcast.heatmap.length}%` }}
                    title={`${block.sentiment} (${Math.round(block.score * 100)}%)`}
                  ></div>
                );
              })
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                No sentiment data available
              </div>
            )}
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-2 px-1">
            <span>Start</span>
            <span>End</span>
          </div>
        </div>
      </div>
    </>
  );
}
