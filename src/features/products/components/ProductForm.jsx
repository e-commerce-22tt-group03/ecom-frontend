import { useState } from 'react';

const ProductForm = ({ onSubmit, isLoading, initialData = {} }) => {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    description: initialData.description || '',
    base_price: initialData.base_price || '',
    condition: initialData.condition || 'New Flower',
    stock_quantity: initialData.stock_quantity || '',
    image_url: initialData.image_url || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Convert types as per the API spec before submitting
    const submissionData = {
      ...formData,
      base_price: Number(formData.base_price),
      stock_quantity: Number(formData.stock_quantity)
    };
    onSubmit(submissionData);
  };

  return (
    <form onSubmit={handleSubmit} className="card bg-base-100 shadow-xl p-8">
      <div className="space-y-4">
        <div>
          <label className="label"><span className="label-text">Product Name*</span></label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} className="input input-bordered w-full" required />
        </div>

        <div>
          <label className="label"><span className="label-text">Description</span></label>
          <textarea name="description" value={formData.description} onChange={handleChange} className="textarea textarea-bordered w-full h-24"></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label"><span className="label-text">Base Price*</span></label>
            <input type="number" name="base_price" value={formData.base_price} onChange={handleChange} className="input input-bordered w-full" required step="0.01" />
          </div>
          <div>
            <label className="label"><span className="label-text">Stock Quantity*</span></label>
            <input type="number" name="stock_quantity" value={formData.stock_quantity} onChange={handleChange} className="input input-bordered w-full" required />
          </div>
        </div>

        <div>
          <label className="label"><span className="label-text">Condition*</span></label>
          <select name="condition" value={formData.condition} onChange={handleChange} className="select select-bordered w-full" required>
            <option>New Flower</option>
            <option>Old Flower</option>
            <option>Low Stock</option>
          </select>
        </div>

        <div>
          <label className="label"><span className="label-text">Image URL</span></label>
          <input type="text" name="image_url" value={formData.image_url} onChange={handleChange} className="input input-bordered w-full" />
        </div>

        <div className="card-actions justify-end">
          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? <span className="loading loading-spinner"></span> : 'Submit'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ProductForm;