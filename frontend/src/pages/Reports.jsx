import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, Filter } from 'lucide-react';
import { fetchReportData, generateReport, fetchMonthlyReport, fetchYearlyReport } from '../utils/api';

const Reports = () => {
  const [reportType, setReportType] = useState('monthly');
  const [selectedProperty, setSelectedProperty] = useState('all');
  const [dateRange, setDateRange] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [reportData, setReportData] = useState({
    summary: {
      totalRevenue: 0,
      totalExpenses: 0,
      netIncome: 0,
      occupancyRate: 0,
      totalUnits: 0,
      occupiedUnits: 0
    },
    revenueByProperty: [],
    occupancyTrend: [],
    paymentStatus: []
  });

  useEffect(() => {
    loadReportData();
  }, [reportType, selectedProperty, dateRange]);

  const loadReportData = async () => {
    try {
      const response = await fetchReportData({
        type: reportType,
        propertyId: selectedProperty,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate
      });
      setReportData(response.data);
    } catch (error) {
      console.error('Error loading report data:', error);
    }
  };

  const handleDownloadReport = async () => {
    try {
      const response = await generateReport({
        type: reportType,
        propertyId: selectedProperty,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate
      });
      
      // Handle PDF download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `property_report_${reportType}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reports</h2>
          <p className="mt-2 text-sm text-gray-700">
            View and analyze property performance
          </p>
        </div>
        <button 
          className="btn-primary"
          onClick={handleDownloadReport}
        >
          <Download className="h-5 w-5 mr-2" />
          Download Report
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Report Type
            </label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option value="monthly">Monthly Report</option>
              <option value="quarterly">Quarterly Report</option>
              <option value="yearly">Yearly Report</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Property
            </label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              value={selectedProperty}
              onChange={(e) => setSelectedProperty(e.target.value)}
            >
              <option value="all">All Properties</option>
              {/* Add property options dynamically */}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <input
              type="date"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              value={dateRange.startDate}
              onChange={(e) => setDateRange(prev => ({
                ...prev,
                startDate: e.target.value
              }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              End Date
            </label>
            <input
              type="date"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              value={dateRange.endDate}
              onChange={(e) => setDateRange(prev => ({
                ...prev,
                endDate: e.target.value
              }))}
            />
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            ${reportData.summary.totalRevenue.toLocaleString()}
          </p>
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-gray-500">Net Income</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            ${reportData.summary.netIncome.toLocaleString()}
          </p>
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-gray-500">Occupancy Rate</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {reportData.summary.occupancyRate}%
          </p>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-4">Revenue Trend</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={reportData.revenueByProperty}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#0ea5e9" name="Revenue" />
              <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Occupancy Trend */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-4">Occupancy Trend</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={reportData.occupancyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="occupancyRate" fill="#22c55e" name="Occupancy Rate (%)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Payment Status */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-4">Payment Status Distribution</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reportData.paymentStatus.map(status => (
            <div key={status.name} className="p-4 rounded-lg bg-gray-50">
              <div className="text-sm text-gray-500">{status.name}</div>
              <div className="mt-2 text-2xl font-bold">{status.value}</div>
              <div className="text-sm text-gray-500">{status.percentage}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;