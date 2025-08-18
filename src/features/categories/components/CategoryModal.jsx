import { useState, useEffect } from 'react';

const CategoryModal = ({ isOpen, onClose, onSubmit, isLoading, categoryToEdit }) => {
  const isEditMode = !!categoryToEdit;
  const [formData, setFormData] = useState({ name: '', description: '', category_type: 'Flower Type' });

  useEffect(() => {
    if (isOpen) setFormData(isEditMode ? categoryToEdit : { name: '', description: '', category_type: 'Flower Type' });
  }, [isOpen, categoryToEdit, isEditMode]);

  const handleChange = e => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleSubmit = e => { e.preventDefault(); onSubmit(formData); };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">{isEditMode ? 'Edit Category' : 'Add New Category'}</h3>
        <form onSubmit={handleSubmit} className="py-4 space-y-4">
          <input name="name" value={formData.name} onChange={handleChange} placeholder="Category Name" className="input input-bordered w-full" required />
          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="textarea textarea-bordered w-full"></textarea>
          <select name="category_type" value={formData.category_type} onChange={handleChange} className="select select-bordered w-full">
            <option>Flower Type</option>
            <option>Occasion</option>
          </select>
          <div className="modal-action">
            <button type="button" className="btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>{isEditMode ? 'Update' : 'Add'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;
