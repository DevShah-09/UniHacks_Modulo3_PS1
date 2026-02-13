export default function Profile() {
  return (
    <div className="max-w-5xl mx-auto mt-10 p-6">
      <h1 className="text-3xl font-bold mb-6">👤 Profile</h1>

      <div className="bg-white shadow rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-bold">User Reflections</h2>
        <p className="text-gray-500">List of posts created by user...</p>
      </div>

      <div className="bg-white shadow rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-bold">Podcasts Contributed</h2>
        <p className="text-gray-500">Episodes uploaded...</p>
      </div>

      <div className="bg-white shadow rounded-2xl p-6">
        <h2 className="text-xl font-bold">Drafts Saved</h2>
        <p className="text-gray-500">Coming soon...</p>
      </div>
    </div>
  );
}
