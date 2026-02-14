import { useState } from "react";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("posts");

  const tabs = [
    { key: "posts", label: "📝 Posts" },
    { key: "podcasts", label: "🎙 Podcasts" },
    { key: "ai", label: "🧠 AI Feedback" },
    { key: "drafts", label: "📌 Drafts" },
    { key: "saved", label: "⭐ Saved" },
  ];

  return (
    <div className="min-h-screen bg-[#1C1D25] text-white px-6 py-10">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* ✅ PROFILE HEADER CARD */}
        <div className="relative bg-[#242631] rounded-2xl p-8 border border-white/5 shadow-md overflow-hidden">
          <div className="absolute left-0 top-0 h-full w-[6px] bg-[#4BA9FF] rounded-l-2xl" />

          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center pl-3">

            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-[#303241] flex items-center justify-center text-3xl font-bold ring-2 ring-[#4BA9FF]">
              Q
            </div>

            {/* Identity Info */}
            <div className="flex-1 space-y-2">
              <h1 className="text-3xl font-bold">Q (wowidee)</h1>

              <p className="text-gray-400 text-sm">
                Product Intern | Growth Team
              </p>

              <p className="text-gray-300 italic">
                “Exploring systems + writing internal learnings”
              </p>

              {/* Badges */}
              <div className="flex flex-wrap gap-3 mt-3">
                <span className="px-3 py-1 text-xs rounded-full bg-[#1C1D25] border border-white/10">
                  ✍️ Active Writer
                </span>
                <span className="px-3 py-1 text-xs rounded-full bg-[#1C1D25] border border-white/10">
                  🎙 Podcast Contributor
                </span>
                <span className="px-3 py-1 text-xs rounded-full bg-[#1C1D25] border border-white/10">
                  💡 Innovator
                </span>
              </div>
            </div>

            {/* ✅ Premium Stats Snapshot */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <Stat label="📄 Posts" value="12" />
              <Stat label="🎙 Podcasts" value="3" />
              <Stat label="💬 Comments" value="28" />
              <Stat label="❤️ Reactions" value="91" />
            </div>
          </div>
        </div>

        {/* ✅ TABS SECTION */}
        <div className="bg-[#242631] rounded-2xl border border-white/5 shadow-md p-4">
          <div className="flex gap-3 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-5 py-2 rounded-xl text-sm font-semibold transition
                ${
                  activeTab === tab.key
                    ? "bg-[#4BA9FF] text-black"
                    : "bg-[#1C1D25] text-gray-300 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB CONTENT */}
          <div className="mt-6">
            {activeTab === "posts" && (
              <TabCard
                title="📝 Reflections & Posts"
                desc="All written contributions: reflections, decision logs, experiment outcomes."
              />
            )}

            {activeTab === "podcasts" && (
              <TabCard
                title="🎙 Podcast Contributions"
                desc="Episodes where you contributed as host, speaker or collaborator."
              />
            )}

            {activeTab === "ai" && (
              <TabCard
                title="🧠 AI Feedback History"
                desc="Revisit persona feedback, suggestions, and growth insights."
              />
            )}

            {activeTab === "drafts" && (
              <TabCard
                title="📌 Drafts (Private)"
                desc="Unpublished reflections & saved drafts. Visible only to you."
              />
            )}

            {activeTab === "saved" && (
              <TabCard
                title="⭐ Saved Insights"
                desc="Bookmarked reflections, podcasts, and knowledge snippets."
              />
            )}
          </div>
        </div>

        {/* ✅ REFLECTION JOURNEY */}
        <div className="relative bg-[#242631] rounded-2xl p-7 border border-white/5 shadow-md overflow-hidden">
          <div className="absolute left-0 top-0 h-full w-[6px] bg-[#B9A6FF] rounded-l-2xl" />

          <h2 className="text-lg font-semibold mb-4 pl-3">
            📈 Reflection Journey
          </h2>

          <div className="space-y-3 text-sm text-gray-300 pl-3">
            <p>🚀 Joined Org: Jan 2026</p>
            <p>✍️ First Reflection Written: Feb 2026</p>
            <p>🔥 Most Discussed Post: “Team Execution Gaps”</p>
            <p>🎙 Top Podcast Episode: “Launch delays + morale”</p>
            <p className="text-[#7FE6C5] font-medium">
              AI Theme Detected: Improved execution clarity over 3 months
            </p>
          </div>
        </div>

        {/* ✅ Psychological Safety Controls (TOGGLES ADDED) */}
        <div className="relative bg-[#242631] rounded-2xl p-6 border border-white/5 shadow-md overflow-hidden">
          <div className="absolute left-0 top-0 h-full w-[6px] bg-[#F5C76A] rounded-l-2xl" />

          <h2 className="text-lg font-semibold mb-5 pl-3 flex items-center gap-2">
            🔒 Psychological Safety Controls
          </h2>

          <div className="space-y-5 pl-3">

            {/* Default Anonymity */}
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <p className="text-sm text-gray-300">Default Anonymity Level</p>
              <span className="px-3 py-1 rounded-full bg-[#1C1D25] border border-white/10 text-sm text-gray-200">
                Level 2 (Dept Only)
              </span>
            </div>

            {/* Visibility */}
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <p className="text-sm text-gray-300">Who can see my reflections?</p>
              <span className="px-3 py-1 rounded-full bg-[#1C1D25] border border-white/10 text-sm text-gray-200">
                Organization
              </span>
            </div>

            {/* Toggle Switches */}
            <ToggleRow
              label="Allow AI feedback on my posts"
              defaultOn={true}
            />

            <ToggleRow
              label="Allow comments on anonymous posts"
              defaultOn={false}
            />
          </div>
        </div>

        {/* ✅ AI PERSONALITY SUMMARY */}
        <div className="relative bg-[#242631] rounded-2xl p-7 border border-white/5 shadow-md overflow-hidden">
          <div className="absolute left-0 top-0 h-full w-[6px] bg-[#7FE6C5] rounded-l-2xl" />

          <h2 className="text-lg font-semibold mb-4 pl-3">
            🤖 AI Personality Insight
          </h2>

          <p className="text-gray-300 text-sm leading-relaxed pl-3">
            “You communicate with strong ideation and reflection depth.
            Your posts show a risk-aware mindset, focused on experimentation
            and improving team execution clarity.”
          </p>
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
