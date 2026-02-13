import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/layout/Navbar";

export default function Write() {
  const navigate = useNavigate();
  const [contentType, setContentType] = useState("Reflection");
  const [safetyLevel, setSafetyLevel] = useState(1);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [error, setError] = useState("");
  
  // Feedback state
  const [showFeedback, setShowFeedback] = useState(false);
  const [publishedPost, setPublishedPost] = useState(null);
  const [selectedPersona, setSelectedPersona] = useState("mentor");

  const handleAiRefine = async () => {
    if (!content.trim()) {
      setError("Please write some content to refine.");
      return;
    }

    setIsRefining(true);
    setError("");

    try {
      const response = await api.post("/refine", { rant: content });
      setContent(response.data.refinedText);
    } catch (err) {
      console.error("Refine error:", err);
      setError("Failed to refine text. Please try again.");
    } finally {
      setIsRefining(false);
    }
  };

  const handlePublish = async () => {
    if (!content.trim()) {
      setError("Please write some content before publishing.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const title = `${contentType} - ${new Date().toLocaleDateString()}`;

      const response = await api.post("/posts", {
        title,
        content,
        anonymityLevel: parseInt(safetyLevel),
        tags: [contentType],
        summary: `A ${contentType.toLowerCase()} posted on ${new Date().toLocaleDateString()}`
      });

      // Set feedback display state
      setPublishedPost(response.data);
      setSelectedPersona("mentor");
      setShowFeedback(true);
    } catch (err) {
      console.error("Publish error:", err);
      setError(err.response?.data?.message || "Failed to publish. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const personas = [
    { key: "mentor", label: "Mentor", icon: "🧑‍🏫" },
    { key: "critic", label: "Critic", icon: "🤨" },
    { key: "strategist", label: "Strategist", icon: "📈" },
    { key: "executionManager", label: "Execution Manager", icon: "🎯" },
    { key: "riskEvaluator", label: "Risk Evaluator", icon: "⚖️" },
    { key: "innovator", label: "Innovator", icon: "💡" }
  ];

  const handleWriteAnother = () => {
    setShowFeedback(false);
    setPublishedPost(null);
    setSelectedPersona("mentor");
    setContent("");
    setError("");
  };

  return (
    <>
      <Navbar />
      {!showFeedback ? (
        // Write Form View
        <div className="max-w-4xl mx-auto mt-10 p-6">
          <h1 className="text-3xl font-bold mb-6">✍️ Write Reflection</h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {/* Content Type */}
          <select
            className="w-full p-3 border rounded-xl mb-5"
            value={contentType}
            onChange={(e) => setContentType(e.target.value)}
          >
            <option>Reflection</option>
            <option>Team Update</option>
            <option>Decision Log</option>
            <option>Experiment Outcome</option>
            <option>Blog Post</option>
          </select>

          {/* Safety Slider */}
          <div className="mb-6">
            <p className="font-semibold mb-2">Psychological Safety Level</p>
            <input
              type="range"
              min="1"
              max="3"
              className="w-full"
              value={safetyLevel}
              onChange={(e) => setSafetyLevel(parseInt(e.target.value))}
            />
            <p className="text-gray-500 text-sm mt-2">
              1 = Full Name • 2 = Department • 3 = Anonymous Thought
            </p>
          </div>

          {/* Editor */}
          <textarea
            placeholder="Write your thoughts..."
            className="w-full h-52 p-4 border rounded-xl mb-4"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          {/* AI Rewrite */}
          <button
            className="px-5 py-2 bg-purple-100 rounded-xl font-semibold mr-3 disabled:opacity-50"
            onClick={handleAiRefine}
            disabled={isRefining || loading}
          >
            {isRefining ? "✨ Refining..." : "✨ Make this constructive"}
          </button>

          {/* Publish */}
          <button
            className="px-6 py-2 bg-black text-white rounded-xl font-semibold disabled:opacity-50"
            onClick={handlePublish}
            disabled={loading || isRefining}
          >
            {loading ? "Publishing..." : "Publish →"}
          </button>
        </div>
      ) : (
        // Feedback Display View
        <div className="max-w-7xl mx-auto mt-10 p-6">
          <h1 className="text-3xl font-bold mb-8">✨ AI Feedback on Your Post</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Side - Submitted Content (Read-only) */}
            <div className="lg:col-span-1 bg-gray-50 rounded-xl p-6 h-fit">
              <h2 className="text-xl font-bold mb-4">Your Post</h2>
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-semibold">Type:</span> {contentType}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-semibold">Safety Level:</span> {safetyLevel === 1 ? "Full Name" : safetyLevel === 2 ? "Department" : "Anonymous"}
                </p>
              </div>
              <div className="bg-white border rounded-lg p-4 max-h-96 overflow-y-auto">
                <p className="text-gray-800 whitespace-pre-wrap">{publishedPost?.content}</p>
              </div>
            </div>

            {/* Right Side - AI Feedback Panel */}
            <div className="lg:col-span-2">
              {/* Persona Selection Buttons */}
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-3">Select Persona for Feedback</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {personas.map((persona) => (
                    <button
                      key={persona.key}
                      onClick={() => setSelectedPersona(persona.key)}
                      className={`p-3 rounded-lg font-semibold transition-all ${
                        selectedPersona === persona.key
                          ? "bg-black text-white shadow-lg transform scale-105"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      }`}
                    >
                      <span className="text-xl block mb-1">{persona.icon}</span>
                      <span className="text-xs sm:text-sm">{persona.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Feedback Content */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4">
                  {personas.find((p) => p.key === selectedPersona)?.icon} Feedback from {personas.find((p) => p.key === selectedPersona)?.label}
                </h3>
                <div className="bg-white border rounded-lg p-4 min-h-64 max-h-96 overflow-y-auto">
                  <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {publishedPost?.aiFeedback?.[selectedPersona] || "Loading feedback..."}
                  </p>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => navigate(`/posts/${publishedPost?.id}`)}
                  className="flex-1 px-6 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors"
                >
                  👁️ View Post
                </button>
                <button
                  onClick={() => navigate("/feed")}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                >
                  📰 Back to Feed
                </button>
                <button
                  onClick={handleWriteAnother}
                  className="flex-1 px-6 py-3 bg-purple-100 text-gray-800 rounded-xl font-semibold hover:bg-purple-200 transition-colors"
                >
                  ✍️ Write Another
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
