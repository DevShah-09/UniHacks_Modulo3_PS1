import { useState, useRef, useEffect } from "react";
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

  // Live feedback state
  const [liveAiFeedback, setLiveAiFeedback] = useState({});
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackError, setFeedbackError] = useState("");
  const debounceTimer = useRef(null);

  const [selectedPersona, setSelectedPersona] = useState("mentor");

  const personas = [
    { key: "mentor", label: "Mentor", icon: "🧑‍🏫" },
    { key: "critic", label: "Critic", icon: "🤨" },
    { key: "strategist", label: "Strategist", icon: "📈" },
    { key: "executionManager", label: "Execution Manager", icon: "🎯" },
    { key: "riskEvaluator", label: "Risk Evaluator", icon: "⚖️" },
    { key: "innovator", label: "Innovator", icon: "💡" }
  ];

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  const generateLiveFeedback = async (currentContent) => {
    if (currentContent.trim().length <= 50) {
      setLiveAiFeedback({});
      setFeedbackError("");
      return;
    }

    setFeedbackLoading(true);
    setFeedbackError("");

    try {
      const response = await api.post("/refine", {
        rant: currentContent,
        getFeedback: true // Flag to request all persona feedback
      });

      // Assuming backend returns aiFeedback object with all personas
      setLiveAiFeedback(response.data.aiFeedback || {});
    } catch (err) {
      console.error("Feedback generation error:", err);
      setFeedbackError("Failed to generate feedback. Retrying...");
      setLiveAiFeedback({});
    } finally {
      setFeedbackLoading(false);
    }
  };

  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);

    // Clear existing debounce timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set new debounce timer - wait 1 second after user stops typing
    debounceTimer.current = setTimeout(() => {
      generateLiveFeedback(newContent);
    }, 1000);
  };

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
      // Re-generate feedback with refined content
      generateLiveFeedback(response.data.refinedText);
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

      // Navigate directly to the new post
      navigate(`/post/${response.data._id}`);
    } catch (err) {
      console.error("Publish error:", err);
      setError(err.response?.data?.message || "Failed to publish. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      {/* Write Form View with Split Layout (Editor + Live Feedback) */}
      <div className="max-w-7xl mx-auto mt-10 p-6">
        <h1 className="text-3xl font-bold mb-6">✍️ Write Reflection</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Editor */}
          <div className="lg:col-span-1">
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
              className="w-full h-80 p-4 border rounded-xl mb-4 font-mono text-sm"
              value={content}
              onChange={handleContentChange}
            />

            {/* AI Rewrite */}
            <button
              className="px-5 py-2 bg-purple-100 rounded-xl font-semibold mr-3 disabled:opacity-50 hover:bg-purple-200 transition-colors"
              onClick={handleAiRefine}
              disabled={isRefining || loading || content.trim().length === 0}
            >
              {isRefining ? "✨ Refining..." : "✨ Make this constructive"}
            </button>

            {/* Publish */}
            <button
              className="px-6 py-2 bg-black text-white rounded-xl font-semibold disabled:opacity-50 hover:bg-gray-800 transition-colors"
              onClick={handlePublish}
              disabled={loading || isRefining || content.trim().length === 0}
            >
              {loading ? "Publishing..." : "Publish →"}
            </button>
          </div>

          {/* Right Side - Live AI Feedback Panel */}
          <div className="lg:col-span-2">
            {/* Persona Selection Buttons */}
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-3">AI Personas</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {personas.map((persona) => (
                  <button
                    key={persona.key}
                    onClick={() => setSelectedPersona(persona.key)}
                    className={`p-3 rounded-lg font-semibold transition-all ${selectedPersona === persona.key
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
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 h-full">
              <h3 className="text-xl font-bold mb-4">
                {personas.find((p) => p.key === selectedPersona)?.icon} {personas.find((p) => p.key === selectedPersona)?.label}
              </h3>
              <div className="bg-white border rounded-lg p-4 min-h-96 max-h-96 overflow-y-auto">
                {content.trim().length <= 50 ? (
                  <p className="text-gray-400 italic">✍️ Write 50+ characters to see feedback</p>
                ) : feedbackLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                      <p className="text-gray-600">Generating feedback...</p>
                    </div>
                  </div>
                ) : feedbackError ? (
                  <p className="text-red-600 text-sm">{feedbackError}</p>
                ) : (
                  <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {liveAiFeedback[selectedPersona] || "No feedback available yet"}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
