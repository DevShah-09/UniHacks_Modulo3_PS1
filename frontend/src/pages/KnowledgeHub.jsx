export default function KnowledgeHub() {
  return (
    <div className="max-w-6xl mx-auto mt-10 grid grid-cols-4 gap-6 p-6">

      {/* Sidebar */}
      <div className="bg-white shadow rounded-2xl p-5">
        <h2 className="font-bold mb-4">Filters</h2>
        <p className="text-gray-500">Tags</p>
        <p className="text-gray-500">Teams</p>
        <p className="text-gray-500">Content Type</p>
      </div>

      {/* Search Results */}
      <div className="col-span-3">
        <h1 className="text-3xl font-bold mb-4">📚 Knowledge Hub</h1>

        <input
          placeholder="Search insights..."
          className="w-full p-3 border rounded-xl mb-5"
        />

        <div className="p-5 bg-white shadow rounded-2xl">
          <h2 className="font-bold text-xl">
            Reflection: Launch Delay Insights
          </h2>
          <p className="text-gray-500">
            Found in past sprint notes + podcast decisions...
          </p>
        </div>
      </div>
    </div>
  );
}
