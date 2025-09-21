import React, { useState } from 'react';
import { BarChart, Package, ArrowUp, ArrowDown, TrendingUp, Filter, X } from 'lucide-react';
import type { User, Base } from '../App';

interface DashboardProps {
  currentUser: User;
}

interface MetricCard {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: React.ComponentType<any>;
}

interface NetMovementDetail {
  type: 'Purchases' | 'Transfer In' | 'Transfer Out';
  value: number;
  items: Array<{
    name: string;
    quantity: number;
    date: string;
    base?: string;
  }>;
}

export default function Dashboard({ currentUser }: DashboardProps) {
  const [selectedBase, setSelectedBase] = useState<Base | 'all'>('all');
  const [selectedEquipmentType, setSelectedEquipmentType] = useState<string>('all');
  const [dateRange, setDateRange] = useState({ from: '2024-01-01', to: '2024-12-31' });
  const [showNetMovementModal, setShowNetMovementModal] = useState(false);

  const bases: Base[] = ['Alpha Base', 'Bravo Base', 'Charlie Base', 'Delta Base'];
  const equipmentTypes = ['Vehicle', 'Weapon', 'Ammunition', 'Equipment'];

  // Filter bases based on user role
  const availableBases = currentUser.role === 'admin' 
    ? bases 
    : currentUser.assignedBase 
    ? [currentUser.assignedBase] 
    : bases;

  const metrics: MetricCard[] = [
    {
      title: 'Opening Balance',
      value: '$2,450,000',
      change: '+5.2%',
      changeType: 'increase',
      icon: Package
    },
    {
      title: 'Closing Balance',
      value: '$2,680,000',
      change: '+9.4%',
      changeType: 'increase',
      icon: TrendingUp
    },
    {
      title: 'Net Movement',
      value: '+$230,000',
      change: '+15.3%',
      changeType: 'increase',
      icon: BarChart
    },
    {
      title: 'Assets Assigned',
      value: '1,247',
      change: '+23',
      changeType: 'increase',
      icon: ArrowUp
    },
    {
      title: 'Assets Expended',
      value: '892',
      change: '+45',
      changeType: 'increase',
      icon: ArrowDown
    }
  ];

  const netMovementDetails: NetMovementDetail[] = [
    {
      type: 'Purchases',
      value: 450000,
      items: [
        { name: 'M4A1 Carbines', quantity: 50, date: '2024-01-15', base: 'Alpha Base' },
        { name: 'Humvee Vehicles', quantity: 8, date: '2024-01-20', base: 'Bravo Base' },
        { name: '5.56mm Ammunition', quantity: 10000, date: '2024-01-25', base: 'Charlie Base' }
      ]
    },
    {
      type: 'Transfer In',
      value: 180000,
      items: [
        { name: 'Radio Equipment', quantity: 25, date: '2024-02-01', base: 'From Delta Base' },
        { name: 'Body Armor', quantity: 100, date: '2024-02-05', base: 'From Alpha Base' }
      ]
    },
    {
      type: 'Transfer Out',
      value: -400000,
      items: [
        { name: 'Bradley IFVs', quantity: 2, date: '2024-02-10', base: 'To Charlie Base' },
        { name: 'Night Vision Goggles', quantity: 75, date: '2024-02-15', base: 'To Bravo Base' }
      ]
    }
  ];

  const recentActivity = [
    { id: 1, type: 'Purchase', description: 'Received 50 M4A1 Carbines', base: 'Alpha Base', date: '2024-01-15', status: 'Completed' },
    { id: 2, type: 'Transfer', description: 'Transferred 2 Bradley IFVs to Charlie Base', base: 'Alpha Base', date: '2024-01-14', status: 'In Transit' },
    { id: 3, type: 'Assignment', description: 'Assigned 25 radios to Patrol Unit Alpha', base: 'Bravo Base', date: '2024-01-13', status: 'Active' },
    { id: 4, type: 'Expenditure', description: '500 rounds of 5.56mm ammunition expended', base: 'Charlie Base', date: '2024-01-12', status: 'Recorded' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Command Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Real-time asset management overview for {currentUser.assignedBase || 'all bases'}
          </p>
        </div>
        
        {/* Filters */}
        <div className="mt-4 lg:mt-0 flex flex-wrap gap-3">
          {currentUser.role === 'admin' && (
            <select
              value={selectedBase}
              onChange={(e) => setSelectedBase(e.target.value as Base | 'all')}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Bases</option>
              {availableBases.map(base => (
                <option key={base} value={base}>{base}</option>
              ))}
            </select>
          )}
          
          <select
            value={selectedEquipmentType}
            onChange={(e) => setSelectedEquipmentType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="all">All Equipment</option>
            {equipmentTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          
          <input
            type="date"
            value={dateRange.from}
            onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          
          <input
            type="date"
            value={dateRange.to}
            onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          const isNetMovement = metric.title === 'Net Movement';
          
          return (
            <div
              key={metric.title}
              className={`bg-white p-6 rounded-lg shadow-sm border border-gray-200 ${
                isNetMovement ? 'cursor-pointer hover:shadow-md transition-shadow' : ''
              }`}
              onClick={isNetMovement ? () => setShowNetMovementModal(true) : undefined}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{metric.value}</p>
                  <div className="flex items-center mt-2">
                    <span className={`text-sm font-medium ${
                      metric.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {metric.change}
                    </span>
                    <span className="text-xs text-gray-500 ml-1">vs last month</span>
                  </div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <Icon className="h-6 w-6 text-green-600" />
                </div>
              </div>
              {isNetMovement && (
                <p className="text-xs text-blue-600 mt-2">Click for breakdown</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Charts and Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Asset Distribution Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Asset Distribution by Type</h3>
          <div className="space-y-4">
            {[
              { type: 'Vehicles', count: 245, percentage: 35, color: 'bg-blue-500' },
              { type: 'Weapons', count: 892, percentage: 45, color: 'bg-green-500' },
              { type: 'Ammunition', count: 15420, percentage: 60, color: 'bg-yellow-500' },
              { type: 'Equipment', count: 678, percentage: 28, color: 'bg-purple-500' }
            ].map((item) => (
              <div key={item.type} className="flex items-center">
                <div className="w-20 text-sm font-medium text-gray-700">{item.type}</div>
                <div className="flex-1 mx-4">
                  <div className="bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${item.color}`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="w-16 text-sm font-semibold text-gray-900 text-right">{item.count}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Base Status Overview */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Base Status Overview</h3>
          <div className="space-y-4">
            {availableBases.map((base) => (
              <div key={base} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{base}</h4>
                  <p className="text-sm text-gray-600">Active Assets: 1,247</p>
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Operational
                  </div>
                  <p className="text-sm text-gray-600 mt-1">98.5% Ready</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Base
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentActivity.map((activity) => (
                <tr key={activity.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      activity.type === 'Purchase' ? 'bg-blue-100 text-blue-800' :
                      activity.type === 'Transfer' ? 'bg-purple-100 text-purple-800' :
                      activity.type === 'Assignment' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {activity.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{activity.description}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{activity.base}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{activity.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      activity.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      activity.status === 'Active' ? 'bg-blue-100 text-blue-800' :
                      activity.status === 'In Transit' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {activity.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Net Movement Modal */}
      {showNetMovementModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Net Movement Breakdown</h2>
              <button
                onClick={() => setShowNetMovementModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {netMovementDetails.map((detail) => (
                  <div key={detail.type} className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">{detail.type}</h3>
                    <p className={`text-2xl font-bold mb-3 ${
                      detail.value >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      ${detail.value.toLocaleString()}
                    </p>
                    <div className="space-y-2">
                      {detail.items.map((item, index) => (
                        <div key={index} className="text-sm">
                          <div className="font-medium text-gray-900">{item.name}</div>
                          <div className="text-gray-600">
                            Qty: {item.quantity} | {item.date} 
                            {item.base && ` | ${item.base}`}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">Total Net Movement:</span>
                  <span className="text-xl font-bold text-green-600">
                    +${netMovementDetails.reduce((sum, detail) => sum + detail.value, 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}