import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, addCategory, updateCategory, deleteCategory } from '../../features/categories/categoriesSlice';
import CategoryTable from '../../features/categories/components/CategoryTable';
import CategoryModal from '../../features/categories/components/CategoryModal';

const ManageCategoriesPage = () => {
  const dispatch = useDispatch();
  const { flower_types, occasions, loading, error } = useSelector((state) => state.categories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);

  useEffect(() => { dispatch(fetchCategories()); }, [dispatch]);

  const handleOpenModal = (category = null) => {
    setCategoryToEdit(category);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleSubmit = (data) => {
    if (categoryToEdit) {
      dispatch(updateCategory({ id: categoryToEdit.category_id, data }));
    } else {
      dispatch(addCategory(data));
    }
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      dispatch(deleteCategory(id));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold ml-4">Manage Categories</h1>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>Add New Category</button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-error">{error}</p>}

      {!loading && (
        <div className="space-y-8">
          {/* Flower Types Table */}
          <div className="card bg-base-100 shadow-xl p-6">
            <h2 className="text-xl font-bold mb-4">Flower Types</h2>
            <CategoryTable categories={flower_types} onEdit={handleOpenModal} onDelete={handleDelete} />
          </div>

          {/* Occasions Table */}
          <div className="card bg-base-100 shadow-xl p-6">
            <h2 className="text-xl font-bold mb-4">Occasions</h2>
            <CategoryTable categories={occasions} onEdit={handleOpenModal} onDelete={handleDelete} />
          </div>
        </div>
      )}

      <CategoryModal isOpen={isModalOpen} onClose={handleCloseModal} onSubmit={handleSubmit} isLoading={loading} categoryToEdit={categoryToEdit} />
    </div>
  );
};

export default ManageCategoriesPage;
