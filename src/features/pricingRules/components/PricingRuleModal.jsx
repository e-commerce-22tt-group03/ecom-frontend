import { useState, useEffect } from 'react';

const PricingRuleModal = ({ isOpen, onClose, onSubmit, isLoading, ruleToEdit }) => {
  const isEditMode = !!ruleToEdit;

  // Default state for a new rule
  const defaultFormState = {
    name: '',
    category_id: null,
    condition_type: 'product_condition',
    condition_value: 'Old Flower',
    multiplier: 1.0,
    priority: 1,
    is_active: true,
  };

  const [formData, setFormData] = useState(defaultFormState);
  const [timeRange, setTimeRange] = useState({ start: '06:00', end: '10:00' });

  // Get today's date in YYYY-MM-DD format for the date input's min attribute
  const getTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && ruleToEdit) {
        setFormData(ruleToEdit);
        if (ruleToEdit.condition_type === 'time_of_day' && ruleToEdit.condition_value.includes('-')) {
          const [start, end] = ruleToEdit.condition_value.split('-');
          setTimeRange({ start, end });
        }
      } else {
        setFormData(defaultFormState);
        setTimeRange({ start: '06:00', end: '10:00' });
      }
    }
  }, [isOpen, ruleToEdit, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleTimeChange = (e) => {
    const { name, value } = e.target;
    setTimeRange(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let finalData = { ...formData };

    if (formData.condition_type === 'time_of_day') {
      finalData.condition_value = `${timeRange.start}-${timeRange.end}`;
    }

    onSubmit({
      ...finalData,
      multiplier: parseFloat(finalData.multiplier),
      priority: parseInt(finalData.priority),
    });
  };

  const renderConditionValueInput = () => {
    switch (formData.condition_type) {
      case 'product_condition':
        return (
          <div>
            <label className="form-control w-full">
              <div className="label"><span className="label-text">Condition Value</span></div>
              <select name="condition_value" value={formData.condition_value} onChange={handleChange} className="select select-bordered w-full">
                <option>Old Flower</option>
                <option>New Flower</option>
                <option>Low Stock</option>
              </select>
            </label>
          </div>
        );
      case 'time_of_day':
        return (
          <div>
            <div className="label"><span className="label-text">Condition Value (Time Range)</span></div>
            <div className="flex items-center gap-2">
              <input type="time" name="start" value={timeRange.start} onChange={handleTimeChange} className="input input-bordered w-full" />
              <span>to</span>
              <input type="time" name="end" value={timeRange.end} onChange={handleTimeChange} className="input input-bordered w-full" />
            </div>
          </div>
        );
      case 'special_day':
        return (
          <div>
            <label className="form-control w-full">
              <div className="label"><span className="label-text">Condition Value (Special Day)</span></div>
              <input
                type="date"
                name="condition_value"
                value={formData.condition_value}
                onChange={handleChange}
                className="input input-bordered w-full"
                min={getTodayString()} // Prevent selecting past dates
                required
              />
            </label>
          </div>
        );
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">{isEditMode ? 'Edit Rule' : 'Add New Rule'}</h3>
        <form onSubmit={handleSubmit} className="py-4 space-y-4">
          <div></div>
          <label className="form-control w-full">
            <div className="label"><span className="label-text">Rule Name</span></div>
            <input name="name" value={formData.name} onChange={handleChange} className="input input-bordered w-full" required />
          </label>
          <div>
            <label className="form-control w-full">
              <div className="label"><span className="label-text">Condition Type</span></div>
              <select name="condition_type" value={formData.condition_type} onChange={handleChange} className="select select-bordered w-full">
                <option value="product_condition">Product Condition</option>
                <option value="time_of_day">Time of Day</option>
                <option value="special_day">Special Day</option>
              </select>
            </label>
          </div>

          {renderConditionValueInput()}
          <div>
            <label className="form-control w-full">
              <div className="label"><span className="label-text">Multiplier</span></div>
              <input type="number" step="0.01" name="multiplier" value={formData.multiplier} onChange={handleChange} className="input input-bordered w-full" required />
            </label>
          </div>
          <div>
            <label className="form-control w-full">
              <div className="label"><span className="label-text">Priority</span></div>
              <input type="number" name="priority" value={formData.priority} onChange={handleChange} className="input input-bordered w-full" required />
            </label>
          </div>
          <div>
            <label className="label cursor-pointer">
              <span className="label-text">Is Active</span>
              <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} className="toggle toggle-success" />
            </label>
          </div>

          <div className="modal-action">
            <button type="button" className="btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? <span className="loading loading-spinner"></span> : (isEditMode ? 'Update Rule' : 'Add Rule')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PricingRuleModal;
