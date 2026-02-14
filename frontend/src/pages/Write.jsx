import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/layout/Navbar";

export default function Write() {
  const navigate = useNavigate();

  const [contentType, setContentType] = useState("Reflection");
  const [safetyLevel, setSafetyLevel] = useState(1);
  const [content, setContent] = useState("");
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const fileInputRef = useRef(null);

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
    { key: "innovator", label: "Innovator", icon: "💡" },
  ];

  // Pastel Accent Palette
  const accentColors = [
    "#7FE6C5", // Mint
    "#4BA9FF", // Sky Blue
    "#F5C76A", // Gold
    "#F28B82", // Coral Pink
    "#B9A6FF", // Lavender
    "#7FE6C5",
  ];

  // Local fallback feedback
  const localPersonaFallback = () => ({
    mentor:
      "This is a valuable reflection. Try adding what outcome you want next.",
    critic:
      "This could be clearer with more evidence or examples. What caused this?",
    strategist:
      "Think about how this connects to long-term goals and future planning.",
    executionManager:
      "Convert this into 1–2 actionable steps with owners and deadlines.",
    riskEvaluator:
      "Consider risks like morale or delivery impact. Try small pilots first.",
    innovator:
      "Try experimenting with alternative approaches and validate assumptions.",
  });

  // Cleanup debounce timer
  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  // Generate Live Feedback
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
        getFeedback: true,
      });

      const remote = response.data?.aiFeedback || {};
      const hasRemote = Object.values(remote).some(
        (v) => v && String(v).trim().length > 0
      );

      if (hasRemote) {
        setLiveAiFeedback(remote);
      } else {
        setLiveAiFeedback(localPersonaFallback());
      }
    } catch {
      setLiveAiFeedback(localPersonaFallback());
      setFeedbackError("Server failed — using fallback feedback");
    } finally {
      setFeedbackLoading(false);
    }
  };

  // Debounced typing
  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      generateLiveFeedback(newContent);
    }, 1000);
  };

  // AI Refine
  const handleAiRefine = async () => {
    if (!content.trim()) return;

    setIsRefining(true);

    try {
      const response = await api.post("/refine", { rant: content });
      setContent(response.data?.refinedText || content);
    } catch {
      setError("Refine failed.");
    } finally {
      setIsRefining(false);
    }
  };

  // Handle File Selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMediaFile(file);
      setMediaPreview(URL.createObjectURL(file));
    }
  };

  // Publish Post
  const handlePublish = async () => {
    if (!content.trim()) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", `${contentType} - ${new Date().toLocaleDateString()}`);
      formData.append("content", content);
      formData.append("anonymityLevel", safetyLevel);
      formData.append("tags", [contentType]);
      if (mediaFile) {
        formData.append("media", mediaFile);
      }

      const response = await api.post("/posts", formData, {
        headers: { "Content-Type": undefined },
      });

      navigate(`/posts/${response.data._id}`);
    } catch (err) {
      console.error("❌ Publish Error:", err);
      console.error("❌ Response Data:", err.response?.data);
      setError(err.response?.data?.message || "Failed to publish post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>

      <div className="h-[calc(100vh-90px)] bg-[#1C1D25] text-white px-6 py-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT EDITOR */}
          <div className="lg:col-span-2 bg-[#2A2C38] rounded-2xl p-6 border border-white/5 shadow-md">

            <h1 className="text-2xl font-semibold mb-6">
              Write Reflection
            </h1>

            {/* Slider */}
            <div className="mb-6">
              <p className="text-sm mb-2 text-gray-300">
                Psychological Safety Level
              </p>

              <input
                type="range"
                min="1"
                max="3"
                value={safetyLevel}
                onChange={(e) => setSafetyLevel(parseInt(e.target.value))}
                className="w-full accent-[#7FE6C5]"
              />

              <div className="flex justify-between text-xs text-gray-400 mt-2 px-1">
                <div className="flex flex-col items-center">
                  <span className="font-bold">1</span>
                  <span>Public</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="font-bold">2</span>
                  <span>Team</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="font-bold">3</span>
                  <span>Anonymous</span>
                </div>
              </div>
            </div>

            <textarea
              placeholder="Write your thoughts..."
              className="w-full h-52 bg-[#1C1D25] 
  border border-white/10 rounded-xl 
  p-4 text-gray-200 text-sm resize-none 
  mt-4"
              value={content}
              onChange={handleContentChange}
            />

            {/* Media Upload & Preview */}
            <div className="mt-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
                accept="image/*,video/*"
              />

              {mediaPreview ? (
                <div className="relative w-fit mt-2">
                  {mediaFile?.type.startsWith("video") ? (
                    <video
                      src={mediaPreview}
                      controls
                      className="max-h-40 rounded-lg border border-white/10"
                    />
                  ) : (
                    <img
                      src={mediaPreview}
                      alt="Preview"
                      className="max-h-40 rounded-lg border border-white/10"
                    />
                  )}
                  <button
                    onClick={() => {
                      setMediaFile(null);
                      setMediaPreview(null);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1C1D25] border border-white/10 text-gray-300 hover:text-white hover:border-white/30 transition text-sm"
                >
                  ➕ Add Image / Video
                </button>
              )}
            </div>


            {/* Buttons */}
            <div className="flex justify-between gap-5 mt-8 w-full">

              {/* Make Constructive (Pastel Pink) */}
              <button
                onClick={handleAiRefine}
                disabled={isRefining}
                className="w-1/2 py-3 rounded-lg font-semibold text-sm 
    transition disabled:opacity-50"
                style={{
                  backgroundColor: "#F28B82",
                  color: "black",
                }}
              >
                {isRefining ? "Refining..." : "Make Constructive"}
              </button>

              {/* Publish (Pastel Yellow) */}
              <button
                onClick={handlePublish}
                disabled={loading}
                className="w-1/2 py-3 rounded-lg font-semibold text-sm 
    transition disabled:opacity-50"
                style={{
                  backgroundColor: "#F5C76A",
                  color: "black",
                }}
              >
                {loading ? "Publishing..." : " Publish"}
              </button>


            </div>


            {error && (
              <p className="text-red-400 text-sm mt-4">{error}</p>
            )}
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-6">

            {/* Persona Selector */}
            <div className="bg-[#2A2C38] rounded-2xl p-6 border border-white/5 shadow-md">
              <h2 className="text-lg font-semibold mb-5">
                AI Personas
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {personas.map((p, index) => {
                  const accent = accentColors[index];
                  const isActive = selectedPersona === p.key;

                  return (
                    <button
                      key={p.key}
                      onClick={() => setSelectedPersona(p.key)}
                      className="relative flex flex-col items-center justify-center 
                      h-[85px] w-full border border-white/10 transition-all duration-200"
                      style={{
                        borderRadius: "12px",
                        backgroundColor: isActive ? accent : "#242631",
                        color: isActive ? "black" : "white",
                      }}
                    >
                      {/* Accent Strip */}
                      <div
                        className="absolute left-0 top-0 h-full w-[6px]"
                        style={{
                          backgroundColor: accent,
                          borderRadius: "12px 0 0 12px",
                        }}
                      />

                      <div className="text-xl mb-1">{p.icon}</div>
                      <span className="text-sm font-semibold">
                        {p.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Feedback Box */}
            <div className="bg-[#2A2C38] rounded-2xl p-6 border border-white/5 shadow-md w-full">
              <h2 className="text-lg font-semibold mb-4">
                {personas.find((p) => p.key === selectedPersona)?.label} Feedback
              </h2>

              <div
                className="w-full bg-[#1C1D25] border border-white/10 rounded-xl 
                p-6 min-h-[170px] text-gray-300 overflow-y-auto"
              >
                {feedbackLoading ? (
                  <p className="text-gray-400 italic">
                    Generating feedback...
                  </p>
                ) : liveAiFeedback[selectedPersona] ? (
                  liveAiFeedback[selectedPersona]
                ) : (
                  <p className="italic text-gray-500">
                    Write 50+ characters to see AI feedback...
                  </p>
                )}
              </div>

              {feedbackError && (
                <p className="text-red-400 text-sm mt-3 italic">
                  {feedbackError}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
