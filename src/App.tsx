import React, { useState, useEffect } from 'react';
import { Shield, Users, Package, ArrowLeftRight, BarChart3, LogOut, Menu, X } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Purchases from './components/Purchases';
import Transfers from './components/Transfers';
import Assignments from './components/Assignments';
import Login from './components/Login';

export type UserRole = 'admin' | 'base-commander' | 'logistics-officer';
export type Base = 'Alpha Base' | 'Bravo Base' | 'Charlie Base' | 'Delta Base';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  assignedBase?: Base;
}

export interface Asset {
  id: string;
  name: string;
  type: 'Vehicle' | 'Weapon' | 'Ammunition' | 'Equipment';
  base: Base;
  quantity: number;
  unitCost: number;
  dateAcquired: string;
  status: 'Available' | 'Assigned' | 'Maintenance' | 'Expended';
}

export interface Transfer {
  id: string;
  assetId: string;
  assetName: string;
  assetType: string;
  fromBase: Base;
  toBase: Base;
  quantity: number;
  date: string;
  status: 'Pending' | 'In Transit' | 'Completed';
  requestedBy: string;
  approvedBy?: string;
}

export interface Assignment {
  id: string;
  assetId: string;
  assetName: string;
  assetType: string;
  personnelName: string;
  personnelId: string;
  base: Base;
  quantity: number;
  assignedDate: string;
  returnDate?: string;
  status: 'Active' | 'Returned' | 'Expended';
}

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('dashboard');
  };

  const canAccessTab = (tabId: string): boolean => {
    if (!currentUser) return false;
    
    switch (currentUser.role) {
      case 'admin':
        return true;
      case 'base-commander':
        return ['dashboard', 'purchases', 'transfers', 'assignments'].includes(tabId);
      case 'logistics-officer':
        return ['dashboard', 'purchases', 'transfers'].includes(tabId);
      default:
        return false;
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'purchases', label: 'Purchases', icon: Package },
    { id: 'transfers', label: 'Transfers', icon: ArrowLeftRight },
    { id: 'assignments', label: 'Assignments', icon: Users },
  ].filter(tab => canAccessTab(tab.id));

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard currentUser={currentUser} />;
      case 'purchases':
        return <Purchases currentUser={currentUser} />;
      case 'transfers':
        return <Transfers currentUser={currentUser} />;
      case 'assignments':
        return <Assignments currentUser={currentUser} />;
      default:
        return <Dashboard currentUser={currentUser} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-green-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-green-300" />
              <h1 className="ml-2 text-xl font-bold">Military Asset Management</h1>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-green-700 text-white'
                        : 'text-green-200 hover:bg-green-700 hover:text-white'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-1" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* User Info and Logout */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-sm">
                <div className="font-medium">{currentUser.name}</div>
                <div className="text-green-200 capitalize">
                  {currentUser.role.replace('-', ' ')}
                  {currentUser.assignedBase && ` - ${currentUser.assignedBase}`}
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-green-200 hover:bg-green-700 hover:text-white transition-colors"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-green-200 hover:text-white"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-green-700">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center w-full px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-green-600 text-white'
                        : 'text-green-200 hover:bg-green-600 hover:text-white'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
              <div className="border-t border-green-600 pt-2">
                <div className="px-3 py-2 text-sm">
                  <div className="font-medium text-white">{currentUser.name}</div>
                  <div className="text-green-200 capitalize">
                    {currentUser.role.replace('-', ' ')}
                    {currentUser.assignedBase && ` - ${currentUser.assignedBase}`}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-3 py-2 rounded-md text-sm font-medium text-green-200 hover:bg-green-600 hover:text-white transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {renderActiveComponent()}
      </main>
    </div>
  );
}

export default App;