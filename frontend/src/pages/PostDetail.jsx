import { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import api, { toggleLike, refreshAiFeedback } from "../api/axios";
import Navbar from "../components/layout/Navbar";

/* ✅ Persona Theme Palette */
const PERSONAS = [
  { key: "mentor", label: "🧑‍🏫 Mentor", accent: "#7FE6C5" },
  { key: "critic", label: "🤨 Critic", accent: "#F28B82" },
  { key: "strategist", label: "📈 Strategist", accent: "#4BA9FF" },
  { key: "executionManager", label: "🎯 Execution Manager", accent: "#F5C76A" },
  { key: "riskEvaluator", label: "⚖️ Risk Evaluator", accent: "#B9A6FF" },
  { key: "innovator", label: "💡 Innovator", accent: "#7FE6C5" },
];

export default function PostDetail() {
  const { postId } = useParams();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [selectedPersona, setSelectedPersona] = useState("mentor");
  const [newCommentText, setNewCommentText] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [commentLoading, setCommentLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  /* Likes */
  const [likesCount, setLikesCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  /* AI */
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiError, setAiError] = useState(null);

  const commentInputRef = useRef(null);
  const location = useLocation();

  /* Load Data */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const userInfo = localStorage.getItem("userInfo");
        if (userInfo) setCurrentUserId(JSON.parse(userInfo)._id);

        const postRes = await api.get(`/posts/${postId}`);
        const fetchedPost = postRes.data;

        setPost(fetchedPost);
        setLikesCount(fetchedPost.likesCount || 0);
        setLiked(Boolean(fetchedPost.likedByCurrentUser));

        const commentsRes = await api.get(`/comments/${postId}`);
        setComments(commentsRes.data || []);
      } catch (err) {
        setError("Failed to load post details");
      } finally {
        setLoading(false);
      }
    };

    if (postId) fetchData();
  }, [postId]);

  /* Focus Comment */
  useEffect(() => {
    if (location?.state?.focusComment && commentInputRef.current) {
      commentInputRef.current.focus();
    }
  }, [location, post]);

  /* Add Comment */
  const handleAddComment = async () => {
    if (!newCommentText.trim()) return;

    try {
      setCommentLoading(true);

      const response = await api.post(`/comments`, {
        postId,
        content: newCommentText,
      });

      setComments([...comments, response.data]);
      setNewCommentText("");
    } catch {
      setError("Failed to post comment");
    } finally {
      setCommentLoading(false);
    }
  };

  /* Delete Comment */
  const handleDeleteComment = async (commentId) => {
    try {
      await api.delete(`/comments/${commentId}`);
      setComments(comments.filter((c) => c._id !== commentId));
    } catch {
      setError("Failed to delete comment");
    }
  };

  /* Like Toggle */
  const handleLike = async () => {
    if (!post) return;

    try {
      setLikeLoading(true);

      setLiked((prev) => !prev);
      setLikesCount((prev) => prev + (liked ? -1 : 1));

      const res = await toggleLike(post._id);
      setLiked(res.liked);
      setLikesCount(res.likesCount);
    } catch {
      setError("Failed to update like");
    } finally {
      setLikeLoading(false);
    }
  };

  /* Generate AI */
  const handleGenerateAi = async () => {
    if (!post) return;

    try {
      setAiGenerating(true);
      setAiError(null);

      const ai = await refreshAiFeedback(post._id);
      setPost((prev) => ({ ...prev, aiFeedback: ai }));
    } catch {
      setAiError("Failed to generate AI feedback");
    } finally {
      setAiGenerating(false);
    }
  };

  /* Date Format */
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <>
        <div className="h-screen flex items-center justify-center bg-[#1C1D25] text-gray-400">
          Loading...
        </div>
      </>
    );
  }

  if (!post) {
    return (
      <>
        <div className="h-screen flex items-center justify-center bg-[#1C1D25] text-gray-400">
          Post not found
        </div>
      </>
    );
  }

  const selectedPersonaData = post.aiFeedback?.[selectedPersona] || "";

  return (
    <>

      <div className="min-h-screen bg-[#1C1D25] text-white px-6 py-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-6">

            {/* Post Card */}
            <div className="relative bg-[#242631] rounded-2xl p-7 border border-white/10 shadow-md overflow-hidden">
              <div className="absolute left-0 top-0 h-full w-[6px] bg-[#4BA9FF]" />

              <h1 className="text-3xl font-bold mb-2 pl-3">
                {post.title}
              </h1>

              <p className="text-gray-400 text-sm mb-5 pl-3">
                {post.author?.fullName || "Anonymous"} • {formatDate(post.createdAt)}
              </p>

              <p className="text-gray-300 whitespace-pre-wrap leading-relaxed pl-3">
                {post.content}
              </p>

              {/* Reactions */}
              <div className="flex gap-3 mt-6 pl-3">
                <button
                  onClick={handleLike}
                  disabled={likeLoading}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition
                  ${liked ? "bg-[#F28B82] text-black" : "bg-[#1C1D25] text-gray-300 hover:bg-[#2A2C38]"}`}
                >
                  ❤️ {likesCount}
                </button>

                <div className="px-4 py-2 rounded-lg bg-[#1C1D25] text-gray-300 text-sm">
                  💡 {post.refineCount || 0}
                </div>

                <div className="px-4 py-2 rounded-lg bg-[#1C1D25] text-gray-300 text-sm">
                  💬 {comments.length}
                </div>
              </div>
            </div>

            {/* Comments */}
            <div className="bg-[#242631] rounded-2xl p-7 border border-white/10 shadow-md">
              <h2 className="text-xl font-bold mb-5">
                Comments ({comments.length})
              </h2>

              <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
                {comments.length === 0 ? (
                  <p className="text-gray-500 italic">
                    No comments yet. Be the first!
                  </p>
                ) : (
                  comments.map((comment) => (
                    <div
                      key={comment._id}
                      className="bg-[#1C1D25] border border-white/10 p-4 rounded-xl"
                    >
                      <div className="flex justify-between mb-2">
                        <p className="font-semibold text-sm">
                          {comment.author?.fullName || "Anonymous"}
                        </p>

                        {currentUserId === comment.author?._id && (
                          <button
                            onClick={() => handleDeleteComment(comment._id)}
                            className="text-red-400 text-xs hover:underline"
                          >
                            Delete
                          </button>
                        )}
                      </div>

                      <p className="text-gray-300 text-sm">
                        {comment.content}
                      </p>
                    </div>
                  ))
                )}
              </div>

              {/* Comment Input */}
              <textarea
                ref={commentInputRef}
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="Share your thoughts..."
                className="w-full mt-5 bg-[#1C1D25] border border-white/10 rounded-xl p-4 text-gray-200 text-sm resize-none"
                rows="3"
              />

              <button
                onClick={handleAddComment}
                disabled={commentLoading}
                className="w-full mt-4 bg-[#4BA9FF] text-black py-3 rounded-lg font-semibold hover:opacity-90 transition"
              >
                {commentLoading ? "Posting..." : "Post Comment"}
              </button>
            </div>
          </div>

          {/* RIGHT SIDE AI PANEL */}
          <div className="bg-[#242631] rounded-2xl p-6 border border-white/10 shadow-md h-fit">

            <h2 className="text-lg font-bold mb-5">
              AI Feedback
            </h2>

            {/* Persona Tiles */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {PERSONAS.map((p) => {
                const active = selectedPersona === p.key;

                return (
                  <button
                    key={p.key}
                    onClick={() => setSelectedPersona(p.key)}
                    className="relative h-[70px] w-full rounded-lg border border-white/10 flex items-center justify-center text-sm font-semibold transition"
                    style={{
                      backgroundColor: active ? p.accent : "#1C1D25",
                      color: active ? "black" : "white",
                    }}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>

            {/* Feedback Box */}
            <div className="bg-[#1C1D25] border border-white/10 rounded-xl p-5 text-gray-300 text-sm min-h-[160px]">
              {selectedPersonaData ? (
                selectedPersonaData
              ) : (
                <p className="italic text-gray-500">
                  No feedback yet.
                </p>
              )}
            </div>

            {/* Generate AI */}
            {!selectedPersonaData && (
              <button
                onClick={handleGenerateAi}
                disabled={aiGenerating}
                className="w-full mt-5 bg-[#B9A6FF] text-black py-3 rounded-lg font-semibold hover:opacity-90 transition"
              >
                {aiGenerating ? "Generating..." : "Generate AI Feedback"}
              </button>
            )}

            {aiError && (
              <p className="text-red-400 text-sm mt-3 italic">{aiError}</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
