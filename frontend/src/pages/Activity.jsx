export default function Activity() {
  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <h1 className="text-3xl font-bold mb-6">🔔 Activity Log</h1>

      <div className="space-y-4">
        <div className="p-4 bg-white shadow rounded-xl">
          Someone commented on your post 💬
        </div>

        <div className="p-4 bg-white shadow rounded-xl">
          AI Feedback generated on your reflection 🧠
        </div>

        <div className="p-4 bg-white shadow rounded-xl">
          New podcast uploaded in your team 🎙
        </div>
      </div>
    </div>
  );
}
