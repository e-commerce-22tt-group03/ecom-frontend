import { DollarSign, ShoppingCart, Users, BarChart } from 'lucide-react';

const StatCard = ({ icon, title, value, color }) => (
  <div className={`card bg-base-100 shadow-lg`}>
    <div className="card-body flex-row items-center">
      <div className={`p-3 rounded-full bg-${color}-100 text-${color}-600`}>
        {icon}
      </div>
      <div className="ml-4">
        <div className="text-gray-500">{title}</div>
        <div className="text-2xl font-bold">{value}</div>
      </div>
    </div>
  </div>
);

const SummaryStats = ({ data }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard icon={<DollarSign />} title="Total Revenue" value={`$${data.totalRevenue?.toFixed(2) || '0.00'}`} color="green" />
      <StatCard icon={<ShoppingCart />} title="Total Orders" value={data.totalOrders || 0} color="blue" />
      <StatCard icon={<Users />} title="New Users" value={data.newUsers || 0} color="purple" />
      <StatCard icon={<BarChart />} title="Avg. Order Value" value={`$${data.averageOrderValue?.toFixed(2) || '0.00'}`} color="yellow" />
    </div>
  );
};

export default SummaryStats;