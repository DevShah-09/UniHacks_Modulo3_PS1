import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api, { getMyOrganization, addOrgMember } from '../api/axios';

export default function Profile() {
  const { id } = useParams();
  const [org, setOrg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState('');

  const currentUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('userInfo') || 'null') : null;

  const isOwnProfile = currentUser?._id === id || !id; // if no id param, assume own profile

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const orgData = await getMyOrganization();
        setOrg(orgData);
      } catch (err) {
        setError('Failed to load organization');
      } finally {
        setLoading(false);
      }
    };

    if (isOwnProfile) load();
  }, [id]);

  const handleInvite = async (e) => {
    e.preventDefault();
    setInviteSuccess('');
    setError('');

    if (!inviteEmail || !org) return setError('Email and organization required');

    setInviteLoading(true);
    try {
      const updatedOrg = await addOrgMember(org._id, inviteEmail);
      setOrg(updatedOrg);
      setInviteEmail('');
      setInviteSuccess('Invitation accepted — member added');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add member');
    } finally {
      setInviteLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6">
      <h1 className="text-3xl font-bold mb-6">👤 Profile</h1>

      <div className="bg-white shadow rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-bold">User Reflections</h2>
        <p className="text-gray-500">List of posts created by user...</p>
      </div>

      <div className="bg-white shadow rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-bold">Organization</h2>

        {loading && <p className="text-gray-500">Loading organization...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !org && (
          <p className="text-gray-500">You are not part of an organization. Create one from the Login screen when you first sign in.</p>
        )}

        {!loading && org && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold">{org.name}</h3>
            <p className="text-sm text-gray-500 mb-4">{org.description}</p>

            <div className="mb-4">
              <h4 className="font-medium">Members</h4>
              <ul className="mt-2 space-y-2">
                {org.members.map((m) => (
                  <li key={m._id} className="text-sm text-gray-700">
                    <strong>{m.fullName}</strong> — <span className="text-gray-500">{m.email}</span> • {m.department}
                  </li>
                ))}
              </ul>
            </div>

            {/* Invite form - only visible to org creator */}
            {org.createdBy && currentUser && org.createdBy._id === currentUser._id && (
              <form onSubmit={handleInvite} className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Invite member by email</label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="teammember@example.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                  <button className="px-4 py-2 bg-black text-white rounded-lg" disabled={inviteLoading}>
                    {inviteLoading ? 'Inviting...' : 'Invite'}
                  </button>
                </div>
                {inviteSuccess && <p className="text-green-600 mt-2">{inviteSuccess}</p>}
              </form>
            )}
          </div>
        )}
      </div>

      <div className="bg-white shadow rounded-2xl p-6">
        <h2 className="text-xl font-bold">Drafts Saved</h2>
        <p className="text-gray-500">Coming soon...</p>
      </div>
    </div>
  );
}
