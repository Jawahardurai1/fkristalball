import React, { useState } from 'react';
import { Shield, User, Key } from 'lucide-react';
import type { User as AppUser, UserRole } from '../App';

interface LoginProps {
  onLogin: (user: AppUser) => void;
}

const mockUsers: AppUser[] = [
  { id: '1', name: 'General Smith', role: 'admin' },
  { id: '2', name: 'Colonel Johnson', role: 'base-commander', assignedBase: 'Alpha Base' },
  { id: '3', name: 'Major Williams', role: 'base-commander', assignedBase: 'Bravo Base' },
  { id: '4', name: 'Captain Davis', role: 'logistics-officer', assignedBase: 'Charlie Base' },
  { id: '5', name: 'Lieutenant Brown', role: 'logistics-officer', assignedBase: 'Delta Base' },
];

export default function Login({ onLogin }: LoginProps) {
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = mockUsers.find(u => u.id === selectedUser);
    if (user && password === 'demo') {
      onLogin(user);
    } else {
      alert('Invalid credentials. Use password: "demo"');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="mx-auto h-16 w-16 bg-green-600 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">MILASSET</h2>
            <p className="text-gray-600 mt-2">Military Asset Management System</p>
            <div className="mt-4 p-3 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-800">
                <strong>Demo Credentials:</strong><br />
                Password: <code className="bg-blue-200 px-1 rounded">demo</code>
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="h-4 w-4 inline mr-1" />
                Select User Role
              </label>
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              >
                <option value="">Choose a role...</option>
                {mockUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} - {user.role.replace('-', ' ')} 
                    {user.assignedBase && ` (${user.assignedBase})`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Key className="h-4 w-4 inline mr-1" />
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
            >
              Access System
            </button>
          </form>

          <div className="mt-6 text-xs text-gray-500 text-center">
            <p>Authorized Personnel Only</p>
            <p>Security Classification: OFFICIAL</p>
          </div>
        </div>
      </div>
    </div>
  );
}