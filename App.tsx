import React, { useState } from 'react';
import { useUsers } from './hooks/useUsers';
import { User } from './types';
import { Search, Plus, FileText, Users as UsersIcon } from 'lucide-react';

const App = () => {
  const { users, loading, error, addUser, deleteUser, addFormToUser } = useUsers();
  const [activeTab, setActiveTab] = useState<'users' | 'forms'>('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="flex justify-center p-10 font-bold">Loading Careflick Dashboard...</div>;
  if (error) return <div className="text-red-500 p-10">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm p-4 flex gap-6 justify-center border-b">
        <button 
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${activeTab === 'users' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}
        >
          <UsersIcon size={20} /> Users
        </button>
        <button 
          onClick={() => setActiveTab('forms')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${activeTab === 'forms' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}
        >
          <FileText size={20} /> Care Forms
        </button>
      </nav>

      <main className="max-w-6xl mx-auto p-6">
        {activeTab === 'users' ? (
          <div>
            <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Search by name or email..." 
                  className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition">
                <Plus size={20} /> Add User
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map(user => (
                <div 
                  key={user.id} 
                  onClick={() => setSelectedUser(user)}
                  className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md cursor-pointer transition"
                >
                  <h3 className="font-bold text-lg text-gray-800">{user.name}</h3>
                  <p className="text-gray-600 text-sm">{user.email}</p>
                  <p className="text-gray-500 text-sm mt-2">{user.phone}</p>
                  <div className="mt-4 text-xs font-semibold text-blue-500 uppercase">
                    {user.submittedForms.length} Forms Submitted
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Simplified Care Form Tab */
          <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow">
            <h2 className="text-2xl font-bold mb-6">Submit Care Form</h2>
            <form onSubmit={(e) => { e.preventDefault(); alert('Form Submitted Locally!'); }}>
              <label className="block mb-2 text-sm font-medium">Select User</label>
              <select className="w-full p-2 border rounded mb-4">
                {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
              
              <label className="block mb-2 text-sm font-medium">Form Type</label>
              <select className="w-full p-2 border rounded mb-4">
                <option>Health Check Form</option>
                <option>Medication Form</option>
              </select>

              <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold">Submit</button>
            </form>
          </div>
        )}
      </main>

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-8 relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setSelectedUser(null)} className="absolute top-4 right-4 text-gray-400 hover:text-black">✕</button>
            <h2 className="text-2xl font-bold mb-2">{selectedUser.name}</h2>
            <p className="text-gray-600 mb-6">{selectedUser.email}</p>
            
            <div className="space-y-4 border-b pb-6 mb-6">
              <p><strong>Phone:</strong> {selectedUser.phone}</p>
              <p><strong>Company:</strong> {selectedUser.company?.name}</p>
              <p><strong>City:</strong> {selectedUser.address?.city}</p>
            </div>

            <h3 className="font-bold text-lg mb-4">Submitted Care Forms</h3>
            {selectedUser.submittedForms.length > 0 ? (
              <ul className="space-y-2">
                {selectedUser.submittedForms.map(f => (
                  <li key={f.id} className="p-3 bg-blue-50 rounded text-blue-800 flex justify-between">
                    <span>{f.type}</span>
                    <span className="text-xs opacity-70">{f.date}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400 italic">No forms submitted yet.</p>
            )}
            
            <button 
              onClick={() => { deleteUser(selectedUser.id); setSelectedUser(null); }}
              className="mt-8 w-full text-red-600 font-semibold border border-red-200 py-2 rounded-lg hover:bg-red-50"
            >
              Delete User
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
