import { Edit, Trash2 } from 'lucide-react';

const CategoryTable = ({ categories, onEdit, onDelete }) => (
  <div className="overflow-x-auto">
    <table className="table w-full">
      <thead>
        <tr>
          <th>Name</th>
          <th>Type</th>
          <th>Description</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {categories.map(cat => (
          <tr key={cat.category_id} className="hover">
            <td>{cat.name}</td>
            <td>{cat.category_type}</td>
            <td>{cat.description}</td>
            <td>
              <div className="flex gap-2">
                <button onClick={() => onEdit(cat)} className="btn btn-ghost btn-xs"><Edit className="w-4 h-4" /> Edit</button>
                <button onClick={() => onDelete(cat.category_id)} className="btn btn-ghost btn-xs text-error"><Trash2 className="w-4 h-4" /> Delete</button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default CategoryTable;
