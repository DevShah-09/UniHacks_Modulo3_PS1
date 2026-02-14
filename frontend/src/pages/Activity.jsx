import Navbar from "../components/layout/Navbar";

export default function Activity() {
  const activities = [
    {
      icon: "💬",
      text: "Someone commented on your reflection",
      color: "#4BA9FF",
    },
    {
      icon: "🧠",
      text: "AI Feedback generated on your post",
      color: "#B9A6FF",
    },
    {
      icon: "🎙",
      text: "New podcast uploaded in your team lounge",
      color: "#7FE6C5",
    },
  ];

  return (
    <>

      <div className="min-h-screen bg-[#1C1D25] text-white px-6 py-10">
        <div className="max-w-5xl mx-auto space-y-8">

          {/* Page Header */}
          <div>
            <h1 className="text-4xl font-bold mb-2">
              Activity Log
            </h1>
            <p className="text-gray-400">
              Track updates from your reflections, AI feedback, and team podcasts.
            </p>
          </div>

          {/* Activity Feed */}
          <div className="space-y-5">
            {activities.map((item, index) => (
              <div
                key={index}
                className="relative bg-[#242631] rounded-2xl p-6 
                border border-white/10 shadow-md overflow-hidden 
                hover:scale-[1.01] transition"
              >
                {/* Accent Strip */}
                <div
                  className="absolute left-0 top-0 h-full w-[6px]"
                  style={{ backgroundColor: item.color }}
                />

                {/* Content */}
                <div className="flex items-center gap-4 pl-3">
                  {/* Icon Bubble */}
                  <div
                    className="w-12 h-12 flex items-center justify-center 
                    rounded-full text-xl"
                    style={{
                      backgroundColor: item.color,
                      color: "black",
                    }}
                  >
                    {item.icon}
                  </div>

                  {/* Text */}
                  <p className="text-gray-200 font-medium text-sm md:text-base">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Empty Future Note */}
          <p className="text-gray-500 italic text-sm pt-4">
            More activity events will appear here as your team engages.
          </p>
        </div>
      </div>
    </>
  );
}
