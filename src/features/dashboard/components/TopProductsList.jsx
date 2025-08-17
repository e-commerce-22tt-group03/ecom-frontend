import { TrendingUp } from 'lucide-react';

const TopProductsList = ({ data }) => {
  return (
    <div className="card bg-base-100 shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4">Top-Selling Products</h2>
      <ul className="space-y-4">
        {data.map((product, index) => (
          <li key={product.product_id} className="flex items-center">
            <div className="font-bold text-lg mr-4">{index + 1}.</div>
            <div className="flex-grow">
              <div className="font-semibold">{product.name}</div>
              <div className="text-sm text-gray-500">
                <TrendingUp className="w-4 h-4 inline-block mr-1" />
                {product.total_sold} units sold
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopProductsList;