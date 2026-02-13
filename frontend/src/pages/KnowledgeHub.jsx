import { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import PostCard from '../components/posts/PostCard';
import { searchPosts, getTags } from '../api/axios';

export default function KnowledgeHub() {
  // State variables
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [tags, setTags] = useState([]);
  const [results, setResults] = useState([]);
  const [contentType, setContentType] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [debounceTimer, setDebounceTimer] = useState(null);

  // Fetch tags on component mount
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tagsData = await getTags();
        setTags(Array.isArray(tagsData) ? tagsData : []);
      } catch (err) {
        console.error('Error fetching tags:', err);
        setError('Failed to load tags');
      }
    };
    fetchTags();
  }, []);

  // Search and filter posts with debouncing
  useEffect(() => {
    // Clear previous timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Set new timer for debounced search (300ms)
    const timer = setTimeout(async () => {
      setLoading(true);
      setError('');
      try {
        const response = await searchPosts(
          searchQuery,
          selectedTags,
          contentType !== 'all' ? contentType : ''
        );
        setResults(Array.isArray(response) ? response : (response.results || []));
      } catch (err) {
        console.error('Error searching posts:', err);
        setError('Failed to search posts. Please try again.');
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    setDebounceTimer(timer);

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

  // Change content type filter
  const handleContentTypeChange = (type) => {
    setContentType(type);
  };

  const contentTypes = [
    { label: 'All', value: 'all' },
    { label: 'Reflection', value: 'reflection' },
    { label: 'Anonymous', value: 'anonymous' },
    { label: 'Podcast', value: 'podcast' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto grid grid-cols-4 gap-6 p-6 mt-6">
        {/* Left Sidebar */}
        <div className="col-span-1">
          {/* Tags Section */}
          <div className="bg-white shadow rounded-2xl p-5 mb-6">
            <h3 className="font-bold text-lg mb-4">Tags</h3>
            <div className="space-y-2">
              {tags.length > 0 ? (
                tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition ${
                      selectedTags.includes(tag)
                        ? 'bg-blue-500 text-white font-semibold'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No tags available</p>
              )}
            </div>
          </div>

          {/* Content Type Filter */}
          <div className="bg-white shadow rounded-2xl p-5">
            <h3 className="font-bold text-lg mb-4">Content Type</h3>
            <div className="space-y-2">
              {contentTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => handleContentTypeChange(type.value)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition ${
                    contentType === type.value
                      ? 'bg-blue-500 text-white font-semibold'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="col-span-3">
          <h1 className="text-4xl font-bold mb-6">📚 Knowledge Hub</h1>

          {/* Search Input */}
          <input
            type="text"
            placeholder="Search insights..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-xl mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Results Summary */}
          {!loading && results.length > 0 && (
            <p className="text-gray-600 mb-4 font-medium">
              Showing {results.length} result{results.length !== 1 ? 's' : ''}{' '}
              {searchQuery && `for "${searchQuery}"`}
              {selectedTags.length > 0 && ` with tags: ${selectedTags.join(', ')}`}
            </p>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Searching...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {/* Results */}
          {!loading && results.length === 0 && !error && (
            <div className="text-center py-12 bg-white shadow rounded-2xl">
              <p className="text-gray-500 text-lg">
                {searchQuery || selectedTags.length > 0
                  ? 'No results found. Try adjusting your filters.'
                  : 'Start searching or select tags to explore content.'}
              </p>
            </div>
          )}

          {/* Search Results Grid */}
          {!loading && results.length > 0 && (
            <div className="space-y-4">
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
