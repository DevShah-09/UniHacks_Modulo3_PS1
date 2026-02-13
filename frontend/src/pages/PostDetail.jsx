import { useState, useEffect, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import api, { toggleLike, refreshAiFeedback } from '../api/axios';
import Navbar from '../components/layout/Navbar';

const PERSONAS = [
  { key: 'mentor', label: '🧑‍🏫 Mentor', color: 'blue' },
  { key: 'critic', label: '🤨 Critic', color: 'red' },
  { key: 'strategist', label: '📈 Strategist', color: 'purple' },
  { key: 'executionManager', label: '🎯 Execution Manager', color: 'green' },
  { key: 'riskEvaluator', label: '⚖️ Risk Evaluator', color: 'yellow' },
  { key: 'innovator', label: '💡 Innovator', color: 'pink' },
];

export default function PostDetail() {
  const { postId } = useParams();

  // State management
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [selectedPersona, setSelectedPersona] = useState('mentor');
  const [newCommentText, setNewCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentLoading, setCommentLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  // Likes state
  const [likesCount, setLikesCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  // AI generation state
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiError, setAiError] = useState(null);

  // Comment input ref + location state
  const commentInputRef = useRef(null);
  const location = useLocation();

  // Debug: show raw AI payload
  const [showRawAi, setShowRawAi] = useState(false);

  // Fetch post and comments data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get current user from localStorage
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
          setCurrentUserId(JSON.parse(userInfo)._id);
        }

        // Fetch post
        const postResponse = await api.get(`/posts/${postId}`);
        const fetchedPost = postResponse.data;
        setPost(fetchedPost);

        // Initialize likes from server-provided metadata
        setLikesCount(fetchedPost.likesCount || 0);
        setLiked(Boolean(fetchedPost.likedByCurrentUser));

        // Fetch comments (fixed endpoint)
        const commentsResponse = await api.get(`/comments/${postId}`);
        setComments(commentsResponse.data || []);

        // If the post lacks AI feedback, try to generate it (non-blocking)
        const hasAi = fetchedPost.aiFeedback && Object.values(fetchedPost.aiFeedback).some(v => v && String(v).trim().length > 0);
        if (!hasAi) {
          try {
            setAiGenerating(true);
            const generated = await refreshAiFeedback(fetchedPost._id);
            console.log('📥 [PostDetail] Auto-generated AI:', generated);
            setPost(prev => ({ ...prev, aiFeedback: generated }));
            setAiError(null);
          } catch (aiErr) {
            console.warn('AI refresh failed:', aiErr);
            const msg = aiErr?.response?.data?.message || aiErr.message || 'AI feedback unavailable';
            setAiError(msg);
          } finally {
            setAiGenerating(false);
          }
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load post details');
        console.error('Error fetching post:', err);
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchData();
    }
  }, [postId]);

  // Focus comment input when navigated with { state: { focusComment: true } }
  useEffect(() => {
    if (location?.state?.focusComment && commentInputRef.current) {
      commentInputRef.current.focus();
    }
  }, [location, post]);

  // Handle adding a new comment
  const handleAddComment = async () => {
    if (!newCommentText.trim()) return;

    try {
      setCommentLoading(true);
      const response = await api.post(`/comments`, {
        postId,
        content: newCommentText,
      });

      setComments([...comments, response.data]);
      setNewCommentText('');
    } catch (err) {
      setError('Failed to post comment');
      console.error('Error posting comment:', err);
    } finally {
      setCommentLoading(false);
    }
  };

  // Handle deleting a comment
  const handleDeleteComment = async (commentId) => {
    try {
      await api.delete(`/comments/${commentId}`);
      setComments(comments.filter(c => c._id !== commentId));
    } catch (err) {
      setError('Failed to delete comment');
      console.error('Error deleting comment:', err);
    }
  };

  // Handle like/unlike (optimistic UI)
  const handleLike = async () => {
    if (!post) return;
    try {
      setLikeLoading(true);
      // optimistic
      setLiked(prev => !prev);
      setLikesCount(prev => prev + (liked ? -1 : 1));

      const res = await toggleLike(post._id);
      setLiked(res.liked);
      setLikesCount(res.likesCount);
    } catch (err) {
      // revert on error
      setLiked(prev => !prev);
      setLikesCount(prev => prev + (liked ? 1 : -1));
      console.error('Like error:', err);
      setError('Failed to update like');
    } finally {
      setLikeLoading(false);
    }
  };

  // Manually request AI feedback regeneration for this post
  const handleGenerateAi = async () => {
    if (!post) return;
    try {
      console.log('📡 [PostDetail] Requesting AI regeneration for post', post._id);
      setAiGenerating(true);
      setAiError(null);

      const ai = await refreshAiFeedback(post._id);
      console.log('📥 [PostDetail] AI regenerated:', ai);

      // attach to post
      setPost(prev => ({ ...prev, aiFeedback: ai }));
      setAiError(null);
    } catch (err) {
      console.error('AI generate error:', err);
      const message = err?.response?.data?.message || err.message || 'Failed to generate AI feedback';
      setAiError(message);
    } finally {
      setAiGenerating(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="max-w-6xl mx-auto p-6 text-center">
          <p className="text-gray-500">Loading post details...</p>
        </div>
      </>
    );
  }

  if (error && !post) {
    return (
      <>
        <Navbar />
        <div className="max-w-6xl mx-auto p-6 text-center">
          <p className="text-red-500">{error}</p>
        </div>
      </>
    );
  }

  if (!post) {
    return (
      <>
        <Navbar />
        <div className="max-w-6xl mx-auto p-6 text-center">
          <p className="text-gray-500">Post not found</p>
        </div>
      </>
    );
  }

  const selectedPersonaData = post.aiFeedback?.[selectedPersona] || '';

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto grid grid-cols-3 gap-6 mt-10 p-6">
        {/* Left Column: Post Content and Comments */}
        <div className="col-span-2 space-y-6">
          {/* Post Section */}
          <div className="bg-white shadow rounded-2xl p-6">
            {/* Post Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
              <div className="flex items-center gap-4 text-gray-600 mb-4">
                <span className="font-semibold">{post.author?.fullName || 'Anonymous'}</span>
                <span>•</span>
                <span>{formatDate(post.createdAt)}</span>
              </div>
            </div>

            {/* Post Content */}
            <div className="mb-6 text-gray-700 whitespace-pre-wrap">
              {post.content}
            </div>

            {/* Reaction Counts */}
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={handleLike}
                disabled={likeLoading}
                className={`px-4 py-2 rounded-xl text-sm transition ${liked ? 'bg-red-50 text-red-600 font-semibold' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                ❤️ {likesCount}
              </button>

              <div className="px-4 py-2 bg-gray-100 rounded-xl text-sm">
                💡 {post.refineCount || 0}
              </div>

              <div className="px-4 py-2 bg-gray-100 rounded-xl text-sm">
                💬 {comments.length}
              </div>
            </div>

            {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
          </div>

          {/* Comments Section */}
          <div className="bg-white shadow rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-6">Comments ({comments.length})</h2>

            {/* Comments List */}
            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
              {comments.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No comments yet. Be the first!</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment._id} className="bg-gray-50 p-4 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold">{comment.author?.fullName || 'Anonymous'}</span>
                        <span className="text-gray-500 text-sm">{formatDate(comment.createdAt)}</span>
                      </div>
                      {currentUserId === comment.author?._id && (
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          className="text-red-500 hover:text-red-700 text-sm font-semibold"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                    <p className="text-gray-700">{comment.content}</p>
                  </div>
                ))
              )}
            </div>

            {/* Comment Input */}
            <div className="border-t pt-6">
              <div className="space-y-3">
                        <textarea
                  ref={commentInputRef}
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                />
                <button
                  onClick={handleAddComment}
                  disabled={commentLoading || !newCommentText.trim()}
                  className="w-full bg-blue-600 text-white py-2 rounded-xl font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {commentLoading ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Personas Panel */}
        <div className="bg-purple-50 rounded-2xl p-5 shadow h-fit">
          <h2 className="font-bold text-xl mb-4">AI Feedback</h2>

          {/* Persona Buttons */}
          <div className="space-y-2 mb-6">
            {PERSONAS.map((persona) => (
              <button
                key={persona.key}
                onClick={() => setSelectedPersona(persona.key)}
                className={`w-full text-left p-3 rounded-xl font-semibold transition ${selectedPersona === persona.key
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-white hover:bg-purple-100'
                  }`}
              >
                {persona.label}
              </button>
            ))}
          </div>

          {/* Selected Persona Feedback */}
          <div className="bg-white p-4 rounded-xl max-h-96 overflow-y-auto">
            {selectedPersonaData ? (
              <p className="text-gray-700 text-sm whitespace-pre-wrap">{selectedPersonaData}</p>
            ) : (
              <div className="text-center">
                <p className="text-gray-400 text-sm italic mb-3">No feedback available for this persona</p>

                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={handleGenerateAi}
                    disabled={aiGenerating}
                    className="px-4 py-2 bg-black text-white rounded-full text-sm"
                  >
                    {aiGenerating ? 'Generating...' : 'Generate AI feedback'}
                  </button>

                  <button
                    onClick={() => setShowRawAi(s => !s)}
                    className="px-3 py-1 border rounded text-xs"
                  >
                    {showRawAi ? 'Hide raw AI' : 'Show raw AI'}
                  </button>
                </div>

                {aiError && <p className="text-red-500 text-sm mt-2">{aiError}</p>}

                {showRawAi && (
                  <pre className="mt-3 p-3 bg-gray-50 rounded text-xs overflow-x-auto text-left">
                    {JSON.stringify(post.aiFeedback || {}, null, 2)}
                  </pre>
                )}
              </div>
            )}
          </div>

          {/* Perspective Pivot Button */}
          <button className="w-full mt-6 bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition">
            Perspective Pivot →
          </button>
        </div>
      </div>
    </>
  );
}
