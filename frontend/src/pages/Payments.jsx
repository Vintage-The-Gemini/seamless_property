import { useState } from 'react'
import { Plus, Search, Filter, FileText, Download, Eye } from 'lucide-react'
import { fetchPayments } from '../utils/api';


const Payments = () => {
  const [payments, setPayments] = useState([
    {
      id: 1,
      tenant: 'John Doe',
      unit: '101',
      property: 'Sunset Apartments',
      amount: 1200,
      date: '2024-11-01',
      status: 'Paid',
      type: 'Rent',
      receipt: '#RCP001'
    },
    {
      id: 2,
      tenant: 'Jane Smith',
      unit: '205',
      property: 'Sunset Apartments',
      amount: 1500,
      date: '2024-11-02',
      status: 'Pending',
      type: 'Rent',
      receipt: '#RCP002'
    }
  ])

  const [filterStatus, setFilterStatus] = useState('all')

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Payments</h2>
          <p className="mt-2 text-sm text-gray-700">
            Track and manage payments
          </p>
        </div>
        <div className="flex gap-4">
          <button className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50">
            <Download className="h-5 w-5" />
            Export
          </button>
          <button className="btn-primary">
            <Plus className="h-5 w-5 mr-2" />
            Record Payment
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card">
          <h3 className="text-sm font-medium text-gray-500">Total Collected</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">$24,000</p>
          <p className="mt-1 text-sm text-green-600">+8% from last month</p>
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-gray-500">Outstanding</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">$3,600</p>
          <p className="mt-1 text-sm text-red-600">4 pending payments</p>
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-gray-500">Collection Rate</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">87%</p>
          <p className="mt-1 text-sm text-gray-600">Target: 95%</p>
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-gray-500">Late Payments</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">3</p>
          <p className="mt-1 text-sm text-gray-600">-2 from last month</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search payments by tenant or receipt number..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg bg-white"
        >
          <option value="all">All Status</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="overdue">Overdue</option>
        </select>
        <button className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50">
          <Filter className="h-5 w-5" />
          More Filters
        </button>
      </div>

      {/* Payments Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Receipt
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payments.map((payment) => (
              <tr key={payment.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{payment.tenant}</div>
                  <div className="text-sm text-gray-500">
                    Unit {payment.unit} - {payment.property}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">${payment.amount}</div>
                  <div className="text-sm text-gray-500">{payment.type}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{payment.date}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                    payment.status === 'Paid' 
                      ? 'bg-green-100 text-green-800'
                      : payment.status === 'Pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {payment.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{payment.receipt}</div>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button className="text-blue-600 hover:text-blue-900">
                    <Eye className="h-5 w-5" />
                  </button>
                  <button className="text-gray-600 hover:text-gray-900">
                    <FileText className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Showing 1 to 10 of 20 entries
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50">
            Previous
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50">
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default Payments