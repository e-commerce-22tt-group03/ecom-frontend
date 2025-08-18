import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardData } from '../../features/dashboard/dashboardSlice';
import SummaryStats from '../../features/dashboard/components/SummaryStats';
import SalesChart from '../../features/dashboard/components/SalesChart';
import ReportsDownloader from '../../features/dashboard/components/ReportsDownloader';
import CategoryPieChart from '../../features/dashboard/components/CategoryPieChart';
import TopProductsList from '../../features/dashboard/components/TopProductsList';

const AdminDashboardPage = () => {
  const dispatch = useDispatch();
  const {
    summary,
    salesOverTime,
    topProducts,
    salesByFlowerType,
    salesByOccasion,
    loading,
    error
  } = useSelector((state) => state.dashboard);

  useEffect(() => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 30);

    dispatch(fetchDashboardData({
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      groupBy: 'day'
    }));
  }, [dispatch]);

  if (loading) {
    return <div className="text-center p-8"><span className="loading loading-spinner loading-lg"></span></div>;
  }

  if (error) {
    return <div className="alert alert-error"><span>Error fetching dashboard data: {error}</span></div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold ml-4">Admin Dashboard</h1>

      <SummaryStats data={summary} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesChart data={salesOverTime} />
        </div>
        <div>
          <TopProductsList data={topProducts} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryPieChart data={salesByFlowerType} title="Sales by Flower Type" />
        <CategoryPieChart data={salesByOccasion} title="Sales by Occasion" />
      </div>

      <div className="card bg-base-100 shadow-lg p-6">
        <ReportsDownloader />
      </div>
    </div>
  );
};

export default AdminDashboardPage;
