import React, { useState } from 'react';
import { ArrowLeftRight, Plus, Search, Clock, CheckCircle, AlertCircle, X } from 'lucide-react';
import type { User, Base, Transfer } from '../App';

interface TransfersProps {
  currentUser: User;
}

const mockTransfers: Transfer[] = [
  {
    id: 'T001',
    assetId: 'A001',
    assetName: 'Bradley IFV M2A3',
    assetType: 'Vehicle',
    fromBase: 'Alpha Base',
    toBase: 'Charlie Base',
    quantity: 2,
    date: '2024-02-10',
    status: 'In Transit',
    requestedBy: 'Colonel Johnson',
    approvedBy: 'General Smith'
  },
  {
    id: 'T002',
    assetId: 'A002',
    assetName: 'Night Vision Goggles PVS-14',
    assetType: 'Equipment',
    fromBase: 'Bravo Base',
    toBase: 'Delta Base',
    quantity: 75,
    date: '2024-02-15',
    status: 'Completed',
    requestedBy: 'Major Williams',
    approvedBy: 'Colonel Thompson'
  },
  {
    id: 'T003',
    assetId: 'A003',
    assetName: 'M249 SAW',
    assetType: 'Weapon',
    fromBase: 'Delta Base',
    toBase: 'Alpha Base',
    quantity: 10,
    date: '2024-02-20',
    status: 'Pending',
    requestedBy: 'Captain Davis'
  },
  {
    id: 'T004',
    assetId: 'A004',
    assetName: '7.62mm NATO Ammunition',
    assetType: 'Ammunition',
    fromBase: 'Charlie Base',
    toBase: 'Bravo Base',
    quantity: 5000,
    date: '2024-02-25',
    status: 'Completed',
    requestedBy: 'Lieutenant Brown',
    approvedBy: 'Major Garcia'
  }
];

export default function Transfers({ currentUser }: TransfersProps) {
  const [transfers, setTransfers] = useState<Transfer[]>(mockTransfers);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState<Transfer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [baseFilter, setBaseFilter] = useState<string>('all');

  const [newTransfer, setNewTransfer] = useState<Partial<Transfer>>({
    assetName: '',
    assetType: 'Equipment',
    fromBase: currentUser.assignedBase || 'Alpha Base',
    toBase: 'Alpha Base',
    quantity: 1,
    date: new Date().toISOString().split('T')[0],
    status: 'Pending',
    requestedBy: currentUser.name
  });

  const bases: Base[] = ['Alpha Base', 'Bravo Base', 'Charlie Base', 'Delta Base'];
  const availableBases = currentUser.role === 'admin' 
    ? bases 
    : currentUser.assignedBase 
    ? [currentUser.assignedBase] 
    : bases;

  // Filter transfers based on user role and filters
  const filteredTransfers = transfers.filter(transfer => {
    // Role-based filtering
    if (currentUser.role !== 'admin' && currentUser.assignedBase) {
      if (transfer.fromBase !== currentUser.assignedBase && transfer.toBase !== currentUser.assignedBase) {
        return false;
      }
    }

    // Search filter
    if (searchTerm && !transfer.assetName.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !transfer.id.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // Status filter
    if (statusFilter !== 'all' && transfer.status !== statusFilter) {
      return false;
    }

    // Base filter
    if (baseFilter !== 'all' && transfer.fromBase !== baseFilter && transfer.toBase !== baseFilter) {
      return false;
    }

    return true;
  });

  const handleAddTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const transfer: Transfer = {
      id: `T${(transfers.length + 1).toString().padStart(3, '0')}`,
      assetId: `A${(transfers.length + 1).toString().padStart(3, '0')}`,
      ...newTransfer,
    } as Transfer;

    setTransfers([transfer, ...transfers]);
    setShowAddModal(false);
    setNewTransfer({
      assetName: '',
      assetType: 'Equipment',
      fromBase: currentUser.assignedBase || 'Alpha Base',
      toBase: 'Alpha Base',
      quantity: 1,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
      requestedBy: currentUser.name
    });
  };

  const handleApproveTransfer = (transferId: string) => {
    setTransfers(prev => prev.map(transfer => 
      transfer.id === transferId 
        ? { ...transfer, status: 'In Transit' as const, approvedBy: currentUser.name }
        : transfer
    ));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'In Transit':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'Pending':
        return <AlertCircle className="h-4 w-4 text-blue-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Transit':
        return 'bg-yellow-100 text-yellow-800';
      case 'Pending':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const pendingTransfers = filteredTransfers.filter(t => t.status === 'Pending').length;
  const inTransitTransfers = filteredTransfers.filter(t => t.status === 'In Transit').length;
  const completedTransfers = filteredTransfers.filter(t => t.status === 'Completed').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Asset Transfers</h1>
          <p className="text-gray-600 mt-2">Manage asset movements between operational bases</p>
        </div>
        
        <div className="mt-4 lg:mt-0 flex items-center space-x-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Transfer
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-50 rounded-lg">
              <AlertCircle className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Approval</p>
              <p className="text-2xl font-bold text-gray-900">{pendingTransfers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-50 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">In Transit</p>
              <p className="text-2xl font-bold text-gray-900">{inTransitTransfers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{completedTransfers}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search transfers..."
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
            <option value="Pending">Pending</option>
            <option value="In Transit">In Transit</option>
            <option value="Completed">Completed</option>
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
        </div>
      </div>

      {/* Transfers Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transfer ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Asset Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Route
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransfers.map((transfer) => (
                <tr key={transfer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {transfer.id}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{transfer.assetName}</div>
                      <div className="text-sm text-gray-500">{transfer.assetType}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-900">
                      <span className="text-blue-600">{transfer.fromBase}</span>
                      <ArrowLeftRight className="h-4 w-4 mx-2 text-gray-400" />
                      <span className="text-green-600">{transfer.toBase}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transfer.quantity.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(transfer.status)}
                      <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transfer.status)}`}>
                        {transfer.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transfer.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => setShowDetailModal(transfer)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View
                    </button>
                    {transfer.status === 'Pending' && currentUser.role === 'admin' && (
                      <button
                        onClick={() => handleApproveTransfer(transfer.id)}
                        className="text-green-600 hover:text-green-900"
                      >
                        Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Transfer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Create Transfer Request</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleAddTransfer} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Asset Name</label>
                  <input
                    type="text"
                    value={newTransfer.assetName}
                    onChange={(e) => setNewTransfer(prev => ({ ...prev, assetName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Asset Type</label>
                  <select
                    value={newTransfer.assetType}
                    onChange={(e) => setNewTransfer(prev => ({ ...prev, assetType: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="Vehicle">Vehicle</option>
                    <option value="Weapon">Weapon</option>
                    <option value="Ammunition">Ammunition</option>
                    <option value="Equipment">Equipment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">From Base</label>
                  <select
                    value={newTransfer.fromBase}
                    onChange={(e) => setNewTransfer(prev => ({ ...prev, fromBase: e.target.value as Base }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    disabled={currentUser.role !== 'admin'}
                  >
                    {availableBases.map(base => (
                      <option key={base} value={base}>{base}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">To Base</label>
                  <select
                    value={newTransfer.toBase}
                    onChange={(e) => setNewTransfer(prev => ({ ...prev, toBase: e.target.value as Base }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {bases.filter(base => base !== newTransfer.fromBase).map(base => (
                      <option key={base} value={base}>{base}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={newTransfer.quantity}
                    onChange={(e) => setNewTransfer(prev => ({ ...prev, quantity: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Transfer Date</label>
                  <input
                    type="date"
                    value={newTransfer.date}
                    onChange={(e) => setNewTransfer(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-md">
                <h3 className="font-medium text-blue-900 mb-2">Transfer Summary</h3>
                <div className="text-sm text-blue-800">
                  <div className="flex items-center">
                    <span className="font-medium">{newTransfer.assetName}</span>
                    <span className="mx-2">•</span>
                    <span>{newTransfer.quantity} units</span>
                  </div>
                  <div className="flex items-center mt-1">
                    <span className="text-blue-600">{newTransfer.fromBase}</span>
                    <ArrowLeftRight className="h-4 w-4 mx-2" />
                    <span className="text-green-600">{newTransfer.toBase}</span>
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
                  Submit Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transfer Detail Modal */}
      {showDetailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Transfer Details</h2>
              <button
                onClick={() => setShowDetailModal(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Transfer ID</label>
                <p className="text-lg font-semibold text-gray-900">{showDetailModal.id}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Asset</label>
                <p className="text-lg text-gray-900">{showDetailModal.assetName}</p>
                <p className="text-sm text-gray-600">{showDetailModal.assetType}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">From</label>
                  <p className="text-blue-600 font-medium">{showDetailModal.fromBase}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">To</label>
                  <p className="text-green-600 font-medium">{showDetailModal.toBase}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Quantity</label>
                <p className="text-lg text-gray-900">{showDetailModal.quantity.toLocaleString()}</p>
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
                <label className="block text-sm font-medium text-gray-500">Requested By</label>
                <p className="text-gray-900">{showDetailModal.requestedBy}</p>
              </div>

              {showDetailModal.approvedBy && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">Approved By</label>
                  <p className="text-gray-900">{showDetailModal.approvedBy}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-500">Transfer Date</label>
                <p className="text-gray-900">{showDetailModal.date}</p>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 rounded-b-lg">
              <button
                onClick={() => setShowDetailModal(null)}
                className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-sm font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}