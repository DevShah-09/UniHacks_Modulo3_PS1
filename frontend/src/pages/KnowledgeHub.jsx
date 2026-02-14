import { useState, useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import PostCard from "../components/layout/PostCard";
import { searchPosts, getTags } from "../api/axios";

export default function KnowledgeHub() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [tags, setTags] = useState([]);
  const [results, setResults] = useState([]);
  const [contentType, setContentType] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch tags
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tagsData = await getTags();
        setTags(Array.isArray(tagsData) ? tagsData : []);
      } catch (err) {
        console.error("Error fetching tags:", err);
        setError("Failed to load tags");
      }
    };
    fetchTags();
  }, []);

  // Debounced Search
  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true);
      setError("");

      try {
        const response = await searchPosts(
          searchQuery,
          selectedTags,
          contentType !== "all" ? contentType : ""
        );

        setResults(
          Array.isArray(response) ? response : response.results || []
        );
      } catch (err) {
        console.error("Error searching posts:", err);
        setError("Failed to search posts. Please try again.");
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedTags, contentType]);

  // Toggle tag selection
  const toggleTag = (tagName) => {
    setSelectedTags((prev) =>
      prev.includes(tagName)
        ? prev.filter((t) => t !== tagName)
        : [...prev, tagName]
    );
  };

  const contentTypes = [
    { label: "All", value: "all" },
    { label: "Reflection", value: "reflection" },
    { label: "Anonymous", value: "anonymous" },
    { label: "Podcast", value: "podcast" },
  ];

  return (
    <div className="min-h-screen bg-[#1C1D25] text-white">
      

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 px-6 py-8">

        {/* LEFT SIDEBAR */}
        <div className="lg:col-span-1 space-y-6">

          {/* TAGS */}
          <div className="relative bg-[#242631] rounded-2xl p-5 border border-white/10 shadow-md overflow-hidden">
            <div className="absolute left-0 top-0 h-full w-[6px] bg-[#7FE6C5]" />

            <h3 className="text-lg font-bold mb-4 pl-3">Tags</h3>

            <div className="space-y-2 pl-3">
              {tags.length > 0 ? (
                tags.map((tag, index) => {
                  const pastel =
                    ["#7FE6C5", "#4BA9FF", "#F5C76A", "#F28B82", "#B9A6FF"][
                      index % 5
                    ];

                  const active = selectedTags.includes(tag);

                  return (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className="w-full text-left px-4 py-2 rounded-xl text-sm font-medium transition"
                      style={{
                        backgroundColor: active ? pastel : "#1C1D25",
                        color: active ? "black" : "white",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      {tag}
                    </button>
                  );
                })
              ) : (
                <p className="text-gray-500 text-sm">
                  No tags available
                </p>
              )}
            </div>
          </div>

          {/* CONTENT TYPE */}
          <div className="relative bg-[#242631] rounded-2xl p-5 border border-white/10 shadow-md overflow-hidden">
            <div className="absolute left-0 top-0 h-full w-[6px] bg-[#F5C76A]" />

            <h3 className="text-lg font-bold mb-4 pl-3">
              🎛 Content Type
            </h3>

            <div className="space-y-2 pl-3">
              {contentTypes.map((type, index) => {
                const pastel =
                  ["#4BA9FF", "#B9A6FF", "#F28B82", "#7FE6C5"][
                    index % 4
                  ];

                const active = contentType === type.value;

                return (
                  <button
                    key={type.value}
                    onClick={() => setContentType(type.value)}
                    className="w-full text-left px-4 py-2 rounded-xl text-sm font-medium transition"
                    style={{
                      backgroundColor: active ? pastel : "#1C1D25",
                      color: active ? "black" : "white",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    {type.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="lg:col-span-3 space-y-6">

          {/* TITLE */}
          <h1 className="text-4xl font-bold">
            Knowledge Hub
          </h1>

          <p className="text-gray-400">
            Search reflections, podcasts, and internal learnings across your org.
          </p>

          {/* SEARCH BAR */}
          <input
            type="text"
            placeholder="Search insights..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#242631] border border-white/10 rounded-xl px-5 py-4 text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4BA9FF]"
          />

          {/* RESULTS SUMMARY */}
          {!loading && results.length > 0 && (
            <p className="text-gray-400 text-sm">
              Showing{" "}
              <span className="text-white font-semibold">
                {results.length}
              </span>{" "}
              results
            </p>
          )}

          {/* LOADING */}
          {loading && (
            <div className="text-center py-12">
              <p className="text-gray-400 italic">
                Searching knowledge vault...
              </p>
            </div>
          )}

          {/* ERROR */}
          {error && (
            <div className="bg-[#F28B82]/20 border border-[#F28B82] text-[#F28B82] px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          {/* EMPTY */}
          {!loading && results.length === 0 && !error && (
            <div className="bg-[#242631] border border-white/10 rounded-2xl p-10 text-center">
              <p className="text-gray-400 italic">
                No results found. Try adjusting filters ✨
              </p>
            </div>
          )}

          {/* RESULTS */}
          {!loading && results.length > 0 && (
            <div className="space-y-5">
              {results.map((post) => (
                <PostCard key={post._id || post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
