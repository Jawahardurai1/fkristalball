import React, { useState } from 'react';
import { Package, Plus, Filter, Search, Calendar, DollarSign } from 'lucide-react';
import type { User, Base } from '../App';

interface PurchasesProps {
  currentUser: User;
}

interface Purchase {
  id: string;
  assetName: string;
  assetType: 'Vehicle' | 'Weapon' | 'Ammunition' | 'Equipment';
  quantity: number;
  unitCost: number;
  totalCost: number;
  vendor: string;
  base: Base;
  purchaseDate: string;
  deliveryDate: string;
  status: 'Ordered' | 'In Transit' | 'Delivered' | 'Cancelled';
  purchasedBy: string;
  approvedBy: string;
  notes?: string;
}

const mockPurchases: Purchase[] = [
  {
    id: 'P001',
    assetName: 'M4A1 Carbine',
    assetType: 'Weapon',
    quantity: 50,
    unitCost: 1200,
    totalCost: 60000,
    vendor: 'Colt Defense LLC',
    base: 'Alpha Base',
    purchaseDate: '2024-01-15',
    deliveryDate: '2024-02-01',
    status: 'Delivered',
    purchasedBy: 'Captain Smith',
    approvedBy: 'Colonel Johnson',
    notes: 'Standard issue rifles for infantry unit'
  },
  {
    id: 'P002',
    assetName: 'Humvee M1151',
    assetType: 'Vehicle',
    quantity: 3,
    unitCost: 85000,
    totalCost: 255000,
    vendor: 'AM General',
    base: 'Bravo Base',
    purchaseDate: '2024-01-20',
    deliveryDate: '2024-03-15',
    status: 'In Transit',
    purchasedBy: 'Major Wilson',
    approvedBy: 'Colonel Thompson',
    notes: 'Armored personnel carriers for patrol operations'
  },
  {
    id: 'P003',
    assetName: '5.56mm NATO Ammunition',
    assetType: 'Ammunition',
    quantity: 50000,
    unitCost: 0.85,
    totalCost: 42500,
    vendor: 'Federal Premium',
    base: 'Charlie Base',
    purchaseDate: '2024-02-01',
    deliveryDate: '2024-02-15',
    status: 'Delivered',
    purchasedBy: 'Lieutenant Davis',
    approvedBy: 'Major Brown',
    notes: 'Training and operational ammunition'
  },
  {
    id: 'P004',
    assetName: 'Night Vision Goggles',
    assetType: 'Equipment',
    quantity: 25,
    unitCost: 3200,
    totalCost: 80000,
    vendor: 'L3Harris Technologies',
    base: 'Delta Base',
    purchaseDate: '2024-02-10',
    deliveryDate: '2024-03-01',
    status: 'Ordered',
    purchasedBy: 'Captain Lee',
    approvedBy: 'Lieutenant Colonel Garcia',
    notes: 'PVS-14 monocular night vision devices'
  }
];

export default function Purchases({ currentUser }: PurchasesProps) {
  const [purchases, setPurchases] = useState<Purchase[]>(mockPurchases);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [baseFilter, setBaseFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });

  const [newPurchase, setNewPurchase] = useState<Partial<Purchase>>({
    assetName: '',
    assetType: 'Equipment',
    quantity: 1,
    unitCost: 0,
    vendor: '',
    base: currentUser.assignedBase || 'Alpha Base',
    purchaseDate: new Date().toISOString().split('T')[0],
    deliveryDate: '',
    status: 'Ordered',
    purchasedBy: currentUser.name,
    approvedBy: '',
    notes: ''
  });

  const bases: Base[] = ['Alpha Base', 'Bravo Base', 'Charlie Base', 'Delta Base'];
  const availableBases = currentUser.role === 'admin' 
    ? bases 
    : currentUser.assignedBase 
    ? [currentUser.assignedBase] 
    : bases;

  // Filter purchases based on user role and filters
  const filteredPurchases = purchases.filter(purchase => {
    // Role-based filtering
    if (currentUser.role !== 'admin' && currentUser.assignedBase && purchase.base !== currentUser.assignedBase) {
      return false;
    }

    // Search filter
    if (searchTerm && !purchase.assetName.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !purchase.vendor.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // Status filter
    if (statusFilter !== 'all' && purchase.status !== statusFilter) {
      return false;
    }

    // Type filter
    if (typeFilter !== 'all' && purchase.assetType !== typeFilter) {
      return false;
    }

    // Base filter
    if (baseFilter !== 'all' && purchase.base !== baseFilter) {
      return false;
    }

    // Date range filter
    if (dateRange.from && purchase.purchaseDate < dateRange.from) {
      return false;
    }
    if (dateRange.to && purchase.purchaseDate > dateRange.to) {
      return false;
    }

    return true;
  });

  const handleAddPurchase = (e: React.FormEvent) => {
    e.preventDefault();
    const purchase: Purchase = {
      id: `P${(purchases.length + 1).toString().padStart(3, '0')}`,
      ...newPurchase,
      totalCost: (newPurchase.quantity || 0) * (newPurchase.unitCost || 0),
    } as Purchase;

    setPurchases([purchase, ...purchases]);
    setShowAddModal(false);
    setNewPurchase({
      assetName: '',
      assetType: 'Equipment',
      quantity: 1,
      unitCost: 0,
      vendor: '',
      base: currentUser.assignedBase || 'Alpha Base',
      purchaseDate: new Date().toISOString().split('T')[0],
      deliveryDate: '',
      status: 'Ordered',
      purchasedBy: currentUser.name,
      approvedBy: '',
      notes: ''
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'In Transit':
        return 'bg-yellow-100 text-yellow-800';
      case 'Ordered':
        return 'bg-blue-100 text-blue-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const totalValue = filteredPurchases.reduce((sum, purchase) => sum + purchase.totalCost, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Purchase Management</h1>
          <p className="text-gray-600 mt-2">Track and manage asset purchases across all operations</p>
        </div>
        
        <div className="mt-4 lg:mt-0 flex items-center space-x-3">
          <div className="text-right">
            <div className="text-sm font-medium text-gray-600">Total Value</div>
            <div className="text-2xl font-bold text-green-600">${totalValue.toLocaleString()}</div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Purchase
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search purchases..."
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
            <option value="Ordered">Ordered</option>
            <option value="In Transit">In Transit</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
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

      {/* Purchases Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Purchase ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Asset Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vendor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Base
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dates
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPurchases.map((purchase) => (
                <tr key={purchase.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {purchase.id}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{purchase.assetName}</div>
                      <div className="text-sm text-gray-500">{purchase.assetType}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {purchase.quantity.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">${purchase.totalCost.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">${purchase.unitCost} each</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{purchase.vendor}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {purchase.base}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(purchase.status)}`}>
                      {purchase.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">Ordered: {purchase.purchaseDate}</div>
                    <div className="text-sm text-gray-500">
                      {purchase.deliveryDate ? `Delivery: ${purchase.deliveryDate}` : 'Delivery: TBD'}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Purchase Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Add New Purchase</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Package className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleAddPurchase} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Asset Name</label>
                  <input
                    type="text"
                    value={newPurchase.assetName}
                    onChange={(e) => setNewPurchase(prev => ({ ...prev, assetName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Asset Type</label>
                  <select
                    value={newPurchase.assetType}
                    onChange={(e) => setNewPurchase(prev => ({ ...prev, assetType: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="Vehicle">Vehicle</option>
                    <option value="Weapon">Weapon</option>
                    <option value="Ammunition">Ammunition</option>
                    <option value="Equipment">Equipment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={newPurchase.quantity}
                    onChange={(e) => setNewPurchase(prev => ({ ...prev, quantity: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Unit Cost ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={newPurchase.unitCost}
                    onChange={(e) => setNewPurchase(prev => ({ ...prev, unitCost: parseFloat(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vendor</label>
                  <input
                    type="text"
                    value={newPurchase.vendor}
                    onChange={(e) => setNewPurchase(prev => ({ ...prev, vendor: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Base</label>
                  <select
                    value={newPurchase.base}
                    onChange={(e) => setNewPurchase(prev => ({ ...prev, base: e.target.value as Base }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    disabled={currentUser.role !== 'admin'}
                  >
                    {availableBases.map(base => (
                      <option key={base} value={base}>{base}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Purchase Date</label>
                  <input
                    type="date"
                    value={newPurchase.purchaseDate}
                    onChange={(e) => setNewPurchase(prev => ({ ...prev, purchaseDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expected Delivery</label>
                  <input
                    type="date"
                    value={newPurchase.deliveryDate}
                    onChange={(e) => setNewPurchase(prev => ({ ...prev, deliveryDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Approved By</label>
                <input
                  type="text"
                  value={newPurchase.approvedBy}
                  onChange={(e) => setNewPurchase(prev => ({ ...prev, approvedBy: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  value={newPurchase.notes}
                  onChange={(e) => setNewPurchase(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Additional notes about this purchase..."
                />
              </div>

              {newPurchase.quantity && newPurchase.unitCost && (
                <div className="bg-green-50 p-4 rounded-md">
                  <div className="flex items-center justify-between text-lg font-semibold text-green-800">
                    <span>Total Cost:</span>
                    <span>${((newPurchase.quantity || 0) * (newPurchase.unitCost || 0)).toLocaleString()}</span>
                  </div>
                </div>
              )}

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
                  Add Purchase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}