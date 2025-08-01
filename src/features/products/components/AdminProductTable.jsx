import { Edit, Trash2 } from 'lucide-react';

const AdminProductTable = ({ products, onEdit, onDelete }) => {
  console.log("AdminProductTable products:", products);
  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Condition</th>
            <th>Base Price</th>
            <th>Dynamic Price</th>
            <th>Stock Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.productId} className="hover">
              <td>
                <div className="avatar">
                  <div className="mask mask-squircle w-12 h-12">
                    <img src={product.imageUrl} alt={product.name} />
                  </div>
                </div>
              </td>
              <td>
                <div className="font-bold">{product.name}</div>
              </td>
              <td>
                <span className={`badge ${product.condition === 'New Flower' ? 'badge-success' :
                  product.condition === 'Old Flower' ? 'badge-warning' : 'badge-error'
                  }`}>
                  {product.condition}
                </span>
              </td>
              <td>${product.basePrice.toFixed(2)}</td>
              <td className="font-semibold">${product.dynamicPrice.toFixed(2)}</td>
              <td>{product.stockQuantity}</td>
              <td>
                <div className="flex gap-2">
                  <button onClick={() => onEdit(product.productId)} className="btn btn-ghost btn-xs">
                    <Edit className="w-4 h-4" /> Edit
                  </button>
                  <button onClick={() => onDelete(product.productId)} className="btn btn-ghost btn-xs text-error">
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminProductTable;
