export default function Navbar() {
  return (
    <nav className="w-full fixed top-0 left-0 bg-[#F8F6F2] border-b border-[#E5E2DC] z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        
        {/* Left Side */}
        <div className="flex items-center gap-8">
          <h1 className="text-xl font-bold text-[#111]">
            TalentBridge
          </h1>

          <div className="flex gap-6 text-sm font-medium text-[#444]">
            <button className="hover:text-black">Home Feed</button>
            <button className="hover:text-black">Podcasts</button>
            <button className="hover:text-black">Knowledge Hub</button>
            <button className="hover:text-black">Activity</button>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <button className="px-4 py-2 rounded-full bg-black text-white text-sm">
            ✍️ Write
          </button>

          <input
            placeholder="Search..."
            className="px-4 py-2 rounded-full border border-[#E5E2DC] bg-white text-sm focus:outline-none"
          />

          <div className="w-9 h-9 rounded-full bg-[#D9D6FF] flex items-center justify-center font-bold">
            Q
          </div>
        </div>
      </div>
    </nav>
  );
}
