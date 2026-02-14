import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getMyConversations, getMyOrganization } from '../api/axios';

export default function Messages() {
  const [conversations, setConversations] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const currentUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('userInfo') || 'null') : null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [convData, orgData] = await Promise.all([
          getMyConversations(),
          getMyOrganization()
        ]);
        setConversations(convData || []);

        // Filter out current user from members list
        if (orgData && orgData.members) {
          setMembers(orgData.members.filter(m => m._id !== currentUser?._id));
        }
      } catch (err) {
        console.error('Failed to load messages data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#1C1D25] text-white px-6 py-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT COLUMN: CONVERSATIONS */}
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold mb-8">Messages</h1>

          {loading ? (
            <div className="text-gray-400 animate-pulse">Loading conversations...</div>
          ) : conversations.length === 0 ? (
            <div className="text-gray-400 bg-[#242631] p-6 rounded-xl border border-white/5">
              No conversations yet. Start a chat with your colleagues from the list on the right.
            </div>
          ) : (
            <div className="space-y-4">
              {conversations.map((conv) => {
                const other = conv.participants.find((p) => p._id !== currentUser?._id);
                if (!other) return null;

                return (
                  <Link
                    key={conv._id}
                    to={`/dm/${other._id}`}
                    className="block bg-[#242631] p-4 rounded-xl border border-white/5 hover:border-white/20 transition"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-[#303241] flex items-center justify-center font-bold text-lg text-white">
                        {other.fullName?.[0] || '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1">
                          <h3 className="font-semibold text-lg truncate">{other.fullName}</h3>
                          {conv.lastMessageAt && (
                            <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                              {new Date(conv.lastMessageAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-400 text-sm truncate">
                          {conv.lastMessage?.content || 'No messages yet'}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: ORG MEMBERS */}
        <div className="lg:col-span-1">
          <div className="bg-[#242631] rounded-2xl p-6 border border-white/5 h-fit sticky top-24">
            <h2 className="text-xl font-bold mb-4 text-[#7FE6C5]">Your Team</h2>

            {loading ? (
              <div className="text-sm text-gray-500">Loading members...</div>
            ) : members.length === 0 ? (
              <div className="text-gray-500 text-sm">No other members found in your organization.</div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {members.map(member => (
                  <div
                    key={member._id}
                    onClick={() => navigate(`/dm/${member._id}`)}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#303241] cursor-pointer transition group"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#1C1D25] border border-white/10 flex items-center justify-center font-bold text-gray-300 group-hover:border-[#7FE6C5] group-hover:text-[#7FE6C5] transition">
                      {member.fullName?.[0] || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm truncate group-hover:text-white transition">{member.fullName}</h4>
                      <p className="text-xs text-gray-500 truncate">{member.department || 'Member'}</p>
                    </div>
                    <button className="text-xs bg-[#7FE6C5]/10 text-[#7FE6C5] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                      Chat
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
