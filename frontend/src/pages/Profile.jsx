import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserProfile } from "../api/axios";

export default function Profile() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("posts");
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  const tabs = [
    { key: "posts", label: "📝 Posts" },
    { key: "podcasts", label: "🎙 Podcasts" },
    { key: "ai", label: "🧠 AI Feedback" },
    { key: "drafts", label: "📌 Drafts" },
    { key: "saved", label: "⭐ Saved" },
  ];

  // Fetcher with local fallback (so page still renders if server is unreachable)
  const currentUserInfo =
    typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('userInfo') || 'null')
      : null;

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUserProfile(id);
      setProfile(data);
    } catch (err) {
      console.error('Failed to load profile', err);
      const serverMessage = err?.response?.data?.message || err?.message || 'Failed to load profile';
      setError(serverMessage);

      // If the requested profile is the currently-logged-in user, show a local fallback
      if (currentUserInfo && currentUserInfo._id === id) {
        const fallback = {
          user: {
            _id: currentUserInfo._id,
            fullName: currentUserInfo.fullName || 'You',
            department: currentUserInfo.department || '',
            createdAt: currentUserInfo.createdAt || new Date().toISOString(),
            defaultAnonymityLevel: 2,
            visibility: 'organization',
            allowAiFeedback: true,
            allowAnonymousComments: false,
          },
          stats: { postsCount: 0, podcastsCount: 0, commentsCount: 0, reactionsCount: 0 },
          badges: [],
          reflectionJourney: { joinedOrg: currentUserInfo.createdAt || new Date().toISOString(), firstReflection: null, topPostTitle: null, topPodcastTitle: null, aiTheme: null },
          aiPersonalitySummary: null,
        };
        setProfile(fallback);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const retry = () => {
    fetchProfile();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1C1D25] text-white px-6 py-10">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="h-56 bg-[#242631] rounded-2xl animate-pulse" />
          <div className="h-40 bg-[#242631] rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#1C1D25] text-white px-6 py-10">
        <div className="max-w-4xl mx-auto text-center text-gray-300">
          <h2 className="text-2xl font-semibold mb-4">Profile unavailable</h2>
          <p className="mb-6">{error || 'This profile could not be loaded.'}</p>
          <div className="flex justify-center gap-3">
            <button onClick={retry} className="px-4 py-2 bg-[#4BA9FF] text-black rounded-full font-semibold">Retry</button>
            <button onClick={() => window.location.href = '/feed'} className="px-4 py-2 bg-[#1C1D25] border border-white/10 text-gray-300 rounded-full">Go back</button>
          </div>
        </div>
      </div>
    );
  }

  const { user, stats, badges, reflectionJourney, aiPersonalitySummary } = profile;
  const initial = user.fullName ? user.fullName.trim()[0].toUpperCase() : 'U';

  return (
    <div className="min-h-screen bg-[#1C1D25] text-white px-6 py-10">
      <div className="max-w-6xl mx-auto space-y-10">
        {error && (
          <div className="rounded-md bg-yellow-900/10 border border-yellow-500/10 px-4 py-2 text-sm text-yellow-300">
            Showing local profile — server error: {error}
          </div>
        )}

        {/* PROFILE HEADER */}
        <div className="relative bg-[#242631] rounded-2xl p-8 border border-white/5 shadow-md overflow-hidden">
          <div className="absolute left-0 top-0 h-full w-[6px] bg-[#4BA9FF] rounded-l-2xl" />

          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center pl-3">

            <div className="w-24 h-24 rounded-full bg-[#303241] flex items-center justify-center text-3xl font-bold ring-2 ring-[#4BA9FF]">
              {initial}
            </div>

            <div className="flex-1 space-y-2">
              <h1 className="text-3xl font-bold">{user.fullName}</h1>
              <p className="text-gray-400 text-sm">{user.department}</p>
              <p className="text-gray-300 italic">{reflectionJourney.aiTheme ? `"${reflectionJourney.aiTheme} - theme detected"` : 'No bio available.'}</p>

              <div className="flex flex-wrap gap-3 mt-3">
                {badges.map((b) => (
                  <span key={b} className="px-3 py-1 text-xs rounded-full bg-[#1C1D25] border border-white/10">{b}</span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <Stat label={`📄 Posts`} value={stats.postsCount} />
              <Stat label={`🎙 Podcasts`} value={stats.podcastsCount} />
              <Stat label={`💬 Comments`} value={stats.commentsCount} />
              <Stat label={`❤️ Reactions`} value={stats.reactionsCount} />
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="bg-[#242631] rounded-2xl border border-white/5 shadow-md p-4">
          <div className="flex gap-3 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-5 py-2 rounded-xl text-sm font-semibold transition ${activeTab === tab.key ? 'bg-[#4BA9FF] text-black' : 'bg-[#1C1D25] text-gray-300 hover:text-white'}`}>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="mt-6">
            {activeTab === 'posts' && <TabCard title="📝 Reflections & Posts" desc={`All written contributions. Total posts: ${stats.postsCount}`} />}
            {activeTab === 'podcasts' && <TabCard title="🎙 Podcast Contributions" desc={`Episodes contributed: ${stats.podcastsCount}`} />}
            {activeTab === 'ai' && <TabCard title="🧠 AI Feedback History" desc={aiPersonalitySummary || 'No AI summary available.'} />}
            {activeTab === 'drafts' && <TabCard title="📌 Drafts (Private)" desc="Unpublished reflections & saved drafts." />}
            {activeTab === 'saved' && <TabCard title="⭐ Saved Insights" desc="Bookmarked reflections, podcasts, and knowledge snippets." />}
          </div>
        </div>

        {/* REFLECTION JOURNEY */}
        <div className="relative bg-[#242631] rounded-2xl p-7 border border-white/5 shadow-md overflow-hidden">
          <div className="absolute left-0 top-0 h-full w-[6px] bg-[#B9A6FF] rounded-l-2xl" />

          <h2 className="text-lg font-semibold mb-4 pl-3">📈 Reflection Journey</h2>

          <div className="space-y-3 text-sm text-gray-300 pl-3">
            <p>🚀 Joined Org: {new Date(user.createdAt).toLocaleDateString()}</p>
            <p>✍️ First Reflection Written: {reflectionJourney.firstReflection ? new Date(reflectionJourney.firstReflection).toLocaleDateString() : '—'}</p>
            <p>🔥 Most Discussed Post: {reflectionJourney.topPostTitle || '—'}</p>
            <p>🎙 Top Podcast Episode: {reflectionJourney.topPodcastTitle || '—'}</p>
            {reflectionJourney.aiTheme && <p className="text-[#7FE6C5] font-medium">AI Theme Detected: {reflectionJourney.aiTheme}</p>}
          </div>
        </div>

        {/* SAFETY CONTROLS */}
        <div className="relative bg-[#242631] rounded-2xl p-6 border border-white/5 shadow-md overflow-hidden">
          <div className="absolute left-0 top-0 h-full w-[6px] bg-[#F5C76A] rounded-l-2xl" />

          <h2 className="text-lg font-semibold mb-5 pl-3 flex items-center gap-2">🔒 Psychological Safety Controls</h2>

          <div className="space-y-5 pl-3">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <p className="text-sm text-gray-300">Default Anonymity Level</p>
              <span className="px-3 py-1 rounded-full bg-[#1C1D25] border border-white/10 text-sm text-gray-200">Level {user.defaultAnonymityLevel}</span>
            </div>

            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <p className="text-sm text-gray-300">Who can see my reflections?</p>
              <span className="px-3 py-1 rounded-full bg-[#1C1D25] border border-white/10 text-sm text-gray-200">{user.visibility}</span>
            </div>

            <ToggleRow label="Allow AI feedback on my posts" defaultOn={user.allowAiFeedback} />
            <ToggleRow label="Allow comments on anonymous posts" defaultOn={user.allowAnonymousComments} />
          </div>
        </div>

        {/* AI INSIGHT */}
        <div className="relative bg-[#242631] rounded-2xl p-7 border border-white/5 shadow-md overflow-hidden">
          <div className="absolute left-0 top-0 h-full w-[6px] bg-[#7FE6C5] rounded-l-2xl" />

          <h2 className="text-lg font-semibold mb-4 pl-3">🤖 AI Personality Insight</h2>

          <p className="text-gray-300 text-sm leading-relaxed pl-3">{aiPersonalitySummary || 'No AI personality summary available.'}</p>
        </div>
      </div>
    </div>
  );
}

/* ✅ Premium Stat Card */
function Stat({ label, value }) {
  return (
    <div
      className="flex items-center gap-3 bg-[#1C1D25] 
      border border-white/10 rounded-xl px-4 py-3
      hover:border-white/20 hover:scale-[1.02]
      transition cursor-pointer"
    >
      {/* Icon Bubble */}
      <div className="w-10 h-10 flex items-center justify-center rounded-full 
      bg-[#242631] text-lg">
        {label.split(" ")[0]}
      </div>

      {/* Text */}
      <div>
        <p className="text-xs text-gray-400 font-medium">
          {label.slice(2)}
        </p>
        <h3 className="text-xl font-bold text-white leading-tight">
          {value}
        </h3>
      </div>
    </div>
  );
}


/* ✅ Tab Content Card */
function TabCard({ title, desc }) {
  return (
    <div className="bg-[#1C1D25] border border-white/10 rounded-xl p-6">
      <h3 className="text-white font-semibold mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{desc}</p>

      <p className="text-gray-500 italic mt-4 text-sm">
        Content will appear here soon...
      </p>
    </div>
  );
}

/* ✅ Toggle Row Component */
/* ✅ Toggle Row Component */
function ToggleRow({ label, defaultOn }) {
  const [enabled, setEnabled] = useState(defaultOn);

  return (
    <div className="flex justify-between items-center border-b border-white/5 pb-4">
      <p className="text-sm text-gray-300">{label}</p>

      {/* ✅ Toggle Switch */}
      <button
        onClick={() => setEnabled(!enabled)}
        className="relative w-14 h-8 rounded-full transition-all duration-300"
        style={{
          backgroundColor: enabled ? "#7FE6C5" : "#FFFFFF", // ✅ ON mint, OFF white
          boxShadow: enabled ? "0 0 10px #7FE6C5" : "none",
        }}
      >
        {/* ✅ Knob */}
        <span
          className="absolute top-1 left-1 w-6 h-6 rounded-full shadow-md transition-all duration-300"
          style={{
            backgroundColor: enabled ? "#FFFFFF" : "#242631", // knob dark when OFF
            transform: enabled ? "translateX(22px)" : "translateX(0px)",
          }}
        />
      </button>
    </div>
  );
}
