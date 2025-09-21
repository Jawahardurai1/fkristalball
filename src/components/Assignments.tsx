import React, { useState } from 'react';
import { Users, Plus, Search, User, Package, Calendar, X, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import type { User as UserType, Base, Assignment } from '../App';

interface AssignmentsProps {
  currentUser: UserType;
}

const mockAssignments: Assignment[] = [
  {
    id: 'ASG001',
    assetId: 'A001',
    assetName: 'M4A1 Carbine',
    assetType: 'Weapon',
    personnelName: 'Sergeant Johnson',
    personnelId: 'P001',
    base: 'Alpha Base',
    quantity: 1,
    assignedDate: '2024-01-15',
    status: 'Active'
  },
  {
    id: 'ASG002',
    assetId: 'A002',
    assetName: 'Night Vision Goggles',
    assetType: 'Equipment',
    personnelName: 'Corporal Smith',
    personnelId: 'P002',
    base: 'Bravo Base',
    quantity: 2,
    assignedDate: '2024-01-20',
    returnDate: '2024-02-10',
    status: 'Returned'
  },
  {
    id: 'ASG003',
    assetId: 'A003',
    assetName: '5.56mm NATO Ammunition',
    assetType: 'Ammunition',
    personnelName: 'Private Williams',
    personnelId: 'P003',
    base: 'Charlie Base',
    quantity: 210,
    assignedDate: '2024-02-01',
    status: 'Expended'
  },
  {
    id: 'ASG004',
    assetId: 'A004',
    assetName: 'Humvee M1151',
    assetType: 'Vehicle',
    personnelName: 'Lieutenant Davis',
    personnelId: 'P004',
    base: 'Delta Base',
    quantity: 1,
    assignedDate: '2024-02-05',
    status: 'Active'
  },
  {
    id: 'ASG005',
    assetId: 'A005',
    assetName: 'Body Armor Vest',
    assetType: 'Equipment',
    personnelName: 'Sergeant Brown',
    personnelId: 'P005',
    base: 'Alpha Base',
    quantity: 1,
    assignedDate: '2024-02-08',
    status: 'Active'
  },
  {
    id: 'ASG006',
    assetId: 'A006',
    assetName: '7.62mm NATO Ammunition',
    assetType: 'Ammunition',
    personnelName: 'Specialist Garcia',
    personnelId: 'P006',
    base: 'Bravo Base',
    quantity: 150,
    assignedDate: '2024-02-12',
    status: 'Expended'
  }
];

export default function Assignments({ currentUser }: AssignmentsProps) {
  const [assignments, setAssignments] = useState<Assignment[]>(mockAssignments);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState<Assignment | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [baseFilter, setBaseFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });

  const [newAssignment, setNewAssignment] = useState<Partial<Assignment>>({
    assetName: '',
    assetType: 'Equipment',
    personnelName: '',
    personnelId: '',
    base: currentUser.assignedBase || 'Alpha Base',
    quantity: 1,
    assignedDate: new Date().toISOString().split('T')[0],
    status: 'Active'
  });

  const bases: Base[] = ['Alpha Base', 'Bravo Base', 'Charlie Base', 'Delta Base'];
  const availableBases = currentUser.role === 'admin' 
    ? bases 
    : currentUser.assignedBase 
    ? [currentUser.assignedBase] 
    : bases;

  // Filter assignments based on user role and filters
  const filteredAssignments = assignments.filter(assignment => {
    // Role-based filtering
    if (currentUser.role !== 'admin' && currentUser.assignedBase && assignment.base !== currentUser.assignedBase) {
      return false;
    }

    // Search filter
    if (searchTerm && !assignment.assetName.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !assignment.personnelName.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !assignment.id.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // Status filter
    if (statusFilter !== 'all' && assignment.status !== statusFilter) {
      return false;
    }

    // Type filter
    if (typeFilter !== 'all' && assignment.assetType !== typeFilter) {
      return false;
    }

    // Base filter
    if (baseFilter !== 'all' && assignment.base !== baseFilter) {
      return false;
    }

    // Date range filter
    if (dateRange.from && assignment.assignedDate < dateRange.from) {
      return false;
    }
    if (dateRange.to && assignment.assignedDate > dateRange.to) {
      return false;
    }

    return true;
  });

  const handleAddAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    const assignment: Assignment = {
      id: `ASG${(assignments.length + 1).toString().padStart(3, '0')}`,
      assetId: `A${(assignments.length + 1).toString().padStart(3, '0')}`,
      ...newAssignment,
    } as Assignment;

    setAssignments([assignment, ...assignments]);
    setShowAddModal(false);
    setNewAssignment({
      assetName: '',
      assetType: 'Equipment',
      personnelName: '',
      personnelId: '',
      base: currentUser.assignedBase || 'Alpha Base',
      quantity: 1,
      assignedDate: new Date().toISOString().split('T')[0],
      status: 'Active'
    });
  };

  const handleUpdateAssignmentStatus = (assignmentId: string, newStatus: 'Active' | 'Returned' | 'Expended') => {
    setAssignments(prev => prev.map(assignment => 
      assignment.id === assignmentId 
        ? { 
            ...assignment, 
            status: newStatus,
            returnDate: newStatus === 'Returned' ? new Date().toISOString().split('T')[0] : assignment.returnDate
          }
        : assignment
    ));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'Returned':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Expended':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-blue-100 text-blue-800';
      case 'Returned':
        return 'bg-green-100 text-green-800';
      case 'Expended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const activeAssignments = filteredAssignments.filter(a => a.status === 'Active').length;
  const returnedAssignments = filteredAssignments.filter(a => a.status === 'Returned').length;
  const expendedAssignments = filteredAssignments.filter(a => a.status === 'Expended').length;
  const totalQuantityAssigned = filteredAssignments.reduce((sum, assignment) => sum + assignment.quantity, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Asset Assignments</h1>
          <p className="text-gray-600 mt-2">Track asset assignments to personnel and monitor expenditures</p>
        </div>
        
        <div className="mt-4 lg:mt-0 flex items-center space-x-3">
          <div className="text-right">
            <div className="text-sm font-medium text-gray-600">Total Assets Assigned</div>
            <div className="text-2xl font-bold text-blue-600">{totalQuantityAssigned.toLocaleString()}</div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Assignment
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Assignments</p>
              <p className="text-2xl font-bold text-gray-900">{activeAssignments}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Returned Assets</p>
              <p className="text-2xl font-bold text-gray-900">{returnedAssignments}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-red-50 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Expended Assets</p>
              <p className="text-2xl font-bold text-gray-900">{expendedAssignments}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-purple-50 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Personnel</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(filteredAssignments.map(a => a.personnelId)).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search assignments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Returned">Returned</option>
            <option value="Expended">Expended</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="all">All Types</option>
            <option value="Vehicle">Vehicle</option>
            <option value="Weapon">Weapon</option>
            <option value="Ammunition">Ammunition</option>
            <option value="Equipment">Equipment</option>
          </select>

          {currentUser.role === 'admin' && (
            <select
              value={baseFilter}
              onChange={(e) => setBaseFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Bases</option>
              {bases.map(base => (
                <option key={base} value={base}>{base}</option>
              ))}
            </select>
          )}

          <input
            type="date"
            value={dateRange.from}
            onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="From date"
          />

          <input
            type="date"
            value={dateRange.to}
            onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="To date"
          />
        </div>
      </div>

      {/* Assignments Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assignment ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Asset Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Personnel
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Base
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAssignments.map((assignment) => (
                <tr key={assignment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {assignment.id}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{assignment.assetName}</div>
                      <div className="text-sm text-gray-500">{assignment.assetType}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{assignment.personnelName}</div>
                      <div className="text-sm text-gray-500">ID: {assignment.personnelId}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {assignment.base}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {assignment.quantity.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(assignment.status)}
                      <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
                        {assignment.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {assignment.assignedDate}
                    {assignment.returnDate && (
                      <div className="text-xs text-gray-500">Returned: {assignment.returnDate}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => setShowDetailModal(assignment)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View
                    </button>
                    {assignment.status === 'Active' && (
                      <>
                        <button
                          onClick={() => handleUpdateAssignmentStatus(assignment.id, 'Returned')}
                          className="text-green-600 hover:text-green-900"
                        >
                          Return
                        </button>
                        <button
                          onClick={() => handleUpdateAssignmentStatus(assignment.id, 'Expended')}
                          className="text-red-600 hover:text-red-900"
                        >
                          Expend
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Assignment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Create New Assignment</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleAddAssignment} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Asset Name</label>
                  <input
                    type="text"
                    value={newAssignment.assetName}
                    onChange={(e) => setNewAssignment(prev => ({ ...prev, assetName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Asset Type</label>
                  <select
                    value={newAssignment.assetType}
                    onChange={(e) => setNewAssignment(prev => ({ ...prev, assetType: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="Vehicle">Vehicle</option>
                    <option value="Weapon">Weapon</option>
                    <option value="Ammunition">Ammunition</option>
                    <option value="Equipment">Equipment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Personnel Name</label>
                  <input
                    type="text"
                    value={newAssignment.personnelName}
                    onChange={(e) => setNewAssignment(prev => ({ ...prev, personnelName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Personnel ID</label>
                  <input
                    type="text"
                    value={newAssignment.personnelId}
                    onChange={(e) => setNewAssignment(prev => ({ ...prev, personnelId: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Base</label>
                  <select
                    value={newAssignment.base}
                    onChange={(e) => setNewAssignment(prev => ({ ...prev, base: e.target.value as Base }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    disabled={currentUser.role !== 'admin'}
                  >
                    {availableBases.map(base => (
                      <option key={base} value={base}>{base}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={newAssignment.quantity}
                    onChange={(e) => setNewAssignment(prev => ({ ...prev, quantity: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assignment Date</label>
                  <input
                    type="date"
                    value={newAssignment.assignedDate}
                    onChange={(e) => setNewAssignment(prev => ({ ...prev, assignedDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-md">
                <h3 className="font-medium text-blue-900 mb-2">Assignment Summary</h3>
                <div className="text-sm text-blue-800">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium">Asset:</span> {newAssignment.assetName}
                    </div>
                    <div>
                      <span className="font-medium">Personnel:</span> {newAssignment.personnelName}
                    </div>
                    <div>
                      <span className="font-medium">Quantity:</span> {newAssignment.quantity}
                    </div>
                    <div>
                      <span className="font-medium">Base:</span> {newAssignment.base}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium"
                >
                  Create Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assignment Detail Modal */}
      {showDetailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Assignment Details</h2>
              <button
                onClick={() => setShowDetailModal(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Assignment ID</label>
                <p className="text-lg font-semibold text-gray-900">{showDetailModal.id}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Asset</label>
                  <p className="text-lg text-gray-900">{showDetailModal.assetName}</p>
                  <p className="text-sm text-gray-600">{showDetailModal.assetType}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Quantity</label>
                  <p className="text-lg text-gray-900">{showDetailModal.quantity.toLocaleString()}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Assigned to</label>
                <p className="text-lg text-gray-900">{showDetailModal.personnelName}</p>
                <p className="text-sm text-gray-600">ID: {showDetailModal.personnelId}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Base</label>
                <p className="text-lg text-gray-900">{showDetailModal.base}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Status</label>
                <div className="flex items-center mt-1">
                  {getStatusIcon(showDetailModal.status)}
                  <span className={`ml-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(showDetailModal.status)}`}>
                    {showDetailModal.status}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Assignment Date</label>
                <p className="text-gray-900">{showDetailModal.assignedDate}</p>
              </div>

              {showDetailModal.returnDate && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">Return Date</label>
                  <p className="text-gray-900">{showDetailModal.returnDate}</p>
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-between">
              <button
                onClick={() => setShowDetailModal(null)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-sm font-medium"
              >
                Close
              </button>
              
              {showDetailModal.status === 'Active' && (
                <div className="space-x-2">
                  <button
                    onClick={() => {
                      handleUpdateAssignmentStatus(showDetailModal.id, 'Returned');
                      setShowDetailModal(null);
                    }}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium"
                  >
                    Mark Returned
                  </button>
                  <button
                    onClick={() => {
                      handleUpdateAssignmentStatus(showDetailModal.id, 'Expended');
                      setShowDetailModal(null);
                    }}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium"
                  >
                    Mark Expended
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}