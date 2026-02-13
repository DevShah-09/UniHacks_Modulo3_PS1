export default function UploadPodcast() {
  return (
    <div className="max-w-3xl mx-auto mt-10 p-6">
      <h1 className="text-3xl font-bold mb-6">🎧 Upload Podcast</h1>

      <input type="text" placeholder="Episode Title"
        className="w-full p-3 border rounded-xl mb-4"
      />

      <input type="file"
        className="w-full p-3 border rounded-xl mb-4"
      />

      <textarea
        placeholder="Tags / Notes..."
        className="w-full h-32 p-3 border rounded-xl"
      />

      <button className="mt-5 bg-black text-white px-6 py-3 rounded-xl">
        Upload + Generate AI Echo →
      </button>
    </div>
  );
}
