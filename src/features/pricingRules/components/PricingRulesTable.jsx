import { Edit, Trash2 } from 'lucide-react';

const formatConditionType = (type) => {
  switch (type) {
    case 'product_condition':
      return 'Product Condition';
    case 'time_of_day':
      return 'Time of Day';
    case 'special_day':
      return 'Special Day';
    default:
      return type;
  }
};

const PricingRulesTable = ({ rules, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            <th>Name</th>
            <th>Condition</th>
            <th>Value</th>
            <th>Multiplier</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rules.map((rule) => (
            <tr key={rule.rule_id} className="hover">
              <td>{rule.name}</td>
              <td>{formatConditionType(rule.condition_type)}</td>
              <td>{rule.condition_value}</td>
              <td>{rule.multiplier}</td>
              <td>{rule.priority}</td>
              <td>
                <span className={`badge ${rule.is_active ? 'badge-success' : 'badge-ghost'}`}>
                  {rule.is_active ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td>
                <div className="flex gap-2">
                  <button onClick={() => onEdit(rule)} className="btn btn-ghost btn-xs">
                    <Edit className="w-4 h-4" /> Edit
                  </button>
                  <button onClick={() => onDelete(rule.rule_id)} className="btn btn-ghost btn-xs text-error">
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

export default PricingRulesTable;
