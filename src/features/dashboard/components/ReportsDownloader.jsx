import { useState } from 'react';
import { downloadReport } from '../../../api/dashboardApi';
import { Download } from 'lucide-react';

const ReportsDownloader = () => {
  const [loading, setLoading] = useState(false);

  const handleDownload = async (reportType) => {
    setLoading(true);
    try {
      // Using a fixed date range for example purposes
      await downloadReport(reportType, { startDate: '2025-01-01', endDate: '2025-12-31' });
    } catch (error) {
      console.error(error);
      alert(`Failed to download ${reportType} report.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card bg-base-100 shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4">Download Reports</h2>
      <div className="space-y-2">
        <button onClick={() => handleDownload('sales')} className="btn btn-outline w-full" disabled={loading}>
          <Download className="w-4 h-4 mr-2" /> Download Sales Report
        </button>
        <button onClick={() => handleDownload('inventory')} className="btn btn-outline w-full" disabled={loading}>
          <Download className="w-4 h-4 mr-2" /> Download Inventory Report
        </button>
        <button onClick={() => handleDownload('customers')} className="btn btn-outline w-full" disabled={loading}>
          <Download className="w-4 h-4 mr-2" /> Download Customer Report
        </button>
      </div>
    </div>
  );
};

export default ReportsDownloader;
